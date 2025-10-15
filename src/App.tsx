// src/App.tsx
import { useState, useCallback, useEffect } from 'react';
import Moondown from './moondown/moondown';
import MoondownWrapper from './components/MoondownWrapper';

const initialContent = `# Welcome to Moondown!

This is a demo to test the Moondown editor inside a React application.

## Features

- **WYSIWYG-like experience**: Hides Markdown syntax when not focused.
- **Tables**: Interactive table editing.
- **Syntax Highlighting**: For code blocks.
- **And much more...**

---

### Test Area

Try editing this document. You can also use the buttons below to interact with the editor programmatically.

#### Link Test

[HELLO TEST](https://www.baidu.com)

> Blockquotes are supported too!

\`\`\`javascript
function greet() {
  console.log("Hello, Moondown!");
}
\`\`\`

| Header 1 | Header 2 | Header 3 |
|----------|:--------:|---------:|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

`;

function App() {
    const [editorInstance, setEditorInstance] = useState<Moondown | null>(null);
    const [editorContent, setEditorContent] = useState('');
    const [newContent, setNewContent] = useState('## Hello from React!\n\nThis content was set by clicking the button.');
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

    const handleToggleSyntaxHiding = (e: React.ChangeEvent<HTMLInputElement>) => {
        const enabled = e.target.checked;
        setIsSyntaxHiding(enabled);
        if (editorInstance) {
            editorInstance.toggleSyntaxHiding(enabled);
        }
    };

    const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTheme(e.target.checked ? 'dark' : 'light');
    };

    return (
        <div className="container mx-auto p-8 font-sans bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Moondown Editor Demo</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">A React + Vite testbed for your CodeMirror-based editor.</p>
            </header>

            <main className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-end mb-4 space-x-4">
                    {/* Syntax hiding toggle */}
                    <div className="flex items-center">
                        <label htmlFor="syntax-toggle" className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Hide Markdown Syntax
                        </label>
                        <input
                            id="syntax-toggle"
                            type="checkbox"
                            checked={isSyntaxHiding}
                            onChange={handleToggleSyntaxHiding}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                    </div>

                    {/* Theme toggle switch */}
                    <div className="flex items-center">
                        <label htmlFor="theme-toggle" className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Dark Mode
                        </label>
                        <input
                            id="theme-toggle"
                            type="checkbox"
                            checked={theme === 'dark'}
                            onChange={handleThemeChange}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                    </div>
                </div>


                <MoondownWrapper
                    initialValue={initialContent}
                    onReady={handleEditorReady}
                />

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Get Value Section */}
                    <div className="flex flex-col">
                        <button
                            onClick={handleGetValue}
                            className="mb-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                        >
                            Get Editor Value
                        </button>
                        <textarea
                            readOnly
                            value={editorContent}
                            className="w-full h-48 p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 font-mono text-sm"
                            placeholder="Click 'Get Editor Value' to see the raw Markdown here."
                        />
                    </div>

                    {/* Set Value Section */}
                    <div className="flex flex-col">
                        <button
                            onClick={handleSetValue}
                            className="mb-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                        >
                            Set Editor Value
                        </button>
                        <textarea
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            className="w-full h-48 p-2 border rounded font-mono text-sm dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;