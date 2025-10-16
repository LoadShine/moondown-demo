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
    const [theme, setTheme] = useState<'light' | 'dark'>('light'); // 新增: 控制主题的 state

    // 使用 useCallback 确保 onReady 函数引用稳定
    const handleEditorReady = useCallback((instance: Moondown) => {
        setEditorInstance(instance);
    }, []);

    // 监听主题变化，更新编辑器和页面
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
                    {/* 语法隐藏开关 */}
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

                    {/* 主题切换开关 */}
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

// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)

/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;


.truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Light Mode Bubble Menu */
.cm-bubble-menu {
    position: absolute;
    display: flex;
    gap: 4px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    padding: 6px;
    z-index: 1000;
    will-change: opacity, transform;
}
.cm-bubble-menu-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 4px;
    background: transparent;
    border: none;
    padding: 6px;
    border-radius: 6px;
    color: #1a1a1a;
    cursor: pointer;
    transition: all 0.2s ease;
}
.cm-bubble-menu-item:hover {
    background: rgba(0, 0, 0, 0.05);
}
.cm-bubble-menu-item.active {
    background: rgba(147, 51, 234, 0.1);
    color: rgb(147, 51, 234);
}

.cm-bubble-menu-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}

.cm-bubble-menu-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 180px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    padding: 4px;
    margin-top: 8px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.2s ease;
}
.cm-bubble-menu-sub-label {
    font-size: 14px;
    color: #1a1a1a;
}

.dark .cm-bubble-menu {
    background: rgba(30, 30, 30, 0.85);
    border-color: rgba(70, 70, 70, 0.5);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
.dark .cm-bubble-menu-item {
    color: #e0e0e0;
}
.dark .cm-bubble-menu-item:hover {
    background: rgba(255, 255, 255, 0.1);
}
.dark .cm-bubble-menu-item.active {
    background: rgba(187, 134, 252, 0.15);
    color: rgb(187, 134, 252);
}
.dark .cm-bubble-menu-dropdown {
    background: rgba(30, 30, 30, 0.95);
    border-color: rgba(70, 70, 70, 0.5);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
.dark .cm-bubble-menu-sub-item:hover {
    background: rgba(255, 255, 255, 0.1);
}
.dark .cm-bubble-menu-sub-item.active {
    background: rgba(187, 134, 252, 0.15);
    color: rgb(187, 134, 252);
}
.dark .cm-bubble-menu-sub-item.active .cm-bubble-menu-sub-icon {
    color: rgb(187, 134, 252);
}
.dark .cm-bubble-menu-sub-item.active .cm-bubble-menu-sub-label {
    color: rgb(187, 134, 252);
}
.dark .cm-bubble-menu-sub-label {
    color: #e0e0e0;
}

.cm-bubble-menu-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}
.cm-bubble-menu-item:hover .cm-bubble-menu-dropdown {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}
.cm-bubble-menu-sub-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 12px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.cm-bubble-menu-sub-item:hover {
    background: rgba(0, 0, 0, 0.05);
}

.cm-bubble-menu-sub-item.active {
    background: rgba(147, 51, 234, 0.1);
    color: rgb(147, 51, 234);
}

.cm-bubble-menu-sub-item.active .cm-bubble-menu-sub-icon {
    color: rgb(147, 51, 234);
}

.cm-bubble-menu-sub-item.active .cm-bubble-menu-sub-label {
    color: rgb(147, 51, 234);
}

.cm-bubble-menu-sub-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
}

.cm-bubble-menu-sub-label {
    font-size: 14px;
    color: #1a1a1a;
}


// src/moondown/moondown.ts
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { defaultExtensions, themeCompartment } from "./extensions/default-extensions";
import { toggleSyntaxHidingEffect } from "./extensions/markdown-syntax-hiding/markdown-syntax-hiding-field";
import { darkTheme, lightTheme } from "./theme/base-theme";
import type { EditorConfig, Theme } from "./core";

/**
 * Moondown - A modern, feature-rich markdown editor built on CodeMirror 6
 * 
 * Features:
 * - Live markdown preview with syntax highlighting
 * - Bubble menu for text formatting
 * - Slash commands for quick element insertion
 * - AI-powered text continuation
 * - Table editing support
 * - Image drag & drop
 * - Light/dark themes
 * 
 * @example
 * ```typescript
 * const editor = new Moondown(document.getElementById('editor'), '# Hello World');
 * editor.setTheme('dark');
 * const content = editor.getValue();
 * ```
 */
class Moondown {
    private view: EditorView;

    /**
     * Creates a new Moondown editor instance
     * @param element - HTML element to mount the editor to
     * @param initialDoc - Initial markdown content
     * @param config - Optional configuration
     */
    constructor(element: HTMLElement, initialDoc: string = '', config?: EditorConfig) {
        const state = EditorState.create({
            doc: initialDoc,
            extensions: [...defaultExtensions]
        });

        this.view = new EditorView({
            state,
            parent: element,
        });

        // Apply initial configuration
        if (config?.theme) {
            this.setTheme(config.theme);
        }
        if (config?.syntaxHiding !== undefined) {
            this.toggleSyntaxHiding(config.syntaxHiding);
        }
    }

    /**
     * Gets the current document content
     * @returns The markdown content as a string
     */
    getValue(): string {
        return this.view.state.doc.toString();
    }

    /**
     * Sets the document content
     * @param value - New markdown content
     */
    setValue(value: string): void {
        this.view.dispatch({
            changes: { from: 0, to: this.view.state.doc.length, insert: value },
        });
    }

    /**
     * Toggles markdown syntax hiding
     * @param enabled - True to hide syntax markers, false to show them
     */
    toggleSyntaxHiding(enabled: boolean): void {
        this.view.dispatch({
            effects: toggleSyntaxHidingEffect.of(enabled)
        });
    }

    /**
     * Sets the editor theme
     * @param theme - Theme to apply ('light' or 'dark')
     */
    setTheme(theme: Theme): void {
        this.view.dispatch({
            effects: themeCompartment.reconfigure(theme === 'dark' ? darkTheme : lightTheme)
        });
    }

    /**
     * Gets the underlying CodeMirror EditorView instance
     * @returns The EditorView instance
     */
    getView(): EditorView {
        return this.view;
    }

    /**
     * Focuses the editor
     */
    focus(): void {
        this.view.focus();
    }

    /**
     * Destroys the editor and cleans up resources
     */
    destroy(): void {
        this.view.destroy();
    }
}

export default Moondown;

// src/moondown/core/constants.ts

/**
 * Core constants for the Moondown editor
 */

// ============================================
// Markdown Syntax Constants
// ============================================

/** Markdown inline style markers */
export const MARKDOWN_MARKERS = {
  BOLD: '**',
  ITALIC: '*',
  STRIKETHROUGH: '~~',
  HIGHLIGHT: '==',
  UNDERLINE: '~',
  INLINE_CODE: '`',
} as const;

/** Markdown block patterns */
export const MARKDOWN_PATTERNS = {
  HEADING_PREFIX: '#',
  ORDERED_LIST: /^\d+\.\s/,
  UNORDERED_LIST: /^-\s/,
  BLOCKQUOTE: /^>\s/,
  IMAGE: /^!\[.*?\]\(.*?\)$/,
  SLASH_COMMAND: /\/(\w*)$/,
} as const;

/** Markdown text templates */
export const MARKDOWN_TEMPLATES = {
  TABLE: "\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n",
  LINK: "[Link text](url)",
  CODE_BLOCK: "```\n\n```",
} as const;

// ============================================
// UI Constants
// ============================================

/** CSS class names */
export const CSS_CLASSES = {
  // Bubble menu
  BUBBLE_MENU: 'cm-bubble-menu',
  BUBBLE_MENU_ITEM: 'cm-bubble-menu-item',
  BUBBLE_MENU_DROPDOWN: 'cm-bubble-menu-dropdown',
  BUBBLE_MENU_SUB_ITEM: 'cm-bubble-menu-sub-item',
  BUBBLE_MENU_ACTIVE: 'active',
  
  // Slash command
  SLASH_COMMAND_MENU: 'cm-slash-command-menu',
  SLASH_COMMAND_ITEM: 'cm-slash-command-item',
  SLASH_COMMAND_SELECTED: 'selected',
  SLASH_COMMAND_DIVIDER: 'cm-slash-command-divider',
  
  // Image widget
  IMAGE_WIDGET: 'cm-image-widget',
  IMAGE_ERROR: 'cm-image-error',
  IMAGE_PLACEHOLDER: 'cm-image-placeholder',
  
  // Markdown syntax hiding
  HIDDEN_MARKDOWN: 'cm-hidden-markdown',
  VISIBLE_MARKDOWN: 'cm-visible-markdown',
  
  // Code blocks
  FENCED_CODE: 'cm-fenced-code',
  
  // Blockquote
  BLOCKQUOTE_LINE: 'cm-blockquote-line',
  
  // Loading states
  LOADING_WIDGET: 'cm-loading-widget',
  LOADING_SPINNER: 'cm-loading-spinner',
  NEW_TEXT: 'cm-new-text',
} as const;

/** Icon sizes */
export const ICON_SIZES = {
  SMALL: { width: '12', height: '12' },
  MEDIUM: { width: '16', height: '16' },
  LARGE: { width: '20', height: '20' },
} as const;

/** Timing constants (in milliseconds) */
export const TIMING = {
  DEBOUNCE_DELAY: 10,
  CLICK_TIMEOUT: 200,
  ANIMATION_DURATION: 2000,
} as const;

/** Popper.js configuration */
export const POPPER_CONFIG = {
  PLACEMENT: 'top',
  OFFSET: [0, 8],
} as const;

// ============================================
// Editor Behavior Constants
// ============================================

/** Selection and cursor behavior */
export const SELECTION = {
  /** Extra characters to check around selection for style markers */
  MARKER_CONTEXT_LENGTH: 3,
} as const;

/** AI-related constants */
export const AI_CONFIG = {
  MODEL: 'glm-4-flash',
  FILL_PLACEHOLDER: '{FILL_ME}',
  DEFAULT_COMPLETION_LENGTH: 200,
} as const;

// ============================================
// Type Guards
// ============================================

export type MarkdownMarker = typeof MARKDOWN_MARKERS[keyof typeof MARKDOWN_MARKERS];
export type CSSClass = typeof CSS_CLASSES[keyof typeof CSS_CLASSES];


// src/moondown/core/index.ts

/**
 * Core module exports
 * Provides centralized access to constants, types, and utilities
 */

// Constants
export * from './constants';

// Types
export * from './types/editor-types';

// Utilities
export * from './utils';


// src/moondown/core/types/editor-types.ts

import type { EditorView } from "@codemirror/view";
import type { EditorState } from "@codemirror/state";

/**
 * Core type definitions for the editor
 */

/** Theme options */
export type Theme = 'light' | 'dark';

/** Editor configuration options */
export interface EditorConfig {
  /** Initial document content */
  initialDoc?: string;
  /** Initial theme */
  theme?: Theme;
  /** Enable syntax hiding */
  syntaxHiding?: boolean;
}

/** Position range in the document */
export interface Range {
  from: number;
  to: number;
}

/** Text selection with content */
export interface Selection extends Range {
  text: string;
}

/** Coordinates in the viewport */
export interface Coordinates {
  x: number;
  y: number;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
}

/** Line information */
export interface LineInfo {
  number: number;
  from: number;
  to: number;
  text: string;
  length: number;
}

/** Action handler function type */
export type ActionHandler = (view: EditorView) => boolean | Promise<boolean>;

/** State checker function type */
export type StateChecker = (state: EditorState) => boolean;

/** Event handler function type */
export type EventHandler<T extends Event = Event> = (event: T, view: EditorView) => boolean | void;


// src/moondown/core/utils/dom-utils.ts

/**
 * Utility functions for DOM manipulation
 */

/**
 * Creates a DOM element with class names and attributes
 * @param tag - HTML tag name
 * @param className - CSS class names (space-separated)
 * @param attributes - Object of attribute key-value pairs
 * @returns Created HTML element
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  attributes?: Record<string, string>
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  
  if (className) {
    element.className = className;
  }
  
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  
  return element;
}

/**
 * Creates a Lucide icon element
 * @param iconName - Name of the Lucide icon
 * @param className - Optional CSS class
 * @returns Span element containing the icon
 */
export function createIconElement(iconName: string, className?: string): HTMLSpanElement {
  const wrapper = createElement('span', className);
  wrapper.innerHTML = `<i data-lucide="${iconName}"></i>`;
  return wrapper;
}

/**
 * Safely removes an element from the DOM
 * @param element - Element to remove
 */
