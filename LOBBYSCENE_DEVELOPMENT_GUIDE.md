# 🎮 LobbyScene游戏大厅开发指南

## 📋 开发目标
创建一个简单但可用的游戏大厅，包含基本UI元素和功能。

## 🎯 功能需求

### 核心功能：
1. **欢迎信息显示** - 显示用户欢迎语
2. **积分显示** - 显示用户当前积分
3. **开始游戏按钮** - 跳转到赛马场景
4. **设置按钮** - 打开设置界面（占位）
5. **退出按钮** - 退出游戏确认

### 用户体验：
1. **简洁明了的界面**
2. **响应式按钮交互**
3. **友好的视觉设计**
4. **流畅的场景切换**

## 🛠️ 开发步骤

### 第一步：在Cocos Creator中打开LobbyScene

#### 操作步骤：
```
1. 打开Cocos Creator
2. 在资源管理器中导航到: assets/scenes/
3. 双击LobbyScene.scene打开场景
4. 场景编辑器中将显示空场景
```

### 第二步：添加Canvas节点（UI画布）

#### 操作步骤：
```
1. 在层级管理器中，右键点击场景根节点
2. 选择"创建节点" → "创建渲染节点" → "Canvas"
3. 重命名节点为: "Canvas"
```

#### Canvas属性设置：
```
- Design Resolution: 宽度 1920, 高度 1080
- Fit Height: 勾选 ✅
- Fit Width: 勾选 ✅
- 其他属性保持默认
```

### 第三步：添加背景

#### 操作步骤：
```
1. 在层级管理器中，右键点击Canvas节点
2. 选择"创建节点" → "创建渲染节点" → "Sprite"
3. 重命名节点为: "Background"
```

#### Background属性设置：
```
- Position: X=0, Y=0
- Size: 宽度 1920, 高度 1080
- Color: R=30, G=30, B=60, A=255 (深蓝色背景)
- 或者: 选择一张背景图片（如果有）
```

### 第四步：添加标题

#### 操作步骤：
```
1. 在Canvas下右键 → "创建节点" → "创建UI节点" → "Label"
2. 重命名节点为: "TitleLabel"
```

#### TitleLabel属性设置：
```
- Position: X=0, Y=300
- String: "赛马游戏大厅"
- FontSize: 72
- Color: R=255, G=255, B=0, A=255 (黄色)
- HorizontalAlign: CENTER
- VerticalAlign: MIDDLE
```

### 第五步：添加欢迎信息

#### 操作步骤：
```
1. 创建Label节点
2. 重命名为: "WelcomeLabel"
```

#### WelcomeLabel属性设置：
```
- Position: X=0, Y=200
- String: "欢迎来到赛马游戏!"
- FontSize: 36
- Color: R=255, G=255, B=255, A=255 (白色)
- HorizontalAlign: CENTER
```

### 第六步：添加积分显示

#### 操作步骤：
```
1. 创建Label节点
2. 重命名为: "ScoreLabel"
```

#### ScoreLabel属性设置：
```
- Position: X=0, Y=150
- String: "积分: 0"
- FontSize: 32
- Color: R=0, G=255, B=0, A=255 (绿色)
- HorizontalAlign: CENTER
```

### 第七步：添加开始游戏按钮

#### 操作步骤：
```
1. 创建Button节点
2. 重命名为: "StartButton"
```

#### StartButton属性设置：
```
- Position: X=0, Y=0
- Size: 宽度 300, 高度 100
- Color: R=0, G=150, B=255, A=255 (蓝色)
```

#### 添加按钮文字（子节点）：
```
1. 在StartButton节点上右键 → "创建节点" → "创建UI节点" → "Label"
2. 重命名为: "StartButtonLabel"
3. 属性设置:
   - String: "开始游戏"
   - FontSize: 36
   - Color: R=255, G=255, B=255, A=255 (白色)
   - HorizontalAlign: CENTER
   - VerticalAlign: MIDDLE
```

### 第八步：添加设置按钮

#### 操作步骤：
```
1. 创建Button节点
2. 重命名为: "SettingsButton"
```

#### SettingsButton属性设置：
```
- Position: X=0, Y=-120
- Size: 宽度 300, 高度 100
- Color: R=100, G=100, B=100, A=255 (灰色)
```

#### 添加按钮文字：
```
1. 创建Label子节点
2. 重命名为: "SettingsButtonLabel"
3. 属性设置:
   - String: "设置"
   - FontSize: 36
   - Color: R=255, G=255, B=255, A=255
```

### 第九步：添加退出按钮

#### 操作步骤：
```
1. 创建Button节点
2. 重命名为: "ExitButton"
```

#### ExitButton属性设置：
```
- Position: X=0, Y=-240
- Size: 宽度 300, 高度 100
- Color: R=255, G=50, B=50, A=255 (红色)
```

#### 添加按钮文字：
```
1. 创建Label子节点
2. 重命名为: "ExitButtonLabel"
3. 属性设置:
   - String: "退出游戏"
   - FontSize: 36
   - Color: R=255, G=255, B=255, A=255
```

