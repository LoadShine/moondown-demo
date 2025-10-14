// src/extensions/slash-command/ghost-writer.ts
import {Decoration, type DecorationSet, EditorView, WidgetType} from "@codemirror/view";
import {EditorSelection, StateEffect, StateField} from "@codemirror/state";
import {slashCommandPlugin} from "./slash-command.ts";
import {chatCompletionStream} from "../../ai/completions.ts";
import {completionPrompt} from "../../ai/prompts.ts";

// Modified: Add a unique property to identify LoadingWidget
class LoadingWidget extends WidgetType {
    isLoadingWidget = true;

    toDOM() {
        const div = document.createElement("div");
        div.className = "cm-loading-widget";
        div.innerHTML = `
      <div class="cm-loading-spinner"></div>
      <span>AI is thinking...</span>
    `;
        return div;
    }
}

// State effects
const addLoadingEffect = StateEffect.define<{ pos: number }>()
const removeLoadingEffect = StateEffect.define<null>()
const markNewText = StateEffect.define<{ from: number, to: number }>()

export const newTextState = StateField.define<DecorationSet>({
    create() {
        return Decoration.none
    },
    update(value, tr) {
        value = value.map(tr.changes)
        for (const e of tr.effects) {
            if (e.is(markNewText)) {
                value = value.update({
                    add: [newTextMark.range(e.value.from, e.value.to)]
                })
            } else if (e.is(addLoadingEffect)) {
                value = value.update({
                    add: [Decoration.widget({
                        widget: new LoadingWidget(),
                        side: 1
                    }).range(e.value.pos)]
                })
            } else if (e.is(removeLoadingEffect)) {
                value = value.update({
                    filter: (_from, _to, value) => !(value.spec.widget && (value.spec.widget as LoadingWidget).isLoadingWidget)
                })
            }
        }
        return value
    },
    provide: f => EditorView.decorations.from(f)
})

export const scrollIntoView = StateEffect.define<number>()

const newTextMark = Decoration.mark({class: "cm-new-text"})

export async function ghostWriterExecutor(view: EditorView) {
    const {state, dispatch} = view
    const {from, to} = state.selection.ranges[0];
    const text = state.doc.toString();
    const prefix = text.slice(0, to);
    const suffix = text.slice(from);
    const pos = state.selection.main.from
    let endPos = pos // 记录插入文本的结束位置
    // const content = state.doc.sliceString(0, pos)

    dispatch({
        effects: addLoadingEffect.of({pos})
    })

    const abortController = new AbortController()
    const plugin = view.plugin(slashCommandPlugin)
    if (plugin) {
        plugin.setCurrentAbortController(abortController)
    }

    try {
        const stream = await chatCompletionStream(
            completionPrompt,
            `prefix: ${prefix}\n{FILL_ME}\nsuffix: ${suffix}`,
            abortController.signal)

        // let generatedText = ''
        for await (const part of stream) {
            if (abortController.signal.aborted) {
                console.log('Stream aborted')
                break
            }
            if (part.choices[0].delta?.content) {
                const newContent = part.choices[0].delta.content
                // generatedText += newContent
                const insertPos = endPos
                endPos += newContent.length // 更新结束位置
                dispatch({
                    changes: {from: insertPos, insert: newContent},
                    effects: [
                        markNewText.of({from: insertPos, to: insertPos + newContent.length}),
                        scrollIntoView.of(insertPos + newContent.length)
                    ]
                })
            }
        }
    } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
            console.log('AI continuation aborted');
        } else {
            console.error('Error during AI continuation:', error);
        }
    } finally {
        dispatch({
            effects: removeLoadingEffect.of(null)
        })
        // 将选择设置为插入文本的结束位置
        view.dispatch(view.state.update({
            selection: EditorSelection.cursor(endPos)
        }))
        if (plugin) {
            plugin.clearCurrentAbortController()
        }
    }
}