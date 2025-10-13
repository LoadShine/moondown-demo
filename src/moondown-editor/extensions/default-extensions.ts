// src/extensions/default-extensions.ts
import {type Extension} from '@codemirror/state';
import {drawSelection, EditorView, keymap, rectangularSelection} from '@codemirror/view';
import {indentOnInput} from '@codemirror/language';
import {markdown} from '@codemirror/lang-markdown';
import {defaultKeymap, history, historyKeymap, indentWithTab} from "@codemirror/commands";
import {closeBracketsKeymap, completionKeymap} from "@codemirror/autocomplete";
import {languages} from "@codemirror/language-data";
import {correctList} from "./correct-list";
import {markdownSyntaxHiding} from "./markdown-syntax-hiding";
import {GFM} from "@lezer/markdown";
import {Mark} from "./mark-parser";
import {blockquoteKeymap} from "./blockquote-keymap";
import {finalNewLine} from "./final-new-line";
import {tableExtension} from "./table";
import {baseTheme} from "../theme/base-theme.ts";

export const defaultExtensions: Extension[] = [
    tableExtension,
    history(),
    drawSelection(),
    rectangularSelection(),
    indentOnInput(),
    correctList,
    blockquoteKeymap,
    keymap.of([indentWithTab, ...defaultKeymap, ...completionKeymap, ...historyKeymap, ...closeBracketsKeymap]),
    EditorView.lineWrapping,
    markdownSyntaxHiding(),
    markdown({
        codeLanguages: languages,
        extensions: [GFM, Mark],
        addKeymap: false,
    }),
    finalNewLine,
    baseTheme
];