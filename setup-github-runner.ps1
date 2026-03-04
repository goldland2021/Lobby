# GitHub Actions Self-Hosted Runner 安装脚本
# 用于 goldland2021/Lobby 仓库

param(
    [string]$GitHubToken,
    [string]$RunnerName = "$env:COMPUTERNAME-$env:USERNAME"
)

Write-Host "=== GitHub Actions Runner 安装脚本 ===" -ForegroundColor Cyan
Write-Host "仓库: goldland2021/Lobby" -ForegroundColor Yellow
Write-Host "Runner名称: $RunnerName" -ForegroundColor Yellow
Write-Host "标签: windows, cocos" -ForegroundColor Yellow
Write-Host ""

# 检查参数
if (-not $GitHubToken) {
    Write-Host "错误: 需要提供GitHub Token" -ForegroundColor Red
    Write-Host "用法: .\setup-github-runner.ps1 -GitHubToken YOUR_TOKEN" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "如何获取Token:" -ForegroundColor Cyan
    Write-Host "1. 访问 https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "2. 点击 'Generate new token (classic)'" -ForegroundColor White
    Write-Host "3. 选择 'repo' 和 'workflow' 权限" -ForegroundColor White
    Write-Host "4. 复制生成的token" -ForegroundColor White
    exit 1
}

# 创建runner目录
$runnerDir = "C:\actions-runner"
if (Test-Path $runnerDir) {
    Write-Host "检测到已存在的runner目录: $runnerDir" -ForegroundColor Yellow
    $choice = Read-Host "是否删除并重新安装? (y/n)"
    if ($choice -eq 'y') {
        Remove-Item -Path $runnerDir -Recurse -Force
    } else {
        Write-Host "使用现有安装" -ForegroundColor Green
    }
}

if (-not (Test-Path $runnerDir)) {
    Write-Host "创建runner目录: $runnerDir" -ForegroundColor Green
    New-Item -ItemType Directory -Path $runnerDir -Force
}

Set-Location $runnerDir

# 下载runner
Write-Host "下载GitHub Actions Runner..." -ForegroundColor Green
$runnerUrl = "https://github.com/actions/runner/releases/download/v2.315.0/actions-runner-win-x64-2.315.0.zip"
$runnerZip = "actions-runner-win-x64-2.315.0.zip"

if (-not (Test-Path $runnerZip)) {
    Invoke-WebRequest -Uri $runnerUrl -OutFile $runnerZip
    Write-Host "下载完成" -ForegroundColor Green
} else {
    Write-Host "已存在runner文件，跳过下载" -ForegroundColor Yellow
}

# 解压
Write-Host "解压runner文件..." -ForegroundColor Green
if (Test-Path ".\bin") {
    Write-Host "已解压，跳过" -ForegroundColor Yellow
} else {
    Expand-Archive -Path $runnerZip -DestinationPath . -Force
    Write-Host "解压完成" -ForegroundColor Green
}

# 配置runner
Write-Host "配置runner..." -ForegroundColor Green
$configArgs = @(
    "--url", "https://github.com/goldland2021/Lobby",
    "--token", $GitHubToken,
    "--name", $RunnerName,
    "--labels", "windows,cocos",
    "--unattended"
)

.\config.cmd @configArgs

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Runner配置成功!" -ForegroundColor Green
} else {
    Write-Host "❌ Runner配置失败" -ForegroundColor Red
    exit 1
}

# 创建Windows服务（可选）
Write-Host ""
Write-Host "是否安装为Windows服务? (推荐)" -ForegroundColor Cyan
$installService = Read-Host "安装为服务? (y/n)"

if ($installService -eq 'y') {
    Write-Host "安装为Windows服务..." -ForegroundColor Green
    .\svc install
    .\svc start
    
    Write-Host "✅ 服务安装完成" -ForegroundColor Green
    Write-Host "服务名称: actions.runner.$RunnerName" -ForegroundColor White
    Write-Host "状态: 运行中" -ForegroundColor White
} else {
    Write-Host "手动启动runner命令:" -ForegroundColor Yellow
    Write-Host "cd $runnerDir" -ForegroundColor White
    Write-Host ".\run.cmd" -ForegroundColor White
}

# 验证信息
Write-Host ""
Write-Host "=== 安装完成 ===" -ForegroundColor Cyan
Write-Host "Runner名称: $RunnerName" -ForegroundColor White
Write-Host "标签: windows, cocos" -ForegroundColor White
Write-Host "仓库: goldland2021/Lobby" -ForegroundColor White
Write-Host "目录: $runnerDir" -ForegroundColor White
Write-Host ""
Write-Host "下一步:" -ForegroundColor Yellow
Write-Host "1. 访问 https://github.com/goldland2021/Lobby/settings/actions/runners" -ForegroundColor White
Write-Host "2. 验证runner显示为'在线'" -ForegroundColor White
Write-Host "3. 推送代码到master分支测试" -ForegroundColor White