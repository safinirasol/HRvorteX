# starts Next.js dev server on a free port (prefers 3000, then 3001-3010)
# - Installs npm deps if node_modules missing
# - Exposes the chosen port in output

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$repoRoot = Split-Path -Parent $PSScriptRoot
Push-Location $repoRoot
try {
  if (-not (Test-Path (Join-Path $repoRoot 'package.json'))) {
    Write-Error 'package.json not found at repo root.'
  }

  if (-not (Test-Path (Join-Path $repoRoot 'node_modules'))) {
    Write-Host 'Installing npm dependencies...' -ForegroundColor Cyan
    npm install
  }

  function Get-FreePort([int]$start=3000,[int]$end=3010) {
    for ($p=$start; $p -le $end; $p++) {
      $ok = -not (Test-NetConnection -ComputerName 'localhost' -Port $p -InformationLevel Quiet)
      if ($ok) { return $p }
    }
    return $null
  }

  $port = Get-FreePort 3000 3010
  if (-not $port) { Write-Error 'No free port found between 3000-3010.' }

  Write-Host ("Starting Next.js on http://localhost:{0}" -f $port) -ForegroundColor Green
  # Use cmd to set PORT env for next dev
  cmd /c "set PORT=$port && npm run dev"
}
finally {
  Pop-Location
}
