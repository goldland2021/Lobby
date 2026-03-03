# 🚀 LobbyScene快速开始指南

## 📋 目标
在30分钟内创建一个简单可用的游戏大厅

## 🎯 核心功能
1. 显示游戏标题和欢迎信息
2. 显示用户积分
3. 提供开始游戏、设置、退出按钮
4. 实现基本的场景切换

## 🛠️ 10分钟快速设置

### 步骤1: 打开场景 (1分钟)
```
1. 打开Cocos Creator
2. 在资源管理器中: assets/scenes/
3. 双击: LobbyScene.scene
```

### 步骤2: 添加Canvas (2分钟)
```
1. 层级管理器 → 右键场景根节点
2. 选择: 创建节点 → 创建渲染节点 → Canvas
3. 重命名为: "Canvas"
4. 属性设置:
   - Design Resolution: 1920 x 1080
   - Fit Height: 勾选 ✅
   - Fit Width: 勾选 ✅
```

### 步骤3: 添加背景 (2分钟)
```
1. 右键Canvas → 创建节点 → 创建渲染节点 → Sprite
2. 重命名为: "Background"
3. 属性设置:
   - Position: X=0, Y=0
   - Size: 宽度 1920, 高度 1080
   - Color: R=30, G=30, B=60, A=255
```

### 步骤4: 添加标题 (2分钟)
```
1. 创建Label节点
2. 重命名为: "TitleLabel"
3. 属性设置:
   - Position: X=0, Y=300
   - String: "赛马游戏大厅"
   - FontSize: 72
   - Color: R=255, G=255, B=0, A=255
   - HorizontalAlign: CENTER
```

### 步骤5: 添加按钮 (3分钟)

#### 开始游戏按钮:
```
1. 创建Button节点
2. 重命名为: "StartButton"
3. 属性:
   - Position: X=0, Y=0
   - Size: 300 x 100
   - Color: R=0, G=150, B=255, A=255
4. 添加Label子节点:
   - String: "开始游戏"
   - FontSize: 36
   - Color: 白色
   - 居中对齐
```

#### 设置按钮:
```
1. 创建Button节点
2. 重命名为: "SettingsButton"
3. 属性:
   - Position: X=0, Y=-120
   - Size: 300 x 100
   - Color: R=100, G=100, B=100, A=255
4. 添加Label子节点:
   - String: "设置"
```

#### 退出按钮:
```
1. 创建Button节点
2. 重命名为: "ExitButton"
3. 属性:
   - Position: X=0, Y=-240
   - Size: 300 x 100
   - Color: R=255, G=50, B=50, A=255
4. 添加Label子节点:
   - String: "退出游戏"
```

## 🔧 5分钟脚本设置

### 步骤6: 添加LobbyUI脚本 (2分钟)
```
1. 选中Canvas节点
2. 属性检查器 → 添加组件
3. 选择: 用户脚本组件 → LobbyUI
```

### 步骤7: 连接UI引用 (3分钟)
```
在LobbyUI组件中:
1. welcomeLabel: 拖拽WelcomeLabel节点
2. scoreLabel: 拖拽ScoreLabel节点
3. startButton: 拖拽StartButton节点
4. settingsButton: 拖拽SettingsButton节点
5. exitButton: 拖拽ExitButton节点
```

## 🧪 5分钟测试

### 步骤8: 保存和运行 (2分钟)
```
1. 保存场景: Ctrl+S
2. 设置启动场景:
   - 菜单栏 → 项目 → 项目设置 → 启动场景
   - 选择: LobbyScene
3. 运行测试: 点击运行按钮 (或Ctrl+P)
```

### 步骤9: 功能测试 (3分钟)
```
测试项目:
1. ✅ 场景正常加载
2. ✅ 所有UI元素显示
3. ✅ 开始游戏按钮: 点击输出日志
4. ✅ 设置按钮: 点击弹出提示
5. ✅ 退出按钮: 点击弹出确认
```

## 📊 完成状态检查

### 基础完成 (15分钟):
- [ ] Canvas添加完成
- [ ] 背景添加完成
- [ ] 标题添加完成
- [ ] 3个按钮添加完成
- [ ] LobbyUI脚本挂载
- [ ] UI引用连接
- [ ] 场景保存
- [ ] 测试运行

### 扩展功能 (后续):
- [ ] 添加WelcomeLabel和ScoreLabel
- [ ] 优化视觉效果
- [ ] 添加音效
- [ ] 集成用户数据
- [ ] 添加动画效果

## 🆘 常见问题快速解决

### 问题1: 按钮不显示
```
解决: 检查按钮Position和Size
```

### 问题2: 脚本编译错误
```
解决: 检查TypeScript控制台错误
```

### 问题3: 场景切换失败
```
解决: 确认RaceScene.scene文件存在
```

## 🎨 简单颜色方案

```
背景: #1E1E3F (深蓝)
标题: #FFFF00 (黄色)
按钮:
  - 开始: #0096FF (蓝色)
  - 设置: #646464 (灰色)
  - 退出: #FF3232 (红色)
文字: #FFFFFF (白色)
```

## 📁 节点结构参考

```
Canvas
├── Background
├── TitleLabel
├── StartButton
│   └── StartButtonLabel
├── SettingsButton
│   └── SettingsButtonLabel
└── ExitButton
    └── ExitButtonLabel
```

## 🚀 立即开始

### 最简单的开始方式:
1. **只添加Canvas和3个按钮**
2. **测试基本功能**
3. **逐步完善其他元素**

### 预计时间分配:
- **基础UI**: 10分钟
- **脚本设置**: 5分钟
- **测试验证**: 5分钟
- **总计**: 20分钟

## 📞 需要帮助?

### 如果卡在某个步骤:
1. **截图显示当前状态**
2. **描述具体问题**
3. **我会提供针对性解决方案**

### 我可以:
1. **提供具体操作截图**
2. **分析错误信息**
3. **优化开发流程**
4. **解决技术难题**

---

**开始时间**: 现在  
**目标完成时间**: 20-30分钟  
**信心等级**: 高 (步骤明确，技术简单)  
**关键**: 先完成基础功能，再逐步优化