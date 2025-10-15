// src/moondown/extensions/strikethrough-parser/strikethrough-parser-extension.ts
import {InlineContext, type MarkdownExtension} from "@lezer/markdown";

export const StrikethroughDelim = { resolve: "Strikethrough", mark: "StrikethroughMarker" };

export const StrikethroughExtension: MarkdownExtension = {
    defineNodes: ["Strikethrough", "StrikethroughMarker"],
    parseInline: [
        {
            name: "Strikethrough",
            parse(cx: InlineContext, next: number, pos: number) {
                if (next != 126 /* '~' */ || cx.char(pos + 1) != 126) return -1;
                return cx.addDelimiter(StrikethroughDelim, pos, pos + 2, true, true);
            },
        },
    ],
};