// src/moondown/moondown.ts
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { defaultExtensions, themeCompartment } from "./extensions/default-extensions";
import { toggleSyntaxHidingEffect } from "./extensions/markdown-syntax-hiding/markdown-syntax-hiding-field";
import { darkTheme, lightTheme } from "./theme/base-theme";
import type { EditorConfig, Theme } from "./core/types/editor-types";

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