# THE BIG PICTURE — documentary production system

**Episode 01: The Hidden Winners of the AI Boom** · 1920×1080 · 25 fps · ~8.5 min · English

A zero-budget, reusable pipeline that turns one storyboard file into a finished, mixed, subtitled MP4.
Everything runs on free / open-source software: Python, FFmpeg, Remotion (React video), the Kokoro-82M neural
voice (Apache-2.0, runs offline), and footage/music from free-licence libraries.

---

## Folder map

| Folder | What lives there |
|---|---|
| `00_CONTROL_ROOM/` | Live production monitor page (published as a claude.ai artifact) |
| `01_RESEARCH/` | Desk notes, `research_master.csv` (every claim, figure, period, source, verification), `fact_check_report.md` |
| `02_SCRIPT/` | Final narration script (generated from the storyboard) |
| `03_STORYBOARD/` | **`storyboard.json` — the single source of truth** (narration, shots, graphics, overlays, SFX, music cues); `storyboard.md` (readable); `shot_list_resolved.csv` (computed timings) |
| `04_FOOTAGE/` | `asset_manifest.csv` (licence of every clip), `footage_catalogue.csv` (scouted candidates), `raw/` downloads |
| `05_IMAGES/` | Still images (raw) |
| `06_AUDIO/` | `vo/` narration lines, `narration.wav`, `audio_manifest.csv`, `music/`, `sfx/`, `stems/`, `final_mix.wav` |
| `07_GRAPHICS/` | Rendered frames of every original graphic (for review / reuse) |
| `08_SUBTITLES/` | `*.en.srt` |
| `09_RENDER/` | `picture.mp4` (silent master), `qc_report.md`, `contact_sheet.jpg` |
| `10_THUMBNAIL/` | Three thumbnail concepts + YouTube package (titles, description, keywords, pinned comment) |
| `11_FINAL_DELIVERY/` | The finished MP4 |
| `pipeline/` | All scripts + the Remotion project |

Large media (raw footage, conformed clips, renders) is **not** committed to Git; the manifest + scripts recreate it.

---

## Windows setup (one time)

1. Open **PowerShell** in `THE_BIG_PICTURE\pipeline\windows`.
2. Run:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\setup_windows.ps1
   ```
   It installs (via `winget`, free): Python 3.12, Node.js LTS, FFmpeg; creates `.venv`; runs `npm install` for Remotion;
   downloads the Kokoro voice model (~350 MB) into `_models\`.
   If it installed anything, close PowerShell, reopen it, and run the script once more.

## Render the documentary

```powershell
.\render_windows.ps1            # full run: voice → footage → timeline → picture → mix → mux → thumbnails → QC
.\render_windows.ps1 -Preview   # fast half-resolution draft
.\render_windows.ps1 -From mix  # resume from a step
```
Linux / macOS: `python pipeline/render.py` (same flags: `--from`, `--preview`).

Steps (each is also a standalone script in `pipeline/`):

| Step | Script | Does |
|---|---|---|
| voice | `tts.py` | Kokoro TTS for every narration line (cached per sentence) → `narration.wav`, `vo_timing.json` |
| footage | `prep_footage.py` | Downloads approved assets from the manifest, conforms to 1080p25 with the house grade |
| timeline | `build_timeline.py` | Storyboard + timings + manifest → Remotion `timeline.json`, SRT, shot list; **fails on missing/short footage** |
| picture | Remotion | Renders the edit, graphics, overlays, film finish (silent) |
| mix | `mix_audio.py` | Voice clean-up, music beds with auto-ducking, SFX, two-pass loudness to −14 LUFS / −1.5 dBTP |
| mux | FFmpeg | Final MP4 (H.264 + AAC 320 kbps) |
| thumbs | `make_thumbnails.py` | Three 1280×720 thumbnail concepts |
| qc | `qc.py` | Format, duration, black frames, loudness, placeholders, contact sheet → `09_RENDER/qc_report.md` |

Optional: `vo_check.py` transcribes the voiceover with Whisper and flags mispronounced lines.

## Making the next documentary

1. Research into `01_RESEARCH/research_master.csv` (same columns).
2. Write a new `03_STORYBOARD/storyboard.json` (copy this one; narration lines, shots with `need` descriptions).
3. Scout footage: edit `pipeline/footage_queries.json`, run `python pipeline/footage_scout.py`, pick clips into
   `04_FOOTAGE/asset_manifest.csv` and set each shot's `asset`.
4. Pick music/SFX into `06_AUDIO/audio_manifest.csv`.
5. `render_windows.ps1`.

New graphic types: add a React component in `pipeline/remotion/src/graphics/`, register it in `Documentary.tsx`
(`REG`) and in `build_timeline.py` (`COMPONENTS`).

## Optional finishing in DaVinci Resolve (free)

Import `09_RENDER/picture.mp4` + `06_AUDIO/stems/*.wav` + the SRT if you want to hand-tune the grade or mix.

## Licensing

Every asset's source, licence and attribution is recorded in `04_FOOTAGE/asset_manifest.csv` and
`06_AUDIO/audio_manifest.csv`; required credits are reproduced in the YouTube description
(`10_THUMBNAIL/youtube_package.md`). Graphics, script and voiceover are original.
Remotion is free for individuals and companies of up to 3 people (see remotion.dev/license).
This film is not investment advice.
