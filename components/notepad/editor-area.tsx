"use client"

import React from "react"
import dynamic from "next/dynamic"
import { Plus, FileText, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { Kbd } from "@/components/ui/kbd"
import { appModLabel } from "@/lib/shortcuts"
import { Tab } from "../notepad"
import type { EditorHandle } from "./codemirror-editor"
import { Group, Panel, Separator } from "react-resizable-panels"

// The markdown/SVG preview drags in react-markdown, KaTeX and the diagram
// renderers — none of it belongs in the first paint, so it loads on demand.
const PreviewPane = dynamic(
    () => import("./preview-pane").then(m => m.PreviewPane),
    { ssr: false, loading: () => <div className="flex-1 h-full border-l border-border" /> }
)

// CodeMirror is the editor core: virtualized rendering keeps typing,
// select-all and paste O(viewport) instead of O(document), which is what
// makes 100k+ line files feel instant. Loaded lazily so the first paint
// stays free of it.
/** Languages that get a side-by-side preview pane. */
export const PREVIEWABLE = new Set(["markdown", "svg", "json"])

const CodeMirrorEditor = dynamic(
    () => import("./codemirror-editor").then(m => m.CodeMirrorEditor),
    { ssr: false, loading: () => <div className="h-full w-full" /> }
)

interface EditorAreaProps {
    activeTab: Tab | undefined
    tabs: Tab[]
    editorRef: React.MutableRefObject<EditorHandle | null>
    updateTabContent: (tabId: string, content: string) => void
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
    editorRef,
    updateTabContent,
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

    const Editor = (
        <div
            className="flex-1 h-full overflow-hidden bg-background"
            style={{
                "--cm-font-size": `${fontSize}px`,
                "--cm-font-family": fontFamily,
            } as React.CSSProperties}
        >
            <CodeMirrorEditor
                key={activeTab?.id}
                editorRef={editorRef}
                value={content}
                language={language}
                wordWrap={wordWrap}
                onChange={(v) => activeTab && updateTabContent(activeTab.id, v)}
            />
        </div>
    )

    const Preview = (
        <PreviewPane
            language={language}
            content={content}
            onRevealOffset={(offset) => editorRef.current?.reveal(offset, offset)}
        />
    )

    if (showPreview && PREVIEWABLE.has(language)) {
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
