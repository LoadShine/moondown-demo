// src/moondown/extensions/default-extensions.ts
import { type Extension, Compartment } from '@codemirror/state';
import { EditorView, keymap, rectangularSelection } from '@codemirror/view';
import { indentOnInput } from '@codemirror/language';
import { markdown } from '@codemirror/lang-markdown';
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import { languages } from "@codemirror/language-data";
import { GFM } from "@lezer/markdown";

// Import extensions
import { correctList } from "./correct-list";
import { markdownSyntaxHiding } from "./markdown-syntax-hiding";
import { Mark } from "./mark-parser";
import { Underline } from "./underline-parser";
import { Strikethrough } from "./strikethrough-parser";
import { finalNewLine } from "./final-new-line";
import { tableExtension } from "./table";
import { slashCommand } from "./slash-command";
import { imageExtension } from "./image";
import { fencedCode } from "./fenced-code";
import { blockquote } from "./blockquote";
import { bubbleMenu } from "./bubble-menu";

// Import theme
import { lightTheme } from "../theme/base-theme";

/**
 * Theme compartment for dynamic theme switching
 */
export const themeCompartment = new Compartment();

/**
 * Default editor extensions
 * Includes all core functionality: markdown parsing, syntax highlighting,
 * bubble menu, slash commands, table editing, image support, etc.
 */
export const defaultExtensions: Extension[] = [
    // Table editing support
    tableExtension(),

    // History and undo/redo
    history(),

    // Selection and editing
    rectangularSelection(),
    indentOnInput(),

    // Custom extensions
    slashCommand(),
    correctList(),
    fencedCode(),
    blockquote(),
    bubbleMenu(),
    imageExtension(),

    // Keymaps
    keymap.of([
        indentWithTab,
        ...defaultKeymap,
        ...completionKeymap,
        ...historyKeymap,
        ...closeBracketsKeymap
    ]),

    // Editor behavior
    EditorView.lineWrapping,
    markdownSyntaxHiding(),

    // Markdown language support
    markdown({
        codeLanguages: languages,
        extensions: [GFM, Mark, Underline, Strikethrough],
        addKeymap: false,
    }),

    // Final newline
    finalNewLine,

    // Default theme (light)
    themeCompartment.of(lightTheme)
];