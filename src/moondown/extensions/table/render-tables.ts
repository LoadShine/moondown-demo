// src/moondown/extensions/table/render-tables.ts
import {WidgetType, EditorView, Decoration, type DecorationSet} from '@codemirror/view'
import { StateField, EditorState } from '@codemirror/state'
import { syntaxTree } from '@codemirror/language'
import type {SyntaxNode, SyntaxNodeRef} from "@lezer/common";
import { debounce } from 'lodash';
import {tablePositions, updateTablePosition} from "./table-position.ts";
import TableEditor from "./table-editor.ts";
import {parseNode} from "./table-functions.ts";
import {type TableEditorOptions} from "./types.ts";

class TableWidget extends WidgetType {
    constructor(readonly table: string, readonly node: SyntaxNode) {
        super();
    }

    eq(other: TableWidget): boolean {
        return (
            this.table === other.table &&
            this.node.from === other.node.from &&
            this.node.to === other.node.to
        );
    }

    toDOM(view: EditorView): HTMLElement {
        try {
            const table = fromSyntaxNode(this.node, view.state.sliceDoc(), {
                onBlur: debounce((instance: TableEditor) => {
                    this.saveContent(view, instance);
                }, 300),
                saveIntent: (instance: TableEditor) => {
                    this.saveContent(view, instance);
                },
                container: view.scrollDOM,
            });

            return table.domElement;
        } catch (err: any) {
            console.error('Error in TableWidget.toDOM:', err);
            return document.createElement('div');
        }
    }

    private saveContent(view: EditorView, instance: TableEditor) {
        const newContent = instance.getMarkdownTable();
        const positions = view.state.field(tablePositions);
        const currentPos = positions.get(this.node.from);

        if (currentPos) {
            view.dispatch({
                changes: {
                    from: currentPos.from,
                    to: currentPos.to,
                    insert: newContent,
                },
                effects: updateTablePosition.of({
                    id: this.node.from,
                    from: currentPos.from,
                    to: currentPos.from + newContent.length,
                }),
            });
        } else {
            view.dispatch({
                changes: {
                    from: this.node.from,
                    to: this.node.to,
                    insert: newContent,
                },
                effects: updateTablePosition.of({
                    id: this.node.from,
                    from: this.node.from,
                    to: this.node.from + newContent.length,
                }),
            });
        }

        instance.markClean();
    }

    ignoreEvent(_: Event): boolean {
        return true;
    }
}

/**
 * Instantiates a TableEditor based on a SyntaxNode
 *
 * @param   {SyntaxNode}          tableNode  The syntax node
 * @param   {string}              markdown   The Markdown source
 * @param   {TableEditorOptions}  hooks      TableEditor options
 *
 * @return  {TableEditor}                    The instance
 */
function fromSyntaxNode (tableNode: SyntaxNode, markdown: string, hooks: TableEditorOptions = {}): TableEditor {
    const parsed = parseNode(tableNode, markdown)
    if (parsed) {
        return new TableEditor(parsed.ast, parsed.colAlignments, hooks)
    } else {
        throw new Error('Could not parse table node')
    }
}

function shouldHandleNode (node: SyntaxNodeRef): boolean {
    return node.name === 'Table' || node.name === 'TableRow' || node.name === 'TableCell';
}

function createWidget (state: EditorState, node: SyntaxNodeRef): TableWidget|undefined {
    const table = state.sliceDoc(node.from, node.to)
    try {
        return new TableWidget(table, node.node)
    } catch (err: any) {
        console.error('Could not instantiate TableEditor widget: ' + err.message)
        return undefined
    }
}

function renderBlockWidgets (
    shouldHandleNode: (node: SyntaxNodeRef) => boolean,
    createWidget: (state: EditorState, node: SyntaxNodeRef) => WidgetType|undefined
): StateField<DecorationSet> {
    return StateField.define<DecorationSet>({
        create (state: EditorState) {
            return renderWidgets(state, [], shouldHandleNode, createWidget)
        },
        update (_, transaction) {
            return renderWidgets(transaction.state, [], shouldHandleNode, createWidget)
        },
        provide: f => EditorView.decorations.from(f)
    })
}

function renderWidgets (
    state: EditorState,
    visibleRanges: ReadonlyArray<{ from: number, to: number }>,
    shouldHandleNode: (node: SyntaxNodeRef) => boolean,
    createWidget: (state: EditorState, node: SyntaxNodeRef) => WidgetType|undefined
): DecorationSet {
    const widgets: any[] = []

    if (visibleRanges.length === 0) {
        visibleRanges = [{ from: 0, to: state.doc.length }]
    }

    for (const { from, to } of visibleRanges) {
        syntaxTree(state).iterate({
            from,
            to,
            enter: (node) => {
                if (!shouldHandleNode(node)) {
                    return
                }

                const renderedWidget = createWidget(state, node)
                if (renderedWidget === undefined) {
                    return
                }
                const widget = Decoration.replace({
                    widget: renderedWidget,
                    inclusive: false
                })

                widgets.push(widget.range(node.from, node.to))
            }
        })
    }

    return Decoration.set(widgets)
}

export const renderTables = renderBlockWidgets(shouldHandleNode, createWidget)