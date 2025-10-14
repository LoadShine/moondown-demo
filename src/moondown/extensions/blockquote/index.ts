// src/moondown/extensions/blockquote/index.ts
import { blockquoteKeymapExtension } from './keymaps.ts';

export function blockquote() {
    return [
        blockquoteKeymapExtension
    ]
}