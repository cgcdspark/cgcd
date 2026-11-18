"""Renders a review frame of every original graphic in the timeline to 07_GRAPHICS/ (PNG, 1920x1080)."""
import json, shutil, subprocess, sys
from common import PROJECT, PUBLIC, REMOTION, log

def main():
    tl = json.loads((PUBLIC / "timeline.json").read_text())
    out = PROJECT / "07_GRAPHICS"; out.mkdir(exist_ok=True)
    npx = shutil.which("npx") or shutil.which("npx.cmd")
    items = [(s["id"], s["component"], s["from"] + int(s["dur"] * 0.75)) for s in tl["shots"] if s["type"] == "graphic" and s["props"].get("kicker") != "MISSING FOOTAGE"]
    items += [(o["id"], o["component"], o["from"] + int(o["dur"] * 0.5)) for o in tl["overlays"] if o["component"] in ("TitleCard", "ChapterCard", "LowerThird", "CornerStat")][:6]
    for sid, comp, frame in items:
        dest = out / f"{sid}_{comp}.png"
        rc = subprocess.call([npx, "remotion", "still", "src/index.ts", "Documentary", str(dest), f"--frame={frame}", "--log=error"], cwd=REMOTION)
        log(f"{dest.name}", "ok" if rc == 0 else "error")
main()
