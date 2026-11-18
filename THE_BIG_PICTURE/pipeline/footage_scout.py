#!/usr/bin/env python3
"""footage_scout.py - licence-aware stock footage / audio scout for THE BIG PICTURE.

Searches (politely, <=1 request/sec per host):
  * Mixkit video search pages  -> item pages (licence: Free vs Restricted, best resolution)
  * Wikimedia Commons           -> video files (webm/ogv/mp4) + high-res photos (secondary)
  * NASA Image & Video Library  -> videos (public domain, NASA credit)
  * Mixkit music + sound effects (optional, --audio)

Writes catalogue CSVs; does NOT download media (only HEAD requests and ffprobe
header probes of the best-quality URL).

Usage:
  /home/user/venv/bin/python pipeline/footage_scout.py \
      --config pipeline/footage_queries.json \
      --out 04_FOOTAGE/footage_catalogue.csv \
      --audio-out 06_AUDIO/audio_catalogue.csv

Config format: see pipeline/footage_queries.json. Optional config keys:
  "drop_ids": ["mixkit:12345", "commons:File:Foo.webm", ...]  manual rejects
  "drop_title_regex": {"category": "regex", ...}             per-category rejects
  "audio_drop_ids": ["music:614", "sfx:1489"]
"""
import argparse
import csv
import html
import json
import os
import re
import subprocess
import sys
import tempfile
import time
from urllib.parse import urlparse, quote

import requests

UA_API = "TheBigPictureFootageScout/1.0 (documentary research; contact via project repo)"
COMMONS_API = "https://commons.wikimedia.org/w/api.php"
NASA_API = "https://images-api.nasa.gov"
MIXKIT = "https://mixkit.co"

CGI_TITLE = re.compile(
    r"\b(animation|animated|3d|render(ed|ing)?|abstract|particles?|hologram|holographic|futuristic|"
    r"loop|graphics?|interface|hud|digital|neon|glitch|virtual|illustration|cartoon|"
    r"seamless|plexus|binary|matrix|visuali[sz]ation|cgi|simulation)\b", re.I)
CGI_DESC = re.compile(r"\b(animation|animated|3d|render(ed|ing)?|cgi|computer[- ]generated|visuali[sz]ation|"
                      r"simulation|illustration)\b", re.I)


def looks_cgi(title, desc=""):
    return bool(CGI_TITLE.search(title or "") or CGI_DESC.search(desc or ""))


def clean_url(u):
    return re.sub(r"\?utm_source=.*$", "", u or "")

FOOTAGE_COLS = ["cand_id", "category", "query", "source", "title", "page_url", "download_url",
                "width", "height", "duration_s", "licence", "licence_ok", "attribution", "notes"]
AUDIO_COLS = ["cand_id", "kind", "title", "page_url", "download_url", "duration_s", "licence",
              "licence_ok", "mood_tags", "notes"]


# ----------------------------------------------------------------------------- http
class Http:
    def __init__(self, min_interval=1.0, cache_path=None, verbose=True):
        self.s = requests.Session()
        self.s.headers["User-Agent"] = UA_API
        self.min_interval = min_interval
        self.last = {}
        self.verbose = verbose
        self.cache_path = cache_path
        self.cache = {}
        if cache_path and os.path.exists(cache_path):
            try:
                with open(cache_path) as f:
                    self.cache = json.load(f)
            except Exception:
                self.cache = {}
        self._dirty = 0

    def _wait(self, url):
        host = urlparse(url).netloc
        dt = time.time() - self.last.get(host, 0)
        if dt < self.min_interval:
            time.sleep(self.min_interval - dt)
        self.last[host] = time.time()

    def _req(self, method, url, **kw):
        for attempt in range(4):
            self._wait(url)
            try:
                r = self.s.request(method, url, timeout=40, **kw)
            except requests.RequestException as e:
                if self.verbose:
                    print(f"   ! {method} {url}: {e}", file=sys.stderr)
                time.sleep(3 * (attempt + 1))
                continue
            if r.status_code == 429 or r.status_code >= 500:
                wait = int(r.headers.get("Retry-After", "0") or 0) or 5 * (attempt + 1)
                if self.verbose:
                    print(f"   ! {r.status_code} on {url}, backing off {wait}s", file=sys.stderr)
                time.sleep(min(wait, 60))
                continue
            return r
        return None

    def get_text(self, url, params=None, use_cache=True):
        key = "GET " + url + ("?" + json.dumps(params, sort_keys=True) if params else "")
        if use_cache and key in self.cache:
            return self.cache[key]
        r = self._req("GET", url, params=params)
        if r is None or r.status_code != 200:
            if self.verbose:
                print(f"   ! GET {url} -> {getattr(r, 'status_code', None)}", file=sys.stderr)
            return None
        txt = r.text
        if use_cache:
            self.cache[key] = txt
            self._dirty += 1
            if self._dirty >= 25:
                self.save()
        return txt

    def get_json(self, url, params=None):
        t = self.get_text(url, params)
        if t is None:
            return None
        try:
            return json.loads(t)
        except ValueError:
            return None

    def head_ok(self, url):
        key = "HEAD " + url
        if key in self.cache:
            return self.cache[key]
        r = self._req("HEAD", url, allow_redirects=True)
        ok = bool(r is not None and r.status_code == 200)
        self.cache[key] = ok
        return ok

    def save(self):
        if self.cache_path:
            tmp = self.cache_path + ".tmp"
            with open(tmp, "w") as f:
                json.dump(self.cache, f)
            os.replace(tmp, self.cache_path)
            self._dirty = 0


