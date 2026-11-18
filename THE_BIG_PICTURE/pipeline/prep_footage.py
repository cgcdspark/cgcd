"""Stage: footage download + conform.

For every APPROVED row in 04_FOOTAGE/asset_manifest.csv:
  1. download the source file once into 04_FOOTAGE/raw/ (or 05_IMAGES/raw/ for stills) — skipped if present
  2. conform: 1920x1080, 25 fps, H.264, the house grade, trimmed to in_s..out_s
     → remotion/public/footage/<asset_id>.mp4   (stills → remotion/public/stills/<asset_id>.jpg)

Assets that need a manual download (login, bot protection) are reported, never bypassed:
put the file in 04_FOOTAGE/raw/<asset_id>.<ext> yourself and re-run.

House grade (one look for every source): slightly lifted contrast, restrained saturation,
cool shadows / warm highlights, gentle sharpening for 720p sources.
"""
from __future__ import annotations

import argparse
import concurrent.futures as cf
import csv
import sys
import time
import urllib.request
from pathlib import Path

from common import PROJECT, PUBLIC, ffmpeg, load_manifest, log, probe, run

UA = "TheBigPictureProduction/1.0 (documentary production pipeline)"
GRADE = ("eq=contrast=1.07:saturation=0.82:gamma=0.98,"
         "colorbalance=rs=-0.03:gs=-0.005:bs=0.045:rh=0.035:gh=0.01:bh=-0.03,"
         "unsharp=5:5:0.35")


def download(url: str, dest: Path) -> bool:
    if dest.exists() and dest.stat().st_size > 10_000:
        return True
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix(dest.suffix + ".part")
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=120) as r, open(tmp, "wb") as f:
                while chunk := r.read(1 << 20):
                    f.write(chunk)
            tmp.rename(dest)
            return True
        except Exception as e:  # network hiccup: back off and retry
            log(f"download retry {attempt+1} for {dest.name}: {e}", "warn")
            time.sleep(2 ** attempt)
    return False


def conform(row: dict, raw: Path, force: bool) -> str:
    aid = row["asset_id"]
    is_img = row.get("type") == "image"
    out = PUBLIC / ("stills" if is_img else "footage") / f"{aid}.{'jpg' if is_img else 'mp4'}"
    out.parent.mkdir(parents=True, exist_ok=True)
    if out.exists() and not force:
        return f"{aid}: up to date"
    info = probe(raw)
    vs = [s for s in info.get("streams", []) if s.get("codec_type") == "video"]
    if not vs:
        return f"{aid}: FAIL not a readable video/image ({raw.name})"
    w, h = int(vs[0].get("width", 0)), int(vs[0].get("height", 0))
    note = "" if min(w, h) >= 1080 or is_img else f" (upscaled from {w}x{h})"
    vf = f"scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1920:1080,{GRADE}"
    c = float(row.get("crop") or 0)
    if 0 < c < 1:  # centre crop (e.g. to remove a burned-in logo) before scaling
        vf = f"crop=iw*{c}:ih*{c}," + vf
    if is_img:
        run([ffmpeg(), "-y", "-v", "error", "-i", str(raw), "-vf", vf.replace(",unsharp=5:5:0.35", ""), "-q:v", "2", str(out)])
        return f"{aid}: still OK {w}x{h}"
    a = float(row.get("in_s") or 0)
    b = float(row.get("out_s") or 0)
    cmd = [ffmpeg(), "-y", "-v", "error"]
    if a > 0:
        cmd += ["-ss", f"{a:.3f}"]
    cmd += ["-i", str(raw)]
    if b > a:
        cmd += ["-t", f"{b - a:.3f}"]
    cmd += ["-vf", vf + ",fps=25,format=yuv420p", "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "17",
            "-g", "25", "-movflags", "+faststart", str(out)]
    run(cmd)
    return f"{aid}: video OK {w}x{h}{note}"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="re-conform even if output exists")
    ap.add_argument("--only", nargs="*", help="asset ids")
    args = ap.parse_args()
    man = load_manifest()
    if not man:
        log("04_FOOTAGE/asset_manifest.csv not found or empty.", "error")
        return 2
    rows = [r for r in man.values() if r.get("status") in ("approved", "downloaded", "conformed")]
    if args.only:
        rows = [r for r in rows if r["asset_id"] in args.only]
    manual, failed = [], []
    jobs = []
    for r in rows:
        ext = Path(r["download_url"].split("?")[0]).suffix or (".jpg" if r.get("type") == "image" else ".mp4")
        raw = PROJECT / ("05_IMAGES" if r.get("type") == "image" else "04_FOOTAGE") / "raw" / f"{r['asset_id']}{ext.lower()}"
        r["_raw"] = raw
        if r.get("download") == "manual" and not raw.exists():
            manual.append(r)
            continue
        jobs.append(r)
    with cf.ThreadPoolExecutor(6) as ex:
        ok = list(ex.map(lambda r: download(r["download_url"], r["_raw"]), jobs))
    for r, good in zip(jobs, ok):
        if not good:
            failed.append(r)
    ready = [r for r, good in zip(jobs, ok) if good]
    with cf.ThreadPoolExecutor(3) as ex:
        for msg in ex.map(lambda r: conform(r, r["_raw"], args.force), ready):
            log(msg, "error" if "FAIL" in msg else "info")
    for r in manual:
        log(f"MANUAL DOWNLOAD needed: {r['asset_id']} — {r.get('source_url')} → save as {r['_raw']}", "warn")
    for r in failed:
        log(f"Download failed: {r['asset_id']} {r['download_url']}", "error")
    log(f"{len(ready)} assets ready, {len(manual)} manual, {len(failed)} failed", "ok" if not failed else "warn")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
