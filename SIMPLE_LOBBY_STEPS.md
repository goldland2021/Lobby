# 🎮 LobbyScene最简单操作步骤

## 第一步：打开Cocos Creator和场景
1. 打开Cocos Creator软件
2. 在左侧"资源管理器"中找到：`assets/scenes/`
3. 双击 `LobbyScene.scene` 打开场景

## 第二步：添加Canvas（UI画布）
1. 在右侧"层级管理器"中，右键点击最顶层的节点
2. 选择：创建节点 → 创建渲染节点 → Canvas
3. 在右侧"属性检查器"中设置：
   - Design Resolution: 宽度 1920, 高度 1080
   - Fit Height: 打勾 ✅
   - Fit Width: 打勾 ✅

## 第三步：添加背景颜色
1. 在"层级管理器"中，右键点击 Canvas 节点
2. 选择：创建节点 → 创建渲染节点 → Sprite
3. 重命名为：Background
4. 在"属性检查器"中设置：
   - Position: X=0, Y=0
   - Size: 宽度 1920, 高度 1080
   - Color: 点击颜色框，选择深蓝色（R=30, G=30, B=60）

## 第四步：添加游戏标题
1. 右键点击 Canvas → 创建节点 → 创建UI节点 → Label
2. 重命名为：TitleLabel
3. 属性设置：
   - Position: X=0, Y=300
   - String: 输入"赛马游戏大厅"
   - FontSize: 72
   - Color: 选择黄色（R=255, G=255, B=0）
   - HorizontalAlign: 选择 CENTER

## 第五步：添加开始游戏按钮
1. 右键点击 Canvas → 创建节点 → 创建UI节点 → Button
2. 重命名为：StartButton
3. 属性设置：
   - Position: X=0, Y=0
   - Size: 宽度 300, 高度 100
   - Color: 选择蓝色（R=0, G=150, B=255）

## 第六步：添加按钮文字
1. 在"层级管理器"中，点击 StartButton 前面的小箭头展开
2. 右键点击 StartButton → 创建节点 → 创建UI节点 → Label
3. 属性设置：
   - String: 输入"开始游戏"
   - FontSize: 36
   - Color: 选择白色
   - HorizontalAlign: CENTER
   - VerticalAlign: MIDDLE

## 第七步：复制创建其他按钮
1. 在"层级管理器"中，右键点击 StartButton → 复制
2. 右键点击 Canvas → 粘贴
3. 重命名为：SettingsButton
4. 修改属性：
   - Position: X=0, Y=-120
   - Color: 选择灰色（R=100, G=100, B=100）
5. 修改按钮下的Label文字为："设置"

6. 再次复制创建 ExitButton
7. 修改属性：
   - Position: X=0, Y=-240
   - Color: 选择红色（R=255, G=50, B=50）
8. 修改按钮下的Label文字为："退出游戏"

## 第八步：添加LobbyUI脚本
1. 在"层级管理器"中，点击选中 Canvas 节点
2. 在右侧"属性检查器"最下方，点击"添加组件"按钮
3. 选择：用户脚本组件 → LobbyUI

## 第九步：连接UI引用
1. 在LobbyUI组件属性中，找到 welcomeLabel
2. 从"层级管理器"中拖拽 WelcomeLabel 节点到 welcomeLabel 的输入框
3. 同样方法连接：
   - scoreLabel → ScoreLabel（可以先不连接）
   - startButton → StartButton
   - settingsButton → SettingsButton
   - exitButton → ExitButton

## 第十步：保存和测试
1. 按 Ctrl+S 保存场景
2. 点击顶部工具栏的"运行"按钮（三角形图标）
3. 测试按钮：
   - 点击"开始游戏"：查看控制台输出
   - 点击"设置"：应该弹出提示
   - 点击"退出"：应该弹出确认框

## 📝 完成检查清单
- [ ] Canvas添加完成
- [ ] 背景添加完成
- [ ] 标题添加完成
- [ ] 开始游戏按钮添加完成
- [ ] 设置按钮添加完成
- [ ] 退出按钮添加完成
- [ ] LobbyUI脚本添加完成
- [ ] 按钮引用连接完成
- [ ] 场景保存完成
- [ ] 测试运行通过

## 🆘 遇到问题？
1. **按钮不显示**：检查Position和Size
2. **脚本错误**：查看底部"控制台"面板
3. **无法保存**：检查文件权限
4. **其他问题**：截图发给我

## ⏱️ 预计时间
- 新手：30-40分钟
- 有经验：15-20分钟

## 🎯 最简单的开始
如果时间有限，只完成：
1. ✅ Canvas
2. ✅ 开始游戏按钮
3. ✅ LobbyUI脚本
4. ✅ 测试运行

这样就有基本可用的游戏大厅了！

---
**开始吧！完成一步打一个勾 ✅**