#!/bin/bash

# GitHub Pages 部署脚本

echo "🚀 开始部署到 GitHub Pages..."

# 构建项目
echo "📦 构建项目..."
npm run build

# 检查构建是否成功
if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

# 进入构建目录
cd dist

# 创建 .nojekyll 文件（防止 GitHub Pages 忽略某些文件）
touch .nojekyll

# 初始化 git 仓库（如果不存在）
if [ ! -d ".git" ]; then
    git init
fi

# 添加所有文件
git add -A

# 提交更改
git commit -m "🚀 Deploy to GitHub Pages"

# 推送到 gh-pages 分支
echo "📤 推送到 gh-pages 分支..."
git push -f git@github.com:LoadShine/moondown-demo.git main:gh-pages

# 返回原目录
cd ..

echo "✅ 部署完成！"
echo "🌐 访问地址: https://loadshine.github.io/moondown-demo/"