// src/moondown/extensions/markdown-syntax-hiding/block-widget.ts
import {WidgetType} from '@codemirror/view';
import hljs from 'highlight.js';
import errorImageGeneric from '../../assets/error-image-generic.png';

export class BlockWidget extends WidgetType {
    private static imageCache: Map<string, HTMLImageElement> = new Map();

    constructor(readonly content: string, readonly type: 'blockquote' | 'blockcode' | 'image', readonly language?: string, readonly alt?: string, readonly src?: string) {
        super();
    }

    toDOM() {
        const wrap = document.createElement("div");
        wrap.className = `cm-${this.type}-widget`;
        const lines = this.content.split('\n');
        const processedLines = lines.map(line => {
            return this.type === 'blockquote' ? line.replace(/^>\s?/, '') : line;
        });
        if (this.type === 'blockcode') {
            const pre = document.createElement("pre");
            const code = document.createElement("code");
            if (this.language) {
                code.className = `language-${this.language}`;
                wrap.setAttribute('data-language', this.language);
            }
            code.textContent = processedLines.join('\n');
            if (this.language) {
                hljs.highlightElement(code);
            }
            pre.appendChild(code);
            wrap.appendChild(pre);
        } else if (this.type === 'image') {
            if (this.src) {
                let img: HTMLImageElement;
                if (BlockWidget.imageCache.has(this.src)) {
                    img = BlockWidget.imageCache.get(this.src)!.cloneNode() as HTMLImageElement;
                } else {
                    img = document.createElement("img");
                    img.src = this.src;
                    img.alt = this.alt || '';
                    img.onload = () => {
                        BlockWidget.imageCache.set(this.src!, img);
                    };
                    img.onerror = () => {
                        console.error(`Failed to load image: ${this.src}`);
                        img.src = errorImageGeneric;
                        img.alt = 'Failed to load image';
                        BlockWidget.imageCache.set(this.src!, img);
                    }
                }
                wrap.appendChild(img);
            }

            if (this.alt) {
                const caption = document.createElement("div");
                caption.className = 'cm-image-caption';
                caption.textContent = this.alt;
                wrap.appendChild(caption);
            }
        } else {
            wrap.textContent = processedLines.join('\n');
        }
        return wrap;
    }

    ignoreEvent() {
        return false;
    }

    eq(other: BlockWidget) {
        return this.content === other.content && this.type === other.type && this.language === other.language && this.alt === other.alt && this.src === other.src;
    }
}