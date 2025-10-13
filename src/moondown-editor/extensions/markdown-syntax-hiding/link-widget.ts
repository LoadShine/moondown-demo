// src/extensions/markdown-syntax-hiding/link-widget.ts
import {EditorView, WidgetType} from "@codemirror/view";

export class LinkWidget extends WidgetType {
    constructor(private displayText: string, private fullLink: string, private start: number) {
        super();
    }

    toDOM(_: EditorView) {
        const span = document.createElement("span");
        span.className = "cm-link-widget";
        span.textContent = this.displayText;

        return span;
    }

    eq(other: LinkWidget) {
        return other.displayText === this.displayText && other.fullLink === this.fullLink && other.start === this.start;
    }

    ignoreEvent() { return false; }
}