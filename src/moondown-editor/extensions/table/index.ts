// src/extensions/table/index.ts
import {Compartment, type Extension} from "@codemirror/state";
import {tablePositions} from "./table-position.ts";
import {renderTables} from "./render-tables.ts";

export const tableExtension: Extension = [
    tablePositions,
    (new Compartment()).of(renderTables)
];