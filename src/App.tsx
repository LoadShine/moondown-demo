// src/App.tsx
import { useState, useCallback, useEffect } from 'react';
import Moondown from './moondown/moondown';
import MoondownWrapper from './components/MoondownWrapper';

const initialContent = `# Moondown Editor - Comprehensive Test Document

> **Moondown** is a modern, feature-rich Markdown editor built on CodeMirror 6, providing a What-You-See-Is-What-You-Get (WYSIWYG) editing experience while maintaining the simplicity and portability of Markdown.

---

## 🎯 Core Features Testing

### Text Formatting

This section tests basic text formatting capabilities:

**Bold text** and *italic text* and ***bold italic text***

~~Strikethrough text~~ and ~underlined text~

\`Inline code\` is supported.

### Links and References

Here's a [link to GitHub](https://github.com) and an [internal reference](#header).

Auto-linked URLs: https://www.apple.com and https://developer.mozilla.org

### Lists and Structure

#### Ordered List
1. First ordered item
   1.1. Nested ordered item
   1.2. Another nested item
2. Second ordered item
3. Third ordered item

#### Unordered List
- First unordered item
  - Nested unordered item
    - Deeply nested item
  - Another nested item
- Second unordered item
- Third unordered item

#### Mixed List
1. Ordered item
   - Unordered sub-item
   - Another unordered sub-item
2. Second ordered item
   2.1. Nested ordered item
   2.2. Another nested ordered item

### Blockquotes

> This is a simple blockquote.
> It spans multiple lines.

> **Nested blockquotes:**
> > This is a nested blockquote
> > > And another level of nesting
> > Back to second level
> Back to first level

> Blockquotes with other elements:
> - Lists inside blockquotes
> - **Bold text** and *italic text*
>
> \`\`\`javascript
> function insideBlockquote() {
>   return "Amazing!";
> }
> \`\`\`

---

## 📝 Advanced Markdown Features

### Code Blocks with Syntax Highlighting

#### JavaScript
\`\`\`javascript
class MoondownEditor {
  constructor(options = {}) {
    this.theme = options.theme || 'light';
    this.syntaxHiding = options.syntaxHiding || true;
    this.extensions = options.extensions || [];

    this.initialize();
  }

  initialize() {
    console.log('🚀 Moondown Editor initialized');
    this.setupEventListeners();
    this.loadExtensions();
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        this.saveDocument();
      }
    });
  }

  async saveDocument() {
    const content = this.getValue();
    try {
      await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, timestamp: Date.now() })
      });
      console.log('✅ Document saved successfully');
    } catch (error) {
      console.error('❌ Failed to save document:', error);
    }
  }
}
\`\`\`

#### Python
\`\`\`python
import asyncio
import json
from typing import List, Dict, Optional
from dataclasses import dataclass

@dataclass
class Document:
    title: str
    content: str
    metadata: Dict[str, any]

class MoondownProcessor:
    def __init__(self, config_path: Optional[str] = None):
        self.config = self.load_config(config_path)
        self.extensions = []

    def load_config(self, config_path: Optional[str]) -> Dict:
        if config_path:
            with open(config_path, 'r') as f:
                return json.load(f)
        return self.get_default_config()

    def get_default_config(self) -> Dict:
        return {
            'theme': 'light',
            'syntax_hiding': True,
            'auto_save': True,
            'tab_size': 4
        }

    async def process_markdown(self, content: str) -> str:
        # Simulate async processing
        await asyncio.sleep(0.1)
        return content.upper()
\`\`\`

#### CSS
\`\`\`css
:root {
  --editor-font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  --editor-font-size: 14px;
  --editor-line-height: 1.6;
  --editor-background: #ffffff;
  --editor-foreground: #1d1d1f;
  --editor-border: #e5e5e7;
  --editor-border-radius: 12px;
  --editor-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.moondown-editor {
  font-family: var(--editor-font-family);
  font-size: var(--editor-font-size);
  line-height: var(--editor-line-height);
  background: var(--editor-background);
  color: var(--editor-foreground);
  border: 1px solid var(--editor-border);
  border-radius: var(--editor-border-radius);
  box-shadow: var(--editor-shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.moondown-editor:focus-within {
  border-color: #007aff;
  box-shadow: 0 8px 32px rgba(0, 122, 255, 0.12);
}
\`\`\`

### Tables

#### Simple Table
| Feature | Supported | Notes |
|---------|-----------|--------|
| Tables | ✅ | Full support with alignment |
| Alignment | ✅ | Left, center, right |
| Sorting | ❌ | Not implemented yet |
| Filtering | ❌ | Planned for future |

#### Complex Table with Formatting
| **Language** | **Use Case** | **Popularity** | **Learning Curve** |
|:-------------|:-------------|:---------------|:-------------------|
| **JavaScript** | Web Development | ★★★★★ | Beginner |
| **Python** | Data Science | ★★★★☆ | Beginner |
| **Rust** | Systems Programming | ★★★☆☆ | Advanced |
| **Go** | Cloud Services | ★★★★☆ | Intermediate |

#### Table with Code
| Function | Description | Example |
|----------|-------------|---------|
| \`map()\` | Transform array elements | \`[1,2,3].map(x => x * 2)\` |
| \`filter()\` | Filter array elements | \`[1,2,3].filter(x => x > 1)\` |
| \`reduce()\` | Reduce array to single value | \`[1,2,3].reduce((a,b) => a+b)\` |

---

## 🎨 Visual Elements

### Horizontal Rules

---

***

___

### Line Breaks

This is the first line.
This is the second line with a hard break.
This is the third line.

### Emphasis Combinations

This is ***really important*** and this is **very _interesting_** text.

We can also do _italic text with **bold** inside_ and **bold text with _italic_ inside**.

---

## 🔗 Links and References

### Basic Links
[GitHub](https://github.com)
[MDN Web Docs](https://developer.mozilla.org)
[Stack Overflow](https://stackoverflow.com)

### Links with Titles
[GitHub](https://github.com "GitHub - Where the world builds software")
[Apple](https://apple.com "Apple - Think Different")
[Google](https://google.com "Google - Search the world's information")

### Reference-style Links
[Moondown Repository][moondown-repo]
[CodeMirror Documentation][codemirror-docs]
[React Official Site][react-site]

[moondown-repo]: https://github.com/LoadShine/moondown-demo
[codemirror-docs]: https://codemirror.net
[react-site]: https://react.dev

### Auto-links
https://www.apple.com
https://developer.mozilla.org
mailto:contact@moondown.app

---

## 🖼️ Images

### Standard Images
![Apple Logo](https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg)

### Images with Titles
![MacBook Pro](https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/MacBook_Pro_16%22_%282023%29.png/320px-MacBook_Pro_16%22_%282023%29.png "MacBook Pro 2023")

### Image Links
[![React Logo](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/320px-React-icon.svg.png)](https://react.dev)

---

## 🚀 AI Features Testing

### Text Completion
Moondown includes AI-powered text completion. Simply start writing and press **Tab** to accept AI suggestions.

### Smart Suggestions
The AI can help with:
- **Grammar correction** - Automatically fix grammatical errors
- **Style improvement** - Enhance writing style and clarity
- **Content expansion** - Develop ideas and add detail
- **Translation** - Translate content to different languages

### Code Generation
Ask the AI to generate code:

\`\`\`prompt
Generate a React component for a todo list with add, delete, and toggle functionality
\`\`\`

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| \`Cmd/Ctrl + S\` | Save | Save current document |
| \`Cmd/Ctrl + B\` | Bold | Toggle bold formatting |
| \`Cmd/Ctrl + I\` | Italic | Toggle italic formatting |
| \`Cmd/Ctrl + E\` | Code | Toggle inline code |
| \`Cmd/Ctrl + K\` | Link | Insert link |
| \`Tab\` | Indent | Increase indentation |
| \`Shift + Tab\` | Outdent | Decrease indentation |
| \`Cmd/Ctrl + Z\` | Undo | Undo last action |
| \`Cmd/Ctrl + Shift + Z\` | Redo | Redo last undone action |

---

## 📊 Performance Metrics

### Editor Performance
- **Startup Time**: < 100ms
- **Typing Latency**: < 16ms
- **Memory Usage**: ~50MB for large documents
- **Auto-save**: Every 30 seconds

### Supported File Sizes
- **Optimal**: < 1MB
- **Maximum**: 10MB
- **Recommended Line Count**: < 100,000 lines

---

## 🎭 Edge Cases and Special Content

### Special Characters
Testing special characters: @ # $ % ^ & * ( ) _ + { } [ ] | \\ : ; " ' < > , . ? /

### Unicode Support
Testing unicode characters: 你好世界 🌍 Привет мир こんにちは世界 안녕하세요 세계

### Emoji Support 🎉
Emoji in text: 🚀 ✨ 🎨 📝 🔗 🖼️ 🎭 🎯 🎪 🎬

### Footnotes
This text has a footnote[^1]. Here's another one[^2].

[^1]: This is the first footnote.
[^2]: This is the second footnote with **bold** text.

### Definition Lists
Term 1
:   Definition of term 1

Term 2
:   Definition of term 2
    with additional details

### Task Lists
- [x] Completed task
- [ ] Incomplete task
- [x] Another completed task
    - [x] Sub-task completed
    - [ ] Sub-task incomplete
- [ ] Final incomplete task

---

## 🔧 Technical Implementation

### Editor Configuration
\`\`\`typescript
interface EditorConfig {
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  lineHeight: number;
  tabSize: number;
  wordWrap: boolean;
  syntaxHighlighting: boolean;
  autoSave: {
    enabled: boolean;
    interval: number;
  };
  extensions: {
    table: TableConfig;
    image: ImageConfig;
    ai: AIConfig;
  };
}
\`\`\`

### Extension System
\`\`\`typescript
interface Extension {
  name: string;
  version: string;
  enabled: boolean;
  config?: Record<string, any>;
  initialize: (editor: Moondown) => void;
  destroy: () => void;
}
\`\`\`

---

## 📈 Usage Statistics

Based on our analytics:

| Metric | Value | Trend |
|--------|--------|--------|
| Daily Active Users | 1,234 | ↗️ +15% |
| Documents Created | 5,678 | ↗️ +23% |
| Average Session Time | 25 minutes | → 0% |
| User Satisfaction | 4.8/5 | ↗️ +0.2 |

---

## 🎯 Conclusion

This comprehensive test document covers:

✅ **Basic Markdown syntax** - Headers, text formatting, lists, links
✅ **Advanced features** - Tables, code blocks, footnotes, task lists
✅ **Visual elements** - Images, horizontal rules, line breaks
✅ **Edge cases** - Special characters, Unicode, emoji
✅ **Performance testing** - Large content, complex structures
✅ **AI features** - Text completion, smart suggestions
✅ **Keyboard shortcuts** - All major shortcuts documented

**Moondown Editor** provides a complete Markdown editing experience with:
- 🎨 **Beautiful UI** inspired by Apple's design language
- ⚡ **Excellent performance** with CodeMirror 6
- 🤖 **AI-powered features** for enhanced productivity
- 📱 **Mobile-responsive** design
- 🔧 **Extensible architecture** with plugin system
`

