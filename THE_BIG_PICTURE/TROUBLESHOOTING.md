# Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `ffmpeg not found on PATH` | FFmpeg missing or PowerShell opened before install | `winget install Gyan.FFmpeg`, then reopen PowerShell |
| `Remotion dependencies missing` | `npm install` not run | `cd pipeline\remotion; npm install` |
| `Font package @fontsource/... missing` | Same as above | `npm install` (fonts are bundled locally, no internet fonts at render time) |
| `MISSING Kokoro model files` | Voice model not downloaded | Re-run `setup_windows.ps1`, or download `kokoro-v1.0.onnx` + `voices-v1.0.bin` from the kokoro-onnx GitHub release into `THE_BIG_PICTURE\_models\` |
| Kokoro too slow / fails to load | Old CPU without AVX2 | Use `windows\tts_windows_systemspeech.ps1`, then `python pipeline\tts.py --external` (lower quality voice) |
| `S05_03: no approved asset for ...` | A storyboard shot has no clip assigned | Set `"asset": "Fxxx"` in `storyboard.json` to an approved manifest row, or run with `--preview` to see a red slate |
| `clip F012 is 6.0s but shot needs 7.2s` | Clip too short for the shot | Choose a longer clip, lower the shot's weight `w`, or split into two shots |
| `MANUAL DOWNLOAD needed: Fxxx` | Source blocks scripted downloads (login / bot protection) | Open the `source_url`, download by hand, save as `04_FOOTAGE\raw\Fxxx.mp4`, re-run `--from footage` |
| `Download failed` | Network issue or file moved | Re-run; if it persists replace the asset (manifest has alternatives in `footage_catalogue.csv`) |
| `audio id M_BODY_A not in audio_manifest.csv` | Music/SFX cue not mapped | Add the row to `06_AUDIO/audio_manifest.csv` with `local_file` |
| Remotion render fails with Chrome error | Chromium download blocked by firewall | Install Google Chrome and set `REMOTION_BROWSER` to its path, e.g. `$env:REMOTION_BROWSER="C:\Program Files\Google\Chrome\Application\chrome.exe"` |
| Render very slow | 4 parallel Chromium tabs on a small machine | Edit `remotion.config.ts` → `Config.setConcurrency(2)`; use `--preview` while editing |
| QC: loudness outside −15.5…−12.5 LUFS | Mix changed after normalisation | Re-run `--from mix` |
| QC: unexpected black segments | Missing clip or very dark footage | Check `09_RENDER/contact_sheet.jpg` at the reported time |
| Subtitles out of sync | Narration edited but timeline not rebuilt | Run `--from voice` (cached lines are reused, only edited lines re-render) |

Resume any failed run from the failing step: `python pipeline\render.py --from <step>`.
