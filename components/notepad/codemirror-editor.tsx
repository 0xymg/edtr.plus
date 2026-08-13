"use client"

import React from "react"
import { EditorState, Compartment } from "@codemirror/state"
import {
    EditorView,
    keymap,
    lineNumbers,
    drawSelection,
    dropCursor,
    rectangularSelection,
    highlightActiveLine,
    highlightActiveLineGutter,
    placeholder as cmPlaceholder,
} from "@codemirror/view"
import {
    defaultKeymap,
    history,
    historyKeymap,
    indentWithTab,
} from "@codemirror/commands"
import {
    indentUnit,
    syntaxHighlighting,
    HighlightStyle,
    LanguageDescription,
} from "@codemirror/language"
import { search, openSearchPanel, closeSearchPanel, highlightSelectionMatches } from "@codemirror/search"
import { languages as languageData } from "@codemirror/language-data"
import { tags as t } from "@lezer/highlight"

// Imperative surface the rest of the app talks to. The document lives inside
// CodeMirror while a tab is active; React state receives debounced copies,
// and anything that needs the exact current text (save, download, format)
// reads it synchronously through this handle.
export interface EditorHandle {
    focus: () => void
    getValue: () => string
    setValue: (value: string) => void
    /** Select a document range and scroll it into view (command palette jumps). */
    reveal: (from: number, to: number) => void
}

interface CodeMirrorEditorProps {
    editorRef: React.MutableRefObject<EditorHandle | null>
    value: string
    language: string
    wordWrap: boolean
    onChange: (value: string) => void
    onFocusChange?: (focused: boolean) => void
}

// Map our language ids to @codemirror/language-data names/aliases.
const LANGUAGE_ALIASES: Record<string, string> = {
    plaintext: "",
    svg: "xml",
    bash: "shell",
}

// Syntax colors come from CSS variables (defined in globals.css for light
// and dark), so the theme toggle keeps working without reconfiguring CM.
const highlightStyle = HighlightStyle.define([
    { tag: [t.keyword, t.moduleKeyword, t.operatorKeyword], color: "var(--syn-keyword)" },
    { tag: [t.string, t.special(t.string), t.regexp], color: "var(--syn-string)" },
    { tag: [t.number, t.bool, t.null, t.atom], color: "var(--syn-number)" },
    { tag: [t.comment, t.blockComment, t.lineComment], color: "var(--syn-comment)", fontStyle: "italic" },
    { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "var(--syn-function)" },
    { tag: [t.typeName, t.className, t.namespace], color: "var(--syn-type)" },
    { tag: [t.propertyName, t.attributeName], color: "var(--syn-property)" },
    { tag: [t.tagName, t.angleBracket], color: "var(--syn-tag)" },
    { tag: [t.variableName, t.definition(t.variableName)], color: "var(--syn-variable)" },
    { tag: t.heading, color: "var(--syn-keyword)", fontWeight: "bold" },
    { tag: t.link, color: "var(--syn-string)", textDecoration: "underline" },
    { tag: t.strong, fontWeight: "bold" },
    { tag: t.emphasis, fontStyle: "italic" },
])

const editorTheme = EditorView.theme({
    "&": {
        height: "100%",
        fontSize: "var(--cm-font-size, 14px)",
        backgroundColor: "transparent",
        color: "var(--foreground)",
    },
    ".cm-scroller": {
        fontFamily: "var(--cm-font-family, monospace)",
        lineHeight: "1.6",
        overflow: "auto",
        overscrollBehavior: "contain",
    },
    ".cm-content": {
        caretColor: "var(--foreground)",
        padding: "12px 0",
    },
    ".cm-line": {
        padding: "0 12px",
    },
    "&.cm-focused": {
        outline: "none",
    },
    ".cm-cursor": {
        borderLeftColor: "var(--foreground)",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": {
        backgroundColor: "color-mix(in oklab, var(--primary) 25%, transparent) !important",
    },
    ".cm-activeLine": {
        backgroundColor: "color-mix(in oklab, var(--muted) 45%, transparent)",
    },
    "&:not(.cm-focused) .cm-activeLine": {
        backgroundColor: "transparent",
    },
    ".cm-gutters": {
        backgroundColor: "var(--card)",
        color: "var(--muted-foreground)",
        borderRight: "1px solid var(--border)",
        minWidth: "3rem",
    },
    ".cm-lineNumbers .cm-gutterElement": {
        padding: "0 8px 0 4px",
    },
    ".cm-activeLineGutter": {
        backgroundColor: "transparent",
    },
    ".cm-selectionMatch": {
        backgroundColor: "color-mix(in oklab, var(--primary) 15%, transparent)",
    },
    // Search panel, matched to the app chrome
    ".cm-panels": {
        backgroundColor: "var(--card)",
        color: "var(--foreground)",
        borderTop: "1px solid var(--border)",
    },
    ".cm-panels.cm-panels-bottom": {
        borderTop: "1px solid var(--border)",
    },
    ".cm-panel.cm-search": {
        fontSize: "12px",
        padding: "6px 8px",
    },
    ".cm-panel.cm-search input, .cm-panel.cm-search button, .cm-panel.cm-search label": {
        fontSize: "12px",
    },
    ".cm-textfield": {
        backgroundColor: "var(--background)",
        border: "1px solid var(--border)",
        color: "var(--foreground)",
    },
    ".cm-button": {
        backgroundColor: "var(--background)",
        backgroundImage: "none",
        border: "1px solid var(--border)",
        color: "var(--foreground)",
        cursor: "pointer",
    },
    ".cm-button:active": {
        backgroundColor: "var(--accent)",
        backgroundImage: "none",
    },
    ".cm-placeholder": {
        color: "var(--muted-foreground)",
    },
})

