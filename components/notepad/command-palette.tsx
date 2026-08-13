"use client"

import React from "react"
import {
    File,
    Folder,
    FilePlus,
    FolderPlus,
    FileUp,
    Save,
    Download,
    Moon,
    Sun,
    WrapText,
    Search,
    Printer,
    Wand2,
    Minimize2,
    Code2,
    Check,
    Link as LinkIcon,
} from "lucide-react"
import {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
} from "@/components/ui/command"
import { Tab, FolderItem } from "../notepad"
import { FileIcon } from "./file-icon"

// Caps keep the palette responsive on huge documents: a 180k-line file can
// contain thousands of hits, and nobody scrolls past the first few.
const MAX_MATCHES_PER_FILE = 5
const MAX_TOTAL_MATCHES = 60
const SNIPPET_RADIUS = 48

export interface ContentMatch {
    tabId: string
    tabName: string
    language: string
    line: number
    from: number
    to: number
    before: string
    hit: string
    after: string
}

interface CommandPaletteProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    tabs: Tab[]
    folders: FolderItem[]
    activeTabId: string | null
    /** Live text for a tab (the active one lives inside CodeMirror). */
    getContent: (tab: Tab) => string
    onSelectFile: (tabId: string) => void
    onSelectFolder: (folderId: string) => void
    onSelectMatch: (match: ContentMatch) => void
    onNewFile: () => void
    onNewFolder: () => void
    onOpenFile: () => void
    onSave: () => void
    onDownload: () => void
    onPrint: () => void
    onCopyLink: () => void
    onFormat: () => void
    onMinifyJson: () => void
    isJson: boolean
    languages: { id: string; name: string }[]
    activeLanguage: string
    onChangeLanguage: (id: string) => void
    onToggleTheme: () => void
    onToggleWrap: () => void
    theme: "light" | "dark"
    wordWrap: boolean
    modLabel: string
    cmdLabel: string
}

