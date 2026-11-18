"""Stage: audio mix.

Builds the final soundtrack at 48 kHz stereo:
  narration  — cleaned (high-pass, gentle compression, presence lift) and centred
  music      — cues from storyboard meta.music, looped/crossfaded to length, auto-ducked under the voice
  sfx        — one-shots placed at storyboard cues
Then masters the sum to YouTube loudness (-14 LUFS integrated, -1.5 dBTP) with FFmpeg loudnorm (two-pass).

Writes 06_AUDIO/stems/{narration,music,sfx}.wav and 06_AUDIO/final_mix.wav.
Audio files are resolved through 06_AUDIO/audio_manifest.csv (columns: audio_id, kind, local_file, licence, ...).
"""
from __future__ import annotations

import csv
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf

from common import PROJECT, ffmpeg, load_storyboard, log, run

SR = 48000


def load(path: Path) -> np.ndarray:
    """Decode any audio file to 48 kHz stereo float32 via FFmpeg."""
    r = subprocess.run([ffmpeg(), "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"],
                       capture_output=True)
    if r.returncode:
        raise RuntimeError(r.stderr.decode()[-500:])
    return np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, 2).copy()


def db(x: float) -> float:
    return 10 ** (x / 20)


def fade(a: np.ndarray, fin: float, fout: float) -> np.ndarray:
    n = len(a)
    i, o = min(n, int(fin * SR)), min(n, int(fout * SR))
    if i:
        a[:i] *= np.linspace(0, 1, i)[:, None] ** 2
    if o:
        a[n - o:] *= np.linspace(1, 0, o)[:, None] ** 2
    return a


def fit(a: np.ndarray, n: int, xf: float = 3.0) -> np.ndarray:
    """Loop a music bed to n samples with equal-power crossfades."""
    if len(a) >= n:
        return a[:n].copy()
    x = int(xf * SR)
    out = a.copy()
    while len(out) < n:
        k = min(x, len(out), len(a))
        t = np.linspace(0, np.pi / 2, k)[:, None]
        out[-k:] = out[-k:] * np.cos(t) + a[:k] * np.sin(t)
        out = np.concatenate([out, a[k:]])
    return out[:n]


def envelope(v: np.ndarray, attack=0.03, release=0.45) -> np.ndarray:
    """Smoothed voice-activity envelope (0..1) used for ducking."""
    mono = np.abs(v).mean(axis=1)
    hop = 480
    frames = mono[: len(mono) // hop * hop].reshape(-1, hop).max(axis=1)
    act = (frames > 0.02).astype(np.float32)
    out = np.zeros_like(act)
    a_c, r_c = np.exp(-hop / (attack * SR)), np.exp(-hop / (release * SR))
    y = 0.0
    for i, x in enumerate(act):
        c = a_c if x > y else r_c
        y = c * y + (1 - c) * x
        out[i] = y
    env = np.repeat(out, hop)
    return np.pad(env, (0, len(v) - len(env)), mode="edge")


def main() -> int:
    sb = load_storyboard()
    timing = json.loads((PROJECT / "06_AUDIO" / "vo_timing.json").read_text())
    lines = {l["id"]: l for l in timing["lines"]}
    scenes = {s["id"]: s for s in timing["scenes"]}
    total = int((timing["total"] + 0.5) * SR)

    man = {}
    mp = PROJECT / "06_AUDIO" / "audio_manifest.csv"
    if mp.exists():
        with mp.open(newline="", encoding="utf-8") as f:
            man = {r["audio_id"]: r for r in csv.DictReader(f)}

    def resolve(aid: str) -> Path | None:
        r = man.get(aid)
        if not r:
            log(f"audio id {aid} not in audio_manifest.csv", "error")
            return None
        p = PROJECT / "06_AUDIO" / r["local_file"]
        if not p.exists():
            log(f"audio file missing: {p}", "error")
            return None
        return p

    # --- narration: clean with FFmpeg, then place
    nar_raw = PROJECT / "06_AUDIO" / "narration.wav"
    with tempfile.TemporaryDirectory() as td:
        clean = Path(td) / "n.wav"
        run([ffmpeg(), "-y", "-v", "error", "-i", str(nar_raw), "-af",
             "highpass=f=75,lowpass=f=15500,equalizer=f=180:t=q:w=1.0:g=1.5,equalizer=f=3200:t=q:w=1.2:g=2.0,"
             "acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2,aresample=48000",
             "-ac", "2", str(clean)])
        voice = load(clean)
    voice = np.pad(voice, ((0, max(0, total - len(voice))), (0, 0)))[:total]

    # --- music
    music = np.zeros((total, 2), np.float32)
    errors = 0
    for cue in sb["meta"].get("music", []):
        p = resolve(cue["track"])
        if not p:
            errors += 1
            continue
        a, b = scenes[cue["from"]]["start"], scenes[cue["to"]]["end"]
        n0, n1 = int(a * SR), min(total, int(b * SR))
        src = load(p)
        if cue.get("align") == "end" and len(src) > n1 - n0:
            src = src[len(src) - (n1 - n0):]  # land the track's natural ending on the cue's end
        bed = fit(src, n1 - n0)
        bed = fade(bed, cue.get("fade_in", 2), cue.get("fade_out", 3)) * db(cue.get("gain_db", -20))
        music[n0:n1] += bed
    env = envelope(voice)
    duck = 1.0 - 0.55 * env  # ~ -7 dB under speech, recovers in gaps
    music *= duck[:, None]

    # --- sfx
    sfx = np.zeros((total, 2), np.float32)
    for sc in sb["scenes"]:
        for cue in sc.get("sfx", []):
            p = resolve(cue["sfx"])
            if not p:
                errors += 1
                continue
            if "at" in cue:
                t = lines[cue["at"]]["start"] + float(cue.get("offset", 0))
            else:
                t = scenes[sc["id"]]["start"] + float(cue.get("at_scene_start", 0))
            a = load(p)
            if cue.get("dur"):
                a = fade(a[: int(cue["dur"] * SR)].copy(), 0.3, 1.2)
            else:
                a = fade(a, 0.005, 0.25)
            n0 = max(0, int(t * SR))
            n1 = min(total, n0 + len(a))
            sfx[n0:n1] += a[: n1 - n0] * db(cue.get("gain_db", -12))

    stems = PROJECT / "06_AUDIO" / "stems"
    stems.mkdir(exist_ok=True)
    for name, arr in (("narration", voice), ("music", music), ("sfx", sfx)):
        sf.write(stems / f"{name}.wav", arr, SR, subtype="FLOAT")
    mix = voice + music + sfx
    pre = stems / "premaster.wav"
    sf.write(pre, mix, SR, subtype="FLOAT")

    # --- two-pass loudness normalisation to -14 LUFS / -1.5 dBTP
    r = subprocess.run([ffmpeg(), "-v", "info", "-i", str(pre), "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
                       capture_output=True, text=True)
    js = json.loads(r.stderr[r.stderr.rfind("{"): r.stderr.rfind("}") + 1])
    af = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:"
          f"measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true")
    out = PROJECT / "06_AUDIO" / "final_mix.wav"
    run([ffmpeg(), "-y", "-v", "error", "-i", str(pre), "-af", af + ",aresample=48000", "-c:a", "pcm_s24le", str(out)])
    log(f"Mix written: {out.name} ({total/SR/60:.2f} min); input loudness {js['input_i']} LUFS → -14", "ok" if not errors else "warn")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
