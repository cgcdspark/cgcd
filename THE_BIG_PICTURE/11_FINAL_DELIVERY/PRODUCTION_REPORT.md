# THE BIG PICTURE · EP01 — The Hidden Winners of the AI Boom
## Production report and quality review

**Status: finished master rendered and verified (version 2).** 1920×1080 · 25 fps · H.264 + AAC 320 kbps · 8:22 · −14.0 LUFS / −1.3 dBTP · 716 MB.
SHA-256 of the master: `1252dffebc392682b8ae61d7090bc6b419fe5e15a350be14c154d9d048faf7ff`

### Where the video is
| File | What |
|---|---|
| `master_parts/` + `JOIN_ON_WINDOWS.bat` | Full-quality master, split into 8 parts because GitHub caps files at 100 MB. Double-click the .bat to rebuild the MP4 (Mac/Linux: `join_mac_linux.sh`). |
| `THE_BIG_PICTURE_EP01_preview_720p.mp4` | 53 MB review copy (not for upload) |
| Re-render from scratch | `pipeline\windows\render_windows.ps1` (see README) |

---

### Deliverables index (brief §13)
| # | Deliverable | Location |
|---|---|---|
| 1 | Research dossier | `01_RESEARCH/desk_chips.md`, `desk_datacentres.md`, `desk_electricity.md`, `fact_check_report.md` |
| 2 | Source log (claim, figure, period, type, URL, verification) | `01_RESEARCH/research_master.csv` (137 claims: 73 verified from primary documents, 54 partial, 10 rejected) |
| 3 | Final script | `02_SCRIPT/final_script.md` (1,190 words, timecoded) |
| 4 | Scene-by-scene storyboard | `03_STORYBOARD/storyboard.md` (readable), `storyboard.json` (machine source of truth), `shot_list_resolved.csv` |
| 5 | Footage sourcing sheet | `04_FOOTAGE/footage_catalogue.csv` (427 licence-checked candidates), `SCOUT_NOTES.md` (licence terms quoted) |
| 6 | Asset manifest | `04_FOOTAGE/asset_manifest.csv` (33 assets, every licence and attribution); `06_AUDIO/audio_manifest.csv` |
| 7 | Voiceover | `06_AUDIO/EP01_voiceover_narration.mp3`; final mix `06_AUDIO/EP01_final_mix.mp3` |
| 8 | Subtitles | `08_SUBTITLES/the_hidden_winners_of_the_ai_boom.en.srt` (120 cues) |
| 9 | Original graphics | `07_GRAPHICS/*.png` (frames of all 15 graphics); source in `pipeline/remotion/src/graphics/` |
| 10 | Thumbnail (3 concepts) | `10_THUMBNAIL/thumbnail_concept_{1,2,3}.png` (1280×720) |
| 11–13 | Assembly scripts, Remotion project, FFmpeg package | `pipeline/` (render.py orchestrates; every step is its own script) |
| 14 | README + Windows setup + troubleshooting | `README.md`, `TROUBLESHOOTING.md`, `pipeline/windows/` |
| 15 | Final MP4 | see above |
| — | YouTube package | `10_THUMBNAIL/youtube_package.md` (3 titles, description with chapters, sources, credits, keywords, pinned comment) |
| — | QC report | `09_RENDER/qc_report.md`, `09_RENDER/contact_sheet.jpg` |

### What ran where
Everything above was produced and verified **in the cloud container**, not on your PC: research, fact-check, voice, graphics, edit, mix, render and QC.
The Windows scripts reproduce the same pipeline locally for future episodes or re-renders.

---

### Quality review (brief §14), as creative director

**Research — strong.**
- Every on-screen figure carries its period, units and source.
- Industry estimates are labelled as such (TrendForce share, McKinsey split, Wood Mackenzie prices).
- 10 claims were rejected in fact-check and are absent from the film: the 80% transformer import share, IEA 2026-update numbers, Microsoft's 2026 total and PJM's "uncapped" price.
- Verified context: Nvidia's CEO resigned on 11 Nov 2026 (SEC 8-K). The film attributes no statements to him.
- *Residual risk:* a few figures rest on attributed secondary sourcing because the primary site blocked automated access: CBRE vacancy, SK hynix margin, Berkeley Lab's ~5-year queue. Each is attributed on screen or in narration.

**Story — good.**
- The seven-act arc follows the brief.
- The cold open lands the thesis in 34 seconds.
- The electricity act is the centrepiece, as requested.
- Act 6 gives a balanced "who wins / who pays / what could go wrong" without investment advice.
- The ending returns to the opening image (typing) and resolves on the tagline.

**Visuals — good, with a known limit.**
- All footage is real and licence-clear. Each clip is graded to one look, and identifiable sources are tagged on screen: NASA Ames, the QTS data centre, Microsoft Middenmeer, the DOE cleanroom, the 750 kV transformer.
- There is no unrelated footage implying a named company. A burned-in NASA logo and caption were removed, and a misleading "City of Austin Power Plant" sign was cut.
- *Limit:* free libraries hold almost no usable footage of chip fabs, substations, switchgear or data-centre halls (61% of Mixkit is "Restricted": no YouTube use). Those beats are carried by original graphics and by a few Commons stills with slow camera moves, so parts of acts 3 and 5 are more graphic-led than ideal.
- Generic industrial aerials (refinery silhouettes, ports) are used for mood, never captioned as power plants or named facilities.

**Editing and sound — good.**
- Cuts run about every 3–5 s in the footage sections; graphics hold for 6–14 s while they animate.
- Music (4 cues) is auto-ducked under the voice and sits 13 LU below it.
- Sound effects (whooshes, hits, hum) are placed on chapter changes and stats.
- Mastered to the YouTube target.
- Captions are balanced at phrase boundaries. They're delivered as SRT, not burned in; set `show_captions` to `true` in the storyboard to burn them in.

**Voice — acceptable, honestly labelled.**
- Kokoro-82M, voice "af_heart", is natural for free TTS and passed a Whisper check: every word was intelligible and correct, and "CBRE" was fixed.
- It is not a professional narrator, and pacing is uniform.
- The single biggest quality upgrade available is a human voiceover. Replace `06_AUDIO/vo/*.wav`, run `tts.py --external`, then `render.py --from timeline`.
- Disclose "altered or synthetic content" (the AI voice) when uploading.

**Brand — consistent.**
- Navy, black, gold and off-white throughout.
- One type system (Inter Tight / Inter / IBM Plex Mono).
- Recurring devices: chapter cards, corner stats, source tags, gold rules and an end card.

### Recommended next steps (all free)
1. Record a human voiceover, or audition other Kokoro voices (`meta.voice` in the storyboard), and re-render.
2. Add more Commons stills once Wikimedia stops rate-limiting the build machine. 25 are queued (`04_FOOTAGE/footage_catalogue.csv`, category photos); download them by hand from a browser if needed.
3. Download a few Pexels or Pixabay clips by hand (bot-protected, so they can't be scripted): data-centre aisles, pylons, substations. Add them to the manifest with `download=manual` and re-render.
