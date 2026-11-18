"""MASTER RENDER — one command from storyboard to finished MP4.

  python render.py              full run: voice → footage → timeline → picture → mix → mux → thumbnails → QC
  python render.py --from mix   resume from a step (voice|footage|timeline|picture|mix|mux|thumbs|qc)
  python render.py --preview    fast half-resolution draft (missing footage shown as slates)

Each step is its own script and can also be run alone. Works on Windows (PowerShell) and Linux/macOS.
"""
from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import time

from common import PIPELINE, PROJECT, REMOTION, ffmpeg, load_storyboard, log

STEPS = ["voice", "footage", "timeline", "picture", "mix", "mux", "thumbs", "qc"]
try:
    _SLUG = load_storyboard()["meta"].get("slug", "THE_BIG_PICTURE_EP01_The_Hidden_Winners_of_the_AI_Boom")
except SystemExit:
    _SLUG = "THE_BIG_PICTURE_EP01_The_Hidden_Winners_of_the_AI_Boom"
FINAL = PROJECT / "11_FINAL_DELIVERY" / f"{_SLUG}.mp4"
PICTURE = PROJECT / "09_RENDER" / "picture.mp4"


def py(script: str, *a: str) -> int:
    return subprocess.call([sys.executable, str(PIPELINE / script), *a])


def npx() -> str:
    exe = shutil.which("npx") or shutil.which("npx.cmd")
    if not exe:
        log("Node.js/npx not found. Install Node.js 20+ (README).", "error")
        sys.exit(2)
    return exe


def preflight() -> None:
    ok = True
    for tool in ("ffmpeg", "ffprobe"):
        if not shutil.which(tool):
            log(f"{tool} not found on PATH", "error")
            ok = False
    if not (REMOTION / "node_modules").exists():
        log("Remotion dependencies missing: run `npm install` in pipeline/remotion", "error")
        ok = False
    fonts = REMOTION / "node_modules" / "@fontsource"
    for f in ("inter-tight", "inter", "ibm-plex-mono"):
        if not (fonts / f).exists():
            log(f"Font package @fontsource/{f} missing (npm install)", "error")
            ok = False
    if not ok:
        sys.exit(2)
    log("Preflight OK: ffmpeg, Remotion, fonts", "ok")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--from", dest="start", choices=STEPS, default="voice")
    ap.add_argument("--to", dest="end", choices=STEPS, default="qc")
    ap.add_argument("--preview", action="store_true")
    a = ap.parse_args()
    preflight()
    steps = STEPS[STEPS.index(a.start): STEPS.index(a.end) + 1]
    t0 = time.time()
    for s in steps:
        log(f"=== {s.upper()} ===")
        if s == "voice":
            rc = py("tts.py")
        elif s == "footage":
            rc = py("prep_footage.py")
            if rc and not a.preview:
                log("Footage step reported problems (see above).", "error")
                return rc
        elif s == "timeline":
            rc = py("build_timeline.py", *(["--allow-missing"] if a.preview else []))
        elif s == "picture":
            PICTURE.parent.mkdir(exist_ok=True)
            env = dict(os.environ)
            cmd = [npx(), "remotion", "render", "src/index.ts", "Documentary", str(PICTURE), "--codec", "h264", "--crf", "16",
                   "--x264-preset", "medium", "--muted", "--log", "info"]
            if a.preview:
                cmd += ["--scale", "0.5", "--crf", "24"]
            rc = subprocess.call(cmd, cwd=REMOTION, env=env)
        elif s == "mix":
            rc = py("mix_audio.py")
        elif s == "mux":
            FINAL.parent.mkdir(exist_ok=True)
            rc = subprocess.call([ffmpeg(), "-y", "-v", "error", "-i", str(PICTURE), "-i", str(PROJECT / "06_AUDIO" / "final_mix.wav"),
                                  "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy", "-c:a", "aac", "-b:a", "320k", "-ar", "48000",
                                  "-shortest", "-movflags", "+faststart", str(FINAL)])
            if rc == 0:
                log(f"Final: {FINAL}", "ok")
        elif s == "thumbs":
            rc = py("make_thumbnails.py")
        elif s == "qc":
            rc = py("qc.py", str(FINAL))
        if rc:
            log(f"Step '{s}' failed (exit {rc}). Fix the issue above and resume with: python render.py --from {s}", "error")
            return rc
    log(f"All steps done in {(time.time()-t0)/60:.1f} min", "ok")
    return 0


if __name__ == "__main__":
    sys.exit(main())
