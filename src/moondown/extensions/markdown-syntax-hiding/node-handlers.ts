// src/moondown/extensions/markdown-syntax-hiding/node-handlers.ts
import { EditorState, type SelectionRange } from '@codemirror/state';
import { Decoration } from '@codemirror/view';
import { LinkWidget } from "./link-widget";
import { InlineCodeWidget, StrikethroughWidget, HighlightWidget, UnderlineWidget } from "./widgets";
import { CSS_CLASSES } from "../../core";

/**
 * Decoration types with explicit startSide values
 */
const hiddenMarkdown = Decoration.mark({ class: CSS_CLASSES.HIDDEN_MARKDOWN });
const visibleMarkdown = Decoration.mark({ class: CSS_CLASSES.VISIBLE_MARKDOWN });
const orderedListMarker = Decoration.mark({ class: 'cm-ordered-list-marker' });

// Line decorations with explicit startSide to avoid conflicts
const blockquoteLine = Decoration.line({
    class: 'cm-blockquote-line',
    attributes: { 'data-blockquote': 'true' }
});
const blockquoteLineSelected = Decoration.line({
    class: 'cm-blockquote-line-selected',
    attributes: { 'data-blockquote-selected': 'true' }
});
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

    if (isSelected || !isHidingEnabled) {
        // When selected or hiding disabled, show everything
        return decorations;
    }

    const fencedCodeStart = state.doc.lineAt(start);
    const fencedCodeEnd = state.doc.lineAt(end);

    // Check if this is a multi-line code block
    if (fencedCodeStart.number === fencedCodeEnd.number) {
        return decorations;
    }

    // Match opening fence: optional whitespace + optional blockquote marker + backticks + optional language
    const openingMatch = fencedCodeStart.text.match(/^(\s*(?:>\s*)?)(```+)(\w*)/);

    if (openingMatch) {
        const prefix = openingMatch[1]; // whitespace or blockquote markers
        const backticks = openingMatch[2];
        const language = openingMatch[3];

        // Hide from after prefix to end of line
        const hideStart = fencedCodeStart.from + prefix.length;
        const hideEnd = hideStart + backticks.length + language.length;

        decorations.push({
            from: hideStart,
            to: hideEnd,
            decoration: hiddenMarkdown
        });
    }

    // Match closing fence
    const closingMatch = fencedCodeEnd.text.match(/^(\s*(?:>\s*)?)(```+)/);
    if (closingMatch) {
        const prefix = closingMatch[1];
        const backticks = closingMatch[2];

        const hideStart = fencedCodeEnd.from + prefix.length;
        const hideEnd = hideStart + backticks.length;

        decorations.push({
            from: hideStart,
            to: hideEnd,
            decoration: hiddenMarkdown
        });
    }

    return decorations;
}

/**
 * Handles Blockquote nodes
 */
export function handleBlockquote(ctx: HandlerContext): DecorationItem[] {
    const { state, isSelected, isHidingEnabled, start, end } = ctx;

    const blockquoteStart = state.doc.lineAt(start);
    const blockquoteEnd = state.doc.lineAt(end);

    // Collect all decorations first
    const lineDecorations: DecorationItem[] = [];
    const markerDecorations: DecorationItem[] = [];

    // Add line decorations
    for (let lineNum = blockquoteStart.number; lineNum <= blockquoteEnd.number; lineNum++) {
        const line = state.doc.line(lineNum);
        lineDecorations.push({
            from: line.from,
            to: line.from,
            decoration: isSelected ? blockquoteLineSelected : blockquoteLine
        });
    }

    // Handle > markers - process each line
    for (let lineNum = blockquoteStart.number; lineNum <= blockquoteEnd.number; lineNum++) {
        const line = state.doc.line(lineNum);
        const lineText = line.text;

        // Find all > markers in this line (for nested blockquotes)
        let searchPos = 0;
        while (searchPos < lineText.length) {
            const remainingText = lineText.slice(searchPos);
            const match = remainingText.match(/^(\s*)>([\s]?)/);

            if (match) {
                const quoteCharPos = line.from + searchPos + match[1].length;
                const decorationType = getDecorationType(isSelected, isHidingEnabled);

                markerDecorations.push({
                    from: quoteCharPos,
                    to: quoteCharPos + 1,
                    decoration: decorationType
                });

                // Move past this marker and any following space
                searchPos += match[0].length;
            } else {
                // No more > markers on this line
                break;
            }
        }
    }

    // Return in correct order: line decorations first, then markers
    return [...lineDecorations, ...markerDecorations];
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