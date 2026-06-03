# Usage (from repo root: hero-module):
#   .\tools\pull-module.ps1 -HubSpotPath "/YourTheme/custom-modules/YourModule.module"
# Requires hubspot.config.yml with real portal + key, and --account name matching the config.

param(
  [Parameter(Mandatory = $true)]
  [string] $HubSpotPath,
  [string] $Account = "fake-demo-account",
  [string] $LocalDest = "hubspot-pulled"
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $repoRoot
if (-not (Test-Path "package.json")) { throw "package.json not found. Expected repo root: $repoRoot" }

$dest = Join-Path $LocalDest (Split-Path $HubSpotPath -Leaf)
hs cms fetch $HubSpotPath $dest -a $Account -o
Write-Host "Pulled to: $((Resolve-Path $dest).Path)"