export function removeElement(element: HTMLElement | null): void {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

/**
 * Checks if an element is visible in the viewport
 * @param element - Element to check
 * @param container - Container element (optional)
 * @returns True if element is visible
 */
export function isElementVisible(
  element: HTMLElement,
  container?: HTMLElement
): boolean {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container
    ? container.getBoundingClientRect()
    : { top: 0, bottom: window.innerHeight, left: 0, right: window.innerWidth };
  
  return (
    elementRect.top >= containerRect.top &&
    elementRect.bottom <= containerRect.bottom &&
    elementRect.left >= containerRect.left &&
    elementRect.right <= containerRect.right
  );
}

/**
 * Scrolls an element into view within a container
 * @param element - Element to scroll into view
 * @param container - Container element
 */
export function scrollIntoView(element: HTMLElement, container: HTMLElement): void {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  
  if (elementRect.top < containerRect.top) {
    container.scrollTop = element.offsetTop;
  } else if (elementRect.bottom > containerRect.bottom) {
    container.scrollTop = element.offsetTop + element.offsetHeight - container.clientHeight;
  }
}

/**
 * Gets all data attributes from an element
 * @param element - HTML element
 * @returns Object with data attributes
 */
export function getDataAttributes(element: HTMLElement): Record<string, string> {
  const data: Record<string, string> = {};
  
  Array.from(element.attributes).forEach(attr => {
    if (attr.name.startsWith('data-')) {
      const key = attr.name.slice(5); // Remove 'data-' prefix
      data[key] = attr.value;
    }
  });
  
  return data;
}

/**
 * Prevents default event behavior and stops propagation
 * @param event - Event to prevent
 */
export function preventDefault(event: Event): void {
  event.preventDefault();
  event.stopPropagation();
}

/**
 * Debounces a function call
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}


// src/moondown/core/utils/editor-utils.ts

import { EditorState, type ChangeSpec } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { SELECTION } from "../constants";

/**
 * Utility functions for editor operations
 */

// Re-export for convenience
export { SELECTION };

/**
 * Gets the current line at the cursor position
 * @param state - Editor state
 * @returns The line object at cursor position
 */
export function getCurrentLine(state: EditorState) {
  const { from } = state.selection.main;
  return state.doc.lineAt(from);
}

/**
 * Gets all lines in a selection range
 * @param state - Editor state
 * @param from - Start position
 * @param to - End position
 * @returns Array of line objects
 */
export function getLinesInRange(state: EditorState, from: number, to: number) {
  const lines = [];
  let pos = from;
  
  while (pos <= to) {
    const line = state.doc.lineAt(pos);
    lines.push(line);
    
    if (line.to + 1 > to) break;
    pos = line.to + 1;
  }
  
  return lines;
}

/**
 * Applies changes to the editor
 * @param view - Editor view
 * @param changes - Array of change specifications
 */
export function applyChanges(view: EditorView, changes: ChangeSpec[]) {
  if (changes.length === 0) return;
  
  view.dispatch({ changes });
}

/**
 * Gets text in a range with extra context around it
 * @param state - Editor state
 * @param from - Start position
 * @param to - End position
 * @param contextLength - Number of extra characters to include on each side
 * @returns Object with text, start position, and end position
 */
export function getTextWithContext(
  state: EditorState,
  from: number,
  to: number,
  contextLength: number
) {
  const start = Math.max(0, from - contextLength);
  const end = Math.min(state.doc.length, to + contextLength);
  
  return {
    text: state.doc.sliceString(start, end),
    start,
    end,
  };
}

/**
 * Checks if the current selection is empty (cursor position)
 * @param state - Editor state
 * @returns True if selection is empty
 */
export function isSelectionEmpty(state: EditorState): boolean {
  const { from, to } = state.selection.main;
  return from === to;
}

/**
 * Gets the selected text
 * @param state - Editor state
 * @returns Selected text or empty string
 */
export function getSelectedText(state: EditorState): string {
  const { from, to } = state.selection.main;
  return state.doc.sliceString(from, to);
}

/**
 * Replaces the current selection with text
 * @param view - Editor view
 * @param text - Text to insert
 * @param selectInserted - Whether to select the inserted text
 */
export function replaceSelection(
  view: EditorView,
  text: string,
  selectInserted: boolean = false
) {
  const { from, to } = view.state.selection.main;
  
  const changes = { from, to, insert: text };
  const newCursorPos = from + text.length;
  
  view.dispatch({
    changes,
    selection: selectInserted
      ? { anchor: from, head: newCursorPos }
      : { anchor: newCursorPos },
  });
}

/**
 * Inserts text at a specific position
 * @param view - Editor view
 * @param pos - Position to insert at
 * @param text - Text to insert
 */
export function insertAt(view: EditorView, pos: number, text: string) {
  view.dispatch({
    changes: { from: pos, insert: text },
  });
}

/**
 * Gets coordinates for a position in the editor
 * @param view - Editor view
 * @param pos - Position to get coordinates for
 * @returns Coordinates or null if position is invalid
 */
export function getCoordsAtPos(view: EditorView, pos: number) {
  return view.coordsAtPos(pos);
}

/**
 * Gets position from coordinates
 * @param view - Editor view
 * @param x - X coordinate
 * @param y - Y coordinate
 * @returns Position or null if coordinates are invalid
 */
export function getPosAtCoords(view: EditorView, x: number, y: number) {
  return view.posAtCoords({ x, y });
}


// src/moondown/core/utils/index.ts

/**
 * Centralized exports for all utility functions
 */

export * from './string-utils';
export * from './editor-utils';
export * from './dom-utils';


// src/moondown/core/utils/string-utils.ts

/**
 * Utility functions for string manipulation
 */

/**
 * Escapes special regex characters in a string
 * @param str - String to escape
 * @returns Escaped string safe for use in RegExp
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Checks if a string matches Markdown image syntax
 * @param text - Text to check
 * @returns True if text is an image markdown
 */
export function isMarkdownImage(text: string): boolean {
  return /^!\[.*?\]\(.*?\)$/.test(text.trim());
}

/**
 * Creates a heading prefix with the specified level
 * @param level - Heading level (1-6)
 * @returns Heading prefix string (e.g., "# ", "## ")
 */
export function createHeadingPrefix(level: number): string {
  if (level < 1 || level > 6) {
    throw new Error('Heading level must be between 1 and 6');
  }
  return '#'.repeat(level) + ' ';
}

/**
 * Extracts heading level from a line of text
 * @param text - Line text to check
 * @returns Heading level (1-6) or null if not a heading
 */
export function getHeadingLevel(text: string): number | null {
  const match = text.match(/^(#{1,6})\s/);
  return match ? match[1].length : null;
}

/**
 * Checks if a line is an ordered list item
 * @param text - Line text to check
 * @returns True if the line is an ordered list item
 */
export function isOrderedListItem(text: string): boolean {
  return /^\d+\.\s/.test(text);
}

/**
 * Checks if a line is an unordered list item
 * @param text - Line text to check
 * @returns True if the line is an unordered list item
 */
export function isUnorderedListItem(text: string): boolean {
  return /^-\s/.test(text);
}

/**
 * Extracts the number from an ordered list item
 * @param text - Ordered list item text
 * @returns The list number or null if not an ordered list item
 */
export function extractListNumber(text: string): number | null {
  const match = text.match(/^(\d+)\.\s/);
  return match ? parseInt(match[1], 10) : null;
}


// src/moondown/extensions/default-extensions.ts
import { type Extension, Compartment } from '@codemirror/state';
import { EditorView, keymap, rectangularSelection } from '@codemirror/view';
import { indentOnInput } from '@codemirror/language';
import { markdown } from '@codemirror/lang-markdown';
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import { languages } from "@codemirror/language-data";
import { GFM } from "@lezer/markdown";

// Import extensions
import { correctList } from "./correct-list";
import { markdownSyntaxHiding } from "./markdown-syntax-hiding";
import { Mark } from "./mark-parser";
import { Underline } from "./underline-parser";
import { Strikethrough } from "./strikethrough-parser";
import { finalNewLine } from "./final-new-line";
import { tableExtension } from "./table";
import { slashCommand } from "./slash-command";
import { imageExtension } from "./image";
import { fencedCode } from "./fenced-code";
import { blockquote } from "./blockquote";
import { bubbleMenu } from "./bubble-menu";

// Import theme
import { lightTheme } from "../theme/base-theme";

/**
 * Theme compartment for dynamic theme switching
 */
export const themeCompartment = new Compartment();

/**
 * Default editor extensions
 * Includes all core functionality: markdown parsing, syntax highlighting,
 * bubble menu, slash commands, table editing, image support, etc.
 */
export const defaultExtensions: Extension[] = [
    // Table editing support
    tableExtension(),

    // History and undo/redo
    history(),

    // Selection and editing
    rectangularSelection(),
    indentOnInput(),

    // Custom extensions
    slashCommand(),
    correctList(),
    fencedCode(),
    blockquote(),
    bubbleMenu(),
    imageExtension(),

    // Keymaps
    keymap.of([
        indentWithTab,
        ...defaultKeymap,
        ...completionKeymap,
        ...historyKeymap,
        ...closeBracketsKeymap
    ]),

    // Editor behavior
    EditorView.lineWrapping,
    markdownSyntaxHiding(),

    // Markdown language support
    markdown({
        codeLanguages: languages,
        extensions: [GFM, Mark, Underline, Strikethrough],
        addKeymap: false,
    }),

    // Final newline
    finalNewLine,

    // Default theme (light)
    themeCompartment.of(lightTheme)
];

// src/moondown/extensions/strikethrough-parser/index.ts
import {StrikethroughExtension} from "./strikethrough-parser-extension.ts";

export const Strikethrough = StrikethroughExtension;

// src/moondown/extensions/strikethrough-parser/strikethrough-parser-extension.ts
import {InlineContext, type MarkdownExtension} from "@lezer/markdown";

export const StrikethroughDelim = { resolve: "Strikethrough", mark: "StrikethroughMarker" };

export const StrikethroughExtension: MarkdownExtension = {
    defineNodes: ["Strikethrough", "StrikethroughMarker"],
    parseInline: [
        {
            name: "Strikethrough",
            parse(cx: InlineContext, next: number, pos: number) {
                if (next != 126 /* '~' */ || cx.char(pos + 1) != 126) return -1;
                return cx.addDelimiter(StrikethroughDelim, pos, pos + 2, true, true);
            },
        },
    ],
};

// src/moondown/extensions/slash-command/commands.ts
import { EditorView } from "@codemirror/view";
import { ghostWriterExecutor } from "./ghost-writer";
import { MARKDOWN_TEMPLATES } from "../../core/constants";
import { getCurrentLine } from "../../core/utils/editor-utils";

/**
 * Slash command option interface
 */
export interface SlashCommandOption {
    title: string;
    icon: string;
    execute: (view: EditorView) => void | Promise<AbortController>;
}

/**
 * Inserts text at the beginning of the current line
 */
function insertAtLineStart(view: EditorView, text: string, cursorOffset: number = 0): void {
    const line = getCurrentLine(view.state);
    view.dispatch({
        changes: { from: line.from, to: line.from, insert: text },
        selection: { anchor: line.from + text.length + cursorOffset }
    });
}

/**
 * Inserts text at cursor position with optional selection
 */
function insertAtCursor(
    view: EditorView,
    text: string,
    selectionStart?: number,
    selectionEnd?: number
): void {
    const pos = view.state.selection.main.from;
    const changes = { from: pos, insert: text };
    
    if (selectionStart !== undefined && selectionEnd !== undefined) {
        view.dispatch({
            changes,
            selection: { anchor: pos + selectionStart, head: pos + selectionEnd }
        });
    } else {
        view.dispatch({
            changes,
            selection: { anchor: pos + text.length }
        });
    }
}

/**
 * Available slash commands
 */
export const slashCommands: SlashCommandOption[] = [
    {
        title: "AI 续写",
        icon: "bot",
        execute: async (view: EditorView) => ghostWriterExecutor(view)
    },
    {
        title: "Heading 1",
        icon: "heading-1",
        execute: (view: EditorView) => insertAtLineStart(view, "# ", 0)
    },
    {
        title: "Heading 2",
        icon: "heading-2",
        execute: (view: EditorView) => insertAtLineStart(view, "## ", 0)
    },
    {
        title: "Heading 3",
        icon: "heading-3",
        execute: (view: EditorView) => insertAtLineStart(view, "### ", 0)
    },
    {
        title: "Heading 4",
        icon: "heading-4",
        execute: (view: EditorView) => insertAtLineStart(view, "#### ", 0)
    },
    {
        title: "divider",
        icon: "",
        execute: () => {} // Divider placeholder
    },
    {
        title: "Insert Table",
        icon: "table",
        execute: (view: EditorView) => insertAtCursor(view, MARKDOWN_TEMPLATES.TABLE)
    },
    {
        title: "Insert Link",
        icon: "link",
        execute: (view: EditorView) => insertAtCursor(view, MARKDOWN_TEMPLATES.LINK, 1, 10)
    },
    {
        title: "Quote Block",
        icon: "quote",
        execute: (view: EditorView) => insertAtLineStart(view, "> ", 0)
    },
    {
        title: "Ordered List",
        icon: "list-ordered",
        execute: (view: EditorView) => insertAtLineStart(view, "1. ", 0)
    },
    {
        title: "Unordered List",
        icon: "list",
        execute: (view: EditorView) => insertAtLineStart(view, "- ", 0)
    },
    {
        title: "Code Block",
        icon: "code",
        execute: (view: EditorView) => insertAtCursor(view, MARKDOWN_TEMPLATES.CODE_BLOCK, 4, 4)
    },
]

// src/moondown/extensions/slash-command/keymap.ts
import {EditorView, keymap} from "@codemirror/view";
import {slashCommandState, toggleSlashCommand, updateSelectedIndex} from "./fields.ts";
import {slashCommandPlugin} from "./slash-command.ts";
import {slashCommands} from "./commands.ts";

export function handleKeyDown(view: EditorView, event: KeyboardEvent): boolean {
    const state = view.state.field(slashCommandState)
    const plugin = view.plugin(slashCommandPlugin)
    if (event.key === "Escape") {
        if (state.active) {
            view.dispatch({
                effects: toggleSlashCommand.of(false)
            })
        }
        if (plugin) {
            plugin.abortAIContinuation()
        }
        return true
    }

    if (!state.active) return false

    const filteredCommands = slashCommands.filter(cmd =>
        cmd.title.toLowerCase().includes(state.filterText.toLowerCase())
    )

    switch (event.key) {
        case "ArrowDown":
            // 如果filteredCommands.title为divider，则跳过并选中更下一个；否则，则选中下一个
            { let nextIndex = (state.selectedIndex + 1) % filteredCommands.length
            while (filteredCommands[nextIndex].title === "divider") {
                nextIndex = (nextIndex + 1) % filteredCommands.length
            }
            view.dispatch({
                effects: updateSelectedIndex.of(nextIndex)
            })
            return true }
        case "ArrowUp":
            // 如果filteredCommands.title为divider，则跳过并选中更上一个；否则，则选中上一个
            { let prevIndex = (state.selectedIndex - 1 + filteredCommands.length) % filteredCommands.length
            while (filteredCommands[prevIndex].title === "divider") {
                prevIndex = (prevIndex - 1 + filteredCommands.length) % filteredCommands.length
            }
            view.dispatch({
                effects: updateSelectedIndex.of(prevIndex)
            })
            return true }
        case "Enter":
            if (filteredCommands.length > 0) {
                const selectedCommand = filteredCommands[state.selectedIndex]
                view.dispatch({
                    changes: {from: state.pos, to: view.state.selection.main.from, insert: ""},
                    effects: toggleSlashCommand.of(false)
                })
                selectedCommand.execute(view)
                view.focus()
            }
            return true
        case "Escape":
            view.dispatch({
                effects: toggleSlashCommand.of(false)
            })
            return true
    }

    return false
}
export const slashCommandKeymap = keymap.of([
    {
        key: "ArrowDown",
        run: (view) => {
            return handleKeyDown(view, {key: "ArrowDown"} as KeyboardEvent)
        },
        preventDefault: true
    },
    {
        key: "ArrowUp",
        run: (view) => {
            return handleKeyDown(view, {key: "ArrowUp"} as KeyboardEvent)
        },
        preventDefault: true
    },
    {
        key: "Enter",
        run: (view) => {
            return handleKeyDown(view, {key: "Enter"} as KeyboardEvent)
        },
        preventDefault: true
    },
    {
        key: "Escape",
        run: (view) => {
            return handleKeyDown(view, {key: "Escape"} as KeyboardEvent)
        },
        preventDefault: true
    }
])

// src/moondown/extensions/slash-command/slash-command.ts
import { EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { createIcons, icons } from 'lucide';
import { slashCommandState, toggleSlashCommand } from "./fields";
import { type SlashCommandOption, slashCommands } from "./commands";
import { CSS_CLASSES, ICON_SIZES, TIMING } from "../../core/constants";
import { createElement, createIconElement, debounce, scrollIntoView as scrollElementIntoView } from "../../core/utils/dom-utils";

/**
 * SlashCommandPlugin - Implements the slash command menu functionality
 * Provides quick insertion of markdown elements via "/" trigger
 */

export const slashCommandPlugin = ViewPlugin.fromClass(class {
    private menu: HTMLElement;
    private debounceTimer: number | null = null;
    private currentAbortController: AbortController | null = null;
    private debouncedUpdate: (update: ViewUpdate) => void;

    constructor(view: EditorView) {
        this.menu = createElement('div', CSS_CLASSES.SLASH_COMMAND_MENU);
        view.dom.appendChild(this.menu);
        
        // Create debounced update function
        this.debouncedUpdate = debounce(
            (update: ViewUpdate) => this.updateMenu(update),
            TIMING.DEBOUNCE_DELAY
        );

        // Add click event listener to the editor
        view.dom.addEventListener('click', () => {
            this.abortAIContinuation();
        });

        // Close menu on outside clicks
        document.addEventListener('click', (e) => {
            if (!this.menu.contains(e.target as Node) && !view.dom.contains(e.target as Node)) {
                view.dispatch({
                    effects: toggleSlashCommand.of(false)
                });
                this.abortAIContinuation();
            }
        });
    }

    update(update: ViewUpdate): void {
        this.debouncedUpdate(update);
    }

    /**
     * Updates the menu position and content
     */
    private updateMenu(update: ViewUpdate): void {
        const state = update.state.field(slashCommandState);
        
        if (!state.active) {
            this.hide();
            return;
        }

        this.show();

        requestAnimationFrame(() => {
            const pos = update.view.coordsAtPos(state.pos);
            if (pos) {
                const editorRect = update.view.dom.getBoundingClientRect();
                const menuRect = this.menu.getBoundingClientRect();

                // Position menu above or below cursor based on available space
                if (pos.top + menuRect.height > editorRect.bottom) {
                    // Position above cursor
                    this.menu.style.top = `${pos.top - editorRect.top - menuRect.height}px`;
                } else {
                    // Position below cursor
                    this.menu.style.top = `${pos.top - editorRect.top + 20}px`;
                }

                this.menu.style.left = `${pos.left - editorRect.left}px`;
            }
        });

        const filteredCommands = this.filterCommands(state.filterText);

        this.renderCommands(filteredCommands, state.selectedIndex, update.view, state.pos);
    }

    /**
     * Filters commands based on search text
     */
    private filterCommands(filterText: string): SlashCommandOption[] {
        return slashCommands.filter(cmd =>
            cmd.title.toLowerCase().includes(filterText.toLowerCase())
        );
    }

    /**
     * Renders the command list
     */
    private renderCommands(
        commands: SlashCommandOption[],
        selectedIndex: number,
        view: EditorView,
        pos: number
    ): void {
        requestAnimationFrame(() => {
            const fragment = document.createDocumentFragment();

            commands.forEach((cmd, index) => {
                if (cmd.title === "divider") {
                    const divider = createElement("hr", CSS_CLASSES.SLASH_COMMAND_DIVIDER);
                    fragment.appendChild(divider);
                    return;
                }

                const isSelected = index === selectedIndex;
                const itemClass = `${CSS_CLASSES.SLASH_COMMAND_ITEM} ${
                    isSelected ? CSS_CLASSES.SLASH_COMMAND_SELECTED : ''
                }`;
                const item = createElement("div", itemClass);

                const icon = createIconElement(cmd.icon, "cm-slash-command-icon");
                const title = createElement("span", "cm-slash-command-title");
                title.textContent = cmd.title;

                item.appendChild(icon);
                item.appendChild(title);

                item.addEventListener("mousedown", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.executeCommand(view, cmd, pos);
                });
                
                fragment.appendChild(item);
            });

            this.menu.innerHTML = '';
            this.menu.appendChild(fragment);

            // Initialize Lucide icons
            createIcons({
                icons,
                attrs: ICON_SIZES.MEDIUM,
            });

            // Ensure selected item is visible
            this.scrollSelectedIntoView();
        });
    }

    /**
     * Scrolls the selected item into view
     */
    private scrollSelectedIntoView(): void {
        const selectedItem = this.menu.querySelector(
            `.${CSS_CLASSES.SLASH_COMMAND_ITEM}.${CSS_CLASSES.SLASH_COMMAND_SELECTED}`
        ) as HTMLElement;
        
        if (selectedItem) {
            scrollElementIntoView(selectedItem, this.menu);
        }
    }

    /**
     * Executes a slash command
     */
    private executeCommand(view: EditorView, cmd: SlashCommandOption, pos: number): void {
        view.dispatch({
            changes: { from: pos, to: view.state.selection.main.from, insert: "" },
            effects: toggleSlashCommand.of(false)
        });
        
        const result = cmd.execute(view);
        if (result instanceof Promise) {
            result.then(controller => {
                if (controller instanceof AbortController) {
                    this.currentAbortController = controller;
                }
            });
        }
        
        view.focus();
    }

    /**
     * Shows the menu
     */
    private show(): void {
        this.menu.style.display = "block";
    }

    /**
     * Hides the menu
     */
    private hide(): void {
        this.menu.style.display = "none";
    }

    /**
     * Sets the current abort controller for AI operations
     */
    setCurrentAbortController(controller: AbortController): void {
        this.currentAbortController = controller;
    }

    /**
     * Clears the current abort controller
     */
    clearCurrentAbortController(): void {
        this.currentAbortController = null;
    }

    /**
     * Aborts any ongoing AI continuation
     */
    abortAIContinuation(): void {
        if (this.currentAbortController) {
            this.currentAbortController.abort();
            this.currentAbortController = null;
        }
    }

    /**
     * Cleanup on plugin destroy
     */
    destroy(): void {
        this.menu.remove();
        this.abortAIContinuation();
    }
})


// src/moondown/extensions/slash-command/index.ts
import {type Extension} from "@codemirror/state";
import {EditorView} from "@codemirror/view";
import {handleKeyDown, slashCommandKeymap} from "./keymap.ts";
import {newTextState, scrollIntoView} from "./ghost-writer.ts";
import {slashCommandState, toggleSlashCommand} from "./fields.ts";
import {slashCommandPlugin} from "./slash-command.ts";

export function slashCommand(): Extension {
    return [
        slashCommandState,
        slashCommandPlugin,
        newTextState,
        slashCommandKeymap,
        EditorView.domEventHandlers({
            keydown(event, view) {
                if (event.key === "/") {
                    view.dispatch({
                        effects: toggleSlashCommand.of(true)
                    })
                }
                // Handle Escape key globally
                if (event.key === "Escape") {
                    return handleKeyDown(view, event)
                }
            }
        }),
        EditorView.updateListener.of(update => {
            if (update.transactions.length > 0) {
                for (const transaction of update.transactions) {
                    for (const effect of transaction.effects) {
                        if (effect.is(scrollIntoView)) {
                            update.view.dispatch({
                                effects: EditorView.scrollIntoView(effect.value)
                            })
                        }
                    }
                }
            }
        }),
    ]
}

// src/moondown/extensions/slash-command/fields.ts
import {StateEffect, StateField} from "@codemirror/state";

export const toggleSlashCommand = StateEffect.define<boolean>()

export const updateSelectedIndex = StateEffect.define<number>()

export const slashCommandState = StateField.define<{
    active: boolean,
    filterText: string,
    pos: number,
    selectedIndex: number
}>({
    create: () => ({active: false, filterText: "", pos: 0, selectedIndex: 0}),
    update(value, tr) {
        for (let e of tr.effects) {
            if (e.is(toggleSlashCommand)) {
                return {active: e.value, filterText: "", pos: tr.selection?.main.from ?? 0, selectedIndex: 0}
            }
            // 添加对选中索引更新的处理
            if (e.is(updateSelectedIndex)) {
                return {...value, selectedIndex: e.value}
            }
        }
        if (tr.selection) {
            const line = tr.state.doc.lineAt(tr.selection.main.from)
            const lineText = line.text.slice(0, tr.selection.main.from - line.from)
            const match = /\/(\w*)$/.exec(lineText)
            const cursorPos = tr.selection.main.from - line.from

            if (match && (cursorPos === line.text.length || (cursorPos === 0 && lineText.trim() === ""))) {
                return {
                    active: true,
                    filterText: match[1],
                    pos: tr.selection.main.from - match[0].length,
                    selectedIndex: value.selectedIndex
                }
            } else {
                return {active: false, filterText: "", pos: 0, selectedIndex: 0}
            }
        }
        return value
    },
})


// src/moondown/extensions/slash-command/ghost-writer.ts
import { Decoration, type DecorationSet, EditorView, WidgetType } from "@codemirror/view";
import { EditorSelection, StateEffect, StateField } from "@codemirror/state";
import { slashCommandPlugin } from "./slash-command";
import { chatCompletionStream } from "../../ai/completions";
import { completionPrompt } from "../../ai/prompts";
import { CSS_CLASSES, TIMING } from "../../core/constants";

/**
 * Loading widget displayed during AI text generation
 */
class LoadingWidget extends WidgetType {
    /** Flag to identify this widget type */
    readonly isLoadingWidget = true;

    toDOM(): HTMLElement {
        const div = document.createElement("div");
        div.className = CSS_CLASSES.LOADING_WIDGET;
        div.innerHTML = `
          <div class="${CSS_CLASSES.LOADING_SPINNER}"></div>
          <span>AI is thinking...</span>
        `;
        return div;
    }
}

/**
 * State effects for ghost writer
 */
const addLoadingEffect = StateEffect.define<{ pos: number }>();
const removeLoadingEffect = StateEffect.define<null>();
const markNewText = StateEffect.define<{ from: number; to: number }>();
const unmarkNewText = StateEffect.define<{ from: number; to: number }>();

/**
 * State field for managing new text decorations and loading widget
 */
export const newTextState = StateField.define<DecorationSet>({
    create() {
        return Decoration.none;
    },
    update(value, tr) {
        value = value.map(tr.changes);
        
        for (const e of tr.effects) {
            if (e.is(markNewText)) {
                value = value.update({
                    add: [newTextMark.range(e.value.from, e.value.to)]
                });
            } else if (e.is(addLoadingEffect)) {
                value = value.update({
                    add: [Decoration.widget({
                        widget: new LoadingWidget(),
                        side: 1
                    }).range(e.value.pos)]
                });
            } else if (e.is(removeLoadingEffect)) {
                value = value.update({
                    filter: (_from, _to, decoration) => {
                        return !(decoration.spec.widget && (decoration.spec.widget as LoadingWidget).isLoadingWidget);
                    }
                });
            } else if (e.is(unmarkNewText)) {
                value = value.update({
                    filter: (from, to, decoration) => {
                        const isTargetDecoration = decoration.spec.class === CSS_CLASSES.NEW_TEXT;
                        const isInRange = from >= e.value.from && to <= e.value.to;
                        return !(isTargetDecoration && isInRange);
                    }
                });
            }
        }
        
        return value;
    },
    provide: f => EditorView.decorations.from(f)
});

/** Effect to scroll editor view to a specific position */
export const scrollIntoView = StateEffect.define<number>();

/** Decoration mark for newly generated text */
const newTextMark = Decoration.mark({ class: CSS_CLASSES.NEW_TEXT });

/**
 * Executes AI-powered ghost writer to continue text
 * @param view - Editor view instance
 * @returns Promise that resolves to AbortController for cancellation
 */
export async function ghostWriterExecutor(view: EditorView): Promise<AbortController> {
    const { state, dispatch } = view;
    const { from, to } = state.selection.ranges[0];
    const text = state.doc.toString();
    const prefix = text.slice(0, to);
    const suffix = text.slice(from);
    const pos = state.selection.main.from;
    
    const startPos = pos;
    let endPos = pos;

    // Show loading indicator
    dispatch({
        effects: addLoadingEffect.of({ pos })
    });

    const abortController = new AbortController();
    const plugin = view.plugin(slashCommandPlugin);
    
    if (plugin) {
        plugin.setCurrentAbortController(abortController);
    }

    try {
        const stream = await chatCompletionStream(
            completionPrompt,
            `prefix: ${prefix}\n{FILL_ME}\nsuffix: ${suffix}`,
            abortController.signal
        );

        for await (const part of stream) {
            if (abortController.signal.aborted) {
                console.log('Stream aborted');
                break;
            }
            
            const content = part.choices[0].delta?.content;
            if (content) {
                const insertPos = endPos;
                endPos += content.length;
                
                dispatch({
                    changes: { from: insertPos, insert: content },
                    effects: [
                        markNewText.of({ from: insertPos, to: insertPos + content.length }),
                        scrollIntoView.of(insertPos + content.length)
                    ]
                });
            }
        }
    } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
            console.log('AI continuation aborted');
        } else {
            console.error('Error during AI continuation:', error);
        }
    } finally {
        // Remove loading indicator
        dispatch({
            effects: removeLoadingEffect.of(null)
        });
        
        // Move cursor to end of generated text
        view.dispatch(view.state.update({
            selection: EditorSelection.cursor(endPos)
        }));

        // Remove highlight after animation completes
        const finalEndPos = endPos;
        setTimeout(() => {
            view.dispatch({
                effects: unmarkNewText.of({ from: startPos, to: finalEndPos })
            });
        }, TIMING.ANIMATION_DURATION);

        if (plugin) {
            plugin.clearCurrentAbortController();
        }
    }
    
    return abortController;
}

// src/moondown/extensions/image/image-renderer.ts
import {RangeSetBuilder} from "@codemirror/state"
import {
    EditorView,
    Decoration,
    type DecorationSet,
    ViewPlugin,
    ViewUpdate,
    WidgetType
} from "@codemirror/view"
import {syntaxTree} from "@codemirror/language"
import {imageSizeField} from "./fields.ts";
import {imageWidgetCache} from "./types.ts";
import {ImageWidget} from "./image-widgets.ts";

export const imageWidgetPlugin = ViewPlugin.fromClass(
    class {
        decorations: DecorationSet

        constructor(view: EditorView) {
            this.decorations = this.buildDecorations(view)
        }

        update(update: ViewUpdate) {
            if (update.docChanged || update.viewportChanged) {
                this.decorations = this.buildDecorations(update.view)
            }
        }

        buildDecorations(view: EditorView) {
            const builder = new RangeSetBuilder<Decoration>();
            const imageSizes = view.state.field(imageSizeField);

            // 收集所有需要添加的装饰器
            const decorationsToAdd: {from: number, to: number, decoration: Decoration}[] = [];

            for (const {from, to} of view.visibleRanges) {
                syntaxTree(view.state).iterate({
                    from,
                    to,
                    enter: (node) => {
                        if (node.type.name === "Image") {
                            const text = view.state.doc.sliceString(node.from, node.to);
                            const match = text.match(/!\[([^\]]*)\]\(([^)]+)\)/);

                            if (match) {
                                const [, alt, src] = match;
                                const cacheKey = `${src}|${alt}`;
                                let widget = imageWidgetCache.get(cacheKey);

                                if (!widget) {
                                    widget = new ImageWidget(alt, src, node.from, node.to, view);
                                    imageWidgetCache.set(cacheKey, widget);
                                } else {
                                    widget.updatePosition(node.from, node.to);
                                }

                                decorationsToAdd.push({
                                    from: node.from,
                                    to: node.to,
                                    decoration: Decoration.replace({
                                        widget: widget,
                                        inclusive: true
                                    })
                                });

                                if (imageSizes[node.from]) {
                                    decorationsToAdd.push({
                                        from: node.to,
                                        to: node.to,
                                        decoration: Decoration.widget({
                                            widget: new class extends WidgetType {
                                                toDOM() {
                                                    const el = document.createElement('div');
                                                    el.style.height = '0';
                                                    return el;
                                                }
                                            },
                                            side: 1
                                        })
                                    });
                                }
                            }
                        }
                    }
                });
            }

            // 按照 from 位置排序
            decorationsToAdd.sort((a, b) => a.from - b.from);

            // 按顺序添加装饰器
            for (const {from, to, decoration} of decorationsToAdd) {
                builder.add(from, to, decoration);
            }

            // 清理不再使用的缓存
            for (const [key, widget] of imageWidgetCache) {
                if (!view.state.doc.sliceString(widget.from, widget.to).includes(widget.src)) {
                    imageWidgetCache.delete(key);
                }
            }

            return builder.finish();
        }
    },
    {
        decorations: v => v.decorations
    }
)

// src/moondown/extensions/image/types.ts
import {StateEffect} from "@codemirror/state";
import {ImageWidget} from "./image-widgets.ts";

// 类型定义
export interface ImageLoadedEffect {
    from: number;
    to: number;
    lines: number;
}

export interface ImagePlaceholderEffect {
    pos: number;
}

export interface ImageSizes {
    [key: number]: number;
}

// 状态效果定义
export const imageLoadedEffect = StateEffect.define<ImageLoadedEffect>()
export const updateImagePlaceholder = StateEffect.define<ImagePlaceholderEffect | null>()

// 图片小部件缓存
export const imageWidgetCache = new Map<string, ImageWidget>()


// src/moondown/extensions/image/image-drag-n-drop.ts
import {EditorView, ViewPlugin, type PluginValue, ViewUpdate} from '@codemirror/view';

class ImagePastePlugin implements PluginValue {
    private view: EditorView;

    constructor(view: EditorView) {
        this.view = view;
        this.setupListeners();
    }

    private setupListeners() {
        this.view.dom.addEventListener('dragover', this.handleDragOver);
        this.view.dom.addEventListener('drop', this.handleDrop);
        this.view.dom.addEventListener('paste', this.handlePaste);
    }

    update(_update: ViewUpdate) {
        // This method is required but we don't need to do anything here
    }

    destroy() {
        this.view.dom.removeEventListener('dragover', this.handleDragOver);
        this.view.dom.removeEventListener('drop', this.handleDrop);
        this.view.dom.removeEventListener('paste', this.handlePaste);
    }

    private handleDragOver = (e: DragEvent) => {
        e.preventDefault();
    };

    private handleDrop = (e: DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type.startsWith('image/')) {
                    this.processImage(file, this.view.posAtCoords({x: e.clientX, y: e.clientY}));
                }
            }
        }
    };

    private handlePaste = (e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (items) {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    if (file) {
                        e.preventDefault();
                        this.processImage(file, this.view.state.selection.main.head);
                    }
                }
            }
        }
    };

    private processImage(file: File, pos: number | null) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Data = e.target?.result as string;
            if (pos !== null) {
                const markdownImage = `![${this.getFileNameWithoutExtension(file.name)}](${base64Data})`;
                const transaction = this.view.state.update({
                    changes: {from: pos, to: pos, insert: markdownImage},
                    selection: {anchor: pos + markdownImage.length},
                });
                this.view.dispatch(transaction);
            }
        };
        reader.readAsDataURL(file);
    }

    private getFileNameWithoutExtension(fileName: string): string {
        return fileName.replace(/\.[^/.]+$/, "");
    }
}

export const imageDragAndDropPlugin = ViewPlugin.fromClass(ImagePastePlugin);


// src/moondown/extensions/image/index.ts
import {EditorSelection, type Extension} from "@codemirror/state";
import {EditorView, ViewUpdate} from "@codemirror/view";
import {imageSizeField, placeholderField} from "./fields.ts";
import {imageWidgetPlugin} from "./image-renderer.ts";
import {imageDragAndDropPlugin} from "./image-drag-n-drop.ts";

export function imageExtension(): Extension {
    return [
        imageSizeField,
        placeholderField,
        imageWidgetPlugin,
        imageDragAndDropPlugin,
        EditorView.updateListener.of((update: ViewUpdate) => {
            if (update.selectionSet || update.viewportChanged) {
                const {from, to} = update.state.selection.main
                update.view.dom.querySelectorAll(".cm-image-widget").forEach((el: Element) => {
                    const pos = update.view.posAtDOM(el as HTMLElement)
                    if (pos !== null && pos >= from && pos < to) {
                        el.classList.add("selected")
                    } else {
                        el.classList.remove("selected")
                    }
                })
            }
        }),
        EditorView.inputHandler.of((view, from, _to, text) => {
            const doc = view.state.doc;
            const line = doc.lineAt(from);
            const lineContent = line.text;
            let isImageLine = false;

            // 判断lineContent.trim()是不是图片的markdown语法，使用完备的正则表达式匹配
            const imageReg = /^!\[([^\]]*)\]\(([^)]+)\)$/;
            if (imageReg.test(lineContent.trim())) {
                isImageLine = true;
            }

            // 检查是否在图片行的开头输入
            if (from === line.from && isImageLine) {
                // 在图片前插入新行
                view.dispatch({
                    changes: [{from: line.from, insert: '\n'}],
                    selection: EditorSelection.cursor(line.from),
                    scrollIntoView: true
                });

                // 在新行中插入文本
                view.dispatch({
                    changes: [{from: line.from, insert: text}],
                    selection: EditorSelection.cursor(line.from + text.length),
                    scrollIntoView: true
                });

                return true; // 表示我们已经处理了这个输入
            }

            return false; // 让 CodeMirror 处理其他情况
        })
    ]
}


// src/moondown/extensions/image/fields.ts
import {StateField} from "@codemirror/state";
import {Decoration, type DecorationSet, EditorView, WidgetType} from "@codemirror/view";
import {imageLoadedEffect, type ImageSizes, updateImagePlaceholder} from "./types.ts";

// 图片大小状态字段
export const imageSizeField = StateField.define<ImageSizes>({
    create: () => ({}),
    update(sizes, tr) {
        const newSizes = {...sizes}
        for (const e of tr.effects) {
            if (e.is(imageLoadedEffect)) {
                newSizes[e.value.from] = e.value.lines
            }
        }
        return newSizes
    }
})