def ffprobe(url, cache):
    """Return (width, height, duration) using ffprobe on a remote URL (reads headers only)."""
    key = "PROBE " + url
    if key in cache:
        return tuple(cache[key])
    cmd = ["ffprobe", "-v", "error", "-user_agent", UA_API, "-select_streams", "v:0",
           "-show_entries", "stream=width,height:format=duration", "-of", "json", url]
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    if proxy:
        cmd[1:1] = ["-http_proxy", proxy]
    ca = "/root/.ccr/ca-bundle.crt"
    if os.path.exists(ca):
        cmd[1:1] = ["-ca_file", ca]
    try:
        out = subprocess.run(cmd, capture_output=True, text=True, timeout=60).stdout
        d = json.loads(out or "{}")
        st = (d.get("streams") or [{}])[0]
        res = (st.get("width"), st.get("height"),
               round(float(d.get("format", {}).get("duration", 0) or 0), 2) or None)
    except Exception:
        res = (None, None, None)
    cache[key] = list(res)
    return res


def strip_html(s):
    s = re.sub(r"<[^>]+>", " ", s or "")
    return re.sub(r"\s+", " ", html.unescape(s)).strip()


def iso_dur(s):
    m = re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", s or "")
    if not m:
        return None
    h, mi, se = (int(x or 0) for x in m.groups())
    return h * 3600 + mi * 60 + se


def slug(q):
    return re.sub(r"[^a-z0-9]+", "-", q.lower()).strip("-")


