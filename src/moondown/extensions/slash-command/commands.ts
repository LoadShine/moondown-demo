// src/moondown/extensions/slash-command/commands.ts
import {EditorView} from "@codemirror/view";
import {ghostWriterExecutor} from "./ghost-writer.ts";

export interface SlashCommandOption {
    title: string
    icon: string
    execute: (view: EditorView) => void | Promise<AbortController>
}

export const slashCommands: SlashCommandOption[] = [
    {
        title: "AI 续写",
        icon: "bot",
        execute: async (view: EditorView) => ghostWriterExecutor(view)
    },
    {
        title: "Heading 1",
        icon: "heading-1",
        execute: (view: EditorView) => {
            const {state, dispatch} = view
            const line = state.doc.lineAt(state.selection.main.from)
            dispatch({
                changes: {from: line.from, to: line.from, insert: "# "},
                selection: {anchor: line.from + 2}
            })
        }
    },
    {
        title: "Heading 2",
        icon: "heading-2",
        execute: (view: EditorView) => {
            const {state, dispatch} = view
            const line = state.doc.lineAt(state.selection.main.from)
            dispatch({
                changes: {from: line.from, to: line.from, insert: "## "},
                selection: {anchor: line.from + 3}
            })
        }
    },
    {
        title: "Heading 3",
        icon: "heading-3",
        execute: (view: EditorView) => {
            const {state, dispatch} = view
            const line = state.doc.lineAt(state.selection.main.from)
            dispatch({
                changes: {from: line.from, to: line.from, insert: "### "},
                selection: {anchor: line.from + 4}
            })
        }
    },
    {
        title: "Heading 4",
        icon: "heading-4",
        execute: (view: EditorView) => {
            const {state, dispatch} = view
            const line = state.doc.lineAt(state.selection.main.from)
            dispatch({
                changes: {from: line.from, to: line.from, insert: "#### "},
                selection: {anchor: line.from + 5}
            })
        }
    },
    {
        title: "divider", icon: "", execute: () => {
        }
    }, // 分割线
    {
        title: "Insert Table",
        icon: "table",
        execute: (view: EditorView) => {
            const {state, dispatch} = view
            const pos = state.selection.main.from
            const tableText = "\n| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n"
            dispatch({
                changes: {from: pos, insert: tableText},
                selection: {anchor: pos + tableText.length}
            })
        }
    },
    {
        title: "Insert Link",
        icon: "link",
        execute: (view: EditorView) => {
            const {state, dispatch} = view
            const pos = state.selection.main.from
            const linkText = "[Link text](url)"
            dispatch({
                changes: {from: pos, insert: linkText},
                selection: {anchor: pos + 1, head: pos + 10}
            })
        }
    },
    {
        title: "Quote Block",
        icon: "quote",
        execute: (view: EditorView) => {
            const {state, dispatch} = view
            const line = state.doc.lineAt(state.selection.main.from)
            dispatch({
                changes: {from: line.from, to: line.from, insert: "> "},
                selection: {anchor: line.from + 2}
            })
        }
    },
    {
        title: "Ordered List",
        icon: "list-ordered",
        execute: (view: EditorView) => {
            const {state, dispatch} = view
            const line = state.doc.lineAt(state.selection.main.from)
            dispatch({
                changes: {from: line.from, to: line.from, insert: "1. "},
                selection: {anchor: line.from + 3}
            })
        }
    },
    {
        title: "Unordered List",
        icon: "list",
        execute: (view: EditorView) => {
            const {state, dispatch} = view
            const line = state.doc.lineAt(state.selection.main.from)
            dispatch({
                changes: {from: line.from, to: line.from, insert: "- "},
                selection: {anchor: line.from + 2}
            })
        }
    },
    {
        title: "Code Block",
        icon: "code",
        execute: (view: EditorView) => {
            const {state, dispatch} = view
            const pos = state.selection.main.from
            const codeBlockText = "```\n\n```"
            dispatch({
                changes: {from: pos, insert: codeBlockText},
                selection: {anchor: pos + 4}
            })
        }
    },
]