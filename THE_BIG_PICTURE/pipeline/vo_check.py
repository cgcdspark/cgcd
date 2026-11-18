"""QC: transcribe every voiceover line with Whisper and flag lines where the TTS mispronounced or dropped words.
Writes 06_AUDIO/vo_check.json. Usage: python vo_check.py [--model small.en] [--threshold 0.85]"""
import argparse, json, re, sys
from difflib import SequenceMatcher
from common import PROJECT, load_storyboard, log

def load16k(path):
    import numpy as np, soundfile as sf
    a, sr = sf.read(str(path), dtype="float32")
    if a.ndim > 1: a = a.mean(axis=1)
    n = int(len(a) * 16000 / sr)
    return np.interp(np.linspace(0, len(a) - 1, n), np.arange(len(a)), a).astype("float32")

def norm(s):
    return re.sub(r"[^a-z0-9 ]", " ", s.lower()).split()

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--model", default="small.en"); ap.add_argument("--threshold", type=float, default=0.85)
    a = ap.parse_args()
    from faster_whisper import WhisperModel
    m = WhisperModel(a.model, device="cpu", compute_type="int8")
    sb = load_storyboard(); out = []; bad = 0
    for sc in sb["scenes"]:
        for ln in sc["vo"]:
            wav = PROJECT / "06_AUDIO" / "vo" / f"{ln['id']}.wav"
            segs, _ = m.transcribe(load16k(wav), beam_size=5, language="en")
            heard = " ".join(s.text.strip() for s in segs)
            ref = ln.get("say", ln["text"])
            r = max(SequenceMatcher(None, norm(x), norm(heard)).ratio() for x in (ref, ln["text"]))
            out.append({"id": ln["id"], "ratio": round(r, 3), "said": ref, "heard": heard})
            if r < a.threshold:
                bad += 1; log(f"{ln['id']} {r:.2f}\n   want: {ref}\n   heard: {heard}", "warn")
    (PROJECT / "06_AUDIO" / "vo_check.json").write_text(json.dumps(out, indent=1))
    log(f"{len(out)} lines checked, {bad} below {a.threshold}", "ok" if not bad else "warn")
main()
