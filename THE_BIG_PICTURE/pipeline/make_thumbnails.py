"""Stage: thumbnails.

Pulls two hero frames from licensed, conformed footage (storyboard meta.thumbnail.left / right = "ASSET@seconds")
into remotion/public/thumbs/, then renders the three thumbnail concepts (Remotion stills Thumb1..3)
to 10_THUMBNAIL/thumbnail_concept_{1,2,3}.png at 1280x720 (YouTube's recommended size).
"""
from __future__ import annotations

import shutil
import subprocess
import sys

from common import PROJECT, PUBLIC, REMOTION, ffmpeg, load_storyboard, log, run


def main() -> int:
    sb = load_storyboard()
    th = sb["meta"].get("thumbnail", {})
    (PUBLIC / "thumbs").mkdir(parents=True, exist_ok=True)
    for side in ("left", "right"):
        spec = th.get(side)
        if not spec:
            log(f"storyboard meta.thumbnail.{side} not set (e.g. \"F012@3.5\")", "error")
            return 2
        aid, _, t = spec.partition("@")
        src = PUBLIC / "footage" / f"{aid}.mp4"
        if t == "still":
            src = PUBLIC / "stills" / f"{aid}.jpg"
            if src.exists():
                run([ffmpeg(), "-y", "-v", "error", "-i", str(src), "-q:v", "2", str(PUBLIC / "thumbs" / f"{side}.jpg")])
                continue
        if not src.exists():
            log(f"thumbnail source {src} missing", "error")
            return 2
        run([ffmpeg(), "-y", "-v", "error", "-ss", t or "1", "-i", str(src), "-frames:v", "1", "-q:v", "2", str(PUBLIC / "thumbs" / f"{side}.jpg")])
    out = PROJECT / "10_THUMBNAIL"
    out.mkdir(exist_ok=True)
    npx = shutil.which("npx") or shutil.which("npx.cmd")
    for i in (1, 2, 3):
        rc = subprocess.call([npx, "remotion", "still", "src/index.ts", f"Thumb{i}", str(out / f"thumbnail_concept_{i}.png"), "--log", "error"], cwd=REMOTION)
        if rc:
            return rc
    log("Thumbnails written to 10_THUMBNAIL/", "ok")
    return 0


if __name__ == "__main__":
    sys.exit(main())
