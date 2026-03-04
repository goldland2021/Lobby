# 🚀 Cherry Farm Horse Racing - MVP 上线部署检查清单

## 项目状态总结
✅ **前端**: 完全就绪（Lobby场景、按钮、API客户端）
✅ **后端API**: 代码完成（auth/play/leaderboard）
✅ **配置**: Vercel配置正确
❌ **部署**: 需要部署到生产环境

## P0 - 必须完成（阻塞上线）

### 1. 部署到Vercel生产环境
```bash
cd G:\cherryfarm\openclaw
vercel --prod
```

### 2. 设置环境变量（Vercel Dashboard）
- `BOT_TOKEN`: `8657390040:AAHzow6PnRaWgUrR1fyDtOoVOxyvWCxQB4s`
- `NODE_ENV`: `production`

### 3. 验证API部署
部署后测试：
```bash
# 测试认证接口
curl -X POST https://lobby-eosin.vercel.app/api/auth \
  -H "Content-Type: application/json" \
  -d '{"initData":"test"}'

# 预期响应：200 OK 或 400 Bad Request（缺少有效initData）
```

### 4. 更新Telegram Bot WebApp URL
在BotFather中设置：
```
https://t.me/YourBot/app?startapp=cherryfarm&api_base_url=https://lobby-eosin.vercel.app
```

## P1 - 上线前验证

### 5. 完整游戏链路测试
1. **打开Telegram Mini App**
2. **自动认证** → 进入Lobby
3. **点击Play按钮** → 开始游戏
4. **游戏结束** → 显示结果
5. **查看排行榜**

### 6. 前端缓存验证
- 清除浏览器缓存
- 测试无缓存加载
- 验证资源正确加载

### 7. 错误处理验证
- 网络断开测试
- API错误响应测试
- 超时处理测试

## 技术验证点

### ✅ 已验证完成
- [x] API路由配置正确（vercel.json）
- [x] Telegram验签逻辑正确
- [x] CORS配置正确
- [x] 错误处理完善
- [x] 前端API客户端就绪

### 🔄 需要部署后验证
- [ ] 生产环境API可访问
- [ ] Telegram验签在生产环境工作
- [ ] 前端正确读取API_BASE_URL
- [ ] 完整游戏流程畅通

## 部署步骤详情

### 步骤1: Vercel部署
```bash
# 登录Vercel（如果未登录）
vercel login

# 部署到生产环境
vercel --prod

# 或使用特定项目
vercel --prod --confirm
```

### 步骤2: 环境变量设置
1. 访问 https://vercel.com/dashboard
2. 选择 `lobby-eosin` 项目
3. 进入 Settings → Environment Variables
4. 添加：
   - `BOT_TOKEN`: `8657390040:AAHzow6PnRaWgUrR1fyDtOoVOxyvWCxQB4s`
   - `NODE_ENV`: `production`

### 步骤3: 部署验证
```javascript
// 快速测试脚本
fetch('https://lobby-eosin.vercel.app/api/auth', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({initData: 'test'})
})
.then(r => console.log('Status:', r.status))
.catch(e => console.error('Error:', e));
```

### 步骤4: Telegram配置
1. 打开 @BotFather
2. 发送 `/mybots`
3. 选择你的bot
4. 选择 `Edit Bot` → `Edit Web App`
5. 设置URL为生产地址

## 故障排除

### 如果API返回404
1. 检查 `vercel.json` 中的 `rewrites` 配置
2. 确认 `api/` 目录存在且文件正确
3. 重新部署：`vercel --prod --force`

### 如果Telegram验签失败
1. 确认 `BOT_TOKEN` 环境变量正确
2. 检查initData格式是否正确
3. 开发模式可暂时跳过验签（设置 `NODE_ENV=development`）

### 如果前端无法连接API
1. 检查浏览器控制台错误
2. 验证 `Config.ts` 中的 `API_BASE_URL`
3. 测试直接访问API端点

## 上线后监控

### 基础监控
1. **Vercel Logs**: 查看API调用日志
2. **错误率**: 监控 `/api/auth` 错误率
3. **响应时间**: 确保API响应快速

### 用户反馈收集
1. **游戏体验**: 流畅度、加载时间
2. **功能完整性**: 所有按钮功能正常
3. **错误报告**: 用户遇到的错误

## 成功标准

### MVP上线成功标志
- [ ] 用户能通过Telegram Mini App打开游戏
- [ ] 自动认证成功，进入Lobby场景
- [ ] Play按钮可点击，开始游戏
- [ ] 游戏正常进行，显示结果
- [ ] 排行榜数据可查看
- [ ] 无致命错误或崩溃

### 技术成功标志
- [ ] API响应时间 < 500ms
- [ ] 错误率 < 1%
- [ ] 用户会话保持稳定
- [ ] 资源加载无404错误

## 紧急回滚计划

如果上线后发现问题：

### 立即措施
1. **暂停新用户访问**: 临时关闭WebApp
2. **分析错误日志**: 定位问题根源
3. **快速修复部署**: 修复后重新部署

### 回滚步骤
1. 恢复到上一个稳定版本
2. 通知用户维护中
3. 修复问题后重新上线

---

**部署负责人**: 白昱  
**预计部署时间**: 30分钟  
**风险等级**: 低（技术问题已解决）  
**信心指数**: 高（本地测试全部通过）