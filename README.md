# 🏇 Cherry Farm Horse Racing - Cocos 2D赛马小游戏

## 🎮 游戏简介
一个基于Cocos Creator开发的2D赛马小游戏，包含完整的游戏逻辑、网络集成和用户界面。

## 📁 项目结构
```
G:\CherryFarm\openclaw\
├── assets/                    # 游戏资源
│   ├── scripts/              # TypeScript脚本
│   │   ├── core/             # 核心系统
│   │   ├── game/             # 游戏逻辑
│   │   ├── model/            # 数据模型
│   │   ├── network/          # 网络模块
│   │   ├── types/            # 类型定义
│   │   └── ui/               # 用户界面
│   └── resources/            # 静态资源(待创建)
├── library/                  # Cocos库文件
├── settings/                 # 项目设置
├── temp/                     # 临时文件
├── .gitignore               # Git忽略文件
├── package.json             # 项目配置
├── tsconfig.json            # TypeScript配置
└── README.md                # 本文件
```

## 🚀 快速开始

### 环境要求
- Cocos Creator 3.8.0+
- Node.js 16.0.0+
- TypeScript 5.0.0+

### 开发步骤
1. 使用Cocos Creator打开本项目
2. 等待依赖安装完成
3. 点击运行按钮开始游戏

## 💻 核心功能

### 已实现功能
- ✅ 游戏状态管理 (GameManager)
- ✅ 赛马逻辑控制 (RaceManager)
- ✅ 赛马动画系统 (HorseController)
- ✅ 用户界面管理 (RaceUI, LobbyUI, ResultUI)
- ✅ 网络API集成 (ApiClient)
- ✅ 用户认证系统 (AuthService)

### 待开发功能
- 🔄 游戏资源补充 (图片、音效、动画)
- 🔄 多种游戏模式
- 🔄 道具和技能系统
- 🔄 用户排名和成就
- 🔄 多平台发布

## 🛠️ 开发指南

### 代码规范
- 使用TypeScript严格模式
- 遵循Cocos Creator最佳实践
- 模块化设计，单一职责原则
- 完善的错误处理和日志

### 脚本说明
#### 核心系统 (core/)
- `GameManager.ts` - 全局游戏管理器
- `Config.ts` - 游戏配置常量

#### 游戏逻辑 (game/)
- `RaceManager.ts` - 赛马比赛管理
- `HorseController.ts` - 赛马控制

#### 用户界面 (ui/)
- `LobbyUI.ts` - 游戏大厅界面
- `RaceUI.ts` - 赛马比赛界面
- `ResultUI.ts` - 比赛结果界面

#### 网络模块 (network/)
- `ApiClient.ts` - API客户端
- `AuthService.ts` - 用户认证

## 📊 项目进度

### 当前状态
- **架构设计**: ✅ 完成
- **核心代码**: ✅ 完成
- **游戏资源**: 🔄 进行中
- **测试覆盖**: 🔄 进行中
- **发布准备**: 🔄 进行中

### 开发计划
1. **第一阶段**: 完善项目基础配置 (今天)
2. **第二阶段**: 补充游戏资源和素材 (1-2天)
3. **第三阶段**: 扩展游戏功能和模式 (3-5天)
4. **第四阶段**: 测试优化和发布准备 (2-3天)

## 🤝 贡献指南

### 开发流程
1. Fork本项目
2. 创建功能分支 (`git checkout -b feature/新功能`)
3. 提交更改 (`git commit -m '添加新功能'`)
4. 推送到分支 (`git push origin feature/新功能`)
5. 创建Pull Request

### 代码提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具变动

## 📞 技术支持

### 开发者
- **姓名**: 白昱
- **角色**: 项目负责人
- **技术支持**: 小白 (OpenClaw AI助手)

### 问题反馈
1. 查看 [Issues](https://github.com/your-repo/issues) 页面
2. 创建新的Issue描述问题
3. 提供复现步骤和环境信息

## 📄 许可证
本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🎯 未来规划
- 添加多人对战模式
- 集成区块链技术
- 开发移动端应用
- 创建游戏社区

---
**最后更新**: 2026-03-01  
**版本**: 1.0.0  
**状态**: 活跃开发中