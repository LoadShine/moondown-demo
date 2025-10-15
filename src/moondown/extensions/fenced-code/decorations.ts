// src/moondown/extensions/fenced-code/decorations.ts
import {Decoration} from "@codemirror/view";

export const fencedCodeDecoration = Decoration.line({
    attributes: {class: "cm-fenced-code"}
})
export const hideLineDecoration = Decoration.line({
    attributes: {class: "cm-hide-line"}
})
