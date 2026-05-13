import React from "react"
import { Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tab } from "../notepad"
import { FileIcon } from "./file-icon"

interface TabBarProps {
    tabs: Tab[]
    activeTabId: string | null
    setActiveTabId: (id: string) => void
    handleTabBarDoubleClick: () => void
    createNewTab: () => void
    closeTab: (tabId: string, e?: React.MouseEvent | KeyboardEvent) => void
}

export const TabBar: React.FC<TabBarProps> = ({
    tabs,
    activeTabId,
    setActiveTabId,
    handleTabBarDoubleClick,
    createNewTab,
    closeTab
}) => {
    return (
        <div className="flex items-center border-b border-border bg-card" onDoubleClick={handleTabBarDoubleClick}>
            <div className="flex items-center overflow-x-auto overscroll-contain">
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        onClick={() => setActiveTabId(tab.id)}
                        className={cn(
                            "group flex items-center gap-2 border-r border-border px-3 py-2 text-sm transition-colors cursor-pointer",
                            tab.id === activeTabId
                                ? "bg-background text-foreground"
                                : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                    >
                        <FileIcon language={tab.language} />
                        <span className="max-w-32 truncate">{tab.name}</span>
                        {tab.isModified && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-foreground" />
                        )}
                        <button
                            onClick={(e) => closeTab(tab.id, e)}
                            className="ml-1 rounded p-0.5 opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100"
                            title={`Close ${tab.name} (Alt+X)`}
                            aria-label={`Close ${tab.name}`}
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                ))}
                <button
                    onClick={createNewTab}
                    className="flex shrink-0 items-center px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    title="New file (Alt+N)"
                    aria-label="New tab"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
