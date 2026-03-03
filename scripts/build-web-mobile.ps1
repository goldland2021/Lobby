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

function Dump-CocosLogs([string]$logDir) {
  if (-not $logDir -or -not (Test-Path $logDir)) {
    return
  }
  Write-Host "=== Cocos logs from $logDir ==="
  Get-ChildItem $logDir -File -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 5 |
    ForEach-Object {
      Write-Host "---- $($_.FullName)"
      Get-Content $_.FullName -Tail 180 -ErrorAction SilentlyContinue
    }
}

function Get-LatestCocosLogContent([string]$logDir) {
  if (-not $logDir -or -not (Test-Path $logDir)) {
    return ""
  }
  $latest = Get-ChildItem $logDir -File -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if (-not $latest) {
    return ""
  }
  return Get-Content $latest.FullName -Raw -ErrorAction SilentlyContinue
}

function Invoke-CocosBuild([string]$homeArg) {
  if ($homeArg) {
    & $creatorExe --project $projectRoot --build $buildArgs --home $homeArg --disable-gpu --disable-gpu-shader-disk-cache
  } else {
    & $creatorExe --project $projectRoot --build $buildArgs --disable-gpu --disable-gpu-shader-disk-cache
  }
  if ($null -eq $LASTEXITCODE) { return 1 }
  return $LASTEXITCODE
}

Write-Host "Using Cocos Creator: $creatorExe"
Write-Host "Project: $projectRoot"
Write-Host "Build Args: $buildArgs"

$isCi = $env:GITHUB_ACTIONS -eq "true"
$exitCode = 1
$logDir = $null

if ($isCi) {
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

  $logDir = Join-Path $ciCreatorHome "logs"
  $exitCode = Invoke-CocosBuild $ciCreatorHome

  if ($exitCode -ne 0) {
    Write-Host "Primary CI build failed in isolated home."
    Dump-CocosLogs $logDir
    $latestLog = Get-LatestCocosLogContent $logDir
    if ($latestLog -match "Profile migrateGlobal") {
      Write-Host "Detected profile migration. Retrying once in the same isolated home..."
      Start-Sleep -Seconds 2
      $exitCode = Invoke-CocosBuild $ciCreatorHome
      if ($exitCode -ne 0) {
        Dump-CocosLogs $logDir
      }
    }
  }
} else {
  $realUser = [Environment]::GetFolderPath("UserProfile")
  $logDir = Join-Path $realUser ".CocosCreator\\logs"
  $exitCode = Invoke-CocosBuild $null
  if ($exitCode -ne 0) {
    Dump-CocosLogs $logDir
  }
}

if ($exitCode -ne 0) {
  Write-Error "Cocos build failed with exit code $exitCode"
}

$outDir = Join-Path $projectRoot "build\\web-mobile"
if (-not (Test-Path $outDir)) {
  Write-Error "Build output not found: $outDir"
}

Write-Host "Build finished: $outDir"
