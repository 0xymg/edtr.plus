import React, { RefObject } from "react"
import { Plus, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Kbd } from "@/components/ui/kbd"
import { Tab } from "../notepad"

interface EditorAreaProps {
    activeTab: Tab | undefined
    tabs: Tab[]
    textareaRef: RefObject<HTMLTextAreaElement | null>
    updateContent: (content: string) => void
    handleKeyDown: (e: React.KeyboardEvent) => void
    getHighlightedCode: (content: string, language: string) => string
    createNewTab: () => void
}

export const EditorArea: React.FC<EditorAreaProps> = ({
    activeTab,
    tabs,
    textareaRef,
    updateContent,
    handleKeyDown,
    getHighlightedCode,
    createNewTab
}) => {
    if (tabs.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center">
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
                                <Kbd>{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</Kbd>
                                <Kbd>T</Kbd>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <span>Save:</span>
                                <Kbd>{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</Kbd>
                                <Kbd>S</Kbd>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-[10px] opacity-70">
                                <span>Close Tab: <Kbd>⌘</Kbd><Kbd>K</Kbd></span>
                                <span className="mx-1">•</span>
                                <span>Sidebar: <Kbd>⌘</Kbd><Kbd>L</Kbd></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const lines = (activeTab?.content || "").split("\n")

    return (
        <div className="flex flex-1 overflow-auto overscroll-contain">
            {/* Line numbers — scroll with the content */}
            <div className="w-12 shrink-0 select-none border-r border-border bg-card py-3 text-right font-mono text-xs text-muted-foreground">
                {lines.map((_, i) => (
                    <div key={i} className="px-2 leading-6">
                        {i + 1}
                    </div>
                ))}
            </div>

            {/* Editor: grid layering so pre and textarea share the same cell and grow together */}
            <div className="flex-1 min-w-0 min-h-full" style={{ display: "grid" }}>
                <pre
                    className={cn(
                        "col-start-1 row-start-1 m-0 w-full whitespace-pre-wrap break-words p-3 font-mono text-sm leading-6",
                        activeTab?.language !== "plaintext" && activeTab?.content
                            ? "pointer-events-none"
                            : "invisible pointer-events-none"
                    )}
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
                    className={cn(
                        "col-start-1 row-start-1 resize-none bg-transparent p-3 font-mono text-sm leading-6 outline-none overflow-hidden w-full placeholder:text-muted-foreground",
                        activeTab?.language !== "plaintext" && activeTab?.content
                            ? "text-transparent caret-foreground"
                            : "text-foreground"
                    )}
                    placeholder="Start typing..."
                    spellCheck={false}
                />
            </div>
        </div>
    )
}
