# GitHub Actions 配置指南

## 🎯 需要完成的3件事

### 1. 配置self-hosted Windows runner
### 2. 配置Actions Secrets
### 3. push代码到master触发构建

---

## 第1步：配置self-hosted Windows runner

### 方法A：使用PowerShell脚本（推荐）

1. **获取GitHub Token**：
   - 访问 https://github.com/settings/tokens
   - 点击 "Generate new token (classic)"
   - 选择权限：`repo` 和 `workflow`
   - 复制生成的token

2. **运行安装脚本**：
   ```powershell
   cd G:\CherryFarm\openclaw
   .\setup-github-runner.ps1 -GitHubToken YOUR_TOKEN_HERE
   ```

3. **验证runner状态**：
   - 访问 https://github.com/goldland2021/Lobby/settings/actions/runners
   - 确认runner显示为"在线"

### 方法B：手动配置

1. 访问仓库设置：https://github.com/goldland2021/Lobby/settings/actions/runners
2. 点击 "New self-hosted runner"
3. 选择 "Windows"
4. 按照显示的步骤操作
5. 添加标签：`windows, cocos`

---

## 第2步：配置Actions Secrets

访问：https://github.com/goldland2021/Lobby/settings/secrets/actions

### 需要添加的4个secrets：

#### 1. COCOS_CREATOR_EXE
```
值: Cocos Creator可执行文件路径
示例: C:\Program Files\CocosCreator\CocosCreator.exe
```

#### 2. VERCEL_TOKEN
```
值: Vercel访问令牌
获取: https://vercel.com/account/tokens
步骤:
1. 登录Vercel
2. 访问 Account → Tokens
3. 点击 "Create Token"
4. 输入名称: "GitHub Actions"
5. 选择权限: 根据项目需要
6. 复制生成的token
```

#### 3. VERCEL_ORG_ID
```
值: Vercel组织ID
获取:
1. 访问 https://vercel.com/dashboard
2. 点击组织名称
3. 查看URL中的ID或组织设置中的ID
```

#### 4. VERCEL_PROJECT_ID
```
值: Vercel项目ID
获取:
1. 访问Vercel项目页面
2. 点击项目设置 (Settings)
3. 在 "General" 中找到项目ID
```

---

## 第3步：push代码到master

### 检查当前状态：
```bash
cd G:\CherryFarm\openclaw
git status
git log --oneline -5
```

### 如果有更改需要提交：
```bash
git add .
git commit -m "chore: trigger GitHub Actions build"
git push origin master
```

### 如果没有更改，创建一个空提交：
```bash
git commit --allow-empty -m "chore: trigger GitHub Actions workflow"
git push origin master
```

---

## 📊 验证配置

### 1. 检查runner状态
访问：https://github.com/goldland2021/Lobby/settings/actions/runners
- ✅ Runner应该显示为"在线"
- ✅ 标签应该包含：`windows`, `cocos`

### 2. 检查secrets配置
访问：https://github.com/goldland2021/Lobby/settings/secrets/actions
- ✅ 4个secrets都应该存在

### 3. 检查workflow文件
文件位置：`.github/workflows/deploy-vercel.yml`
内容应该包含：
```yaml
runs-on: [self-hosted, windows, cocos]
```

### 4. 触发构建并监控
1. push代码到master分支
2. 访问：https://github.com/goldland2021/Lobby/actions
3. 查看最新的workflow运行状态

---

## 🚨 故障排除

### 问题1：runner无法连接
- 检查网络连接
- 验证GitHub Token权限
- 检查防火墙设置

### 问题2：workflow失败
- 查看详细的错误日志
- 检查secrets值是否正确
- 验证Cocos Creator路径

### 问题3：构建失败
- 检查Cocos Creator版本兼容性
- 验证项目依赖
- 查看构建日志

### 问题4：Vercel部署失败
- 验证Vercel Token权限
- 检查项目ID和组织ID
- 确认Vercel项目已存在

---

## 📞 支持信息

### 项目信息
- **仓库**: goldland2021/Lobby
- **项目路径**: G:\CherryFarm\openclaw
- **项目类型**: Cocos Creator 2D赛马游戏

### 技术栈
- Cocos Creator 2D
- TypeScript
- GitHub Actions
- Vercel部署

### 联系人
- 开发者: 小白 (OpenClaw AI助手)
- 用户: 白昱
- 最后更新: 2026-03-03

---

## ✅ 完成检查清单

- [ ] 1. 配置self-hosted Windows runner
- [ ] 2. 添加标签: windows, cocos
- [ ] 3. 配置COCOS_CREATOR_EXE secret
- [ ] 4. 配置VERCEL_TOKEN secret
- [ ] 5. 配置VERCEL_ORG_ID secret
- [ ] 6. 配置VERCEL_PROJECT_ID secret
- [ ] 7. push代码到master分支
- [ ] 8. 验证workflow运行成功
- [ ] 9. 验证Vercel部署成功

---

**完成所有步骤后，Cocos游戏将自动构建并部署到Vercel！** 🚀