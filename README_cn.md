# Moondown - 现代化 Markdown 编辑器

<p align="center">
  <img src="https://img.shields.io/badge/React-19+-blue.svg" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5+-blue.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/CodeMirror-6+-green.svg" alt="CodeMirror">
  <img src="https://img.shields.io/badge/Vite-6+-purple.svg" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-3+-38bdf8.svg" alt="Tailwind CSS">
</p>

<p align="center">
  <a href="#-功能特性">功能特性</a> •
  <a href="#-技术栈">技术栈</a> •
  <a href="#-快速开始">快速开始</a> •
  <a href="#-项目结构">项目结构</a> •
  <a href="#-ai-功能">AI 功能</a> •
  <a href="#-扩展系统">扩展系统</a>
</p>

<p align="center"><strong>English Version</strong> | <a href="#chinese-version">中文版</a></p>

## 🌟 项目简介

**Moondown** 是一个基于 CodeMirror 6 构建的现代化、功能丰富的 Markdown 编辑器。它提供了所见即所得（WYSIWYG）的编辑体验，同时保持了 Markdown 的简洁性和可移植性。无论是写作、笔记还是文档编辑，Moondown 都能提供流畅高效的编辑体验。

## ✨ 功能特性

### 📝 核心编辑功能
- **🎯 所见即所得**: 隐藏 Markdown 语法，提供真正的 WYSIWYG 编辑体验
- **📝 语法高亮**: 实时的 Markdown 语法高亮显示
- **🎨 主题切换**: 支持亮色和暗色主题，适应不同使用环境
- **📊 表格编辑**: 交互式表格创建和编辑，支持增删行列
- **🖼️ 图片支持**: 拖拽上传、复制粘贴，自动插入图片
- **💻 代码块**: 支持 100+ 编程语言的语法高亮

### 🚀 高级编辑功能
- **🤖 AI 智能助手**: 集成 OpenAI API，提供智能写作辅助
- **⚡ 斜杠命令**: 通过 "/" 快速插入标题、列表、代码块等元素
- **💬 气泡菜单**: 选中文本时显示格式化菜单，快速应用样式
- **🔄 语法切换**: 一键切换显示/隐藏 Markdown 语法标记
- **✅ 智能列表**: 自动修正列表格式，支持多级嵌套
- **🎯 专注模式**: 隐藏干扰元素，专注内容创作

### 🤖 AI 功能（需要 OpenAI API Key）
- **✍️ 文本续写**: 智能续写文章内容
- **📝 标题生成**: 自动生成文章标题
- **📋 摘要生成**: 生成文章内容摘要
- **🗂️ 大纲生成**: 创建文章大纲结构
- **🔄 文本改写**: 改写和优化文本表达
- **🌐 多语言翻译**: 支持多种语言的翻译

## 🛠 技术栈

### 核心框架
- **React 19.2.0** - 现代化的前端框架
- **TypeScript 5.8.3** - 类型安全的 JavaScript
- **Vite 7.1.7** - 快速的构建工具和开发服务器

### 编辑器核心
- **CodeMirror 6** - 强大的文本编辑器框架
- **@codemirror/lang-markdown** - Markdown 语言支持
- **@lezer/markdown** - Markdown 解析器

### UI 和样式
- **Tailwind CSS 3.4.18** - 实用优先的 CSS 框架
- **Lucide React** - 优雅的图标库
- **Tippy.js** - 工具提示和弹出菜单

### AI 集成
- **OpenAI API** - 提供 AI 文本生成功能

## 🚀 快速开始

### 环境要求
- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/LoadShine/moondown-demo.git
cd moondown-demo
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **构建生产版本**
```bash
npm run build
```

5. **预览构建结果**
```bash
npm run preview
```

### 环境配置（AI 功能）

如果需要使用 AI 功能，请在项目中配置 OpenAI API Key：