def ld_json_blocks(page):
    out = []
    for m in re.finditer(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', page, re.S):
        try:
            d = json.loads(m.group(1))
        except ValueError:
            continue
        out.extend(d.get("@graph", [d]))
    return out


# ----------------------------------------------------------------------------- Mixkit video
def mixkit_search(http, query, pages=1):
    links = []
    for p in range(1, pages + 1):
        url = f"{MIXKIT}/free-stock-video/discover/{slug(query)}/" + (f"?page={p}" if p > 1 else "")
        t = http.get_text(url)
        if not t:
            break
        found = re.findall(r'href="(/free-stock-video/[a-z0-9-]+-(\d+)/)"', t)
        for path, iid in found:
            u = MIXKIT + path
            if u not in [l[0] for l in links]:
                links.append((u, iid))
        if f"page={p + 1}" not in t:
            break
    return links


def mixkit_item(http, page_url, iid, probe=True):
    t = http.get_text(page_url)
    if not t:
        return None
    vid = None
    for node in ld_json_blocks(t):
        if node.get("@type") == "VideoObject" and node.get("@id", "").startswith(page_url):
            vid = node
    title = (vid or {}).get("name") or strip_html((re.search(r"<title>(.*?)</title>", t) or [None, ""])[1])
    title = re.sub(r"\s*-\s*Free Stock Video.*$", "", title).strip()
    desc = (vid or {}).get("description", "")
    author = (re.search(r"created by ([^\s,]+)", desc) or [None, ""])[1]
    lic_attr = re.findall(r'data-license="(video[A-Za-z]+)"', t)
    notice = (vid or {}).get("copyrightNotice", "")
    if lic_attr == ["videoFree"] and notice in ("Free", "Mixkit Stock Video Free License", ""):
        licence, ok = "Mixkit Stock Video Free License", "yes"
    elif "videoRestricted" in lic_attr or "Restricted" in notice:
        licence, ok = "Mixkit Stock Video Restricted License (personal use only)", "no"
    else:
        licence, ok = f"unknown ({lic_attr} / {notice})", "no"
    # download options: types + resolution labels appear in the same order
    types = re.findall(r'value="/free-stock-video/download/\d+/\?context=[a-z]+&amp;type=([A-Za-z0-9]+)"', t)
    labels = re.findall(r'video-item__download-resolution">\s*(\d+)\s*x\s*(\d+)', t)
    opts = []
    for i, ty in enumerate(types):
        w, h = (int(labels[i][0]), int(labels[i][1])) if i < len(labels) else (0, 0)
        opts.append((w * h, w, h, ty))
    opts.sort(reverse=True)
    dl, w, h, notes = None, None, None, []
    if ok == "yes":
        for _, ow, oh, ty in opts:
            hnum = {"4k": 2160, "2160p": 2160, "1080p": 1080, "720p": 720}.get(ty.lower())
            cand = f"https://assets.mixkit.co/videos/{iid}/{iid}-{hnum}.mp4" if hnum else None
            if cand and http.head_ok(cand):
                dl, w, h = cand, ow, oh
                break
            # fall back to the download confirmation page, which embeds the direct file URL
            dpage = http.get_text(f"{MIXKIT}/free-stock-video/download/{iid}/?context=sidebar&type={ty}")
            m = re.search(r'https://assets\.mixkit\.co/videos/\d+/[^"\']+\.mp4', dpage or "")
            if m and http.head_ok(m.group(0)):
                dl, w, h = m.group(0), ow, oh
                break
    if not dl:
        dl = (vid or {}).get("contentUrl") or f"https://assets.mixkit.co/videos/{iid}/{iid}-720.mp4"
        if ok == "yes":
            notes.append("only preview URL found")
    dur = iso_dur((vid or {}).get("duration"))
    if probe and ok == "yes":
        pw, ph, pd = ffprobe(dl, http.cache)
        if pw:
            w, h = pw, ph
        if pd:
            dur = pd
    if opts:
        notes.append("options: " + "/".join(o[3] for o in opts))
    if looks_cgi(title, desc):
        notes.append("possibly CGI/motion-graphic")
    if w and h and h > w:
        notes.append("VERTICAL 9:16 - not for 16:9 timeline without crop")
    attribution = f"Mixkit (mixkit.co){' / ' + author if author else ''} - attribution not required"
    return dict(source="mixkit", item_key=f"mixkit:{iid}", title=title, page_url=page_url,
                download_url=dl, width=w, height=h, duration_s=dur, licence=licence,
                licence_ok=ok, attribution=attribution, notes="; ".join(notes), desc=desc)


# ----------------------------------------------------------------------------- Commons
FREE_LIC = re.compile(r"^(cc0|public domain|pd\b|pd-|cc by(-sa)? \d(\.\d)?( [a-z-]+)?$|cc by(-sa)?$)", re.I)
JOURNAL = re.compile(r"(pone\.|ncomms|journal\.p|\.s\d{3}\.|-S\d+\.|Supplementary|srep\d|elife|"
                     r"Movie[_ ]S\d|Video[_ ]S\d|\d{4}-\d{4}-\d-\d)", re.I)


def commons_licence(em):
    short = strip_html(em.get("LicenseShortName", {}).get("value", ""))
    lic_url = strip_html(em.get("LicenseUrl", {}).get("value", ""))
    nonfree = em.get("NonFree", {}).get("value", "")
    ok = bool(short) and bool(FREE_LIC.match(short)) and not re.search(r"\b(nc|nd)\b", short, re.I) \
        and str(nonfree).lower() not in ("true", "1")
    return short or "unknown", lic_url, ("yes" if ok else "no")


def commons_search(http, query, kind, limit=20):
    """kind = 'video' or 'photo'."""
    ftype = "video" if kind == "video" else "bitmap"
    params = dict(action="query", format="json", formatversion=2, generator="search",
                  gsrsearch=f"{query} filetype:{ftype}", gsrnamespace=6, gsrlimit=limit,
                  prop="videoinfo|info" if kind == "video" else "imageinfo|info", inprop="url")
    if kind == "video":
        params["viprop"] = "url|size|mime|extmetadata|derivatives"
    else:
        params["iiprop"] = "url|size|mime|extmetadata"
    d = http.get_json(COMMONS_API, params)
    out = []
    for p in ((d or {}).get("query") or {}).get("pages", []):
        info = (p.get("videoinfo") or p.get("imageinfo") or [None])[0]
        if not info:
            continue
        title = p["title"]
        em = info.get("extmetadata", {})
        lic, lic_url, ok = commons_licence(em)
        artist = strip_html(em.get("Artist", {}).get("value", "")) or "unknown author"
        credit = strip_html(em.get("Credit", {}).get("value", ""))
        restr = strip_html(em.get("Restrictions", {}).get("value", ""))
        desc = strip_html(em.get("ImageDescription", {}).get("value", ""))[:300]
        w, h = info.get("width"), info.get("height")
        notes = []
        mime = info.get("mime", "")
        if kind == "video":
            if not (mime.startswith("video/") or mime in ("application/ogg",)):
                continue
            if JOURNAL.search(title):
                continue  # scientific-paper supplementary clips: off-topic
            dl = info.get("url")
            ders = [x for x in info.get("derivatives", []) if "webm" in x.get("type", "")
                    and x.get("height")]
            ders.sort(key=lambda x: x["height"])
            best = [x for x in ders if x["height"] <= 1080]
            if best and (not mime.endswith(("mp4", "webm")) or (h or 0) > 1080):
                b = best[-1]
                notes.append(f"transcode {b['width']}x{b['height']} webm; original {w}x{h} {mime}: {info.get('url')}")
                dl, w, h = b["src"], b["width"], b["height"]
            dur = round(float(info.get("duration") or 0), 2) or None
            if min(w or 0, h or 0) < 720:
                continue  # below HD: unusable for 1080p master
        else:
            if not mime.startswith("image/"):
                continue
            dl, dur = info.get("url"), None
            notes.append("PHOTO (secondary list)")
        if restr:
            notes.append("restrictions: " + restr[:120])
        if credit and len(credit) < 150:
            notes.append("credit: " + credit)
        if looks_cgi(title, desc):
            notes.append("possibly CGI/animation")
        if w and h and h > w:
            notes.append("VERTICAL/portrait")
        dl = clean_url(dl)
        name = re.sub(r"^File:", "", title)
        attribution = f"\"{name}\" by {artist}, {lic}" + (f" ({lic_url})" if lic_url else "") + ", via Wikimedia Commons"
        out.append(dict(source="wikimedia_commons" if kind == "video" else "wikimedia_commons_photo",
                        item_key="commons:" + title, title=name, page_url=p.get("canonicalurl") or
                        f"https://commons.wikimedia.org/wiki/{quote(title.replace(' ', '_'))}",
                        download_url=dl, width=w, height=h, duration_s=dur, licence=lic,
                        licence_ok=ok, attribution=attribution, notes="; ".join(notes), desc=desc))
    return out


# ----------------------------------------------------------------------------- NASA
def nasa_search(http, query, limit=10):
    d = http.get_json(f"{NASA_API}/search", dict(q=query, media_type="video"))
    out = []
    for it in ((d or {}).get("collection") or {}).get("items", [])[:limit]:
        dd = it["data"][0]
        nid = dd["nasa_id"]
        man = http.get_json(f"{NASA_API}/asset/{quote(nid)}")
        hrefs = [x["href"] for x in ((man or {}).get("collection") or {}).get("items", [])]
        mp4 = [h for h in hrefs if h.endswith("~orig.mp4")] or [h for h in hrefs if h.endswith("~large.mp4")] \
            or [h for h in hrefs if h.endswith((".mp4", ".mov"))]
        if not mp4:
            continue
        dl = mp4[0].replace("http://", "https://").replace(" ", "%20")
        meta_url = [h for h in hrefs if h.endswith("metadata.json")]
        w = h = dur = None
        if meta_url:
            m = http.get_json(meta_url[0].replace("http://", "https://").replace(" ", "%20")) or {}
            w = m.get("QuickTime:ImageWidth") or m.get("QuickTime:SourceImageWidth")
            h = m.get("QuickTime:ImageHeight") or m.get("QuickTime:SourceImageHeight")
            ds = str(m.get("QuickTime:Duration", ""))
            mm = re.match(r"(\d+):(\d+):(\d+)", ds)
            if mm:
                dur = int(mm[1]) * 3600 + int(mm[2]) * 60 + int(mm[3])
            else:
                mm = re.match(r"([\d.]+) s", ds)
                dur = float(mm[1]) if mm else None
        desc = dd.get("description", "") or ""
        notes = [f"center={dd.get('center')}", f"date={dd.get('date_created', '')[:10]}"]
        ok = "yes"
        if re.search(r"©|copyright|courtesy of(?! NASA)|used with permission", desc, re.I):
            ok = "no"
            notes.append("third-party material mentioned in description - check rights")
        if looks_cgi(dd.get("title", ""), desc[:400]) or "data visual" in desc.lower():
            notes.append("possibly visualization/CGI")
        notes.append("NASA logo/insignia & implied endorsement not permitted")
        out.append(dict(source="nasa", item_key="nasa:" + nid, title=dd.get("title", nid),
                        page_url=f"https://images.nasa.gov/details/{quote(nid)}", download_url=dl,
                        width=w, height=h, duration_s=dur,
                        licence="NASA media - generally public domain (US Gov work); no endorsement",
                        licence_ok=ok, attribution="Credit: NASA" + (f" / {dd.get('center')}" if dd.get("center") else ""),
                        notes="; ".join(notes), desc=desc[:300]))
    return out


# ----------------------------------------------------------------------------- audio (Mixkit)
GOOD_MUSIC = re.compile(r"(film score|ambient|atmosphere|drone|cinematic|suspense|tension|dark|dramatic|"
                        r"electronica|electronic|minimal|piano|corporate|underscore|orchestral hybrid|"
                        r"epic|mysterious|serious|reflective|inspiring|technology|trailer|sound elements)", re.I)
BAD_MUSIC = re.compile(r"(christmas|holiday|romantic|wedding|happy|funny|kids|children|jazz|country|reggae|"
                       r"latin|hip-hop|rap|funk|folk|bossa|ukulele|summer|love|party|dance|horror|halloween|"
                       r"spooky|scary|retro|8-bit|game)", re.I)


def mixkit_audio_cards(page, kind):
    cards = []
    chunks = page.split('data-test-id="audio-player"')[1:]
    for ch in chunks:
        iid = (re.search(r'data-audio-player-item-id-value="(\d+)"', ch) or [None, None])[1]
        if not iid:
            continue
        title = strip_html((re.search(r'item-grid-card__title">(.*?)</h2>', ch, re.S) or [None, ""])[1])
        author = strip_html((re.search(r'music-preview__author">(.*?)</p>', ch, re.S) or [None, ""])[1])
        tags = [strip_html(x) for x in re.findall(r'class="meta-links__link"[^>]*>(.*?)</a>', ch, re.S)]
        dur = strip_html((re.search(r'data-test-id="duration">(.*?)</div>', ch, re.S) or [None, ""])[1])
        mm = re.match(r"(\d+):(\d+)", dur)
        cards.append(dict(id=iid, title=title, author=re.sub(r"^by\s+", "", author), tags=tags,
                          duration=(int(mm[1]) * 60 + int(mm[2])) if mm else None))
    return cards


def scout_audio(http, cfg, max_music=25, sfx_per_query=3):
    rows, seen = [], set()
    drop = set(cfg.get("audio_drop_ids", []))
    # music
    music = []
    for q in cfg["audio"].get("music", []):
        # music listing paths (e.g. "mood/dark", "tag/cinematic", "film-score"); free-text
        # /discover/ search pages render music results client-side, so prefer listing paths
        url = f"{MIXKIT}/free-stock-music/{q.strip('/')}/" if ("/" in q or "-" in q) \
            else f"{MIXKIT}/free-stock-music/discover/{slug(q)}/"
        t = http.get_text(url)
        if not t:
            continue
        lic_by_id = {}
        for node in ld_json_blocks(t):
            for el in node.get("itemListElement", []) if isinstance(node, dict) else []:
                if isinstance(el, dict) and el.get("@type") == "MusicRecording":
                    mid = (re.search(r"/music/(\d+)/", el.get("url", "")) or [None, None])[1]
                    if mid:
                        lic_by_id[mid] = el
        for c in mixkit_audio_cards(t, "music"):
            key = "music:" + c["id"]
            if key in seen or key in drop:
                continue
            seen.add(key)
            el = lic_by_id.get(c["id"], {})
            notice = el.get("copyrightNotice", "")
            ok = "yes" if notice == "Mixkit Stock Music Free License" else "no"
            tagtxt = ", ".join(c["tags"] + ([el["genre"]] if el.get("genre") else []))
            score = len(GOOD_MUSIC.findall(tagtxt + " " + q)) - 3 * len(BAD_MUSIC.findall(tagtxt + " " + c["title"]))
            music.append((score, q, c, el, notice or "unknown (not in page JSON-LD)", ok, tagtxt, url))
    music.sort(key=lambda x: -x[0])
    for score, q, c, el, notice, ok, tagtxt, url in [m for m in music if m[0] > 0 and m[5] == "yes"][:max_music]:
        dl = el.get("url") or f"https://assets.mixkit.co/music/{c['id']}/{c['id']}.mp3"
        rows.append(dict(cand_id="", kind="music", title=f"{c['title']} - {c['author']}",
                         page_url=f"{url} (item id {c['id']})",
                         download_url=dl, duration_s=iso_dur(el.get("duration")) or c["duration"],
                         licence=notice, licence_ok=ok, mood_tags=tagtxt,
                         notes=f"query='{q}'; Mixkit music: no TV/radio broadcast, CDs/DVDs, games; no remix into music-only track; Content-ID claims -> team@mixkit.co"))
    # sfx
    for q in cfg["audio"].get("sfx", []):
        url = f"{MIXKIT}/free-sound-effects/discover/{slug(q)}/"
        t = http.get_text(url)
        if not t:
            continue
        page_free = 'data-license="sfxFree"' in t and "videoRestricted" not in t
        n = 0
        for c in mixkit_audio_cards(t, "sfx"):
            key = "sfx:" + c["id"]
            if key in seen or key in drop:
                continue
            if n >= sfx_per_query:
                break
            seen.add(key)
            n += 1
            dl = f"https://assets.mixkit.co/active_storage/sfx/{c['id']}/{c['id']}.wav"
            if not http.head_ok(dl):
                dl = f"https://assets.mixkit.co/active_storage/sfx/{c['id']}/{c['id']}-preview.mp3"
            rows.append(dict(cand_id="", kind="sfx", title=c["title"],
                             page_url=f"{MIXKIT}/free-sound-effects/discover/{slug(q)}/ (item id {c['id']})",
                             download_url=dl, duration_s=c["duration"],
                             licence="Mixkit Sound Effects Free License" if page_free else "unknown",
                             licence_ok="yes" if page_free else "no", mood_tags=", ".join(c["tags"]),
                             notes=f"query='{q}'"))
    return rows


# ----------------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--config", default="pipeline/footage_queries.json")
    ap.add_argument("--out", default="04_FOOTAGE/footage_catalogue.csv")
    ap.add_argument("--audio-out", default=None, help="also scout Mixkit audio and write this CSV")
    ap.add_argument("--cache", default=os.path.join(tempfile.gettempdir(), "footage_scout_cache.json"),
                    help="HTTP/probe cache (raw HTML; can grow to 100s of MB)")
    ap.add_argument("--mixkit-pages", type=int, default=1)
    ap.add_argument("--mixkit-max-per-query", type=int, default=24)
    ap.add_argument("--commons-limit", type=int, default=20)
    ap.add_argument("--nasa-limit", type=int, default=8)
    ap.add_argument("--no-probe", action="store_true", help="skip ffprobe of Mixkit files")
    ap.add_argument("--include-unusable", action="store_true", help="also write licence_ok=no rows")
    ap.add_argument("--only", default=None, help="comma list of sources: mixkit,commons_video,commons_photo,nasa")
    args = ap.parse_args()

    with open(args.config) as f:
        cfg = json.load(f)
    http = Http(cache_path=args.cache)
    only = set(args.only.split(",")) if args.only else None
    drop_ids = set(cfg.get("drop_ids", []))
    drop_re = {k: re.compile(v, re.I) for k, v in cfg.get("drop_title_regex", {}).items()}
    rows, seen = [], set()
    stats = {}

    def add(cat, q, rec):
        if rec is None or rec["item_key"] in seen:
            return
        seen.add(rec["item_key"])
        st = stats.setdefault(cat, {"yes": 0, "no": 0, "dropped": 0})
        if rec["item_key"] in drop_ids or (cat in drop_re and drop_re[cat].search(rec["title"])):
            st["dropped"] += 1
            return
        st[rec["licence_ok"]] += 1
        rec.update(category=cat, query=q)
        rows.append(rec)

    try:
        for cat, srcs in cfg["categories"].items():
            print(f"== {cat}")
            for q in srcs.get("mixkit", []) if not only or "mixkit" in only else []:
                links = mixkit_search(http, q, args.mixkit_pages)[: args.mixkit_max_per_query]
                print(f"  mixkit '{q}': {len(links)} items")
                for u, iid in links:
                    if f"mixkit:{iid}" in seen:
                        continue
                    add(cat, q, mixkit_item(http, u, iid, probe=not args.no_probe))
            for q in srcs.get("commons_video", []) if not only or "commons_video" in only else []:
                res = commons_search(http, q, "video", args.commons_limit)
                print(f"  commons video '{q}': {len(res)}")
                for rec in res:
                    add(cat, q, rec)
            for q in srcs.get("commons_photo", []) if not only or "commons_photo" in only else []:
                res = [r for r in commons_search(http, q, "photo", args.commons_limit)
                       if (r["width"] or 0) >= 2400 and (r["height"] or 0) >= 1350]
                print(f"  commons photo '{q}': {len(res)}")
                for rec in res:
                    add(cat, q, rec)
            for q in srcs.get("nasa", []) if not only or "nasa" in only else []:
                res = nasa_search(http, q, args.nasa_limit)
                print(f"  nasa '{q}': {len(res)}")
                for rec in res:
                    add(cat, q, rec)
            http.save()
    finally:
        http.save()

    out_rows = [r for r in rows if args.include_unusable or r["licence_ok"] == "yes"]
    # order: category, usable first, videos before photos, then by resolution
    src_rank = {"mixkit": 0, "nasa": 1, "wikimedia_commons": 2, "wikimedia_commons_photo": 3}
    out_rows.sort(key=lambda r: (list(cfg["categories"]).index(r["category"]), r["licence_ok"] != "yes",
                                 src_rank.get(r["source"], 9), -((r["width"] or 0) * (r["height"] or 0))))
    prefix = {"semiconductors": "SEM", "data_centres": "DC", "electricity": "EL",
              "global_business": "BIZ", "mood": "MOOD"}
    counters = {}
    for r in out_rows:
        p = prefix.get(r["category"], r["category"][:3].upper())
        counters[p] = counters.get(p, 0) + 1
        r["cand_id"] = f"{p}-{counters[p]:03d}"
    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    with open(args.out, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=FOOTAGE_COLS, extrasaction="ignore")
        w.writeheader()
        w.writerows(out_rows)
    print(f"\nwrote {len(out_rows)} rows -> {args.out}")
    for cat, st in stats.items():
        print(f"  {cat}: licence_ok yes={st['yes']} no={st['no']} dropped={st['dropped']}")

    if args.audio_out:
        arows = scout_audio(http, cfg)
        http.save()
        for i, r in enumerate([r for r in arows if r["kind"] == "music"], 1):
            r["cand_id"] = f"MUS-{i:03d}"
        for i, r in enumerate([r for r in arows if r["kind"] == "sfx"], 1):
            r["cand_id"] = f"SFX-{i:03d}"
        os.makedirs(os.path.dirname(os.path.abspath(args.audio_out)), exist_ok=True)
        with open(args.audio_out, "w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=AUDIO_COLS, extrasaction="ignore")
            w.writeheader()
            w.writerows(arows)
        print(f"wrote {len(arows)} audio rows -> {args.audio_out}")


if __name__ == "__main__":
    main()
