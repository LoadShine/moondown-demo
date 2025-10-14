// src/moondown/extensions/image/index.ts
import {EditorSelection, type Extension} from "@codemirror/state";
import {EditorView, ViewUpdate} from "@codemirror/view";
import {imageSizeField, placeholderField} from "./fields.ts";
import {imageWidgetPlugin} from "./image-renderer.ts";
import {imageDragAndDropPlugin} from "./image-drag-n-drop.ts";

export function imageExtension(): Extension {
    return [
        imageSizeField,
        placeholderField,
        imageWidgetPlugin,
        imageDragAndDropPlugin,
        EditorView.updateListener.of((update: ViewUpdate) => {
            if (update.selectionSet || update.viewportChanged) {
                const {from, to} = update.state.selection.main
                update.view.dom.querySelectorAll(".cm-image-widget").forEach((el: Element) => {
                    const pos = update.view.posAtDOM(el as HTMLElement)
                    if (pos !== null && pos >= from && pos < to) {
                        el.classList.add("selected")
                    } else {
                        el.classList.remove("selected")
                    }
                })
            }
        }),
        EditorView.inputHandler.of((view, from, _to, text) => {
            const doc = view.state.doc;
            const line = doc.lineAt(from);
            const lineContent = line.text;
            let isImageLine = false;

            // 判断lineContent.trim()是不是图片的markdown语法，使用完备的正则表达式匹配
            const imageReg = /^!\[([^\]]*)\]\(([^)]+)\)$/;
            if (imageReg.test(lineContent.trim())) {
                isImageLine = true;
            }

            // 检查是否在图片行的开头输入
            if (from === line.from && isImageLine) {
                // 在图片前插入新行
                view.dispatch({
                    changes: [{from: line.from, insert: '\n'}],
                    selection: EditorSelection.cursor(line.from),
                    scrollIntoView: true
                });

                // 在新行中插入文本
                view.dispatch({
                    changes: [{from: line.from, insert: text}],
                    selection: EditorSelection.cursor(line.from + text.length),
                    scrollIntoView: true
                });

                return true; // 表示我们已经处理了这个输入
            }

            return false; // 让 CodeMirror 处理其他情况
        })
    ]
}
