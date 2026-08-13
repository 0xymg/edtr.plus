"use client"

import React, { RefObject } from "react"
import dynamic from "next/dynamic"
import { Plus, FileText, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { Kbd } from "@/components/ui/kbd"
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
                                <Kbd>Alt</Kbd>
                                <Kbd>N</Kbd>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <span>Save:</span>
                                <Kbd>Ctrl/⌘</Kbd>
                                <Kbd>S</Kbd>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-[10px] opacity-70">
                                <span>Close Tab: <Kbd>Alt</Kbd><Kbd>X</Kbd></span>
                                <span className="mx-1">•</span>
                                <span>Sidebar: <Kbd>Alt</Kbd><Kbd>B</Kbd></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const lines = (activeTab?.content || "").split("\n")
    const LINE_PX = 24

    // When wrapping is on, a single logical line can occupy several visual rows.
    // Measure each line's rendered height from a hidden mirror so every visual
    // row (including wrapped continuations) gets its own sequential number.
    const measureRef = React.useRef<HTMLDivElement>(null)
    const [lineHeights, setLineHeights] = React.useState<number[]>([])

    const totalVisualRows = wordWrap && lineHeights.length
        ? lineHeights.reduce((sum, h) => sum + Math.max(1, Math.round(h / LINE_PX)), 0)
        : lines.length

    React.useLayoutEffect(() => {
        if (!wordWrap) {
            setLineHeights(prev => (prev.length ? [] : prev))
            return
        }
        const el = measureRef.current
        if (!el) return
        const measure = () => {
            const next = Array.from(el.children).map(c => (c as HTMLElement).offsetHeight)
            setLineHeights(prev =>
                prev.length === next.length && prev.every((v, i) => v === next[i]) ? prev : next
            )
        }
        measure()
        const ro = new ResizeObserver(measure)
        ro.observe(el)
        return () => ro.disconnect()
    }, [wordWrap, activeTab?.id, activeTab?.content, fontSize, fontFamily])

    const Editor = (
        <div className="flex flex-1 overflow-auto overscroll-contain h-full bg-background">
            {/* Line numbers — pinned horizontally, scroll vertically with the content */}
            <div
                className="w-12 shrink-0 select-none border-r border-border bg-card sticky left-0 z-10 py-3 text-right text-muted-foreground"
                style={{ fontSize: `${Math.max(10, fontSize - 2)}px`, fontFamily }}
            >
                {Array.from({ length: totalVisualRows }, (_, i) => (
                    <div
                        key={i}
                        className="px-2"
                        style={{ height: LINE_PX, lineHeight: `${LINE_PX}px` }}
                    >
                        {i + 1}
                    </div>
                ))}
            </div>

            {/* Editor: grid layering so pre and textarea share the same cell and grow together */}
            <div
                className={cn("min-h-full", wordWrap ? "flex-1 min-w-0" : "shrink-0 min-w-full")}
                style={{ display: "grid" }}
            >
                <pre
                    className={cn(
                        "col-start-1 row-start-1 m-0 w-full p-3 leading-6",
                        wordWrap ? "whitespace-pre-wrap break-words" : "whitespace-pre",
                        activeTab?.language !== "plaintext" && activeTab?.content
                            ? "pointer-events-none"
                            : "invisible pointer-events-none"
                    )}
                    style={{ fontSize: `${fontSize}px`, fontFamily }}
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{
                        __html: activeTab?.language !== "plaintext" && activeTab?.content
                            ? getHighlightedCode(activeTab.content, activeTab.language)
                            : (activeTab?.content || " ")
                    }}
                />
                <textarea
                    ref={textareaRef}
                    value={activeTab?.content || ""}
                    onChange={(e) => updateContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    wrap={wordWrap ? "soft" : "off"}
                    className={cn(
                        "col-start-1 row-start-1 resize-none bg-transparent p-3 leading-6 outline-none overflow-hidden w-full placeholder:text-muted-foreground",
                        wordWrap ? "whitespace-pre-wrap break-words" : "whitespace-pre",
                        activeTab?.language !== "plaintext" && activeTab?.content
                            ? "text-transparent caret-foreground"
                            : "text-foreground"
                    )}
                    style={{ fontSize: `${fontSize}px`, fontFamily }}
                    placeholder="Type something"
                    spellCheck={false}
                />
                {wordWrap && (
                    <div
                        ref={measureRef}
                        aria-hidden="true"
                        className="col-start-1 row-start-1 m-0 w-full whitespace-pre-wrap break-words p-3 leading-6 invisible pointer-events-none"
                        style={{ fontSize: `${fontSize}px`, fontFamily }}
                    >
                        {lines.map((line, i) => (
                            <div key={i}>{line === "" ? " " : line}</div>
                        ))}
                    </div>
                )}
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
