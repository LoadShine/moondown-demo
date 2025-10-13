// src/moondown-editor/extensions/markdown-syntax-hiding/index.ts
import {markdownSyntaxHidingField, syntaxHidingState} from './markdown-syntax-hiding-field';

export function markdownSyntaxHiding() {
    return [
        syntaxHidingState,
        markdownSyntaxHidingField
    ];
}