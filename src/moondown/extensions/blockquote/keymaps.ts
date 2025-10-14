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