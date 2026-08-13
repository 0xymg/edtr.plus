"use client"

import React from "react"
import {
    X,
    Folder,
    FolderOpen,
    FolderPlus,
    FilePlus,
    FileUp,
    ChevronDown,
    ChevronRight,
    ChevronsDownUp,
    ChevronsUpDown,
    Download,
    Trash2,
    Search,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { appModLabel, cmdModLabel } from "@/lib/shortcuts"
import { Tab, FolderItem } from "../notepad"
import { FileIcon } from "./file-icon"
import { IconTip } from "@/components/ui/tooltip"

interface SidebarProps {
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
    tabs: Tab[]
    folders: FolderItem[]
    activeTabId: string | null
    setActiveTabId: (id: string) => void
    createNewTab: () => void
    createNewFolder: () => void
    toggleFolder: (id: string) => void
    deleteFolder: (id: string, e: React.MouseEvent) => void
    deleteFile: (id: string, e: React.MouseEvent) => void
    startRenamingFolder: (folder: FolderItem) => void
    editingFolderId: string | null
    editingFolderName: string
    setEditingFolderName: (name: string) => void
    finishRenamingFolder: (id: string) => void
    handleRenameFolderKeyDown: (e: React.KeyboardEvent, id: string) => void
    editingTabId: string | null
    editingName: string
    setEditingName: (name: string) => void
    finishRenaming: (id: string) => void
    handleRenameKeyDown: (e: React.KeyboardEvent, id: string) => void
    startRenaming: (tab: Tab) => void
    handleDragStart: (id: string) => void
    handleDragEnd: () => void
    handleDragOver: (e: React.DragEvent) => void
    handleDragOverTab: (id: string, e: React.DragEvent) => void
    handleDragLeaveTab: () => void
    handleDropOutsideFolder: (e: React.DragEvent) => void
    handleDropOnTab: (id: string, e: React.DragEvent) => void
    handleContextMenu: (e: React.MouseEvent, id: string) => void
    handleFolderContextMenu: (e: React.MouseEvent, id: string) => void
    handleDragEnterFolder: (id: string) => void
    handleDragLeaveFolder: () => void
    handleDropOnFolder: (id: string) => void
    handleFolderDragStart: (id: string) => void
    draggedFolder: string | null
    dragOverFolder: string | null
    dragOverTab: string | null
    onOpenFile: () => void
    onOpenFolder: () => void
    supportsDirectoryPicker: boolean
    onDownloadFile: (id: string) => void
    onDownloadFolder: (id: string) => void
    toggleAllFolders: () => void
    onOpenSearch: () => void
    cmdLabel: string
}

export const Sidebar: React.FC<SidebarProps> = ({
    sidebarOpen,
    setSidebarOpen,
    tabs,
    folders,
    activeTabId,
    setActiveTabId,
    createNewTab,
    createNewFolder,
    toggleFolder,
    deleteFolder,
    deleteFile,
    startRenamingFolder,
    editingFolderId,
    editingFolderName,
    setEditingFolderName,
    finishRenamingFolder,
    handleRenameFolderKeyDown,
    editingTabId,
    editingName,
    setEditingName,
    finishRenaming,
    handleRenameKeyDown,
    startRenaming,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragOverTab,
    handleDragLeaveTab,
    handleDropOutsideFolder,
    handleDropOnTab,
    handleContextMenu,
    handleFolderContextMenu,
    handleDragEnterFolder,
    handleDragLeaveFolder,
    handleDropOnFolder,
    handleFolderDragStart,
    draggedFolder,
    dragOverFolder,
    dragOverTab,
    onOpenFile,
    onOpenFolder,
    supportsDirectoryPicker,
    onDownloadFile,
    onDownloadFolder,
    toggleAllFolders,
    onOpenSearch,
    cmdLabel,
}) => {
    const extensionMap: Record<string, string> = {
        plaintext: ".txt", javascript: ".js", jsx: ".jsx", typescript: ".ts", tsx: ".tsx",
        python: ".py", css: ".css", html: ".html", xml: ".xml", json: ".json",
        markdown: ".md", bash: ".sh", sql: ".sql", java: ".java", c: ".c",
        cpp: ".cpp", csharp: ".cs", go: ".go", rust: ".rs", php: ".php",
        ruby: ".rb", swift: ".swift", kotlin: ".kt", yaml: ".yaml",
    }

    const anyFolderExpanded = folders.some(f => f.isExpanded)
    const isEmpty = folders.length === 0 && tabs.length === 0

    const iconButton = "rounded p-1 transition-colors hover:bg-accent text-muted-foreground hover:text-foreground shrink-0"
    const rowAction = "rounded p-0.5 shrink-0 text-muted-foreground transition-all"

    const renderFileItem = (tab: Tab) => (
        <div
            key={tab.id}
            draggable={editingTabId !== tab.id}
            onDragStart={() => handleDragStart(tab.id)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOverTab(tab.id, e)}
            onDragLeave={handleDragLeaveTab}
            onDrop={(e) => handleDropOnTab(tab.id, e)}
            onClick={() => { if (editingTabId !== tab.id) setActiveTabId(tab.id) }}
            onDoubleClick={(e) => { e.stopPropagation(); startRenaming(tab) }}
            onContextMenu={(e) => handleContextMenu(e, tab.id)}
            className={cn(
                "group/file w-full flex items-center gap-1.5 px-2 py-1.5 rounded text-sm transition-colors text-left cursor-pointer relative min-w-0",
                tab.id === activeTabId
                    ? "bg-secondary text-foreground"
                    : "text-foreground hover:bg-accent",
                dragOverTab === tab.id && "border-b-2 border-muted-foreground",
                tab.source === "filesystem" && tab.contentLoaded === false && "opacity-60"
            )}
        >
            <FileIcon language={tab.language} />
            {editingTabId === tab.id ? (
                <input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => { setTimeout(() => finishRenaming(tab.id), 150) }}
                    onKeyDown={(e) => handleRenameKeyDown(e, tab.id)}
                    className="flex-1 bg-background px-1 text-foreground outline-none rounded min-w-0"
                    onClick={(e) => e.stopPropagation()}
                    onDoubleClick={(e) => e.stopPropagation()}
                />
            ) : (
                <span className="truncate flex-1 min-w-0">
                    {tab.name}
                    <span className="hidden group-hover/file:inline text-[11px] font-medium text-muted-foreground/60">
                        {extensionMap[tab.language] || ".txt"}
                    </span>
                </span>
            )}
            {tab.isModified && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-foreground group-hover/file:hidden" />
            )}
            <span className="hidden group-hover/file:flex items-center shrink-0">
                <IconTip label="Download file">
                    <button
                        onClick={(e) => { e.stopPropagation(); onDownloadFile(tab.id) }}
                        className={cn(rowAction, "hover:bg-accent hover:text-foreground")}
                        aria-label="Download file"
                    >
                        <Download className="h-3.5 w-3.5" />
                    </button>
                </IconTip>
                <IconTip label="Delete file">
                    <button
                        onClick={(e) => { e.stopPropagation(); deleteFile(tab.id, e) }}
                        className={cn(rowAction, "hover:bg-destructive/10 hover:text-destructive")}
                        aria-label="Delete file"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </IconTip>
            </span>
        </div>
    )

    const activeFolderId = tabs.find(tab => tab.id === activeTabId)?.folderId || null

    const getFilesInFolder = (folderId: string | null) => {
        if (folderId === null) {
            return tabs.filter(tab => !tab.folderId)
        }
        return tabs.filter(tab => tab.folderId === folderId)
    }

    const getSubfolders = (parentFolderId: string | null) => {
        if (parentFolderId === null) {
            return folders.filter(f => !f.parentFolderId)
        }
        return folders.filter(f => f.parentFolderId === parentFolderId)
    }

    const renderFolder = (folder: FolderItem, depth = 0): React.ReactNode => (
        <div key={folder.id} className="space-y-1 min-w-0">
            <div
                draggable
                onDragStart={(e) => { e.stopPropagation(); handleFolderDragStart(folder.id) }}
                onDragEnd={handleDragEnd}
                onClick={() => { if (editingFolderId !== folder.id) toggleFolder(folder.id) }}
                onDoubleClick={(e) => { e.stopPropagation(); startRenamingFolder(folder) }}
                onContextMenu={(e) => handleFolderContextMenu(e, folder.id)}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); handleDragEnterFolder(folder.id) }}
                onDragLeave={handleDragLeaveFolder}
                onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleDropOnFolder(folder.id) }}
                className={cn(
                    "group/folder flex items-center gap-1 px-2 py-1.5 rounded text-sm transition-colors cursor-pointer min-w-0",
                    activeFolderId === folder.id
                        ? "bg-secondary/50 text-foreground"
                        : "text-foreground hover:bg-accent",
                    draggedFolder === folder.id && "opacity-50",
                    dragOverFolder === folder.id && draggedFolder && "border-t-2 border-t-foreground",
                    dragOverFolder === folder.id && !draggedFolder && "bg-muted ring-2 ring-border"
                )}
            >
                {folder.isExpanded ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                {folder.isExpanded ? <FolderOpen className="h-4 w-4 shrink-0" /> : <Folder className="h-4 w-4 shrink-0" />}
                {editingFolderId === folder.id ? (
                    <input
                        autoFocus
                        value={editingFolderName}
                        onChange={(e) => setEditingFolderName(e.target.value)}
                        onBlur={() => { setTimeout(() => finishRenamingFolder(folder.id), 150) }}
                        onKeyDown={(e) => handleRenameFolderKeyDown(e, folder.id)}
                        className="flex-1 bg-background px-1 text-foreground outline-none rounded min-w-0"
                        onClick={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span className="truncate flex-1 min-w-0">{folder.name}</span>
                )}
                <span className="hidden group-hover/folder:flex items-center shrink-0">
                    <IconTip label="Download folder as .zip">
                        <button
                            onClick={(e) => { e.stopPropagation(); onDownloadFolder(folder.id) }}
                            className={cn(rowAction, "hover:bg-accent hover:text-foreground")}
                            aria-label="Download folder as zip"
                        >
                            <Download className="h-3.5 w-3.5" />
                        </button>
                    </IconTip>
                    <IconTip label="Delete folder">
                        <button
                            onClick={(e) => deleteFolder(folder.id, e)}
                            className={cn(rowAction, "hover:bg-destructive/10 hover:text-destructive")}
                            aria-label="Delete folder"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    </IconTip>
                </span>
            </div>

            {folder.isExpanded && (
                <div className="ml-3 space-y-1 min-w-0 border-l border-border/60 pl-1">
                    {/* Nested subfolders */}
                    {getSubfolders(folder.id).map(sub => renderFolder(sub, depth + 1))}
                    {/* Files in this folder */}
                    {getFilesInFolder(folder.id).map(renderFileItem)}
                </div>
            )}
        </div>
    )

    return (
        <div className="flex h-full min-w-0 flex-col bg-card">
            {/* Title row */}
            <div className="flex items-center justify-between gap-1 border-b border-border px-3 py-1.5">
                <h2 className="truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground">Files</h2>
                <div className="flex items-center shrink-0">
                    <IconTip label="Search files and text" shortcut={`${cmdLabel}+K`}>
                        <button
                            onClick={onOpenSearch}
                            className={iconButton}
                            aria-label="Search files and text"
                        >
                            <Search className="h-4 w-4" />
                        </button>
                    </IconTip>
                    {folders.length > 0 && (
                        <IconTip label={anyFolderExpanded ? "Collapse all folders" : "Expand all folders"}>
                            <button
                                onClick={toggleAllFolders}
                                className={iconButton}
                                aria-label={anyFolderExpanded ? "Collapse all folders" : "Expand all folders"}
                            >
                                {anyFolderExpanded ? <ChevronsDownUp className="h-4 w-4" /> : <ChevronsUpDown className="h-4 w-4" />}
                            </button>
                        </IconTip>
                    )}
                    <IconTip label="Hide sidebar" shortcut={`${appModLabel()}+B`}>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className={iconButton}
                            aria-label="Hide sidebar"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </IconTip>
                </div>
            </div>

            {/* Action toolbar — its own row so it survives narrow widths */}
            <div className="flex items-center gap-0.5 border-b border-border px-2 py-1">
                <IconTip label="New file" shortcut={`${appModLabel()}+N`}>
                    <button onClick={createNewTab} className={iconButton} aria-label="New file">
                        <FilePlus className="h-4 w-4" />
                    </button>
                </IconTip>
                <IconTip label="New folder">
                    <button onClick={createNewFolder} className={iconButton} aria-label="New folder">
                        <FolderPlus className="h-4 w-4" />
                    </button>
                </IconTip>
                <span className="mx-0.5 h-4 w-px shrink-0 bg-border" aria-hidden="true" />
                <IconTip label="Open file from disk" shortcut={`${cmdModLabel()}+O`}>
                    <button onClick={onOpenFile} className={iconButton} aria-label="Open file from disk">
                        <FileUp className="h-4 w-4" />
                    </button>
                </IconTip>
                {supportsDirectoryPicker && (
                    <IconTip label="Open folder from disk">
                        <button onClick={onOpenFolder} className={iconButton} aria-label="Open folder from disk">
                            <FolderOpen className="h-4 w-4" />
                        </button>
                    </IconTip>
                )}
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain">
                {isEmpty ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
                        <Folder className="h-8 w-8 text-muted-foreground/40" />
                        <p className="text-xs text-muted-foreground">No files yet</p>
                        <div className="flex flex-col gap-1.5">
                            <button
                                onClick={createNewTab}
                                className="rounded border border-border px-3 py-1 text-xs text-foreground transition-colors hover:bg-accent"
                            >
                                New file
                            </button>
                            <button
                                onClick={onOpenFile}
                                className="rounded border border-border px-3 py-1 text-xs text-foreground transition-colors hover:bg-accent"
                            >
                                Open from disk
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-2">
                        <div className="space-y-1">
                            {/* Root-level folders (recursive render) */}
                            {getSubfolders(null).map(folder => renderFolder(folder))}

                            {/* Root level files (no folder) */}
                            <div
                                onDragOver={handleDragOver}
                                onDrop={handleDropOutsideFolder}
                                className="min-h-[40px]"
                            >
                                {getFilesInFolder(null).map(renderFileItem)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
