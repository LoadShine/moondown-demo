// src/theme/base-theme.ts
import {HighlightStyle, syntaxHighlighting} from "@codemirror/language";
import {tags} from "@lezer/highlight";
import {EditorView} from "@codemirror/view";

// Color palette
const rose = "#FF69B4";
const lightBlue = "#4299E1";
const purple = "#9F7AEA";
const green = "#48BB78";
const orange = "#ED8936";
const red = "#F56565";
const yellow = "#ECC94B";
const primaryText = "#2D3748";
const secondaryText = "#718096";
const background = "#FFFFFF";
const lineHighlight = "#EDF2F7";
const selection = "#BEE3F8";
const pink = "#ED64A6";
const teal = "#38B2AC";
const indigo = "#667EEA";
const marker = "#718096";

// Dark theme colors for code
const darkBackground = "#1A202C";
const darkPrimaryText = "#E2E8F0";
const darkSecondaryText = "#A0AEC0";

const codeFont = "'Fira Code', 'Roboto Mono', monospace";

export const editorBaseTheme = EditorView.theme({
    "&": {
        color: primaryText,
        backgroundColor: background,
    },
    ".cm-content": {
        fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        fontSize: "16px",
        lineHeight: "1.6",
    },
    ".cm-line": {
        padding: "0 8px",
    },
    ".cm-cursor": {
        borderLeftColor: lightBlue,
    },
    ".cm-selectionBackground": {
        backgroundColor: selection,
    },
    ".cm-gutters": {
        backgroundColor: background,
        color: secondaryText,
        border: "none",
        borderRight: `1px solid ${lineHighlight}`,
    },
    ".cm-gutterElement": {
        padding: "0 8px 0 16px",
    },
    ".cm-foldGutter": {
        color: secondaryText,
    },
    ".cm-activeLineGutter": {
        backgroundColor: lineHighlight,
    },
    ".cm-activeLine": {
        backgroundColor: lineHighlight,
    },
    ".cm-searchMatch": {
        backgroundColor: yellow,
        outline: `1px solid ${orange}`,
    },
    ".cm-selectionMatch": {
        backgroundColor: selection,
    },
    ".cm-matchingBracket, .cm-nonmatchingBracket": {
        backgroundColor: `${lightBlue}33`,
        outline: `1px solid ${lightBlue}`,
    },

    // Syntax hiding
    ".cm-hidden-markdown": {
        display: "none"
    },
    ".cm-visible-markdown": {
        color: secondaryText,
        opacity: "0.8"
    },

    // Horizontal Rule Styling
    ".cm-hr-line": {
        position: "relative",
        margin: "1em 0",
        height: "2px",
        "&::after": {
            content: '""',
            position: "absolute",
            left: "8px",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            height: "2px",
            backgroundColor: "#D1D5DB",
            borderRadius: "1px",
        }
    },
    ".cm-hr-line-selected .cm-visible-markdown": {
        color: secondaryText
    },

    // Blockquote styling
    ".cm-blockquote-line": {
        position: "relative",
        backgroundColor: "#fef7f7",
        borderLeft: `4px solid ${rose}`,
        paddingLeft: "16px",
        fontStyle: "italic",
        "&::before": {
            content: '""',
            position: "absolute",
            left: "-4px",
            top: "0",
            bottom: "0",
            width: "4px",
            backgroundColor: rose,
        }
    },
    ".cm-blockquote-line-selected": {
        position: "relative",
        backgroundColor: "#fef0f0",
        borderLeft: `4px solid ${rose}`,
        paddingLeft: "16px",
        fontStyle: "italic",
        "&::before": {
            content: '""',
            position: "absolute",
            left: "-4px",
            top: "0",
            bottom: "0",
            width: "4px",
            backgroundColor: rose,
        }
    },

    // Code block styling
    ".cm-fenced-code-line": {
        backgroundColor: darkBackground,
        color: darkPrimaryText,
        fontFamily: codeFont,
        padding: "0 12px",
        borderRadius: "0",
        fontSize: "14px",
        lineHeight: "1.5",
    },
    ".cm-fenced-code-line-selected": {
        backgroundColor: "#2D3748",
        color: darkPrimaryText,
        fontFamily: codeFont,
        padding: "0 12px",
        borderRadius: "0",
        fontSize: "14px",
        lineHeight: "1.5",
    },

    // First and last line of code blocks get rounded corners
    ".cm-fenced-code-line:first-of-type": {
        borderTopLeftRadius: "6px",
        borderTopRightRadius: "6px",
        paddingTop: "8px",
    },
    ".cm-fenced-code-line:last-of-type": {
        borderBottomLeftRadius: "6px",
        borderBottomRightRadius: "6px",
        paddingBottom: "8px",
    },
    ".cm-fenced-code-line-selected:first-of-type": {
        borderTopLeftRadius: "6px",
        borderTopRightRadius: "6px",
        paddingTop: "8px",
    },
    ".cm-fenced-code-line-selected:last-of-type": {
        borderBottomLeftRadius: "6px",
        borderBottomRightRadius: "6px",
        paddingBottom: "8px",
    },

    // List styling
    ".cm-bullet-list": {
        color: marker,
        fontWeight: "bold",
    },

    ".cm-ordered-list-marker, .cm-ordered-list-marker > span": {
        color: `${primaryText} !important`,
        fontFamily: "inherit !important"
    },

    // Legacy widget styles (kept for compatibility)
    ".cm-blockquote-widget": {
        display: "block",
        width: "100%",
        borderRadius: "4px",
        padding: "8px 12px",
        margin: "8px 0",
        lineHeight: "1.4",
        whiteSpace: "pre-wrap",
        boxSizing: "border-box",
        borderLeft: `4px solid ${rose}`,
        background: "#fff5f7",
        fontStyle: "italic",
        color: "#555",
    },
    ".cm-blockcode-widget": {
        display: "block",
        width: "100%",
        borderRadius: "4px",
        padding: "8px 12px",
        margin: "8px 0",
        lineHeight: "1.4",
        whiteSpace: "pre-wrap",
        boxSizing: "border-box",
        fontFamily: codeFont,
        border: "1px solid #2D3748",
        background: darkBackground,
        color: darkPrimaryText,
    },
    ".cm-blockcode-widget pre": {
        margin: 0,
        padding: 0,
    },
    ".cm-blockcode-widget code": {
        display: "block",
        padding: "1em",
        overflow: "auto",
    },
    ".cm-inline-code-widget": {
        fontFamily: codeFont,
        background: "#EDF2F7",
        color: "#2D3748",
        padding: "0 4px",
        margin: "0 4px",
        borderRadius: "3px",
        display: "inline-block",
    },
    ".cm-link-widget": {
        textDecoration: "none",
        color: lightBlue,
        borderBottom: `1px solid ${lightBlue}`,
    },

    '.cm-image-widget': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '1.5em 0',
        position: 'relative',
        transition: 'opacity 0.3s ease',
    },
    '.cm-image-widget img': {
        maxWidth: '100%',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        margin: '0.5em',
        transition: 'box-shadow 0.3s ease',
    },
    '.cm-image-widget .cm-image-alt': {
        marginTop: '0.75em',
        color: '#999',
        fontSize: '0.75em',
        fontWeight: '400',
    },
    ".cm-image-widget.selected": {
        outline: "2px solid #e11d48",
        borderRadius: "8px",
    },
    ".cm-image-wrapper": {
        position: "relative",
        display: "inline-block",
        overflow: "visible",
    },
    '.cm-image-placeholder': {
        background: '#f5f5f5',
        border: '2px dashed #ddd',
        borderRadius: '12px',
        padding: '2em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        fontSize: '0.9em',
        transition: 'all 0.3s ease',
    },
    ".cm-image-error": {
        padding: '0.75em',
        color: '#d93025',
        fontSize: '0.9em',
        background: 'rgba(217, 48, 37, 0.05)',
        borderRadius: '8px',
        marginTop: '0.5em',
    },
    ".cm-strikethrough-widget": {
        textDecoration: "line-through",
        color: secondaryText,
    },
    ".cm-highlight-widget": {
        backgroundColor: "#FEFCBF",
        padding: "2px 4px",
        borderRadius: "4px",
    },
    ".cm-underline-widget": {
        textDecoration: "underline",
        color: "#718096",
    },

    // Syntax highlighting for code blocks
    ".cm-fenced-code-line .hljs": {
        background: "transparent !important",
        color: "inherit",
    },
    ".cm-fenced-code-line .hljs-comment, .cm-fenced-code-line .hljs-quote": {
        color: darkSecondaryText,
        fontStyle: "italic",
    },
    ".cm-fenced-code-line .hljs-keyword, .cm-fenced-code-line .hljs-selector-tag, .cm-fenced-code-line .hljs-built_in, .cm-fenced-code-line .hljs-name, .cm-fenced-code-line .hljs-tag": {
        color: "#81A1C1",
    },
    ".cm-fenced-code-line .hljs-string, .cm-fenced-code-line .hljs-title, .cm-fenced-code-line .hljs-section, .cm-fenced-code-line .hljs-attribute, .cm-fenced-code-line .hljs-literal, .cm-fenced-code-line .hljs-template-tag, .cm-fenced-code-line .hljs-template-variable, .cm-fenced-code-line .hljs-type, .cm-fenced-code-line .hljs-addition": {
        color: "#A3BE8C",
    },
    ".cm-fenced-code-line .hljs-deletion, .cm-fenced-code-line .hljs-selector-attr, .cm-fenced-code-line .hljs-selector-pseudo, .cm-fenced-code-line .hljs-meta": {
        color: "#BF616A",
    },
    ".cm-fenced-code-line .hljs-doctag": {
        color: "#8FBCBB",
    },
    ".cm-fenced-code-line .hljs-attr": {
        color: "#88C0D0",
    },
    ".cm-fenced-code-line .hljs-symbol, .cm-fenced-code-line .hljs-bullet": {
        color: "#B48EAD",
    },
    ".cm-fenced-code-line .hljs-number": {
        color: "#D08770",
    },
    ".cm-fenced-code-line .hljs-link": {
        color: "#5E81AC",
        textDecoration: "underline",
    },
    ".cm-fenced-code-line .hljs-emphasis": {
        fontStyle: "italic",
    },
    ".cm-fenced-code-line .hljs-strong": {
        fontWeight: "bold",
    },

    ".cm-slash-command-menu": {
        position: "absolute",
        zIndex: 100,
        backgroundColor: "#ffffff",
        border: "1px solid #e0e0e0",
        borderRadius: "6px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "8px 0",
        maxHeight: "300px",
        overflow: "hidden auto",
        fontFamily: "Arial, sans-serif",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
    },
    ".cm-slash-command-menu::-webkit-scrollbar": {
        display: "none",
    },

    ".cm-slash-command-item": {
        padding: "8px 16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        transition: "background-color 0.2s",
    },
    ".cm-slash-command-item:hover": {
        backgroundColor: "#f0f0f0",
    },
    ".cm-slash-command-item.selected": {
        backgroundColor: "#e8e8e8",
    },

    ".cm-slash-command-icon": {
        marginRight: "12px",
        display: "flex",
        alignItems: "center",
    },
    ".cm-slash-command-icon svg": {
        width: "16px",
        height: "16px",
        color: "#666",
    },
    ".cm-slash-command-title": {
        fontSize: "14px",
        color: "#333",
    },
    ".cm-slash-command-divider": {
        margin: "8px 0",
        border: "none",
        borderTop: "1px solid #e0e0e0",
    },

    ".cm-new-text": {
        animation: "colorChange 2s forwards",
    },

    ".cm-loading-widget": {
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 5px",
        backgroundColor: "#f0f0f0",
        borderRadius: "3px",
        fontSize: "12px",
        color: "#666",
    },

    ".cm-loading-spinner": {
        display: "inline-block",
        width: "12px",
        height: "12px",
        marginRight: "5px",
        border: "2px solid #666",
        borderTopColor: "transparent",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },

    "@keyframes colorChange": {
        "0%, 99%": {
            color: "#e11d48",
            opacity: 0.7,
        },
        "100%": {
            color: "#333333",
            opacity: 1,
        }
    },

    "@keyframes spin": {
        "0%": {
            transform: "rotate(0deg)",
        },
        "100%": {
            transform: "rotate(360deg)",
        }
    },
}, {dark: false});

