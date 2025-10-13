// src/moondown-editor/moondown.ts
import {EditorState} from '@codemirror/state';
import {EditorView} from '@codemirror/view';
import {defaultExtensions} from "./extensions/default-extensions.ts";
import { toggleSyntaxHidingEffect } from "./extensions/markdown-syntax-hiding/markdown-syntax-hiding-field.ts";

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

    // --- (新增方法) ---
    /**
     * Toggles the visibility of Markdown syntax markers.
     * @param {boolean} enabled - If true, syntax will be hidden (default behavior). If false, it will be shown.
     */
    toggleSyntaxHiding(enabled: boolean): void {
        this.view.dispatch({
            effects: toggleSyntaxHidingEffect.of(enabled)
        });
    }
    // --- (结束新增) ---

    destroy(): void {
        this.view.destroy();
    }
}

export default Moondown;