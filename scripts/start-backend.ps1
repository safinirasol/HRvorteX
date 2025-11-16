# starts the Flask backend with a temporary execution policy bypass
# - Creates venv if missing
# - Activates venv
# - Installs requirements
# - Runs backend/app.py

param(
  [switch]$NoInstall
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

# Repo root is one level up from this scripts folder
$repoRoot = Split-Path -Parent $PSScriptRoot
$backendDir = Join-Path $repoRoot 'backend'

if (-not (Test-Path $backendDir)) {
  Write-Error "Backend folder not found at $backendDir"
}

# Ensure we only relax policy for this process
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force | Out-Null

Push-Location $backendDir
try {
  # Create venv if missing
  if (-not (Test-Path (Join-Path $backendDir 'venv'))) {
    Write-Host 'Creating Python venv...' -ForegroundColor Cyan
    try { python -m venv venv } catch { py -3 -m venv venv }
  }

  # Activate venv
  $activate = Join-Path $backendDir 'venv\Scripts\Activate.ps1'
  if (-not (Test-Path $activate)) { Write-Error 'Virtual environment activation script not found.' }
  . $activate

  $env:PYTHONUTF8 = '1'

  if (-not $NoInstall) {
    Write-Host 'Upgrading pip and installing requirements...' -ForegroundColor Cyan
    python -m pip install --upgrade pip
    python -m pip install -r requirements.txt
  }

  Write-Host 'Starting backend: http://127.0.0.1:5000' -ForegroundColor Green
  $env:FLASK_ENV = 'development'
  python app.py
}
finally {
  Pop-Location
}
