# THE BIG PICTURE — one-time Windows setup (free software only).
# Run in PowerShell:  powershell -ExecutionPolicy Bypass -File .\setup_windows.ps1
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)   # ...\THE_BIG_PICTURE
$pipe = Join-Path $root "pipeline"

function Need($name, $wingetId) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    Write-Host "Installing $wingetId ..." -ForegroundColor Yellow
    winget install --id $wingetId -e --accept-source-agreements --accept-package-agreements
  } else { Write-Host "OK  $name found" -ForegroundColor Green }
}
Need "python" "Python.Python.3.12"
Need "node"   "OpenJS.NodeJS.LTS"
Need "ffmpeg" "Gyan.FFmpeg"
Write-Host "If any tool was just installed, close and reopen PowerShell, then run this script again." -ForegroundColor Cyan

# Python environment
python -m venv (Join-Path $root ".venv")
& (Join-Path $root ".venv\Scripts\pip.exe") install -r (Join-Path $pipe "requirements.txt")

# Remotion (graphics + assembly) — Chromium is downloaded automatically by Remotion on first render
Push-Location (Join-Path $pipe "remotion"); npm install; Pop-Location

# Kokoro voice model (Apache-2.0, ~330 MB, runs offline)
$models = Join-Path $root "_models"; New-Item -ItemType Directory -Force $models | Out-Null
$base = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0"
foreach ($f in "kokoro-v1.0.onnx","voices-v1.0.bin") {
  $dest = Join-Path $models $f
  if (-not (Test-Path $dest)) { Invoke-WebRequest "$base/$f" -OutFile $dest }
}
Write-Host "Setup complete. Next: .\render_windows.ps1" -ForegroundColor Green
