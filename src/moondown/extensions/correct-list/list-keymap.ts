// src/moondown/extensions/correct-list/list-keymap.ts
import { EditorView, type KeyBinding } from "@codemirror/view";
import { indentLess, indentMore, deleteCharBackward, deleteCharForward } from "@codemirror/commands";
import { updateListEffect } from "./update-list-effect.ts";
import { getListInfo, generateListItem } from "./list-functions.ts";

export const listKeymap: KeyBinding[] = [
    {
        key: 'Tab',
        run: (view: EditorView) => {
            const { state } = view;
            const { selection } = state;
            const pos = selection.main.head;
            const listInfo = getListInfo(state, pos);

            if (listInfo) {
                // 缩进列表项
                indentMore(view);

                // 延迟更新列表编号，确保缩进操作完成
                setTimeout(() => {
                    view.dispatch({
                        effects: updateListEffect.of({ from: 0, to: state.doc.length }),
                    });
                }, 0);

                return true;
            }
            return false;
        },
    },
    {
        key: 'Shift-Tab',
        run: (view: EditorView) => {
            const { state } = view;
            const { selection } = state;
            const pos = selection.main.head;
            const listInfo = getListInfo(state, pos);

            if (listInfo && listInfo.indent > 0) {
                // 减少缩进
                indentLess(view);

                // 延迟更新列表编号
                setTimeout(() => {
                    view.dispatch({
                        effects: updateListEffect.of({ from: 0, to: state.doc.length }),
                    });
                }, 0);

                return true;
            }
            return false;
        },
    },
    {
        key: 'Enter',
        run: (view: EditorView) => {
            const { state } = view;
            const { selection } = state;
            const pos = selection.main.head;
            const listInfo = getListInfo(state, pos);

            if (listInfo) {
                const line = state.doc.lineAt(pos);

                if (listInfo.content.trim() === '') {
                    // 当前列表项为空
                    if (listInfo.indent === 0) {
                        // 已经是最顶级，退出列表
                        const transaction = state.update({
                            changes: {
                                from: line.from,
                                to: line.to,
                                insert: '',
                            },
                            selection: { anchor: line.from }
                        });
                        view.dispatch(transaction);
                    } else {
                        // 回退到上一级
                        const newIndent = Math.max(0, listInfo.indent - 2);
                        const newListItem = generateListItem(listInfo.type, newIndent);

                        const transaction = state.update({
                            changes: {
                                from: line.from,
                                to: line.to,
                                insert: newListItem,
                            },
                            selection: { anchor: line.from + newListItem.length }
                        });
                        view.dispatch(transaction);

                        // 更新列表编号
                        setTimeout(() => {
                            view.dispatch({
                                effects: updateListEffect.of({ from: 0, to: state.doc.length }),
                            });
                        }, 0);
                    }
                } else {
                    // 创建新的列表项
                    const newListItem = generateListItem(listInfo.type, listInfo.indent);
                    const insertText = `\n${newListItem}`;

                    const transaction = state.update({
                        changes: {
                            from: pos,
                            to: pos,
                            insert: insertText,
                        },
                        selection: { anchor: pos + insertText.length }
                    });
                    view.dispatch(transaction);

                    // 更新列表编号
                    setTimeout(() => {
                        view.dispatch({
                            effects: updateListEffect.of({ from: 0, to: state.doc.length }),
                        });
                    }, 0);
                }

                return true;
            }

            return false;
        },
    },
    {
        key: 'Backspace',
        run: (view: EditorView) => {
            const { state } = view;
            const { selection } = state;
            const pos = selection.main.head;

            // 检查当前位置是否在列表中，或者删除操作可能影响列表
            const currentLine = state.doc.lineAt(pos);
            const currentListInfo = getListInfo(state, pos);

            // 检查上一行是否是列表项（用于处理删除换行符的情况）
            let previousLineListInfo = null;
            if (currentLine.number > 1) {
                const previousLine = state.doc.line(currentLine.number - 1);
                previousLineListInfo = getListInfo(state, previousLine.from);
            }

            // 如果当前行或上一行是列表项，需要在删除后更新列表编号
            if (currentListInfo || previousLineListInfo) {
                // 执行默认的删除操作
                const result = deleteCharBackward(view);

                // 延迟更新列表编号，确保删除操作完成
                setTimeout(() => {
                    view.dispatch({
                        effects: updateListEffect.of({ from: 0, to: view.state.doc.length }),
                    });
                }, 0);

                return result;
            }

            return false;
        },
    },
    {
        key: 'Delete',
        run: (view: EditorView) => {
            const { state } = view;
            const { selection } = state;
            const pos = selection.main.head;

            // 检查当前位置是否在列表中，或者删除操作可能影响列表
            const currentLine = state.doc.lineAt(pos);
            const currentListInfo = getListInfo(state, pos);

            // 检查下一行是否是列表项（用于处理删除换行符的情况）
            let nextLineListInfo = null;
            if (currentLine.number < state.doc.lines) {
                const nextLine = state.doc.line(currentLine.number + 1);
                nextLineListInfo = getListInfo(state, nextLine.from);
            }

            // 如果当前行或下一行是列表项，需要在删除后更新列表编号
            if (currentListInfo || nextLineListInfo) {
                // 执行默认的删除操作
                const result = deleteCharForward(view);

                // 延迟更新列表编号，确保删除操作完成
                setTimeout(() => {
                    view.dispatch({
                        effects: updateListEffect.of({ from: 0, to: view.state.doc.length }),
                    });
                }, 0);

                return result;
            }

            return false;
        },
    },
];