import React from "react"
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { appModLabel } from "@/lib/shortcuts"
import { Tab } from "../notepad"
import { FileIcon } from "./file-icon"
import { IconTip } from "@/components/ui/tooltip"

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
    // The strip scrolls horizontally, but a scrollbar under the tabs looks
    // broken in an editor chrome, so it is hidden and replaced with chevrons
    // that only appear on the side there is actually more to see.
    const stripRef = React.useRef<HTMLDivElement>(null)
    const [overflow, setOverflow] = React.useState({ left: false, right: false })

    const syncOverflow = React.useCallback(() => {
        const el = stripRef.current
        if (!el) return
        const maxScroll = el.scrollWidth - el.clientWidth
        setOverflow(prev => {
            const next = {
                left: el.scrollLeft > 1,
                right: el.scrollLeft < maxScroll - 1,
            }
            return prev.left === next.left && prev.right === next.right ? prev : next
        })
    }, [])

    React.useLayoutEffect(() => {
        syncOverflow()
    }, [tabs, syncOverflow])

    React.useEffect(() => {
        const el = stripRef.current
        if (!el) return
        const ro = new ResizeObserver(syncOverflow)
        ro.observe(el)
        return () => ro.disconnect()
    }, [syncOverflow])

    // Keep the active tab visible when it changes from elsewhere (shortcuts,
    // the sidebar, a command-palette jump).
    React.useEffect(() => {
        const el = stripRef.current
        if (!el || !activeTabId) return
        const node = el.querySelector<HTMLElement>(`[data-tab-id="${CSS.escape(activeTabId)}"]`)
        node?.scrollIntoView({ block: "nearest", inline: "nearest" })
    }, [activeTabId])

    const scrollBy = (direction: -1 | 1) => {
        const el = stripRef.current
        if (!el) return
        el.scrollBy({ left: direction * Math.max(120, el.clientWidth * 0.6), behavior: "smooth" })
    }

    const arrowButton = "flex h-full shrink-0 items-center border-border px-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"

    return (
        <div className="flex items-center border-b border-border bg-card" onDoubleClick={handleTabBarDoubleClick}>
            {overflow.left && (
                <IconTip label="Scroll tabs left">
                    <button
                        onClick={(e) => { e.stopPropagation(); scrollBy(-1) }}
                        className={cn(arrowButton, "border-r")}
                        aria-label="Scroll tabs left"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                </IconTip>
            )}
            <div
                ref={stripRef}
                onScroll={syncOverflow}
                // flex-1 + min-w-0 make the strip take the leftover row width and
                // scroll internally; without them it sizes to its content and the
                // whole tab bar overflows instead.
                className="flex min-w-0 flex-1 items-center overflow-x-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        data-tab-id={tab.id}
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
                        <IconTip label={`Close ${tab.name}`} shortcut={`${appModLabel()}+X`}>
                            <button
                                onClick={(e) => closeTab(tab.id, e)}
                                className="ml-1 rounded p-0.5 opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100"
                                aria-label={`Close ${tab.name}`}
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </IconTip>
                    </div>
                ))}
            </div>
            {overflow.right && (
                <IconTip label="Scroll tabs right">
                    <button
                        onClick={(e) => { e.stopPropagation(); scrollBy(1) }}
                        className={cn(arrowButton, "border-l")}
                        aria-label="Scroll tabs right"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </IconTip>
            )}
            <IconTip label="New tab" shortcut={`${appModLabel()}+N`}>
                <button
                    onClick={createNewTab}
                    className="flex shrink-0 items-center px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label="New tab"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </IconTip>
        </div>
    )
}
