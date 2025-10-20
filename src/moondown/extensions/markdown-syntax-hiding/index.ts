// src/moondown/extensions/markdown-syntax-hiding/index.ts
import {markdownSyntaxHidingField, syntaxHidingState} from './markdown-syntax-hiding-field';
import {highlightCleanupPlugin, referenceHighlightField} from "./node-handlers.ts";

export function markdownSyntaxHiding() {
    return [
        syntaxHidingState,
        markdownSyntaxHidingField,
        referenceHighlightField,
        highlightCleanupPlugin
    ];
}