export const highlightStyles = HighlightStyle.define([
    {tag: tags.heading1, fontWeight: "800", fontSize: "2em", color: primaryText},
    {tag: tags.heading2, fontWeight: "700", fontSize: "1.5em", color: primaryText},
    {tag: tags.heading3, fontWeight: "600", fontSize: "1.17em", color: primaryText},
    {tag: tags.heading4, fontWeight: "600", fontSize: "1em", color: primaryText},
    {tag: tags.heading5, fontWeight: "600", fontSize: "0.83em", color: primaryText},
    {tag: tags.heading6, fontWeight: "600", fontSize: "0.67em", color: primaryText},
    {tag: tags.link, color: lightBlue},
    {tag: tags.emphasis, fontStyle: "italic"},
    {tag: tags.strong, fontWeight: "bold"},
    {tag: tags.keyword, color: purple, fontFamily: codeFont},
    {tag: tags.atom, color: pink, fontFamily: codeFont},
    {tag: tags.bool, color: pink, fontFamily: codeFont},
    {tag: tags.url, color: green, fontFamily: codeFont},
    {tag: tags.labelName, color: red, fontFamily: codeFont},
    {tag: tags.inserted, color: green, fontFamily: codeFont},
    {tag: tags.deleted, color: red, fontFamily: codeFont},
    {tag: tags.literal, color: pink, fontFamily: codeFont},
    {tag: tags.string, color: green, fontFamily: codeFont},
    {tag: tags.number, color: pink, fontFamily: codeFont},
    {tag: [tags.regexp, tags.escape, tags.special(tags.string)], color: pink, fontFamily: codeFont},
    {tag: tags.definition(tags.propertyName), color: teal, fontFamily: codeFont},
    {tag: tags.function(tags.variableName), color: indigo, fontFamily: codeFont},
    {tag: tags.typeName, color: yellow, fontFamily: codeFont},
    {tag: tags.className, color: yellow, fontFamily: codeFont},
    {tag: tags.comment, color: secondaryText, fontStyle: "italic", fontFamily: codeFont},
    {tag: tags.meta, color: purple, fontFamily: codeFont},
    {tag: tags.invalid, color: red, fontFamily: codeFont},
    {tag: tags.variableName, color: indigo, fontFamily: codeFont},
    {tag: tags.operator, color: purple, fontFamily: codeFont},
    {tag: tags.punctuation, color: primaryText, fontFamily: codeFont},
    {tag: tags.bracket, color: primaryText, fontFamily: codeFont},
    {tag: tags.tagName, color: red, fontFamily: codeFont},
    {tag: tags.attributeName, color: teal, fontFamily: codeFont},
    {tag: tags.attributeValue, color: green, fontFamily: codeFont},
    {tag: tags.processingInstruction, color: marker, fontFamily: codeFont},
    {tag: tags.documentMeta, color: lightBlue, fontFamily: codeFont},
    {tag: tags.definition(tags.typeName), color: yellow, fontFamily: codeFont},
    {tag: tags.moduleKeyword, color: purple, fontFamily: codeFont},
    {tag: tags.special(tags.brace), color: purple, fontFamily: codeFont},
    {tag: tags.namespace, color: lightBlue, fontFamily: codeFont},
    {tag: tags.macroName, color: purple, fontFamily: codeFont},
    {tag: tags.changed, color: orange, fontFamily: codeFont},
]);

export const baseTheme = [
    syntaxHighlighting(highlightStyles),
    editorBaseTheme
];