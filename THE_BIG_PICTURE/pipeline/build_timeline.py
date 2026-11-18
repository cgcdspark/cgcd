"""Stage: timeline.

Combines the storyboard (shots, graphics, overlays), the voiceover timing and the asset manifest into
remotion/public/timeline.json, plus the SRT subtitles and a resolved shot list.

Validation (fails loudly instead of silently substituting footage):
  * shots with no asset assigned, or an asset not in the manifest / not approved
  * conformed clip missing, or shorter than the shot it must fill
  * unknown graphic/overlay components
  * vo lines referenced by anchors that do not exist
Run with --allow-missing to build anyway (missing shots render as an explicit red MISSING slate) for previews.
"""
from __future__ import annotations

import argparse
import csv
import json
import re
import sys

from common import FPS, H, PROJECT, PUBLIC, W, load_manifest, load_storyboard, log, probe

COMPONENTS = {"ValueChain", "Flow", "BarChart", "ColumnChart", "BigStat", "RangeBars", "Matrix", "Quote", "TitleCard", "EndCard",
              "LowerThird", "ChapterCard", "CornerStat", "Bug"}
XFADE_SCENE = 8  # frames of dissolve at scene boundaries


def fr(t: float) -> int:
    return int(round(t * FPS))


def srt_time(t: float) -> str:
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


