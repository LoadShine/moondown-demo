// src/moondown/theme/base-theme.ts
import {HighlightStyle, syntaxHighlighting} from "@codemirror/language";
import {tags} from "@lezer/highlight";
import {EditorView} from "@codemirror/view";

// --- Light Theme Colors ---
const light = {
    rose: "#FF69B4",
    lightBlue: "#4299E1",
    purple: "#9F7AEA",
    green: "#48BB78",
    orange: "#ED8936",
    red: "#F56565",
    yellow: "#ECC94B",
    primaryText: "#2D3748",
    secondaryText: "#718096",
    background: "#FFFFFF",
    lineHighlight: "#EDF2F7",
    selection: "#BEE3F8",
    pink: "#ED64A6",
    teal: "#38B2AC",
    indigo: "#667EEA",
    marker: "#718096",
    codeBackground: "#1A202C",
    codeText: "#E2E8F0",
    codeSecondaryText: "#A0AEC0",

    // Blockquote Colors
    blockquoteColor1: "#cbd5e1", // Level 1
    blockquoteColor2: "#94a3b8", // Level 2
    blockquoteColor3: "#64748b", // Level 3
    blockquoteColorDeep: "#4b5563", // Level 4+ (a darker gray)

    inlineCodeBg: "#EDF2F7",
    slashCommandBg: "#ffffff",
    slashCommandBorder: "#e0e0e0",
    slashCommandHoverBg: "#f0f0f0",
    slashCommandSelectedBg: "#e8e8e8",
    slashCommandText: "#333",
    slashCommandIcon: "#666",
};

// --- Dark Theme Colors ---
const dark = {
    rose: "#FFA7C4",
    lightBlue: "#63B3ED",
    purple: "#B794F4",
    green: "#68D391",
    orange: "#F6AD55",
    red: "#FC8181",
    yellow: "#F6E05E",
    primaryText: "#E2E8F0",
    secondaryText: "#A0AEC0",
    background: "#1A202C",
    lineHighlight: "#2D3748",
    selection: "#4A5568",
    pink: "#FBB6CE",
    teal: "#4FD1C5",
    indigo: "#7F9CF5",
    marker: "#A0AEC0",
    codeBackground: "#2D3748",
    codeText: "#E2E8F0",
    codeSecondaryText: "#A0AEC0",

    // Blockquote Colors
    blockquoteColor1: "#475569", // Level 1
    blockquoteColor2: "#64748b", // Level 2
    blockquoteColor3: "#94a3b8", // Level 3
    blockquoteColorDeep: "#cbd5e1", // Level 4+ (a lighter gray)

    inlineCodeBg: "#2D3748",
    slashCommandBg: "#2D3748",
    slashCommandBorder: "#4A5568",
    slashCommandHoverBg: "#4A5568",
    slashCommandSelectedBg: "#718096",
    slashCommandText: "#E2E8F0",
    slashCommandIcon: "#A0AEC0",
};

const codeFont = "'Fira Code', 'Roboto Mono', monospace";

