// src/moondown/extensions/markdown-syntax-hiding/widgets.ts
import { WidgetType } from "@codemirror/view";

/**
 * Base class for simple text replacement widgets
 */
abstract class TextReplacementWidget extends WidgetType {
    constructor(protected content: string, protected className: string) {
        super();
    }

    toDOM(): HTMLElement {
        const span = document.createElement("span");
        span.className = this.className;
        span.textContent = this.content;
        return span;
    }

    eq(other: TextReplacementWidget): boolean {
        return other.content === this.content && other.className === this.className;
    }

    ignoreEvent(): boolean {
        return false;
    }
}

/**
 * Widget for inline code
 */
export class InlineCodeWidget extends TextReplacementWidget {
    constructor(content: string) {
        super(content, "cm-inline-code-widget");
    }
}

/**
 * Widget for strikethrough text
 */
export class StrikethroughWidget extends TextReplacementWidget {
    constructor(content: string) {
        super(content, "cm-strikethrough-widget");
    }
}

/**
 * Widget for highlighted text
 */
export class HighlightWidget extends TextReplacementWidget {
    constructor(content: string) {
        super(content, "cm-highlight-widget");
    }
}

/**
 * Widget for underlined text
 */
export class UnderlineWidget extends TextReplacementWidget {
    constructor(content: string) {
        super(content, "cm-underline-widget");
    }
}
