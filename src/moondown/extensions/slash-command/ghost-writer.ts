// src/moondown/extensions/slash-command/ghost-writer.ts
import { Decoration, type DecorationSet, EditorView, WidgetType } from "@codemirror/view";
import { EditorSelection, StateEffect, StateField } from "@codemirror/state";
import { slashCommandPlugin } from "./slash-command";
import { chatCompletionStream } from "../../ai/completions";
import { completionPrompt } from "../../ai/prompts";
import { CSS_CLASSES, TIMING } from "../../core/constants";

/**
 * Loading widget displayed during AI text generation
 */
class LoadingWidget extends WidgetType {
    /** Flag to identify this widget type */
    readonly isLoadingWidget = true;

    toDOM(): HTMLElement {
        const div = document.createElement("div");
        div.className = CSS_CLASSES.LOADING_WIDGET;
        div.innerHTML = `
          <div class="${CSS_CLASSES.LOADING_SPINNER}"></div>
          <span>AI is thinking...</span>
        `;
        return div;
    }
}

/**
 * State effects for ghost writer
 */
const addLoadingEffect = StateEffect.define<{ pos: number }>();
const removeLoadingEffect = StateEffect.define<null>();
const markNewText = StateEffect.define<{ from: number; to: number }>();
const unmarkNewText = StateEffect.define<{ from: number; to: number }>();

/**
 * State field for managing new text decorations and loading widget
 */
export const newTextState = StateField.define<DecorationSet>({
    create() {
        return Decoration.none;
    },
    update(value, tr) {
        value = value.map(tr.changes);
        
        for (const e of tr.effects) {
            if (e.is(markNewText)) {
                value = value.update({
                    add: [newTextMark.range(e.value.from, e.value.to)]
                });
            } else if (e.is(addLoadingEffect)) {
                value = value.update({
                    add: [Decoration.widget({
                        widget: new LoadingWidget(),
                        side: 1
                    }).range(e.value.pos)]
                });
            } else if (e.is(removeLoadingEffect)) {
                value = value.update({
                    filter: (_from, _to, decoration) => {
                        return !(decoration.spec.widget && (decoration.spec.widget as LoadingWidget).isLoadingWidget);
                    }
                });
            } else if (e.is(unmarkNewText)) {
                value = value.update({
                    filter: (from, to, decoration) => {
                        const isTargetDecoration = decoration.spec.class === CSS_CLASSES.NEW_TEXT;
                        const isInRange = from >= e.value.from && to <= e.value.to;
                        return !(isTargetDecoration && isInRange);
                    }
                });
            }
        }
        
        return value;
    },
    provide: f => EditorView.decorations.from(f)
});

/** Effect to scroll editor view to a specific position */
export const scrollIntoView = StateEffect.define<number>();

/** Decoration mark for newly generated text */
const newTextMark = Decoration.mark({ class: CSS_CLASSES.NEW_TEXT });

/**
 * Executes AI-powered ghost writer to continue text
 * @param view - Editor view instance
 * @returns Promise that resolves to AbortController for cancellation
 */
export async function ghostWriterExecutor(view: EditorView): Promise<AbortController> {
    const { state, dispatch } = view;
    const { from, to } = state.selection.ranges[0];
    const text = state.doc.toString();
    const prefix = text.slice(0, to);
    const suffix = text.slice(from);
    const pos = state.selection.main.from;
    
    const startPos = pos;
    let endPos = pos;

    // Show loading indicator
    dispatch({
        effects: addLoadingEffect.of({ pos })
    });

    const abortController = new AbortController();
    const plugin = view.plugin(slashCommandPlugin);
    
    if (plugin) {
        plugin.setCurrentAbortController(abortController);
    }

    try {
        const stream = await chatCompletionStream(
            completionPrompt,
            `prefix: ${prefix}\n{FILL_ME}\nsuffix: ${suffix}`,
            abortController.signal
        );

        for await (const part of stream) {
            if (abortController.signal.aborted) {
                console.log('Stream aborted');
                break;
            }
            
            const content = part.choices[0].delta?.content;
            if (content) {
                const insertPos = endPos;
                endPos += content.length;
                
                dispatch({
                    changes: { from: insertPos, insert: content },
                    effects: [
                        markNewText.of({ from: insertPos, to: insertPos + content.length }),
                        scrollIntoView.of(insertPos + content.length)
                    ]
                });
            }
        }
    } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
            console.log('AI continuation aborted');
        } else {
            console.error('Error during AI continuation:', error);
        }
    } finally {
        // Remove loading indicator
        dispatch({
            effects: removeLoadingEffect.of(null)
        });
        
        // Move cursor to end of generated text
        view.dispatch(view.state.update({
            selection: EditorSelection.cursor(endPos)
        }));

        // Remove highlight after animation completes
        const finalEndPos = endPos;
        setTimeout(() => {
            view.dispatch({
                effects: unmarkNewText.of({ from: startPos, to: finalEndPos })
            });
        }, TIMING.ANIMATION_DURATION);

        if (plugin) {
            plugin.clearCurrentAbortController();
        }
    }
    
    return abortController;
}