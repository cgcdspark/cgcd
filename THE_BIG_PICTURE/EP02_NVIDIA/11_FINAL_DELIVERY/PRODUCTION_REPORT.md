# THE BIG PICTURE · EP02 — Nvidia After Jensen
## Production report

**Format:** 1920×1080 · 25 fps · H.264 + AAC 320 kbps · ~11:49 · −14 LUFS / about −1.2 dBTP
**Narrator:** Kokoro "Michael" (your pick) · **Palette:** A, graphite + signal red (your pick) · **No sources on screen** (your call; all sources are in the YouTube description)

### Where things are
| File | What |
|---|---|
| `master_parts/` + `JOIN_ON_WINDOWS.bat` | Full-quality master split into parts (GitHub caps files at 100 MB). Double-click to rebuild the MP4. |
| `THE_BIG_PICTURE_EP02_preview_720p.mp4` | Review copy |
| `../10_THUMBNAIL/thumbnail_concept_{1,2,3}.png` | WHAT NOW? / NVIDIA AFTER JENSEN · 33 YEARS. ONE CEO. / GONE IN 4 DAYS · THE NVIDIA SCANDAL / WHAT WE KNOW |
| `../10_THUMBNAIL/youtube_package.md` | Titles, description with chapters and full source list, credits, tags, pinned comment, upload settings |
| `../08_SUBTITLES/*.en.srt` | 151 caption cues |
| `../02_SCRIPT/script_v1_for_approval.md` | The script you approved |
| `../03_STORYBOARD/` | `build_storyboard.py` (source of truth), `storyboard.json`, `storyboard.md`, `shot_list_resolved.csv` |
| `../01_RESEARCH/` | Three desk files with every claim, source, verification status, a SAFE TO SAY list and a DO NOT SAY list |
| `../04_FOOTAGE/asset_manifest.csv`, `../06_AUDIO/audio_manifest.csv` | Licence of every clip, track and effect |

### How the scandal is handled (legal guardrails)
- Only **on-record statements** (Huang's email, the 8-K, board statements, officials' quotes) are stated as fact.
- Reporting is **attributed in the narration** ("The New York Times reports…", "Reuters reported…").
- The woman and the two Nvidia employees are **never named**.
- "Spy" only appears as *suspected* or *alleged*, and always alongside:
  - no charges anywhere
  - China's denial
  - the Justice Department's "no conclusions"
  - Trump's "nobody's proven"
- The Treasury Secretary's remark is quoted **as the question he asked**.
- The 1 December session is described as a **voluntary, closed-door interview**.
- The share-price fall is shown with the **market-wide sell-off** labelled.

### Quality control
- **Automated checks:** format, duration and loudness pass, with no placeholder shots. One "dark segment" flag at 5:35 is a false positive: it is the dark case-file graphic, verified frame by frame.
- **Fixes from frame-by-frame review across three render passes:**
  1. Kinetic-text cards opened on half a second of pure black. The word now lands on the cut, over a graphite gradient.
  2. The chapter 6 title card overlapped "A HONEY TRAP?".
  3. The "$0" stat box collided with the China chart's title.
  4. One close-up was used four times; it's now used twice.
  5. A NASA clip carried a burned-in caption in two places. One shot was replaced; the other was moved to a verified-clean window.
  6. The thumbnails' abstract light-streak image was replaced with the on-topic midnight clock.
  7. The first render failed on a full disk. I freed 17 GB of caches and duplicates; nothing delivered was lost (checksum-verified).

### Known limits
- **No licensed photos of Jensen Huang or Nvidia's HQ.** Wikimedia rate-limited this machine all session. The film carries the story with original graphics and licensed footage. A future pass could add CC-licensed photos (e.g. Commons: "NVIDIA Headquarters.jpg", CC BY-SA 4.0).
- **Voice.** The narration is a free neural TTS voice. Disclose AI narration on upload.
- **Live story.** Re-check every scandal fact on release day: Bessent's ~25 Nov deadline, any new Nvidia or board statement, and the 1 Dec interview.
- **Shorts were postponed at your request.** The vertical-shorts renderer is built and ready:
  - `pipeline/make_shorts.py`
  - 9 hooks are already written in the storyboard
  - word-by-word captions and a 1080×1920 layout

### Re-render
`TBP_PROJECT=<path>/EP02_NVIDIA python pipeline/render.py --from timeline` (Windows: `pipeline\windows\render_windows.ps1` after setting `TBP_PROJECT`).
