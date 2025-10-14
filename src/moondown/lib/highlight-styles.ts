// src/moondown/lib/highlight-styles.ts
import {HighlightStyle} from "@codemirror/language";
import {tags} from "@lezer/highlight";

export const highlightStyles = HighlightStyle.define([
    { tag: tags.heading1, fontWeight: 'bold', fontFamily: 'sans-serif', fontSize: '32px', textDecoration: 'none' },
    { tag: tags.heading2, fontWeight: 'bold', fontFamily: 'sans-serif', fontSize: '28px', textDecoration: 'none' },
    { tag: tags.heading3, fontWeight: 'bold', fontFamily: 'sans-serif', fontSize: '24px', textDecoration: 'none' },
    { tag: tags.heading4, fontWeight: 'bold', fontFamily: 'sans-serif', fontSize: '22px', textDecoration: 'none' },
    { tag: tags.link, fontFamily: 'sans-serif', textDecoration: 'underline', color: 'blue' },
    { tag: tags.emphasis, fontFamily: 'sans-serif', fontStyle: 'italic' },
    { tag: tags.strong, fontFamily: 'sans-serif', fontWeight: 'bold' },
    { tag: tags.content, fontFamily: 'sans-serif' },
    { tag: tags.meta, color: 'darkgray' },
    { tag: tags.comment, color: "#5C6370" },
    { tag: tags.string, color: "#98C379" },
    { tag: tags.number, color: "#D19A66" },
    { tag: tags.keyword, color: "#C678DD" },
    { tag: tags.operator, color: "#56B6C2" },
    { tag: tags.className, color: "#E5C07B" },
    { tag: tags.definition(tags.variableName), color: "#E06C75" },
    { tag: tags.atom, color: "#D19A66" },
    { tag: tags.bool, color: "#D19A66" },
    { tag: tags.propertyName, color: "#61AFEF" },
    { tag: tags.function(tags.variableName), color: "#61AFEF" },
]);