"""Shared paths and helpers for THE BIG PICTURE production pipeline."""
from __future__ import annotations

import csv
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

PIPELINE = Path(__file__).resolve().parent
PROJECT = Path(os.environ.get("TBP_PROJECT", PIPELINE.parent)).resolve()
REMOTION = PIPELINE / "remotion"
PUBLIC = REMOTION / "public"
FPS = 25
W, H = 1920, 1080

_COLORS = {"info": "", "ok": "\033[32m", "warn": "\033[33m", "error": "\033[31m"}


def log(msg: str, level: str = "info") -> None:
    c = _COLORS.get(level, "") if sys.stdout.isatty() else ""
    tag = {"info": "    ", "ok": " OK ", "warn": "WARN", "error": "FAIL"}[level]
    print(f"{c}[{tag}] {msg}\033[0m" if c else f"[{tag}] {msg}", flush=True)


def load_storyboard() -> dict:
    p = PROJECT / "03_STORYBOARD" / "storyboard.json"
    if not p.exists():
        log(f"Storyboard not found: {p}", "error")
        sys.exit(2)
    return json.loads(p.read_text(encoding="utf-8"))


def load_manifest() -> dict[str, dict]:
    p = PROJECT / "04_FOOTAGE" / "asset_manifest.csv"
    if not p.exists():
        return {}
    with p.open(newline="", encoding="utf-8") as f:
        return {r["asset_id"]: r for r in csv.DictReader(f)}


def ffmpeg() -> str:
    exe = shutil.which("ffmpeg")
    if not exe:
        log("FFmpeg not found on PATH. Install it (README: Windows setup) and retry.", "error")
        sys.exit(2)
    return exe


def run(cmd: list[str], **kw) -> subprocess.CompletedProcess:
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        log("Command failed: " + " ".join(cmd[:6]) + " …", "error")
        sys.stderr.write(r.stderr[-3000:])
        raise SystemExit(r.returncode)
    return r


def probe(path: Path) -> dict:
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-print_format", "json", "-show_streams", "-show_format", str(path)],
        capture_output=True, text=True,
    )
    return json.loads(r.stdout) if r.returncode == 0 else {}
