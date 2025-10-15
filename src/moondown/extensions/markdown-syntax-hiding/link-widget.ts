// src/moondown/extensions/markdown-syntax-hiding/link-widget.ts
import { EditorView, WidgetType } from "@codemirror/view";
import { EditorSelection } from "@codemirror/state";

export class LinkWidget extends WidgetType {
    constructor(private displayText: string, private fullLink: string, private start: number) {
        super();
    }

    toDOM(view: EditorView): HTMLElement {
        const span = document.createElement("span");
        span.className = "cm-link-widget";
        span.textContent = this.displayText;

        span.addEventListener('mousedown', (event) => {
            event.preventDefault();
            const end = this.start + this.fullLink.length;
            view.dispatch({
                selection: EditorSelection.single(this.start, end)
            });
        });

        return span;
    }

    eq(other: LinkWidget) {
        return other.displayText === this.displayText && other.fullLink === this.fullLink && other.start === this.start;
    }

    // 4. 告诉 CodeMirror 忽略 mousedown 事件，因为我们已经自己处理了
    ignoreEvent(event: Event): boolean {
        return event.type === 'mousedown';
    }
}