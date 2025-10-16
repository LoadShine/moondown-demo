# Moondown - Modern Markdown Editor

<p align="center">
  <img src="https://img.shields.io/badge/React-19+-blue.svg" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5+-blue.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/CodeMirror-6+-green.svg" alt="CodeMirror">
  <img src="https://img.shields.io/badge/Vite-6+-purple.svg" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-3+-38bdf8.svg" alt="Tailwind CSS">
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-ai-features">AI Features</a> •
  <a href="#-extension-system">Extension System</a>
</p>

## 🌟 Introduction

**Moondown** is a modern, feature-rich Markdown editor built on CodeMirror 6. It provides a What-You-See-Is-What-You-Get (WYSIWYG) editing experience while maintaining the simplicity and portability of Markdown. Whether for writing, note-taking, or document editing, Moondown offers a smooth and efficient editing experience.

## ✨ Features

### 📝 Core Editing Features
- **🎯 WYSIWYG**: Hide Markdown syntax, provide true WYSIWYG editing experience
- **📝 Syntax Highlighting**: Real-time Markdown syntax highlighting
- **🎨 Theme Switching**: Support light and dark themes for different environments
- **📊 Table Editing**: Interactive table creation and editing with row/column operations
- **🖼️ Image Support**: Drag & drop upload, copy & paste with automatic insertion
- **💻 Code Blocks**: Support for 100+ programming languages with syntax highlighting

### 🚀 Advanced Editing Features
- **🤖 AI Writing Assistant**: Integrated OpenAI API for intelligent writing assistance
- **⚡ Slash Commands**: Quick insertion of elements through "/" command
- **💬 Bubble Menu**: Formatting menu displayed when text is selected
- **🔄 Syntax Toggle**: One-click switch to show/hide Markdown syntax markers
- **✅ Smart Lists**: Automatic list formatting with multi-level nesting support
- **🎯 Focus Mode**: Hide distracting elements for focused content creation

### 🤖 AI Features (Requires OpenAI API Key)
- **✍️ Text Continuation**: Intelligent content continuation
- **📝 Title Generation**: Automatic article title generation
- **📋 Summary Generation**: Generate content summaries
- **🗂️ Outline Generation**: Create structured article outlines
- **🔄 Text Rewriting**: Rewrite and optimize text expression
- **🌐 Multi-language Translation**: Support for multiple language translations

## 🛠 Tech Stack

### Core Framework
- **React 19.2.0** - Modern frontend framework
- **TypeScript 5.8.3** - Type-safe JavaScript
- **Vite 7.1.7** - Fast build tool and development server

### Editor Core
- **CodeMirror 6** - Powerful text editor framework
- **@codemirror/lang-markdown** - Markdown language support
- **@lezer/markdown** - Markdown parser

### UI and Styling
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **Lucide React** - Elegant icon library
- **Tippy.js** - Tooltips and popup menus

### AI Integration
- **OpenAI API** - AI text generation functionality

## 🚀 Quick Start

### Requirements
- Node.js 18.0 or higher
- npm or yarn package manager

### Installation Steps

1. **Clone the project**
```bash
git clone https://github.com/LoadShine/moondown-demo.git
cd moondown-demo
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
```

5. **Preview build result**
```bash
npm run preview
```

### Environment Configuration (AI Features)

To use AI features, configure OpenAI API Key in the project:

```typescript
// Configure in related components
const openai = new OpenAI({
  apiKey: 'your-openai-api-key',
  dangerouslyAllowBrowser: true
});
```

## 📁 Project Structure

```
src/
├── assets/                    # Static asset files
├── components/               # React components
│   ├── Editor.tsx           # Main editor component
│   ├── Header.tsx           # Header navigation component
│   └── StatusBar.tsx        # Status bar component
├── moondown/                # Core editor code
│   ├── ai/                  # AI functionality modules
│   ├── core/                # Core functionality
│   ├── extensions/          # Editor extensions
│   ├── theme/               # Theme configuration
│   └── moondown.ts          # Main editor class
└── index.css                # Global styles
```

### Extension System Architecture

```
src/moondown/extensions/
├── blockquote/              # Blockquote support
├── bubble-menu/             # Bubble menu
├── correct-list/            # List auto-correction
├── fenced-code/             # Code block support
├── final-new-line/          # Final newline handling
├── image/                   # Image support
├── mark-parser/             # Mark parsing
├── markdown-syntax-hiding/  # Markdown syntax hiding
├── slash-command/           # Slash commands
├── strikethrough-parser/    # Strikethrough parsing
├── table/                   # Table editing
└── underline-parser/        # Underline parsing
```

## 🤖 AI Features in Detail

### Core AI Features

1. **Text Continuation**
   - Intelligently continue content based on context
   - Maintain writing style and theme consistency
   - Support length control

2. **Title Generation**
   - Analyze content to generate appropriate titles
   - Support multiple title styles
   - Generate multiple alternative titles

3. **Summary Generation**
   - Automatically extract core content from articles
   - Support summary length control
   - Maintain original key points integrity

4. **Outline Generation**
   - Create structured outlines for articles
   - Support multi-level heading hierarchy
   - Customizable outline depth

5. **Text Rewriting**
   - Optimize text expression and fluency
   - Support different rewriting styles
   - Keep original meaning unchanged

6. **Multi-language Translation**
   - Support translation between major languages
   - Maintain Markdown formatting
   - Accurate professional terminology translation

### AI Usage Example

```typescript
// Text continuation example
const continueWriting = async (text: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{
      role: "user",
      content: `Please continue the following content: ${text}`
    }]
  });
  return response.choices[0].message.content;
};
```

## 🔧 Extension System

Moondown adopts a modular extension architecture where each feature is an independent extension module, making maintenance and expansion easy.

### Extension Example

```typescript
// Custom extension example
export const myExtension = EditorView.updateListener.of((update) => {
  if (update.docChanged) {
    // Processing logic when document changes
    console.log('Document updated');
  }
});
```

### Extension Types

1. **Parser Extensions** - Custom Markdown syntax parsing
2. **UI Extensions** - Add user interface components
3. **Behavior Extensions** - Modify editor behavior
4. **Theme Extensions** - Customize editor appearance

## 🎨 Theme Customization

Moondown supports deep theme customization, including:

- **Editor Theme** - CodeMirror editor styles
- **UI Theme** - Interface component styles
- **Syntax Highlighting** - Markdown syntax colors
- **Extension Themes** - Extension functionality styles

## 📋 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Run code linting
npm run lint

# Preview build result
npm run preview

# Type checking
npm run type-check
```

## 🔍 Code Quality

The project uses the following tools to ensure code quality:

- **ESLint** - Code standards and error checking
- **TypeScript** - Type safety checks
- **Prettier** - Code formatting (integratable)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add some amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [CodeMirror](https://codemirror.net/) - Provides powerful editor framework
- [Tailwind CSS](https://tailwindcss.com/) - Excellent CSS framework
- [Lucide](https://lucide.dev/) - Beautiful icon library
- [OpenAI](https://openai.com/) - AI functionality support
