"""Generates 10_THUMBNAIL/youtube_package.md: titles, description with chapters, sources, credits, keywords, pinned comment.
Chapters come from the real scene timings; credits come from the asset and audio manifests; sources from research_master.csv."""
import csv
import json

from common import PROJECT, load_storyboard

CHAPTERS = [("S00", "Intro: AI runs on infrastructure"), ("S02", "The AI gold rush"), ("S04", "The chip economy"),
            ("S07", "The data centre economy"), ("S09", "The electricity bottleneck"), ("S12", "Who actually wins?"),
            ("S13", "The bigger picture")]
# claim ids actually used on screen or in narration (keep in sync with the storyboard)
USED = ["C06", "C07", "C08", "C16", "C20", "C33", "C38", "C39", "C43", "C45", "C46", "C47", "C48", "C49", "D06", "D07", "D10",
        "D15", "D26", "D27", "D35", "E01", "E02", "E03", "E09", "E11", "E12", "E13", "E16", "E17", "E23", "E24", "E27", "E31",
        "E34", "E35", "E41"]


def ts(t: float) -> str:
    t = int(t)
    return f"{t//60}:{t%60:02}"


def main():
    sb = load_storyboard()
    tm = json.loads((PROJECT / "06_AUDIO" / "vo_timing.json").read_text())
    st = {s["id"]: s["start"] for s in tm["scenes"]}
    chapters = "\n".join(f"{ts(0 if i == 0 else st[sid])} {name}" for i, (sid, name) in enumerate(CHAPTERS))

    claims = {r["claim_id"]: r for r in csv.DictReader((PROJECT / "01_RESEARCH" / "research_master.csv").open(encoding="utf-8"))}
    COMPANY = {"1045810": "Nvidia", "1046179": "TSMC", "1652044": "Alphabet", "1018724": "Amazon", "1326801": "Meta", "789019": "Microsoft",
               "1674101": "Vertiv", "1551182": "Eaton", "1769628": "CoreWeave", "1996810": "GE Vernova", "1050915": "Quanta Services"}
    seen, src_lines = set(), []
    for cid in USED:
        r = claims.get(cid)
        if not r:
            continue
        url = (r.get("primary_url") or r.get("url") or "").split(" ")[0]
        if not url or url in seen:
            continue
        seen.add(url)
        if "sec.gov" in url:
            cik = url.split("/data/")[1].split("/")[0] if "/data/" in url else ""
            label = f"{COMPANY.get(cik, 'Company')} — SEC filing"
        elif "nvidia.com" in url:
            label = "Nvidia"
        elif "datacenterdynamics" in url:
            label = "DatacenterDynamics"
        elif r.get("primary_url"):
            label = r.get("publisher", "").split("/")[0].split("(")[0].strip()
        else:
            label = r.get("publisher", "")
        src_lines.append(f"• {label}: {url}")
    credits = []
    with (PROJECT / "04_FOOTAGE" / "asset_manifest.csv").open(encoding="utf-8") as f:
        for r in csv.DictReader(f):
            if r["source"] == "mixkit":
                continue
            credits.append(f"• {r['description']} — {r['attribution']} — {r['licence']} — {r['source_url']}")
    music = []
    with (PROJECT / "06_AUDIO" / "audio_manifest.csv").open(encoding="utf-8") as f:
        for r in csv.DictReader(f):
            if r["kind"] == "music":
                music.append(f"• \"{r['title']}\" (Mixkit, free licence)")

    md = f"""# YouTube package — {sb['meta']['title']}

## Title options
1. **The Hidden Winners of the AI Boom** *(recommended: clear promise, matches the film)*
2. The AI Boom's Real Bottleneck Isn't Chips. It's Electricity.
3. Who Really Profits From AI? Follow the Money to the Power Grid

## Thumbnail concepts
`thumbnail_concept_1.png` WHO REALLY PROFITS? / THE HIDDEN AI BOOM *(recommended)* ·
`thumbnail_concept_2.png` NOT THE CHIPS. THE GRID. · `thumbnail_concept_3.png` BEHIND THE AI REVOLUTION

## Description
Everyone watches the chatbots and the chipmakers. But the AI boom also runs on concrete, copper, steel and electricity.
We follow the money from the chip designers down through the foundries and data centres to the power stations,
transformers and cables that make AI physically possible. Who is getting paid, who carries the risk, and who pays the bill?

THE BIG PICTURE explains the forces shaping our world through business, economics and infrastructure.
This video is for information only and is not investment advice.

CHAPTERS
{chapters}

KEY SOURCES (figures as reported in the latest filings available on 18 Nov 2026)
{chr(10).join(src_lines)}
Full source log with periods, units and verification status: available on request.

FOOTAGE & MUSIC
{chr(10).join(credits)}
• Additional footage: Mixkit (free licence)
{chr(10).join(music)}
Narration: AI-generated voice (Kokoro-82M, Apache-2.0). Graphics: original, THE BIG PICTURE.
NASA material is used under NASA's media guidelines and does not imply endorsement.

#AI #Economics #Infrastructure

## Keywords / tags
AI boom, AI infrastructure, hidden winners of AI, who profits from AI, Nvidia, TSMC, ASML, SK hynix, data centres,
data center power, AI electricity demand, power grid, transformers shortage, GE Vernova, Siemens Energy, Vertiv,
Quanta Services, PJM capacity auction, hyperscaler capex, AI capex, semiconductors explained, business documentary,
economics explained, THE BIG PICTURE

## Pinned comment
Which part of the AI supply chain do you think is most underrated: chips, data centres, or the power grid?
All figures in this film come from company filings and official reports (latest available as of November 2026);
industry estimates are labelled on screen. Corrections are welcome: if we got something wrong, tell us and we will pin the fix.

## Upload settings
Language: English · Captions: upload `08_SUBTITLES/the_hidden_winners_of_the_ai_boom.en.srt` · Category: Education ·
Altered or synthetic content: **Yes**. The narration is an AI-generated voice; disclose it in YouTube Studio.
"""
    (PROJECT / "10_THUMBNAIL").mkdir(exist_ok=True)
    (PROJECT / "10_THUMBNAIL" / "youtube_package.md").write_text(md, encoding="utf-8")
    print("youtube_package.md written;", len(src_lines), "sources,", len(credits), "credits")


main()
