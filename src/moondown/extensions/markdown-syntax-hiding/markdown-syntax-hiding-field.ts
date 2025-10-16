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