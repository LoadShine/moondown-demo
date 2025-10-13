// src/moondown-editor/extensions/markdown-syntax-hiding/markdown-syntax-hiding-field.ts
import {StateField, EditorState, StateEffect} from '@codemirror/state';
import {EditorView, Decoration, type DecorationSet} from '@codemirror/view';
import {syntaxTree} from '@codemirror/language';

// --- (新增) ---
// Effect to toggle the syntax hiding feature
export const toggleSyntaxHidingEffect = StateEffect.define<boolean>();

// StateField to hold the current state of the syntax hiding feature
export const syntaxHidingState = StateField.define<boolean>({
    create: () => true, // Default to true (hiding is enabled)
    update(value, tr) {
        for (const e of tr.effects) {
            if (e.is(toggleSyntaxHidingEffect)) {
                return e.value;
            }
        }
        return value;
    },
});
// --- (结束新增) ---


const hiddenMarkdown = Decoration.mark({class: 'cm-hidden-markdown'});
const visibleMarkdown = Decoration.mark({class: 'cm-visible-markdown'});
const orderedListMarker = Decoration.mark({class: 'cm-ordered-list-marker'}); // <<<--- This decoration is correct

// Line decorations for styling
const blockquoteLine = Decoration.line({class: 'cm-blockquote-line'});
const blockquoteLineSelected = Decoration.line({class: 'cm-blockquote-line-selected'});
const fencedCodeLine = Decoration.line({class: 'cm-fenced-code-line'});
const fencedCodeLineSelected = Decoration.line({class: 'cm-fenced-code-line-selected'});
// New line decorations for HorizontalRule
const hrLine = Decoration.line({ class: 'cm-hr-line' });
const hrLineSelected = Decoration.line({ class: 'cm-hr-line-selected' });


