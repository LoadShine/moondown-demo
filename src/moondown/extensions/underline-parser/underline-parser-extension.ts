// src/moondown/extensions/underline-parser/underline-parser-extension.ts
import {InlineContext, type MarkdownExtension} from "@lezer/markdown";

export const UnderlineDelim = {resolve: "Underline", mark: "UnderlineMarker"};

export const UnderlineExtension: MarkdownExtension = {
    defineNodes: ["Underline", "UnderlineMarker"],
    parseInline: [
        {
            name: "Underline",
            parse(cx: InlineContext, next: number, pos: number) {
                if (next != 126 /* '~' */) return -1;
                return cx.addDelimiter(UnderlineDelim, pos, pos + 1, true, true);
            },
        },
    ],
};
