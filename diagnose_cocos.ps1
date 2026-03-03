# Cocos Creator项目诊断脚本
# 用于诊断场景文件错误和项目配置问题

param(
    [string]$Action = "check"
)

function Show-Header {
    Write-Host "🔍 Cocos Creator项目诊断工具" -ForegroundColor Cyan
    Write-Host "=" * 60
    Write-Host "项目路径: $(Get-Location)"
    Write-Host "诊断时间: $(Get-Date)"
    Write-Host ""
}

function Check-SceneFiles {
    Write-Host "📁 场景文件检查" -ForegroundColor Yellow
    Write-Host "-" * 40
    
    $scenesDir = "assets\scenes"
    if (-not (Test-Path $scenesDir)) {
        Write-Host "❌ scenes目录不存在" -ForegroundColor Red
        return
    }
    
    $sceneFiles = Get-ChildItem $scenesDir -Filter "*.scene" -ErrorAction SilentlyContinue
    if ($sceneFiles.Count -eq 0) {
        Write-Host "❌ 未找到.scene文件" -ForegroundColor Red
        return
    }
    
    Write-Host "找到 $($sceneFiles.Count) 个场景文件:" -ForegroundColor Green
    
    foreach ($file in $sceneFiles) {
        Write-Host "`n📄 $($file.Name):" -ForegroundColor Cyan
        Write-Host "  路径: $($file.FullName)"
        Write-Host "  大小: $($file.Length) bytes"
        Write-Host "  修改时间: $($file.LastWriteTime)"
        
        # 检查文件内容
        try {
            $content = Get-Content $file.FullName -Raw -ErrorAction Stop
            $json = $content | ConvertFrom-Json -ErrorAction Stop
            
            Write-Host "  ✅ JSON格式有效" -ForegroundColor Green
            
            # 检查必需字段
            $hasType = $json.PSObject.Properties.Name -contains "__type__"
            $hasName = $json.PSObject.Properties.Name -contains "_name"
            $hasScene = $json.PSObject.Properties.Name -contains "scene"
            
            if ($hasType -and $hasName -and $hasScene) {
                Write-Host "  ✅ 包含必需字段" -ForegroundColor Green
                
                # 检查场景名称
                if ($json._name -eq $file.BaseName) {
                    Write-Host "  ✅ 场景名称匹配" -ForegroundColor Green
                } else {
                    Write-Host "  ⚠️  场景名称不匹配: $($json._name) vs $($file.BaseName)" -ForegroundColor Yellow
                }
                
                # 检查UUID格式
                if ($json.scene.uuid -match '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$') {
                    Write-Host "  ✅ UUID格式正确" -ForegroundColor Green
                } else {
                    Write-Host "  ⚠️  UUID格式可能有问题: $($json.scene.uuid)" -ForegroundColor Yellow
                }
            } else {
                Write-Host "  ❌ 缺少必需字段" -ForegroundColor Red
                Write-Host "     __type__: $(if($hasType){'✅'}else{'❌'})"
                Write-Host "     _name: $(if($hasName){'✅'}else{'❌'})"
                Write-Host "     scene: $(if($hasScene){'✅'}else{'❌'})"
            }
            
        } catch {
            Write-Host "  ❌ JSON解析失败: $_" -ForegroundColor Red
            
            # 显示文件开头内容
            if ($content) {
                $preview = $content.Substring(0, [Math]::Min(100, $content.Length))
                Write-Host "  文件开头: $preview..."
            }
        }
    }
}

function Check-ProjectConfig {
    Write-Host "`n⚙️ 项目配置检查" -ForegroundColor Yellow
    Write-Host "-" * 40
    
    $requiredFiles = @(
        @{Name="package.json"; Description="项目包配置"},
        @{Name="tsconfig.json"; Description="TypeScript配置"},
        @{Name="settings\project.json"; Description="项目设置"},
        @{Name="assets"; Description="资源目录"},
        @{Name="library"; Description="Cocos库目录"},
        @{Name="temp"; Description="临时目录"}
    )
    
    foreach ($file in $requiredFiles) {
        $path = $file.Name
        $desc = $file.Description
        
        if (Test-Path $path) {
            if (Test-Path $path -PathType Container) {
                $itemCount = (Get-ChildItem $path -ErrorAction SilentlyContinue | Measure-Object).Count
                Write-Host "  ✅ $desc ($path): $itemCount 个项目" -ForegroundColor Green
            } else {
                $size = (Get-Item $path).Length
                Write-Host "  ✅ $desc ($path): $size bytes" -ForegroundColor Green
            }
        } else {
            Write-Host "  ❌ $desc ($path): 缺失" -ForegroundColor Red
        }
    }
}

