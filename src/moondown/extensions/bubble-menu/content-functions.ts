// src/moondown/extensions/bubble-menu/content-functions.ts
import {EditorView} from "@codemirror/view";
import {EditorState} from "@codemirror/state";

export function setHeader(view: EditorView, level: number): boolean {
    const {state, dispatch} = view;
    const changes = [];
    const headerPrefix = '#'.repeat(level) + ' ';
    const {from, to} = state.selection.main;

    for (let pos = from; pos <= to;) {
        const line = state.doc.lineAt(pos);

        if (line.text.startsWith(headerPrefix)) {
            changes.push({from: line.from, to: line.from + headerPrefix.length, insert: ''});
        } else {
            const existingHeaderMatch = line.text.match(/^#+\s/);
            if (existingHeaderMatch) {
                changes.push({
                    from: line.from,
                    to: line.from + existingHeaderMatch[0].length,
                    insert: headerPrefix
                });
            } else {
                changes.push({from: line.from, insert: headerPrefix});
            }
        }

        if (line.to + 1 > to) break;
        pos = line.to + 1;
    }

    if (changes.length > 0) {
        dispatch({changes});
    }

    return true;
}

export function  toggleList(view: EditorView, ordered: boolean): boolean {
    const {state, dispatch} = view;
    const changes = [];
    const orderedListRegex = /^(\d+)\.\s/;
    const unorderedListRegex = /^-\s/;
    const {from, to} = state.selection.main;

    // 获取选中范围的起始行
    const fromLine = state.doc.lineAt(from);
    let currentNumber = 1;

    // 检查选中范围之前的行
    if (fromLine.number > 1) {
        const prevLine = state.doc.line(fromLine.number - 1);
        const prevLineMatch = prevLine.text.match(orderedListRegex);
        if (prevLineMatch) {
            currentNumber = parseInt(prevLineMatch[1]) + 1;
        }
    }

    for (let pos = from; pos <= to;) {
        const line = state.doc.lineAt(pos);
        const lineText = line.text;

        if (ordered) {
            const match = lineText.match(orderedListRegex);
            if (match) {
                // 如果已经是有序列表，则移除
                changes.push({from: line.from, to: line.from + match[0].length, insert: ''});
            } else {
                // 添加新的有序列表标记
                changes.push({from: line.from, insert: `${currentNumber}. `});
                currentNumber++;
            }
        } else {
            if (unorderedListRegex.test(lineText)) {
                // 移除无序列表标记
                changes.push({from: line.from, to: line.from + 2, insert: ''});
            } else {
                // 添加无序列表标记
                changes.push({from: line.from, insert: '- '});
            }
        }

        if (line.to + 1 > to) break;
        pos = line.to + 1;
    }

    if (changes.length > 0) {
        dispatch({changes});
    }

    return true;
}

export function  toggleInlineStyle(view: EditorView, mark: string): boolean {
    const {state, dispatch} = view;
    const {from, to} = state.selection.main;
    const doc = state.doc;

    const extraChars = mark.length * 3;
    const start = Math.max(0, from - extraChars);
    const end = Math.min(doc.length, to + extraChars);

    const textToCheck = doc.sliceString(start, end);

    const escapedMark = escapeRegExp(mark);
    const regex = new RegExp(`(${escapedMark}+)([\\s\\S]*?)\\1`, 'g');

    const markerLength = mark.length;

    const changes = [];
    let match;
    let found = false;

    // 检查是否是加粗转斜体或加粗斜体转加粗的特殊情况
    if (mark === '*') {
        const boldOrBoldItalicRegex = /(\*{2,3})([^*]+)\1/g;
        while ((match = boldOrBoldItalicRegex.exec(textToCheck)) !== null) {
            const matchStart = start + match.index;
            const matchEnd = matchStart + match[0].length;
            if (matchStart <= from && to <= matchEnd) {
                const existingMarkers = match[1];
                if (existingMarkers === '**') {
                    // 加粗转加粗斜体
                    changes.push(
                        {from: matchStart, to: matchStart + 2, insert: '***'},
                        {from: matchEnd - 2, to: matchEnd, insert: '***'}
                    );
                } else if (existingMarkers === '***') {
                    // 加粗斜体转加粗
                    changes.push(
                        {from: matchStart, to: matchStart + 3, insert: '**'},
                        {from: matchEnd - 3, to: matchEnd, insert: '**'}
                    );
                }
                found = true;
                break;
            }
        }
    }

    if (!found) {
        while ((match = regex.exec(textToCheck)) !== null) {
            const fullMarkerLength = match[1].length;
            if (fullMarkerLength % markerLength !== 0) {
                continue;
            }
            const matchStart = start + match.index;
            const matchEnd = matchStart + match[0].length;

            if (matchStart <= from && to <= matchEnd) {
                // Remove one layer of markers
                const removeStart = matchStart;
                const removeEnd = matchEnd;

                changes.push(
                    {from: removeStart, to: removeStart + markerLength, insert: ''},
                    {from: removeEnd - markerLength, to: removeEnd, insert: ''}
                );
                found = true;
                break;
            }
        }
    }

    if (!found) {
        // Check for combined styles
        const combinedRegex = /(\*{1,3}|_{1,3}|~~|==)([^*_~=]+)\1/g;
        while ((match = combinedRegex.exec(textToCheck)) !== null) {
            const matchStart = start + match.index;
            const matchEnd = matchStart + match[0].length;

            if (matchStart <= from && to <= matchEnd) {
                const existingMarkers = match[1];
                if (existingMarkers.includes(mark)) {
                    // Remove the mark from existing markers
                    const newMarkers = existingMarkers.replace(mark, '');
                    changes.push(
                        {from: matchStart, to: matchStart + existingMarkers.length, insert: newMarkers},
                        {from: matchEnd - existingMarkers.length, to: matchEnd, insert: newMarkers}
                    );
                } else {
                    // Add the mark to existing markers
                    changes.push(
                        {from: matchStart, to: matchStart + existingMarkers.length, insert: existingMarkers + mark},
                        {from: matchEnd - existingMarkers.length, to: matchEnd, insert: mark + existingMarkers}
                    );
                }
                found = true;
                break;
            }
        }
    }

    if (!found) {
        // Add markers
        changes.push(
            {from, insert: mark},
            {from: to, insert: mark}
        );
    }

    dispatch({changes});
    return true;
}

export function  insertLink(view: EditorView): boolean {
    const {state, dispatch} = view;
    const {from, to} = state.selection.main;
    const selectedText = state.sliceDoc(from, to);
    const linkText = selectedText || 'Link text';
    const linkUrl = 'https://example.com';

    dispatch({
        changes: {from, to, insert: `[${linkText}](${linkUrl})`}
    });
    return true;
}

export function  insertImage(view: EditorView): boolean {
    const {state, dispatch} = view;
    const {from} = state.selection.main;

    dispatch({
        changes: {from, insert: '![Alt text](image_url)'}
    });
    return true;
}

export function  insertTable(view: EditorView): boolean {
    const {state, dispatch} = view;
    const {from} = state.selection.main;
    const tableTemplate = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1, Col 1 | Row 1, Col 2 | Row 1, Col 3 |
| Row 2, Col 1 | Row 2, Col 2 | Row 2, Col 3 |
`;

    dispatch({
        changes: {from, insert: tableTemplate}
    });
    return true;
}

export function  isHeaderActive(state: EditorState, level: number): boolean {
    const {from} = state.selection.main;
    const line = state.doc.lineAt(from);
    return new RegExp(`^#{${level}}\\s`).test(line.text);
}

export function  isInlineStyleActive(state: EditorState, marker: string): boolean {
    const {from, to} = state.selection.main;
    const doc = state.doc;

    const extraChars = marker.length * 3; // 增加额外字符以处理组合标记
    const start = Math.max(0, from - extraChars);
    const end = Math.min(doc.length, to + extraChars);

    const textToCheck = doc.sliceString(start, end);

    const escapedMarker = escapeRegExp(marker);

    // 使用更精确的正则表达式来匹配标记
    const regex = new RegExp(`(?<!\\${marker[0]})${escapedMarker}([^${escapedMarker}]+)${escapedMarker}(?!\\${marker[0]})`, 'g');

    let match;
    while ((match = regex.exec(textToCheck)) !== null) {
        const matchStart = start + match.index;
        const matchEnd = matchStart + match[0].length;

        if (matchStart <= from && to <= matchEnd) {
            return true;
        }
    }

    // 处理加粗斜体的情况
    if (marker === '**' || marker === '*') {
        const boldItalicRegex = /\*{3}([^*]+)\*{3}/g;
        while ((match = boldItalicRegex.exec(textToCheck)) !== null) {
            const matchStart = start + match.index;
            const matchEnd = matchStart + match[0].length;

            if (matchStart <= from && to <= matchEnd) {
                return true;
            }
        }
    }

    return false;
}

export function  escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function  isListActive(state: EditorState, ordered: boolean): boolean {
    const {from} = state.selection.main;
    const line = state.doc.lineAt(from);
    const listRegex = ordered ? /^\d+\.\s/ : /^-\s/;
    return listRegex.test(line.text);
}