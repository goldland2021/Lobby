# 简化版Cocos构建脚本
# 针对GitHub Actions CI环境优化

$ErrorActionPreference = "Stop"

# 项目路径
$projectRoot = "G:\CherryFarm\openclaw"
$creatorExe = "C:\ProgramData\cocos\editors\Creator\3.8.8\CocosCreator.exe"

# 验证Cocos Creator存在
if (-not (Test-Path $creatorExe)) {
    Write-Host "❌ Cocos Creator not found: $creatorExe"
    Write-Host "请检查路径或设置COCOS_CREATOR_EXE环境变量"
    exit 1
}

Write-Host "✅ 使用Cocos Creator: $creatorExe"
Write-Host "✅ 项目路径: $projectRoot"

# 构建参数
$buildArgs = "platform=web-mobile;debug=false;md5Cache=true"
Write-Host "✅ 构建参数: $buildArgs"

# 创建日志目录
$logDir = Join-Path $projectRoot "build-logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$stdoutFile = Join-Path $logDir "cocos-stdout.log"
$stderrFile = Join-Path $logDir "cocos-stderr.log"

# 清理旧日志
if (Test-Path $stdoutFile) { Remove-Item $stdoutFile -Force }
if (Test-Path $stderrFile) { Remove-Item $stderrFile -Force }

# 构建命令参数
$argList = @(
    "--project", "`"$projectRoot`"",
    "--build", "`"$buildArgs`"",
    "--disable-gpu",
    "--disable-gpu-shader-disk-cache"
)

Write-Host "🚀 开始构建Cocos项目..."
Write-Host "命令: $creatorExe $argList"

# 启动构建进程
$processInfo = New-Object System.Diagnostics.ProcessStartInfo
$processInfo.FileName = $creatorExe
$processInfo.Arguments = $argList -join " "
$processInfo.RedirectStandardOutput = $true
$processInfo.RedirectStandardError = $true
$processInfo.UseShellExecute = $false
$processInfo.CreateNoWindow = $true

$process = New-Object System.Diagnostics.Process
$process.StartInfo = $processInfo

# 开始进程
$process.Start() | Out-Null

# 设置超时（15分钟）
$timeoutSeconds = 900
$startTime = Get-Date

Write-Host "⏱️ 构建超时设置: $($timeoutSeconds/60) 分钟"

# 监控进程
while (-not $process.HasExited) {
    $elapsed = (Get-Date) - $startTime
    if ($elapsed.TotalSeconds -gt $timeoutSeconds) {
        Write-Host "⏰ 构建超时，终止进程..."
        $process.Kill()
        $process.WaitForExit()
        Write-Host "❌ 构建超时终止"
        exit 1
    }
    
    # 每30秒输出状态
    if ([math]::Round($elapsed.TotalSeconds) % 30 -eq 0) {
        Write-Host "⏳ 构建进行中: $([math]::Round($elapsed.TotalSeconds)) 秒"
    }
    
    Start-Sleep -Seconds 1
}

# 获取输出
$stdout = $process.StandardOutput.ReadToEnd()
$stderr = $process.StandardError.ReadToEnd()
$exitCode = $process.ExitCode

# 保存日志
$stdout | Out-File -FilePath $stdoutFile -Encoding UTF8
$stderr | Out-File -FilePath $stderrFile -Encoding UTF8

Write-Host "📋 构建完成，退出代码: $exitCode"

# 输出最后100行日志
Write-Host "=== 标准输出最后100行 ==="
$stdoutLines = $stdout -split "`n"
$start = [math]::Max(0, $stdoutLines.Count - 100)
for ($i = $start; $i -lt $stdoutLines.Count; $i++) {
    Write-Host $stdoutLines[$i]
}

Write-Host "=== 错误输出最后100行 ==="
$stderrLines = $stderr -split "`n"
$start = [math]::Max(0, $stderrLines.Count - 100)
for ($i = $start; $i -lt $stderrLines.Count; $i++) {
    Write-Host $stderrLines[$i]
}

# 检查构建输出
$outDir = Join-Path $projectRoot "build\web-mobile"
if (Test-Path $outDir) {
    $files = Get-ChildItem $outDir -Recurse | Measure-Object
    Write-Host "✅ 构建输出目录: $outDir"
    Write-Host "✅ 生成文件数: $($files.Count)"
    
    # 检查关键文件
    $keyFiles = @(
        "index.html",
        "main.js",
        "style.css"
    )
    
    foreach ($file in $keyFiles) {
        $path = Join-Path $outDir $file
        if (Test-Path $path) {
            Write-Host "✅ 关键文件存在: $file"
        } else {
            Write-Host "⚠️ 关键文件缺失: $file"
        }
    }
} else {
    Write-Host "❌ 构建输出目录不存在: $outDir"
}

if ($exitCode -eq 0) {
    Write-Host "🎉 Cocos构建成功!"
} else {
    Write-Host "❌ Cocos构建失败，退出代码: $exitCode"
}

exit $exitCode