function Check-TypeScript {
    Write-Host "`n💻 TypeScript检查" -ForegroundColor Yellow
    Write-Host "-" * 40
    
    # 检查tsconfig.json
    if (Test-Path "tsconfig.json") {
        try {
            $tsconfig = Get-Content "tsconfig.json" -Raw | ConvertFrom-Json -ErrorAction Stop
            Write-Host "  ✅ tsconfig.json 有效" -ForegroundColor Green
            
            if ($tsconfig.compilerOptions) {
                Write-Host "  编译器选项:" -ForegroundColor Cyan
                $tsconfig.compilerOptions.PSObject.Properties | ForEach-Object {
                    Write-Host "    $($_.Name): $($_.Value)"
                }
            }
        } catch {
            Write-Host "  ❌ tsconfig.json 解析失败: $_" -ForegroundColor Red
        }
    }
    
    # 检查脚本目录
    $scriptsDir = "assets\scripts"
    if (Test-Path $scriptsDir) {
        $tsFiles = Get-ChildItem $scriptsDir -Recurse -Filter "*.ts" -ErrorAction SilentlyContinue
        $tsCount = ($tsFiles | Measure-Object).Count
        
        Write-Host "  📝 TypeScript文件: $tsCount 个" -ForegroundColor Cyan
        
        if ($tsCount -gt 0) {
            # 按目录分组
            $byDir = $tsFiles | Group-Object Directory | Sort-Object Count -Descending
            
            Write-Host "  目录分布:" -ForegroundColor Cyan
            foreach ($group in $byDir) {
                $dirName = $group.Name.Split('\')[-1]
                Write-Host "    $dirName: $($group.Count) 个文件"
            }
            
            # 检查是否有编译错误
            Write-Host "`n  🔧 尝试编译检查..." -ForegroundColor Cyan
            try {
                $compileResult = tsc --noEmit 2>&1
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "    ✅ TypeScript编译检查通过" -ForegroundColor Green
                } else {
                    Write-Host "    ❌ TypeScript编译有错误:" -ForegroundColor Red
                    $compileResult | Select-String -Pattern "error" | ForEach-Object {
                        Write-Host "      $_" -ForegroundColor Red
                    }
                }
            } catch {
                Write-Host "    ⚠️  无法运行TypeScript编译器: $_" -ForegroundColor Yellow
            }
        }
    }
}

function Check-VSCode {
    Write-Host "`n🔧 VSCode配置检查" -ForegroundColor Yellow
    Write-Host "-" * 40
    
    $vscodeDir = ".vscode"
    if (Test-Path $vscodeDir) {
        Write-Host "  ✅ .vscode目录存在" -ForegroundColor Green
        
        $vscodeFiles = Get-ChildItem $vscodeDir -File
        Write-Host "  配置文件 ($($vscodeFiles.Count) 个):" -ForegroundColor Cyan
        
        foreach ($file in $vscodeFiles) {
            Write-Host "    $($file.Name): $($file.Length) bytes"
        }
    } else {
        Write-Host "  ⚠️  .vscode目录不存在，建议创建" -ForegroundColor Yellow
    }
}

function Generate-FixScript {
    Write-Host "`n🛠️ 生成修复脚本" -ForegroundColor Yellow
    Write-Host "-" * 40
    
    $fixScript = @'
# Cocos Creator场景文件修复脚本
# 自动修复常见的场景文件问题

Write-Host "开始修复Cocos Creator场景文件..." -ForegroundColor Cyan

# 1. 确保目录存在
$scenesDir = "assets\scenes"
if (-not (Test-Path $scenesDir)) {
    New-Item -ItemType Directory -Path $scenesDir -Force | Out-Null
    Write-Host "创建scenes目录" -ForegroundColor Green
}

# 2. 修复LobbyScene
$lobbyScene = @'
{
  "__type__": "cc.SceneAsset",
  "_name": "LobbyScene",
  "_objFlags": 0,
  "_native": "",
  "scene": {
    "__type__": "cc.Scene",
    "_name": "LobbyScene",
    "_objFlags": 0,
    "_native": "",
    "uuid": "12345678-1234-1234-1234-123456789012",
    "_children": [],
    "_components": [],
    "_prefab": null
  }
}
'@

$lobbyScene | Out-File "$scenesDir\LobbyScene.scene" -Encoding UTF8 -Force
Write-Host "修复LobbyScene.scene" -ForegroundColor Green

# 3. 创建VSCode配置
$vscodeDir = ".vscode"
if (-not (Test-Path $vscodeDir)) {
    New-Item -ItemType Directory -Path $vscodeDir -Force | Out-Null
}

# 4. 建议操作
Write-Host "`n建议操作:" -ForegroundColor Yellow
Write-Host "1. 在Cocos Creator中按F5刷新资源管理器" -ForegroundColor Cyan
Write-Host "2. 检查场景文件叹号是否消失" -ForegroundColor Cyan
Write-Host "3. 如果还有问题，检查控制台错误信息" -ForegroundColor Cyan
Write-Host "4. 确保Cocos Creator版本兼容" -ForegroundColor Cyan

Write-Host "`n修复完成!" -ForegroundColor Green
'@
    
    $fixScript | Out-File "fix_cocos_scenes.ps1" -Encoding UTF8
    Write-Host "✅ 生成修复脚本: fix_cocos_scenes.ps1" -ForegroundColor Green
    Write-Host "运行: .\fix_cocos_scenes.ps1" -ForegroundColor Cyan
}

# 主程序
Show-Header

switch ($Action.ToLower()) {
    "check" {
        Check-SceneFiles
        Check-ProjectConfig
        Check-TypeScript
        Check-VSCode
    }
    "fix" {
        Generate-FixScript
    }
    "all" {
        Check-SceneFiles
        Check-ProjectConfig
        Check-TypeScript
        Check-VSCode
        Generate-FixScript
    }
    default {
        Write-Host "未知操作: $Action" -ForegroundColor Red
        Write-Host "可用操作: check, fix, all" -ForegroundColor Yellow
    }
}

Write-Host "`n" + "=" * 60
Write-Host "诊断完成!" -ForegroundColor Cyan
Write-Host "如果还有问题，请提供:" -ForegroundColor Yellow
Write-Host "1. Cocos Creator控制台错误信息" -ForegroundColor Cyan
Write-Host "2. 场景文件的具体错误提示" -ForegroundColor Cyan
Write-Host "3. Cocos Creator版本信息" -ForegroundColor Cyan