export const markdownSyntaxHidingField = StateField.define<DecorationSet>({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create(_: EditorState) {
        return Decoration.none;
    },
    update(_oldDecorations, transaction) {
        const decorations: {from: number, to: number, decoration: Decoration}[] = [];
        const {state} = transaction;
        const selection = state.selection.main;

        // --- (修改) ---
        // Get the current hiding state from our new StateField
        const isHidingEnabled = state.field(syntaxHidingState);
        // --- (结束修改) ---

        syntaxTree(state).iterate({
            enter: (node) => {
                const start = node.from;
                const end = node.to;
                const isSelected = selection.from <= end && selection.to >= start;

                if (node.type.name === 'FencedCode') {
                    const fencedCodeStart = state.doc.lineAt(start);
                    const fencedCodeEnd = state.doc.lineAt(end);
                    const languageMatch = fencedCodeStart.text.match(/^```(\w+)?/);
                    const language = languageMatch ? (languageMatch[1] || '') : '';

                    // Add line decorations for all lines in the code block
                    for (let lineNum = fencedCodeStart.number; lineNum <= fencedCodeEnd.number; lineNum++) {
                        const line = state.doc.line(lineNum);
                        decorations.push({
                            from: line.from,
                            to: line.from,
                            decoration: isSelected ? fencedCodeLineSelected : fencedCodeLine
                        });
                    }

                    // --- (修改) ---
                    // Hide only if not selected AND hiding is enabled
                    if (!isSelected && isHidingEnabled) {
                        // --- (结束修改) ---
                        // Hide opening fence
                        const openingEnd = fencedCodeStart.from + 3 + language.length;
                        decorations.push({
                            from: fencedCodeStart.from,
                            to: openingEnd,
                            decoration: hiddenMarkdown
                        });
                        // Hide closing fence
                        decorations.push({
                            from: fencedCodeEnd.to - 3,
                            to: fencedCodeEnd.to,
                            decoration: hiddenMarkdown
                        });
                    } else {
                        // Show fence markers with special styling
                        const openingEnd = fencedCodeStart.from + 3 + language.length;
                        decorations.push({
                            from: fencedCodeStart.from,
                            to: openingEnd,
                            decoration: visibleMarkdown
                        });
                        decorations.push({
                            from: fencedCodeEnd.to - 3,
                            to: fencedCodeEnd.to,
                            decoration: visibleMarkdown
                        });
                    }
                } else if (node.type.name === 'Blockquote') {
                    const blockquoteStart = state.doc.lineAt(start);
                    const blockquoteEnd = state.doc.lineAt(end);

                    // Add line decorations for all lines in the blockquote
                    for (let lineNum = blockquoteStart.number; lineNum <= blockquoteEnd.number; lineNum++) {
                        const line = state.doc.line(lineNum);
                        decorations.push({
                            from: line.from,
                            to: line.from,
                            decoration: isSelected ? blockquoteLineSelected : blockquoteLine
                        });
                    }

                    // Handle > markers for each line
                    for (let pos = start; pos <= end;) {
                        const line = state.doc.lineAt(pos);
                        const lineText = line.text;
                        const match = lineText.match(/^(\s*>\s?)/);
                        if (match) {
                            const quoteCharPos = line.from + match[1].indexOf('>');
                            // --- (修改) ---
                            const decorationType = (isSelected || !isHidingEnabled) ? visibleMarkdown : hiddenMarkdown;
                            // --- (结束修改) ---

                            // Hide or show the > marker
                            decorations.push({
                                from: quoteCharPos,
                                to: quoteCharPos + 1,
                                decoration: decorationType
                            });
                        }
                        pos = line.to + 1;
                        if (pos > end) break;
                    }
                } else if (node.type.name === 'HorizontalRule') {
                    const line = state.doc.lineAt(start);
                    // --- (修改) ---
                    if (isSelected || !isHidingEnabled) {
                        // --- (结束修改) ---
                        // When selected, show the raw '---' text with visible styling
                        decorations.push({
                            from: line.from,
                            to: line.from,
                            decoration: hrLineSelected
                        });
                        decorations.push({
                            from: start,
                            to: end,
                            decoration: visibleMarkdown
                        });
                    } else {
                        // When not selected, apply the line style that draws the HR
                        // and hide the raw '---' text.
                        decorations.push({
                            from: line.from,
                            to: line.from,
                            decoration: hrLine
                        });
                        decorations.push({
                            from: start,
                            to: end,
                            decoration: hiddenMarkdown
                        });
                    }
                } else if (node.type.name === 'ListItem') { // <<<--- Logic for list items
                    // Find the marker for the list item
                    const listMarkNode = node.node.getChild('ListMark');
                    if (listMarkNode) {
                        const markText = state.doc.sliceString(listMarkNode.from, listMarkNode.to);
                        // Check if it's an ordered list by seeing if the marker contains a digit
                        if (/\d/.test(markText)) {
                            decorations.push({
                                from: listMarkNode.from,
                                to: listMarkNode.to,
                                decoration: orderedListMarker
                            });
                        }
                    }
                } else if (['Emphasis', 'StrongEmphasis', 'InlineCode', 'Strikethrough', 'Mark'].includes(node.type.name)) {
                    // --- (修改) ---
                    const decorationType = (isSelected || !isHidingEnabled) ? visibleMarkdown : hiddenMarkdown;
                    // --- (结束修改) ---

                    if (node.type.name === 'StrongEmphasis') {
                        decorations.push({
                            from: start,
                            to: start + 2,
                            decoration: decorationType
                        });
                        decorations.push({
                            from: end - 2,
                            to: end,
                            decoration: decorationType
                        });
                    } else if (node.type.name === 'InlineCode') {
                        decorations.push({
                            from: start,
                            to: start + 1,
                            decoration: decorationType
                        });
                        decorations.push({
                            from: end - 1,
                            to: end,
                            decoration: decorationType
                        });
                    } else if (node.type.name === 'Strikethrough' || node.type.name === 'Mark') {
                        decorations.push({
                            from: start,
                            to: start + 2,
                            decoration: decorationType
                        });
                        decorations.push({
                            from: end - 2,
                            to: end,
                            decoration: decorationType
                        });
                    } else {
                        decorations.push({
                            from: start,
                            to: start + 1,
                            decoration: decorationType
                        });
                        decorations.push({
                            from: end - 1,
                            to: end,
                            decoration: decorationType
                        });
                    }
                } else if (node.type.name.startsWith('ATXHeading')) {
                    const headerLevel = parseInt(node.type.name.slice(-1));
                    // --- (修改) ---
                    const decorationType = (isSelected || !isHidingEnabled) ? visibleMarkdown : hiddenMarkdown;
                    // --- (结束修改) ---
                    decorations.push({
                        from: start,
                        to: start + headerLevel + 1,
                        decoration: decorationType
                    });
                } else if (node.type.name === 'Link') {
                    const linkText = state.doc.sliceString(start, end);
                    const linkMatch = linkText.match(/\[([^\]]*)\]\(([^)]+)\)/);
                    if (linkMatch) {
                        // --- (修改) ---
                        const decorationType = (isSelected || !isHidingEnabled) ? visibleMarkdown : hiddenMarkdown;
                        // --- (结束修改) ---
                        const linkStart = start + linkText.indexOf('[');
                        const linkEnd = start + linkText.indexOf(']') + 1;
                        decorations.push({
                            from: linkStart,
                            to: linkEnd,
                            decoration: decorationType
                        });
                        const urlStart = start + linkText.indexOf('(');
                        const urlEnd = start + linkText.indexOf(')') + 1;
                        decorations.push({
                            from: urlStart,
                            to: urlEnd,
                            decoration: decorationType
                        });
                    }
                } else if (node.type.name === 'Image') {
                    const imageText = state.doc.sliceString(start, end);
                    const imageMatch = imageText.match(/!\[([^\]]*)\]\(([^)]+)\)/);
                    if (imageMatch) {
                        // --- (修改) ---
                        const decorationType = (isSelected || !isHidingEnabled) ? visibleMarkdown : hiddenMarkdown;
                        // --- (结束修改) ---
                        const alt = imageMatch[1];
                        decorations.push({
                            from: start,
                            to: start + 2,
                            decoration: decorationType
                        }); // Hide '!['
                        decorations.push({
                            from: start + 2 + alt.length,
                            to: end,
                            decoration: decorationType
                        }); // Hide '](...)'
                    }
                }
            },
        });

        // Sort decorations by position and startSide
        decorations.sort((a, b) => {
            if (a.from !== b.from) return a.from - b.from;
            // Line decorations should come first (they have a lower startSide)
            const aStartSide = a.decoration.spec.startSide || 0;
            const bStartSide = b.decoration.spec.startSide || 0;
            return aStartSide - bStartSide;
        });

        return Decoration.set(decorations.map(({from, to, decoration}) => decoration.range(from, to)));
    },
    provide: (f) => EditorView.decorations.from(f),
});