// 占位符状态字段
export const placeholderField = StateField.define<DecorationSet>({
    create: () => Decoration.none,
    update(decorations, tr) {
        decorations = decorations.map(tr.changes);
        for (let e of tr.effects) {
            if (e.is(updateImagePlaceholder)) {
                if (e.value === null) {
                    decorations = Decoration.none;
                } else {
                    const {pos} = e.value;
                    const line = tr.state.doc.lineAt(pos);
                    const placeholderPos = line.to;
                    decorations = Decoration.set(
                        Decoration.widget({
                            widget: new class extends WidgetType {
                                toDOM() {
                                    const el = document.createElement('div');
                                    el.className = 'cm-image-placeholder';
                                    el.style.height = `1em`;
                                    return el;
                                }
                            },
                            side: 1
                        }).range(placeholderPos)
                    );
                }
            }
        }
        return decorations;
    },
    provide: f => EditorView.decorations.from(f)
});


// src/moondown/extensions/image/image-widgets.ts
import { EditorView, WidgetType } from "@codemirror/view";
import { EditorSelection } from "@codemirror/state";
import errorImageGeneric from "./error-image-generic.png";
import { imageLoadedEffect, updateImagePlaceholder } from "./types";
import { CSS_CLASSES, TIMING } from "../../core/constants";
import { createElement } from "../../core/utils/dom-utils";

/**
 * Image widget for rendering and managing images in the editor
 * Supports drag-and-drop repositioning and error handling
 */
export class ImageWidget extends WidgetType {
    private loaded = false;
    private errorSrc: string | null = null;
    private isError = false;
    private isDragging = false;
    private dragStartX = 0;
    private dragStartY = 0;
    private clickTimeout: NodeJS.Timeout | null = null;
    private isMouseDownOnImage = false;
    private currentDraggingImg: HTMLImageElement | null = null;

    constructor(
        public alt: string,
        public src: string,
        public from: number,
        public to: number,
        private view: EditorView
    ) {
        super();
    }

    toDOM(): HTMLElement {
        const wrapper = this.createWrapper();
        const imageWrapper = this.createImageWrapper();
        const img = this.createImage();
        const overlay = createElement("div", "cm-image-overlay");
        const altText = this.createAltText();

        imageWrapper.appendChild(img);
        imageWrapper.appendChild(overlay);
        wrapper.appendChild(imageWrapper);
        wrapper.appendChild(altText);

        this.attachEventListeners(wrapper, img, altText);

        return wrapper;
    }

    /**
     * Creates the main wrapper element
     */
    private createWrapper(): HTMLElement {
        const className = this.isError 
            ? `${CSS_CLASSES.IMAGE_WIDGET} ${CSS_CLASSES.IMAGE_ERROR}`
            : CSS_CLASSES.IMAGE_WIDGET;
        return createElement("div", className);
    }

    /**
     * Creates the image wrapper container
     */
    private createImageWrapper(): HTMLElement {
        return createElement("div", "cm-image-wrapper");
    }

    /**
     * Creates the image element
     */
    private createImage(): HTMLImageElement {
        const img = document.createElement("img");
        img.src = this.errorSrc || this.src;
        img.alt = this.alt;
        img.style.transform = 'scale(0.9)';
        return img;
    }

    /**
     * Creates the alt text element
     */
    private createAltText(): HTMLElement {
        const altText = createElement("div", "cm-image-alt");
        altText.textContent = this.alt;
        return altText;
    }

    /**
     * Attaches event listeners to wrapper and image
     */
    private attachEventListeners(
        wrapper: HTMLElement,
        img: HTMLImageElement,
        altText: HTMLElement
    ): void {
        wrapper.addEventListener('mousedown', this.handleMouseDown);
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);

        if (!this.loaded) {
            img.addEventListener('load', () => this.handleImageLoad(wrapper));
            img.addEventListener('error', () => this.handleImageError(wrapper, img, altText));
        }
    }

    /**
     * Handles image load event
     */
    private handleImageLoad(wrapper: HTMLElement): void {
        this.loaded = true;
        const lineHeight = this.view.defaultLineHeight;
        const lines = Math.ceil(wrapper.offsetHeight / lineHeight);
        
        this.view.dispatch({
            effects: imageLoadedEffect.of({ from: this.from, to: this.to, lines })
        });
    }

    /**
     * Handles image error event
     */
    private handleImageError(
        wrapper: HTMLElement,
        img: HTMLImageElement,
        altText: HTMLElement
    ): void {
        this.isError = true;
        wrapper.classList.add(CSS_CLASSES.IMAGE_ERROR);
        this.errorSrc = errorImageGeneric;
        img.src = this.errorSrc;
        altText.textContent = this.alt;
    }

    /**
     * Handles mouse down event - initiates drag or selection
     */
    private handleMouseDown = (event: MouseEvent): void => {
        event.preventDefault();
        this.isMouseDownOnImage = true;
        this.dragStartX = event.clientX;
        this.dragStartY = event.clientY;
        this.currentDraggingImg = event.target as HTMLImageElement;

        // Start drag after timeout to distinguish from click
        this.clickTimeout = setTimeout(() => {
            this.isDragging = true;
            document.body.style.cursor = 'move';
        }, TIMING.CLICK_TIMEOUT);
    }

    /**
     * Handles mouse move event - updates drag position
     */
    private handleMouseMove = (event: MouseEvent): void => {
        if (!this.isDragging) return;

        this.updatePlaceholder(event);
        this.updateDragVisuals(event);
    }

    /**
     * Updates placeholder position during drag
     */
    private updatePlaceholder(event: MouseEvent): void {
        const pos = this.view.posAtCoords({ x: event.clientX, y: event.clientY });

        if (pos !== null) {
            const line = this.view.state.doc.lineAt(pos);
            this.view.dispatch({
                effects: updateImagePlaceholder.of({ pos: line.to })
            });
        }
    }

    /**
     * Updates visual feedback during drag
     */
    private updateDragVisuals(event: MouseEvent): void {
        if (!this.currentDraggingImg) return;

        const deltaX = event.clientX - this.dragStartX;
        const deltaY = event.clientY - this.dragStartY;
        this.currentDraggingImg.style.transform = `scale(0.8) translate(${deltaX}px, ${deltaY}px)`;
        this.currentDraggingImg.style.opacity = '0.7';
    }

    /**
     * Handles mouse up event - completes drag or selection
     */
    private handleMouseUp = (event: MouseEvent): void => {
        this.clearClickTimeout();

        if (!this.isDragging && this.isMouseDownOnImage) {
            this.selectImage();
        } else if (this.isDragging) {
            this.completeDrag(event);
        }

        this.isMouseDownOnImage = false;
    }

    /**
     * Clears the click timeout
     */
    private clearClickTimeout(): void {
        if (this.clickTimeout) {
            clearTimeout(this.clickTimeout);
            this.clickTimeout = null;
        }
    }

    /**
     * Selects the image in the editor
     */
    private selectImage(): void {
        this.view.dispatch({
            selection: EditorSelection.single(this.from, this.to),
            scrollIntoView: true
        });
    }

    /**
     * Completes the drag operation
     */
    private completeDrag(event: MouseEvent): void {
        this.isDragging = false;
        document.body.style.cursor = 'default';

        const pos = this.view.posAtCoords({ x: event.clientX, y: event.clientY });
        if (pos !== null) {
            this.moveTo(pos);
        }

        this.view.dispatch({
            effects: updateImagePlaceholder.of(null)
        });

        this.resetDragVisuals();
    }

    /**
     * Resets drag visual feedback
     */
    private resetDragVisuals(): void {
        if (this.currentDraggingImg) {
            this.currentDraggingImg.style.transform = '';
            this.currentDraggingImg.style.opacity = '1';
            this.currentDraggingImg = null;
        }
    }

    /**
     * Moves image to a new position
     */
    private moveTo(pos: number): void {
        const doc = this.view.state.doc;
        const line = doc.lineAt(pos);
        let from = line.to;
        let insert = `\n![${this.alt}](${this.src})`;

        if (line.length === 0) {
            from = line.from;
            insert = insert.slice(1);
        }

        this.view.dispatch({
            changes: [
                { from: this.from, to: this.to, insert: '' },
                { from, insert }
            ]
        });
    }

    /**
     * Updates the position of the image
     */
    updatePosition(from: number, to: number): void {
        this.from = from;
        this.to = to;
    }

    /**
     * Determines if events should be ignored
     */
    ignoreEvent(): boolean {
        return false;
    }

    /**
     * Checks equality with another ImageWidget
     */
    eq(other: ImageWidget): boolean {
        return (
            other.alt === this.alt &&
            other.src === this.src &&
            other.from === this.from &&
            other.to === this.to
        );
    }

    /**
     * Cleans up event listeners
     */
    destroy(): void {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    }
}

// src/moondown/extensions/markdown-syntax-hiding/widgets.ts
import { EditorView, WidgetType } from "@codemirror/view";
import { EditorSelection } from "@codemirror/state";

/**
 * Base class for inline style widgets with click-to-select behavior
 */
abstract class SelectableInlineWidget extends WidgetType {
    constructor(
        protected content: string,
        protected fullText: string,
        protected start: number,
        protected className: string
    ) {
        super();
    }

    toDOM(view: EditorView): HTMLElement {
        const span = document.createElement("span");
        span.className = this.className;
        span.textContent = this.content;

        span.addEventListener('mousedown', (event) => {
            event.preventDefault();
            const end = this.start + this.fullText.length;
            view.dispatch({
                selection: EditorSelection.single(this.start, end)
            });
        });

        return span;
    }

    eq(other: SelectableInlineWidget): boolean {
        return (
            other.content === this.content &&
            other.fullText === this.fullText &&
            other.start === this.start &&
            other.className === this.className
        );
    }

    ignoreEvent(event: Event): boolean {
        return event.type === 'mousedown';
    }
}

/**
 * Widget for inline code
 */
export class InlineCodeWidget extends SelectableInlineWidget {
    constructor(content: string, fullText: string, start: number) {
        super(content, fullText, start, "cm-inline-code-widget");
    }
}

/**
 * Widget for strikethrough text
 */
export class StrikethroughWidget extends SelectableInlineWidget {
    constructor(content: string, fullText: string, start: number) {
        super(content, fullText, start, "cm-strikethrough-widget");
    }
}

/**
 * Widget for highlighted text
 */
export class HighlightWidget extends SelectableInlineWidget {
    constructor(content: string, fullText: string, start: number) {
        super(content, fullText, start, "cm-highlight-widget");
    }
}

/**
 * Widget for underlined text
 */
export class UnderlineWidget extends SelectableInlineWidget {
    constructor(content: string, fullText: string, start: number) {
        super(content, fullText, start, "cm-underline-widget");
    }
}

// src/moondown/extensions/markdown-syntax-hiding/markdown-syntax-hiding-field.ts
import { StateField, EditorState, StateEffect } from '@codemirror/state';
import { EditorView, Decoration, type DecorationSet } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';
import {
    type DecorationItem,
    type HandlerContext,
    handleFencedCode,
    handleBlockquote,
    handleHorizontalRule,
    handleListItem,
    handleEmphasis,
    handleInlineCode,
    handleHeading,
    handleLink,
    handleStrikethrough,
    handleMark,
    handleUnderline,
    handleImage
} from "./node-handlers";

/**
 * Effect to toggle the syntax hiding feature
 */
export const toggleSyntaxHidingEffect = StateEffect.define<boolean>();

/**
 * StateField to hold the current state of the syntax hiding feature
 */
export const syntaxHidingState = StateField.define<boolean>({
    create: () => true,
    update(value, tr) {
        for (const e of tr.effects) {
            if (e.is(toggleSyntaxHidingEffect)) {
                return e.value;
            }
        }
        return value;
    },
});

/**
 * Node type handler mapping
 */
type NodeHandler = (ctx: HandlerContext, node?: any) => DecorationItem[];

const NODE_HANDLERS: Record<string, NodeHandler> = {
    'FencedCode': handleFencedCode,
    'Blockquote': handleBlockquote,
    'HorizontalRule': handleHorizontalRule,
    'ListItem': handleListItem,
    'Emphasis': (ctx) => handleEmphasis(ctx, false),
    'StrongEmphasis': (ctx) => handleEmphasis(ctx, true),
    'InlineCode': handleInlineCode,
    'Link': handleLink,
    'Strikethrough': handleStrikethrough,
    'Mark': handleMark,
    'Underline': handleUnderline,
    'Image': handleImage,
};

/**
 * Handles ATX heading nodes (ATXHeading1-6)
 */
function handleATXHeading(ctx: HandlerContext, nodeName: string): DecorationItem[] {
    const headerLevel = parseInt(nodeName.slice(-1));
    return handleHeading(ctx, headerLevel);
}

/**
 * Main state field for markdown syntax hiding
 */
export const markdownSyntaxHidingField = StateField.define<DecorationSet>({
    create(_: EditorState) {
        return Decoration.none;
    },
    
    update(_oldDecorations, transaction) {
        const decorations: DecorationItem[] = [];
        const { state } = transaction;
        const selection = state.selection.main;
        const isHidingEnabled = state.field(syntaxHidingState);

        syntaxTree(state).iterate({
            enter: (node) => {
                const start = node.from;
                const end = node.to;
                const isSelected = selection.from <= end && selection.to >= start;
                
                const ctx: HandlerContext = {
                    state,
                    selection,
                    isHidingEnabled,
                    isSelected,
                    start,
                    end
                };

                // Handle ATX headings
                if (node.type.name.startsWith('ATXHeading')) {
                    decorations.push(...handleATXHeading(ctx, node.type.name));
                    return;
                }

                // Handle other node types
                const handler = NODE_HANDLERS[node.type.name];
                if (handler) {
                    decorations.push(...handler(ctx, node));
                }
            },
        });

        // Sort decorations by position
        decorations.sort((a, b) => {
            if (a.from !== b.from) return a.from - b.from;
            const aStartSide = a.decoration.spec.startSide || 0;
            const bStartSide = b.decoration.spec.startSide || 0;
            return aStartSide - bStartSide;
        });

        return Decoration.set(
            decorations.map(({ from, to, decoration }) => decoration.range(from, to))
        );
    },
    
    provide: (f) => EditorView.decorations.from(f),
});


// src/moondown/extensions/markdown-syntax-hiding/index.ts
import {markdownSyntaxHidingField, syntaxHidingState} from './markdown-syntax-hiding-field';

export function markdownSyntaxHiding() {
    return [
        syntaxHidingState,
        markdownSyntaxHidingField
    ];
}

// src/moondown/extensions/markdown-syntax-hiding/link-widget.ts
import { EditorView, WidgetType } from "@codemirror/view";
import { EditorSelection } from "@codemirror/state";

export class LinkWidget extends WidgetType {
    constructor(private displayText: string, private fullLink: string, private start: number) {
        super();
    }

    toDOM(view: EditorView): HTMLElement {
        const span = document.createElement("span");
        span.className = "cm-link-widget";
        span.textContent = this.displayText;

        span.addEventListener('mousedown', (event) => {
            event.preventDefault();
            const end = this.start + this.fullLink.length;
            view.dispatch({
                selection: EditorSelection.single(this.start, end)
            });
        });

        return span;
    }

    eq(other: LinkWidget) {
        return other.displayText === this.displayText && other.fullLink === this.fullLink && other.start === this.start;
    }

    ignoreEvent(event: Event): boolean {
        return event.type === 'mousedown';
    }
}

// src/moondown/extensions/markdown-syntax-hiding/node-handlers.ts
import { EditorState, type SelectionRange } from '@codemirror/state';
import { Decoration } from '@codemirror/view';
import { LinkWidget } from "./link-widget";
import { InlineCodeWidget, StrikethroughWidget, HighlightWidget, UnderlineWidget } from "./widgets";
import { CSS_CLASSES } from "../../core";

/**
 * Decoration types
 */
const hiddenMarkdown = Decoration.mark({ class: CSS_CLASSES.HIDDEN_MARKDOWN });
const visibleMarkdown = Decoration.mark({ class: CSS_CLASSES.VISIBLE_MARKDOWN });
const orderedListMarker = Decoration.mark({ class: 'cm-ordered-list-marker' });

const blockquoteLine = Decoration.line({ class: 'cm-blockquote-line' });
const blockquoteLineSelected = Decoration.line({ class: 'cm-blockquote-line-selected' });
const hrLine = Decoration.line({ class: 'cm-hr-line' });
const hrLineSelected = Decoration.line({ class: 'cm-hr-line-selected' });

/**
 * Decoration item interface
 */
export interface DecorationItem {
    from: number;
    to: number;
    decoration: Decoration;
}

/**
 * Node handler context
 */
export interface HandlerContext {
    state: EditorState;
    selection: SelectionRange;
    isHidingEnabled: boolean;
    isSelected: boolean;
    start: number;
    end: number;
}

/**
 * Determines decoration type based on selection and hiding state
 */
function getDecorationType(isSelected: boolean, isHidingEnabled: boolean): Decoration {
    return (isSelected || !isHidingEnabled) ? visibleMarkdown : hiddenMarkdown;
}

/**
 * Handles FencedCode nodes
 */
