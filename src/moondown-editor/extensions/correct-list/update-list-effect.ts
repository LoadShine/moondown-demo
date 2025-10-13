// src/extensions/correct-list/update-list-effect.ts
import { StateEffect } from "@codemirror/state";

export const updateListEffect = StateEffect.define<{ from: number; to: number }>({});