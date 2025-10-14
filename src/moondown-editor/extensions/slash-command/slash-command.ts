// src/extensions/slash-command/slash-command.ts
import {EditorView, ViewPlugin, ViewUpdate} from "@codemirror/view"
import {createIcons, icons} from 'lucide'
import {slashCommandState, toggleSlashCommand} from "./fields.ts";
import {type SlashCommandOption, slashCommands} from "./commands.ts";

export const slashCommandPlugin = ViewPlugin.fromClass(class {
    menu: HTMLElement
    debounceTimer: number | null = null
    currentAbortController: AbortController | null = null

    constructor(view: EditorView) {
        this.menu = document.createElement("div")
        this.menu.className = "cm-slash-command-menu"
        view.dom.appendChild(this.menu)

        // Add click event listener to the editor
        view.dom.addEventListener('click', () => {
            this.abortAIContinuation()
        })

        document.addEventListener('click', (e) => {
            if (!this.menu.contains(e.target as Node) && !view.dom.contains(e.target as Node)) {
                view.dispatch({
                    effects: toggleSlashCommand.of(false)
                })
                this.abortAIContinuation()
            }
        })
    }

    update(update: ViewUpdate) {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer)
        }

        this.debounceTimer = setTimeout(() => {
            this.updateMenu(update)
        }, 10) as unknown as number
    }

    updateMenu(update: ViewUpdate) {
        const state = update.state.field(slashCommandState)
        if (!state.active) {
            this.menu.style.display = "none"
            return
        }

        this.menu.style.display = "block"

        requestAnimationFrame(() => {
            const pos = update.view.coordsAtPos(state.pos)
            if (pos) {
                const editorRect = update.view.dom.getBoundingClientRect()
                const menuRect = this.menu.getBoundingClientRect()

                // 检查菜单是否超出编辑器底部
                if (pos.top + menuRect.height > editorRect.bottom) {
                    // 如果超出，将菜单位置调整到光标上方
                    this.menu.style.top = `${pos.top - editorRect.top - menuRect.height}px`
                } else {
                    // 如果没有超出，将菜单位置设置在光标下方
                    this.menu.style.top = `${pos.top - editorRect.top + 20}px`
                }

                this.menu.style.left = `${pos.left - editorRect.left}px`
            }
        })

        const filteredCommands = slashCommands.filter(cmd =>
            cmd.title.toLowerCase().includes(state.filterText.toLowerCase())
        )

        requestAnimationFrame(() => {
            const fragment = document.createDocumentFragment()

            filteredCommands.forEach((cmd, index) => {
                if (cmd.title === "divider") {
                    const divider = document.createElement("hr")
                    divider.className = "cm-slash-command-divider"
                    fragment.appendChild(divider)
                    return
                }

                const item = document.createElement("div")
                item.className = `cm-slash-command-item ${index === state.selectedIndex ? 'selected' : ''}`

                const icon = document.createElement("span")
                icon.className = "cm-slash-command-icon"
                icon.innerHTML = `<i data-lucide="${cmd.icon}"></i>`

                const title = document.createElement("span")
                title.className = "cm-slash-command-title"
                title.textContent = cmd.title

                item.appendChild(icon)
                item.appendChild(title)

                item.addEventListener("mousedown", (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    this.executeCommand(update.view, cmd, state.pos)
                })
                fragment.appendChild(item)
            })

            this.menu.innerHTML = ''
            this.menu.appendChild(fragment)

            // 创建 Lucide 图标
            createIcons({
                icons,
                attrs: {
                    width: '16',
                    height: '16'
                },
            })

            // 确保选中的项目在可视区域内
            this.scrollSelectedIntoView()
        })
    }

    scrollSelectedIntoView() {
        const selectedItem = this.menu.querySelector('.cm-slash-command-item.selected') as HTMLElement
        if (selectedItem) {
            const menuRect = this.menu.getBoundingClientRect()
            const selectedRect = selectedItem.getBoundingClientRect()

            if (selectedRect.top < menuRect.top) {
                this.menu.scrollTop = selectedItem.offsetTop
            } else if (selectedRect.bottom > menuRect.bottom) {
                this.menu.scrollTop = selectedItem.offsetTop + selectedItem.offsetHeight - this.menu.clientHeight
            }
        }
    }

    executeCommand(view: EditorView, cmd: SlashCommandOption, pos: number) {
        view.dispatch({
            changes: {from: pos, to: view.state.selection.main.from, insert: ""},
            effects: toggleSlashCommand.of(false)
        })
        const result = cmd.execute(view)
        if (result instanceof Promise) {
            result.then(controller => {
                if (controller instanceof AbortController) {
                    this.currentAbortController = controller
                }
            })
        }
        view.focus()
    }

    setCurrentAbortController(controller: AbortController) {
        this.currentAbortController = controller
    }

    clearCurrentAbortController() {
        this.currentAbortController = null
    }

    abortAIContinuation() {
        if (this.currentAbortController) {
            this.currentAbortController.abort()
            this.currentAbortController = null
        }
    }

    destroy() {
        this.menu.remove()
        this.abortAIContinuation()
    }
})
