# Cocos 2D赛马游戏开发脚本
# 使用方法: .\dev-scripts.ps1 [命令]

param(
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "🏇 Cocos 2D赛马游戏开发脚本"
    Write-Host "=" * 50
    Write-Host ""
    Write-Host "可用命令:"
    Write-Host "  help       显示帮助信息"
    Write-Host "  setup      设置开发环境"
    Write-Host "  build      构建项目"
    Write-Host "  clean      清理临时文件"
    Write-Host "  check      检查项目状态"
    Write-Host "  test       运行测试"
    Write-Host "  resources  管理资源文件"
    Write-Host ""
    Write-Host "示例: .\dev-scripts.ps1 check"
    Write-Host "       .\dev-scripts.ps1 build"
}

function Setup-Environment {
    Write-Host "🔧 设置开发环境..."
    Write-Host ""
    
    # 检查Node.js
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✅ Node.js: $nodeVersion"
    } else {
        Write-Host "❌ Node.js未安装，请先安装Node.js"
        return
    }
    
    # 检查TypeScript
    $tsVersion = tsc --version 2>$null
    if ($tsVersion) {
        Write-Host "✅ TypeScript: $tsVersion"
    } else {
        Write-Host "⚠️  TypeScript未全局安装，将在项目中安装"
    }
    
    # 检查Git
    $gitVersion = git --version 2>$null
    if ($gitVersion) {
        Write-Host "✅ Git: $gitVersion"
    } else {
        Write-Host "⚠️  Git未安装，建议安装Git进行版本控制"
    }
    
    Write-Host ""
    Write-Host "✅ 环境检查完成"
}

function Build-Project {
    Write-Host "🏗️  构建项目..."
    Write-Host ""
    
    # 检查TypeScript编译
    Write-Host "📝 检查TypeScript编译..."
    tsc --noEmit
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ TypeScript编译检查通过"
    } else {
        Write-Host "❌ TypeScript编译有错误，请修复"
        return
    }
    
    Write-Host ""
    Write-Host "📦 项目结构检查:"
    
    # 检查关键文件
    $requiredFiles = @(
        "package.json",
        "tsconfig.json", 
        "assets/scripts/core/GameManager.ts",
        "assets/scripts/core/Config.ts",
        "assets/scripts/game/RaceManager.ts",
        "assets/scripts/game/HorseController.ts"
    )
    
    $missingFiles = @()
    foreach ($file in $requiredFiles) {
        if (Test-Path $file) {
            Write-Host "  ✅ $file"
        } else {
            Write-Host "  ❌ $file (缺失)"
            $missingFiles += $file
        }
    }
    
    if ($missingFiles.Count -gt 0) {
        Write-Host ""
        Write-Host "❌ 缺失关键文件，请补充:"
        $missingFiles | ForEach-Object { Write-Host "  - $_" }
        return
    }
    
    Write-Host ""
    Write-Host "✅ 项目构建检查完成"
    Write-Host "📋 下一步: 使用Cocos Creator打开项目进行完整构建"
}

function Clean-Project {
    Write-Host "🧹 清理临时文件..."
    
    $tempDirs = @("library", "temp", "build", "dist")
    
    foreach ($dir in $tempDirs) {
        if (Test-Path $dir) {
            Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "  ✅ 清理: $dir"
        }
    }
    
    # 清理TypeScript编译文件
    Get-ChildItem -Path "." -Recurse -Filter "*.js" -ErrorAction SilentlyContinue | Remove-Item -Force
    Get-ChildItem -Path "." -Recurse -Filter "*.js.map" -ErrorAction SilentlyContinue | Remove-Item -Force
    
    Write-Host ""
    Write-Host "✅ 清理完成"
}

