// src/extensions/bubble-menu/bubble-menu.ts
import {EditorView, ViewUpdate, type PluginValue} from "@codemirror/view"
import {EditorState} from "@codemirror/state"
import * as icons from 'lucide'
import {createPopper, type Instance as PopperInstance, type VirtualElement} from '@popperjs/core';
import type {BubbleMenuItem} from "./types.ts";
import {bubbleMenuField, showBubbleMenu} from "./fields.ts";
import {
    isHeaderActive, isInlineStyleActive,
    isListActive,
    setHeader,
    toggleInlineStyle,
    toggleList
} from "./content-functions.ts";

export class BubbleMenu implements PluginValue {
    dom: HTMLElement;
    items: BubbleMenuItem[];
    view: EditorView;
    popper: PopperInstance | null;
    boundHandleMouseUp: (e: MouseEvent) => void;

    constructor(view: EditorView) {
        this.view = view;
        this.dom = document.createElement('div');
        this.dom.className = 'cm-bubble-menu';
        this.items = this.createItems();
        this.buildMenu();
        document.body.appendChild(this.dom);
        this.popper = null;
        this.boundHandleMouseUp = this.handleMouseUp.bind(this);
        document.addEventListener('mouseup', this.boundHandleMouseUp);
    }

    update(update: ViewUpdate) {
        const menu = update.state.field(bubbleMenuField);
        if (!menu) {
            this.hideBubbleMenu();
            return;
        }

        const {from, to} = update.state.selection.main;
        if (from == to || this.isImageText(update.state, from, to)) {
            this.hideBubbleMenu();
            return;
        }

        this.showBubbleMenu(from, to);
    }

    destroy() {
        if (this.popper) {
            this.popper.destroy();
        }
        this.dom.remove();
        document.removeEventListener('mouseup', this.boundHandleMouseUp);
    }

    private isImageText(state: EditorState, from: number, to: number): boolean {
        const selectedText = state.sliceDoc(from, to).trim();
        // 这里可以根据具体的Image文本格式进行更精确的判断
        return /^!\[.*?\]\(.*?\)$/.test(selectedText); // 简单的Markdown图片语法检查
    }

    private hideBubbleMenu() {
        this.dom.style.display = 'none';
        if (this.popper) {
            this.popper.destroy();
            this.popper = null;
        }
    }

