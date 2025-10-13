// src/extensions/correct-list/list-plugins.ts
import { Decoration, type DecorationSet, EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { updateListEffect } from "./update-list-effect.ts";
import { updateLists } from "./list-functions.ts";
import { RangeSetBuilder } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { BulletWidget } from "./bullet-widget.ts";

export const updateListPlugin = EditorView.updateListener.of((update) => {
    // 检查是否有手动触发的updateListEffect
    let hasManualUpdate = false;
    for (const tr of update.transactions) {
        for (const e of tr.effects) {
            if (e.is(updateListEffect)) {
                hasManualUpdate = true;
                updateLists(update.view);
                return; // 如果有手动更新，直接返回，不需要自动检测
            }
        }
    }

    // 如果没有手动触发的更新，但文档发生了变化，检查是否需要自动更新列表
    if (!hasManualUpdate && update.docChanged) {
        let needsUpdate = false;

        // 检查变化是否可能影响列表编号
        for (const tr of update.transactions) {
            tr.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
                // 检查删除的内容是否包含列表标记
                const deletedText = update.startState.doc.sliceString(fromA, toA);
                const insertedText = inserted.toString();

                // 检查是否涉及列表项（有序或无序）
                const hasListMarker = (text: string) => {
                    return /^\s*(\d+(?:\.\d+)*\.\s|[-*+]\s)/m.test(text) ||
                        /\n\s*(\d+(?:\.\d+)*\.\s|[-*+]\s)/m.test(text);
                };

                if (hasListMarker(deletedText) || hasListMarker(insertedText)) {
                    needsUpdate = true;
                    return;
                }

                // 检查变化位置周围的行是否包含列表
                const doc = update.state.doc;
                try {
                    const fromLine = Math.max(1, doc.lineAt(Math.max(0, fromB - 1)).number - 1);
                    const toLine = Math.min(doc.lines, doc.lineAt(Math.min(toB + 1, doc.length)).number + 1);

                    for (let lineNum = fromLine; lineNum <= toLine; lineNum++) {
                        const line = doc.line(lineNum);
                        if (/^\s*(\d+(?:\.\d+)*\.\s|[-*+]\s)/.test(line.text)) {
                            needsUpdate = true;
                            return;
                        }
                    }
                } catch (e) {
                    // 如果访问行时出错，为安全起见触发更新
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
                            const indentLevel = Math.floor(indentation.length / 2);
                            const levelClass = `cm-bullet-list-l${indentLevel % 3}`;

                            const bulletStart = line.from + (unorderedMatch.index || 0);
                            const bulletEnd = bulletStart + unorderedMatch[0].length;

                            // 添加装饰器到数组中
                            decorations.push({
                                from: bulletStart,
                                to: bulletStart,
                                decoration: Decoration.widget({
                                    widget: new BulletWidget(levelClass, indentLevel, indentation),
                                    side: 1
                                })
                            });

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

        // 按位置排序装饰器
        decorations.sort((a, b) => {
            if (a.from !== b.from) return a.from - b.from;
            // Widget 装饰器应该在 replace 装饰器之前
            const aIsWidget = a.decoration.spec.widget !== undefined;
            const bIsWidget = b.decoration.spec.widget !== undefined;
            if (aIsWidget && !bIsWidget) return -1;
            if (!aIsWidget && bIsWidget) return 1;
            return 0;
        });

        // 添加到 builder
        decorations.forEach(({ from, to, decoration }) => {
            builder.add(from, to, decoration);
        });

        return builder.finish();
    }
}, {
    decorations: v => v.decorations,
});