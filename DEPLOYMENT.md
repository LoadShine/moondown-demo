# 🚀 GitHub Pages 部署指南

本指南将帮助你将 Moondown 项目部署到 GitHub Pages。

## 📋 前提条件

- ✅ 已有 GitHub 仓库: `https://github.com/LoadShine/moondown-demo`
- ✅ 项目基于 Vite + React + TypeScript
- ✅ 已配置正确的 `base` 路径

## 🔧 部署方式

### 方式一：GitHub Actions 自动部署（推荐）

1. **配置文件已创建**: `.github/workflows/deploy.yml`
2. **启用 GitHub Pages**:
   - 进入 GitHub 仓库设置
   - 找到 "Pages" 选项
   - Source 选择 "GitHub Actions"
3. **推送代码到 main 分支**:
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

### 方式二：手动部署

1. **运行部署脚本**:
   ```bash
   ./deploy.sh
   ```

2. **或者手动操作**:
   ```bash
   # 构建项目
   npm run build

   # 进入构建目录
   cd dist

   # 初始化 git 并推送
   git init
   git add -A
   git commit -m "Deploy to GitHub Pages"
   git push -f git@github.com:LoadShine/moondown-demo.git main:gh-pages
   ```

## 🌐 访问地址

部署成功后，可以通过以下地址访问：

**https://loadshine.github.io/moondown-demo/**

## ⚙️ 配置说明

### Vite 配置

`vite.config.ts` 中的关键配置：

```typescript
export default defineConfig({
  plugins: [react()],
  base: "/moondown-demo/",  // GitHub Pages 子路径
  // ...
})
```

### GitHub Actions 配置

`.github/workflows/deploy.yml` 包含：
- 自动构建流程
- 依赖安装
- 项目构建
- 页面部署

## 🔍 验证部署

1. **检查构建状态**:
   - 在 GitHub 仓库的 "Actions" 标签页查看构建状态
   - 绿色 ✅ 表示部署成功

2. **访问应用**:
   - 打开 `https://loadshine.github.io/moondown-demo/`
   - 确认 Moondown 编辑器正常加载

3. **检查控制台**:
   - 按 F12 打开开发者工具
   - 检查是否有加载错误

## 🛠️ 常见问题

### 1. 页面空白或资源加载失败

**问题**: 404 错误或资源加载失败
**解决**:
- 确认 `vite.config.ts` 中的 `base` 配置正确
- 检查 GitHub Pages 设置中的自定义域名配置

### 2. 构建失败

**问题**: GitHub Actions 构建失败
**解决**:
- 检查 Node.js 版本兼容性
- 确认所有依赖项已正确安装
- 查看 Actions 日志获取详细错误信息

### 3. 路由问题

**问题**: 刷新页面出现 404
**解决**:
- 对于单页应用，需要配置 GitHub Pages 的重定向
- 在 `public` 目录添加 `404.html` 文件

## 📱 移动端适配

Moondown 编辑器已针对移动设备进行优化，部署后可在手机和平板上正常使用。

## 🔒 安全注意事项

- GitHub Actions 会自动处理部署密钥
- 不要在代码中暴露敏感信息
- 定期更新依赖项以确保安全性

## 📞 技术支持

如遇到问题，请检查：
1. GitHub 仓库设置中的 Pages 配置
2. Actions 运行日志
3. 浏览器控制台错误信息

---

**部署状态**: ✅ 已配置完成
**最后更新**: $(date +"%Y-%m-%d")