### 第十步：添加LobbyUI脚本组件

#### 操作步骤：
```
1. 在层级管理器中选中Canvas节点
2. 在属性检查器中，点击"添加组件"按钮
3. 选择"用户脚本组件" → "LobbyUI"
```

### 第十一步：连接UI元素引用

#### 操作步骤：
```
在LobbyUI组件属性中：
1. welcomeLabel: 拖拽WelcomeLabel节点到该属性框
2. scoreLabel: 拖拽ScoreLabel节点
3. startButton: 拖拽StartButton节点
4. settingsButton: 拖拽SettingsButton节点
5. exitButton: 拖拽ExitButton节点
```

### 第十二步：保存和测试

#### 操作步骤：
```
1. 保存场景: 菜单栏 → 文件 → 保存场景 (Ctrl+S)
2. 设置启动场景: 菜单栏 → 项目 → 项目设置 → 启动场景 → 选择LobbyScene
3. 运行测试: 点击工具栏的"运行"按钮 (或按Ctrl+P)
```

## 🧪 功能测试

### 测试项目：
1. **场景加载测试**
   - ✅ LobbyScene正常加载
   - ✅ 所有UI元素显示正确

2. **按钮功能测试**
   - ✅ 开始游戏按钮: 点击后输出日志"开始游戏按钮点击"
   - ✅ 设置按钮: 点击后弹出提示"设置功能开发中..."
   - ✅ 退出按钮: 点击后弹出确认对话框

3. **脚本功能测试**
   - ✅ LobbyUI脚本正常挂载
   - ✅ UI引用连接正确
   - ✅ 按钮事件绑定正常

## 🔧 故障排除

### 常见问题1：UI元素不显示
```
原因: Canvas设置不正确或节点层级问题
解决:
1. 检查Canvas的Design Resolution设置
2. 确认UI节点在Canvas下
3. 检查节点Position和Size
```

### 常见问题2：按钮不响应
```
原因: 事件绑定失败或脚本连接问题
解决:
1. 检查LobbyUI脚本是否挂载到Canvas
2. 确认UI引用连接正确
3. 检查按钮的Interactable属性是否为true
```

### 常见问题3：场景切换失败
```
原因: 场景名称错误或场景不存在
解决:
1. 确认RaceScene.scene文件存在
2. 检查场景名称拼写
3. 确保场景文件格式正确
```

## 🎨 视觉优化建议

### 颜色方案：
```
主色调: 深蓝色背景 (#1E1E3F)
强调色: 亮黄色 (#FFFF00)
按钮颜色: 
  - 开始游戏: 蓝色 (#0096FF)
  - 设置: 灰色 (#646464)
  - 退出: 红色 (#FF3232)
文字颜色: 白色 (#FFFFFF)
```

### 布局优化：
```
垂直居中布局，所有元素在屏幕中央
按钮间距: 120像素
字体大小层次:
  - 标题: 72px
  - 副标题: 36px
  - 内容: 32px
  - 按钮文字: 36px
```

## 📁 文件结构确认

### 完成后的节点结构：
```
Canvas
├── Background (Sprite)
├── TitleLabel (Label)
├── WelcomeLabel (Label)
├── ScoreLabel (Label)
├── StartButton (Button)
│   └── StartButtonLabel (Label)
├── SettingsButton (Button)
│   └── SettingsButtonLabel (Label)
└── ExitButton (Button)
    └── ExitButtonLabel (Label)
```

### 脚本关联：
```
Canvas节点挂载: LobbyUI脚本
脚本连接:
  - welcomeLabel → WelcomeLabel
  - scoreLabel → ScoreLabel
  - startButton → StartButton
  - settingsButton → SettingsButton
  - exitButton → ExitButton
```

## 🚀 快速开始脚本

如果您想快速创建基础UI，可以使用以下PowerShell脚本创建占位资源：

```powershell
# 创建简单的占位图片
# 保存为: create_placeholder_resources.ps1
```

## 📞 需要帮助？

### 如果无法完成某个步骤：
1. **截图显示问题** - 让我看到具体问题
2. **描述操作过程** - 告诉我您做了什么
3. **提供错误信息** - 复制控制台错误

### 我可以帮助您：
1. **提供具体代码示例**
2. **分析错误原因**
3. **优化UI设计**
4. **调试功能问题**

## 🏆 完成标准

### 基础完成（可运行）：
- ✅ Canvas节点添加完成
- ✅ 所有UI元素添加完成
- ✅ LobbyUI脚本挂载完成
- ✅ UI引用连接完成
- ✅ 场景可以正常运行
- ✅ 按钮基本功能正常

### 优化完成（良好体验）：
- ✅ 视觉设计优化
- ✅ 响应式布局
- ✅ 动画效果
- ✅ 音效添加
- ✅ 用户数据集成

---

**指南版本**: 1.0  
**创建时间**: 2026-03-02  
**适用版本**: Cocos Creator 3.8.8  
**预计完成时间**: 30-60分钟