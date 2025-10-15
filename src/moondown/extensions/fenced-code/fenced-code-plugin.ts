// src/moondown/extensions/fenced-code/fenced-code-plugin.ts
import {EditorView, Decoration} from "@codemirror/view"
import {StateField, RangeSetBuilder, EditorState} from "@codemirror/state"
import {syntaxTree} from "@codemirror/language"
import {
    fencedCodeDecoration,
    // fencedCodeFirstLineDecoration, fencedCodeLastLineDecoration,
    hideLineDecoration
} from "./decorations.ts";

// 定义插件，处理代码块的背景和样式
export const fencedCodeBackgroundPlugin = StateField.define({
    create(_state: EditorState) {
        return Decoration.none;
    },
    update(_decorations, transaction) {
        const state = transaction.state
        const ranges: { from: number, to: number, decoration: Decoration }[] = []
        const selection = state.selection.main

        syntaxTree(state).iterate({
            enter: (node) => {
                if (node.type.name === "FencedCode") {
                    const start = node.from
                    const end = node.to
                    const isSelected = selection.from <= end && selection.to >= start

                    const startLine = state.doc.lineAt(start)
                    const endLine = state.doc.lineAt(end)

                    // 为所有行添加背景色
                    let pos = startLine.from
                    while (pos <= endLine.from) {
                        const line = state.doc.lineAt(pos)
                        ranges.push({
                            from: line.from,
                            to: line.from,
                            decoration: fencedCodeDecoration
                        })
                        pos = line.to + 1
                    }

                    if (!isSelected && startLine.number !== endLine.number) {
                        // 光标不在代码块中且代码块不止一行,隐藏第一行和最后一行
                        ranges.push({
                            from: startLine.from,
                            to: startLine.from,
                            decoration: hideLineDecoration
                        })
                        ranges.push({
                            from: endLine.from,
                            to: endLine.from,
                            decoration: hideLineDecoration
                        })
                    }
                }
            }
        })

        // 对 ranges 按照 from 位置排序
        ranges.sort((a, b) => {
            const fromDiff = a.from - b.from
            if (fromDiff !== 0) {
                return fromDiff
            }
            // 如果 from 位置相同, 按照装饰类型排序
            if (a.decoration === fencedCodeDecoration) {
                return -1
            }
            if (b.decoration === fencedCodeDecoration) {
                return 1
            }
            return 0
        })

        // 创建新的 RangeSetBuilder 并按照排序后的 ranges 添加装饰
        const builder = new RangeSetBuilder<Decoration>()
        for (const {from, to, decoration} of ranges) {
            builder.add(from, to, decoration)
        }

        return builder.finish()
    },
    provide: (f) => EditorView.decorations.from(f),
})

// 创建输入处理器，当用户输入 ``` 时，自动添加结尾的 ```
export const codeBlockInputHandler = EditorView.inputHandler.of((view, _from, _to, text) => {
    if (text === "`") {
        const state = view.state
        const selection = state.selection.main
        const beforeCursor = state.doc.sliceString(Math.max(0, selection.from - 2), selection.from)

        // 检查前两个字符是否也是反引号，构成了三个反引号
        if (beforeCursor === "``") {
            // 插入一个换行符、空行和结尾的 ```
            const insertText = "\n\n```"
            // 计算光标新位置，在第一个 ``` 后
            const cursorPos = selection.from + 1

            // 执行替换
            view.dispatch({
                changes: {from: selection.from - 2, to: selection.from, insert: "```" + insertText},
                selection: {anchor: cursorPos}
            })

            // 阻止默认输入处理
            return true
        }
    }

    // 使用默认的输入处理器
    return false
})