```typescript
// 在相关组件中配置
const openai = new OpenAI({
  apiKey: 'your-openai-api-key',
  dangerouslyAllowBrowser: true
});
```

## 📁 项目结构

```
src/
├── assets/                    # 静态资源文件
├── components/               # React 组件
│   ├── Editor.tsx           # 主编辑器组件
│   ├── Header.tsx           # 头部导航组件
│   └── StatusBar.tsx        # 状态栏组件
├── moondown/                # 核心编辑器代码
│   ├── ai/                  # AI 功能模块
│   ├── core/                # 核心功能
│   ├── extensions/          # 编辑器扩展
│   ├── theme/               # 主题配置
│   └── moondown.ts          # 主编辑器类
└── index.css                # 全局样式
```

### 扩展系统架构

```
src/moondown/extensions/
├── blockquote/              # 块引用支持
├── bubble-menu/             # 气泡菜单
├── correct-list/            # 列表自动修正
├── fenced-code/             # 代码块支持
├── final-new-line/          # 末尾换行处理
├── image/                   # 图片支持
├── mark-parser/             # 标记解析
├── markdown-syntax-hiding/  # Markdown 语法隐藏
├── slash-command/           # 斜杠命令
├── strikethrough-parser/    # 删除线解析
├── table/                   # 表格编辑
└── underline-parser/        # 下划线解析
```

## 🤖 AI 功能详解

### 核心 AI 功能

1. **文本续写**
    - 根据上下文智能续写内容
    - 保持写作风格和主题一致性
    - 支持控制续写长度

2. **标题生成**
    - 分析内容生成合适的标题
    - 支持多种标题风格
    - 可生成多个备选标题

3. **摘要生成**
    - 自动提取文章核心内容
    - 支持控制摘要长度
    - 保持原文要点完整性

4. **大纲生成**
    - 为文章创建结构化大纲
    - 支持多级标题层次
    - 可自定义大纲深度

5. **文本改写**
    - 优化文本表达和流畅度
    - 支持不同改写风格
    - 保持原意不变

6. **多语言翻译**
    - 支持主要语言的互译
    - 保持 Markdown 格式
    - 专业术语准确翻译

### AI 使用示例

```typescript
// 文本续写示例
const continueWriting = async (text: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{
      role: "user",
      content: `请续写以下内容：${text}`
    }]
  });
  return response.choices[0].message.content;
};
```

## 🔧 扩展系统

Moondown 采用模块化的扩展架构，每个功能都是独立的扩展模块，便于维护和扩展。

### 扩展示例

```typescript
// 自定义扩展示例
export const myExtension = EditorView.updateListener.of((update) => {
  if (update.docChanged) {
    // 文档发生变化时的处理逻辑
    console.log('文档已更新');
  }
});
```

### 扩展示型

1. **解析器扩展** - 自定义 Markdown 语法解析
2. **UI 扩展** - 添加用户界面组件
3. **行为扩展** - 修改编辑器行为
4. **主题扩展** - 自定义编辑器外观

## 🎨 主题定制

Moondown 支持深度主题定制，包括：

- **编辑器主题** - CodeMirror 编辑器样式
- **UI 主题** - 界面组件样式
- **语法高亮** - Markdown 语法颜色
- **扩展主题** - 扩展功能的样式

## 📋 可用脚本

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行代码检查
npm run lint

# 预览构建结果
npm run preview

# 类型检查
npm run type-check
```

## 🔍 代码质量

项目使用以下工具确保代码质量：

- **ESLint** - 代码规范和错误检查
- **TypeScript** - 类型安全检查
- **Prettier** - 代码格式化（可集成）

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [CodeMirror](https://codemirror.net/) - 提供强大的编辑器框架
- [Tailwind CSS](https://tailwindcss.com/) - 优秀的 CSS 框架
- [Lucide](https://lucide.dev/) - 美观的图标库
- [OpenAI](https://openai.com/) - AI 功能支持