    private showBubbleMenu(from: number, to: number) {
        requestAnimationFrame(() => {
            this.dom.style.display = 'flex';

            const startPos = this.view.coordsAtPos(from);
            const endPos = this.view.coordsAtPos(to);

            if (!startPos || !endPos) return;

            const virtualElement: VirtualElement = {
                getBoundingClientRect: (): DOMRect => {
                    return {
                        width: endPos.left - startPos.left,
                        height: startPos.bottom - startPos.top,
                        top: startPos.top,
                        right: endPos.right,
                        bottom: startPos.bottom,
                        left: startPos.left,
                        x: startPos.left,
                        y: startPos.top,
                        toJSON: () => {
                            return {
                                width: endPos.left - startPos.left,
                                height: startPos.bottom - startPos.top,
                                top: startPos.top,
                                right: endPos.right,
                                bottom: startPos.bottom,
                                left: startPos.left,
                                x: startPos.left,
                                y: startPos.top,
                            };
                        }
                    };
                }
            };

            if (this.popper) {
                this.popper.destroy();
            }

            this.popper = createPopper(virtualElement, this.dom, {
                placement: 'top',
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 8],
                        },
                    },
                ],
            });

            // 更新活动状态 - 修改这部分
            this.updateActiveStates();

            // 强制更新 Popper 位置
            this.popper.update();
        });
    }

    // 更新激活状态
    private updateActiveStates() {
        this.items.forEach(item => {
            // 更新主菜单项状态
            if (item.isActive) {
                const button = this.dom.querySelector(`[data-name="${item.name}"]`) as HTMLButtonElement;
                if (button) {
                    button.classList.toggle('active', item.isActive(this.view.state));
                }
            }

            // 更新子菜单项状态
            if (item.subItems) {
                item.subItems.forEach(subItem => {
                    if (subItem.isActive) {
                        // 使用更简单的选择器
                        const subButton = this.dom.querySelector(
                            `[data-name="${subItem.name}"][data-parent="${item.name}"]`
                        ) as HTMLButtonElement;

                        if (subButton) {
                            const isActive = subItem.isActive(this.view.state);
                            subButton.classList.toggle('active', isActive);
                        }
                    }
                });
            }
        });
    }

    private handleMouseUp(_event: MouseEvent) {
        const {state} = this.view;
        const {from, to} = state.selection.main;
        if (from != to && !this.isImageText(state, from, to)) {
            this.view.dispatch({
                effects: showBubbleMenu.of({pos: Math.max(from, to), items: this.items})
            });
        } else {
            this.hideBubbleMenu();
        }
    }

    private createItems(): BubbleMenuItem[] {
        return [
            {
                name: 'Heading',
                icon: 'Heading',
                type: 'dropdown',
                subItems: [
                    {
                        name: 'H1',
                        icon: 'Heading1',
                        action: view => setHeader(view, 1),
                        isActive: state => isHeaderActive(state, 1),
                    },
                    {
                        name: 'H2',
                        icon: 'Heading2',
                        action: view => setHeader(view, 2),
                        isActive: state => isHeaderActive(state, 2),
                    },
                    {
                        name: 'H3',
                        icon: 'Heading3',
                        action: view => setHeader(view, 3),
                        isActive: state => isHeaderActive(state, 3),
                    },
                ]
            },
            {
                name: 'List',
                icon: 'List',
                type: 'dropdown',
                subItems: [
                    {
                        name: 'Ordered List',
                        // @ts-expect-error ignore
                        icon: 'list-ordered',
                        action: view => toggleList(view, true),
                        isActive: state => isListActive(state, true),
                    },
                    {
                        name: 'Unordered List',
                        icon: 'List',
                        action: view => toggleList(view, false),
                        isActive: state => isListActive(state, false),
                    },
                ]
            },
            {
                name: 'bold',
                icon: "Bold",
                type: 'button',
                action: view => toggleInlineStyle(view, '**'),
                isActive: state => isInlineStyleActive(state, '**'),
            },
            {
                name: 'italic',
                icon: "Italic",
                type: 'button',
                action: view => toggleInlineStyle(view, '*'),
                isActive: state => isInlineStyleActive(state, '*'),
            },
            {
                name: 'Decoration',
                icon: 'Paintbrush',
                type: 'dropdown',
                subItems: [
                    {
                        name: 'highlight',
                        icon: "Highlighter",
                        action: view => toggleInlineStyle(view, '=='),
                        isActive: state => isInlineStyleActive(state, '=='),
                    },
                    {
                        name: 'Strikethrough',
                        icon: 'Strikethrough',
                        action: view => toggleInlineStyle(view, '~~'),
                        isActive: state => isInlineStyleActive(state, '~~'),
                    },
                    {
                        name: 'Underline',
                        icon: 'Underline',
                        action: view => toggleInlineStyle(view, '~'),
                        isActive: state => isInlineStyleActive(state, '~'),
                    },
                    {
                        name: 'Inline Code',
                        icon: 'Code',
                        action: view => toggleInlineStyle(view, '`'),
                        isActive: state => isInlineStyleActive(state, '`'),
                    },
                ]
            }
        ];
    }

    private buildMenu() {
        this.dom.innerHTML = ''; // Clear existing content

        this.items.forEach(item => {
            const button = document.createElement('button');
            button.className = 'cm-bubble-menu-item';
            button.setAttribute('data-name', item.name);
            button.setAttribute('data-type', item.type || 'button');
            button.title = item.name;

            const iconWrapper = document.createElement('span');
            iconWrapper.className = 'cm-bubble-menu-icon';
            iconWrapper.innerHTML = `<i data-lucide="${item.icon}"></i>`;
            button.appendChild(iconWrapper);

            if (item.type === 'dropdown') {
                const dropdownIcon = document.createElement('span');
                dropdownIcon.className = 'cm-bubble-menu-dropdown-icon';
                dropdownIcon.innerHTML = '<i data-lucide="chevron-down"></i>';
                button.appendChild(dropdownIcon);

                const dropdown = document.createElement('div');
                dropdown.className = 'cm-bubble-menu-dropdown';

                item.subItems?.forEach(subItem => {
                    const subButton = document.createElement('button');
                    subButton.className = 'cm-bubble-menu-sub-item';
                    subButton.setAttribute('data-name', subItem.name);
                    // 添加父项目标识，便于查询
                    subButton.setAttribute('data-parent', item.name);

                    if (subItem.icon) {
                        const subIconWrapper = document.createElement('span');
                        subIconWrapper.className = 'cm-bubble-menu-sub-icon';
                        subIconWrapper.innerHTML = `<i data-lucide="${subItem.icon}"></i>`;
                        subButton.appendChild(subIconWrapper);
                    }

                    const subLabel = document.createElement('span');
                    subLabel.className = 'cm-bubble-menu-sub-label';
                    subLabel.textContent = subItem.name;
                    subButton.appendChild(subLabel);

                    subButton.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        await subItem.action(this.view);
                        this.hideBubbleMenu();
                    });

                    dropdown.appendChild(subButton);
                });

                button.appendChild(dropdown);
            } else if (item.action) {
                button.addEventListener('click', () => {
                    item.action!(this.view);
                    this.hideBubbleMenu();
                });
            }

            this.dom.appendChild(button);
        });

        setTimeout(() => icons.createIcons({
            icons,
            attrs: {
                width: '16',
                height: '16'
            }
        }), 0);
    }
}