// src/moondown/extensions/correct-list/bullet-widget.ts
import { WidgetType } from "@codemirror/view";

export class BulletWidget extends WidgetType {
    constructor(private className: string, private level: number, private indentation: string) {
        super();
    }

    toDOM() {
        const span = document.createElement("span");
        span.innerHTML = `${this.indentation}${this.getBulletSymbol(this.level)} `;
        span.className = `cm-bullet-list ${this.className}`;
        return span;
    }

    private getBulletSymbol(level: number): string {
        const symbols = ["●", "○", "■"];
        return symbols[level % symbols.length];
    }

    eq(other: BulletWidget) {
        return other.className === this.className &&
            other.level === this.level &&
            other.indentation === this.indentation;
    }
}