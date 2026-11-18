"""Stage: voiceover.

Reads the storyboard (single source of truth for narration) and renders every narration line with
Kokoro-82M (Apache-2.0, runs offline on CPU). Writes:
  06_AUDIO/vo/<line_id>.wav      one file per line (24 kHz mono)
  06_AUDIO/vo_timing.json        start/end of every line on the master timeline (seconds)
  06_AUDIO/narration.wav         the full narration track, silences included

Lines are cached by a hash of (text, voice, speed) so editing one sentence only re-renders that sentence.
"""
from __future__ import annotations

import argparse
import os
import hashlib
import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

from common import PIPELINE, PROJECT, load_storyboard, log

SR = 24000


def line_hash(text: str, voice: str, speed: float) -> str:
    return hashlib.sha1(f"{voice}|{speed}|{text}".encode()).hexdigest()[:12]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--models", default=os.environ.get("TBP_MODELS", str(PIPELINE.parent / "_models")), help="folder with kokoro-v1.0.onnx + voices-v1.0.bin")
    ap.add_argument("--external", action="store_true", help="use existing 06_AUDIO/vo/<id>.wav files (e.g. from the Windows System.Speech fallback) and only re-time")
    args = ap.parse_args()

    sb = load_storyboard()
    voice = sb["meta"].get("voice", "af_heart")
    speed = float(sb["meta"].get("speed", 1.0))
    lang = sb["meta"].get("voice_lang", "en-us")

    model = Path(args.models) / "kokoro-v1.0.onnx"
    voices = Path(args.models) / "voices-v1.0.bin"
    if args.external:
        kokoro = None
    elif not model.exists() or not voices.exists():
        log(f"MISSING Kokoro model files in {args.models}. Run setup (see README) to download them.", "error")
        return 2

    else:
        from kokoro_onnx import Kokoro  # imported late so --help works without the package

        kokoro = Kokoro(str(model), str(voices))
    vo_dir = PROJECT / "06_AUDIO" / "vo"
    vo_dir.mkdir(parents=True, exist_ok=True)
    cache_file = vo_dir / "_cache.json"
    cache = json.loads(cache_file.read_text()) if cache_file.exists() else {}

    timing = []
    track: list[np.ndarray] = []
    t = 0.0
    for scene in sb["scenes"]:
        lead = float(scene.get("lead_in", 0.0))
        if lead:
            track.append(np.zeros(int(lead * SR), dtype=np.float32))
            t += lead
        scene_start = t - lead
        for ln in scene.get("vo", []):
            lid = ln["id"]
            say = ln.get("say", ln["text"])
            h = line_hash(say, voice, speed)
            wav = vo_dir / f"{lid}.wav"
            if kokoro is not None and (cache.get(lid) != h or not wav.exists()):
                audio, sr = kokoro.create(say, voice=voice, speed=speed, lang=lang)
                assert sr == SR, sr
                # trim leading/trailing near-silence so pauses are controlled by the storyboard
                idx = np.where(np.abs(audio) > 0.01)[0]
                if len(idx):
                    audio = audio[max(0, idx[0] - int(0.03 * SR)): idx[-1] + int(0.08 * SR)]
                sf.write(wav, audio, SR)
                cache[lid] = h
                log(f"TTS {lid}: {len(audio)/SR:.2f}s  {say[:70]}")
            if not wav.exists():
                log(f"missing voice file {wav}", "error")
                return 2
            audio, sr0 = sf.read(wav, dtype="float32")
            if audio.ndim > 1:
                audio = audio.mean(axis=1)
            if sr0 != SR:  # external voices may use another sample rate
                audio = np.interp(np.linspace(0, len(audio) - 1, int(len(audio) * SR / sr0)), np.arange(len(audio)), audio).astype(np.float32)
            dur = len(audio) / SR
            timing.append({"id": lid, "scene": scene["id"], "start": round(t, 3), "end": round(t + dur, 3), "text": ln["text"]})
            track.append(audio)
            t += dur
            pause = float(ln.get("pause", 0.32))
            track.append(np.zeros(int(pause * SR), dtype=np.float32))
            t += pause
        hold = float(scene.get("hold", 0.0))
        if hold and not scene.get("vo"):
            track.append(np.zeros(int(hold * SR), dtype=np.float32))
            t += hold
        tail = float(scene.get("tail", 0.0))
        if tail:
            track.append(np.zeros(int(tail * SR), dtype=np.float32))
            t += tail
        scene["_start"], scene["_end"] = scene_start, t

    cache_file.write_text(json.dumps(cache, indent=1))
    full = np.concatenate(track) if track else np.zeros(1, dtype=np.float32)
    sf.write(PROJECT / "06_AUDIO" / "narration.wav", full, SR)
    scenes = [{"id": s["id"], "start": round(s["_start"], 3), "end": round(s["_end"], 3)} for s in sb["scenes"]]
    (PROJECT / "06_AUDIO" / "vo_timing.json").write_text(json.dumps({"total": round(t, 3), "lines": timing, "scenes": scenes}, indent=1))
    log(f"Narration: {t/60:.2f} min, {len(timing)} lines, voice={voice}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
