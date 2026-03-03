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
$creatorHomeArg = $null

# In CI, isolate Cocos/Electron profile and cache dirs to avoid permission conflicts.
if ($env:GITHUB_ACTIONS -eq "true") {
  $ciHome = Join-Path $projectRoot ".ci-cocos-home"
  $ciCreatorHome = Join-Path $ciHome ".CocosCreator"
  $ciAppData = Join-Path $ciHome "AppData\\Roaming"
  $ciLocalAppData = Join-Path $ciHome "AppData\\Local"
  $ciTemp = Join-Path $ciHome "Temp"
  $ciChromiumCache = Join-Path $ciHome "ChromiumCache"

  New-Item -ItemType Directory -Force -Path $ciHome, $ciCreatorHome, $ciAppData, $ciLocalAppData, $ciTemp, $ciChromiumCache | Out-Null

  $env:HOME = $ciHome
  $env:USERPROFILE = $ciHome
  $env:APPDATA = $ciAppData
  $env:LOCALAPPDATA = $ciLocalAppData
  $env:TEMP = $ciTemp
  $env:TMP = $ciTemp

  $env:ELECTRON_DISABLE_GPU = "1"
  $env:COCOS_CHROMIUM_CACHE_DIR = $ciChromiumCache

  Write-Host "CI isolated HOME: $ciHome"
  Write-Host "CI isolated Cocos Home: $ciCreatorHome"
  Write-Host "CI isolated LOCALAPPDATA: $ciLocalAppData"

  # Force Creator to use isolated home so old global plugins won't be loaded.
  $creatorHomeArg = $ciCreatorHome
}

Write-Host "Using Cocos Creator: $creatorExe"
Write-Host "Project: $projectRoot"
Write-Host "Build Args: $buildArgs"

if ($creatorHomeArg) {
  & $creatorExe --project $projectRoot --build $buildArgs --home $creatorHomeArg --disable-gpu --disable-gpu-shader-disk-cache
} else {
  & $creatorExe --project $projectRoot --build $buildArgs --disable-gpu --disable-gpu-shader-disk-cache
}
$exitCode = if ($null -eq $LASTEXITCODE) { 1 } else { $LASTEXITCODE }
if ($exitCode -ne 0) {
  Write-Error "Cocos build failed with exit code $exitCode"
}

$outDir = Join-Path $projectRoot "build\\web-mobile"
if (-not (Test-Path $outDir)) {
  Write-Error "Build output not found: $outDir"
}

Write-Host "Build finished: $outDir"
