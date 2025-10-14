// src/extensions/image/image-widgets.ts
import {EditorView, WidgetType} from "@codemirror/view";
import errorImageGeneric from "./error-image-generic.png";
import {EditorSelection} from "@codemirror/state";
import {imageLoadedEffect, updateImagePlaceholder} from "./types.ts";

export class ImageWidget extends WidgetType {
    private loaded: boolean = false
    private errorSrc: string | null = null
    private isError: boolean = false
    private isDragging: boolean = false
    private dragStartX: number = 0
    private dragStartY: number = 0
    private clickTimeout: NodeJS.Timeout | null = null
    private isMouseDownOnImage: boolean = false
    private currentDraggingImg: HTMLImageElement | null = null;

    constructor(
        public alt: string,
        public src: string,
        public from: number,
        public to: number,
        private view: EditorView
    ) {
        super()
    }

    toDOM(): HTMLElement {
        const wrapper = document.createElement("div")
        wrapper.className = "cm-image-widget"
        if (this.isError) {
            wrapper.classList.add('cm-image-error')  // 根据错误状态添加类
        }

        const imageWrapper = document.createElement("div")
        imageWrapper.className = "cm-image-wrapper"

        const img = document.createElement("img")
        img.src = this.errorSrc || this.src
        img.alt = this.alt
        img.style.transform = 'scale(0.9)'

        const overlay = document.createElement("div")
        overlay.className = "cm-image-overlay"

        const altText = document.createElement("div")
        altText.className = "cm-image-alt"
        altText.textContent = this.alt

        imageWrapper.appendChild(img)
        imageWrapper.appendChild(overlay)
        wrapper.appendChild(imageWrapper)
        wrapper.appendChild(altText)

        wrapper.addEventListener('mousedown', this.handleMouseDown)
        document.addEventListener('mousemove', this.handleMouseMove)
        document.addEventListener('mouseup', this.handleMouseUp)

        if (!this.loaded) {
            img.addEventListener('load', () => {
                this.loaded = true
                const lineHeight = this.view.defaultLineHeight
                const lines = Math.ceil(wrapper.offsetHeight / lineHeight)
                this.view.dispatch({
                    effects: imageLoadedEffect.of({from: this.from, to: this.to, lines: lines})
                })
            })
            img.addEventListener('error', () => {
                this.isError = true
                wrapper.classList.add('cm-image-error')
                this.errorSrc = errorImageGeneric
                img.src = this.errorSrc
                altText.textContent = this.alt
            })
        }

        return wrapper
    }

    private handleMouseDown = (event: MouseEvent) => {
        event.preventDefault();
        this.isMouseDownOnImage = true;
        this.dragStartX = event.clientX;
        this.dragStartY = event.clientY;

        // 记录当前正在拖动的图片元素
        this.currentDraggingImg = event.target as HTMLImageElement;

        this.clickTimeout = setTimeout(() => {
            this.isDragging = true;
            document.body.style.cursor = 'move';
        }, 200);
    }

    private handleMouseMove = (event: MouseEvent) => {
        if (!this.isDragging) return;

        const pos = this.view.posAtCoords({x: event.clientX, y: event.clientY});

        if (pos !== null) {
            const line = this.view.state.doc.lineAt(pos);
            this.view.dispatch({
                effects: updateImagePlaceholder.of({pos: line.to})
            });
        }

        if (this.currentDraggingImg) {
            const deltaX = event.clientX - this.dragStartX;
            const deltaY = event.clientY - this.dragStartY;
            this.currentDraggingImg.style.transform = `scale(0.8) translate(${deltaX}px, ${deltaY}px)`;
            this.currentDraggingImg.style.opacity = '0.7';
        }
    }

    private handleMouseUp = (event: MouseEvent) => {
        if (this.clickTimeout) {
            clearTimeout(this.clickTimeout);
            this.clickTimeout = null;
        }

        if (!this.isDragging && this.isMouseDownOnImage) {
            this.view.dispatch({
                selection: EditorSelection.single(this.from, this.to),
                scrollIntoView: true
            });
        } else if (this.isDragging) {
            this.isDragging = false;
            document.body.style.cursor = 'default';

            const pos = this.view.posAtCoords({x: event.clientX, y: event.clientY});
            if (pos !== null) {
                this.moveTo(pos);
            }

            this.view.dispatch({
                effects: updateImagePlaceholder.of(null)
            });

            if (this.currentDraggingImg) {
                this.currentDraggingImg.style.transform = '';
                this.currentDraggingImg.style.opacity = '1';
                this.currentDraggingImg = null;  // 清除记录的图片元素
            }
        }

        this.isMouseDownOnImage = false;
    }

    private moveTo(pos: number) {
        const doc = this.view.state.doc;
        const line = doc.lineAt(pos);
        let from = line.to;
        let insert = '\n![' + this.alt + '](' + this.src + ')';

        if (line.length === 0) {
            from = line.from;
            insert = insert.slice(1);
        }

        this.view.dispatch({
            changes: [
                {from: this.from, to: this.to, insert: ''},
                {from, insert}
            ]
        });
    }

    updatePosition(from: number, to: number) {
        this.from = from
        this.to = to
    }

    ignoreEvent(): boolean {
        return false
    }

    eq(other: ImageWidget): boolean {
        return (
            other.alt === this.alt &&
            other.src === this.src &&
            other.from === this.from &&
            other.to === this.to
        )
    }

    destroy() {
        document.removeEventListener('mousemove', this.handleMouseMove)
        document.removeEventListener('mouseup', this.handleMouseUp)
    }
}