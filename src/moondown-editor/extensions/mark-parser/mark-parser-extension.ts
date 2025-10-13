// src/extensions/mark-parser/mark-parser-extension.ts
import {InlineContext, type MarkdownExtension} from "@lezer/markdown";

export const MarkDelim = { resolve: "Mark", mark: "MarkMarker" };

export const MarkExtension: MarkdownExtension = {
    defineNodes: ["Mark", "MarkMarker"],
    parseInline: [
        {
            name: "Mark",
            parse(cx: InlineContext, next: number, pos: number) {
                if (next != 61 /* '=' */ || cx.char(pos + 1) != 61) return -1;
                return cx.addDelimiter(MarkDelim, pos, pos + 2, true, true);
            },
        },
    ],
};