function Check-Project {
    Write-Host "🔍 检查项目状态..."
    Write-Host ""
    
    # 项目基本信息
    Write-Host "📊 项目基本信息:"
    if (Test-Path "package.json") {
        $package = Get-Content "package.json" -Raw | ConvertFrom-Json
        Write-Host "  名称: $($package.name)"
        Write-Host "  版本: $($package.version)"
        Write-Host "  描述: $($package.description)"
    }
    
    Write-Host ""
    Write-Host "📁 目录结构检查:"
    
    # 检查目录
    $requiredDirs = @(
        "assets/scripts",
        "assets/resources", 
        "assets/scenes",
        "assets/animations"
    )
    
    foreach ($dir in $requiredDirs) {
        if (Test-Path $dir) {
            $itemCount = (Get-ChildItem $dir -Recurse -File -ErrorAction SilentlyContinue | Measure-Object).Count
            Write-Host "  ✅ $dir ($itemCount 个文件)"
        } else {
            Write-Host "  ⚠️  $dir (目录不存在)"
        }
    }
    
    Write-Host ""
    Write-Host "📝 脚本文件统计:"
    
    $scriptFiles = Get-ChildItem "assets/scripts" -Recurse -Filter "*.ts" -ErrorAction SilentlyContinue
    $scriptCount = ($scriptFiles | Measure-Object).Count
    Write-Host "  TypeScript文件: $scriptCount 个"
    
    if ($scriptCount -gt 0) {
        $totalSize = ($scriptFiles | Measure-Object -Property Length -Sum).Sum / 1KB
        Write-Host "  总大小: $([math]::Round($totalSize, 2)) KB"
        
        # 按目录统计
        Write-Host "  目录分布:"
        $scriptFiles | Group-Object Directory | Sort-Object Count -Descending | ForEach-Object {
            $dirName = $_.Name.Split('\')[-1]
            Write-Host "    - $dirName: $($_.Count) 个文件"
        }
    }
    
    Write-Host ""
    Write-Host "✅ 项目检查完成"
}

function Manage-Resources {
    Write-Host "🎨 资源文件管理..."
    Write-Host ""
    
    Write-Host "📁 资源目录结构:"
    
    $resourceDirs = @(
        "assets/resources/horses",
        "assets/resources/ui/buttons",
        "assets/resources/ui/icons",
        "assets/resources/ui/backgrounds",
        "assets/resources/audio/bgm",
        "assets/resources/audio/sfx",
        "assets/resources/fonts"
    )
    
    foreach ($dir in $resourceDirs) {
        if (Test-Path $dir) {
            $files = Get-ChildItem $dir -File -ErrorAction SilentlyContinue
            $fileCount = ($files | Measure-Object).Count
            $extensions = $files | Group-Object Extension | Select-Object -First 3
            
            $extInfo = ""
            if ($extensions) {
                $extInfo = " (" + ($extensions | ForEach-Object { "$($_.Name):$($_.Count)" }) -join ", " + ")"
            }
            
            Write-Host "  📂 $dir: $fileCount 个文件$extInfo"
        } else {
            Write-Host "  ⚠️  $dir (目录不存在)"
        }
    }
    
    Write-Host ""
    Write-Host "📋 资源状态:"
    
    # 检查是否有占位资源
    $hasResources = $false
    foreach ($dir in $resourceDirs) {
        if (Test-Path $dir) {
            $files = Get-ChildItem $dir -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -notmatch "README|placeholder" }
            if ($files) {
                $hasResources = $true
                break
            }
        }
    }
    
    if ($hasResources) {
        Write-Host "  ✅ 已添加游戏资源"
    } else {
        Write-Host "  ⚠️  尚未添加游戏资源，请将资源文件放入对应目录"
        Write-Host "     参考: assets\resources\README.txt"
    }
    
    Write-Host ""
    Write-Host "✅ 资源管理检查完成"
}

function Run-Tests {
    Write-Host "🧪 运行测试..."
    Write-Host ""
    
    Write-Host "📝 当前测试状态:"
    Write-Host "  ⚠️  测试框架尚未配置"
    Write-Host ""
    Write-Host "📋 建议的测试策略:"
    Write-Host "  1. 安装Jest测试框架"
    Write-Host "  2. 创建单元测试文件"
    Write-Host "  3. 配置测试脚本"
    Write-Host "  4. 集成到CI/CD流程"
    Write-Host ""
    Write-Host "🔧 可以执行以下命令开始:"
    Write-Host "  npm install --save-dev jest @types/jest ts-jest"
    Write-Host "  npx ts-jest config:init"
}

# 主程序
switch ($Command.ToLower()) {
    "help" { Show-Help }
    "setup" { Setup-Environment }
    "build" { Build-Project }
    "clean" { Clean-Project }
    "check" { Check-Project }
    "test" { Run-Tests }
    "resources" { Manage-Resources }
    default {
        Write-Host "❌ 未知命令: $Command"
        Write-Host ""
        Show-Help
    }
}

Write-Host ""
Write-Host "🏁 脚本执行完成"