// src/extensions/fenced-code/decorations.ts
import {Decoration} from "@codemirror/view";

export const fencedCodeDecoration = Decoration.line({
    attributes: {class: "cm-fenced-code"}
})
export const fencedCodeFirstLineDecoration = Decoration.line({
    attributes: {class: "cm-fenced-code-first-line"}
})
export const fencedCodeLastLineDecoration = Decoration.line({
    attributes: {class: "cm-fenced-code-last-line"}
})
export const hideLineDecoration = Decoration.line({
    attributes: {class: "cm-hide-line"}
})
