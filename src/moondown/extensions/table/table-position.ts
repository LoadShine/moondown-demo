// src/moondown/extensions/table/table-position.ts
import {StateEffect, StateField} from "@codemirror/state";

export const updateTablePosition = StateEffect.define<{id: number, from: number, to: number}>()

export const tablePositions = StateField.define<Map<number, {from: number, to: number}>>({
    create: () => new Map(),
    update(value, tr) {
        const newValue = new Map(value)
        for (const effect of tr.effects) {
            if (effect.is(updateTablePosition)) {
                newValue.set(effect.value.id, {from: effect.value.from, to: effect.value.to})
            }
        }
        return newValue
    }
})