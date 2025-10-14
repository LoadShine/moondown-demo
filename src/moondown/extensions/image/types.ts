// src/moondown/extensions/image/types.ts
import {StateEffect} from "@codemirror/state";
import {ImageWidget} from "./image-widgets.ts";

// 类型定义
export interface ImageLoadedEffect {
    from: number;
    to: number;
    lines: number;
}

export interface ImagePlaceholderEffect {
    pos: number;
}

export interface ImageSizes {
    [key: number]: number;
}

// 状态效果定义
export const imageLoadedEffect = StateEffect.define<ImageLoadedEffect>()
export const updateImagePlaceholder = StateEffect.define<ImagePlaceholderEffect | null>()

// 图片小部件缓存
export const imageWidgetCache = new Map<string, ImageWidget>()
