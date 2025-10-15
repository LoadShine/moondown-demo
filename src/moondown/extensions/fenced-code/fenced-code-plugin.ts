// src/moondown/extensions/fenced-code/fenced-code-plugin.ts
import {EditorView, Decoration} from "@codemirror/view"
import {StateField, RangeSetBuilder, EditorState} from "@codemirror/state"
import {syntaxTree} from "@codemirror/language"
import {
    fencedCodeDecoration,
    // fencedCodeFirstLineDecoration, fencedCodeLastLineDecoration,
    hideLineDecoration
} from "./decorations.ts";

// Define plugin to handle code block backgrounds and styles
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

                    // Add background color for all lines
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
                        // Cursor not in code block and code block has more than one line, hide first and last lines
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

        // Sort ranges by from position
        ranges.sort((a, b) => {
            const fromDiff = a.from - b.from
            if (fromDiff !== 0) {
                return fromDiff
            }
            // If from position is the same, sort by decoration type
            if (a.decoration === fencedCodeDecoration) {
                return -1
            }
            if (b.decoration === fencedCodeDecoration) {
                return 1
            }
            return 0
        })

        // Create new RangeSetBuilder and add decorations in sorted order
        const builder = new RangeSetBuilder<Decoration>()
        for (const {from, to, decoration} of ranges) {
            builder.add(from, to, decoration)
        }

        return builder.finish()
    },
    provide: (f) => EditorView.decorations.from(f),
})

// Create input handler, when user types ```, automatically add closing ```
export const codeBlockInputHandler = EditorView.inputHandler.of((view, _from, _to, text) => {
    if (text === "`") {
        const state = view.state
        const selection = state.selection.main
        const beforeCursor = state.doc.sliceString(Math.max(0, selection.from - 2), selection.from)

        // Check if previous two characters are also backticks, forming three backticks
        if (beforeCursor === "``") {
            // Insert a newline, empty line and closing ```
            const insertText = "\n\n```"
            // Calculate new cursor position, after first ```
            const cursorPos = selection.from + 1

            // Execute replacement
            view.dispatch({
                changes: {from: selection.from - 2, to: selection.from, insert: "```" + insertText},
                selection: {anchor: cursorPos}
            })

            // Prevent default input handling
            return true
        }
    }

    // Use default input handler
    return false
})
