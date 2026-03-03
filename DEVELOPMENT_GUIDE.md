# 🛠️ Cocos 2D赛马游戏开发指南

## 📋 开发环境设置

### 1. 软件要求
- **Cocos Creator**: 3.8.0 或更高版本
- **Node.js**: 16.0.0 或更高版本
- **TypeScript**: 5.0.0 或更高版本
- **Git**: 版本控制工具

### 2. 项目初始化
```bash
# 克隆项目（如果使用Git）
git clone <repository-url>
cd cherry-farm-horse-race

# 使用Cocos Creator打开项目
# 1. 启动Cocos Creator
# 2. 选择"打开其他项目"
# 3. 导航到项目目录并打开
```

### 3. 依赖安装
Cocos Creator会自动管理依赖，确保：
- Cocos Creator编辑器已安装TypeScript支持
- 项目设置中TypeScript配置正确

## 🏗️ 项目架构详解

### 核心架构图
```
┌─────────────────────────────────────────────┐
│                GameManager                  │
│  (单例模式，全局状态管理)                   │
└─────────────────┬───────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼────┐  ┌────▼────┐  ┌─────▼──────┐
│RaceManager │HorseController│   RaceUI    │
│(赛马逻辑)  │(赛马控制)    │(用户界面)   │
└──────────┘  └──────────┘  └───────────┘
```

### 1. GameManager (核心管理器)
**职责**: 全局游戏状态管理、场景切换、数据持久化
```typescript
// 关键方法
- getInstance(): GameManager      // 获取单例实例
- setUser(user: IUser): void      // 设置当前用户
- loadScene(sceneName: string): void // 加载场景
```

### 2. RaceManager (赛马管理器)
**职责**: 赛马比赛逻辑、网络请求、结果验证
```typescript
// 关键状态
enum RaceState {
  Idle,        // 空闲
  Requesting,  // 请求中
  Racing,      // 比赛中
  Finished     // 已完成
}

// 关键方法
- startRace(): Promise<PlayResult>  // 开始比赛
- validateResult(result): void      // 验证结果
```

### 3. HorseController (赛马控制器)
**职责**: 赛马动画控制、位置管理
```typescript
// 关键方法
- resetToStart(): void             // 重置到起点
- startRace(rankIndex): Promise<void> // 开始赛跑
```

## 🎨 资源管理规范

### 1. 图片资源
```
assets/resources/
├── horses/          # 赛马图片
│   ├── horse_red.png
│   ├── horse_blue.png
│   └── horse_green.png
├── ui/              # 界面元素
│   ├── buttons/
│   ├── icons/
│   └── backgrounds/
└── effects/         # 特效图片
```

### 2. 音效资源
```
assets/resources/audio/
├── bgm/            # 背景音乐
│   ├── lobby.mp3
│   └── race.mp3
├── sfx/            # 音效
│   ├── horse_run.mp3
│   ├── button_click.mp3
│   └── victory.mp3
└── voice/          # 语音
```

### 3. 动画资源
- 使用Cocos Creator的动画编辑器
- 帧动画放在`assets/animations/`
- 骨骼动画放在`assets/spine/`

## 💻 代码开发规范

### 1. TypeScript规范
```typescript
// ✅ 正确示例
import { _decorator, Component } from "cc";

@ccclass("MyComponent")
export class MyComponent extends Component {
  private privateField: string = "";
  public publicField: number = 0;
  
  protected onLoad(): void {
    // 初始化逻辑
  }
  
  public doSomething(param: string): boolean {
    // 业务逻辑
    return true;
  }
}

// ❌ 避免
// 1. 使用any类型
// 2. 忽略错误处理
// 3. 硬编码魔法数字
```

### 2. 错误处理规范
```typescript
// ✅ 完善的错误处理
public async startRace(): Promise<PlayResult> {
  try {
    if (this.state !== RaceState.Idle) {
      throw new Error("Race is already running");
    }
    
    const result = await ApiClient.play();
    this.validateResult(result);
    
    // 业务逻辑...
    return result;
  } catch (error) {
    console.error("Race failed:", error);
    this.state = RaceState.Idle;
    throw error; // 重新抛出或处理
  }
}
```

### 3. 性能优化建议
```typescript
// 1. 对象池管理
private horsePool: HorseController[] = [];

// 2. 资源预加载
director.preloadScene("RaceScene");

// 3. 避免每帧创建对象
// 使用对象复用
```

## 🧪 测试策略

### 1. 单元测试
```typescript
// 使用Jest或Mocha
describe("RaceManager", () => {
  test("should validate correct result", () => {
    const manager = new RaceManager();
    const validResult = { ranks: [0, 1, 2, 3, 4, 5], winner: 0 };
    
    expect(() => manager.validateResult(validResult)).not.toThrow();
  });
});
```

### 2. 集成测试
- 场景加载测试
- 网络请求模拟
- UI交互测试

### 3. 性能测试
- 内存使用监控
- 帧率测试
- 加载时间测试

## 🔧 常用开发命令

### 1. 构建命令
```bash
# 开发构建
cocos build --platform web-mobile --build-path ./build/web

# 发布构建
cocos build --platform android --release --build-path ./build/android
```

### 2. 代码检查
```bash
# TypeScript编译检查
tsc --noEmit

# 代码格式化
prettier --write "assets/scripts/**/*.ts"
```

### 3. 资源处理
```bash
# 压缩图片
texture-compressor --input ./assets/textures --output ./assets/compressed

# 生成图集
atlas-generator --input ./assets/sprites --output ./assets/atlases
```

## 🚀 发布流程

### 1. 预发布检查
- [ ] 所有功能测试通过
- [ ] 性能测试达标
- [ ] 资源优化完成
- [ ] 错误处理完善

### 2. 构建配置
```json
// settings/build.json
{
  "platform": "web-mobile",
  "buildPath": "./build",
  "debug": false,
  "sourceMaps": false,
  "previewWidth": 1280,
  "previewHeight": 720
}
```

### 3. 发布步骤
1. 更新版本号 (`package.json`)
2. 生成构建文件
3. 上传到服务器/CDN
4. 更新版本说明

## 📚 学习资源

### 官方文档
- [Cocos Creator手册](https://docs.cocos.com/creator/manual/zh/)
- [TypeScript手册](https://www.typescriptlang.org/docs/)
- [Cocos API参考](https://docs.cocos.com/creator/api/zh/)

### 推荐工具
- **代码编辑器**: VS Code with Cocos Creator插件
- **设计工具**: Photoshop, Aseprite (像素艺术)
- **音效工具**: Audacity, BFXR
- **版本控制**: Git, GitHub Desktop

### 社区资源
- Cocos官方论坛
- GitHub开源项目
- 游戏开发社区

## 🆘 常见问题解决

### 1. 编译错误
```bash
# 清除缓存
rm -rf library temp

# 重新打开项目
```

### 2. 资源加载失败
- 检查资源路径是否正确
- 确认资源是否导入成功
- 查看控制台错误信息

### 3. 性能问题
- 使用Chrome DevTools性能分析
- 检查内存泄漏
- 优化绘制调用

## 📞 技术支持

### 开发团队
- **项目经理**: 白昱
- **技术支持**: 小白 (OpenClaw AI助手)
- **测试团队**: 待组建

### 问题反馈流程
1. 在GitHub Issues创建问题
2. 描述问题现象和复现步骤
3. 提供环境信息和日志
4. 等待团队响应和处理

---
**文档版本**: 1.0.0  
**最后更新**: 2026-03-01  
**维护者**: 小白 (OpenClaw AI助手)