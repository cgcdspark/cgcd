"""Stage: shorts / reels.

For every storyboard scene with a "short" field, cuts that scene from the finished master, then renders a
1080x1920 vertical version (Remotion composition "Short"): hook headline, the 16:9 picture over a blurred copy,
word-by-word burned-in captions timed to the narration, and a closing card. Output: <project>/12_SHORTS/.
Hooks come from storyboard meta.short_hooks {scene_id: "Line one|line *accent*"}; default = the short title.
"""
from __future__ import annotations

import json
import shutil
import subprocess
import sys

from common import PROJECT, PUBLIC, REMOTION, ffmpeg, load_storyboard, log, run

FPS = 25
TAIL = 1.6  # seconds of held last frame for the closing card


def main() -> int:
    sb = load_storyboard()
    slug = sb["meta"].get("slug", "episode")
    master = PROJECT / "11_FINAL_DELIVERY" / f"{slug}.mp4"
    if not master.exists():
        log(f"master not found: {master}", "error")
        return 2
    tm = json.loads((PROJECT / "06_AUDIO" / "vo_timing.json").read_text())
    scenes_t = {s["id"]: s for s in tm["scenes"]}
    hooks = sb["meta"].get("short_hooks", {})
    seg_dir = PUBLIC / "shorts"
    seg_dir.mkdir(parents=True, exist_ok=True)
    out_dir = PROJECT / "12_SHORTS"
    out_dir.mkdir(exist_ok=True)
    npx = shutil.which("npx") or shutil.which("npx.cmd")
    n = 0
    for sc in sb["scenes"]:
        if not sc.get("short"):
            continue
        n += 1
        st = scenes_t[sc["id"]]
        a, b = st["start"], st["end"]
        seg = seg_dir / f"{sc['id']}.mp4"
        run([ffmpeg(), "-y", "-v", "error", "-ss", f"{a:.3f}", "-i", str(master), "-t", f"{b - a:.3f}",
             "-vf", f"tpad=stop_mode=clone:stop_duration={TAIL}", "-af", f"apad=pad_dur={TAIL},afade=t=out:st={b - a:.3f}:d={TAIL}",
             "-c:v", "libx264", "-preset", "fast", "-crf", "17", "-c:a", "aac", "-b:a", "256k", str(seg)])
        words = []
        for ln in (l for l in tm["lines"] if l["scene"] == sc["id"]):
            ws = ln["text"].split()
            total = sum(len(w) + 1 for w in ws)
            t, span = ln["start"] - a, ln["end"] - ln["start"]
            for w in ws:
                words.append({"t": round(t, 3), "w": w})
                t += span * (len(w) + 1) / total
        dur = int(round((b - a + TAIL) * FPS))
        props = {"src": f"shorts/{sc['id']}.mp4", "hook": hooks.get(sc["id"], sc["short"]), "words": words, "durationInFrames": dur}
        pf = seg_dir / f"{sc['id']}.json"
        pf.write_text(json.dumps(props, ensure_ascii=False))
        safe = "".join(c if c.isalnum() else "_" for c in sc["short"]).strip("_")[:60]
        out = out_dir / f"SHORT_{n:02d}_{safe}.mp4"
        rc = subprocess.call([npx, "remotion", "render", "src/index.ts", "Short", str(out), f"--props={pf}", "--codec", "h264", "--crf", "19", "--log", "error"], cwd=REMOTION)
        if rc:
            log(f"short {sc['id']} failed", "error")
            return rc
        log(f"{out.name}  ({(b - a):.0f}s)", "ok")
    log(f"{n} shorts written to {out_dir}", "ok")
    return 0


if __name__ == "__main__":
    sys.exit(main())
