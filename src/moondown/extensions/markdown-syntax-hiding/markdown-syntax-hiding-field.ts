// src/moondown/extensions/markdown-syntax-hiding/markdown-syntax-hiding-field.ts
import {StateField, EditorState, StateEffect} from '@codemirror/state';
import {EditorView, Decoration, type DecorationSet, WidgetType} from '@codemirror/view';
import {syntaxTree} from '@codemirror/language';
import {LinkWidget} from "./link-widget.ts";

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

        // Get the current hiding state from our new StateField
        const isHidingEnabled = state.field(syntaxHidingState);

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

                    if (!isSelected && isHidingEnabled) {
                        const openingEnd = fencedCodeStart.from + 3 + language.length;
                        decorations.push({
                            from: fencedCodeStart.from,
                            to: openingEnd,
                            decoration: hiddenMarkdown
                        });
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
                } else if (node.type.name === 'ListItem') {
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
                } else if (['Emphasis', 'StrongEmphasis'].includes(node.type.name)) {
                    const decorationType = (isSelected || !isHidingEnabled) ? visibleMarkdown : hiddenMarkdown;
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
                } else if (node.type.name === 'InlineCode') {
                    if (!isSelected) {
                        const inlineCodeContent = state.doc.sliceString(start, end);
                        const replacement = Decoration.replace({
                            widget: new class extends WidgetType {
                                toDOM() {
                                    const span = document.createElement("span");
                                    span.className = "cm-inline-code-widget";
                                    span.textContent = inlineCodeContent.slice(1, -1); // Remove backticks
                                    return span;
                                }

                                eq(other: this) {
                                    return other.toDOM().textContent === this.toDOM().textContent;
                                }

                                ignoreEvent() {
                                    return false;
                                }
                            }
                        });
                        decorations.push({from: start, to: end, decoration: replacement});
                    } else {
                        const decorationType = (isSelected || !isHidingEnabled) ? visibleMarkdown : hiddenMarkdown;
                        decorations.push({from: start, to: start + 1, decoration: decorationType});
                        decorations.push({from: end - 1, to: end, decoration: decorationType});
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
                    const decorationType = (isSelected || !isHidingEnabled) ? visibleMarkdown : hiddenMarkdown;
                    const linkText = state.doc.sliceString(start, end);
                    const linkMatch = linkText.match(/\[([^\]]+)\]\(([^)]+)\)/);
                    if (linkMatch) {
                        const displayText = linkMatch[1] || linkMatch[2];
                        if (!isSelected) {
                            const replacement = Decoration.replace({
                                widget: new LinkWidget(displayText, linkText, start),
                                inclusive: true
                            });
                            decorations.push({from: start, to: end, decoration: replacement});
                        } else {
                            const linkStart = start + linkText.indexOf('[');
                            const linkEnd = start + linkText.indexOf(']') + 1;
                            decorations.push({from: linkStart, to: linkEnd, decoration: decorationType});
                            const urlStart = start + linkText.indexOf('(');
                            const urlEnd = start + linkText.indexOf(')') + 1;
                            decorations.push({from: urlStart, to: urlEnd, decoration: decorationType});
                        }
                    }
                } else if (node.type.name === 'Strikethrough') {
                    if (!isSelected) {
                        const strikethroughContent = state.doc.sliceString(start + 2, end - 2);
                        const replacement = Decoration.replace({
                            widget: new class extends WidgetType {
                                toDOM() {
                                    const span = document.createElement("span");
                                    span.className = "cm-strikethrough-widget";
                                    span.textContent = strikethroughContent;
                                    return span;
                                }

                                eq(other: this) {
                                    return other.toDOM().textContent === this.toDOM().textContent;
                                }

                                ignoreEvent() {
                                    return false;
                                }
                            }
                        });
                        decorations.push({from: start, to: end, decoration: replacement});
                    } else {
                        const decorationType = (isSelected || !isHidingEnabled) ? visibleMarkdown : hiddenMarkdown;
                        decorations.push({from: start, to: start + 2, decoration: decorationType});
                        decorations.push({from: end - 2, to: end, decoration: decorationType});
                    }
                } else if (node.type.name === 'Mark') {
                    if (!isSelected) {
                        const highlightContent = state.doc.sliceString(start + 2, end - 2);
                        const replacement = Decoration.replace({
                            widget: new class extends WidgetType {
                                toDOM() {
                                    const span = document.createElement("span");
                                    span.className = "cm-highlight-widget";
                                    span.textContent = highlightContent;
                                    return span;
                                }

                                eq(other: this) {
                                    return other.toDOM().textContent === this.toDOM().textContent;
                                }

                                ignoreEvent() {
                                    return false;
                                }
                            }
                        });
                        decorations.push({from: start, to: end, decoration: replacement});
                    } else {
                        const decorationType = (isSelected || !isHidingEnabled) ? visibleMarkdown : hiddenMarkdown;
                        decorations.push({from: start, to: start + 2, decoration: decorationType});
                        decorations.push({from: end - 2, to: end, decoration: decorationType});
                    }
                } else if (node.type.name === 'Underline') {
                    if (!isSelected) {
                        const underlineContent = state.doc.sliceString(start + 1, end - 1);
                        const replacement = Decoration.replace({
                            widget: new class extends WidgetType {
                                toDOM() {
                                    const span = document.createElement("span");
                                    span.className = "cm-underline-widget";
                                    span.textContent = underlineContent;
                                    return span;
                                }

                                eq(other: this) {
                                    return other.toDOM().textContent === this.toDOM().textContent;
                                }

                                ignoreEvent() {
                                    return false;
                                }
                            }
                        });
                        decorations.push({from: start, to: end, decoration: replacement});
                    } else {
                        const decorationType = (isSelected || !isHidingEnabled) ? visibleMarkdown : hiddenMarkdown;
                        decorations.push({from: start, to: start + 1, decoration: decorationType});
                        decorations.push({from: end - 1, to: end, decoration: decorationType});
                    }
                } else if (node.type.name === 'Image') {
                    const imageText = state.doc.sliceString(start, end);
                    const imageMatch = imageText.match(/!\[([^\]]*)\]\(([^)]+)\)/);
                    if (imageMatch) {
                        const decorationType = (isSelected || !isHidingEnabled) ? visibleMarkdown : hiddenMarkdown;
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