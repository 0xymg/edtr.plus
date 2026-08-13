"use client"

import React, { RefObject } from "react"
import dynamic from "next/dynamic"
import { Plus, FileText, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { Kbd } from "@/components/ui/kbd"
import { appModLabel } from "@/lib/shortcuts"
import { Tab } from "../notepad"
import { Group, Panel, Separator } from "react-resizable-panels"
import "highlight.js/styles/github.css"

// The markdown/SVG preview drags in react-markdown, KaTeX and the diagram
// renderers — none of it belongs in the first paint, so it loads on demand.
const PreviewPane = dynamic(
    () => import("./preview-pane").then(m => m.PreviewPane),
    { ssr: false, loading: () => <div className="flex-1 h-full border-l border-border" /> }
)

interface EditorAreaProps {
    activeTab: Tab | undefined
    tabs: Tab[]
    textareaRef: RefObject<HTMLTextAreaElement | null>
    updateContent: (content: string) => void
    handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
    getHighlightedCode: (content: string, language: string) => string
    createNewTab: () => void
    fontSize?: number
    fontFamily?: string
    wordWrap?: boolean
    showPreview?: boolean
    setShowPreview?: (show: boolean) => void
    onExternalFileDrop?: (file: File) => void
}

export const EditorArea: React.FC<EditorAreaProps> = ({
    activeTab,
    tabs,
    textareaRef,
    updateContent,
    handleKeyDown,
    getHighlightedCode,
    createNewTab,
    fontSize = 14,
    fontFamily = "JetBrains Mono",
    wordWrap = true,
    showPreview = false,
    setShowPreview,
    onExternalFileDrop
}) => {
    const [isDraggingExternal, setIsDraggingExternal] = React.useState(false)

    const handleExternalDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingExternal(true)
    }

    const handleExternalDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingExternal(false)
    }

    const handleExternalDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingExternal(false)

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0 && onExternalFileDrop) {
            files.forEach(file => {
                if (file.name.toLowerCase().endsWith('.svg') || file.type === 'image/svg+xml') {
                    onExternalFileDrop(file)
                }
            })
        }
    }

    if (tabs.length === 0) {
        return (
            <div 
                className={cn(
                    "flex flex-1 items-center justify-center transition-colors duration-200",
                    isDraggingExternal && "bg-primary/5 ring-2 ring-inset ring-primary/20"
                )}
                onDragOver={handleExternalDragOver}
                onDragEnter={handleExternalDragOver}
                onDragLeave={handleExternalDragLeave}
                onDrop={handleExternalDrop}
            >
                <div className="flex flex-col items-center gap-6 text-center">
                    <FileText className="h-16 w-16 text-muted-foreground/50" />
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold text-foreground">No files open</h2>
                        <p className="text-sm text-muted-foreground">Create a new file to get started</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={createNewTab}
                            className="flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-muted-foreground"
                        >
                            <Plus className="h-4 w-4" />
                            New File
                        </button>
                        <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center justify-center gap-2">
                                <span>New File:</span>
                                <Kbd>{appModLabel()}</Kbd>
                                <Kbd>N</Kbd>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <span>Save:</span>
                                <Kbd>Ctrl/⌘</Kbd>
                                <Kbd>S</Kbd>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-[10px] opacity-70">
                                <span>Close Tab: <Kbd>{appModLabel()}</Kbd><Kbd>X</Kbd></span>
                                <span className="mx-1">•</span>
                                <span>Sidebar: <Kbd>{appModLabel()}</Kbd><Kbd>B</Kbd></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const content = activeTab?.content || ""
    const language = activeTab?.language || "plaintext"
    // The mirror and the line-number gutter are bookkeeping, not the text the
    // user is editing, so they follow a deferred copy of the content: the
    // keystroke commit only touches the textarea, and the gutter catches up
    // in a low-priority render right after.
    const deferredContent = React.useDeferredValue(content)
    const lineCount = React.useMemo(() => {
        let n = 1
        for (let i = 0; i < deferredContent.length; i++) {
            if (deferredContent.charCodeAt(i) === 10) n++
        }
        return n
    }, [deferredContent])
    const LINE_PX = 24

    // Above this size the syntax overlay is skipped: highlighting the whole
    // document and re-parsing it as HTML on every keystroke is what makes
    // large files stutter, and a plain textarea stays fast natively.
    const HIGHLIGHT_LIMIT = 150_000
    const highlightable = language !== "plaintext" && content.length > 0 && content.length <= HIGHLIGHT_LIMIT
    const highlighted = React.useMemo(
        () => (highlightable ? getHighlightedCode(content, language) : null),
        [highlightable, content, language, getHighlightedCode]
    )

    // When wrapping is on, a single logical line can occupy several visual
    // rows. Instead of mirroring every line in hidden DOM and measuring each
    // one (an O(n) reflow that froze the tab on large documents), the total
    // visual row count is read from the textarea's own scrollHeight: the
    // browser has already wrapped the text, so one property read gives the
    // exact height for both the gutter and the auto-grow container.
    const gridRef = React.useRef<HTMLDivElement>(null)
    const [wrapHeight, setWrapHeight] = React.useState<number | null>(null)
    const [remeasure, setRemeasure] = React.useState(0)
    const PAD_Y = 24 // p-3 top + bottom

    React.useLayoutEffect(() => {
        const ta = textareaRef.current
        if (!wordWrap || !ta) {
            setWrapHeight(null)
            return
        }
        // Collapse so scrollHeight reports content height, then restore. The
        // text line layout is cached (width unchanged), so this is cheap.
        const prev = ta.style.height
        ta.style.height = "0px"
        const h = ta.scrollHeight
        ta.style.height = prev || ""
        setWrapHeight(cur => (cur === h ? cur : h))
    }, [wordWrap, content, fontSize, fontFamily, activeTab?.id, remeasure, textareaRef])

    // A width change re-wraps every line; re-read the height when it happens.
    React.useEffect(() => {
        if (!wordWrap) return
        const el = gridRef.current
        if (!el) return
        let lastWidth = el.clientWidth
        const ro = new ResizeObserver(entries => {
            const w = entries[entries.length - 1].contentRect.width
            if (Math.abs(w - lastWidth) > 0.5) {
                lastWidth = w
                setRemeasure(v => v + 1)
            }
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [wordWrap])

    const totalVisualRows = wordWrap && wrapHeight !== null
        ? Math.max(1, Math.round((wrapHeight - PAD_Y) / LINE_PX))
        : lineCount

    // One text node instead of one div per row: at 10k+ lines the per-div
    // gutter alone was thousands of DOM nodes reconciled on every keystroke.
    const gutterText = React.useMemo(() => {
        let s = ""
        for (let i = 1; i <= totalVisualRows; i++) s += i + "\n"
        return s
    }, [totalVisualRows])

    const Editor = (
        <div className="flex flex-1 overflow-auto overscroll-contain h-full bg-background">
            {/* Line numbers — pinned horizontally, scroll vertically with the content */}
            <div
                className="w-12 shrink-0 select-none border-r border-border bg-card sticky left-0 z-10 py-3 text-right text-muted-foreground"
                style={{ fontSize: `${Math.max(10, fontSize - 2)}px`, fontFamily }}
            >
                <div className="whitespace-pre px-2" style={{ lineHeight: `${LINE_PX}px` }}>
                    {gutterText}
                </div>
            </div>

            {/* Editor: grid layering so pre and textarea share the same cell and grow together */}
            <div
                ref={gridRef}
                className={cn("min-h-full", wordWrap ? "flex-1 min-w-0" : "shrink-0 min-w-full")}
                style={{
                    display: "grid",
                    // In wrap mode the textarea can't auto-grow on its own, so
                    // the measured content height sizes the grid cell for it.
                    height: wordWrap && wrapHeight !== null ? wrapHeight : undefined,
                }}
            >
                {highlighted !== null ? (
                    <pre
                        className={cn(
                            "col-start-1 row-start-1 m-0 w-full p-3 leading-6 pointer-events-none",
                            wordWrap ? "whitespace-pre-wrap break-words" : "whitespace-pre"
                        )}
                        style={{ fontSize: `${fontSize}px`, fontFamily }}
                        aria-hidden="true"
                        dangerouslySetInnerHTML={{ __html: highlighted }}
                    />
                ) : !wordWrap ? (
                    // Plain text without wrap: the pre defines the grid cell's
                    // width and height (a text node, so no HTML parsing). With
                    // wrap on, the measured wrapHeight sizes the grid instead,
                    // and updating a second full-document text node per
                    // keystroke would force a whole-block relayout for nothing.
                    <pre
                        className="col-start-1 row-start-1 m-0 w-full p-3 leading-6 whitespace-pre invisible pointer-events-none"
                        style={{ fontSize: `${fontSize}px`, fontFamily }}
                        aria-hidden="true"
                    >
                        {content || " "}
                    </pre>
                ) : null}
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => updateContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    wrap={wordWrap ? "soft" : "off"}
                    className={cn(
                        "col-start-1 row-start-1 resize-none bg-transparent p-3 leading-6 outline-none overflow-hidden w-full placeholder:text-muted-foreground",
                        wordWrap ? "whitespace-pre-wrap break-words" : "whitespace-pre",
                        highlighted !== null ? "text-transparent caret-foreground" : "text-foreground"
                    )}
                    style={{ fontSize: `${fontSize}px`, fontFamily }}
                    placeholder="Type something"
                    spellCheck={false}
                />
            </div>
        </div>
    )

    const Preview = (
        <PreviewPane
            language={activeTab?.language || ""}
            content={activeTab?.content || ""}
        />
    )

    if (showPreview && (activeTab?.language === "markdown" || activeTab?.language === "svg")) {
        return (
            <Group orientation="horizontal" className="h-full">
                <Panel defaultSize={50} minSize={20}>
                    {Editor}
                </Panel>
                <Separator className="w-1.5 bg-border hover:bg-primary/50 transition-colors flex items-center justify-center group relative">
                    <div className="absolute inset-y-0 -left-1 -right-1 cursor-col-resize" />
                    <GripVertical className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </Separator>
                <Panel defaultSize={50} minSize={20}>
                    {Preview}
                </Panel>
            </Group>
        )
    }

    return (
        <div 
            className={cn(
                "flex-1 flex flex-col min-h-0 relative",
                isDraggingExternal && "after:absolute after:inset-0 after:bg-primary/5 after:border-2 after:border-dashed after:border-primary/40 after:z-50 after:pointer-events-none"
            )}
            onDragOver={handleExternalDragOver}
            onDragEnter={handleExternalDragOver}
            onDragLeave={handleExternalDragLeave}
            onDrop={handleExternalDrop}
        >
            {Editor}
        </div>
    )
}
