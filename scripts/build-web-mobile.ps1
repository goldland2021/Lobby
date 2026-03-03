$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path "$PSScriptRoot\\.."
$creatorCandidates = @()
if ($env:COCOS_CREATOR_EXE) {
  $creatorCandidates += $env:COCOS_CREATOR_EXE
}
$creatorCandidates += "C:\\ProgramData\\cocos\\editors\\Creator\\3.8.8\\CocosCreator.exe"
$creatorCandidates += "C:\\Program Files\\Cocos\\Creator\\3.8.8\\CocosCreator.exe"
$creatorCandidates += "C:\\Program Files\\CocosDashboard\\resources\\.editors\\Creator\\3.8.8\\CocosCreator.exe"

$creatorExe = $null
foreach ($candidate in $creatorCandidates) {
  if (Test-Path $candidate) {
    $creatorExe = $candidate
    break
  }
}

if (-not $creatorExe) {
  Write-Host "Checked creator candidates:"
  $creatorCandidates | ForEach-Object { Write-Host " - $_" }
  Write-Error "Cocos Creator executable not found. Set COCOS_CREATOR_EXE secret/env to your CocosCreator.exe path."
}

$buildArgs = "platform=web-mobile;debug=false;md5Cache=true"
Write-Host "Using Cocos Creator: $creatorExe"
Write-Host "Project: $projectRoot"
Write-Host "Build Args: $buildArgs"

& $creatorExe --project $projectRoot --build $buildArgs
if ($LASTEXITCODE -ne 0) {
  Write-Error "Cocos build failed with exit code $LASTEXITCODE"
}

$outDir = Join-Path $projectRoot "build\\web-mobile"
if (-not (Test-Path $outDir)) {
  Write-Error "Build output not found: $outDir"
}

Write-Host "Build finished: $outDir"