function searchContents(
    tabs: Tab[],
    getContent: (tab: Tab) => string,
    query: string
): ContentMatch[] {
    const needle = query.toLowerCase()
    const matches: ContentMatch[] = []

    for (const tab of tabs) {
        if (matches.length >= MAX_TOTAL_MATCHES) break
        const content = getContent(tab)
        if (!content) continue
        const haystack = content.toLowerCase()

        let index = haystack.indexOf(needle)
        if (index === -1) continue

        // Line numbers are counted forward from the previous hit instead of
        // splitting the whole document, so a 4MB file costs one pass.
        let line = 1
        let scanned = 0
        let perFile = 0

        while (index !== -1 && perFile < MAX_MATCHES_PER_FILE && matches.length < MAX_TOTAL_MATCHES) {
            for (let i = scanned; i < index; i++) {
                if (content.charCodeAt(i) === 10) line++
            }
            scanned = index

            const lineStart = content.lastIndexOf("\n", index - 1) + 1
            const lineEnd = content.indexOf("\n", index)
            const end = lineEnd === -1 ? content.length : lineEnd
            const before = content.slice(Math.max(lineStart, index - SNIPPET_RADIUS), index)
            const hit = content.slice(index, index + query.length)
            const after = content.slice(
                index + query.length,
                Math.min(end, index + query.length + SNIPPET_RADIUS)
            )

            matches.push({
                tabId: tab.id,
                tabName: tab.name,
                language: tab.language,
                line,
                from: index,
                to: index + query.length,
                before: before.trimStart(),
                hit,
                after,
            })
            perFile++
            index = haystack.indexOf(needle, index + query.length)
        }
    }

    return matches
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
    open,
    onOpenChange,
    tabs,
    folders,
    activeTabId,
    getContent,
    onSelectFile,
    onSelectFolder,
    onSelectMatch,
    onNewFile,
    onNewFolder,
    onOpenFile,
    onSave,
    onDownload,
    onPrint,
    onCopyLink,
    onFormat,
    onMinifyJson,
    isJson,
    languages,
    activeLanguage,
    onChangeLanguage,
    onToggleTheme,
    onToggleWrap,
    theme,
    wordWrap,
    modLabel,
    cmdLabel,
}) => {
    const [query, setQuery] = React.useState("")
    // Content search runs on a deferred copy so typing never waits for a
    // full-text scan of every open document.
    const deferredQuery = React.useDeferredValue(query)

    React.useEffect(() => {
        if (!open) setQuery("")
    }, [open])

    const trimmed = deferredQuery.trim()
    const contentMatches = React.useMemo(() => {
        if (trimmed.length < 2) return []
        return searchContents(tabs, getContent, trimmed)
    }, [tabs, getContent, trimmed])

    const run = (fn: () => void) => {
        onOpenChange(false)
        // Let the dialog close before the action moves focus into the editor.
        // setTimeout rather than rAF: animation frames are suspended in
        // background tabs, which would strand the action entirely.
        setTimeout(fn, 0)
    }

    return (
        <CommandDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Command palette"
            description="Search files, folders and text across every open document"
            // cmdk's own fuzzy filter would also try to score the content
            // matches, whose values are line snippets — we filter ourselves.
            shouldFilter={false}
        >
            <CommandInput
                placeholder="Search files, folders, or text in all files…"
                value={query}
                onValueChange={setQuery}
            />
            <CommandList>
                <CommandEmpty>
                    {trimmed.length === 1
                        ? "Keep typing to search inside files…"
                        : "No results found."}
                </CommandEmpty>

                {(() => {
                    const q = trimmed.toLowerCase()
                    const fileHits = q
                        ? tabs.filter((t) => t.name.toLowerCase().includes(q))
                        : tabs.slice(0, 8)
                    const folderHits = q
                        ? folders.filter((f) => f.name.toLowerCase().includes(q))
                        : []
                    // "json" should reach the language switcher, and so should
                    // asking for it by name ("language", "syntax", "lang").
                    const asksForLanguages = /^(lang|langu|langua|languag|language|syntax|mode)/.test(q)
                    const languageHits = !q
                        ? []
                        : (asksForLanguages
                            ? languages
                            : languages.filter((l) => l.name.toLowerCase().includes(q) || l.id.includes(q))
                        ).slice(0, 6)

                    return (
                        <>
                            {fileHits.length > 0 && (
                                <CommandGroup heading={q ? "Files" : "Open files"}>
                                    {fileHits.slice(0, 12).map((tab) => (
                                        <CommandItem
                                            key={tab.id}
                                            value={`file-${tab.id}`}
                                            onSelect={() => run(() => onSelectFile(tab.id))}
                                        >
                                            <FileIcon language={tab.language} />
                                            <span className="truncate">{tab.name}</span>
                                            {tab.id === activeTabId && (
                                                <CommandShortcut>current</CommandShortcut>
                                            )}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}

                            {folderHits.length > 0 && (
                                <CommandGroup heading="Folders">
                                    {folderHits.slice(0, 8).map((folder) => (
                                        <CommandItem
                                            key={folder.id}
                                            value={`folder-${folder.id}`}
                                            onSelect={() => run(() => onSelectFolder(folder.id))}
                                        >
                                            <Folder className="text-muted-foreground" />
                                            <span className="truncate">{folder.name}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}

                            {contentMatches.length > 0 && (
                                <CommandGroup
                                    heading={`In files (${contentMatches.length}${contentMatches.length >= MAX_TOTAL_MATCHES ? "+" : ""})`}
                                >
                                    {contentMatches.map((m) => (
                                        <CommandItem
                                            key={`${m.tabId}-${m.from}`}
                                            value={`match-${m.tabId}-${m.from}`}
                                            onSelect={() => run(() => onSelectMatch(m))}
                                            className="items-start"
                                        >
                                            <Search className="mt-0.5 shrink-0 text-muted-foreground" />
                                            <span className="flex min-w-0 flex-col gap-0.5">
                                                <span className="truncate font-mono text-xs text-muted-foreground">
                                                    {m.tabName}:{m.line}
                                                </span>
                                                <span className="truncate font-mono text-xs">
                                                    <span className="text-muted-foreground">{m.before}</span>
                                                    <mark className="bg-primary/25 text-foreground">{m.hit}</mark>
                                                    <span className="text-muted-foreground">{m.after}</span>
                                                </span>
                                            </span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}

                            {languageHits.length > 0 && (
                                <CommandGroup heading="Set language">
                                    {languageHits.map((lang) => (
                                        <CommandItem
                                            key={lang.id}
                                            value={`lang-${lang.id}`}
                                            onSelect={() => run(() => onChangeLanguage(lang.id))}
                                        >
                                            <Code2 className="text-muted-foreground" />
                                            <span>Set language to {lang.name}</span>
                                            {lang.id === activeLanguage && (
                                                <CommandShortcut>
                                                    <Check className="h-3 w-3" />
                                                </CommandShortcut>
                                            )}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}

                            <CommandGroup heading="Actions">
                                {[
                                    { id: "new-file", label: "New file", icon: <FilePlus />, shortcut: `${modLabel}+N`, fn: onNewFile },
                                    { id: "new-folder", label: "New folder", icon: <FolderPlus />, fn: onNewFolder },
                                    { id: "open-file", label: "Open file from disk", icon: <FileUp />, shortcut: `${cmdLabel}+O`, fn: onOpenFile },
                                    { id: "save", label: "Save", icon: <Save />, shortcut: `${cmdLabel}+S`, fn: onSave },
                                    { id: "download", label: "Download file", icon: <Download />, shortcut: `${cmdLabel}⇧+S`, fn: onDownload },
                                    { id: "print", label: "Print", icon: <Printer />, fn: onPrint },
                                    { id: "copy-link", label: "Copy link to this note", icon: <LinkIcon />, fn: onCopyLink },
                                    { id: "format", label: isJson ? "Format JSON" : "Format document", icon: <Wand2 />, shortcut: `${modLabel}⇧+F`, fn: onFormat },
                                    ...(isJson
                                        ? [{ id: "minify", label: "Minify JSON", icon: <Minimize2 />, fn: onMinifyJson }]
                                        : []),
                                    {
                                        id: "wrap",
                                        label: wordWrap ? "Turn word wrap off" : "Turn word wrap on",
                                        icon: <WrapText />,
                                        fn: onToggleWrap,
                                    },
                                    {
                                        id: "theme",
                                        label: theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
                                        icon: theme === "dark" ? <Sun /> : <Moon />,
                                        fn: onToggleTheme,
                                    },
                                ]
                                    .filter((a) => !q || a.label.toLowerCase().includes(q))
                                    .map((action) => (
                                        <CommandItem
                                            key={action.id}
                                            value={`action-${action.id}`}
                                            onSelect={() => run(action.fn)}
                                        >
                                            <span className="text-muted-foreground">{action.icon}</span>
                                            <span>{action.label}</span>
                                            {action.shortcut && <CommandShortcut>{action.shortcut}</CommandShortcut>}
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        </>
                    )
                })()}
            </CommandList>
        </CommandDialog>
    )
}