function App() {
    const [editorInstance, setEditorInstance] = useState<Moondown | null>(null);
    const [editorContent, setEditorContent] = useState('');
    const [newContent, setNewContent] = useState('## Quick Test\n\nThis is a **test document** for *quick validation*.\n\n- Feature 1\n- Feature 2\n- Feature 3');
    const [isSyntaxHiding, setIsSyntaxHiding] = useState(true);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Use useCallback to ensure onReady function reference is stable
    const handleEditorReady = useCallback((instance: Moondown) => {
        setEditorInstance(instance);
    }, []);

    // Listen for theme changes and update editor and page
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        editorInstance?.setTheme(theme);
    }, [theme, editorInstance]);

    const handleGetValue = () => {
        if (editorInstance) {
            const value = editorInstance.getValue();
            setEditorContent(value);
        }
    };

    const handleSetValue = () => {
        if (editorInstance) {
            editorInstance.setValue(newContent);
        }
    };

    const handleToggleSyntaxHiding = () => {
        const newIsHiding = !isSyntaxHiding;
        setIsSyntaxHiding(newIsHiding);
        if (editorInstance) {
            editorInstance.toggleSyntaxHiding(newIsHiding);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Apple-style header */}
            <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-sm">M</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Moondown</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Beautiful Markdown Editing</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {/* Syntax hiding toggle */}
                            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Hide Syntax
                                </label>
                                <button
                                    onClick={handleToggleSyntaxHiding}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        isSyntaxHiding ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            isSyntaxHiding ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Theme toggle */}
                            <button
                                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {theme === 'light' ? (
                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome section */}
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                        Beautiful Markdown Editing
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Experience the next generation of Markdown editing with intelligent syntax hiding,
                        powerful features, and a clean, distraction-free interface.
                    </p>
                </div>

                {/* Editor container */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <div className="flex space-x-1">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400 ml-3">document.md</span>
                            </div>
                        </div>

                        {/* 只添加简单的 padding，不要边框和背景 */}
                        <div className="px-6 py-4">
                            <MoondownWrapper
                                initialValue={initialContent}
                                onReady={handleEditorReady}
                            />
                        </div>
                    </div>
                </div>

                {/* Control panel */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Get content section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Export Content</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Get the raw Markdown content from the editor.</p>

                        <button
                            onClick={handleGetValue}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-sm hover:shadow-md mb-4"
                        >
                            Get Editor Content
                        </button>

                        <div className="relative">
                            <textarea
                                readOnly
                                value={editorContent}
                                className="w-full h-40 p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Editor content will appear here..."
                            />
                            {editorContent && (
                                <div className="absolute top-2 right-2 text-xs text-gray-500">
                                    {editorContent.length} chars
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Set content section */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Import Content</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Load custom Markdown content into the editor.</p>

                        <button
                            onClick={handleSetValue}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-sm hover:shadow-md mb-4"
                        >
                            Load Custom Content
                        </button>

                        <textarea
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            className="w-full h-40 p-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Enter your Markdown content here..."
                        />
                    </div>
                </div>

                {/* Feature highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">WYSIWYG Experience</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Hide Markdown syntax for a clean, focused writing experience</p>
                    </div>

                    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Smart Features</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered suggestions and intelligent text completion</p>
                    </div>

                    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Interactive Tables</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Create and edit tables with ease using our table extension</p>
                    </div>

                    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Syntax Highlighting</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Beautiful code highlighting for 100+ programming languages</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Powered by <span className="font-semibold">Moondown</span> • Built with React & CodeMirror 6
                    </p>
                </div>
            </main>
        </div>
    );
}

export default App;