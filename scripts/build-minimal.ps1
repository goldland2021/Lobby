# 极简Cocos构建脚本
# 直接调用，最少配置

param(
    [string]$CocosExe = "C:\ProgramData\cocos\editors\Creator\3.8.8\CocosCreator.exe",
    [string]$ProjectPath = ".",
    [string]$BuildArgs = "platform=web-mobile;debug=false;md5Cache=true"
)

Write-Host "=== 极简Cocos构建 ==="
Write-Host "Cocos路径: $CocosExe"
Write-Host "项目路径: $ProjectPath"
Write-Host "构建参数: $BuildArgs"

# 验证Cocos Creator
if (-not (Test-Path $CocosExe)) {
    Write-Host "错误: Cocos Creator不存在" -ForegroundColor Red
    exit 1
}

# 验证项目
if (-not (Test-Path (Join-Path $ProjectPath "project.json"))) {
    Write-Host "错误: 不是有效的Cocos项目" -ForegroundColor Red
    exit 1
}

# 构建命令
$arguments = "--project `"$ProjectPath`" --build `"$BuildArgs`""

Write-Host "执行命令: $CocosExe $arguments"

# 简单直接调用
try {
    $process = Start-Process -FilePath $CocosExe `
                             -ArgumentList $arguments `
                             -NoNewWindow `
                             -PassThru `
                             -Wait `
                             -ErrorAction Stop
    
    Write-Host "退出代码: $($process.ExitCode)"
    
    if ($process.ExitCode -eq 0) {
        Write-Host "✅ 构建成功!" -ForegroundColor Green
        
        # 检查输出
        $buildDir = Join-Path $ProjectPath "build\web-mobile"
        if (Test-Path $buildDir) {
            $indexFile = Join-Path $buildDir "index.html"
            if (Test-Path $indexFile) {
                Write-Host "✅ 构建输出: $buildDir"
                Write-Host "✅ 主文件: $indexFile"
            } else {
                Write-Host "⚠️ 构建目录存在但缺少index.html" -ForegroundColor Yellow
            }
        } else {
            Write-Host "❌ 构建目录不存在" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ 构建失败" -ForegroundColor Red
    }
    
    exit $process.ExitCode
}
catch {
    Write-Host "错误: $_" -ForegroundColor Red
    exit 1
}