// Keybindings must not shadow browser or OS shortcuts, with one deliberate
// exception: ⌘F/Ctrl+F opens the editor's find & replace while the editor is
// focused — that habit is too strong to break, and every web editor does the
// same. Browser find-in-page still works anywhere outside the editor.
// Mod-[ / Mod-] are dropped from the default keymap: ⌘[ / ⌘] are
// Back/Forward on macOS.
const searchOpenKey = () => "Mod-f"
const safeDefaultKeymap = defaultKeymap.filter(
    (b) => b.key !== "Mod-[" && b.key !== "Mod-]"
)

const CHANGE_DEBOUNCE_MS = 150

export const CodeMirrorEditor: React.FC<CodeMirrorEditorProps> = ({
    editorRef,
    value,
    language,
    wordWrap,
    onChange,
}) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const viewRef = React.useRef<EditorView | null>(null)
    const langCompartment = React.useRef(new Compartment())
    const wrapCompartment = React.useRef(new Compartment())
    // Last value exchanged with the parent (sent or received). Lets us tell
    // an external content change (file load, format) from the echo of our
    // own debounced onChange.
    const lastValueRef = React.useRef(value)
    const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
    const onChangeRef = React.useRef(onChange)
    onChangeRef.current = onChange

    const flush = React.useCallback(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
            debounceRef.current = null
        }
        const view = viewRef.current
        if (!view) return
        const doc = view.state.doc.toString()
        if (doc !== lastValueRef.current) {
            lastValueRef.current = doc
            onChangeRef.current(doc)
        }
    }, [])

    // Create the view once per mount (the parent keys this component by tab
    // id, so every tab switch gets a fresh editor with its own undo history).
    React.useLayoutEffect(() => {
        const parent = containerRef.current
        if (!parent) return

        const state = EditorState.create({
            doc: lastValueRef.current,
            extensions: [
                lineNumbers(),
                highlightActiveLine(),
                highlightActiveLineGutter(),
                // CM paints its own selection layer: the native one is
                // invisible while the view is unfocused, which made palette
                // jumps land silently.
                drawSelection(),
                dropCursor(),
                rectangularSelection(),
                history(),
                indentUnit.of("  "),
                syntaxHighlighting(highlightStyle, { fallback: true }),
                highlightSelectionMatches(),
                search({ top: false }),
                cmPlaceholder("Type something"),
                keymap.of([
                    ...safeDefaultKeymap,
                    ...historyKeymap,
                    { key: searchOpenKey(), run: openSearchPanel },
                    { key: "Escape", run: closeSearchPanel },
                    indentWithTab,
                ]),
                langCompartment.current.of([]),
                wrapCompartment.current.of([]),
                editorTheme,
                EditorView.updateListener.of((update) => {
                    if (!update.docChanged) return
                    if (debounceRef.current) clearTimeout(debounceRef.current)
                    debounceRef.current = setTimeout(flush, CHANGE_DEBOUNCE_MS)
                }),
            ],
        })
        const view = new EditorView({ state, parent })
        viewRef.current = view

        editorRef.current = {
            focus: () => view.focus(),
            getValue: () => view.state.doc.toString(),
            setValue: (v: string) => {
                lastValueRef.current = v
                view.dispatch({
                    changes: { from: 0, to: view.state.doc.length, insert: v },
                })
            },
            reveal: (from: number, to: number) => {
                const max = view.state.doc.length
                const anchor = Math.min(from, max)
                const head = Math.min(to, max)
                view.dispatch({
                    selection: { anchor, head },
                    effects: EditorView.scrollIntoView(anchor, { y: "center" }),
                    scrollIntoView: true,
                })
                view.focus()
            },
        }

        return () => {
            flush()
            editorRef.current = null
            viewRef.current = null
            view.destroy()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // External content change (file finished loading, code formatted, …):
    // push it into the editor. The echo of our own onChange is filtered out
    // by lastValueRef.
    React.useEffect(() => {
        const view = viewRef.current
        if (!view) return
        if (value !== lastValueRef.current) {
            lastValueRef.current = value
            view.dispatch({
                changes: { from: 0, to: view.state.doc.length, insert: value },
            })
        }
    }, [value])

    // Language switching, loaded on demand from @codemirror/language-data.
    React.useEffect(() => {
        const view = viewRef.current
        if (!view) return
        const name = LANGUAGE_ALIASES[language] ?? language
        if (!name) {
            view.dispatch({ effects: langCompartment.current.reconfigure([]) })
            return
        }
        const desc = LanguageDescription.matchLanguageName(languageData, name, true)
        if (!desc) {
            view.dispatch({ effects: langCompartment.current.reconfigure([]) })
            return
        }
        let cancelled = false
        desc.load().then((support) => {
            if (cancelled || viewRef.current !== view) return
            view.dispatch({ effects: langCompartment.current.reconfigure(support) })
        })
        return () => {
            cancelled = true
        }
    }, [language])

    React.useEffect(() => {
        const view = viewRef.current
        if (!view) return
        view.dispatch({
            effects: wrapCompartment.current.reconfigure(wordWrap ? EditorView.lineWrapping : []),
        })
    }, [wordWrap])

    return <div ref={containerRef} className="h-full w-full" />
}
