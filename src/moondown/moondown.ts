// src/moondown/moondown.ts
import {EditorState} from '@codemirror/state';
import {EditorView} from '@codemirror/view';
import {defaultExtensions, themeCompartment} from "./extensions/default-extensions.ts";
import { toggleSyntaxHidingEffect } from "./extensions/markdown-syntax-hiding/markdown-syntax-hiding-field.ts";
import { darkTheme, lightTheme } from "./theme/base-theme.ts";

class Moondown {
    private view: EditorView;

    constructor(element: HTMLElement, initialDoc: string = '') {
        const state = EditorState.create({
            doc: initialDoc,
            extensions: [...defaultExtensions]
        });

        this.view = new EditorView({
            state,
            parent: element,
        });
    }

    getValue(): string {
        return this.view.state.doc.toString();
    }

    setValue(value: string): void {
        this.view.dispatch({
            changes: {from: 0, to: this.view.state.doc.length, insert: value},
        });
    }

    toggleSyntaxHiding(enabled: boolean): void {
        this.view.dispatch({
            effects: toggleSyntaxHidingEffect.of(enabled)
        });
    }

    /**
     * Sets the editor theme to light or dark.
     * @param {'light' | 'dark'} theme - The theme to apply.
     */
    setTheme(theme: 'light' | 'dark'): void {
        this.view.dispatch({
            effects: themeCompartment.reconfigure(theme === 'dark' ? darkTheme : lightTheme)
        });
    }

    destroy(): void {
        this.view.destroy();
    }
}

export default Moondown;