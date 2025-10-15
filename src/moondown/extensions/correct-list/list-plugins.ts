// src/moondown/extensions/correct-list/list-plugins.ts
import { Decoration, type DecorationSet, EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { updateListEffect } from "./update-list-effect";
import { updateLists } from "./list-functions";
import { RangeSetBuilder } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { BulletWidget } from "./bullet-widget";
import { LIST_INDENT, LIST_PATTERNS } from "./constants";

/**
 * Maximum number of bullet styles to cycle through
 */
const BULLET_STYLE_COUNT = 3;

/**
 * Plugin to handle automatic list number updates
 * Listens to document changes and updates list numbering when needed
 */
export const updateListPlugin = EditorView.updateListener.of((update) => {
    // Check if there's a manual update trigger
    let hasManualUpdate = false;
    for (const tr of update.transactions) {
        for (const e of tr.effects) {
            if (e.is(updateListEffect)) {
                hasManualUpdate = true;
                updateLists(update.view);
                return; // If manual update exists, return early
            }
        }
    }

    // If no manual update but document changed, check if auto-update is needed
    if (!hasManualUpdate && update.docChanged) {
        let needsUpdate = false;

        // Check if changes might affect list numbering
        for (const tr of update.transactions) {
            tr.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
                const deletedText = update.startState.doc.sliceString(fromA, toA);
                const insertedText = inserted.toString();

                /**
                 * Check if text contains list markers
                 */
                const hasListMarker = (text: string) => {
                    return LIST_PATTERNS.ANY.test(text) ||
                        new RegExp('\n' + LIST_PATTERNS.ANY.source.slice(1)).test(text);
                };

                if (hasListMarker(deletedText) || hasListMarker(insertedText)) {
                    needsUpdate = true;
                    return;
                }

                // Check if lines around the change contain lists
                const doc = update.state.doc;
                try {
                    const fromLine = Math.max(1, doc.lineAt(Math.max(0, fromB - 1)).number - 1);
                    const toLine = Math.min(doc.lines, doc.lineAt(Math.min(toB + 1, doc.length)).number + 1);

                    for (let lineNum = fromLine; lineNum <= toLine; lineNum++) {
                        const line = doc.line(lineNum);
                        if (LIST_PATTERNS.ANY.test(line.text)) {
                            needsUpdate = true;
                            return;
                        }
                    }
                } catch (e) {
                    // If error accessing lines, trigger update for safety
                    needsUpdate = true;
                }
            });

            if (needsUpdate) break;
        }

        if (needsUpdate) {
            updateLists(update.view);
        }
    }
});

/**
 * Plugin to replace bullet markers with styled decorations
 * Provides visual variety for different indentation levels
 */
export const bulletListPlugin = ViewPlugin.fromClass(class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
        this.decorations = this.buildDecorations(view);
    }

    update(update: ViewUpdate) {
        if (update.docChanged || update.viewportChanged || update.selectionSet) {
            this.decorations = this.buildDecorations(update.view);
        }
    }

    buildDecorations(view: EditorView) {
        const builder = new RangeSetBuilder<Decoration>();
        const decorations: Array<{ from: number; to: number; decoration: Decoration }> = [];

        for (const { from, to } of view.visibleRanges) {
            syntaxTree(view.state).iterate({
                from,
                to,
                enter: (node) => {
                    if (node.name.includes('ListItem')) {
                        const line = view.state.doc.lineAt(node.from);
                        const unorderedMatch = line.text.match(/^(\s*)([-*+])\s/);

                        if (unorderedMatch) {
                            const indentation = unorderedMatch[1] || '';
                            const indentLevel = Math.floor(indentation.length / LIST_INDENT.SIZE);
                            const levelClass = `cm-bullet-list-l${indentLevel % BULLET_STYLE_COUNT}`;

                            const bulletStart = line.from + (unorderedMatch.index || 0);
                            const bulletEnd = bulletStart + unorderedMatch[0].length;

                            // Add widget decoration for custom bullet
                            decorations.push({
                                from: bulletStart,
                                to: bulletStart,
                                decoration: Decoration.widget({
                                    widget: new BulletWidget(levelClass, indentLevel, indentation),
                                    side: 1
                                })
                            });

                            // Hide original markdown bullet
                            decorations.push({
                                from: bulletStart,
                                to: bulletEnd,
                                decoration: Decoration.replace({})
                            });
                        }
                    }
                }
            });
        }

        // Sort decorations by position
        decorations.sort((a, b) => {
            if (a.from !== b.from) return a.from - b.from;
            // Widget decorations should come before replace decorations
            const aIsWidget = a.decoration.spec.widget !== undefined;
            const bIsWidget = b.decoration.spec.widget !== undefined;
            if (aIsWidget && !bIsWidget) return -1;
            if (!aIsWidget && bIsWidget) return 1;
            return 0;
        });

        // Add to builder
        decorations.forEach(({ from, to, decoration }) => {
            builder.add(from, to, decoration);
        });

        return builder.finish();
    }
}, {
    decorations: v => v.decorations,
});