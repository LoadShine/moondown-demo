// src/extensions/fenced-code/index.ts
import {type Extension} from "@codemirror/state";
import {codeBlockInputHandler, fencedCodeBackgroundPlugin} from "./fenced-code-plugin.ts";
import {languageIdentifierAutocomplete} from "./language-autocomplete.ts";

// 导出插件
export function fencedCode(): Extension{
    return [
        fencedCodeBackgroundPlugin,
        languageIdentifierAutocomplete,
        codeBlockInputHandler
    ]
}