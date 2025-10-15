// src/moondown/core/types/editor-types.ts

import type { EditorView } from "@codemirror/view";
import type { EditorState } from "@codemirror/state";

/**
 * Core type definitions for the editor
 */

/** Theme options */
export type Theme = 'light' | 'dark';

/** Editor configuration options */
export interface EditorConfig {
  /** Initial document content */
  initialDoc?: string;
  /** Initial theme */
  theme?: Theme;
  /** Enable syntax hiding */
  syntaxHiding?: boolean;
}

/** Position range in the document */
export interface Range {
  from: number;
  to: number;
}

/** Text selection with content */
export interface Selection extends Range {
  text: string;
}

/** Coordinates in the viewport */
export interface Coordinates {
  x: number;
  y: number;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
}

/** Line information */
export interface LineInfo {
  number: number;
  from: number;
  to: number;
  text: string;
  length: number;
}

/** Action handler function type */
export type ActionHandler = (view: EditorView) => boolean | Promise<boolean>;

/** State checker function type */
export type StateChecker = (state: EditorState) => boolean;

/** Event handler function type */
export type EventHandler<T extends Event = Event> = (event: T, view: EditorView) => boolean | void;