def chunk_caption(text: str, max_chars: int = 84) -> list[str]:
    """Split a narration line into balanced caption cards (<= max_chars), preferring breaks after punctuation."""
    import math
    words = text.split()
    n = max(1, math.ceil(len(text) / max_chars))
    if n == 1:
        return [text]
    target = len(text) / n
    best, best_cost = None, 1e9
    for i in range(1, len(words)):
        left, right = " ".join(words[:i]), " ".join(words[i:])
        if len(left) > max_chars or len(right) > max_chars * (n - 1):
            continue
        cost = abs(len(left) - target) - (24 if left[-1] in ".,;:?!" else 0)
        if cost < best_cost:
            best, best_cost = i, cost
    if best is None:
        best = max(1, len(words) // n)
    return [" ".join(words[:best])] + chunk_caption(" ".join(words[best:]), max_chars)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--allow-missing", action="store_true")
    args = ap.parse_args()

    sb = load_storyboard()
    tp = PROJECT / "06_AUDIO" / "vo_timing.json"
    if not tp.exists():
        log("vo_timing.json missing: run tts.py first.", "error")
        return 2
    timing = json.loads(tp.read_text())
    lines = {l["id"]: l for l in timing["lines"]}
    scenes_t = {s["id"]: s for s in timing["scenes"]}
    manifest = load_manifest()

    errors: list[str] = []
    warns: list[str] = []
    shots_out, overlays_out, resolved = [], [], []
    clip_cache: dict[str, float] = {}

    def clip_len(path) -> float:
        if str(path) not in clip_cache:
            info = probe(path)
            clip_cache[str(path)] = float(info.get("format", {}).get("duration", 0) or 0)
        return clip_cache[str(path)]

    def anchor(sc: dict, item: dict) -> float | None:
        if "at" in item:
            if item["at"] not in lines:
                errors.append(f"{sc['id']}: anchor line {item['at']} not found")
                return None
            return lines[item["at"]]["start"] + float(item.get("offset", 0.0))
        if "at_scene_start" in item:
            return scenes_t[sc["id"]]["start"] + float(item["at_scene_start"])
        return None

    for si, sc in enumerate(sb["scenes"]):
        st = scenes_t.get(sc["id"])
        if not st:
            errors.append(f"{sc['id']}: no timing (re-run tts.py)")
            continue
        s0, s1 = st["start"], st["end"]
        shots = sc.get("shots", [])
        # 1) fixed anchor times
        starts: list[float | None] = []
        for k, sh in enumerate(shots):
            a = anchor(sc, sh)
            starts.append(s0 if k == 0 else a)
        # 2) fill un-anchored shots by weight between anchors
        k = 0
        while k < len(shots):
            if starts[k] is None:
                j = k
                while j < len(shots) and starts[j] is None:
                    j += 1
                left = starts[k - 1]
                right = starts[j] if j < len(shots) else s1
                # the previous anchored shot shares the span with the run k..j-1
                ws = [float(shots[x].get("w", 1)) for x in range(k - 1, j)]
                tot = sum(ws)
                t = left
                for idx, x in enumerate(range(k - 1, j)):
                    if idx > 0:
                        starts[x] = t
                    t += (right - left) * ws[idx] / tot
                k = j
            k += 1
        for k, sh in enumerate(shots):
            a = max(s0, min(s1, starts[k]))
            b = s1 if k == len(shots) - 1 else max(a, min(s1, starts[k + 1]))
            f0, f1 = fr(a), fr(b)
            if f1 - f0 < 12:
                warns.append(f"{sc['id']} shot {k+1}: only {f1-f0} frames long")
            if f1 <= f0:
                continue
            sid = f"{sc['id']}_{k+1:02}"
            xf = XFADE_SCENE if (k == 0 and si > 0) else int(sh.get("xfade", 0))
            if sh.get("graphic"):
                if sh["graphic"] not in COMPONENTS:
                    errors.append(f"{sid}: unknown graphic {sh['graphic']}")
                shot = {"id": sid, "type": "graphic", "from": f0 - (xf if xf else 0), "dur": f1 - f0 + (xf if xf else 0),
                        "component": sh["graphic"], "props": sh.get("props", {}), "xfade": xf}
                if sh.get("bg"):
                    shot["bg"] = f"footage/{sh['bg']}.mp4"
                shots_out.append(shot)
                resolved.append([sid, sc["act"], f"{a:.2f}", f"{b:.2f}", "graphic", sh["graphic"], sh.get("props", {}).get("title", "")])
                continue
            aid = sh.get("asset")
            row = manifest.get(aid or "")
            if not aid or not row:
                msg = f"{sid}: no approved asset for '{sh.get('need', '?')}'"
                (warns if args.allow_missing else errors).append(msg)
                shots_out.append({"id": sid, "type": "graphic", "from": f0, "dur": f1 - f0, "component": "Quote",
                                  "props": {"kicker": "MISSING FOOTAGE", "quote": sh.get("need", "?"), "who": sid, "role": "placeholder — not for delivery"}})
                resolved.append([sid, sc["act"], f"{a:.2f}", f"{b:.2f}", "MISSING", "", sh.get("need", "")])
                continue
            kind = "still" if row.get("type", "video") == "image" else "footage"
            rel = f"{'stills' if kind == 'still' else 'footage'}/{aid}.{'jpg' if kind == 'still' else 'mp4'}"
            path = PUBLIC / rel
            need_s = (f1 - f0 + xf) / FPS
            start_s = float(sh.get("in", row.get("in_s") or 0) or 0)
            if not path.exists():
                (warns if args.allow_missing else errors).append(f"{sid}: conformed file missing {rel} (run prep_footage.py)")
            elif kind == "footage":
                L = clip_len(path)
                if L < need_s + 0.05:
                    errors.append(f"{sid}: clip {aid} is {L:.1f}s but shot needs {need_s:.1f}s")
                elif start_s + need_s > L:
                    start_s = max(0.0, L - need_s - 0.05)
            shots_out.append({"id": sid, "type": kind, "from": f0 - xf, "dur": f1 - f0 + xf, "src": rel,
                              "startFrom": fr(start_s), "motion": sh.get("motion", "push" if kind == "still" else "none"),
                              "xfade": xf, "letterbox": bool(sh.get("letterbox")), "dim": float(sh.get("dim", 0))})
            resolved.append([sid, sc["act"], f"{a:.2f}", f"{b:.2f}", kind, aid, row.get("description", "")])

        for oi, ov in enumerate(sc.get("overlays", [])):
            if ov["component"] not in COMPONENTS:
                errors.append(f"{sc['id']}: unknown overlay {ov['component']}")
            a = anchor(sc, ov)
            if a is None:
                a = s0
            overlays_out.append({"id": f"{sc['id']}_ov{oi+1}", "from": max(0, fr(a)), "dur": fr(float(ov.get("dur", 4))),
                                 "component": ov["component"], "props": ov.get("props", {})})

    total = fr(timing["total"])
    # brand bug from end of the title to start of end card
    body = [scenes_t[s]["start"] for s in ("S02", "S14") if s in scenes_t]
    if len(body) == 2:
        overlays_out.append({"id": "bug", "from": fr(body[0]) + 90, "dur": fr(body[1]) - fr(body[0]) - 90, "component": "Bug", "props": {}})

    # captions + SRT
    caps, srt = [], []
    n = 1
    for ln in timing["lines"]:
        cards = chunk_caption(ln["text"])
        L = sum(len(c) for c in cards)
        t = ln["start"]
        for c in cards:
            d = (ln["end"] - ln["start"]) * len(c) / L
            caps.append({"from": fr(t), "dur": max(1, fr(d)), "text": c})
            srt.append(f"{n}\n{srt_time(t)} --> {srt_time(t + d)}\n{c}\n")
            n += 1
            t += d
    (PROJECT / "08_SUBTITLES").mkdir(exist_ok=True)
    (PROJECT / "08_SUBTITLES" / "the_hidden_winners_of_the_ai_boom.en.srt").write_text("\n".join(srt), encoding="utf-8")

    tl = {"fps": FPS, "width": W, "height": H, "durationInFrames": total, "shots": shots_out, "overlays": overlays_out,
          "captions": caps, "showCaptions": bool(sb["meta"].get("show_captions", False))}
    (PUBLIC / "timeline.json").write_text(json.dumps(tl, indent=1, ensure_ascii=False))
    with (PROJECT / "03_STORYBOARD" / "shot_list_resolved.csv").open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["shot_id", "act", "start_s", "end_s", "type", "asset_or_component", "description"])
        w.writerows(resolved)

    for m in warns:
        log(m, "warn")
    for m in errors:
        log(m, "error")
    log(f"Timeline: {total/FPS/60:.2f} min, {len(shots_out)} shots, {len(overlays_out)} overlays, {len(caps)} captions",
        "ok" if not errors else "warn")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
