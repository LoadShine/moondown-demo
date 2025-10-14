// src/moondown/extensions/markdown-syntax-hiding/range-set-builder.ts
import {Decoration, type DecorationSet} from '@codemirror/view';

export class RangeSetBuilder<T extends Decoration> {
    private ranges: { from: number; to: number; value: T }[] = [];

    add(from: number, to: number, value: T) {
        this.ranges.push({from, to, value});
    }

    finish(): DecorationSet {
        return Decoration.set(this.ranges.map(({from, to, value}) => value.range(from, to)));
    }
}