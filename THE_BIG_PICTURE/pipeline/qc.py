"""Stage: automated quality control of the final MP4.

Checks: container/streams (1920x1080, 25 fps, H.264, AAC 48 kHz), duration vs timeline, black frames,
frozen frames, integrated loudness / true peak, missing-footage placeholders in the timeline,
and writes a contact sheet (one frame every 10 s) for human review.
Report: 09_RENDER/qc_report.md
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

from common import PROJECT, PUBLIC, ffmpeg, log, probe


def main() -> int:
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else PROJECT / "11_FINAL_DELIVERY" / "THE_BIG_PICTURE_EP01_The_Hidden_Winners_of_the_AI_Boom.mp4"
    out_dir = PROJECT / "09_RENDER"
    rep = ["# QC report", "", f"File: `{path.name}`", ""]
    fails = 0

    def check(ok: bool, label: str):
        nonlocal fails
        rep.append(f"- {'PASS' if ok else 'FAIL'} — {label}")
        log(label, "ok" if ok else "error")
        if not ok:
            fails += 1

    if not path.exists():
        log(f"{path} does not exist", "error")
        return 2
    info = probe(path)
    v = next((s for s in info["streams"] if s["codec_type"] == "video"), {})
    a = next((s for s in info["streams"] if s["codec_type"] == "audio"), {})
    dur = float(info["format"]["duration"])
    size_mb = int(info["format"]["size"]) / 1e6
    check(v.get("codec_name") == "h264" and v.get("width") == 1920 and v.get("height") == 1080, f"Video H.264 {v.get('width')}x{v.get('height')}")
    check(v.get("r_frame_rate") in ("25/1",), f"Frame rate {v.get('r_frame_rate')}")
    check(a.get("codec_name") == "aac" and a.get("sample_rate") == "48000", f"Audio {a.get('codec_name')} {a.get('sample_rate')} Hz {a.get('channels')} ch")
    tl = json.loads((PUBLIC / "timeline.json").read_text())
    exp = tl["durationInFrames"] / tl["fps"]
    check(abs(dur - exp) < 0.5, f"Duration {dur/60:.2f} min (timeline {exp/60:.2f} min), {size_mb:.0f} MB")
    missing = [s["id"] for s in tl["shots"] if s.get("props", {}).get("kicker") == "MISSING FOOTAGE"]
    check(not missing, f"No placeholder shots ({len(missing)} found{': ' + ', '.join(missing[:8]) if missing else ''})")

    r = subprocess.run([ffmpeg(), "-v", "info", "-i", str(path), "-vf", "blackdetect=d=0.5:pix_th=0.06,freezedetect=n=0.002:d=4",
                        "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
    err = r.stderr
    blacks = re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", err)
    # fades into/out of the end card are expected; flag anything else
    bad_black = [(float(s), float(e)) for s, e in blacks if float(s) > 2 and float(e) < dur - 3]
    check(not bad_black, f"Unexpected black segments: {bad_black[:5]}")
    freezes = re.findall(r"freeze_start: ([\d.]+)", err)
    rep.append(f"- INFO — static stretches ≥4 s (graphics holds are expected): {len(freezes)} at {', '.join(f'{float(x):.0f}s' for x in freezes[:12])}")
    I = re.findall(r"I:\s+(-?[\d.]+) LUFS", err)
    tp = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", err)
    li = float(I[-1]) if I else 0
    pk = float(tp[-1]) if tp else 0
    check(-15.5 <= li <= -12.5, f"Integrated loudness {li} LUFS (target -14)")
    check(pk <= -0.9, f"True peak {pk} dBTP (limit -1)")

    sheet = out_dir / "contact_sheet.jpg"
    subprocess.run([ffmpeg(), "-y", "-v", "error", "-i", str(path), "-vf", "fps=1/10,scale=384:-1,tile=6x9", "-frames:v", "1", "-q:v", "3", str(sheet)])
    rep += ["", f"Contact sheet: `{sheet.name}` (one frame every 10 s)", ""]
    (out_dir / "qc_report.md").write_text("\n".join(rep), encoding="utf-8")
    log(f"QC: {fails} failure(s). Report: 09_RENDER/qc_report.md", "ok" if not fails else "warn")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
