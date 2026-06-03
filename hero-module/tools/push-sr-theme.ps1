# Pushes local theme folder to HubSpot (same account as hs CLI).
# Default: hubspot-fetched/sr  (fetched copy). Override with -Source ".\sr"

param(
  [string] $Account = "fake-demo-account",
  [string] $HubSpotDest = "sr",
  [string] $Source = "hubspot-fetched\sr"
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $repoRoot
if (-not (Test-Path "package.json")) { throw "package.json not found. Expected repo root: $repoRoot" }
if (-not (Test-Path $Source)) { throw "Source missing: $Source  (run: npm run theme:fetch first)" }

hs cms upload $Source $HubSpotDest -a $Account -o
Write-Host "Uploaded $Source -> HubSpot: $HubSpotDest (account: $Account)"
