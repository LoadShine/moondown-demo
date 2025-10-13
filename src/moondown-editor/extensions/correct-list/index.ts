// src/extensions/correct-list/index.ts
// src/extensions/correct-list/index.ts
import type {Extension} from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { listKeymap } from "./list-keymap.ts";
import { bulletListPlugin, updateListPlugin } from "./list-plugins";

export const correctList: Extension = [
    keymap.of(listKeymap),
    updateListPlugin,
    bulletListPlugin,
];

