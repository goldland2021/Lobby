# 🎮 Cocos Creator 操作指南 - LobbyScene创建

## 📋 操作步骤（手动或自动化）

### 第一步：在Cocos Creator中操作

#### 1. 刷新资源管理器
```
操作: 在资源管理器面板右键 → 刷新 (或按F5)
目的: 让Cocos Creator识别新创建的LobbyScene.scene文件
```

#### 2. 打开LobbyScene场景
```
操作: 在资源管理器中双击 assets/scenes/LobbyScene.scene
目的: 在场景编辑器中打开游戏大厅场景
```

#### 3. 添加Canvas节点
```
操作: 在层级管理器中右键 → 创建节点 → 创建渲染节点 → Canvas
目的: 创建UI画布，所有UI元素将放在这里
```

#### 4. 设置Canvas属性
```
属性设置:
- Design Resolution: 1920 x 1080
- Fit Height: 勾选
- Fit Width: 勾选
```

### 第二步：添加UI元素

#### 1. 添加背景
```
操作: 在Canvas下右键 → 创建节点 → 创建渲染节点 → Sprite
重命名: Background
属性:
- SpriteFrame: 选择背景图片（可先用占位图）
- Size: 1920 x 1080
- Position: (0, 0)
```

#### 2. 添加标题文本
```
操作: 在Canvas下右键 → 创建节点 → 创建UI节点 → Label
重命名: TitleLabel
属性:
- String: "赛马游戏大厅"
- FontSize: 72
- Position: (0, 300)
- Color: #FFFFFF
- HorizontalAlign: CENTER
```

#### 3. 添加欢迎文本
```
操作: 创建Label节点
重命名: WelcomeLabel
属性:
- String: "欢迎来到赛马游戏!"
- FontSize: 36
- Position: (0, 200)
- Color: #FFFF00
```

#### 4. 添加积分文本
```
操作: 创建Label节点  
重命名: ScoreLabel
属性:
- String: "积分: 0"
- FontSize: 32
- Position: (0, 150)
- Color: #00FF00
```

#### 5. 添加开始游戏按钮
```
操作: 创建Button节点
重命名: StartButton
属性:
- Position: (0, 0)
- Size: 300 x 100
子节点Label属性:
- String: "开始游戏"
- FontSize: 36
- Color: #FFFFFF
```

#### 6. 添加设置按钮
```
操作: 创建Button节点
重命名: SettingsButton
属性:
- Position: (0, -120)
- Size: 300 x 100
子节点Label属性:
- String: "设置"
- FontSize: 36
```

#### 7. 添加退出按钮
```
操作: 创建Button节点
重命名: ExitButton
属性:
- Position: (0, -240)
- Size: 300 x 100
子节点Label属性:
- String: "退出游戏"
- FontSize: 36
```

### 第三步：添加脚本组件

#### 1. 添加LobbyUI脚本
```
操作: 选中Canvas节点
操作: 在属性检查器中点击"添加组件" → 用户脚本组件 → LobbyUI
```

#### 2. 连接UI引用
```
在LobbyUI组件中:
- welcomeLabel: 拖拽WelcomeLabel节点到这里
- scoreLabel: 拖拽ScoreLabel节点
- startButton: 拖拽StartButton节点
- settingsButton: 拖拽SettingsButton节点  
- exitButton: 拖拽ExitButton节点
```

### 第四步：保存和测试

#### 1. 保存场景
```
操作: 菜单栏 → 文件 → 保存场景 (Ctrl+S)
```

#### 2. 设置启动场景
```
操作: 菜单栏 → 项目 → 项目设置 → 启动场景
操作: 选择LobbyScene
```

#### 3. 运行测试
```
操作: 点击工具栏的"运行"按钮 (或按Ctrl+P)
目的: 测试场景是否正常加载，按钮是否可点击
```

## 🛠️ 自动化操作脚本

### PowerShell自动化脚本
```powershell
# 模拟键盘操作Cocos Creator
# 注意：这需要Cocos Creator窗口处于激活状态

# 1. 发送刷新快捷键 (F5)
[System.Windows.Forms.SendKeys]::SendWait("{F5}")
Start-Sleep -Seconds 1

# 2. 模拟鼠标双击打开场景
# 这需要精确的屏幕坐标，实际操作中较难自动化
```

### 替代方案：使用Cocos Creator命令行
```bash
# 构建项目（确保脚本编译）
cocos build --platform web-mobile

# 运行项目
cocos run --platform web-mobile
```

## 📁 文件结构确认

创建后应该有以下文件：
```
assets/
├── scenes/
│   └── LobbyScene.scene          # 场景文件
└── scripts/
    └── ui/
        ├── LobbyUI.ts            # 大厅UI脚本
        ├── RaceUI.ts             # 赛马UI脚本（已有）
        └── ResultUI.ts           # 结果UI脚本（待创建）
```

## 🧪 测试验证

### 场景加载测试
1. 运行游戏
2. 确认LobbyScene正常加载
3. 检查所有UI元素显示正确

### 功能测试
1. 点击"开始游戏"按钮
   - 应该输出日志"开始游戏按钮点击"
   - 应该尝试加载RaceScene（如果存在）

2. 点击"设置"按钮
   - 应该弹出提示"设置功能开发中..."

3. 点击"退出"按钮
   - 应该弹出确认对话框

### 脚本测试
1. 检查TypeScript编译是否有错误
2. 确认GameManager单例可以正常访问
3. 验证用户信息更新逻辑

## 🔧 故障排除

### 常见问题1：场景无法打开
```
症状: 双击.scene文件没有反应
解决: 
1. 检查文件格式是否正确
2. 重启Cocos Creator
3. 检查项目是否损坏
```

### 常见问题2：脚本编译错误
```
症状: 控制台显示TypeScript错误
解决:
1. 检查脚本语法
2. 确认导入路径正确
3. 清理TypeScript编译缓存
```

### 常见问题3：UI引用丢失
```
症状: LobbyUI组件显示"None"
解决:
1. 重新拖拽节点到属性框
2. 检查节点名称是否匹配
3. 确认节点在Canvas下
```

## 🚀 下一步操作

### 完成LobbyScene后：
1. **创建RaceScene** - 赛马比赛场景
2. **创建ResultScene** - 比赛结果场景  
3. **添加游戏资源** - 图片、音效等
4. **实现场景切换** - 完整的游戏流程

### 优化建议：
1. 添加场景过渡动画
2. 实现用户登录/注册
3. 添加游戏音效
4. 优化UI响应式设计

---
**操作指南版本**: 1.0  
**创建时间**: 2026-03-01  
**适用版本**: Cocos Creator 3.8.8