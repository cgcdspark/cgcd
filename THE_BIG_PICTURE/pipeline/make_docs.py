"""Generates readable documents from storyboard.json: 02_SCRIPT/final_script.md and 03_STORYBOARD/storyboard.md."""
import json
from common import PROJECT, load_storyboard

ACTS = {"ACT1": "Act 1 — The hook", "ACT2": "Act 2 — The AI gold rush", "ACT3": "Act 3 — The chip economy",
        "ACT4": "Act 4 — The data centre economy", "ACT5": "Act 5 — The electricity bottleneck",
        "ACT6": "Act 6 — Who actually wins?", "ACT7": "Act 7 — The bigger picture"} if load_storyboard()["meta"].get("slug", "").find("EP01") >= 0 or "slug" not in load_storyboard()["meta"] else {}

def main():
    sb = load_storyboard()
    tp = PROJECT / "06_AUDIO" / "vo_timing.json"
    tm = {l["id"]: l for l in json.loads(tp.read_text())["lines"]} if tp.exists() else {}
    def ts(lid):
        t = tm.get(lid, {}).get("start")
        return f"{int(t//60):02}:{t%60:04.1f}" if t is not None else "--:--"
    s = [f"# {sb['meta']['title']} — final narration script", "", "THE BIG PICTURE · Episode 01 · narration by Kokoro-82M neural TTS (voice: "
         f"{sb['meta']['voice']}) · timings from the rendered voiceover", ""]
    b = [f"# {sb['meta']['title']} — storyboard", "", "Generated from `storyboard.json`. Timecodes = narration start. "
         "Footage IDs refer to `04_FOOTAGE/asset_manifest.csv`.", ""]
    act = None
    for sc in sb["scenes"]:
        if sc["act"] != act:
            act = sc["act"]; s += [f"## {ACTS.get(act, sc['title'])}", ""]; b += [f"## {ACTS.get(act, sc['title'])}", ""]
        b += [f"### {sc['id']} · {sc['title']}", ""]
        if sc.get("vo"):
            b += ["**Narration**", ""] + [f"- `{ts(l['id'])}` {l['text']}" for l in sc["vo"]] + [""]
        b += ["**Picture**", "", "| # | Anchor | Visual | Asset / graphic |", "|---|---|---|---|"]
        for i, sh in enumerate(sc.get("shots", []), 1):
            anc = sh.get("at", "scene start" if i == 1 else "flows")
            if sh.get("graphic"):
                p = sh.get("props", {})
                vis = f"ORIGINAL GRAPHIC: {p.get('kicker','')} — {p.get('title','')}".strip(" —")
                b.append(f"| {i} | {anc} | {vis} | `{sh['graphic']}` |")
            else:
                b.append(f"| {i} | {anc} | {sh.get('need','')} | `{sh.get('asset') or 'UNASSIGNED'}` |")
        if sc.get("overlays"):
            b += ["", "**On-screen text**", ""] + [f"- {o['component']}: " + " · ".join(str(v) for k, v in o["props"].items() if k in ('title','sub','value','label','act')) for o in sc["overlays"]]
        if sc.get("sfx"):
            b += ["", "**Sound**: " + ", ".join(f"{x['sfx']} @ {x.get('at','scene start')}" for x in sc["sfx"])]
        b.append("")
        for l in sc.get("vo", []):
            s.append(f"`{ts(l['id'])}` {l['text']}  ")
        if sc.get("vo"):
            s.append("")
    b += ["## Music", ""] + [f"- `{m['track']}`: {m['from']} → {m['to']}, {m['gain_db']} dB, auto-ducked under narration" for m in sb["meta"].get("music", [])]
    words = sum(len(l["text"].split()) for sc in sb["scenes"] for l in sc["vo"])
    s += ["---", f"{words} words · end card: THE BIG PICTURE — THE FORCES SHAPING OUR WORLD."]
    (PROJECT / "02_SCRIPT" / "final_script.md").write_text("\n".join(s), encoding="utf-8")
    (PROJECT / "03_STORYBOARD" / "storyboard.md").write_text("\n".join(b), encoding="utf-8")
    print("docs written")
main()