// --- Base Theme Structure ---
const createEditorTheme = (colors: typeof light | typeof dark, isDark: boolean) => {
    const animationName = isDark ? 'colorChangeDark' : 'colorChangeLight';

    return EditorView.theme({
        "&": {
            color: colors.primaryText,
            backgroundColor: colors.background,
            // Define CSS variables for blockquote styling
            "--bq-bar-width": "3px",
            "--bq-bar-gap": "12px",
            "--bq-padding-base": "12px",
            "--bq-text-gap": "16px",
            "--bq-border-radius": "8px",
            "--bq-color-1": colors.blockquoteColor1,
            "--bq-color-2": colors.blockquoteColor2,
            "--bq-color-3": colors.blockquoteColor3,
            "--bq-color-deep": colors.blockquoteColorDeep,
        },
        "&.cm-focused": {
            outline: "none",
        },
        ".cm-content": {
            fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fontSize: "16px",
            lineHeight: "1.6",
        },
        ".cm-content.cm-focused": {
            outline: "none",
        },
        ".cm-line": {
            padding: "0 8px",
        },
        ".cm-cursor": {
            borderLeftColor: colors.lightBlue,
        },
        ".cm-selectionBackground": {
            backgroundColor: colors.selection,
        },
        ".cm-gutters": {
            backgroundColor: colors.background,
            color: colors.secondaryText,
            border: "none",
            borderRight: `1px solid ${colors.lineHighlight}`,
        },
        ".cm-gutterElement": {
            padding: "0 8px 0 16px",
        },
        ".cm-foldGutter": {
            color: colors.secondaryText,
        },
        ".cm-activeLineGutter": {
            backgroundColor: colors.lineHighlight,
        },
        ".cm-activeLine": {
            backgroundColor: colors.lineHighlight,
        },
        ".cm-searchMatch": {
            backgroundColor: colors.yellow,
            outline: `1px solid ${colors.orange}`,
        },
        ".cm-selectionMatch": {
            backgroundColor: colors.selection,
        },
        ".cm-matchingBracket, .cm-nonmatchingBracket": {
            backgroundColor: `${colors.lightBlue}33`,
            outline: `1px solid ${colors.lightBlue}`,
        },

        // Syntax hiding
        ".cm-hidden-markdown": { display: "none" },
        ".cm-visible-markdown": { color: colors.secondaryText, opacity: "0.8" },

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
                backgroundColor: colors.secondaryText,
                opacity: 0.5,
                borderRadius: "1px",
            }
        },
        ".cm-hr-line-selected .cm-visible-markdown": { color: colors.secondaryText },

        ".cm-blockquote-line": {
            backgroundRepeat: "no-repeat",
            position: "relative",
        },

        ".cm-blockquote-first-line::before, .cm-blockquote-last-line::after": {
            content: '""',
            position: "absolute",
            width: "var(--bq-bar-width)",
            height: "var(--bq-border-radius)",
            left: "var(--bq-padding-base)",
            backgroundColor: "var(--bq-color-1)",
        },
        ".cm-blockquote-first-line::before": {
            top: 0,
            borderTopLeftRadius: "var(--bq-border-radius)",
        },
        ".cm-blockquote-last-line::after": {
            bottom: 0,
            borderBottomLeftRadius: "var(--bq-border-radius)",
        },

        ".cm-blockquote-line[data-bq-level]": {
            paddingLeft: "calc(var(--bq-padding-base) + (var(--data-bq-level, 1) - 1) * (var(--bq-bar-width) + var(--bq-bar-gap)) + var(--bq-bar-width) + var(--bq-text-gap))",
        },
        ...(() => {
            const styles: { [selector: string]: any } = {};
            const MAX_UNIQUE_COLORS = 3;
            for (let i = 1; i <= 10; i++) {
                const gradients = [];
                const positions = [];
                for (let j = 1; j <= i; j++) {
                    const colorVar = j <= MAX_UNIQUE_COLORS ? `var(--bq-color-${j})` : 'var(--bq-color-deep)';
                    gradients.push(`linear-gradient(${colorVar}, ${colorVar})`);

                    const position = j === 1
                        ? 'var(--bq-padding-base) 0'
                        : `calc(var(--bq-padding-base) + (${j - 1}) * (var(--bq-bar-width) + var(--bq-bar-gap))) 0`;
                    positions.push(position);
                }
                styles[`.cm-blockquote-line[data-bq-level='${i}']`] = {
                    '--data-bq-level': i,
                    backgroundImage: gradients.join(', '),
                    backgroundSize: Array(i).fill('var(--bq-bar-width) 100%').join(', '),
                    backgroundPosition: positions.join(', '),
                };
            }
            return styles;
        })(),

        // Code block styling
        ".cm-fenced-code": {
            backgroundColor: 'transparent',
            position: 'relative',
            color: colors.codeText,
            fontFamily: codeFont,
            padding: "0 12px",
            fontSize: "14px",
            lineHeight: "1.5",
        },
        ".cm-fenced-code::before": {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundColor: colors.codeBackground,
            zIndex: -1,
        },

        ".cm-blockquote-line[data-bq-level].cm-fenced-code::before": {
            left: "calc(var(--bq-padding-base) + (var(--data-bq-level, 1) - 1) * (var(--bq-bar-width) + var(--bq-bar-gap)) + var(--bq-bar-width) + var(--bq-text-gap))",
            right: "8px",
            top: 0,
            bottom: 0,
        },

        // List styling
        ".cm-bullet-list": { color: colors.marker, fontWeight: "bold" },
        ".cm-ordered-list-marker, .cm-ordered-list-marker > span": {
            color: `${colors.primaryText} !important`,
            fontFamily: "inherit !important"
        },

        // Widget styles
        ".cm-inline-code-widget": {
            fontFamily: codeFont,
            background: colors.inlineCodeBg,
            color: colors.primaryText,
            padding: "0 4px",
            margin: "0 4px",
            borderRadius: "3px",
            display: "inline-block",
        },
        ".cm-link-widget": {
            textDecoration: "none",
            color: colors.lightBlue,
            borderBottom: `1px solid ${colors.lightBlue}`,
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
            color: colors.secondaryText,
            fontSize: '0.75em',
            fontWeight: '400',
        },
        ".cm-image-widget.selected": {
            outline: "2px solid #e11d48",
            borderRadius: "8px",
        },
        '.cm-image-placeholder': {
            background: colors.lineHighlight,
            border: `2px dashed ${colors.secondaryText}`,
            borderRadius: '12px',
            color: colors.secondaryText,
        },
        ".cm-image-error": {
            padding: '0.75em',
            color: colors.red,
            fontSize: '0.9em',
            background: `${colors.red}20`,
            borderRadius: '8px',
            marginTop: '0.5em',
        },
        ".cm-strikethrough-widget": { textDecoration: "line-through", color: colors.secondaryText },
        ".cm-highlight-widget": { backgroundColor: "#FEFCBF", color: "#5c5400", padding: "2px 4px", borderRadius: "4px" },
        ".cm-underline-widget": { textDecoration: "underline", color: colors.secondaryText },

        // Slash Command
        ".cm-slash-command-menu": {
            position: "absolute",
            zIndex: 100,
            backgroundColor: colors.slashCommandBg,
            border: `1px solid ${colors.slashCommandBorder}`,
            borderRadius: "6px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            padding: "8px 0",
            maxHeight: "300px",
            overflow: "hidden auto",
            fontFamily: "Arial, sans-serif",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
        },
        ".cm-slash-command-item": {
            padding: "8px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            transition: "background-color 0.2s",
            "&:hover": { backgroundColor: colors.slashCommandHoverBg },
            "&.selected": { backgroundColor: colors.slashCommandSelectedBg },
        },
        ".cm-slash-command-icon": {
            marginRight: "12px",
            display: "flex",
            alignItems: "center",
            "& svg": { width: "16px", height: "16px", color: colors.slashCommandIcon },
        },
        ".cm-slash-command-title": { fontSize: "14px", color: colors.slashCommandText },
        ".cm-slash-command-divider": { margin: "8px 0", border: "none", borderTop: `1px solid ${colors.slashCommandBorder}` },

        // AI Ghost Writer
        ".cm-new-text": { animation: `${animationName} 2s forwards` },
        ".cm-loading-widget": {
            display: "inline-flex",
            alignItems: "center",
            padding: "2px 5px",
            backgroundColor: colors.lineHighlight,
            borderRadius: "3px",
            fontSize: "12px",
            color: colors.secondaryText,
        },
        ".cm-loading-spinner": {
            display: "inline-block",
            width: "12px",
            height: "12px",
            marginRight: "5px",
            border: `2px solid ${colors.secondaryText}`,
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
        },

        [`@keyframes ${animationName}`]: {
            "0%, 99%": { color: colors.rose, opacity: 0.7 },
            "100%": { color: colors.primaryText, opacity: 1 },
        },
        "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
        },
    }, {dark: isDark});
}

