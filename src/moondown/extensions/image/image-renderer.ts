// src/moondown/extensions/image/image-renderer.ts
import {RangeSetBuilder} from "@codemirror/state"
import {
    EditorView,
    Decoration,
    type DecorationSet,
    ViewPlugin,
    ViewUpdate,
    WidgetType
} from "@codemirror/view"
import {syntaxTree} from "@codemirror/language"
import {imageSizeField} from "./fields.ts";
import {imageWidgetCache} from "./types.ts";
import {ImageWidget} from "./image-widgets.ts";

export const imageWidgetPlugin = ViewPlugin.fromClass(
    class {
        decorations: DecorationSet

        constructor(view: EditorView) {
            this.decorations = this.buildDecorations(view)
        }

        update(update: ViewUpdate) {
            if (update.docChanged || update.viewportChanged) {
                this.decorations = this.buildDecorations(update.view)
            }
        }

        buildDecorations(view: EditorView) {
            const builder = new RangeSetBuilder<Decoration>();
            const imageSizes = view.state.field(imageSizeField);

            // 收集所有需要添加的装饰器
            const decorationsToAdd: {from: number, to: number, decoration: Decoration}[] = [];

            for (const {from, to} of view.visibleRanges) {
                syntaxTree(view.state).iterate({
                    from,
                    to,
                    enter: (node) => {
                        if (node.type.name === "Image") {
                            const text = view.state.doc.sliceString(node.from, node.to);
                            const match = text.match(/!\[([^\]]*)\]\(([^)]+)\)/);

                            if (match) {
                                const [, alt, src] = match;
                                const cacheKey = `${src}|${alt}`;
                                let widget = imageWidgetCache.get(cacheKey);

                                if (!widget) {
                                    widget = new ImageWidget(alt, src, node.from, node.to, view);
                                    imageWidgetCache.set(cacheKey, widget);
                                } else {
                                    widget.updatePosition(node.from, node.to);
                                }

                                decorationsToAdd.push({
                                    from: node.from,
                                    to: node.to,
                                    decoration: Decoration.replace({
                                        widget: widget,
                                        inclusive: true
                                    })
                                });

                                if (imageSizes[node.from]) {
                                    decorationsToAdd.push({
                                        from: node.to,
                                        to: node.to,
                                        decoration: Decoration.widget({
                                            widget: new class extends WidgetType {
                                                toDOM() {
                                                    const el = document.createElement('div');
                                                    el.style.height = '0';
                                                    return el;
                                                }
                                            },
                                            side: 1
                                        })
                                    });
                                }
                            }
                        }
                    }
                });
            }

            // 按照 from 位置排序
            decorationsToAdd.sort((a, b) => a.from - b.from);

            // 按顺序添加装饰器
            for (const {from, to, decoration} of decorationsToAdd) {
                builder.add(from, to, decoration);
            }

            // 清理不再使用的缓存
            for (const [key, widget] of imageWidgetCache) {
                if (!view.state.doc.sliceString(widget.from, widget.to).includes(widget.src)) {
                    imageWidgetCache.delete(key);
                }
            }

            return builder.finish();
        }
    },
    {
        decorations: v => v.decorations
    }
)