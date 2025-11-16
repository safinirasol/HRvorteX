# starts backend and frontend in separate PowerShell windows with policy bypass

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$repoRoot = Split-Path -Parent $PSScriptRoot
$backend = Join-Path $PSScriptRoot 'start-backend.ps1'
$frontend = Join-Path $PSScriptRoot 'start-frontend.ps1'

if (-not (Test-Path $backend)) { Write-Error 'start-backend.ps1 not found' }
if (-not (Test-Path $frontend)) { Write-Error 'start-frontend.ps1 not found' }

Write-Host 'Launching Backend window...' -ForegroundColor Cyan
Start-Process -FilePath "powershell.exe" -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-File',"`"$backend`"") -WorkingDirectory $repoRoot

Start-Sleep -Seconds 1

Write-Host 'Launching Frontend window...' -ForegroundColor Cyan
Start-Process -FilePath "powershell.exe" -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-File',"`"$frontend`"") -WorkingDirectory $repoRoot

Write-Host 'Both processes launched. Backend: http://127.0.0.1:5000  Frontend: prefers http://localhost:3000' -ForegroundColor Green
