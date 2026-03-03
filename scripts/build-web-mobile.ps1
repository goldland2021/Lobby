$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path "$PSScriptRoot\\.."
$defaultCreator = "C:\\Program Files\\Cocos\\Creator\\3.8.8\\CocosCreator.exe"
$creatorExe = if ($env:COCOS_CREATOR_EXE) { $env:COCOS_CREATOR_EXE } else { $defaultCreator }

if (-not (Test-Path $creatorExe)) {
  Write-Error "Cocos Creator executable not found. Set COCOS_CREATOR_EXE or install Cocos Creator 3.8.8 at: $defaultCreator"
}

$buildArgs = "platform=web-mobile;debug=false;md5Cache=true"
Write-Host "Using Cocos Creator: $creatorExe"
Write-Host "Project: $projectRoot"
Write-Host "Build Args: $buildArgs"

& $creatorExe --project $projectRoot --build $buildArgs

$outDir = Join-Path $projectRoot "build\\web-mobile"
if (-not (Test-Path $outDir)) {
  Write-Error "Build output not found: $outDir"
}

Write-Host "Build finished: $outDir"
