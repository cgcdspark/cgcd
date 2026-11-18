# THE BIG PICTURE — master render on Windows.
#   .\render_windows.ps1                 full pipeline
#   .\render_windows.ps1 -From mix       resume from a step (voice|footage|timeline|picture|mix|mux|thumbs|qc)
#   .\render_windows.ps1 -Preview        fast half-resolution draft
param([string]$From = "voice", [switch]$Preview)
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$py = Join-Path $root ".venv\Scripts\python.exe"
$env:TBP_MODELS = Join-Path $root "_models"
$args = @((Join-Path $root "pipeline\render.py"), "--from", $From)
if ($Preview) { $args += "--preview" }
& $py @args
if ($LASTEXITCODE -ne 0) { Write-Host "Render stopped with errors - see messages above and TROUBLESHOOTING.md" -ForegroundColor Red; exit $LASTEXITCODE }