export function handleFencedCode(ctx: HandlerContext): DecorationItem[] {
    const { state, isSelected, isHidingEnabled, start, end } = ctx;
    const decorations: DecorationItem[] = [];

    const fencedCodeStart = state.doc.lineAt(start);
    const fencedCodeEnd = state.doc.lineAt(end);
    const languageMatch = fencedCodeStart.text.match(/^```(\w+)?/);
    const language = languageMatch ? (languageMatch[1] || '') : '';
    const openingEnd = fencedCodeStart.from + 3 + language.length;

    const decorationType = (!isSelected && isHidingEnabled) ? hiddenMarkdown : visibleMarkdown;

    decorations.push(
        { from: fencedCodeStart.from, to: openingEnd, decoration: decorationType },
        { from: fencedCodeEnd.to - 3, to: fencedCodeEnd.to, decoration: decorationType }
    );

    return decorations;
}

/**
 * Handles Blockquote nodes
 */
export function handleBlockquote(ctx: HandlerContext): DecorationItem[] {
    const { state, isSelected, isHidingEnabled, start, end } = ctx;
    const decorations: DecorationItem[] = [];

    const blockquoteStart = state.doc.lineAt(start);
    const blockquoteEnd = state.doc.lineAt(end);

    // Add line decorations
    for (let lineNum = blockquoteStart.number; lineNum <= blockquoteEnd.number; lineNum++) {
        const line = state.doc.line(lineNum);
        decorations.push({
            from: line.from,
            to: line.from,
            decoration: isSelected ? blockquoteLineSelected : blockquoteLine
        });
    }

    // Handle > markers
    for (let pos = start; pos <= end;) {
        const line = state.doc.lineAt(pos);
        const match = line.text.match(/^(\s*>\s?)/);

        if (match) {
            const quoteCharPos = line.from + match[1].indexOf('>');
            const decorationType = getDecorationType(isSelected, isHidingEnabled);

            decorations.push({
                from: quoteCharPos,
                to: quoteCharPos + 1,
                decoration: decorationType
            });
        }

        pos = line.to + 1;
        if (pos > end) break;
    }

    return decorations;
}

/**
 * Handles HorizontalRule nodes
 */
export function handleHorizontalRule(ctx: HandlerContext): DecorationItem[] {
    const { state, isSelected, isHidingEnabled, start, end } = ctx;
    const line = state.doc.lineAt(start);

    if (isSelected || !isHidingEnabled) {
        return [
            { from: line.from, to: line.from, decoration: hrLineSelected },
            { from: start, to: end, decoration: visibleMarkdown }
        ];
    } else {
        return [
            { from: line.from, to: line.from, decoration: hrLine },
            { from: start, to: end, decoration: hiddenMarkdown }
        ];
    }
}

/**
 * Handles ListItem nodes
 */
export function handleListItem(ctx: HandlerContext, node: any): DecorationItem[] {
    const { state } = ctx;
    const listMarkNode = node.node.getChild('ListMark');

    if (listMarkNode) {
        const markText = state.doc.sliceString(listMarkNode.from, listMarkNode.to);

        if (/\d/.test(markText)) {
            return [{
                from: listMarkNode.from,
                to: listMarkNode.to,
                decoration: orderedListMarker
            }];
        }
    }

    return [];
}

/**
 * Handles Emphasis and StrongEmphasis nodes
 */
export function handleEmphasis(ctx: HandlerContext, isStrong: boolean): DecorationItem[] {
    const { isSelected, isHidingEnabled, start, end } = ctx;
    const decorationType = getDecorationType(isSelected, isHidingEnabled);
    const markerLength = isStrong ? 2 : 1;

    return [
        { from: start, to: start + markerLength, decoration: decorationType },
        { from: end - markerLength, to: end, decoration: decorationType }
    ];
}

/**
 * Handles InlineCode nodes
 */
export function handleInlineCode(ctx: HandlerContext): DecorationItem[] {
    const { state, isSelected, start, end } = ctx;

    if (!isSelected) {
        const inlineCodeContent = state.doc.sliceString(start, end);
        const content = inlineCodeContent.slice(1, -1);

        return [{
            from: start,
            to: end,
            decoration: Decoration.replace({
                widget: new InlineCodeWidget(content, inlineCodeContent, start),
                inclusive: true
            })
        }];
    } else {
        const decorationType = visibleMarkdown;
        return [
            { from: start, to: start + 1, decoration: decorationType },
            { from: end - 1, to: end, decoration: decorationType }
        ];
    }
}

/**
 * Handles ATXHeading nodes
 */
export function handleHeading(ctx: HandlerContext, headerLevel: number): DecorationItem[] {
    const { isSelected, isHidingEnabled, start } = ctx;
    const decorationType = getDecorationType(isSelected, isHidingEnabled);

    return [{
        from: start,
        to: start + headerLevel + 1,
        decoration: decorationType
    }];
}

/**
 * Handles Link nodes
 */
export function handleLink(ctx: HandlerContext): DecorationItem[] {
    const { state, isSelected, isHidingEnabled, start, end } = ctx;
    const linkText = state.doc.sliceString(start, end);
    const linkMatch = linkText.match(/\[([^\]]+)\]\(([^)]+)\)/);

    if (!linkMatch) return [];

    const decorationType = getDecorationType(isSelected, isHidingEnabled);
    const displayText = linkMatch[1] || linkMatch[2];

    if (!isSelected) {
        return [{
            from: start,
            to: end,
            decoration: Decoration.replace({
                widget: new LinkWidget(displayText, linkText, start),
                inclusive: true
            })
        }];
    } else {
        const linkStart = start + linkText.indexOf('[');
        const linkEnd = start + linkText.indexOf(']') + 1;
        const urlStart = start + linkText.indexOf('(');
        const urlEnd = start + linkText.indexOf(')') + 1;

        return [
            { from: linkStart, to: linkEnd, decoration: decorationType },
            { from: urlStart, to: urlEnd, decoration: decorationType }
        ];
    }
}

/**
 * Handles Strikethrough nodes
 */
export function handleStrikethrough(ctx: HandlerContext): DecorationItem[] {
    const { state, isSelected, start, end } = ctx;
    const fullText = state.doc.sliceString(start, end);

    // Validate that we have at least 4 characters (~~X~~)
    if (fullText.length < 4) return [];

    // Simply extract content between the markers
    const content = fullText.slice(2, -2);

    if (!isSelected) {
        return [{
            from: start,
            to: end,
            decoration: Decoration.replace({
                widget: new StrikethroughWidget(content, fullText, start),
                inclusive: true
            })
        }];
    } else {
        const decorationType = visibleMarkdown;
        return [
            { from: start, to: start + 2, decoration: decorationType },
            { from: end - 2, to: end, decoration: decorationType }
        ];
    }
}

/**
 * Handles Mark (highlight) nodes
 */
export function handleMark(ctx: HandlerContext): DecorationItem[] {
    const { state, isSelected, start, end } = ctx;
    const fullText = state.doc.sliceString(start, end);

    // Validate that we have at least 4 characters (==X==)
    if (fullText.length < 4) return [];

    // Simply extract content between the markers
    const content = fullText.slice(2, -2);

    if (!isSelected) {
        return [{
            from: start,
            to: end,
            decoration: Decoration.replace({
                widget: new HighlightWidget(content, fullText, start),
                inclusive: true
            })
        }];
    } else {
        const decorationType = visibleMarkdown;
        return [
            { from: start, to: start + 2, decoration: decorationType },
            { from: end - 2, to: end, decoration: decorationType }
        ];
    }
}

/**
 * Handles Underline nodes
 */
export function handleUnderline(ctx: HandlerContext): DecorationItem[] {
    const { state, isSelected, start, end } = ctx;
    const fullText = state.doc.sliceString(start, end);

    // Validate that we have at least 2 characters (~X~)
    if (fullText.length < 2) return [];

    // Simply extract content between the markers
    const content = fullText.slice(1, -1);

    if (!isSelected) {
        return [{
            from: start,
            to: end,
            decoration: Decoration.replace({
                widget: new UnderlineWidget(content, fullText, start),
                inclusive: true
            })
        }];
    } else {
        const decorationType = visibleMarkdown;
        return [
            { from: start, to: start + 1, decoration: decorationType },
            { from: end - 1, to: end, decoration: decorationType }
        ];
    }
}

/**
 * Handles Image nodes
 */
export function handleImage(ctx: HandlerContext): DecorationItem[] {
    const { state, isSelected, isHidingEnabled, start, end } = ctx;
    const imageText = state.doc.sliceString(start, end);
    const imageMatch = imageText.match(/!\[([^\]]*)\]\(([^)]+)\)/);

    if (!imageMatch) return [];

    const decorationType = getDecorationType(isSelected, isHidingEnabled);
    const alt = imageMatch[1];

    return [
        { from: start, to: start + 2, decoration: decorationType },
        { from: start + 2 + alt.length, to: end, decoration: decorationType }
    ];
}

// src/moondown/extensions/table/parse-children.ts
import type {SyntaxNode} from '@lezer/common'
import {type ASTNode, parseNode, type MDNode} from './table-ast.ts'
import {genericTextNode} from './generic-text-node.ts'
import {getWhitespaceBeforeNode} from "./table-functions.ts";

/**
 * This list contains all Node names that do not themselves have any content.
 * These are either purely formatting nodes (such as heading marks or link
 * marks) who can be reconstructed without the verbatim value, as well as larger
 * container nodes (whose contents is represented via their children).
 *
 * @var {string[]}
 */
const EMPTY_NODES = [
    'HeaderMark',
    'CodeMark',
    'EmphasisMark',
    'SuperscriptMark',
    'SubscriptMark',
    'QuoteMark',
    'ListMark',
    'YAMLFrontmatterStart',
    'YAMLFrontmatterEnd',
    'Document',
    'List',
    'ListItem',
    'PandocAttribute'
]

/**
 * Parses the children of ASTNodes who can have children.
 *
 * @param   {T}           astNode   The AST node that must support children
 * @param   {SyntaxNode}  node      The original Lezer SyntaxNode
 * @param   {string}      markdown  The Markdown source
 *
 * @return  {T}                     Returns the same astNode with children.
 */
export function parseChildren<T extends {
    children: ASTNode[]
} & MDNode>(astNode: T, node: SyntaxNode, markdown: string): T {
    if (node.firstChild === null) {
        if (!EMPTY_NODES.includes(node.name)) {
            const textNode = genericTextNode(node.from, node.to, markdown.substring(node.from, node.to), getWhitespaceBeforeNode(node, markdown))
            astNode.children = [textNode]
        }
        return astNode // We're done
    }

    astNode.children = []

    let currentChild: SyntaxNode | null = node.firstChild
    let currentIndex = node.from
    while (currentChild !== null) {
        // NOTE: We have to account for "gaps" where a node has children that do not
        // completely cover the node's contents. In that case, we have to add text
        // nodes that just contain those strings.
        if (currentChild.from > currentIndex && !EMPTY_NODES.includes(node.name)) {
            const gap = markdown.substring(currentIndex, currentChild.from)
            const onlyWhitespace = /^(\s*)/m.exec(gap)
            const whitespaceBefore = onlyWhitespace !== null ? onlyWhitespace[1] : ''
            const textNode = genericTextNode(
                currentIndex,
                currentChild.from,
                gap.substring(whitespaceBefore.length),
                whitespaceBefore
            )
            astNode.children.push(textNode)
        }
        astNode.children.push(parseNode(currentChild, markdown))
        currentIndex = currentChild.to // Must happen before the nextSibling assignment
        currentChild = currentChild.nextSibling
    }

    if (currentIndex < node.to && !EMPTY_NODES.includes(node.name)) {
        // One final text node
        const textNode = genericTextNode(currentIndex, node.to, markdown.substring(currentIndex, node.to))
        astNode.children.push(textNode)
    }

    return astNode
}

// src/moondown/extensions/table/parse-table-node.ts
import {type SyntaxNode} from '@lezer/common'
import type {Table, TableRow, TableCell} from './table-ast.ts'
import {genericTextNode} from './generic-text-node.ts'
import {getWhitespaceBeforeNode} from "./table-functions.ts";
import {parseChildren} from "./parse-children.ts";

/**
 * Parses a SyntaxNode of name "Table"
 *
 * @param   {SyntaxNode}  node      The node to parse
 * @param   {string}      markdown  The original Markdown source
 *
 * @return  {Table}                 The parsed Table AST node
 */
export function parseTableNode(node: SyntaxNode, markdown: string): Table {
    const astNode: Table = {
        type: 'Table',
        name: 'Table',
        from: node.from,
        to: node.to,
        whitespaceBefore: getWhitespaceBeforeNode(node, markdown),
        rows: []
    }

    const header = node.getChildren('TableHeader')
    const rows = node.getChildren('TableRow')

    // The parser cannot reliably extract the table delimiters, but we need
    // those for the column alignment. Thus, we need to see if we can find the
    // header row (pipe tables) or a delimiter row (grid tables) in order to
    // determine the column alignments.
    for (const line of markdown.substring(node.from, node.to).split('\n')) {
        if (!/^[|+:-]+$/.test(line)) {
            continue
        }

        // The plus indicates a special Pandoc-type of pipe table
        const splitter = line.includes('+') ? '+' : '|'
        astNode.alignment = line.split(splitter)
            // NOTE: |-|-| will result in ['', '-', '-', ''] -> filter out
            .filter(c => c.length > 0)
            .map(c => {
                if (c.startsWith('|')) {
                    c = c.substring(1)
                }
                if (c.endsWith('|')) {
                    c = c.substring(0, c.length - 1)
                }
                if (c.startsWith(':') && c.endsWith(':')) {
                    return 'center'
                } else if (c.endsWith(':')) {
                    return 'right'
                } else {
                    return 'left'
                }
            })
        break
    } // Else: Couldn't determine either column alignment nor table type

    // Now, transform the rows.
    for (const row of [...header, ...rows]) {
        const rowNode: TableRow = {
            type: 'TableRow',
            name: row.name,
            from: row.from,
            to: row.to,
            whitespaceBefore: '',
            isHeaderOrFooter: row.name === 'TableHeader',
            cells: []
        }

        let next = row.firstChild
        let lastDelimPos = -1 // Track the position of the last delimiter
        while (next !== null) {
            if (next.name === 'TableDelimiter') {
                if (lastDelimPos !== -1) {
                    // Create an empty cell for each delimiter we encounter after the first
                    const cellNode: TableCell = {
                        type: 'TableCell',
                        name: 'TableCell',
                        from: lastDelimPos,
                        to: next.from,
                        whitespaceBefore: '',
                        children: [
                            genericTextNode(lastDelimPos, next.from, markdown.slice(lastDelimPos, next.from))
                        ]
                    }
                    rowNode.cells.push(cellNode)
                }
                lastDelimPos = next.to
            } else if (next.name === 'TableCell') {
                // Reset lastDelimPos as we've encountered a non-empty cell
                lastDelimPos = -1
                const cellNode: TableCell = {
                    type: 'TableCell',
                    name: 'TableCell',
                    from: next.from,
                    to: next.to,
                    whitespaceBefore: '',
                    children: []
                }
                parseChildren(cellNode, next, markdown)
                rowNode.cells.push(cellNode)
            } else {
                console.warn(`Could not fully parse Table node: Unexpected node "${next.name}" in row.`)
            }
            next = next.nextSibling
        }

        // Handle case where the row ends with empty cells
        if (lastDelimPos !== -1 && row.to > lastDelimPos) {
            const cellNode: TableCell = {
                type: 'TableCell',
                name: 'TableCell',
                from: lastDelimPos,
                to: row.to,
                whitespaceBefore: '',
                children: [
                    genericTextNode(lastDelimPos, row.to, markdown.slice(lastDelimPos, row.to))
                ]
            }
            rowNode.cells.push(cellNode)
        }

        astNode.rows.push(rowNode)
    }
    return astNode
}

// src/moondown/extensions/table/select-in-element.ts
export function selectElementContents(node: Node, from: number = 0, to: number = 0): void {
    const sel = window.getSelection()
    // From MDN: Firefox may return null, other browsers may return a Selection
    // with type None
    if (sel === null || sel.type === 'None') {
        return
    }

    // From MDN: "If the startNode is a Node of type Text, Comment, or CDataSection,
    // then startOffset is the number of characters from the start of startNode. For
    // other Node types, startOffset is the number of child nodes between the start
    // of the startNode."
    // Therefore: Ensure that the node is a text node so that from and to actually
    // refer to characters, and not to nodes.
    if (node.nodeType !== Node.TEXT_NODE) {
        const maybeTextNode = [...node.childNodes].find(child => child.nodeType === Node.TEXT_NODE) as Text | undefined
        if (maybeTextNode !== undefined) {
            node = maybeTextNode
        }
    }

    // Normalize the requested caret positions
    const maxLength = node.textContent?.length ?? 0
    if (from > maxLength) {
        from = maxLength // Setting to maxLength puts the cursor AFTER the last char
    }

    if (to > maxLength) {
        to = maxLength
    }

    const range = document.createRange()
    range.setStart(node, from)
    range.setEnd(node, to)

    // Reset the selection
    sel.removeAllRanges()
    sel.addRange(range)
}

// src/moondown/extensions/table/render-tables.ts
import {WidgetType, EditorView, Decoration, type DecorationSet} from '@codemirror/view'
import { StateField, EditorState } from '@codemirror/state'
import { syntaxTree } from '@codemirror/language'
import type {SyntaxNode, SyntaxNodeRef} from "@lezer/common";
import { debounce } from 'lodash';
import {tablePositions, updateTablePosition} from "./table-position.ts";
import TableEditor from "./table-editor.ts";
import {parseNode} from "./table-functions.ts";
import {type TableEditorOptions} from "./types.ts";

class TableWidget extends WidgetType {
    constructor(readonly table: string, readonly node: SyntaxNode) {
        super();
    }

    eq(other: TableWidget): boolean {
        return (
            this.table === other.table &&
            this.node.from === other.node.from &&
            this.node.to === other.node.to
        );
    }

    toDOM(view: EditorView): HTMLElement {
        try {
            const table = fromSyntaxNode(this.node, view.state.sliceDoc(), {
                onBlur: debounce((instance: TableEditor) => {
                    this.saveContent(view, instance);
                }, 300),
                saveIntent: (instance: TableEditor) => {
                    this.saveContent(view, instance);
                },
                container: view.scrollDOM,
            });

            return table.domElement;
        } catch (err: any) {
            console.error('Error in TableWidget.toDOM:', err);
            return document.createElement('div');
        }
    }

    private saveContent(view: EditorView, instance: TableEditor) {
        const newContent = instance.getMarkdownTable();
        const positions = view.state.field(tablePositions);
        const currentPos = positions.get(this.node.from);

        if (currentPos) {
            view.dispatch({
                changes: {
                    from: currentPos.from,
                    to: currentPos.to,
                    insert: newContent,
                },
                effects: updateTablePosition.of({
                    id: this.node.from,
                    from: currentPos.from,
                    to: currentPos.from + newContent.length,
                }),
            });
        } else {
            view.dispatch({
                changes: {
                    from: this.node.from,
                    to: this.node.to,
                    insert: newContent,
                },
                effects: updateTablePosition.of({
                    id: this.node.from,
                    from: this.node.from,
                    to: this.node.from + newContent.length,
                }),
            });
        }

        instance.markClean();
    }

    ignoreEvent(_: Event): boolean {
        return true;
    }
}

/**
 * Instantiates a TableEditor based on a SyntaxNode
 *
 * @param   {SyntaxNode}          tableNode  The syntax node
 * @param   {string}              markdown   The Markdown source
 * @param   {TableEditorOptions}  hooks      TableEditor options
 *
 * @return  {TableEditor}                    The instance
 */
function fromSyntaxNode (tableNode: SyntaxNode, markdown: string, hooks: TableEditorOptions = {}): TableEditor {
    const parsed = parseNode(tableNode, markdown)
    if (parsed) {
        return new TableEditor(parsed.ast, parsed.colAlignments, hooks)
    } else {
        throw new Error('Could not parse table node')
    }
}

function shouldHandleNode (node: SyntaxNodeRef): boolean {
    return node.name === 'Table' || node.name === 'TableRow' || node.name === 'TableCell';
}

function createWidget (state: EditorState, node: SyntaxNodeRef): TableWidget|undefined {
    const table = state.sliceDoc(node.from, node.to)
    try {
        return new TableWidget(table, node.node)
    } catch (err: any) {
        console.error('Could not instantiate TableEditor widget: ' + err.message)
        return undefined
    }
}

function renderBlockWidgets (
    shouldHandleNode: (node: SyntaxNodeRef) => boolean,
    createWidget: (state: EditorState, node: SyntaxNodeRef) => WidgetType|undefined
): StateField<DecorationSet> {
    return StateField.define<DecorationSet>({
        create (state: EditorState) {
            return renderWidgets(state, [], shouldHandleNode, createWidget)
        },
        update (_, transaction) {
            return renderWidgets(transaction.state, [], shouldHandleNode, createWidget)
        },
        provide: f => EditorView.decorations.from(f)
    })
}

function renderWidgets (
    state: EditorState,
    visibleRanges: ReadonlyArray<{ from: number, to: number }>,
    shouldHandleNode: (node: SyntaxNodeRef) => boolean,
    createWidget: (state: EditorState, node: SyntaxNodeRef) => WidgetType|undefined
): DecorationSet {
    const widgets: any[] = []

    if (visibleRanges.length === 0) {
        visibleRanges = [{ from: 0, to: state.doc.length }]
    }

    for (const { from, to } of visibleRanges) {
        syntaxTree(state).iterate({
            from,
            to,
            enter: (node) => {
                if (!shouldHandleNode(node)) {
                    return
                }

                const renderedWidget = createWidget(state, node)
                if (renderedWidget === undefined) {
                    return
                }
                const widget = Decoration.replace({
                    widget: renderedWidget,
                    inclusive: false
                })

                widgets.push(widget.range(node.from, node.to))
            }
        })
    }

    return Decoration.set(widgets)
}

export const renderTables = renderBlockWidgets(shouldHandleNode, createWidget)

// src/moondown/extensions/table/build-pipe.ts
import calculateColSizes from './calculate-col-sizes.ts'
import type { ColAlignment } from './types.ts'

export default function buildPipeTable (ast: string[][], colAlignment: ColAlignment[]): string {
    if (ast.length < 2) {
        throw new Error('Cannot build pipe table: Must have at least two rows.')
    }

    // First, calculate the column sizes
    const colSizes = calculateColSizes(ast)

    // Then, build the table in a quick MapReduce fashion
    const rows = ast.map(row => {
        const rowContents = row.map((col, idx) => {
            if (colAlignment[idx] === 'right') {
                return col.padStart(colSizes[idx], ' ')
            } else {
                return col.padEnd(colSizes[idx], ' ')
            }
        }).join(' | ')
        return `| ${rowContents} |`
    })

    // Finally, insert the required header row at index 2
    const headerRowContents = colSizes.map((size, idx) => {
        if (colAlignment[idx] === 'left') {
            return '-'.repeat(size + 2)
        } else if (colAlignment[idx] === 'center') {
            return ':' + '-'.repeat(size) + ':'
        } else {
            return '-'.repeat(size + 1) + ':'
        }
    }).join('|')

    const headerRow = `|${headerRowContents}|`
    rows.splice(1, 0, headerRow)

    return rows.join('\n')
}

// src/moondown/extensions/table/generic-text-node.ts
import { type TextNode } from './table-ast.ts'

/**
 * Creates a generic text node; this is used to represent textual contents of
 * SyntaxNodes.
 *
 * @param   {number}    from              The absolute start offset
 * @param   {number}    to                The absolute end offset
 * @param   {string}    value             The actual text
 * @param   {string}    whitespaceBefore  Potential whitespace before the node
 *
 * @return  {TextNode}                    The rendered TextNode
 */
export function genericTextNode (from: number, to: number, value: string, whitespaceBefore = ''): TextNode {
    return { type: 'Text', name: 'text', from, to, value, whitespaceBefore }
}

// src/moondown/extensions/table/table-editor.ts
import buildPipeTable from './build-pipe.ts'
import computeCSS from './compute-css.ts'
import type {ColAlignment, TableEditorOptions} from './types.ts'
import {md2html} from './markdown-to-html.ts'
import {selectElementContents} from "./select-in-element.ts";
import { TABLE_SIZING, TABLE_CSS_CLASSES, TABLE_SYMBOLS } from './constants';
import tippy, {type Instance as TippyInstance } from 'tippy.js';
import {
    createIcons,
    ArrowLeftToLine,
    ArrowRightToLine,
    ArrowUpToLine,
    ArrowDownToLine,
    Trash2,
    AlignCenter,
    AlignLeft,
    AlignRight
} from 'lucide';

export default class TableEditor {
    /**
     * Holds the current number of rows within the table
     *
     * @var {number}
     */
    private _rows: number

    /**
     * Holds the current number of columns within the table
     *
     * @var {number}
     */
    private _cols: number

    /**
     * Holds the current column-index
     *
     * @var {number}
     */
    private _cellIndex: number

    /**
     * Holds the current row-index
     *
     * @var {number}
     */
    private _rowIndex: number

    /**
     * The options passed to the instance
     *
     * @var {TableEditorOptions}
     */
    private readonly _options: TableEditorOptions

    /**
     * If true, any events on the table editor are not handled
     *
     * @var {boolean}
     */
    private _eventLock: boolean

    /**
     * The container element for the editor
     *
     * @var {HTMLElement}
     */
    private readonly _containerElement: HTMLElement

    /**
     * The DOM element representing the editor
     *
     * @var {HTMLTableElement}
     */
    private readonly _elem: HTMLTableElement

    /**
     * The actual table contents
     *
     * @var {string[][]}
     */
    private readonly _ast: string[][]

    /**
     * Holds the current alignment per each column
     *
     * @var {ColAlignment[]}
     */
    private _colAlignment: ColAlignment[]

    /**
     * Holds the size of the edge buttons
     *
     * @var {number}
     */
    private readonly _edgeButtonSize: number

    /**
     * Remembers the clean/modified status of the table
     *
     * @var {boolean}
     */
    private _isClean: boolean

    /**
     * This variable is used internally to detect whether the table has
     * effectively changed since the last time to track the clean status
     *
     * @var {string}
     */
    private _lastSeenTable: string

    /**
     * The following variables are the various buttons
     */
    private readonly _addTopButton: HTMLDivElement
    private readonly _addLeftButton: HTMLDivElement

    private _lastMousemoveEvent: MouseEvent | undefined

    private _tippyInstance: TippyInstance | null = null;

    /**
     * Creates a new TableHelper.
     *
     * @param {string[][]}         ast          The table AST
     * @param {ColAlignment[]}     alignments   The column alignments
     * @param {TableEditorOptions} [options={}] An object with optional callbacks for onBlur and onChange.
     */
    constructor(ast: string[][], alignments: ColAlignment[], options: TableEditorOptions = {}) {
        // First, copy over simple properties
        this._rows = ast.length
        this._cols = ast[0].length
        this._cellIndex = 0
        this._rowIndex = 0
        this._options = options
        this._eventLock = false // See _rebuildDOMElement for details
        this._ast = ast
        this._lastSeenTable = JSON.stringify(this._ast)
        this._colAlignment = alignments
        this._edgeButtonSize = TABLE_SIZING.EDGE_BUTTON_SIZE
        this._isClean = true

        // Find the container element
        if ('container' in options && options.container instanceof HTMLElement) {
            this._containerElement = options.container
        } else if ('container' in options && typeof options.container === 'string') {
            const target = document.querySelector(options.container)
            if (target === null) {
                throw new Error(`Could not find element using selector ${options.container}`)
            }
            this._containerElement = target as HTMLElement
        } else {
            this._containerElement = document.body
        }

        const template = document.createElement('div')
        template.classList.add(TABLE_CSS_CLASSES.OPERATE_BUTTON)

        this._addTopButton = template.cloneNode(true) as HTMLDivElement
        this._addTopButton.classList.add(TABLE_CSS_CLASSES.TOP_BUTTON)
        this._addTopButton.innerHTML = TABLE_SYMBOLS.HORIZONTAL_ELLIPSIS;
        this._addLeftButton = template.cloneNode(true) as HTMLDivElement
        this._addLeftButton.classList.add(TABLE_CSS_CLASSES.LEFT_BUTTON)
        this._addLeftButton.innerHTML = TABLE_SYMBOLS.VERTICAL_ELLIPSIS;

        // Create the Table element
        const table = document.createElement('table')
        table.classList.add(TABLE_CSS_CLASSES.HELPER)
        this._elem = table

        // Populate the inner contents initially
        this._rebuildDOMElement()

        // Whenever the user moves the mouse over the container, maybe show the edge
        // buttons ...
        this._containerElement.addEventListener('mouseover', (e) => {
            this._moveHelper(e)
            this._lastMousemoveEvent = e
        })

        this._containerElement.addEventListener('mousedown', (e) => {
            this._clickHelper(e)
            this._lastMousemoveEvent = e
        })

        this._containerElement.addEventListener('mouseover', (e) => {
            if (this._lastMousemoveEvent !== e) {
                this._hideAllButtons()
            }
        })

        // Activate the edge button's functionality. We need to prevent the default
        // on the mousedowns, otherwise the table cell will lose focus, thereby
        // triggering the blur event on the table.
        this._addTopButton.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this._showColumnActions();
        });
        this._addLeftButton.addEventListener('mousedown', (e) => {
            e.preventDefault()
            this._showRowActions()
        })

        // Inject the CSS necessary to style the table and buttons.
        this._injectCSS()
    } // END CONSTRUCTOR

    private _showRowActions(): void {
        if (this._tippyInstance) {
            this._tippyInstance.destroy();
        }

        const content = this._createRowActionsTippyContent();

        this._tippyInstance = tippy(this._addLeftButton, {
            content: content,
            interactive: true,
            theme: 'custom',
            placement: 'right',
            trigger: 'manual',
            arrow: true,
        });

        this._tippyInstance.show();
    }

    private _createRowActionsTippyContent(): HTMLElement {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '5px';
        container.style.padding = '5px';

        const actions = [
            { icon: 'arrow-up-to-line', title: '在上方插入一列', action: () => this.prependRow() },
            { icon: 'arrow-down-to-line', title: '在下方插入一列', action: () => this.appendRow() },
            { icon: 'trash-2', title: '删除本列', action: () => this.pluckRow() },
        ];

        actions.forEach(({ icon, title, action }) => {
            const button = document.createElement('button');
            button.innerHTML = `<i data-lucide="${icon}"></i>`;
            button.title = title;
            button.className = 'tippy-button';
            button.addEventListener('click', () => {
                action();
                this._tippyInstance?.hide();
                this._options.saveIntent?.(this)
            });
            container.appendChild(button);
        });

        setTimeout(() => createIcons({
            icons: {ArrowUpToLine, ArrowDownToLine, Trash2},
            attrs: {
                width: '16',
                height: '16'
            }
        }), 0);

        return container;
    }

    private _showColumnActions(): void {
        if (this._tippyInstance) {
            this._tippyInstance.destroy();
        }

        const content = this._createColumnActionsTippyContent();

        this._tippyInstance = tippy(this._addTopButton, {
            content: content,
            interactive: true,
            theme: 'custom',
            placement: 'bottom',
            trigger: 'manual',
            arrow: true,
        });

        this._tippyInstance.show();
    }

    private _createColumnActionsTippyContent(): HTMLElement {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '5px';
        container.style.padding = '5px';

        const actions = [
            {
                icon: 'arrow-left-to-line',
                title: '在左侧插入一列',
                action: () => {
                    this.prependCol();
                    this._tippyInstance?.hide();
                    this._options.saveIntent?.(this)
                }
            },
            {
                icon: 'arrow-right-to-line',
                title: '在右侧插入一列',
                action: () => {
                    this.appendCol();
                    this._tippyInstance?.hide();
                    this._options.saveIntent?.(this)
                }
            },
            {
                icon: 'trash-2',
                title: '删除本列',
                action: () => {
                    this.pluckCol();
                    this._tippyInstance?.hide();
                    this._options.saveIntent?.(this)
                }
            },
            {
                icon: 'align-center',
                title: '对齐方式',
                action: (event: MouseEvent) => this._showAlignmentOptions(event.currentTarget as HTMLElement) },
        ];

        actions.forEach(({ icon, title, action }) => {
            const button = document.createElement('button');
            button.innerHTML = `<i data-lucide="${icon}"></i>`;
            button.title = title;
            button.className = 'tippy-button';
            button.addEventListener('click', action);
            container.appendChild(button);
        });

        setTimeout(() => createIcons({
            icons: {ArrowLeftToLine, ArrowRightToLine, Trash2, AlignCenter},
            attrs: {
                width: '16',
                height: '16'
            }
        }), 0);

        return container;
    }

    private _showAlignmentOptions(target: HTMLElement): void {
        const alignmentOptions = document.createElement('div');
        alignmentOptions.className = 'alignment-options';
        const alignments = [
            {
                icon: 'align-left',
                title: '左对齐',
                action: () => {
                    this.changeColAlignment('left');
                }
            },
            {
                icon: 'align-center',
                title: '居中对齐',
                action: () => {
                    this.changeColAlignment('center');
                }
            },
            {
                icon: 'align-right',
                title: '右对齐',
                action: () => {
                    this.changeColAlignment('right');
                }
            }
        ]

        alignments.forEach(align => {
            const alignButton = document.createElement('button');
            alignButton.className = 'tippy-button';
            alignButton.title = align.title;
            alignButton.innerHTML = `<i data-lucide="${align.icon}"></i>`;
            alignButton.addEventListener('click', () => {
                align.action();
                this._tippyInstance?.hide();
                this._options.saveIntent?.(this)
            });
            alignmentOptions.appendChild(alignButton);
        });

        const instance = tippy(target, {
            content: alignmentOptions,
            interactive: true,
            theme: 'custom',
            placement: 'bottom',
            trigger: 'manual',
            arrow: true,
        });

        instance.show();

        setTimeout(() => createIcons({
            icons: {AlignLeft, AlignCenter, AlignRight},
            attrs: {
                width: '16',
                height: '16'
            }
        }), 0);
    }

    /**
     * Shows or hides the table buttons depending on the mouse position
     *
     * @param   {MouseEvent}  evt  The event
     */
    _moveHelper(evt: MouseEvent): void {
        const rect = this._elem.getBoundingClientRect()
        const minX = rect.left - this._edgeButtonSize
        const minY = rect.top - this._edgeButtonSize
        const maxX = minX + rect.width + this._edgeButtonSize * 2
        const maxY = minY + rect.height + this._edgeButtonSize * 2

        if (
            evt.clientX >= minX &&
            evt.clientX <= maxX &&
            evt.clientY >= minY &&
            evt.clientY <= maxY
        ) {
            // Always recalculate the positions to make sure
            // their position is always updated asap.
            this._recalculateEdgeButtonPositions()
        } else {
            this._hideAllButtons()
        }
    }

    _clickHelper(evt: MouseEvent): void {
        const rect = this._elem.getBoundingClientRect()
        const minX = rect.left - this._edgeButtonSize
        const minY = rect.top - this._edgeButtonSize
        const maxX = minX + rect.width + this._edgeButtonSize * 2
        const maxY = minY + rect.height + this._edgeButtonSize * 2

        if (
            evt.clientX >= minX &&
            evt.clientX <= maxX &&
            evt.clientY >= minY &&
            evt.clientY <= maxY
        ) {
            this._showEdgeButtons()
            this._recalculateEdgeButtonPositions()
        } else {
            this._hideAllButtons()
        }
    }

    /**
     * Rebuilds the inner contents of the Table element
     */
    _rebuildDOMElement(): void {
        this._eventLock = true
        // Removing any innerHTML will trigger events on the cells, namely
        // blur events. If we change the table (adding/removing cols/rows)
        // we are rebuilding the internal DOM. However, having blur trigger
        // during this would modify the internal AST, which we do not want.
        this._elem.innerHTML = '' // Reset
        this._eventLock = false

        const tbody = this._elem.createTBody()

        for (let i = 0; i < this._ast.length; i++) {
            const row = tbody.insertRow(-1)
            row.style.width = '100%'

            for (let j = 0; j < this._ast[i].length; j++) {
                const cell = row.insertCell(-1)
                cell.innerHTML = md2html(this._ast[i][j])
                cell.style.textAlign = this._colAlignment[j]
                cell.setAttribute('contenteditable', 'true')
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                cell.addEventListener('focus', (_) => {
                    this._onCellFocus(cell)
                })
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                cell.addEventListener('blur', (_) => {
                    this._onCellBlur(cell)
                })
            }
        }

        this.selectCell('start')
    }

    /**
     * Handles blur events on cells
     *
     * @param   {DOMElement}  cell  The cell on which the event was triggered
     */
    _onCellBlur(cell: HTMLTableCellElement): void {
        if (this._eventLock) {
            return // Ignore events
        }

        const col = cell.cellIndex
        const row = (cell.parentElement as HTMLTableRowElement).rowIndex

        // Re-render the table element and save the textContent as data-source
        this._ast[row][col] = cell.textContent ?? ''
        cell.innerHTML = md2html(this._ast[row][col])
        // For a short amount of time, the table won't have any focused
        // elements, so we'll set a small timeout, after which we test
        // if any element inside the table has in the meantime received
        // focus.
        setTimeout(() => {
            if (this._elem.querySelectorAll(':focus').length === 0) {
                // If we are here, the full table has lost focus.
                // It's a good idea to update any content now!
                if (this._options.onBlur !== undefined) {
                    this._options.onBlur(this)
                }
            }
        }, 10)
    }

    /**
     * Handles a focus event on table cells
     *
     * @param   {DOMElement}  cell  The cell on which the event has triggered
     */
    _onCellFocus(cell: HTMLTableCellElement): void {
        if (this._eventLock) {
            return // Ignore events
        }

        // As soon as any cell is focused, recalculate
        // the current cell and table dimensions.
        const col = cell.cellIndex
        const row = (cell.parentElement as HTMLTableRowElement).rowIndex
        // Before the cell is focused, replace the contents with the source for
        // easy editing, thereby removing any pre-rendered HTML
        cell.innerHTML = this._ast[row][col]

        this._rowIndex = row
        this._cellIndex = col

        this._recalculateEdgeButtonPositions()
    }

    /**
     * Recalculates the correct positions of all edge buttons.
     */
    _recalculateEdgeButtonPositions(): void {
        const spacing = 5; // Spacing in pixels
        const currentCell = this._elem.rows[this._rowIndex]?.cells[this._cellIndex];

        // Exit if the current cell doesn't exist (e.g., table is being rebuilt)
        if (!currentCell) {
            this._hideAllButtons();
            return;
        }

        const currentRow = this._elem.rows[this._rowIndex];
        const currentColumn = Array.from(this._elem.rows).map(row => row.cells[this._cellIndex]);

        const cellRect = currentCell.getBoundingClientRect();
        const rowRect = currentRow.getBoundingClientRect();

        // Calculate the top of the column by finding the min top of all cells in that column
        const columnTop = Math.min(...currentColumn.map(cell => cell.getBoundingClientRect().top));

        const containerRect = this._containerElement.getBoundingClientRect();

        // Use page scroll offsets to convert viewport-relative coords to absolute coords
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

        // Check if the cell is visible on the screen to avoid calculating for off-screen elements
        const cellIsOnScreen = cellRect.top > containerRect.top && cellRect.bottom < containerRect.bottom;

        if (cellIsOnScreen) {
            // Calculate and set the top button's position
            const topButtonTop = scrollTop + columnTop - this._edgeButtonSize * 0.6 - spacing;
            const topButtonLeft = scrollLeft + cellRect.left + cellRect.width / 2 - (this._edgeButtonSize * 1.2 / 2);
            this._addTopButton.style.top = `${topButtonTop}px`;
            this._addTopButton.style.left = `${topButtonLeft}px`;

            // Calculate and set the left button's position
            const leftButtonTop = scrollTop + rowRect.top + rowRect.height / 2 - (this._edgeButtonSize * 1.2 / 2);
            const leftButtonLeft = scrollLeft + rowRect.left - this._edgeButtonSize * 0.6 - spacing;
            this._addLeftButton.style.top = `${leftButtonTop}px`;
            this._addLeftButton.style.left = `${leftButtonLeft}px`;
        } else {
            // Hide buttons if the cell is not on screen
            this._addTopButton.style.top = '-1000px';
            this._addLeftButton.style.top = '-1000px';
        }
    }


    /**
     * Displays the edge buttons for adding rows, columns, alignment and removal.
     */
    _showEdgeButtons(): void {
        if (this._edgeButtonsVisible) {
            return
        }

        // Attach all buttons to the DOM
        document.body.appendChild(this._addTopButton)
        document.body.appendChild(this._addLeftButton)

        this._recalculateEdgeButtonPositions()
    }

    /**
     * Removes the edge buttons from the DOM.
     */
    _hideAllButtons(): void {
        // Hide the edge detection buttons again
        this._addTopButton.parentElement?.removeChild(this._addTopButton)
        this._addLeftButton.parentElement?.removeChild(this._addLeftButton)
    }

    /**
     * Returns true if the edge buttons are visible (i.e. attached to the DOM)
     *
     * @return  {boolean} True if the buttons are currently within the DOM
     */
    get _edgeButtonsVisible(): boolean {
        return this._addTopButton.parentElement !== null &&
            this._addLeftButton.parentElement !== null
    }

    /**
     * Returns the DOM representation of the table
     */
    get domElement(): HTMLTableElement {
        return this._elem
    }

    /**
     * Rebuilds the Abstract Syntax Tree after something has changed. Optionally
     * notifies the callback, if given.
     * @return {void} Does not return.
     */
    _signalContentChange(): void {
        const currentTable = JSON.stringify(this._ast)

        if (currentTable === this._lastSeenTable && this._isClean) {
            // The table has not changed
            return
        }

        this._lastSeenTable = currentTable
        this._isClean = false

        // Now inform the caller that the table has changed with this object.
        if (this._options.onChange !== undefined) {
            this._options.onChange(this)
        }
    }

    /**
     * Returns the Markdown table representation of this table.
     *
     * @returns {string} The markdown table
     */
    getMarkdownTable(): string {
        // Determine which table to output, based on the _mdTableType
        return buildPipeTable(this._ast, this._colAlignment)
    }

    /**
     * Signals the table editor that the caller has now saved the table contents
     */
    markClean(): void {
        this._isClean = true
    }

    /**
     * Returns the clean status of the table editor.
     *
     * @return  {boolean} True if the table has not changed
     */
    // isClean(): boolean {
    //     return this._isClean
    // }

    /**
     * Moves the cursor to the previous column, switching rows if necessary.
     */
    previousCell(): void {
        // We're already in the first cell
        if (this._cellIndex === 0 && this._rowIndex === 0) return

        // Focuses the previous cell of the table
        this._cellIndex--

        if (this._cellIndex < 0) {
            // Move to previous row, last cell
            this._rowIndex--
            this._cellIndex = this._cols - 1 // Zero-based indexing
        }

        this.selectCell('end')
        this._options.onCellChange?.(this)
    }

    /**
     * Moves the cursor to the next cell, passing over rows, if necessary.
     * Can add new rows as you go.
     *
     * @param  {boolean}  automaticallyAddRows  Whether to add new rows.
     */
    nextCell(automaticallyAddRows: boolean = true): void {
        // Focuses the next cell of the table
        let newCellIndex = this._cellIndex + 1
        let newRowIndex = this._rowIndex

        if (newCellIndex === this._cols) {
            newRowIndex++
            newCellIndex = 0
        }

        if (newRowIndex === this._rows) {
            if (automaticallyAddRows) {
                this.appendRow()
            } else {
                return // We should not add new rows here
            }
        }

        // Set the correct indices
        this._cellIndex = newCellIndex
        this._rowIndex = newRowIndex
        this.selectCell('end')
        this._options.onCellChange?.(this)
    }

    /**
     * Moves the cursor to the same column, previous row.
     * @return {void} Does not return.
     */
    previousRow(): void {
        // Focuses the same cell in the previous row
        if (this._rowIndex === 0) {
            return // We're already in the first row
        }

        this._rowIndex--

        this.selectCell('end')
        this._options.onCellChange?.(this)
    }

    /**
     * Moves the cursor to the same column, next row. Can also add new
     * rows, if you wish so.
     *
     * @param  {boolean}  automaticallyAddRows  Whether or not to add new rows.
     */
    nextRow(automaticallyAddRows: boolean = true): void {
        // Focuses the same cell in the next row
        const newRowIndex = this._rowIndex + 1

        if (newRowIndex === this._rows) {
            if (automaticallyAddRows) {
                this.appendRow()
            } else {
                return // We should not add new rows here
            }
        }

        // Set the new index and select the cell
        this._rowIndex = newRowIndex
        this.selectCell('end')
        this._options.onCellChange?.(this)
    }

    /**
     * Prepends a column to the left of the currently active cell of the table.
     * @return {void} Does not return.
     */
    prependCol(): void {
        // Add a column to the left of the active cell -> add a TD child to all TRs
        for (let i = 0; i < this._ast.length; i++) {
            this._ast[i].splice(this._cellIndex, 0, '')
        }

        this._colAlignment.splice(this._cellIndex, 0, 'left')
        this._cols++
        this._rebuildDOMElement()

        this._signalContentChange() // Notify the caller
    }

    /**
     * Appends a column at the right side of the currently active cell of the table.
     * @return {void} Does not return.
     */
    appendCol(): void {
        // Add a column to the right of the table -> add a TD child to all TRs
        for (let i = 0; i < this._ast.length; i++) {
            this._ast[i].splice(this._cellIndex + 1, 0, '')
        }

        this._colAlignment.splice(this._cellIndex + 1, 0, 'left')
        this._cols++
        this._rebuildDOMElement()

        // Move into the next cell of the current row
        this.nextCell()
        this._signalContentChange() // Notify the caller
    }

    /**
     * Prepends a row to the top of the currently active cell of the table.
     * @return {void} Does not return.
     */
    prependRow(): void {
        // Prepend a whole row to the currently active cell
        const cells = []
        for (let i = 0; i < this._cols; i++) {
            cells.push('')
        }

        this._ast.splice(this._rowIndex, 0, cells)
        this._rows++
        this._rebuildDOMElement()

        this._signalContentChange() // Notify the caller
    }

    /**
     * Appends a row at the end of the table.
     * @return {void} Does not return.
     */
    appendRow(): void {
        // Append a whole row to the table
        const cells = []
        for (let i = 0; i < this._cols; i++) {
            cells.push('')
        }

        this._ast.splice(this._rowIndex + 1, 0, cells)
        this._rows++
        this._rebuildDOMElement()

        this.nextRow()
        this._recalculateEdgeButtonPositions()
        this._signalContentChange() // Notify the caller
    }

    /**
     * Removes the currently active row from the table.
     * @return {void} Does not return.
     */
    pluckRow(): void {
        // Do not remove the last row
        if (this._rows === 1) {
            return
        }

        // Removes the current row from the table
        const rowToRemove = this._rowIndex
        const firstRow = rowToRemove === 0

        if (firstRow) {
            this._rowIndex++
        } else {
            this._rowIndex--
        }
        this.selectCell('start')

        // Now pluck the row.
        this._ast.splice(rowToRemove, 1)
        this._rows--
        // Select "the" cell again (to move back to the original position)
        this._rebuildDOMElement()

        if (firstRow) {
            this._rowIndex = 0
            this.selectCell('start')
        }

        this._signalContentChange() // Notify the caller
        this._options.onCellChange?.(this)
    }

    /**
     * Removes the currently active column from the table.
     * @return {void} Does not return.
     */
    pluckCol(): void {
        // Do not remove the last column.
        if (this._cols === 1) {
            return
        }

        // Removes the current column from the table
        const colToRemove = this._cellIndex
        const firstCol = colToRemove === 0

        if (firstCol) {
            this._cellIndex = 1
        } else {
            this._cellIndex--
        }
        this.selectCell('start')

        // Now pluck the column.
        for (let i = 0; i < this._ast.length; i++) {
            this._ast[i].splice(colToRemove, 1)
        }

        this._colAlignment.splice(colToRemove, 1)
        this._cols--
        this._rebuildDOMElement()

        if (firstCol) {
            this._cellIndex = 0
            this.selectCell('start')
        }

        this._signalContentChange() // Notify the caller
        this._options.onCellChange?.(this)
    }

    /**
     * Changes the column alignment for the provided column
     *
     * @param {ColAlignment}  alignment  The new alignment: left, center, or right
     * @param {number}        col        The column index to change
     */
    changeColAlignment(alignment: ColAlignment, col: number = this._cellIndex): void {
        if (!['left', 'center', 'right'].includes(alignment)) {
            throw new Error('Wrong column alignment provided! ' + alignment)
        }

        if (col >= this._cols || col < 0) {
            throw new Error('Could not align column - Index out of bounds: ' + col.toString())
        }

        this._colAlignment[col] = alignment

        // Change the visual alignment
        for (let row = 0; row < this._rows; row++) {
            this._elem.rows[row].cells[col].style.textAlign = alignment
        }

        this._signalContentChange() // Recalculate everything
        this._options.onCellChange?.(this)
    }

    /**
     * Selects the current cell. The parameter controls where the cursor ends up.
     *
     * @param  {any}  where  If "start" or "end", puts a cursor there. Passing an
     *                       object with `from` and `to` properties allows to
     *                       select actual ranges.
     */
    selectCell(where: 'start' | 'end' | { from: number, to: number } = 'end'): void {
        if (!this.domElement.contains(document.activeElement)) {
            return // Only select any cell if focus is currently within the table
        }

        const currentCell = this._elem.rows[this._rowIndex].cells[this._cellIndex]
        currentCell.focus()
        const textLength = currentCell.textContent?.length ?? 0

        if (where === 'start') {
            selectElementContents(currentCell)
        } else if (where === 'end') {
            selectElementContents(currentCell, textLength, textLength)
        } else {
            selectElementContents(currentCell, where.from, where.to)
        }
        this._recalculateEdgeButtonPositions()
        setTimeout(() => currentCell.focus(), 10)
    }

    /**
     * Injects the necessary CSS into the DOM, making sure it comes before any other
     * CSS sources so you can override the styles, if you wish.
     * @return {void} Does not return.
     */
    _injectCSS(): void {
        if (document.getElementById('tableHelperCSS') !== null) {
            return // CSS already present
        }

        // Create the styles
        const styleElement = computeCSS(this._edgeButtonSize)
        document.head.prepend(styleElement)
    }
}

// src/moondown/extensions/table/types.ts
import type TableEditor from './table-editor.ts'

export type ColAlignment = 'center'|'left'|'right'

export interface ParsedTable {
    ast: string[][]
    colAlignments: ColAlignment[]
}

export interface TableEditorOptions {
    /**
     * Describes the container for the Table element (either an Element or a querySelector)
     */
    container?: HTMLElement|string

    /**
     * A callback that is fired whenever the TableEditor is unfocused
     *
     * @param   {TableEditor}  instance  The TableEditor instance
     */
    onBlur?: (instance: TableEditor) => void

    /**
     * A callback that is fired whenever the TableEditor's contents change
     *
     * @param   {TableEditor}  instance  The TableEditor instance
     */
    onChange?: (instance: TableEditor) => void

    /**
     * A callback that is fired whenever the user switches the cell of the table
     *
     * @param   {TableEditor}  instance     The TableEditor instance
     */
    onCellChange?: (instance: TableEditor) => void

    /**
     * When the user clicks on the save button, this callback is called to signal
     * that the user intended to save the table
     *
     * @param   {TableEditor}  instance  The TableEditor instance
     */
    saveIntent?: (instance: TableEditor) => void
}

// src/moondown/extensions/table/constants.ts

/**
 * Constants for table editor functionality
 */

/**
 * Table sizing constants
 */
export const TABLE_SIZING = {
  /** Default edge button size in pixels */
  EDGE_BUTTON_SIZE: 30,
  /** Minimum column width in pixels */
  MIN_COLUMN_WIDTH: 50,
  /** Default column width in pixels */
  DEFAULT_COLUMN_WIDTH: 150,
  /** Maximum column width in pixels */
  MAX_COLUMN_WIDTH: 800,
} as const;

/**
 * CSS class names for table elements
 */
export const TABLE_CSS_CLASSES = {
  /** Main table helper class */
  HELPER: 'table-helper',
  /** Operate button class */
  OPERATE_BUTTON: 'table-helper-operate-button',
  /** Top button class */
  TOP_BUTTON: 'top',
  /** Left button class */
  LEFT_BUTTON: 'left',
  /** Right button class */
  RIGHT_BUTTON: 'right',
  /** Bottom button class */
  BOTTOM_BUTTON: 'bottom',
  /** Active cell class */
  ACTIVE_CELL: 'active',
  /** Header row class */
  HEADER_ROW: 'header-row',
} as const;

/**
 * HTML entities and symbols
 */
export const TABLE_SYMBOLS = {
  /** Vertical ellipsis (⋮) */
  VERTICAL_ELLIPSIS: '&#8942;',
  /** Horizontal ellipsis (⋯) */
  HORIZONTAL_ELLIPSIS: '&#8943;',
} as const;

/**
 * Column alignment types
 */
export const COLUMN_ALIGNMENTS = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  NONE: 'none',
} as const;


// src/moondown/extensions/table/markdown-to-html.ts
import { markdownToAST } from './table-ast.ts'
import { type ASTNode, type GenericNode } from './table-ast.ts'

/**
 * Represents an HTML tag. This is a purposefully shallow representation
 */
interface HTMLTag {
    /**
     * The tag name for the resulting HTML tag
     */
    tagName: string
    /**
     * Self closing are, e.g., <hr>
     */
    selfClosing: boolean
    /**
     * A simple map of attributes (e.g., ['class', 'my-class'])
     */
    attributes: Array<[ string, string ]>
}

/**
 * This function looks at a GenericNode and returns information regarding the
 * tag that the node should result in.
 *
 * @param   {GenericNode}  node  The input node
 *
 * @return  {HTMLTag}            The HTML tag information
 */
function getTagInfo (node: GenericNode): HTMLTag {
    const ret: HTMLTag = {
        tagName: 'div',
        selfClosing: false,
        attributes: []
    }

    if (node.name === 'HorizontalRule') {
        ret.tagName = 'hr'
        ret.selfClosing = true
    } else if (node.name === 'Paragraph') {
        ret.tagName = 'p'
    } else if (node.name === 'FencedCode' || node.name === 'InlineCode') {
        ret.tagName = 'code'
    } else if (node.children.length === 1) {
        ret.tagName = 'span'
    }

    if ([ 'span', 'div', 'p' ].includes(ret.tagName)) {
        ret.attributes.push([ 'class', node.name ])
    }

    return ret
}

/**
 * Takes a Markdown AST node and turns it to an HTML string
 *
 * @param   {ASTNode}  node         The node
 * @param   {Function} getCitation  The callback for the citations
 * @param   {number}   indent       The indentation for this node
 *
 * @return  {string}                The HTML string
 */
function nodeToHTML (node: ASTNode|ASTNode[], indent: number = 0): string {
    // Convenience to convert a list of child nodes to HTML
    if (Array.isArray(node)) {
        const body: string[] = []
        for (const child of node) {
            body.push(nodeToHTML(child, indent))
        }
        return body.join('')
    } else if (node.type === 'Generic' && node.name === 'Document') {
        // This ensures there's no outer div class=Document
        return nodeToHTML(node.children, indent)
    } else if (node.type === 'Table') {
        const rows: string[] = []
        let maxCells = 0

        // 首先计算最大列数
        for (const row of node.rows) {
            maxCells = Math.max(maxCells, row.cells.length)
        }

        for (const row of node.rows) {
            const cells: string[] = []
            for (let i = 0; i < maxCells; i++) {
                if (i < row.cells.length) {
                    cells.push(nodeToHTML(row.cells[i].children, indent))
                } else {
                    cells.push('') // 为缺少的单元格添加空内容
                }
            }
            const tag = row.isHeaderOrFooter ? 'th' : 'td'
            const content = cells.map(c => `<${tag}>${c}</${tag}>`).join('\n')
            if (row.isHeaderOrFooter) {
                rows.push(`${row.whitespaceBefore}<thead>\n<tr>\n${content}\n</tr>\n</thead>`)
            } else {
                rows.push(`${row.whitespaceBefore}<tr>\n${content}\n</tr>`)
            }
        }
        return `${node.whitespaceBefore}<table>\n${rows.join('\n')}\n</table>`
    } else if (node.type === 'Text') {
        return node.whitespaceBefore + node.value // Plain text
    } else if (node.type === 'Generic') {
        // Generic nodes are differentiated by name. There are a few we can support,
        // but most we wrap in a div.
        const tagInfo = getTagInfo(node)

        if ([ 'div', 'span' ].includes(tagInfo.tagName) && node.children.length === 0) {
            return '' // Simplify the resulting HTML by removing empty elements
        }

        const attr = tagInfo.attributes.length > 0
            ? ' ' + tagInfo.attributes.map(a => `${a[0]}="${a[1]}"`).join(' ')
            : ''

        const open = `${node.whitespaceBefore}<${tagInfo.tagName}${attr}${tagInfo.selfClosing ? '/' : ''}>`
        const close = tagInfo.selfClosing ? '' : `</${tagInfo.tagName}>`
        const body = tagInfo.selfClosing ? '' : nodeToHTML(node.children)
        return `${open}${body}${close}`
    }

    return ''
}

/**
 * Takes Markdown source and turns it into a valid HTML fragment. The citeLibrary
 * will be used to resolve citations.
 *
 * @param   {string}    markdown       The Markdown source
 *
 * @return  {string}                   The resulting HTML
 */
export function md2html (markdown: string): string {
    const ast = markdownToAST(markdown)
    return nodeToHTML(ast)
}

// src/moondown/extensions/table/table-functions.ts
import {EditorState} from "@codemirror/state";
import {type SyntaxNode} from "@lezer/common";
import {parseNode as parse} from "./table-ast.ts";
import {type ParsedTable} from "./types.ts";

/**
 * Checks if any of the selections within the given EditorState has overlap with
 * the provided range.
 *
 * @param   {EditorState}  state      The state to draw selections from
 * @param   {number}       rangeFrom  The start position of the range
 * @param   {number}       rangeTo    The end position of the range
 *
 * @return  {boolean}                 True if any selection overlaps
 */
export function rangeInSelection (state: EditorState, rangeFrom: number, rangeTo: number): boolean {
    return state.selection.ranges
        .map(range => [ range.from, range.to ])
        .filter(([ from, to ]) => !(to <= rangeFrom || from >= rangeTo))
        .length > 0
}

/**
 * Parses a syntax node of type "Table" into an AST & column alignments ready
 * for a TableEditor instance.
 *
 * @param   {SyntaxNode}   tableNode  The table node
 * @param   {string}       markdown   The full Markdown source to read the
 *                                    contents from
 *
 * @return  {ParsedTable}             The parsed AST.
 */
export function parseNode (tableNode: SyntaxNode, markdown: string): ParsedTable | undefined {
    const ast = parse(tableNode, markdown)
    if (ast.type === 'Table') {
        const tableEditorAst = ast.rows.map(row => row.cells.map(cell => markdown.substring(cell.from, cell.to).trim()))

        if (tableEditorAst.length === 0) {
            throw new Error('Cannot instantiate TableEditor: Table had zero rows.')
        }

        return {
            ast: tableEditorAst,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            colAlignments: ast.alignment ?? tableEditorAst[0].map(_cell => 'left')
        }
    }
}

/**
 * Extracts any amount of whitespace (\t\s\n\r\f\v, etc.) that occurs before
 * this node.
 *
 * @param   {SyntaxNode}  node      The node to extract whitespace for
 * @param   {string}      markdown  The Markdown source to extract the whitespace
 *
 * @return  {string}                The whitespace string
 */
export function getWhitespaceBeforeNode (node: SyntaxNode, markdown: string): string {
    if (node.prevSibling !== null) {
        const sliceBefore = markdown.substring(node.prevSibling.to, node.from)
        const onlyWhitespace = /(\s*)$/m.exec(sliceBefore) // NOTE the "m" flag
        return onlyWhitespace !== null ? onlyWhitespace[1] : ''
    } else if (node.parent !== null) {
        const sliceBefore = markdown.substring(node.parent.from, node.from)
        const onlyWhitespace = /(\s*)$/m.exec(sliceBefore) // NOTE the "m" flag
        return onlyWhitespace !== null ? onlyWhitespace[1] : ''
    } else {
        return ''
    }
}

// src/moondown/extensions/table/table-ast.ts
import { type SyntaxNode } from '@lezer/common'
import { parseTableNode } from './parse-table-node.ts'
import { parseChildren } from './parse-children.ts'
import {getWhitespaceBeforeNode} from "./table-functions.ts";
import {markdownLanguage} from "@codemirror/lang-markdown";

/**
 * Basic info every ASTNode needs to provide
 */
export interface MDNode {
    /**
     * The node.name property (may differ from the type; significant mainly for
     * generics)
     */
    name: string
    /**
     * The start offset of this node in the original source
     */
    from: number
    /**
     * The end offset of this node in the original source
     */
    to: number
    /**
     * This property contains the whitespace before this node; required to
     * determine appropriate significant whitespace portions for some elements
     * upon converting to HTML.
     */
    whitespaceBefore: string
    /**
     * Can be used to store arbitrary attributes (e.g. Pandoc-style attributes
     * such as {.className})
     */
    attributes?: Record<string, string>
}

/**
 * Represents a single table cell
 */
export interface TableCell extends MDNode {
    type: 'TableCell'
    /**
     * The text content of the cell TODO: Arbitrary children!
     */
    children: ASTNode[]
}

/**
 * Represents a table row.
 */
export interface TableRow extends MDNode {
    type: 'TableRow'
    /**
     * This is set to true if the row is a header.
     */
    isHeaderOrFooter: boolean
    /**
     * A list of cells within this row
     */
    cells: TableCell[]
}

export interface TableHeader extends MDNode {
    type: 'TableHeader'
    /**
     * This is set to true if the row is a header.
     */
    isHeaderOrFooter: boolean
    /**
     * A list of cells within this row
     */
    cells: TableCell[]
}

/**
 * Represents a table element.
 */
export interface Table extends MDNode {
    type: 'Table'
    /**
     * A list of rows of this table
     */
    rows: TableRow[]
    /**
     * A list of column alignments in the table. May be undefined; the default is
     * for all columns to be left-aligned.
     */
    alignment?: Array<'left'|'center'|'right'>
}

/**
 * A generic text node that can represent a string of content. Most nodes
 * contain at least one TextNode as its content (e.g. emphasis).
 */
export interface TextNode extends MDNode {
    type: 'Text'
    /**
     * The string value of the text node.
     */
    value: string
}

/**
 * This generic node represents any Lezer node that has no specific role (or can
 * be handled without additional care). This ensures that new nodes will always
 * end up in the resulting AST, even if we forgot to add the node specifically.
 */
export interface GenericNode extends MDNode {
    type: 'Generic'
    /**
     * Each generic node may have children
     */
    children: ASTNode[]
}

/**
 * Any node that can be part of the AST is an ASTNode.
 */
export type ASTNode = Table | TableCell | TableRow | TextNode | GenericNode

/**
 * Parses a single Lezer style SyntaxNode to an ASTNode.
 *
 * @param   {SyntaxNode}  node      The node to convert
 * @param   {string}      markdown  The Markdown source, required to extract the
 *                                  actual text content of the SyntaxNodes,
 *                                  which isn't stored in the nodes themselves.
 *
 * @return  {ASTNode}               The root node of a Markdown AST
 */
export function parseNode (node: SyntaxNode, markdown: string): ASTNode {
    if (node.name === 'Table') {
        return parseTableNode(node, markdown)
    } else {
        const astNode: GenericNode = {
            type: 'Generic',
            name: node.name,
            from: node.from,
            to: node.to,
            whitespaceBefore: getWhitespaceBeforeNode(node, markdown),
            children: []
        }
        return parseChildren(astNode, node, markdown)
    }
}

export function markdownToAST (markdown: string): ASTNode {
    const { parser } = markdownLanguage
    const tree = parser.parse(markdown)
    return parseNode(tree.topNode, markdown)
}

// src/moondown/extensions/table/index.ts
import {Compartment, type Extension} from "@codemirror/state";
import {tablePositions} from "./table-position.ts";
import {renderTables} from "./render-tables.ts";

export function tableExtension(): Extension {
    return [
        tablePositions,
        (new Compartment()).of(renderTables)
    ];
}

// src/moondown/extensions/table/compute-css.ts
export default function computeCSS(edgeButtonSize: number): Element {
    const styleNode = document.createElement('style')
    styleNode.setAttribute('id', 'tableHelperCSS')
    styleNode.setAttribute('type', 'text/css')

    styleNode.textContent = `
  /* --- Light Mode Table Styles --- */
  table.table-helper {
    width: 100%;
    display: inline-table;
    border: 1px solid #e0e0e0;
    padding: 0px;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  table.table-helper tr:first-child {
    font-weight: bold;
    background-color: #f0f0f0;
    color: #333;
  }
  table.table-helper tr:first-child td {
    border-right: 1px solid #e0e0e0;
  }
  table.table-helper td {
    padding: 8px;
    border: 1px solid #e0e0e0;
    min-width: 150px;
    caret-color: rgb(0, 0, 0);
    height: ${edgeButtonSize * 1.5}px;
    position: relative;
  }
  table.table-helper td:focus {
    background-color: #e6f7ff;
    outline: none;
  }
  .table-helper-operate-button {
    background-color: #fff;
    color: #4d5d75;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  /* --- Dark Mode Table Styles --- */
  .dark table.table-helper {
    border-color: #4a5568;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
  }
  .dark table.table-helper tr:first-child {
    background-color: #2d3748;
    color: #e2e8f0;
  }
  .dark table.table-helper tr:first-child td {
    border-right-color: #4a5568;
  }
  .dark table.table-helper td {
    border-color: #4a5568;
    caret-color: #e2e8f0;
  }
  .dark table.table-helper td:focus {
    background-color: #4a5568;
  }
  .dark .table-helper-operate-button {
    background-color: #2d3748;
    color: #e2e8f0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  /* --- Tippy.js Menu Styles --- */
  .tippy-box[data-theme~='custom'] {
    background-color: white;
    color: black;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .tippy-box[data-theme~='custom'][data-placement^='bottom'] > .tippy-arrow::before {
    border-bottom-color: white;
  }
  .tippy-box[data-theme~='custom'] .tippy-content {
    padding: 4px;
  }
  .tippy-button:hover {
    background-color: #f0f0f0;
  }
  
  /* Dark Mode Tippy.js */
  .dark .tippy-box[data-theme~='custom'] {
    background-color: #2d3748;
    color: #e2e8f0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  .dark .tippy-box[data-theme~='custom'][data-placement^='bottom'] > .tippy-arrow::before {
    border-bottom-color: #2d3748;
  }
   .dark .tippy-box[data-theme~='custom'][data-placement^='right'] > .tippy-arrow::before {
    border-right-color: #2d3748;
  }
  .dark .tippy-button:hover {
    background-color: #4a5568;
  }

  /* --- Common, Unchanged Styles --- */
  table.table-helper tr:first-child td {
    padding: 12px;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .table-helper-operate-button {
    z-index: 3;
    opacity: 0.5;
    transition: 0.2s opacity ease;
    text-align: center;
    cursor: pointer;
    position: absolute;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .table-helper-operate-button:hover {
    opacity: 1;
  }
  .table-helper-operate-button.top, .table-helper-operate-button.bottom {
    width: ${edgeButtonSize * 1.2}px;
    height: ${edgeButtonSize * 0.6}px;
    border-radius: ${edgeButtonSize * 0.5}px;
  }
  .table-helper-operate-button.left, .table-helper-operate-button.right {
    width: ${edgeButtonSize * 0.6}px;
    height: ${edgeButtonSize * 1.2}px;
    border-radius: ${edgeButtonSize * 0.5}px;
  }
  .tippy-button {
    border: none;
    background: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 2px;
    transition: background-color 0.3s;
  }
  .tippy-button i {
    display: block;
    width: 16px;
    height: 16px;
  }
  .alignment-options {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  `

    return styleNode
}

// src/moondown/extensions/table/calculate-col-sizes.ts
export default function calculateColSizes (ast: string[][]): number[] {
    const sizes = []
    for (let col = 0; col < ast[0].length; col++) {
        let colSize = 0
        for (let row = 0; row < ast.length; row++) {
            const cell = ast[row][col]
            let cellLength = cell.length
            if (cell.includes('\n')) {
                // Multi-line cell -> take the longest of the containing rows
                cellLength = Math.max(...cell.split('\n').map(x => x.length))
            }

            if (cellLength > colSize) {
                colSize = cellLength
            }
        }
        sizes.push(colSize)
    }
    return sizes
}

// src/moondown/extensions/table/table-position.ts
import {StateEffect, StateField} from "@codemirror/state";

export const updateTablePosition = StateEffect.define<{id: number, from: number, to: number}>()

export const tablePositions = StateField.define<Map<number, {from: number, to: number}>>({
    create: () => new Map(),
    update(value, tr) {
        const newValue = new Map(value)
        for (const effect of tr.effects) {
            if (effect.is(updateTablePosition)) {
                newValue.set(effect.value.id, {from: effect.value.from, to: effect.value.to})
            }
        }
        return newValue
    }
})

// src/moondown/extensions/blockquote/keymaps.ts
import {type Extension} from "@codemirror/state";
import {EditorView, keymap} from "@codemirror/view";

export const blockquoteKeymapExtension: Extension = keymap.of([
    {
        key: 'Enter',
        run: (view: EditorView) => {
            const { state } = view;
            const line = state.doc.lineAt(state.selection.main.from);
            const match = line.text.match(/^(\s*>\s*)/);

            if (match) {
                const prefix = match[1];
                const lineContent = line.text.slice(prefix.length);

                if (lineContent.trim() === '') {
                    // If the current line is empty except for the prefix, exit blockquote
                    view.dispatch(state.update({
                        changes: { from: line.from, to: line.to, insert: '\n' },
                        selection: { anchor: line.from + 1 } // Adjusted selection anchor
                    }));
                } else {
                    // Otherwise, continue blockquote
                    view.dispatch(state.update({
                        changes: { from: state.selection.main.from, insert: '\n' + prefix },
                        selection: { anchor: state.selection.main.from + prefix.length + 1 }
                    }));
                }
                return true;
            }
            return false;
        }
    }
]);

// src/moondown/extensions/blockquote/index.ts
import { blockquoteKeymapExtension } from './keymaps.ts';

export function blockquote() {
    return [
        blockquoteKeymapExtension
    ]
}

// src/moondown/extensions/fenced-code/decorations.ts
import {Decoration} from "@codemirror/view";

export const fencedCodeDecoration = Decoration.line({
    attributes: {class: "cm-fenced-code"}
})
export const hideLineDecoration = Decoration.line({
    attributes: {class: "cm-hide-line"}
})


// src/moondown/extensions/fenced-code/fenced-code-plugin.ts
import {EditorView, Decoration} from "@codemirror/view"
import {StateField, RangeSetBuilder, EditorState} from "@codemirror/state"
import {syntaxTree} from "@codemirror/language"
import {
    fencedCodeDecoration,
    // fencedCodeFirstLineDecoration, fencedCodeLastLineDecoration,
    hideLineDecoration
} from "./decorations.ts";

// 定义插件，处理代码块的背景和样式
export const fencedCodeBackgroundPlugin = StateField.define({
    create(_state: EditorState) {
        return Decoration.none;
    },
    update(_decorations, transaction) {
        const state = transaction.state
        const ranges: { from: number, to: number, decoration: Decoration }[] = []
        const selection = state.selection.main

        syntaxTree(state).iterate({
            enter: (node) => {
                if (node.type.name === "FencedCode") {
                    const start = node.from
                    const end = node.to
                    const isSelected = selection.from <= end && selection.to >= start

                    const startLine = state.doc.lineAt(start)
                    const endLine = state.doc.lineAt(end)

                    // 为所有行添加背景色
                    let pos = startLine.from
                    while (pos <= endLine.from) {
                        const line = state.doc.lineAt(pos)
                        ranges.push({
                            from: line.from,
                            to: line.from,
                            decoration: fencedCodeDecoration
                        })
                        pos = line.to + 1
                    }

                    if (!isSelected && startLine.number !== endLine.number) {
                        // 光标不在代码块中且代码块不止一行,隐藏第一行和最后一行
                        ranges.push({
                            from: startLine.from,
                            to: startLine.from,
                            decoration: hideLineDecoration
                        })
                        ranges.push({
                            from: endLine.from,
                            to: endLine.from,
                            decoration: hideLineDecoration
                        })
                    }
                }
            }
        })

        // 对 ranges 按照 from 位置排序
        ranges.sort((a, b) => {
            const fromDiff = a.from - b.from
            if (fromDiff !== 0) {
                return fromDiff
            }
            // 如果 from 位置相同, 按照装饰类型排序
            if (a.decoration === fencedCodeDecoration) {
                return -1
            }
            if (b.decoration === fencedCodeDecoration) {
                return 1
            }
            return 0
        })

        // 创建新的 RangeSetBuilder 并按照排序后的 ranges 添加装饰
        const builder = new RangeSetBuilder<Decoration>()
        for (const {from, to, decoration} of ranges) {
            builder.add(from, to, decoration)
        }

        return builder.finish()
    },
    provide: (f) => EditorView.decorations.from(f),
})

// 创建输入处理器，当用户输入 ``` 时，自动添加结尾的 ```
export const codeBlockInputHandler = EditorView.inputHandler.of((view, _from, _to, text) => {
    if (text === "`") {
        const state = view.state
        const selection = state.selection.main
        const beforeCursor = state.doc.sliceString(Math.max(0, selection.from - 2), selection.from)

        // 检查前两个字符是否也是反引号，构成了三个反引号
        if (beforeCursor === "``") {
            // 插入一个换行符、空行和结尾的 ```
            const insertText = "\n\n```"
            // 计算光标新位置，在第一个 ``` 后
            const cursorPos = selection.from + 1

            // 执行替换
            view.dispatch({
                changes: {from: selection.from - 2, to: selection.from, insert: "```" + insertText},
                selection: {anchor: cursorPos}
            })

            // 阻止默认输入处理
            return true
        }
    }

    // 使用默认的输入处理器
    return false
})


// src/moondown/extensions/fenced-code/index.ts
import {type Extension} from "@codemirror/state";
import {codeBlockInputHandler, fencedCodeBackgroundPlugin} from "./fenced-code-plugin.ts";
import {languageIdentifierAutocomplete} from "./language-autocomplete.ts";

// 导出插件
export function fencedCode(): Extension{
    return [
        fencedCodeBackgroundPlugin,
        languageIdentifierAutocomplete,
        codeBlockInputHandler
    ]
}

// src/moondown/extensions/fenced-code/language-autocomplete.ts
import {autocompletion, CompletionContext} from "@codemirror/autocomplete";

// 定义语言列表，用于自动补全
const languageNames = [
    {label: "javascript", type: "keyword"},
    {label: "python", type: "keyword"},
    {label: "java", type: "keyword"},
    {label: "csharp", type: "keyword"},
    {label: "cpp", type: "keyword"},
    {label: "ruby", type: "keyword"},
    {label: "go", type: "keyword"},
]

// 定义自动补全源，只在 ``` 后的语言标识符位置提供补全
function languageIdentifierCompletion(context: CompletionContext) {
    const {state, pos} = context
    const line = state.doc.lineAt(pos)
    const lineStart = line.from
    const beforeCursor = state.doc.sliceString(lineStart, pos)

    // 检查当前行是否以 ``` 开头，并捕获输入的语言标识符
    const tripleBacktickMatch = /^```([^\s`]*)$/.exec(beforeCursor)
    if (tripleBacktickMatch) {
        const word = tripleBacktickMatch[1]

        // 返回匹配的语言列表
        return {
            from: lineStart + 3, // 光标在 ``` 之后的位置
            to: pos,
            options: languageNames.filter(lang => lang.label.startsWith(word)),
            validFor: /^([^\s`]*)$/ // 当输入或删除字符时保持自动补全
        }
    }

    return null
}

// 创建自动补全扩展
export const languageIdentifierAutocomplete = autocompletion({
    override: [languageIdentifierCompletion]
})


// src/moondown/extensions/correct-list/list-functions.ts
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";

interface ListLevel {
    indent: number;
    number: number;
    type: 'ordered' | 'unordered';
}

export function updateLists(view: EditorView) {
    const { state } = view;
    const doc = state.doc;
    const lines = doc.toString().split('\n');
    const changes = [];

    let listStack: ListLevel[] = [];

    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
        const line = lines[lineNumber];
        const lineStart = doc.line(lineNumber + 1).from;

        const orderedMatch = line.match(/^(\s*)(\d+(?:\.\d+)*)\.\s/);
        const unorderedMatch = line.match(/^(\s*)([-*+])\s/);

        if (orderedMatch || unorderedMatch) {
            const indentation = (orderedMatch || unorderedMatch)![1];
            const currentIndent = indentation.length;
            const isOrdered = !!orderedMatch;
            const currentType = isOrdered ? 'ordered' : 'unordered';

            // 1. Pop levels from stack that are deeper than current indent
            while (listStack.length > 0 && listStack[listStack.length - 1].indent > currentIndent) {
                listStack.pop();
            }

            const topLevel = listStack.length > 0 ? listStack[listStack.length - 1] : null;

            if (topLevel && topLevel.indent === currentIndent && topLevel.type === currentType) {
                // 2. Same level and same type: increment number
                topLevel.number++;
            } else {
                // 3. New level (deeper indent) or type switch at same indent
                if (topLevel && topLevel.indent === currentIndent) {
                    // Type switch, replace the top level
                    listStack.pop();
                }
                listStack.push({
                    indent: currentIndent,
                    number: 1,
                    type: currentType,
                });
            }

            if (isOrdered) {
                // 4. Construct the new multi-level number string
                const newNumber = listStack
                    .filter(level => level.type === 'ordered')
                    .map(level => level.number)
                    .join('.');

                const currentNumber = orderedMatch![2];
                if (currentNumber !== newNumber) {
                    const numberStart = lineStart + indentation.length;
                    const numberEnd = numberStart + currentNumber.length;
                    changes.push({
                        from: numberStart,
                        to: numberEnd,
                        insert: newNumber,
                    });
                }
            }
        } else if (line.trim().length > 0) {
            // Non-list content line, reset the stack
            listStack = [];
        }
        // Empty lines do not reset the stack, allowing for space between list items.
    }

    if (changes.length > 0) {
        view.dispatch({ changes });
    }
}

export function getListInfo(state: EditorState, pos: number) {
    const line = state.doc.lineAt(pos);
    const lineText = line.text;

    // 检查有序列表
    const orderedMatch = lineText.match(/^(\s*)(\d+(?:\.\d+)*)\.\s/);
    if (orderedMatch) {
        return {
            type: 'ordered' as const,
            indent: orderedMatch[1].length,
            marker: orderedMatch[2] + '.',
            content: lineText.slice(orderedMatch[0].length),
            markerEnd: line.from + orderedMatch[0].length
        };
    }

    // 检查无序列表
    const unorderedMatch = lineText.match(/^(\s*)([-*+])\s/);
    if (unorderedMatch) {
        return {
            type: 'unordered' as const,
            indent: unorderedMatch[1].length,
            marker: unorderedMatch[2],
            content: lineText.slice(unorderedMatch[0].length),
            markerEnd: line.from + unorderedMatch[0].length
        };
    }

    return null;
}

export function generateListItem(type: 'ordered' | 'unordered', indent: number, number?: string): string {
    const indentation = ' '.repeat(indent);
    if (type === 'ordered') {
        return `${indentation}${number || '1'}. `;
    } else {
        const markers = ['-', '*', '+'];
        const markerIndex = Math.floor(indent / 2) % markers.length;
        return `${indentation}${markers[markerIndex]} `;
    }
}

// src/moondown/extensions/correct-list/list-keymap.ts
import { EditorView, type KeyBinding } from "@codemirror/view";
import { indentLess, indentMore, deleteCharBackward, deleteCharForward } from "@codemirror/commands";
import { updateListEffect } from "./update-list-effect";
import { getListInfo, generateListItem } from "./list-functions";
import { LIST_INDENT, LIST_UPDATE_DELAY } from "./constants";

/**
 * Keymap for list editing functionality
 * Handles Tab, Shift-Tab, Enter, and Backspace/Delete keys
 */
export const listKeymap: KeyBinding[] = [
    {
        key: 'Tab',
        run: (view: EditorView) => {
            const { state } = view;
            const { selection } = state;
            const pos = selection.main.head;
            const listInfo = getListInfo(state, pos);

            if (listInfo) {
                // Indent list item
                indentMore(view);

                // Defer list number update to ensure indent operation completes
                setTimeout(() => {
                    view.dispatch({
                        effects: updateListEffect.of({ from: 0, to: state.doc.length }),
                    });
                }, LIST_UPDATE_DELAY);

                return true;
            }
            return false;
        },
    },
    {
        key: 'Shift-Tab',
        run: (view: EditorView) => {
            const { state } = view;
            const { selection } = state;
            const pos = selection.main.head;
            const listInfo = getListInfo(state, pos);

            if (listInfo && listInfo.indent > LIST_INDENT.MIN) {
                // Decrease indentation
                indentLess(view);

                // Defer list number update
                setTimeout(() => {
                    view.dispatch({
                        effects: updateListEffect.of({ from: 0, to: state.doc.length }),
                    });
                }, LIST_UPDATE_DELAY);

                return true;
            }
            return false;
        },
    },
    {
        key: 'Enter',
        run: (view: EditorView) => {
            const { state } = view;
            const { selection } = state;
            const pos = selection.main.head;
            const listInfo = getListInfo(state, pos);

            if (listInfo) {
                const line = state.doc.lineAt(pos);

                if (listInfo.content.trim() === '') {
                    // Current list item is empty
                    if (listInfo.indent === LIST_INDENT.MIN) {
                        // Already at top level, exit list
                        const transaction = state.update({
                            changes: {
                                from: line.from,
                                to: line.to,
                                insert: '',
                            },
                            selection: { anchor: line.from }
                        });
                        view.dispatch(transaction);
                    } else {
                        // Go back one indentation level
                        const newIndent = Math.max(LIST_INDENT.MIN, listInfo.indent - LIST_INDENT.SIZE);
                        const newListItem = generateListItem(listInfo.type, newIndent);

                        const transaction = state.update({
                            changes: {
                                from: line.from,
                                to: line.to,
                                insert: newListItem,
                            },
                            selection: { anchor: line.from + newListItem.length }
                        });
                        view.dispatch(transaction);

                        // Update list numbering
                        setTimeout(() => {
                            view.dispatch({
                                effects: updateListEffect.of({ from: 0, to: state.doc.length }),
                            });
                        }, LIST_UPDATE_DELAY);
                    }
                } else {
                    // Create new list item
                    const newListItem = generateListItem(listInfo.type, listInfo.indent);
                    const insertText = `\n${newListItem}`;

                    const transaction = state.update({
                        changes: {
                            from: pos,
                            to: pos,
                            insert: insertText,
                        },
                        selection: { anchor: pos + insertText.length }
                    });
                    view.dispatch(transaction);

                    // Update list numbering
                    setTimeout(() => {
                        view.dispatch({
                            effects: updateListEffect.of({ from: 0, to: state.doc.length }),
                        });
                    }, LIST_UPDATE_DELAY);
                }

                return true;
            }

            return false;
        },
    },
    {
        key: 'Backspace',
        run: (view: EditorView) => {
            const { state } = view;
            const { selection } = state;
            const pos = selection.main.head;

            // Check if current position is in a list or delete operation may affect list
            const currentLine = state.doc.lineAt(pos);
            const currentListInfo = getListInfo(state, pos);

            // Check if previous line is a list item (for handling newline deletion)
            let previousLineListInfo = null;
            if (currentLine.number > 1) {
                const previousLine = state.doc.line(currentLine.number - 1);
                previousLineListInfo = getListInfo(state, previousLine.from);
            }

            // If current or previous line is a list item, update list numbers after deletion
            if (currentListInfo || previousLineListInfo) {
                // Execute default delete operation
                const result = deleteCharBackward(view);

                // Defer list number update to ensure delete operation completes
                setTimeout(() => {
                    view.dispatch({
                        effects: updateListEffect.of({ from: 0, to: view.state.doc.length }),
                    });
                }, LIST_UPDATE_DELAY);

                return result;
            }

            return false;
        },
    },
    {
        key: 'Delete',
        run: (view: EditorView) => {
            const { state } = view;
            const { selection } = state;
            const pos = selection.main.head;

            // Check if current position is in a list or delete operation may affect list
            const currentLine = state.doc.lineAt(pos);
            const currentListInfo = getListInfo(state, pos);

            // Check if next line is a list item (for handling newline deletion)
            let nextLineListInfo = null;
            if (currentLine.number < state.doc.lines) {
                const nextLine = state.doc.line(currentLine.number + 1);
                nextLineListInfo = getListInfo(state, nextLine.from);
            }

            // If current or next line is a list item, update list numbers after deletion
            if (currentListInfo || nextLineListInfo) {
                // Execute default delete operation
                const result = deleteCharForward(view);

                // Defer list number update to ensure delete operation completes
                setTimeout(() => {
                    view.dispatch({
                        effects: updateListEffect.of({ from: 0, to: view.state.doc.length }),
                    });
                }, LIST_UPDATE_DELAY);

                return result;
            }

            return false;
        },
    },
];

// src/moondown/extensions/correct-list/constants.ts

/**
 * Constants for list functionality
 */

/**
 * List indentation settings
 */
export const LIST_INDENT = {
  /** Size of one indent level in spaces */
  SIZE: 2,
  /** Minimum indent level */
  MIN: 0,
  /** Maximum indent level */
  MAX: 10,
} as const;

/**
 * List types
 */
export const LIST_TYPES = {
  ORDERED: 'ordered',
  UNORDERED: 'unordered',
} as const;

/**
 * List markers
 */
export const LIST_MARKERS = {
  /** Unordered list marker */
  UNORDERED: '- ',
  /** Ordered list marker template (will be replaced with number) */
  ORDERED_TEMPLATE: (num: number) => `${num}. `,
} as const;

/**
 * Timeout for deferred list updates (in milliseconds)
 */
export const LIST_UPDATE_DELAY = 0;

/**
 * Regular expressions for list detection
 */
export const LIST_PATTERNS = {
  /** Matches ordered list item: 1. , 2. , etc. */
  ORDERED: /^(\s*)(\d+)\.\s/,
  /** Matches unordered list item: - , * , + */
  UNORDERED: /^(\s*)[-*+]\s/,
  /** Matches any list item */
  ANY: /^(\s*)([-*+]|\d+\.)\s/,
} as const;


// src/moondown/extensions/correct-list/update-list-effect.ts
import { StateEffect } from "@codemirror/state";

export const updateListEffect = StateEffect.define<{ from: number; to: number }>({});

// src/moondown/extensions/correct-list/index.ts
import type {Extension} from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { listKeymap } from "./list-keymap.ts";
import { bulletListPlugin, updateListPlugin } from "./list-plugins";

export function correctList(): Extension {
    return [
        keymap.of(listKeymap),
        updateListPlugin,
        bulletListPlugin,
    ];
}

// src/moondown/extensions/correct-list/list-plugins.ts
import { Decoration, type DecorationSet, EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { updateListEffect } from "./update-list-effect";
import { updateLists } from "./list-functions";
import { RangeSetBuilder } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { BulletWidget } from "./bullet-widget";
import { LIST_INDENT, LIST_PATTERNS } from "./constants";

/**
 * Maximum number of bullet styles to cycle through
 */
const BULLET_STYLE_COUNT = 3;

/**
 * Plugin to handle automatic list number updates
 * Listens to document changes and updates list numbering when needed
 */
export const updateListPlugin = EditorView.updateListener.of((update) => {
    // Check if there's a manual update trigger
    let hasManualUpdate = false;
    for (const tr of update.transactions) {
        for (const e of tr.effects) {
            if (e.is(updateListEffect)) {
                hasManualUpdate = true;
                updateLists(update.view);
                return; // If manual update exists, return early
            }
        }
    }

    // If no manual update but document changed, check if auto-update is needed
    if (!hasManualUpdate && update.docChanged) {
        let needsUpdate = false;

        // Check if changes might affect list numbering
        for (const tr of update.transactions) {
            tr.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
                const deletedText = update.startState.doc.sliceString(fromA, toA);
                const insertedText = inserted.toString();

                /**
                 * Check if text contains list markers
                 */
                const hasListMarker = (text: string) => {
                    return LIST_PATTERNS.ANY.test(text) ||
                        new RegExp('\n' + LIST_PATTERNS.ANY.source.slice(1)).test(text);
                };

                if (hasListMarker(deletedText) || hasListMarker(insertedText)) {
                    needsUpdate = true;
                    return;
                }

                // Check if lines around the change contain lists
                const doc = update.state.doc;
                try {
                    const fromLine = Math.max(1, doc.lineAt(Math.max(0, fromB - 1)).number - 1);
                    const toLine = Math.min(doc.lines, doc.lineAt(Math.min(toB + 1, doc.length)).number + 1);

                    for (let lineNum = fromLine; lineNum <= toLine; lineNum++) {
                        const line = doc.line(lineNum);
                        if (LIST_PATTERNS.ANY.test(line.text)) {
                            needsUpdate = true;
                            return;
                        }
                    }
                } catch (_ignore) {
                    // If error accessing lines, trigger update for safety
                    needsUpdate = true;
                }
            });

            if (needsUpdate) break;
        }

        if (needsUpdate) {
            updateLists(update.view);
        }
    }
});

/**
 * Plugin to replace bullet markers with styled decorations
 * Provides visual variety for different indentation levels
 */
export const bulletListPlugin = ViewPlugin.fromClass(class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
        this.decorations = this.buildDecorations(view);
    }

    update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged || update.selectionSet) {
            this.decorations = this.buildDecorations(update.view);
        }
    }

    buildDecorations(view: EditorView) {
        const builder = new RangeSetBuilder<Decoration>();

        for (const { from, to } of view.visibleRanges) {
            syntaxTree(view.state).iterate({
                from,
                to,
                enter: (node) => {
                    if (node.name.includes('ListItem')) {
                        const line = view.state.doc.lineAt(node.from);
                        const unorderedMatch = line.text.match(/^(\s*)([-*+])\s/);

                        if (unorderedMatch) {
                            const indentation = unorderedMatch[1] || '';
                            const indentLevel = Math.floor(indentation.length / LIST_INDENT.SIZE);
                            const levelClass = `cm-bullet-list-l${indentLevel % BULLET_STYLE_COUNT}`;

                            const bulletStart = line.from + (unorderedMatch.index || 0);
                            const bulletEnd = bulletStart + unorderedMatch[0].length;

                            // Replace the entire marker with a custom bullet widget
                            // This makes the operation more atomic and less prone to conflicts
                            builder.add(
                                bulletStart,
                                bulletEnd,
                                Decoration.replace({
                                    widget: new BulletWidget(levelClass, indentLevel, indentation),
                                })
                            );
                        }
                    }
                }
            });
        }
        return builder.finish();
    }
}, {
    decorations: v => v.decorations,
});

// src/moondown/extensions/correct-list/bullet-widget.ts
import { WidgetType } from "@codemirror/view";

export class BulletWidget extends WidgetType {
    constructor(private className: string, private level: number, private indentation: string) {
        super();
    }

    toDOM() {
        const span = document.createElement("span");
        span.innerHTML = `${this.indentation}${this.getBulletSymbol(this.level)} `;
        span.className = `cm-bullet-list ${this.className}`;
        return span;
    }

    private getBulletSymbol(level: number): string {
        const symbols = ["●", "○", "■"];
        return symbols[level % symbols.length];
    }

    eq(other: BulletWidget) {
        return other.className === this.className &&
            other.level === this.level &&
            other.indentation === this.indentation;
    }
}

// src/moondown/extensions/final-new-line/index.ts
import {finalNewLinePlugin} from "./final-new-line.ts";

export const finalNewLine = finalNewLinePlugin;

// src/moondown/extensions/final-new-line/final-new-line.ts
import {EditorView, type PluginValue, ViewPlugin, ViewUpdate} from "@codemirror/view";
import {Text} from "@codemirror/state";

export class FinalNewLinePlugin implements PluginValue {
    constructor(private readonly view: EditorView) {
        setTimeout(() => {
            this.ensureFinalNewLine(true);
        }, 0);
    }

    private ensureFinalNewLine(newLine = false) {
        const endLine = this.view.state.doc.line(this.view.state.doc.lines);

        if (endLine.length) {
            const hasSelection = this.view.state.selection.ranges.some((range) => range.from !== range.to);

            this.view.dispatch({
                    changes: {
                        from: endLine.to,
                        insert: Text.of(['', '']),
                    },
                    selection: newLine && !hasSelection ? {
                        anchor: endLine.to + 1,
                        head: endLine.to + 1,
                    } : undefined,
                },
            );
        }
    }

    update(update: ViewUpdate) {
        if (update.focusChanged) {
            setTimeout(() => {
                this.ensureFinalNewLine();
            }, 0);
        }
    }
}

export const finalNewLinePlugin = ViewPlugin.fromClass(FinalNewLinePlugin);

// src/moondown/extensions/bubble-menu/bubble-menu.ts
import { EditorView, ViewUpdate, type PluginValue } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import * as icons from 'lucide';
import { createPopper, type Instance as PopperInstance, type VirtualElement } from '@popperjs/core';
import type { BubbleMenuItem } from "./types";
import { bubbleMenuField, showBubbleMenu } from "./fields";
import {
    isHeaderActive,
    isInlineStyleActive,
    isListActive,
    setHeader,
    toggleInlineStyle,
    toggleList
} from "./content-functions";
import { CSS_CLASSES, ICON_SIZES, POPPER_CONFIG, MARKDOWN_MARKERS } from "../../core";
import { createElement, createIconElement } from "../../core";
import { isMarkdownImage } from "../../core";

/**
 * BubbleMenu - A floating toolbar that appears on text selection
 * Provides quick access to formatting options like bold, italic, headings, etc.
 */

export class BubbleMenu implements PluginValue {
    private dom: HTMLElement;
    private items: BubbleMenuItem[];
    private view: EditorView;
    private popper: PopperInstance | null;
    private boundHandleMouseUp: (e: MouseEvent) => void;

    constructor(view: EditorView) {
        this.view = view;
        this.dom = createElement('div', CSS_CLASSES.BUBBLE_MENU);
        this.items = this.createItems();
        this.buildMenu();
        document.body.appendChild(this.dom);
        this.popper = null;
        this.boundHandleMouseUp = this.handleMouseUp.bind(this);
        document.addEventListener('mouseup', this.boundHandleMouseUp);
    }

    update(update: ViewUpdate): void {
        const menu = update.state.field(bubbleMenuField);
        if (!menu) {
            this.hide();
            return;
        }

        const { from, to } = update.state.selection.main;
        if (from === to || this.isImageSelection(update.state, from, to)) {
            this.hide();
            return;
        }

        this.show(from, to);
    }

    destroy(): void {
        this.destroyPopper();
        this.dom.remove();
        document.removeEventListener('mouseup', this.boundHandleMouseUp);
    }

    /**
     * Checks if the current selection is an image markdown
     */
    private isImageSelection(state: EditorState, from: number, to: number): boolean {
        const selectedText = state.sliceDoc(from, to);
        return isMarkdownImage(selectedText);
    }

    /**
     * Hides the bubble menu
     */
    private hide(): void {
        this.dom.style.display = 'none';
        this.destroyPopper();
    }

    /**
     * Destroys the Popper instance
     */
    private destroyPopper(): void {
        if (this.popper) {
            this.popper.destroy();
            this.popper = null;
        }
    }

    /**
     * Shows the bubble menu at the selection position
     */
    private show(from: number, to: number): void {
        requestAnimationFrame(() => {
            this.dom.style.display = 'flex';

            const startPos = this.view.coordsAtPos(from);
            const endPos = this.view.coordsAtPos(to);

            if (!startPos || !endPos) return;

            const virtualElement: VirtualElement = {
                getBoundingClientRect: (): DOMRect => {
                    return {
                        width: endPos.left - startPos.left,
                        height: startPos.bottom - startPos.top,
                        top: startPos.top,
                        right: endPos.right,
                        bottom: startPos.bottom,
                        left: startPos.left,
                        x: startPos.left,
                        y: startPos.top,
                        toJSON: () => {
                            return {
                                width: endPos.left - startPos.left,
                                height: startPos.bottom - startPos.top,
                                top: startPos.top,
                                right: endPos.right,
                                bottom: startPos.bottom,
                                left: startPos.left,
                                x: startPos.left,
                                y: startPos.top,
                            };
                        }
                    };
                }
            };

            this.destroyPopper();

            this.popper = createPopper(virtualElement, this.dom, {
                placement: POPPER_CONFIG.PLACEMENT as any,
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: POPPER_CONFIG.OFFSET,
                        },
                    },
                ],
            });

            // Update active states for menu items
            this.updateActiveStates();

            // Force update Popper position
            this.popper.update();
        });
    }

    /**
     * Updates the active state of all menu items
     */
    private updateActiveStates(): void {
        this.items.forEach(item => {
            // Update main menu item state
            if (item.isActive) {
                const button = this.dom.querySelector(
                    `[data-name="${item.name}"]`
                ) as HTMLButtonElement;
                if (button) {
                    button.classList.toggle(
                        CSS_CLASSES.BUBBLE_MENU_ACTIVE,
                        item.isActive(this.view.state)
                    );
                }
            }

            // Update submenu item states
            if (item.subItems) {
                item.subItems.forEach(subItem => {
                    if (subItem.isActive) {
                        const subButton = this.dom.querySelector(
                            `[data-name="${subItem.name}"][data-parent="${item.name}"]`
                        ) as HTMLButtonElement;

                        if (subButton) {
                            const isActive = subItem.isActive(this.view.state);
                            subButton.classList.toggle(
                                CSS_CLASSES.BUBBLE_MENU_ACTIVE,
                                isActive
                            );
                        }
                    }
                });
            }
        });
    }

    /**
     * Handles mouse up event to show/hide the menu
     */
    private handleMouseUp(_event: MouseEvent): void {
        const { state } = this.view;
        const { from, to } = state.selection.main;

        if (from !== to && !this.isImageSelection(state, from, to)) {
            this.view.dispatch({
                effects: showBubbleMenu.of({ pos: Math.max(from, to), items: this.items })
            });
        } else {
            this.hide();
        }
    }

    /**
     * Clears selection and refocuses editor
     */
    private clearSelectionAndFocus(): void {
        // Use requestAnimationFrame to ensure DOM updates are complete
        requestAnimationFrame(() => {
            const currentPos = this.view.state.selection.main.head;
            this.view.dispatch({
                selection: { anchor: currentPos, head: currentPos },
            });
            this.view.focus();
        });
    }

    /**
     * Creates the menu item configuration
     */
    private createItems(): BubbleMenuItem[] {
        return [
            {
                name: 'Heading',
                icon: 'Heading',
                type: 'dropdown',
                subItems: [
                    {
                        name: 'H1',
                        icon: 'Heading1',
                        action: view => setHeader(view, 1),
                        isActive: state => isHeaderActive(state, 1),
                    },
                    {
                        name: 'H2',
                        icon: 'Heading2',
                        action: view => setHeader(view, 2),
                        isActive: state => isHeaderActive(state, 2),
                    },
                    {
                        name: 'H3',
                        icon: 'Heading3',
                        action: view => setHeader(view, 3),
                        isActive: state => isHeaderActive(state, 3),
                    },
                ]
            },
            {
                name: 'List',
                icon: 'List',
                type: 'dropdown',
                subItems: [
                    {
                        name: 'Ordered List',
                        // @ts-expect-error - lucide icon name
                        icon: 'list-ordered',
                        action: view => toggleList(view, true),
                        isActive: state => isListActive(state, true),
                    },
                    {
                        name: 'Unordered List',
                        icon: 'List',
                        action: view => toggleList(view, false),
                        isActive: state => isListActive(state, false),
                    },
                ]
            },
            {
                name: 'bold',
                icon: "Bold",
                type: 'button',
                action: view => toggleInlineStyle(view, MARKDOWN_MARKERS.BOLD),
                isActive: state => isInlineStyleActive(state, MARKDOWN_MARKERS.BOLD),
            },
            {
                name: 'italic',
                icon: "Italic",
                type: 'button',
                action: view => toggleInlineStyle(view, MARKDOWN_MARKERS.ITALIC),
                isActive: state => isInlineStyleActive(state, MARKDOWN_MARKERS.ITALIC),
            },
            {
                name: 'Decoration',
                icon: 'Paintbrush',
                type: 'dropdown',
                subItems: [
                    {
                        name: 'highlight',
                        icon: "Highlighter",
                        action: view => toggleInlineStyle(view, MARKDOWN_MARKERS.HIGHLIGHT),
                        isActive: state => isInlineStyleActive(state, MARKDOWN_MARKERS.HIGHLIGHT),
                    },
                    {
                        name: 'Strikethrough',
                        icon: 'Strikethrough',
                        action: view => toggleInlineStyle(view, MARKDOWN_MARKERS.STRIKETHROUGH),
                        isActive: state => isInlineStyleActive(state, MARKDOWN_MARKERS.STRIKETHROUGH),
                    },
                    {
                        name: 'Underline',
                        icon: 'Underline',
                        action: view => toggleInlineStyle(view, MARKDOWN_MARKERS.UNDERLINE),
                        isActive: state => isInlineStyleActive(state, MARKDOWN_MARKERS.UNDERLINE),
                    },
                    {
                        name: 'Inline Code',
                        icon: 'Code',
                        action: view => toggleInlineStyle(view, MARKDOWN_MARKERS.INLINE_CODE),
                        isActive: state => isInlineStyleActive(state, MARKDOWN_MARKERS.INLINE_CODE),
                    },
                ]
            }
        ];
    }

    /**
     * Builds the DOM structure for the menu
     */
    private buildMenu(): void {
        this.dom.innerHTML = '';

        this.items.forEach(item => {
            const button = createElement('button', CSS_CLASSES.BUBBLE_MENU_ITEM, {
                'data-name': item.name,
                'data-type': item.type || 'button',
                'title': item.name,
            });

            const iconWrapper = createIconElement(item.icon, 'cm-bubble-menu-icon');
            button.appendChild(iconWrapper);

            if (item.type === 'dropdown') {
                const dropdownIcon = createIconElement('chevron-down', 'cm-bubble-menu-dropdown-icon');
                button.appendChild(dropdownIcon);

                const dropdown = createElement('div', CSS_CLASSES.BUBBLE_MENU_DROPDOWN);

                item.subItems?.forEach(subItem => {
                    const subButton = createElement('button', CSS_CLASSES.BUBBLE_MENU_SUB_ITEM, {
                        'data-name': subItem.name,
                        'data-parent': item.name,
                    });

                    if (subItem.icon) {
                        const subIconWrapper = createIconElement(subItem.icon, 'cm-bubble-menu-sub-icon');
                        subButton.appendChild(subIconWrapper);
                    }

                    const subLabel = createElement('span', 'cm-bubble-menu-sub-label');
                    subLabel.textContent = subItem.name;
                    subButton.appendChild(subLabel);

                    subButton.addEventListener('click', async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        await subItem.action(this.view);
                        this.hide();
                        this.clearSelectionAndFocus();
                    });

                    dropdown.appendChild(subButton);
                });

                button.appendChild(dropdown);
            } else if (item.action) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    item.action!(this.view);
                    this.hide();
                    this.clearSelectionAndFocus();
                });
            }

            this.dom.appendChild(button);
        });

        // Initialize Lucide icons after DOM update
        setTimeout(() => {
            icons.createIcons({
                icons,
                attrs: ICON_SIZES.MEDIUM,
            });
        }, 0);
    }
}

// src/moondown/extensions/bubble-menu/content-functions.ts
import { EditorView } from "@codemirror/view";
import { EditorState, type ChangeSpec } from "@codemirror/state";
import {
    getLinesInRange,
    applyChanges,
    getTextWithContext,
    SELECTION
} from "../../core";
import {
    escapeRegExp,
    createHeadingPrefix,
    extractListNumber, isUnorderedListItem
} from "../../core";

/**
 * Functions for manipulating markdown content in the editor
 * These functions handle inline styles, headings, and lists
 */

/**
 * Sets or toggles heading level for selected lines
 * @param view - Editor view
 * @param level - Heading level (1-6)
 * @returns True if operation succeeded
 */
export function setHeader(view: EditorView, level: number): boolean {
    const { state } = view;
    const { from, to } = state.selection.main;
    const headerPrefix = createHeadingPrefix(level);
    const lines = getLinesInRange(state, from, to);

    const changes: ChangeSpec[] = lines.map(line => {
        // Toggle off if already this heading level
        if (line.text.startsWith(headerPrefix)) {
            return {
                from: line.from,
                to: line.from + headerPrefix.length,
                insert: ''
            };
        }

        // Replace existing heading with new level
        const existingHeaderMatch = line.text.match(/^#+\s/);
        if (existingHeaderMatch) {
            return {
                from: line.from,
                to: line.from + existingHeaderMatch[0].length,
                insert: headerPrefix
            };
        }

        // Add new heading
        return { from: line.from, insert: headerPrefix };
    });

    applyChanges(view, changes);
    return true;
}

/**
 * Toggles ordered or unordered list formatting for selected lines
 * @param view - Editor view
 * @param ordered - True for ordered list, false for unordered
 * @returns True if operation succeeded
 */
export function toggleList(view: EditorView, ordered: boolean): boolean {
    const { state } = view;
    const { from, to } = state.selection.main;
    const lines = getLinesInRange(state, from, to);

    // Determine starting number for ordered lists
    let currentNumber = 1;
    const fromLine = state.doc.lineAt(from);
    if (fromLine.number > 1 && ordered) {
        const prevLine = state.doc.line(fromLine.number - 1);
        const prevNumber = extractListNumber(prevLine.text);
        if (prevNumber !== null) {
            currentNumber = prevNumber + 1;
        }
    }

    const changes: ChangeSpec[] = lines.map(line => {
        const lineText = line.text;

        if (ordered) {
            const existingNumber = extractListNumber(lineText);
            if (existingNumber !== null) {
                // Remove ordered list marker
                const match = lineText.match(/^(\d+)\.\s/);
                return {
                    from: line.from,
                    to: line.from + match![0].length,
                    insert: ''
                };
            }
            // Add ordered list marker
            const insert = `${currentNumber}. `;
            currentNumber++;
            return { from: line.from, insert };
        } else {
            if (isUnorderedListItem(lineText)) {
                // Remove unordered list marker
                return { from: line.from, to: line.from + 2, insert: '' };
            }
            // Add unordered list marker
            return { from: line.from, insert: '- ' };
        }
    });

    applyChanges(view, changes);
    return true;
}

/**
 * Toggles inline markdown style (bold, italic, etc.) for selection
 * @param view - Editor view
 * @param mark - Markdown marker to toggle
 * @returns True if operation succeeded
 */
export function toggleInlineStyle(view: EditorView, mark: string): boolean {
    const { state } = view;
    const { from, to } = state.selection.main;

    // Get text with context around selection
    const contextLength = mark.length * SELECTION.MARKER_CONTEXT_LENGTH;
    const { text: textToCheck, start } = getTextWithContext(
        state,
        from,
        to,
        contextLength
    );

    const escapedMark = escapeRegExp(mark);
    const regex = new RegExp(`(${escapedMark}+)([\\s\\S]*?)\\1`, 'g');

    const markerLength = mark.length;

    const changes = [];
    let match;
    let found = false;

    // 检查是否是加粗转斜体或加粗斜体转加粗的特殊情况
    if (mark === '*') {
        const boldOrBoldItalicRegex = /(\*{2,3})([^*]+)\1/g;
        while ((match = boldOrBoldItalicRegex.exec(textToCheck)) !== null) {
            const matchStart = start + match.index;
            const matchEnd = matchStart + match[0].length;
            if (matchStart <= from && to <= matchEnd) {
                const existingMarkers = match[1];
                if (existingMarkers === '**') {
                    // 加粗转加粗斜体
                    changes.push(
                        {from: matchStart, to: matchStart + 2, insert: '***'},
                        {from: matchEnd - 2, to: matchEnd, insert: '***'}
                    );
                } else if (existingMarkers === '***') {
                    // 加粗斜体转加粗
                    changes.push(
                        {from: matchStart, to: matchStart + 3, insert: '**'},
                        {from: matchEnd - 3, to: matchEnd, insert: '**'}
                    );
                }
                found = true;
                break;
            }
        }
    }

    if (!found) {
        while ((match = regex.exec(textToCheck)) !== null) {
            const fullMarkerLength = match[1].length;
            if (fullMarkerLength % markerLength !== 0) {
                continue;
            }
            const matchStart = start + match.index;
            const matchEnd = matchStart + match[0].length;

            if (matchStart <= from && to <= matchEnd) {
                // Remove one layer of markers
                const removeStart = matchStart;
                const removeEnd = matchEnd;

                changes.push(
                    {from: removeStart, to: removeStart + markerLength, insert: ''},
                    {from: removeEnd - markerLength, to: removeEnd, insert: ''}
                );
                found = true;
                break;
            }
        }
    }

    if (!found) {
        // Check for combined styles
        const combinedRegex = /(\*{1,3}|_{1,3}|~~|==)([^*_~=]+)\1/g;
        while ((match = combinedRegex.exec(textToCheck)) !== null) {
            const matchStart = start + match.index;
            const matchEnd = matchStart + match[0].length;

            if (matchStart <= from && to <= matchEnd) {
                const existingMarkers = match[1];
                if (existingMarkers.includes(mark)) {
                    // Remove the mark from existing markers
                    const newMarkers = existingMarkers.replace(mark, '');
                    changes.push(
                        {from: matchStart, to: matchStart + existingMarkers.length, insert: newMarkers},
                        {from: matchEnd - existingMarkers.length, to: matchEnd, insert: newMarkers}
                    );
                } else {
                    // Add the mark to existing markers
                    changes.push(
                        {from: matchStart, to: matchStart + existingMarkers.length, insert: existingMarkers + mark},
                        {from: matchEnd - existingMarkers.length, to: matchEnd, insert: mark + existingMarkers}
                    );
                }
                found = true;
                break;
            }
        }
    }

    if (!found) {
        // Add markers
        changes.push(
            {from, insert: mark},
            {from: to, insert: mark}
        );
    }

    applyChanges(view, changes);
    return true;
}

/**
 * Checks if a specific heading level is active at cursor position
 * @param state - Editor state
 * @param level - Heading level to check
 * @returns True if the heading level is active
 */
export function isHeaderActive(state: EditorState, level: number): boolean {
    const { from } = state.selection.main;
    const line = state.doc.lineAt(from);
    const headerPrefix = createHeadingPrefix(level);
    return line.text.startsWith(headerPrefix);
}

/**
 * Checks if an inline style marker is active at selection
 * @param state - Editor state
 * @param marker - Markdown marker to check
 * @returns True if the style is active
 */
export function isInlineStyleActive(state: EditorState, marker: string): boolean {
    const { from, to } = state.selection.main;

    // Get text with context
    const contextLength = marker.length * SELECTION.MARKER_CONTEXT_LENGTH;
    const { text: textToCheck, start } = getTextWithContext(
        state,
        from,
        to,
        contextLength
    );

    const escapedMarker = escapeRegExp(marker);

    // 使用更精确的正则表达式来匹配标记
    const regex = new RegExp(`(?<!\\${marker[0]})${escapedMarker}([^${escapedMarker}]+)${escapedMarker}(?!\\${marker[0]})`, 'g');

    let match;
    while ((match = regex.exec(textToCheck)) !== null) {
        const matchStart = start + match.index;
        const matchEnd = matchStart + match[0].length;

        if (matchStart <= from && to <= matchEnd) {
            return true;
        }
    }

    // 处理加粗斜体的情况
    if (marker === '**' || marker === '*') {
        const boldItalicRegex = /\*{3}([^*]+)\*{3}/g;
        while ((match = boldItalicRegex.exec(textToCheck)) !== null) {
            const matchStart = start + match.index;
            const matchEnd = matchStart + match[0].length;

            if (matchStart <= from && to <= matchEnd) {
                return true;
            }
        }
    }

    return false;
}


/**
 * Checks if a list style is active at cursor position
 * @param state - Editor state
 * @param ordered - True to check for ordered list, false for unordered
 * @returns True if the list style is active
 */
export function isListActive(state: EditorState, ordered: boolean): boolean {
    const { from } = state.selection.main;
    const line = state.doc.lineAt(from);

    if (ordered) {
        return extractListNumber(line.text) !== null;
    } else {
        return isUnorderedListItem(line.text);
    }
}

// src/moondown/extensions/bubble-menu/types.ts
import * as icons from "lucide";
import {EditorView} from "@codemirror/view";
import {EditorState} from "@codemirror/state";

export interface BubbleMenuItem {
    name: string;
    icon: keyof typeof icons;
    action?: (view: EditorView) => boolean;
    isActive?: (state: EditorState) => boolean;
    subItems?: BubbleMenuSubItem[];
    type?: 'dropdown' | 'button';
}

export interface BubbleMenuSubItem {
    name: string;
    icon?: keyof typeof icons;
    action: (view: EditorView) => Promise<boolean> | boolean;
    isActive?: (state: EditorState) => boolean;
}


// src/moondown/extensions/bubble-menu/index.ts
import {ViewPlugin} from "@codemirror/view";
import {bubbleMenuField} from "./fields.ts";
import {BubbleMenu} from "./bubble-menu.ts";

const bubbleMenuPlugin = ViewPlugin.fromClass(BubbleMenu);

export function bubbleMenu() {
    return [bubbleMenuField, bubbleMenuPlugin];
}

// src/moondown/extensions/bubble-menu/fields.ts
import {StateEffect, StateField} from "@codemirror/state";
import {type BubbleMenuItem} from "./types.ts";

export const showBubbleMenu = StateEffect.define<{ pos: number, items: BubbleMenuItem[] }>()

export const bubbleMenuField = StateField.define<{ pos: number, items: BubbleMenuItem[] } | null>({
    create: () => null,
    update(value, tr) {
        for (const effect of tr.effects) {
            if (effect.is(showBubbleMenu)) {
                return effect.value
            }
        }
        if (tr.selection) {
            return null
        }
        return value
    }
})


// src/moondown/extensions/underline-parser/underline-parser-extension.ts
import {InlineContext, type MarkdownExtension} from "@lezer/markdown";

export const UnderlineDelim = {resolve: "Underline", mark: "UnderlineMarker"};

export const UnderlineExtension: MarkdownExtension = {
    defineNodes: ["Underline", "UnderlineMarker"],
    parseInline: [
        {
            name: "Underline",
            parse(cx: InlineContext, next: number, pos: number) {
                if (next != 126 /* '~' */) return -1;
                return cx.addDelimiter(UnderlineDelim, pos, pos + 1, true, true);
            },
        },
    ],
};


// src/moondown/extensions/underline-parser/index.ts
import {UnderlineExtension} from "./underline-parser-extension.ts";

export const Underline = UnderlineExtension;

// src/moondown/extensions/mark-parser/index.ts
import {MarkExtension} from "./mark-parser-extension.ts";

export const Mark = MarkExtension;

// src/moondown/extensions/mark-parser/mark-parser-extension.ts
import {InlineContext, type MarkdownExtension} from "@lezer/markdown";

export const MarkDelim = { resolve: "Mark", mark: "MarkMarker" };

export const MarkExtension: MarkdownExtension = {
    defineNodes: ["Mark", "MarkMarker"],
    parseInline: [
        {
            name: "Mark",
            parse(cx: InlineContext, next: number, pos: number) {
                if (next != 61 /* '=' */ || cx.char(pos + 1) != 61) return -1;
                return cx.addDelimiter(MarkDelim, pos, pos + 2, true, true);
            },
        },
    ],
};

// src/moondown/theme/base-theme.ts
import {HighlightStyle, syntaxHighlighting} from "@codemirror/language";
import {tags} from "@lezer/highlight";
import {EditorView} from "@codemirror/view";

// --- Light Theme Colors ---
const light = {
    rose: "#FF69B4",
    lightBlue: "#4299E1",
    purple: "#9F7AEA",
    green: "#48BB78",
    orange: "#ED8936",
    red: "#F56565",
    yellow: "#ECC94B",
    primaryText: "#2D3748",
    secondaryText: "#718096",
    background: "#FFFFFF",
    lineHighlight: "#EDF2F7",
    selection: "#BEE3F8",
    pink: "#ED64A6",
    teal: "#38B2AC",
    indigo: "#667EEA",
    marker: "#718096",
    codeBackground: "#1A202C",
    codeText: "#E2E8F0",
    codeSecondaryText: "#A0AEC0",
    widgetBackground: "#fef7f7",
    blockquoteBorder: "#FF69B4",
    inlineCodeBg: "#EDF2F7",
    slashCommandBg: "#ffffff",
    slashCommandBorder: "#e0e0e0",
    slashCommandHoverBg: "#f0f0f0",
    slashCommandSelectedBg: "#e8e8e8",
    slashCommandText: "#333",
    slashCommandIcon: "#666",
};

// --- Dark Theme Colors ---
const dark = {
    rose: "#FFA7C4",
    lightBlue: "#63B3ED",
    purple: "#B794F4",
    green: "#68D391",
    orange: "#F6AD55",
    red: "#FC8181",
    yellow: "#F6E05E",
    primaryText: "#E2E8F0",
    secondaryText: "#A0AEC0",
    background: "#1A202C",
    lineHighlight: "#2D3748",
    selection: "#4A5568",
    pink: "#FBB6CE",
    teal: "#4FD1C5",
    indigo: "#7F9CF5",
    marker: "#A0AEC0",
    codeBackground: "#2D3748",
    codeText: "#E2E8F0",
    codeSecondaryText: "#A0AEC0",
    widgetBackground: "#2D3748",
    blockquoteBorder: "#FFA7C4",
    inlineCodeBg: "#2D3748",
    slashCommandBg: "#2D3748",
    slashCommandBorder: "#4A5568",
    slashCommandHoverBg: "#4A5568",
    slashCommandSelectedBg: "#718096",
    slashCommandText: "#E2E8F0",
    slashCommandIcon: "#A0AEC0",
};

const codeFont = "'Fira Code', 'Roboto Mono', monospace";

// --- Base Theme Structure (used by both light and dark) ---
const createEditorTheme = (colors: typeof light | typeof dark, isDark: boolean) => {
    const animationName = isDark ? 'colorChangeDark' : 'colorChangeLight';

    return EditorView.theme({
        "&": {
            color: colors.primaryText,
            backgroundColor: colors.background,
        },
        ".cm-content": {
            fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fontSize: "16px",
            lineHeight: "1.6",
        },
        ".cm-line": {
            padding: "0 8px",
        },
        ".cm-cursor": {
            borderLeftColor: colors.lightBlue,
        },
        ".cm-selectionBackground": {
            backgroundColor: colors.selection,
        },
        ".cm-gutters": {
            backgroundColor: colors.background,
            color: colors.secondaryText,
            border: "none",
            borderRight: `1px solid ${colors.lineHighlight}`,
        },
        ".cm-gutterElement": {
            padding: "0 8px 0 16px",
        },
        ".cm-foldGutter": {
            color: colors.secondaryText,
        },
        ".cm-activeLineGutter": {
            backgroundColor: colors.lineHighlight,
        },
        ".cm-activeLine": {
            backgroundColor: colors.lineHighlight,
        },
        ".cm-searchMatch": {
            backgroundColor: colors.yellow,
            outline: `1px solid ${colors.orange}`,
        },
        ".cm-selectionMatch": {
            backgroundColor: colors.selection,
        },
        ".cm-matchingBracket, .cm-nonmatchingBracket": {
            backgroundColor: `${colors.lightBlue}33`,
            outline: `1px solid ${colors.lightBlue}`,
        },

        // Syntax hiding
        ".cm-hidden-markdown": { display: "none" },
        ".cm-visible-markdown": { color: colors.secondaryText, opacity: "0.8" },

        // Horizontal Rule Styling
        ".cm-hr-line": {
            position: "relative",
            margin: "1em 0",
            height: "2px",
            "&::after": {
                content: '""',
                position: "absolute",
                left: "8px",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                height: "2px",
                backgroundColor: colors.secondaryText,
                opacity: 0.5,
                borderRadius: "1px",
            }
        },
        ".cm-hr-line-selected .cm-visible-markdown": { color: colors.secondaryText },

        // Blockquote styling
        ".cm-blockquote-line, .cm-blockquote-line-selected": {
            position: "relative",
            backgroundColor: colors.widgetBackground,
            borderLeft: `4px solid ${colors.blockquoteBorder}`,
            paddingLeft: "16px",
            fontStyle: "italic",
        },

        // Code block styling
        ".cm-fenced-code": {
            backgroundColor: 'transparent',
            position: 'relative',
            color: colors.codeText,
            fontFamily: codeFont,
            padding: "0 12px",
            fontSize: "14px",
            lineHeight: "1.5",
        },
        ".cm-fenced-code::before": {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundColor: colors.codeBackground,
            zIndex: -1,
        },

        // List styling
        ".cm-bullet-list": { color: colors.marker, fontWeight: "bold" },
        ".cm-ordered-list-marker, .cm-ordered-list-marker > span": {
            color: `${colors.primaryText} !important`,
            fontFamily: "inherit !important"
        },

        // Widget styles
        ".cm-inline-code-widget": {
            fontFamily: codeFont,
            background: colors.inlineCodeBg,
            color: colors.primaryText,
            padding: "0 4px",
            margin: "0 4px",
            borderRadius: "3px",
            display: "inline-block",
        },
        ".cm-link-widget": {
            textDecoration: "none",
            color: colors.lightBlue,
            borderBottom: `1px solid ${colors.lightBlue}`,
        },
        '.cm-image-widget': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '1.5em 0',
            position: 'relative',
            transition: 'opacity 0.3s ease',
        },
        '.cm-image-widget img': {
            maxWidth: '100%',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            margin: '0.5em',
            transition: 'box-shadow 0.3s ease',
        },
        '.cm-image-widget .cm-image-alt': {
            marginTop: '0.75em',
            color: colors.secondaryText,
            fontSize: '0.75em',
            fontWeight: '400',
        },
        ".cm-image-widget.selected": {
            outline: "2px solid #e11d48",
            borderRadius: "8px",
        },
        '.cm-image-placeholder': {
            background: colors.lineHighlight,
            border: `2px dashed ${colors.secondaryText}`,
            borderRadius: '12px',
            color: colors.secondaryText,
        },
        ".cm-image-error": {
            padding: '0.75em',
            color: colors.red,
            fontSize: '0.9em',
            background: `${colors.red}20`,
            borderRadius: '8px',
            marginTop: '0.5em',
        },
        ".cm-strikethrough-widget": { textDecoration: "line-through", color: colors.secondaryText },
        ".cm-highlight-widget": { backgroundColor: "#FEFCBF", color: "#5c5400", padding: "2px 4px", borderRadius: "4px" },
        ".cm-underline-widget": { textDecoration: "underline", color: colors.secondaryText },

        // Slash Command
        ".cm-slash-command-menu": {
            position: "absolute",
            zIndex: 100,
            backgroundColor: colors.slashCommandBg,
            border: `1px solid ${colors.slashCommandBorder}`,
            borderRadius: "6px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            padding: "8px 0",
            maxHeight: "300px",
            overflow: "hidden auto",
            fontFamily: "Arial, sans-serif",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
        },
        ".cm-slash-command-item": {
            padding: "8px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            transition: "background-color 0.2s",
            "&:hover": { backgroundColor: colors.slashCommandHoverBg },
            "&.selected": { backgroundColor: colors.slashCommandSelectedBg },
        },
        ".cm-slash-command-icon": {
            marginRight: "12px",
            display: "flex",
            alignItems: "center",
            "& svg": { width: "16px", height: "16px", color: colors.slashCommandIcon },
        },
        ".cm-slash-command-title": { fontSize: "14px", color: colors.slashCommandText },
        ".cm-slash-command-divider": { margin: "8px 0", border: "none", borderTop: `1px solid ${colors.slashCommandBorder}` },

        // AI Ghost Writer
        ".cm-new-text": { animation: `${animationName} 2s forwards` },
        ".cm-loading-widget": {
            display: "inline-flex",
            alignItems: "center",
            padding: "2px 5px",
            backgroundColor: colors.lineHighlight,
            borderRadius: "3px",
            fontSize: "12px",
            color: colors.secondaryText,
        },
        ".cm-loading-spinner": {
            display: "inline-block",
            width: "12px",
            height: "12px",
            marginRight: "5px",
            border: `2px solid ${colors.secondaryText}`,
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
        },

        [`@keyframes ${animationName}`]: {
            "0%, 99%": { color: colors.rose, opacity: 0.7 },
            "100%": { color: colors.primaryText, opacity: 1 },
        },
        "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
        },
    }, {dark: isDark});
}

// --- Syntax Highlighting Styles ---
const createHighlightStyle = (colors: typeof light | typeof dark) => HighlightStyle.define([
    {tag: tags.heading1, fontWeight: "800", fontSize: "2em", color: colors.primaryText},
    {tag: tags.heading2, fontWeight: "700", fontSize: "1.5em", color: colors.primaryText},
    {tag: tags.heading3, fontWeight: "600", fontSize: "1.17em", color: colors.primaryText},
    // ... other heading levels
    {tag: tags.link, color: colors.lightBlue},
    {tag: tags.emphasis, fontStyle: "italic"},
    {tag: tags.strong, fontWeight: "bold"},
    {tag: tags.keyword, color: colors.purple, fontFamily: codeFont},
    {tag: tags.atom, color: colors.pink, fontFamily: codeFont},
    {tag: tags.bool, color: colors.pink, fontFamily: codeFont},
    {tag: tags.url, color: colors.green, fontFamily: codeFont},
    {tag: tags.labelName, color: colors.red, fontFamily: codeFont},
    {tag: tags.inserted, color: colors.green, fontFamily: codeFont},
    {tag: tags.deleted, color: colors.red, fontFamily: codeFont},
    {tag: tags.literal, color: colors.pink, fontFamily: codeFont},
    {tag: tags.string, color: colors.green, fontFamily: codeFont},
    {tag: tags.number, color: colors.pink, fontFamily: codeFont},
    {tag: [tags.regexp, tags.escape, tags.special(tags.string)], color: colors.pink, fontFamily: codeFont},
    {tag: tags.definition(tags.propertyName), color: colors.teal, fontFamily: codeFont},
    {tag: tags.function(tags.variableName), color: colors.indigo, fontFamily: codeFont},
    {tag: tags.typeName, color: colors.yellow, fontFamily: codeFont},
    {tag: tags.className, color: colors.yellow, fontFamily: codeFont},
    {tag: tags.comment, color: colors.secondaryText, fontStyle: "italic", fontFamily: codeFont},
    {tag: tags.meta, color: colors.purple, fontFamily: codeFont},
    {tag: tags.invalid, color: colors.red, fontFamily: codeFont},
    {tag: tags.variableName, color: colors.indigo, fontFamily: codeFont},
    {tag: tags.operator, color: colors.purple, fontFamily: codeFont},
    {tag: tags.punctuation, color: colors.primaryText, fontFamily: codeFont},
    {tag: tags.bracket, color: colors.primaryText, fontFamily: codeFont},
    {tag: tags.tagName, color: colors.red, fontFamily: codeFont},
    {tag: tags.attributeName, color: colors.teal, fontFamily: codeFont},
    {tag: tags.attributeValue, color: colors.green, fontFamily: codeFont},
]);

// --- Export Light Theme ---
export const editorLightTheme = createEditorTheme(light, false);
export const lightHighlightStyle = createHighlightStyle(light);
export const lightTheme = [
    editorLightTheme,
    syntaxHighlighting(lightHighlightStyle)
];

// --- Export Dark Theme ---
export const editorDarkTheme = createEditorTheme(dark, true);
export const darkHighlightStyle = createHighlightStyle(dark);
export const darkTheme = [
    editorDarkTheme,
    syntaxHighlighting(darkHighlightStyle)
];

// src/moondown/ai/completions.ts
import OpenAI from "openai";
import {glmApiKey, glmBaseURL} from "./constants.ts";
import {Stream} from "openai/streaming";

// 定义返回类型
type ChatCompletionResponse = OpenAI.Chat.Completions.ChatCompletion;
type ChatCompletionStreamResponse = Stream<OpenAI.Chat.Completions.ChatCompletionChunk>;

const openai = new OpenAI({
    apiKey: glmApiKey,
    baseURL: glmBaseURL,
    dangerouslyAllowBrowser: true,
});

// 普通聊天完成方法
export const chatCompletion = async (
    systemPrompt: string,
    userPrompt: string,
    signal?: AbortSignal
): Promise<ChatCompletionResponse> => {
    return openai.chat.completions.create(
        {
            model: 'glm-4-flash',
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            stream: false,
        },
        ...(signal ? [{signal}] : [])
    );
};

// 流式聊天完成方法
export const chatCompletionStream = async (
    systemPrompt: string,
    userPrompt: string,
    signal?: AbortSignal
): Promise<ChatCompletionStreamResponse> => {
    return await openai.chat.completions.create(
        {
            model: 'glm-4-flash',
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            stream: true,
        },
        ...(signal ? [{signal}] : [])
    ) as ChatCompletionStreamResponse;
};


// src/moondown/ai/prompts.ts
export const fullGenerationPrompt: string = '你是一个专门从事文本续写任务的AI助手。请基于以下要求编写一篇文章';

export const titleSummaryPrompt: string = '请为以下文档生成一个标题和简短的总结。标题使用"# "来标定，总结使用"> "来标定：\n\n';
export const outlinePrompt: string = '请为以下文档生成一个详细的大纲：\n\n';
export const rewritePrompt: string = '请改写以下内容，使其更加专业和流畅：\n\n';
export const translatePrompt: string = '请将以下内容翻译成英文：\n\n';

export const completionPrompt: string = '你是一个专门从事文本续写任务的AI助手。' +
    '每次用户会给你提供一段包含前缀(prefix)、填充标记({FILL_ME})和后缀(suffix)的文本。' +
    '其中prefix和suffix之间使用{FILL_ME}分隔。' +
    '你的任务是分析prefix和suffix的上下文语义,然后在{FILL_ME}的位置续写一段话,使整段文本前后连贯、语义完整。' +
    '在续写时,请注意以下几点:' +
    '作为一个小模型,你的智能水平有限。请写出简单明了的句子,不要使用太复杂的词汇和语法。' +
    '认真阅读prefix和suffix,理解上下文的中心思想、情感基调、因果逻辑等,然后再动笔续写。' +
    '在{FILL_ME}处续写一段话，字数在200字左右。如果上下文信息非常少,也请尽最大努力完成续写。' +
    '续写时避免重复prefix或suffix中已经出现过的内容。根据上下文的线索,顺着文意继续往下写。' +
    '你是续写助手,不是对话助手。不需要提问、反问或给用户任何提示,专注于文本续写即可。' +
    '在续写时,先提炼prefix和suffix的核心意思,再合理展开,把控续写方向。要考虑话题主旨、情感态度、逻辑关系、背景知识、文体风格等因素。' +
    '分析{prefix}和{suffix}的语义时,先总结中心思想,然后围绕中心思想展开联想。你可以运用以下思路:' +
    '1. 上下文在表达什么信息,话题是什么' +
    '2. 上下文体现出什么情绪、语气和态度' +
    '3. 上下文存在什么因果逻辑,前因后果是什么' +
    '4. 有什么相关的背景知识可以用来续写' +
    '5. 上下文的文体风格是什么,要续写匹配的风格' +
    '组织语言时,先在脑海中提炼要表达的核心意思,然后再用精炼流畅的语言写出{FILL_ME}处的句子。力求简洁。' +
    '检查续写的句子是否通顺连贯,避免语病。同时要符合情理,不要牵强附会。' +
    '检查续写部分是否与上下文衔接自然,是否存在语病或逻辑问题。' +
    '最后请记住,你只是续写文本,而不是在与人对话,不要出现任何交互感。' +
    '请只输出{FILL_ME}位置续写的内容,不要重复prefix和suffix的文本。续写内容要在语义、语法、逻辑上与前后文无缝衔接。' +
    '现在，请阅读并深入理解下面这句话中的前置文本(prefix)和后置文本(suffix)，并在({FILL_ME})处进行续写:'

export const copilotPrompt: string = '你是一个续写助手,专门负责根据给定的上下文,往下继续写一句话,以延续文章或段落的内容。请严格按照以下规则进行续写:' +
    '1. 无论上下文有多长或多短,你都必须给出续写结果。即使只有一两句话的上下文,也请尽力理解其意图,然后续写一句话。不要提示用户输入更多信息,因为你不是在和用户对话。' +
    '2. 每次续写只能写一个词语或者一个短句。不要多写，也不要写太多字。' +
    '3. 续写时无需重复上下文的内容,直接沿着上文的意思往下写即可。' +
    '4. 你是个续写助手,不是聊天助手,所以绝对不要和用户产生任何对话感。不要提示、引导或询问用户,也不要给用户任何建议或指示。你的任务就是单纯地根据上下文续写内容,不要考虑别的。' +
    '5. 分析上下文时,重点关注其意图、文体、语气、视角等,然后模仿这些要素去续写,保持前后连贯。可以想象你正在跟着作者的思路继续写作。' +
    '6. 如果实在无法根据上下文进行续写,那么也不要让用户知道你无能为力,更不要向用户求助。此时你可以发挥想象力,自己编写一句合理的内容。但这个内容必须与上下文相关,不能完全脱离主题。';

// src/moondown/ai/constants.ts
export const glmApiKey = '42fb0c232a31eb7a22174943ffa5dd35.oD4rQDSo6KY4bA8T';
export const glmBaseURL = "https://open.bigmodel.cn/api/paas/v4/";

// src/components/MoondownWrapper.tsx
import React, { useRef, useEffect } from 'react';
import Moondown from '../moondown/moondown'; // 直接从我们创建的目录导入

interface MoondownWrapperProps {
    initialValue?: string;
    onReady: (instance: Moondown) => void;
}

const MoondownWrapper: React.FC<MoondownWrapperProps> = ({ initialValue = '', onReady }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInitialized = useRef(false);

    useEffect(() => {
        let editorInstance: Moondown | null = null;

        if (containerRef.current && !isInitialized.current) {
            // 初始化 Moondown 编辑器
            editorInstance = new Moondown(containerRef.current, initialValue);

            // 通过回调将实例传递给父组件
            onReady(editorInstance);

            isInitialized.current = true;
        }

        // 组件卸载时销毁编辑器实例，防止内存泄漏
        return () => {
            if (editorInstance) {
                editorInstance.destroy();
                isInitialized.current = false;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 空依赖数组确保 effect 只运行一次

    return <div ref={containerRef} className="border rounded-md shadow-sm min-h-[300px] w-full" />;
};

export default MoondownWrapper;

