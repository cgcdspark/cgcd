# Fallback voiceover using Windows' built-in System.Speech (offline, free).
# Quality is noticeably more robotic than the Kokoro neural voice used for the master;
# use it only if Kokoro cannot run. Writes 06_AUDIO\vo\<line>.wav for every narration line,
# then run:  python pipeline\render.py --from timeline   (after re-timing with tts.py --external)
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Add-Type -AssemblyName System.Speech
$sb = Get-Content (Join-Path $root "03_STORYBOARD\storyboard.json") -Raw | ConvertFrom-Json
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voices = $synth.GetInstalledVoices() | ForEach-Object { $_.VoiceInfo.Name }
Write-Host "Installed voices: $($voices -join ', ')"
# Prefer a natural voice if present (e.g. 'Microsoft Zira Desktop' / 'Microsoft David Desktop')
foreach ($v in "Microsoft Zira Desktop","Microsoft David Desktop") { if ($voices -contains $v) { $synth.SelectVoice($v); break } }
$synth.Rate = 0
$out = Join-Path $root "06_AUDIO\vo"; New-Item -ItemType Directory -Force $out | Out-Null
foreach ($scene in $sb.scenes) { foreach ($ln in $scene.vo) {
  $text = if ($ln.say) { $ln.say } else { $ln.text }
  $synth.SetOutputToWaveFile((Join-Path $out "$($ln.id).wav"))
  $synth.Speak($text)
}}
$synth.SetOutputToNull()
Write-Host "Done. Re-time with: python pipeline\tts.py --external" -ForegroundColor Green
