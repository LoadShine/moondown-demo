// src/extensions/fenced-code/language-autocomplete.ts
import {autocompletion, CompletionContext} from "@codemirror/autocomplete";

// 定义语言列表，用于自动补全
const languageNames = [
    {label: "javascript", type: "keyword"},
    {label: "python", type: "keyword"},
    {label: "java", type: "keyword"},
    {label: "csharp", type: "keyword"},
    {label: "cpp", type: "keyword"},
    {label: "ruby", type: "keyword"},
    {label: "go", type: "keyword"},
]

// 定义自动补全源，只在 ``` 后的语言标识符位置提供补全
function languageIdentifierCompletion(context: CompletionContext) {
    const {state, pos} = context
    const line = state.doc.lineAt(pos)
    const lineStart = line.from
    const beforeCursor = state.doc.sliceString(lineStart, pos)

    // 检查当前行是否以 ``` 开头，并捕获输入的语言标识符
    const tripleBacktickMatch = /^```([^\s`]*)$/.exec(beforeCursor)
    if (tripleBacktickMatch) {
        const word = tripleBacktickMatch[1]

        // 返回匹配的语言列表
        return {
            from: lineStart + 3, // 光标在 ``` 之后的位置
            to: pos,
            options: languageNames.filter(lang => lang.label.startsWith(word)),
            validFor: /^([^\s`]*)$/ // 当输入或删除字符时保持自动补全
        }
    }

    return null
}

// 创建自动补全扩展
export const languageIdentifierAutocomplete = autocompletion({
    override: [languageIdentifierCompletion]
})
