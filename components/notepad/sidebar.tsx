"use client"

import React from "react"
import { Plus, X, Folder, FolderOpen, ChevronDown, ChevronRight, FileUp, HardDrive, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tab, FolderItem } from "../notepad"
import { FileIcon } from "./file-icon"

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
    supportsDirectoryPicker
}) => {
    const extensionMap: Record<string, string> = {
        plaintext: ".txt", javascript: ".js", jsx: ".jsx", typescript: ".ts", tsx: ".tsx",
        python: ".py", css: ".css", html: ".html", xml: ".xml", json: ".json",
        markdown: ".md", bash: ".sh", sql: ".sql", java: ".java", c: ".c",
        cpp: ".cpp", csharp: ".cs", go: ".go", rust: ".rs", php: ".php",
        ruby: ".rb", swift: ".swift", kotlin: ".kt", yaml: ".yaml",
    }

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
                "group/file w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors text-left cursor-pointer relative",
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
                <span className="truncate flex-1">
                    {tab.name}
                    <span className="hidden group-hover/file:inline text-[11px] font-medium text-muted-foreground/60">
                        {extensionMap[tab.language] || ".txt"}
                    </span>
                </span>
            )}
            {tab.isModified && !activeTabId?.includes(tab.id) && (
                <span className="h-2 w-2 shrink-0 rounded-full bg-foreground" />
            )}
            <button
                onClick={(e) => { e.stopPropagation(); deleteFile(tab.id, e) }}
                className="opacity-0 group-hover/file:opacity-100 rounded p-0.5 hover:bg-destructive/10 shrink-0 text-muted-foreground hover:text-destructive transition-all"
                aria-label="Delete file"
            >
                <Trash2 className="h-3.5 w-3.5" />
            </button>
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
        <div key={folder.id} className="space-y-1">
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
                    "flex items-center justify-between gap-1 px-2 py-1.5 rounded text-sm transition-colors cursor-pointer group",
                    activeFolderId === folder.id
                        ? "bg-secondary/50 text-foreground"
                        : "text-foreground hover:bg-accent",
                    draggedFolder === folder.id && "opacity-50",
                    dragOverFolder === folder.id && draggedFolder && "border-t-2 border-t-foreground",
                    dragOverFolder === folder.id && !draggedFolder && "bg-muted ring-2 ring-border"
                )}
            >
                <div className="flex items-center gap-1 flex-1 min-w-0">
                    {folder.isExpanded ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                    {folder.isExpanded ? <FolderOpen className="h-4 w-4 shrink-0" /> : <Folder className="h-4 w-4 shrink-0" />}
                    {editingFolderId === folder.id ? (
                        <input
                            autoFocus
                            value={editingFolderName}
                            onChange={(e) => setEditingFolderName(e.target.value)}
                            onBlur={() => { setTimeout(() => finishRenamingFolder(folder.id), 150) }}
                            onKeyDown={(e) => handleRenameFolderKeyDown(e, folder.id)}
                            className="flex-1 bg-background px-1 text-foreground outline-none rounded"
                            onClick={(e) => e.stopPropagation()}
                            onDoubleClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <span className="truncate flex-1">{folder.name}</span>
                    )}
                </div>
                <button
                    onClick={(e) => deleteFolder(folder.id, e)}
                    className="opacity-0 group-hover:opacity-100 rounded p-0.5 hover:bg-destructive/10 shrink-0"
                    aria-label="Delete folder"
                >
                    <X className="h-3 w-3" />
                </button>
            </div>

            {folder.isExpanded && (
                <div className="ml-4 space-y-1">
                    {/* Nested subfolders */}
                    {getSubfolders(folder.id).map(sub => renderFolder(sub, depth + 1))}
                    {/* Files in this folder */}
                    {getFilesInFolder(folder.id).map(renderFileItem)}
                </div>
            )}
        </div>
    )

    return (
        <div className="flex h-full flex-col bg-card">
                    <div className="flex items-center justify-between border-b border-border px-3 py-2">
                        <h2 className="text-sm font-semibold text-foreground">Files</h2>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={onOpenFile}
                                className="rounded p-1 transition-colors hover:bg-accent"
                                title="Open file from disk"
                                aria-label="Open file from disk"
                            >
                                <FileUp className="h-4 w-4" />
                            </button>
                            {supportsDirectoryPicker && (
                                <button
                                    onClick={onOpenFolder}
                                    className="rounded p-1 transition-colors hover:bg-accent"
                                    title="Open folder from disk"
                                    aria-label="Open folder from disk"
                                >
                                    <HardDrive className="h-4 w-4" />
                                </button>
                            )}
                            <button
                                onClick={createNewFolder}
                                className="rounded p-1 transition-colors hover:bg-accent"
                                title="New folder"
                                aria-label="New folder"
                            >
                                <Folder className="h-4 w-4" />
                            </button>
                            <button
                                onClick={createNewTab}
                                className="rounded p-1 transition-colors hover:bg-accent"
                                title="New file (Alt+T / ⌥T)"
                                aria-label="New file"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="rounded p-1 transition-colors hover:bg-accent"
                                title="Hide sidebar (Ctrl+B / ⌘B)"
                                aria-label="Hide sidebar"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto overscroll-contain">
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
                    </div>
        </div>
    )
}