// --- Syntax Highlighting Styles ---
const createHighlightStyle = (colors: typeof light | typeof dark) => HighlightStyle.define([
    {tag: tags.heading1, fontWeight: "800", fontSize: "2em", color: colors.primaryText},
    {tag: tags.heading2, fontWeight: "700", fontSize: "1.5em", color: colors.primaryText},
    {tag: tags.heading3, fontWeight: "600", fontSize: "1.17em", color: colors.primaryText},
    {tag: tags.link, color: colors.lightBlue},
    {tag: tags.emphasis, fontStyle: "italic"},
    {tag: tags.strong, fontWeight: "bold"},
    {tag: tags.keyword, color: colors.purple, fontFamily: codeFont},
    {tag: tags.atom, color: colors.pink, fontFamily: codeFont},
    {tag: tags.bool, color: colors.pink, fontFamily: codeFont},
    {tag: tags.url, color: colors.green, fontFamily: codeFont},
    {tag: tags.labelName, color: colors.red, fontFamily: codeFont},
    {tag: tags.inserted, color: colors.green, fontFamily: codeFont},
    {tag: tags.deleted, color: colors.red, fontFamily: codeFont},
    {tag: tags.literal, color: colors.pink, fontFamily: codeFont},
    {tag: tags.string, color: colors.green, fontFamily: codeFont},
    {tag: tags.number, color: colors.pink, fontFamily: codeFont},
    {tag: [tags.regexp, tags.escape, tags.special(tags.string)], color: colors.pink, fontFamily: codeFont},
    {tag: tags.definition(tags.propertyName), color: colors.teal, fontFamily: codeFont},
    {tag: tags.function(tags.variableName), color: colors.indigo, fontFamily: codeFont},
    {tag: tags.typeName, color: colors.yellow, fontFamily: codeFont},
    {tag: tags.className, color: colors.yellow, fontFamily: codeFont},
    {tag: tags.comment, color: colors.secondaryText, fontStyle: "italic", fontFamily: codeFont},
    {tag: tags.meta, color: colors.purple, fontFamily: codeFont},
    {tag: tags.invalid, color: colors.red, fontFamily: codeFont},
    {tag: tags.variableName, color: colors.indigo, fontFamily: codeFont},
    {tag: tags.operator, color: colors.purple, fontFamily: codeFont},
    {tag: tags.punctuation, color: colors.primaryText, fontFamily: codeFont},
    {tag: tags.bracket, color: colors.primaryText, fontFamily: codeFont},
    {tag: tags.tagName, color: colors.red, fontFamily: codeFont},
    {tag: tags.attributeName, color: colors.teal, fontFamily: codeFont},
    {tag: tags.attributeValue, color: colors.green, fontFamily: codeFont},
]);

// --- Export Light Theme ---
export const editorLightTheme = createEditorTheme(light, false);
export const lightHighlightStyle = createHighlightStyle(light);
export const lightTheme = [
    editorLightTheme,
    syntaxHighlighting(lightHighlightStyle)
];

// --- Export Dark Theme ---
export const editorDarkTheme = createEditorTheme(dark, true);
export const darkHighlightStyle = createHighlightStyle(dark);
export const darkTheme = [
    editorDarkTheme,
    syntaxHighlighting(darkHighlightStyle)
];