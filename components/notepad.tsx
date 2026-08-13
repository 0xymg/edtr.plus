"use client"

import React from "react"
import { useState, useCallback, useEffect, useRef, useMemo } from "react"
import { nanoid } from "nanoid"
import { cn } from "@/lib/utils"
import { hasAppModifier, appModLabel, cmdModLabel } from "@/lib/shortcuts"
import { TooltipProvider, IconTip } from "@/components/ui/tooltip"
import type { EditorHandle } from "./notepad/codemirror-editor"
import { Edit2, Trash2, Download, Menu, Save, Settings, Palette, Type, RotateCcw, Sun, Moon, FileText, Plus, X } from "lucide-react"
import {
  supportsFileSystemAccess,
  detectLanguageFromExtension,
  openFilePicker,
  openDirectoryPicker,
  readFileFromHandle,
  writeFileToHandle,
} from "@/lib/file-system"

// Import subcomponents
import dynamic from "next/dynamic"
import { Sidebar } from "./notepad/sidebar"
import { TabBar } from "./notepad/tab-bar"
import { EditorArea } from "./notepad/editor-area"
import { StatusBar } from "./notepad/status-bar"
import type { ContentMatch } from "./notepad/command-palette"

// The palette pulls in cmdk + the dialog primitives; it only mounts once the
// user actually opens it.
const CommandPalette = dynamic(
  () => import("./notepad/command-palette").then(m => m.CommandPalette),
  { ssr: false }
)
import { HexColorPicker } from "react-colorful"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Types
export interface Tab {
  id: string
  name: string
  content: string
  isModified: boolean
  folderId?: string | null
  language: string
  source?: "memory" | "filesystem"
  relativePath?: string
  contentLoaded?: boolean
}

export interface FolderItem {
  id: string
  name: string
  isExpanded: boolean
  source?: "memory" | "filesystem"
  parentFolderId?: string | null
}

const LANGUAGES = [
  { id: "plaintext", name: "Plain Text" },
  { id: "javascript", name: "JavaScript" },
  { id: "jsx", name: "JSX" },
  { id: "typescript", name: "TypeScript" },
  { id: "tsx", name: "TSX" },
  { id: "python", name: "Python" },
  { id: "css", name: "CSS" },
  { id: "html", name: "HTML" },
  { id: "json", name: "JSON" },
  { id: "markdown", name: "Markdown" },
  { id: "bash", name: "Bash" },
  { id: "sql", name: "SQL" },
  { id: "java", name: "Java" },
  { id: "c", name: "C" },
  { id: "cpp", name: "C++" },
  { id: "csharp", name: "C#" },
  { id: "go", name: "Go" },
  { id: "rust", name: "Rust" },
  { id: "php", name: "PHP" },
  { id: "ruby", name: "Ruby" },
  { id: "swift", name: "Swift" },
  { id: "kotlin", name: "Kotlin" },
  { id: "yaml", name: "YAML" },
  { id: "xml", name: "XML" },
  { id: "svg", name: "SVG" },
]

const EXTENSION_MAP: Record<string, string> = {
  plaintext: "txt", javascript: "js", jsx: "jsx", typescript: "ts", tsx: "tsx",
  python: "py", css: "css", html: "html", xml: "xml", json: "json",
  markdown: "md", bash: "sh", sql: "sql", java: "java", c: "c",
  cpp: "cpp", csharp: "cs", go: "go", rust: "rs", php: "php",
  ruby: "rb", swift: "swift", kotlin: "kt", yaml: "yaml", svg: "svg",
}

function getFilename(tab: Tab): string {
  const ext = EXTENSION_MAP[tab.language] || "txt"
  return tab.name.includes(".") ? tab.name : `${tab.name}.${ext}`
}

const uid = () => nanoid(8)

export function Notepad() {
  // State
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "1", name: "e-1", content: "", isModified: false, language: "plaintext" }
  ])
  const [openTabIds, setOpenTabIds] = useState<string[]>(["1"])
  const [activeTabId, setActiveTabId] = useState<string | null>("1")
  const [editingTabId, setEditingTabId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [editingFolderName, setEditingFolderName] = useState("")
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(240)
  const [folders, setFolders] = useState<FolderItem[]>([])
  const [draggedTab, setDraggedTab] = useState<string | null>(null)
  const [draggedFolder, setDraggedFolder] = useState<string | null>(null)
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null)
  const [dragOverTab, setDragOverTab] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{ type: "tab" | "folder"; id: string; x: number; y: number } | null>(null)
  const [statusBarColor, setStatusBarColor] = useState("")
  const [statusBarTextColor, setStatusBarTextColor] = useState("")
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [isFormatting, setIsFormatting] = useState(false)
  const [formatError, setFormatError] = useState<string | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [tabToDelete, setTabToDelete] = useState<string | null>(null)
  const [fontSize, setFontSize] = useState<number>(14)
  const [fontFamily, setFontFamily] = useState<string>("'JetBrains Mono', monospace")
  const [pickerTarget, setPickerTarget] = useState<"bg" | "text">("bg")
  const [showPreview, setShowPreview] = useState<boolean>(false)
  const [wordWrap, setWordWrap] = useState<boolean>(true)
  
  const activePickerColor = pickerTarget === "bg" ? (statusBarColor || "#1e1e2e") : (statusBarTextColor || "#cccccc")

  const updateUserSettings = useCallback((updates: Record<string, any>) => {
    try {
      const current = JSON.parse(localStorage.getItem("notepad-user-settings") || "{}")
      localStorage.setItem("notepad-user-settings", JSON.stringify({ ...current, ...updates }))
    } catch (e) {
      console.error("Failed to save user settings", e)
    }
  }, [])

  const handleColorChange = useCallback((color: string) => {
    if (pickerTarget === "bg") {
      setStatusBarColor(color)
      updateUserSettings({ statusBarColor: color })
    } else {
      setStatusBarTextColor(color)
      updateUserSettings({ statusBarTextColor: color })
    }
  }, [pickerTarget, updateUserSettings])

  const updateTheme = useCallback((newTheme: "light" | "dark", save: boolean = true) => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    if (save) updateUserSettings({ theme: newTheme })
  }, [updateUserSettings])

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    updateTheme(newTheme)
  }, [theme, updateTheme])

  const updateFontSize = (size: number) => {
    const newSize = Math.min(Math.max(size, 8), 32)
    setFontSize(newSize)
    updateUserSettings({ fontSize: newSize })
  }

  const updateFontFamily = (family: string) => {
    setFontFamily(family)
    updateUserSettings({ fontFamily: family })
  }

  const updateActiveTabId = useCallback((id: string | null) => {
    setActiveTabId(id)
    updateUserSettings({ activeTabId: id })
  }, [updateUserSettings])

  const updateSidebarOpen = useCallback((open: boolean) => {
    setSidebarOpen(open)
    updateUserSettings({ sidebarOpen: open })
  }, [updateUserSettings])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => {
      const next = !prev
      updateUserSettings({ sidebarOpen: next })
      return next
    })
  }, [updateUserSettings])

  const scrollBelowEditor = useCallback(() => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
  }, [])

  const updateShowPreview = useCallback((show: boolean) => {
    setShowPreview(show)
    updateUserSettings({ showPreview: show })
  }, [updateUserSettings])

  const togglePreview = useCallback(() => {
    setShowPreview(prev => {
      const next = !prev
      updateUserSettings({ showPreview: next })
      return next
    })
  }, [updateUserSettings])

  const toggleWordWrap = useCallback(() => {
    setWordWrap(prev => {
      const next = !prev
      updateUserSettings({ wordWrap: next })
      return next
    })
  }, [updateUserSettings])

  useEffect(() => {
    try {
      const savedSettingsStr = localStorage.getItem("notepad-user-settings")
      if (savedSettingsStr) {
        const settings = JSON.parse(savedSettingsStr)
        if (settings.fontSize) setFontSize(settings.fontSize)
        if (settings.fontFamily) setFontFamily(settings.fontFamily)
        if (settings.statusBarColor !== undefined) setStatusBarColor(settings.statusBarColor)
        if (settings.statusBarTextColor !== undefined) setStatusBarTextColor(settings.statusBarTextColor)
        if (settings.theme) {
          setTheme(settings.theme)
          updateTheme(settings.theme, false)
        } else {
          // Fallback to legacy theme key
          const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
          if (savedTheme) {
            setTheme(savedTheme)
            updateTheme(savedTheme, false)
          }
        }
        if (settings.sidebarOpen !== undefined) setSidebarOpen(settings.sidebarOpen)
        if (settings.sidebarWidth !== undefined) setSidebarWidth(settings.sidebarWidth)
        if (settings.showPreview !== undefined) setShowPreview(settings.showPreview)
        if (settings.wordWrap !== undefined) setWordWrap(settings.wordWrap)
        if (settings.activeTabId !== undefined) setActiveTabId(settings.activeTabId)
      } else {
        // Fallback for older version
        const savedSize = localStorage.getItem("notepad-font-size")
        if (savedSize) setFontSize(parseInt(savedSize))
        
        const savedFamily = localStorage.getItem("notepad-font-family")
        if (savedFamily) setFontFamily(savedFamily)

        const savedStatusColor = localStorage.getItem("notepad-statusbar-color")
        if (savedStatusColor) setStatusBarColor(savedStatusColor)

        const savedStatusTextColor = localStorage.getItem("notepad-statusbar-text-color")
        if (savedStatusTextColor) setStatusBarTextColor(savedStatusTextColor)

        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
        if (savedTheme) {
          setTheme(savedTheme)
          updateTheme(savedTheme, false)
        }
      }
    } catch (e) {
      console.error("Failed to load user settings", e)
    }
  }, [updateTheme])

  const FONT_FAMILIES = [
    { name: "JetBrains Mono", value: "'JetBrains Mono', monospace" },
    { name: "Fira Code", value: "'Fira Code', monospace" },
    { name: "Roboto Mono", value: "'Roboto Mono', monospace" },
    { name: "Source Code Pro", value: "'Source Code Pro', monospace" },
    { name: "IBM Plex Mono", value: "'IBM Plex Mono', monospace" },
    { name: "Inter", value: "'Inter', sans-serif" },
  ]

  const PRESETS = [
    { name: "Default", bg: "", text: "" },
    { name: "Dark Blue", bg: "#1e3a8a", text: "#ffffff" },
    { name: "Forest", bg: "#064e3b", text: "#ffffff" },
    { name: "Wine", bg: "#4c0519", text: "#ffffff" },
    { name: "Slate", bg: "#334155", text: "#ffffff" },
    { name: "Purple", bg: "#4c1d95", text: "#ffffff" },
    { name: "VS Code", bg: "#007acc", text: "#ffffff" },
  ]

  const resetColors = () => {
    setStatusBarColor("")
    setStatusBarTextColor("")
    updateUserSettings({ statusBarColor: "", statusBarTextColor: "" })
  }

  const resetFont = () => {
    setFontSize(14)
    setFontFamily("'JetBrains Mono', monospace")
    updateUserSettings({ fontSize: 14, fontFamily: "'JetBrains Mono', monospace" })
  }

  const resetAllSettings = () => {
    resetColors()
    resetFont()
  }



  const editorRef = useRef<EditorHandle | null>(null)

  // The exact current text for the active tab: CodeMirror holds the live
  // document (React state receives debounced copies), so save/export paths
  // must read through the editor handle.
  const getLiveContent = useCallback((tab: Tab | undefined) => {
    if (!tab) return ""
    const live = editorRef.current?.getValue()
    return live !== undefined ? live : tab.content
  }, [])

  const activeTabIdRef = useRef<string | null>(null)
  activeTabIdRef.current = activeTabId

  const [paletteOpen, setPaletteOpen] = useState(false)
  // A jump into another tab has to wait for that tab's editor to mount before
  // it can select the range, so the target is parked here until it exists.
  const pendingRevealRef = useRef<{ tabId: string; from: number; to: number } | null>(null)

  // Content for the palette: the active tab lives in CodeMirror, the rest in state
  const getPaletteContent = useCallback((tab: Tab) => {
    if (tab.id === activeTabIdRef.current) {
      const live = editorRef.current?.getValue()
      if (live !== undefined) return live
    }
    return tab.content
  }, [])
  const languageMenuRef = useRef<HTMLDivElement>(null)
  const languageButtonRef = useRef<HTMLButtonElement>(null)
  const editingNameRef = useRef("")
  const editingFolderNameRef = useRef("")
  const fileHandleMapRef = useRef<Map<string, FileSystemFileHandle>>(new Map())
  const dirHandleMapRef = useRef<Map<string, FileSystemDirectoryHandle>>(new Map())

  const openTabs = useMemo(() => {
    return openTabIds.map(id => tabs.find(t => t.id === id)).filter(Boolean) as Tab[]
  }, [tabs, openTabIds])

  const selectTab = useCallback((id: string) => {
    updateActiveTabId(id)
    setOpenTabIds(prev => prev.includes(id) ? prev : [...prev, id])
  }, [updateActiveTabId])

  // Palette: jump to a search hit, switching tabs first when needed
  const revealMatch = useCallback((match: ContentMatch) => {
    if (match.tabId === activeTabIdRef.current) {
      editorRef.current?.reveal(match.from, match.to)
      return
    }
    pendingRevealRef.current = { tabId: match.tabId, from: match.from, to: match.to }
    selectTab(match.tabId)
  }, [selectTab])

  // Palette: reveal a folder by expanding it and showing the sidebar
  const revealFolder = useCallback((folderId: string) => {
    setFolders(prev => prev.map(f => (f.id === folderId ? { ...f, isExpanded: true } : f)))
    updateSidebarOpen(true)
  }, [updateSidebarOpen])

  // Actions
  const createNewTab = useCallback(() => {
    const id = uid()
    const newTab: Tab = {
      id,
      name: `e-${id}`,
      content: "",
      isModified: false,
      language: "plaintext"
    }
    setTabs(prev => [...prev, newTab])
    setOpenTabIds(prev => [...prev, id])
    updateActiveTabId(id)
  }, [updateActiveTabId])

  const saveToLocalStorage = useCallback(() => {
    setSaveStatus("saving")
    try {
      // Only persist memory tabs to localStorage (filesystem tabs can't be restored without handles)
      const liveContent = editorRef.current?.getValue()
      const memoryTabs = tabs
        .filter(t => !t.source || t.source === "memory")
        .map(t => (t.id === activeTabId && liveContent !== undefined ? { ...t, content: liveContent } : t))
      const memoryFolders = folders.filter(f => !f.source || f.source === "memory")
      localStorage.setItem("notepad-tabs", JSON.stringify(memoryTabs))
      localStorage.setItem("notepad-folders", JSON.stringify(memoryFolders))
      localStorage.setItem("notepad-open-tabs", JSON.stringify(openTabIds))
      setTabs(prev => prev.map(tab =>
        tab.id === activeTabId
          ? { ...tab, isModified: false }
          : tab
      ))
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus(null), 2000)
    } catch (e) {
      console.error("Failed to save to localStorage", e)
    }
  }, [tabs, folders, openTabIds, activeTabId])



  const closeTab = useCallback((tabId: string, e?: React.MouseEvent | KeyboardEvent) => {
    if (e && 'stopPropagation' in e) e.stopPropagation()
    setOpenTabIds(prev => {
      const newOpenIds = prev.filter(id => id !== tabId)
      if (activeTabId === tabId) {
        if (newOpenIds.length > 0) {
          const closedIndex = prev.indexOf(tabId)
          const newActiveId = newOpenIds[Math.min(closedIndex, newOpenIds.length - 1)]
          updateActiveTabId(newActiveId)
        } else {
          updateActiveTabId(null)
        }
      }
      return newOpenIds
    })
  }, [activeTabId, updateActiveTabId])

  const updateContent = useCallback((content: string) => {
    setTabs(prev => prev.map(tab => {
      if (tab.id !== activeTabId) return tab
      return { ...tab, content, isModified: true }
    }))
  }, [activeTabId])

  // Tab-scoped variant for the editor: its debounced flush can land during a
  // tab switch, and writing by explicit id keeps it from hitting the tab that
  // just became active.
  const updateTabContent = useCallback((tabId: string, content: string) => {
    setTabs(prev => prev.map(tab =>
      tab.id === tabId ? { ...tab, content, isModified: true } : tab
    ))
  }, [])

  const startRenaming = useCallback((tab: Tab) => {
    editingNameRef.current = tab.name
    setEditingTabId(tab.id)
    setEditingName(tab.name)
  }, [])

  const updateEditingName = useCallback((name: string) => {
    editingNameRef.current = name
    setEditingName(name)
  }, [])

  const finishRenaming = useCallback((tabId: string) => {
    const name = editingNameRef.current
    if (name === "" && !editingNameRef.current) return
    if (name.trim()) {
      setTabs(prev => prev.map(tab =>
        tab.id === tabId ? { ...tab, name: name.trim() } : tab
      ))
    }
    editingNameRef.current = ""
    setEditingTabId(null)
    setEditingName("")
  }, [])

  const handleRenameKeyDown = useCallback((e: React.KeyboardEvent, tabId: string) => {
    e.stopPropagation()
    if (e.key === "Enter") finishRenaming(tabId)
    else if (e.key === "Escape") {
      editingNameRef.current = ""
      setEditingTabId(null)
      setEditingName("")
    }
  }, [finishRenaming])

  const createNewFolder = useCallback(() => {
    const id = uid()
    const newFolder: FolderItem = {
      id: `f-${id}`,
      name: `f-${id}`,
      isExpanded: true
    }
    setFolders(prev => [...prev, newFolder])
    editingFolderNameRef.current = newFolder.name
    setEditingFolderId(newFolder.id)
    setEditingFolderName(newFolder.name)
  }, [])

  // Collapse all when anything is expanded; expand all otherwise
  const toggleAllFolders = useCallback(() => {
    setFolders(prev => {
      const anyExpanded = prev.some(f => f.isExpanded)
      return prev.map(f => ({ ...f, isExpanded: !anyExpanded }))
    })
  }, [])

  const toggleFolder = useCallback((folderId: string) => {
    setFolders(prev => prev.map(folder =>
      folder.id === folderId ? { ...folder, isExpanded: !folder.isExpanded } : folder
    ))
  }, [])

  const deleteFolder = useCallback((folderId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setTabs(prev => prev.map(tab =>
      tab.folderId === folderId ? { ...tab, folderId: null } : tab
    ))
    setFolders(prev => prev.filter(f => f.id !== folderId))
  }, [])

  const startRenamingFolder = useCallback((folder: FolderItem) => {
    editingFolderNameRef.current = folder.name
    setEditingFolderId(folder.id)
    setEditingFolderName(folder.name)
  }, [])

  const updateEditingFolderName = useCallback((name: string) => {
    editingFolderNameRef.current = name
    setEditingFolderName(name)
  }, [])

  const finishRenamingFolder = useCallback((folderId: string) => {
    const name = editingFolderNameRef.current
    if (name.trim()) {
      setFolders(prev => prev.map(folder =>
        folder.id === folderId ? { ...folder, name: name.trim() } : folder
      ))
    }
    editingFolderNameRef.current = ""
    setEditingFolderId(null)
    setEditingFolderName("")
  }, [])

  const handleRenameFolderKeyDown = useCallback((e: React.KeyboardEvent, folderId: string) => {
    e.stopPropagation()
    if (e.key === "Enter") finishRenamingFolder(folderId)
    else if (e.key === "Escape") {
      editingFolderNameRef.current = ""
      setEditingFolderId(null)
      setEditingFolderName("")
    }
  }, [finishRenamingFolder])

  // Drag & Drop
  const dragRef = useRef<{ type: "tab" | "folder"; id: string } | null>(null)

  const handleDragStart = useCallback((tabId: string) => {
    dragRef.current = { type: "tab", id: tabId }
    setDraggedTab(tabId)
  }, [])

  const handleFolderDragStart = useCallback((folderId: string) => {
    dragRef.current = { type: "folder", id: folderId }
    setDraggedFolder(folderId)
  }, [])

  const handleDragEnd = useCallback(() => {
    dragRef.current = null
    setDraggedTab(null)
    setDraggedFolder(null)
    setDragOverFolder(null)
    setDragOverTab(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => e.preventDefault(), [])
  const handleDragEnterFolder = useCallback((folderId: string) => setDragOverFolder(folderId), [])
  const handleDragLeaveFolder = useCallback(() => setDragOverFolder(null), [])

  const handleDropOnFolder = useCallback((folderId: string) => {
    const drag = dragRef.current
    if (!drag) return
    if (drag.type === "folder" && drag.id !== folderId) {
      const dragId = drag.id
      setFolders(prev => {
        const draggedIndex = prev.findIndex(f => f.id === dragId)
        const targetIndex = prev.findIndex(f => f.id === folderId)
        if (draggedIndex === -1 || targetIndex === -1) return prev
        const newFolders = [...prev]
        const [dragged] = newFolders.splice(draggedIndex, 1)
        newFolders.splice(targetIndex, 0, dragged)
        return newFolders
      })
    } else if (drag.type === "tab") {
      const tabId = drag.id
      setTabs(prev => prev.map(tab => tab.id === tabId ? { ...tab, folderId } : tab))
    }
    dragRef.current = null
    setDraggedTab(null)
    setDraggedFolder(null)
    setDragOverFolder(null)
  }, [])

  const handleDropOutsideFolder = useCallback(() => {
    const drag = dragRef.current
    if (drag?.type === "tab") {
      const tabId = drag.id
      setTabs(prev => prev.map(tab => tab.id === tabId ? { ...tab, folderId: null } : tab))
    }
    dragRef.current = null
    setDraggedTab(null)
    setDraggedFolder(null)
    setDragOverTab(null)
  }, [])

  const handleDragOverTab = useCallback((tabId: string, e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const drag = dragRef.current
    if (drag?.type === "tab" && drag.id !== tabId) setDragOverTab(tabId)
  }, [])

  const handleDragLeaveTab = useCallback(() => setDragOverTab(null), [])

  const handleDropOnTab = useCallback((targetTabId: string, e: React.DragEvent) => {
    e.stopPropagation()
    const drag = dragRef.current
    if (drag?.type === "tab" && drag.id !== targetTabId) {
      const tabId = drag.id
      setTabs(prev => {
        const draggedIndex = prev.findIndex(t => t.id === tabId)
        const targetIndex = prev.findIndex(t => t.id === targetTabId)
        if (draggedIndex === -1 || targetIndex === -1) return prev
        const newTabs = [...prev]
        const [draggedItem] = newTabs.splice(draggedIndex, 1)
        const targetFolderId = prev[targetIndex].folderId
        newTabs.splice(targetIndex, 0, { ...draggedItem, folderId: targetFolderId })
        return newTabs
      })
    }
    dragRef.current = null
    setDraggedTab(null)
    setDraggedFolder(null)
    setDragOverTab(null)
  }, [])

  const handleContextMenu = useCallback((e: React.MouseEvent, tabId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ type: "tab", id: tabId, x: e.clientX, y: e.clientY })
  }, [])

  const handleFolderContextMenu = useCallback((e: React.MouseEvent, folderId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ type: "folder", id: folderId, x: e.clientX, y: e.clientY })
  }, [])

  const closeContextMenu = useCallback(() => setContextMenu(null), [])

  const handleSidebarResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = sidebarWidth
    let currentWidth = startWidth
    const onMouseMove = (ev: MouseEvent) => {
      currentWidth = Math.min(384, Math.max(160, startWidth + (ev.clientX - startX)))
      setSidebarWidth(currentWidth)
    }
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
      updateUserSettings({ sidebarWidth: currentWidth })
    }
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
  }, [sidebarWidth, updateUserSettings])

  const changeLanguage = useCallback((languageId: string) => {
    setTabs(prev => prev.map(tab =>
      tab.id === activeTabId ? { ...tab, language: languageId } : tab
    ))
    setLanguageMenuOpen(false)
  }, [activeTabId])

  const getWordCount = useCallback((content: string) => {
    // Counting loop instead of trim().split(/\s+/): the split allocated an
    // array with one entry per word, which at 10k+ lines meant a huge
    // throwaway allocation on every keystroke.
    let count = 0
    let inWord = false
    for (let i = 0; i < content.length; i++) {
      const c = content.charCodeAt(i)
      const isSpace = c === 32 || (c >= 9 && c <= 13)
      if (!isSpace && !inWord) {
        count++
        inWord = true
      } else if (isSpace) {
        inWord = false
      }
    }
    return count
  }, [])

  const triggerDownload = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const downloadFile = useCallback(() => {
    const activeTab = tabs.find(t => t.id === activeTabId)
    if (!activeTab) return
    const blob = new Blob([getLiveContent(activeTab)], { type: "text/plain;charset=utf-8" })
    triggerDownload(blob, getFilename(activeTab))
  }, [tabs, activeTabId, triggerDownload, getLiveContent])

  const downloadFileById = useCallback(async (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId)
    if (!tab) return
    let text = tabId === activeTabId ? getLiveContent(tab) : tab.content
    // Filesystem files load lazily; read from disk so we don't download an empty file
    if (tab.source === "filesystem" && tab.contentLoaded === false) {
      const handle = fileHandleMapRef.current.get(tab.id)
      if (handle) {
        try { text = await readFileFromHandle(handle) } catch (e) { console.error("Failed to read file:", e) }
      }
    }
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
    triggerDownload(blob, getFilename(tab))
    closeContextMenu()
  }, [tabs, activeTabId, triggerDownload, closeContextMenu, getLiveContent])

  const downloadFolderAsZip = useCallback(async (folderId: string) => {
    const folder = folders.find(f => f.id === folderId)
    if (!folder) return
    const { default: JSZip } = await import("jszip")
    const zip = new JSZip()
    // Walk the folder tree so nested subfolders land in the zip with their paths
    const entries: { tab: Tab; path: string }[] = []
    const collect = (fid: string, path: string) => {
      tabs.filter(t => t.folderId === fid).forEach(tab => entries.push({ tab, path }))
      folders.filter(f => f.parentFolderId === fid).forEach(sub => collect(sub.id, `${path}${sub.name}/`))
    }
    collect(folderId, "")
    for (const { tab, path } of entries) {
      let text = tab.id === activeTabId ? getLiveContent(tab) : tab.content
      if (tab.source === "filesystem" && tab.contentLoaded === false) {
        const handle = fileHandleMapRef.current.get(tab.id)
        if (handle) {
          try { text = await readFileFromHandle(handle) } catch (e) { console.error("Failed to read file:", e) }
        }
      }
      zip.file(path + getFilename(tab), text)
    }
    const blob = await zip.generateAsync({ type: "blob" })
    triggerDownload(blob, `${folder.name}.zip`)
    closeContextMenu()
  }, [folders, tabs, activeTabId, getLiveContent, triggerDownload, closeContextMenu])

  const handlePrint = useCallback(() => {
    const activeTab = tabs.find(t => t.id === activeTabId)
    const printContent = getLiveContent(activeTab)
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>EDTR - ${activeTab?.name || 'Untitled'}</title>
            <style>body { font-family: monospace; white-space: pre-wrap; padding: 20px; }</style>
          </head>
          <body>${printContent}</body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }, [tabs, activeTabId, getLiveContent])

  const formatCode = useCallback(() => {
    const activeTab = tabs.find(t => t.id === activeTabId)
    if (!activeTab || activeTab.language === "plaintext") return
    const source = getLiveContent(activeTab)
    if (!source) return
    setIsFormatting(true)
    setFormatError(null)
    try {
      let formatted = source
      if (activeTab.language === "json") {
        try { formatted = JSON.stringify(JSON.parse(source), null, 2) }
        catch {
          setFormatError("Invalid JSON")
          setIsFormatting(false)
          setTimeout(() => setFormatError(null), 3000)
          return
        }
      } else {
        formatted = formatted.split('\n').map(l => l.trimEnd()).join('\n').replace(/\n{3,}/g, '\n\n').trim()
      }
      // Write through the editor so the change lands in its undo history
      editorRef.current?.setValue(formatted)
      setTabs(prev => prev.map(tab =>
        tab.id === activeTabId ? { ...tab, content: formatted, isModified: true } : tab
      ))
    } catch (error) {
      setFormatError("Failed to format code")
      setTimeout(() => setFormatError(null), 3000)
    } finally { setIsFormatting(false) }
  }, [tabs, activeTabId, getLiveContent])

  const performDelete = useCallback((tabId: string) => {
    setTabs(prev => prev.filter(tab => tab.id !== tabId))
    setOpenTabIds(prev => {
      const newOpenIds = prev.filter(id => id !== tabId)
      if (activeTabId === tabId) {
        if (newOpenIds.length > 0) {
          const closedIndex = prev.indexOf(tabId)
          updateActiveTabId(newOpenIds[Math.min(closedIndex, newOpenIds.length - 1)])
        } else updateActiveTabId(null)
      }
      return newOpenIds
    })
    closeContextMenu()
  }, [activeTabId, closeContextMenu])

  const deleteFile = useCallback((tabId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const file = tabs.find(t => t.id === tabId)
    if (file && file.content.trim().length > 0) {
      setTabToDelete(tabId)
      setDeleteConfirmOpen(true)
      return
    }
    performDelete(tabId)
  }, [tabs, performDelete])

  const renameFileFromContext = useCallback((tabId: string) => {
    const tab = tabs.find(t => t.id === tabId)
    if (tab) startRenaming(tab)
    closeContextMenu()
  }, [tabs, startRenaming, closeContextMenu])

  const renameFolderFromContext = useCallback((folderId: string) => {
    const folder = folders.find(f => f.id === folderId)
    if (folder) startRenamingFolder(folder)
    closeContextMenu()
  }, [folders, startRenamingFolder, closeContextMenu])

  const deleteFolderFromContext = useCallback((folderId: string) => {
    setTabs(prev => prev.map(tab =>
      tab.folderId === folderId ? { ...tab, folderId: null } : tab
    ))
    setFolders(prev => prev.filter(f => f.id !== folderId))
    closeContextMenu()
  }, [closeContextMenu])

  // File System Access API actions
  const openFileFromDisk = useCallback(async () => {
    try {
      const results = await openFilePicker()
      if (results.length === 0) return
      const newTabs: Tab[] = []
      for (const { handle, file } of results) {
        const content = await file.text()
        const lang = detectLanguageFromExtension(file.name)
        const nameWithoutExt = file.name.replace(/\.[^.]+$/, "")
        const tabId = uid()
        const newTab: Tab = {
          id: tabId,
          name: nameWithoutExt,
          content,
          isModified: false,
          language: lang,
          source: handle ? "filesystem" : "memory",
          contentLoaded: true,
        }
        if (handle) {
          fileHandleMapRef.current.set(tabId, handle)
        }
        newTabs.push(newTab)
      }
      setTabs(prev => [...prev, ...newTabs])
      if (newTabs.length > 0) {
        updateActiveTabId(newTabs[newTabs.length - 1].id)
      }
      updateSidebarOpen(true)
    } catch (e) {
      console.error("Failed to open file:", e)
    }
  }, [updateActiveTabId, updateSidebarOpen])

  const openFolderFromDisk = useCallback(async () => {
    try {
      const result = await openDirectoryPicker()
      if (!result) return
      const { dirHandle, entries } = result

      const folderId = `f-${uid()}`
      const newFolder: FolderItem = {
        id: folderId,
        name: dirHandle.name,
        isExpanded: true,
        source: "filesystem",
      }
      dirHandleMapRef.current.set(folderId, dirHandle)

      // Create subfolder map for nested dirs
      const subfolderMap = new Map<string, string>() // relativePath -> folderId
      const newFolders: FolderItem[] = [newFolder]
      const newTabs: Tab[] = []

      for (const entry of entries) {
        if (entry.kind === "directory") {
          const subFolderId = `f-${uid()}`
          subfolderMap.set(entry.relativePath, subFolderId)
          // Determine parent: if path has "/" parent is that folder, else it's the root folder
          const dirParentPath = entry.relativePath.includes("/")
            ? entry.relativePath.substring(0, entry.relativePath.lastIndexOf("/"))
            : null
          const dirParentFolderId = dirParentPath ? subfolderMap.get(dirParentPath) || folderId : folderId
          newFolders.push({
            id: subFolderId,
            name: entry.name,
            isExpanded: false,
            source: "filesystem",
            parentFolderId: dirParentFolderId,
          })
          dirHandleMapRef.current.set(subFolderId, entry.handle as FileSystemDirectoryHandle)
        } else {
          const tabId = uid()
          // Determine parent folder
          const parentPath = entry.relativePath.includes("/")
            ? entry.relativePath.substring(0, entry.relativePath.lastIndexOf("/"))
            : null
          const parentFolderId = parentPath ? subfolderMap.get(parentPath) || folderId : folderId

          const nameWithoutExt = entry.name.replace(/\.[^.]+$/, "")
          const newTab: Tab = {
            id: tabId,
            name: nameWithoutExt,
            content: "",
            isModified: false,
            language: detectLanguageFromExtension(entry.name),
            folderId: parentFolderId,
            source: "filesystem",
            relativePath: entry.relativePath,
            contentLoaded: false,
          }
          fileHandleMapRef.current.set(tabId, entry.handle as FileSystemFileHandle)
          newTabs.push(newTab)
        }
      }

      setFolders(prev => [...prev, ...newFolders])
      setTabs(prev => [...prev, ...newTabs])
      updateSidebarOpen(true)
    } catch (e) {
      console.error("Failed to open folder:", e)
    }
  }, [])

  const handleExternalFileDrop = useCallback(async (file: File) => {
    try {
      const content = await file.text()
      const lang = detectLanguageFromExtension(file.name)
      const nameWithoutExt = file.name.replace(/\.[^.]+$/, "")
      const tabId = uid()

      const newTab: Tab = {
        id: tabId,
        name: nameWithoutExt,
        content,
        isModified: false,
        language: lang,
        source: "memory",
        contentLoaded: true,
      }

      setTabs(prev => [...prev, newTab])
      setOpenTabIds(prev => [...prev, tabId])
      updateActiveTabId(tabId)
      updateSidebarOpen(true)

      if (lang === "svg") {
        setShowPreview(true)
      }
    } catch (e) {
      console.error("Failed to read dropped file:", e)
    }
  }, [])

  const loadFileContent = useCallback(async (tabId: string) => {
    const handle = fileHandleMapRef.current.get(tabId)
    if (!handle) return
    try {
      const content = await readFileFromHandle(handle)
      setTabs(prev => prev.map(tab =>
        tab.id === tabId ? { ...tab, content, contentLoaded: true, isModified: false } : tab
      ))
    } catch (e) {
      console.error("Failed to read file:", e)
    }
  }, [])

  const saveFile = useCallback(async () => {
    const activeTab = tabs.find(t => t.id === activeTabId)
    if (!activeTab) return

    if (activeTab.source === "filesystem") {
      const handle = fileHandleMapRef.current.get(activeTab.id)
      if (handle) {
        setSaveStatus("saving")
        try {
          await writeFileToHandle(handle, getLiveContent(activeTab))
          setTabs(prev => prev.map(tab =>
            tab.id === activeTabId ? { ...tab, isModified: false } : tab
          ))
          setSaveStatus("saved")
          setTimeout(() => setSaveStatus(null), 2000)
        } catch (e) {
          console.error("Failed to save to disk:", e)
          setSaveStatus(null)
        }
        return
      }
    }
    // Fallback to localStorage
    saveToLocalStorage()
  }, [tabs, activeTabId, saveToLocalStorage, getLiveContent])

  // Effects
  useEffect(() => {
    const savedTabs = localStorage.getItem("notepad-tabs")
    const savedFolders = localStorage.getItem("notepad-folders")
    const savedOpenTabs = localStorage.getItem("notepad-open-tabs")
    if (savedFolders) {
      try { setFolders(JSON.parse(savedFolders)) } catch (e) { }
    }
    if (savedTabs) {
      try {
        const parsed = JSON.parse(savedTabs)
        if (parsed?.length > 0) {
          const tabsWithLanguage = parsed.map((tab: Tab) => ({
            ...tab, language: tab.language || "plaintext", isModified: false
          }))
          setTabs(tabsWithLanguage)

          if (savedOpenTabs) {
            try {
              const openIds = JSON.parse(savedOpenTabs)
              setOpenTabIds(openIds)
              if (openIds.length > 0) updateActiveTabId(openIds[0])
            } catch (e) {
              setOpenTabIds([tabsWithLanguage[0].id])
              updateActiveTabId(tabsWithLanguage[0].id)
            }
          } else {
            setOpenTabIds([tabsWithLanguage[0].id])
            updateActiveTabId(tabsWithLanguage[0].id)
          }
        }
      } catch (e) { }
    }
    const savedStatusBarColor = localStorage.getItem("notepad-statusbar-color")
    if (savedStatusBarColor) setStatusBarColor(savedStatusBarColor)
    const savedStatusBarTextColor = localStorage.getItem("notepad-statusbar-text-color")
    if (savedStatusBarTextColor) setStatusBarTextColor(savedStatusBarTextColor)
    setTimeout(() => editorRef.current?.focus(), 0)
  }, [])

  useEffect(() => {
    if (activeTabId) {
      editorRef.current?.focus()
    }
  }, [activeTabId])

  // Launch Queue - handle "Open with EDTR" from OS
  useEffect(() => {
    if (!window.launchQueue) return
    window.launchQueue.setConsumer(async (launchParams) => {
      if (!launchParams.files?.length) return
      const newTabs: Tab[] = []
      for (const handle of launchParams.files) {
        try {
          const file = await handle.getFile()
          const content = await file.text()
          const lang = detectLanguageFromExtension(file.name)
          const nameWithoutExt = file.name.replace(/\.[^.]+$/, "")
          const tabId = uid()
          const newTab: Tab = {
            id: tabId,
            name: nameWithoutExt,
            content,
            isModified: false,
            language: lang,
            source: "filesystem",
            contentLoaded: true,
          }
          fileHandleMapRef.current.set(tabId, handle)
          newTabs.push(newTab)
        } catch (e) {
          console.error("Failed to open launched file:", e)
        }
      }
      if (newTabs.length > 0) {
        setTabs(prev => [...prev, ...newTabs])
        updateActiveTabId(newTabs[newTabs.length - 1].id)
        updateSidebarOpen(true)
      }
    })
  }, [])

  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const initialTheme = savedTheme || (isDark ? "dark" : "light")
    setTheme(initialTheme)
    updateTheme(initialTheme)
    const savedStatusBarColor = localStorage.getItem("notepad-statusbar-color")
    if (savedStatusBarColor) setStatusBarColor(savedStatusBarColor)
  }, [updateTheme])

  // Sync browser title bar (theme-color) with status bar color
  useEffect(() => {
    const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    const color = statusBarColor || (theme === "dark" ? "#000000" : "#ffffff")
    metas.forEach(meta => { meta.content = color })
    // Also create one if none exist (fallback)
    if (metas.length === 0) {
      const meta = document.createElement("meta")
      meta.name = "theme-color"
      meta.content = color
      document.head.appendChild(meta)
    }
  }, [statusBarColor, theme])

  const activeTab = tabs.find(t => t.id === activeTabId)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmd = e.ctrlKey || e.metaKey
      // App command modifier: ⌃⌥ on macOS (bare Option types characters and
      // ⌘⌥ hits browser menu shortcuts), plain Alt elsewhere (Ctrl+Alt is
      // AltGr on many Windows layouts). See lib/shortcuts.ts.
      const isAppMod = hasAppModifier(e)
      // Match on e.code (physical key): with Option held, e.key carries the
      // produced character ("˜"), not the letter.
      // Save / Download / Open — universal pattern, preventDefault is reliable
      if (isCmd && e.shiftKey && !e.altKey && e.code === "KeyS") { e.preventDefault(); downloadFile(); return }
      if (isCmd && !e.shiftKey && !e.altKey && e.code === "KeyS") { e.preventDefault(); saveFile(); return }
      if (isCmd && !e.shiftKey && !e.altKey && e.code === "KeyO") { e.preventDefault(); openFileFromDisk(); return }
      // Command palette — ⌘K/Ctrl+K, the universal convention (VS Code,
      // GitHub, Linear). Overrides the browser's "focus search box".
      if (isCmd && !e.shiftKey && !e.altKey && e.code === "KeyK") {
        e.preventDefault()
        setPaletteOpen(prev => !prev)
        return
      }
      // Tab management (avoid Alt+T/W which can trigger menu access on Windows)
      if (isAppMod && !e.shiftKey && e.code === "KeyN") { e.preventDefault(); createNewTab(); return }
      if (isAppMod && !e.shiftKey && e.code === "KeyX") { e.preventDefault(); if (activeTabId) closeTab(activeTabId, e); return }
      // Sidebar (avoid ⌘B which opens Firefox bookmarks sidebar)
      if (isAppMod && !e.shiftKey && e.code === "KeyB") { e.preventDefault(); toggleSidebar(); return }
      // Markdown/SVG preview (avoid ⌘⇧P which can trigger browser profile menu)
      if (isAppMod && !e.shiftKey && e.code === "KeyP") {
        if (activeTab?.language === "markdown" || activeTab?.language === "svg") {
          e.preventDefault()
          togglePreview()
        }
        return
      }
      // Format code — app modifier + Shift + F (mirrors VS Code's ⇧⌥F)
      if (isAppMod && e.shiftKey && e.code === "KeyF") { e.preventDefault(); formatCode() }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [saveFile, createNewTab, formatCode, activeTabId, closeTab, downloadFile, openFileFromDisk, toggleSidebar, togglePreview, activeTab?.language])

  useEffect(() => {
    const handleClick = () => {
      closeContextMenu()
      setLanguageMenuOpen(false)
    }
    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [closeContextMenu])

  useEffect(() => {
    if (!tabs.some(tab => tab.isModified)) return
    const timer = setTimeout(() => saveFile(), 5000)
    return () => clearTimeout(timer)
  }, [tabs, saveFile])

  // Apply a palette jump that had to wait for a tab switch: the editor
  // remounts per tab, and a lazily loaded file needs its content first.
  useEffect(() => {
    const pending = pendingRevealRef.current
    if (!pending || pending.tabId !== activeTabId) return
    if (activeTab?.source === "filesystem" && activeTab.contentLoaded === false) return
    const id = setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.reveal(pending.from, pending.to)
        pendingRevealRef.current = null
      }
    }, 0)
    return () => clearTimeout(id)
  }, [activeTabId, activeTab?.contentLoaded, activeTab?.source, tabs])

  // Lazy-load filesystem file content when tab becomes active
  useEffect(() => {
    if (activeTab && activeTab.source === "filesystem" && activeTab.contentLoaded === false) {
      loadFileContent(activeTab.id)
    }
  }, [activeTabId, activeTab?.contentLoaded, loadFileContent])

  // Automatically show preview for markdown and svg files
  useEffect(() => {
    if (activeTab?.language === "markdown" || activeTab?.language === "svg") {
      setShowPreview(true)
    } else {
      setShowPreview(false)
    }
  }, [activeTabId, activeTab?.language])

  return (
    <TooltipProvider>
    <div
      className="flex h-full flex-col bg-background overscroll-contain"
      onWheel={(e) => e.stopPropagation()}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <link 
        href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap" 
        rel="stylesheet" 
      />
      {/* Window Title Bar */}
      <div className="flex h-10 items-center border-b border-border bg-card/50 shrink-0 relative">
        {/* Traffic Lights */}
        <div className="flex items-center gap-2 px-4 border-r border-border h-full shrink-0">
          <IconTip label="Scroll below editor">
            <button
              onClick={(e) => { e.stopPropagation(); scrollBelowEditor() }}
              className="group flex h-3 w-3 items-center justify-center rounded-full border border-[#e0443e] bg-[#ff5f56] transition-transform hover:scale-110 active:scale-95"
              aria-label="Scroll below editor"
            >
              <X className="h-2 w-2 text-black/55 opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={3} />
            </button>
          </IconTip>
          <IconTip label={`${sidebarOpen ? "Hide" : "Show"} sidebar`} shortcut={`${appModLabel()}+B`}>
            <button
              onClick={(e) => { e.stopPropagation(); toggleSidebar() }}
              className="group flex h-3 w-3 items-center justify-center rounded-full border border-[#dea123] bg-[#ffbd2e] transition-transform hover:scale-110 active:scale-95"
              aria-label={`${sidebarOpen ? "Hide" : "Show"} sidebar`}
            >
              <Menu className="h-2 w-2 text-black/55 opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={3} />
            </button>
          </IconTip>
          <IconTip label="New tab" shortcut={`${appModLabel()}+N`}>
            <button
              onClick={(e) => { e.stopPropagation(); createNewTab() }}
              className="group flex h-3 w-3 items-center justify-center rounded-full border border-[#1aab29] bg-[#27c93f] transition-transform hover:scale-110 active:scale-95"
              aria-label="New tab"
            >
              <Plus className="h-2 w-2 text-black/55 opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={3} />
            </button>
          </IconTip>
        </div>

        {/* Sidebar Toggle Button */}
        <IconTip label={`${sidebarOpen ? "Hide" : "Show"} sidebar`} shortcut={`${appModLabel()}+B`}>
          <button
            onClick={(e) => { e.stopPropagation(); toggleSidebar() }}
            className="flex items-center px-4 border-r border-border h-full shrink-0 transition-colors hover:bg-accent text-muted-foreground hover:text-foreground outline-none group"
            aria-label={`${sidebarOpen ? "Hide" : "Show"} sidebar`}
          >
            <Menu className="h-4 w-4 transition-transform group-active:scale-90" />
          </button>
        </IconTip>

        {/* Centered Brand */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-[family-name:var(--font-author)] font-bold tracking-tight text-[13px] text-muted-foreground select-none pointer-events-none">
          EDTR<span className="ml-[0.09em] text-[1.2em] text-[#F5A524]">+</span>
        </div>

        <div className="flex items-center h-full ml-auto">
          {/* Settings Button */}
          <Popover>
            <PopoverTrigger asChild>
              <span>
                <IconTip label="Settings">
                  <button
                    className="flex items-center px-4 border-l border-border h-full transition-colors hover:bg-accent text-muted-foreground hover:text-foreground outline-none group"
                    aria-label="Settings"
                  >
                    <Settings className="h-4 w-4 transition-transform group-active:rotate-90" />
                  </button>
                </IconTip>
              </span>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-semibold text-sm">Settings</h4>
                    <p className="text-[10px] text-muted-foreground">Manage your editor preferences.</p>
                  </div>
                  <button
                    onClick={resetAllSettings}
                    className="flex items-center gap-1.5 px-2 py-1 rounded border border-border bg-background hover:bg-accent text-[10px] font-medium transition-colors shadow-sm"
                  >
                    <RotateCcw className="h-3 w-3" /> Reset All
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Font Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Type className="h-3.5 w-3.5" /> Typography
                    </label>
                    <button
                      onClick={resetFont}
                      className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Reset Font
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-muted-foreground">Font Family</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {FONT_FAMILIES.map((f) => (
                          <button
                            key={f.name}
                            onClick={() => updateFontFamily(f.value)}
                            className={cn(
                              "px-2 py-1.5 rounded border border-border text-[10px] text-left transition-all hover:bg-accent",
                              fontFamily === f.value ? "bg-accent border-primary/50 font-semibold" : "bg-background"
                            )}
                            style={{ fontFamily: f.value }}
                          >
                            {f.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">Size</span>
                        <span className="text-[10px] font-mono text-muted-foreground">{fontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="8"
                        max="32"
                        step="1"
                        value={fontSize}
                        onChange={(e) => updateFontSize(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Bar Section */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Palette className="h-3.5 w-3.5" /> Status Bar
                    </label>
                    {(statusBarColor || statusBarTextColor) && (
                      <button
                        onClick={resetColors}
                        className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Reset Colors
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Presets */}
                    <div className="grid grid-cols-3 gap-2">
                      {PRESETS.map((p) => (
                        <button
                          key={p.name}
                          onClick={() => {
                            setStatusBarColor(p.bg)
                            setStatusBarTextColor(p.text)
                            if (p.bg) localStorage.setItem("notepad-statusbar-color", p.bg)
                            else localStorage.removeItem("notepad-statusbar-color")
                            if (p.text) localStorage.setItem("notepad-statusbar-text-color", p.text)
                            else localStorage.removeItem("notepad-statusbar-text-color")
                          }}
                          className={cn(
                            "h-10 rounded border border-border flex items-center justify-center relative overflow-hidden transition-all hover:ring-2 hover:ring-primary/20",
                            (statusBarColor === p.bg && statusBarTextColor === p.text) && "ring-2 ring-primary"
                          )}
                          style={{ backgroundColor: p.bg || "var(--card)", color: p.text || "var(--foreground)" }}
                        >
                          <span className="text-[9px] font-medium">{p.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Custom Picker Logic */}
                    <div className="space-y-3 pt-2">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setPickerTarget("bg")}
                          className={cn(
                            "flex-1 rounded px-2 py-1.5 text-[11px] font-semibold transition-colors",
                            pickerTarget === "bg"
                              ? "bg-foreground text-background"
                              : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                          )}
                        >
                          Background
                        </button>
                        <button
                          onClick={() => setPickerTarget("text")}
                          className={cn(
                            "flex-1 rounded px-2 py-1.5 text-[11px] font-semibold transition-colors",
                            pickerTarget === "text"
                              ? "bg-foreground text-background"
                              : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                          )}
                        >
                          Text
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div className="rounded-lg overflow-hidden border border-border">
                          <HexColorPicker
                            color={activePickerColor}
                            onChange={handleColorChange}
                            style={{ width: "100%", height: "120px" }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-7 w-7 shrink-0 rounded border border-border shadow-sm"
                            style={{ backgroundColor: activePickerColor }}
                          />
                          <input
                            type="text"
                            value={activePickerColor}
                            onChange={(e) => {
                              const val = e.target.value
                              if (val === "" || /^#[0-9a-fA-F]{0,6}$/.test(val)) {
                                handleColorChange(val)
                              }
                            }}
                            className="flex-1 rounded border border-border bg-background px-2 py-1 text-[11px] text-foreground font-mono outline-none focus:ring-1 focus:ring-primary h-7"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appearance Section */}
                <div className="pt-4 border-t border-border">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Appearance</span>
                    <button
                      onClick={toggleTheme}
                      className="flex h-7 w-full items-center justify-center gap-2 rounded border border-border bg-background text-[11px] font-medium transition-colors hover:bg-accent"
                    >
                      {theme === "dark" ? (
                        <><Sun className="h-3 w-3" /> Light Mode</>
                      ) : (
                        <><Moon className="h-3 w-3" /> Dark Mode</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Save Button */}
          <IconTip
            label={activeTab?.source === "filesystem" ? "Save to disk" : "Save"}
            shortcut={`${cmdModLabel()}+S`}
          >
            <button
              onClick={(e) => { e.stopPropagation(); saveFile() }}
              className="flex items-center px-4 border-l border-border h-full transition-colors hover:bg-accent text-muted-foreground hover:text-foreground outline-none group"
              aria-label="Save"
            >
              <Save className="h-4 w-4 transition-transform group-active:scale-90" />
            </button>
          </IconTip>

          {/* Download Button */}
          <IconTip label="Download file" shortcut={`${cmdModLabel()}⇧+S`}>
            <button
              onClick={(e) => { e.stopPropagation(); downloadFile() }}
              className="flex items-center px-4 border-l border-border h-full transition-colors hover:bg-accent text-muted-foreground hover:text-foreground outline-none group"
              aria-label="Download file"
            >
              <Download className="h-4 w-4 transition-transform group-active:scale-90" />
            </button>
          </IconTip>

          {/* Preview Toggle Button */}
          {(activeTab?.language === "markdown" || activeTab?.language === "svg") && (
            <IconTip label={showPreview ? "Hide preview" : "Show preview"} shortcut={`${appModLabel()}+P`}>
            <button
              onClick={(e) => { e.stopPropagation(); togglePreview() }}
              className={cn(
                "flex items-center px-4 border-l border-border h-full transition-colors outline-none group",
                showPreview ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
              aria-label="Toggle preview"
            >
              <div className="relative">
                <FileText className="h-4 w-4 transition-transform group-active:scale-90" />
                {showPreview && <div className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-primary" />}
              </div>
            </button>
            </IconTip>
          )}
        </div>
      </div>

      <TabBar
        tabs={openTabs}
        activeTabId={activeTabId}
        setActiveTabId={selectTab}
        handleTabBarDoubleClick={() => createNewTab()}
        createNewTab={createNewTab}
        closeTab={closeTab}
      />

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <>
            <div
              style={{ width: sidebarWidth }}
              className="min-w-40 max-w-96 shrink-0"
            >
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={updateSidebarOpen}
                tabs={tabs}
                folders={folders}
                activeTabId={activeTabId}
                setActiveTabId={selectTab}
                createNewTab={createNewTab}
                createNewFolder={createNewFolder}
                toggleFolder={toggleFolder}
                deleteFolder={deleteFolder}
                deleteFile={deleteFile}
                startRenamingFolder={startRenamingFolder}
                editingFolderId={editingFolderId}
                editingFolderName={editingFolderName}
                setEditingFolderName={updateEditingFolderName}
                finishRenamingFolder={finishRenamingFolder}
                handleRenameFolderKeyDown={handleRenameFolderKeyDown}
                editingTabId={editingTabId}
                editingName={editingName}
                setEditingName={updateEditingName}
                finishRenaming={finishRenaming}
                handleRenameKeyDown={handleRenameKeyDown}
                startRenaming={startRenaming}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
                handleDragOver={handleDragOver}
                handleDragOverTab={handleDragOverTab}
                handleDragLeaveTab={handleDragLeaveTab}
                handleDropOutsideFolder={handleDropOutsideFolder}
                handleDropOnTab={handleDropOnTab}
                handleContextMenu={handleContextMenu}
                handleFolderContextMenu={handleFolderContextMenu}
                handleDragEnterFolder={handleDragEnterFolder}
                handleDragLeaveFolder={handleDragLeaveFolder}
                handleDropOnFolder={handleDropOnFolder}
                handleFolderDragStart={handleFolderDragStart}
                draggedFolder={draggedFolder}
                dragOverFolder={dragOverFolder}
                dragOverTab={dragOverTab}
                onOpenFile={openFileFromDisk}
                onOpenFolder={openFolderFromDisk}
                supportsDirectoryPicker={supportsFileSystemAccess()}
                onDownloadFile={downloadFileById}
                onDownloadFolder={downloadFolderAsZip}
                toggleAllFolders={toggleAllFolders}
                onOpenSearch={() => setPaletteOpen(true)}
                cmdLabel={cmdModLabel()}
              />
            </div>
            <div
              className="relative w-px shrink-0 cursor-col-resize bg-border after:absolute after:inset-y-0 after:-left-1 after:-right-1 after:content-[''] hover:bg-primary/50 active:bg-primary/50 transition-colors"
              onMouseDown={handleSidebarResize}
            />
          </>
        )}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <EditorArea
            activeTab={activeTab}
            tabs={tabs}
            editorRef={editorRef}
            updateTabContent={updateTabContent}
            createNewTab={createNewTab}
            fontSize={fontSize}
            fontFamily={fontFamily}
            wordWrap={wordWrap}
            showPreview={showPreview}
            setShowPreview={updateShowPreview}
            onExternalFileDrop={handleExternalFileDrop}
          />
        </div>
      </div>

      {contextMenu && (
        <div
          className="fixed z-50 min-w-[160px] rounded-md border border-border bg-popover p-1 shadow-md"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.type === "tab" ? (
            <>
              <button
                onClick={() => renameFileFromContext(contextMenu.id)}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
              >
                <Edit2 className="h-4 w-4" /> Rename
              </button>
              <button
                onClick={() => {
                  downloadFileById(contextMenu.id)
                  closeContextMenu()
                }}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
              >
                <Download className="h-4 w-4" /> Download
              </button>
              <div className="my-1 h-px bg-border" />
              <button
                onClick={() => {
                  setTabToDelete(contextMenu.id)
                  setDeleteConfirmOpen(true)
                  closeContextMenu()
                }}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => renameFolderFromContext(contextMenu.id)}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
              >
                <Edit2 className="h-4 w-4" /> Rename
              </button>
              <button
                onClick={() => {
                  downloadFolderAsZip(contextMenu.id)
                  closeContextMenu()
                }}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
              >
                <Download className="h-4 w-4" /> Download (.zip)
              </button>
              <div className="my-1 h-px bg-border" />
              <button
                onClick={() => deleteFolderFromContext(contextMenu.id)}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </>
          )}
        </div>
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This file contains content. Deleting it will permanently remove it from your workspace.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (tabToDelete) performDelete(tabToDelete)
                setTabToDelete(null)
              }}
            >
              Delete File
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {paletteOpen && (
        <CommandPalette
          open={paletteOpen}
          onOpenChange={setPaletteOpen}
          tabs={tabs}
          folders={folders}
          activeTabId={activeTabId}
          getContent={getPaletteContent}
          onSelectFile={selectTab}
          onSelectFolder={revealFolder}
          onSelectMatch={revealMatch}
          onNewFile={createNewTab}
          onNewFolder={createNewFolder}
          onOpenFile={openFileFromDisk}
          onSave={saveFile}
          onDownload={downloadFile}
          onPrint={handlePrint}
          onToggleTheme={toggleTheme}
          onToggleWrap={toggleWordWrap}
          theme={theme}
          wordWrap={wordWrap}
          modLabel={appModLabel()}
          cmdLabel={cmdModLabel()}
        />
      )}

      <StatusBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={updateSidebarOpen}
        activeTab={activeTab}
        getWordCount={getWordCount}
        saveStatus={saveStatus}
        formatError={formatError}
        isFormatting={isFormatting}
        formatCode={formatCode}
        languageMenuOpen={languageMenuOpen}
        setLanguageMenuOpen={setLanguageMenuOpen}
        languageButtonRef={languageButtonRef}
        languages={LANGUAGES}
        changeLanguage={changeLanguage}
        languageMenuRef={languageMenuRef}
        wordWrap={wordWrap}
        toggleWordWrap={toggleWordWrap}
        save={saveFile}
        isFileSystemTab={activeTab?.source === "filesystem"}
        downloadFile={downloadFile}
        handlePrint={handlePrint}
        toggleTheme={toggleTheme}
        theme={theme}
        statusBarColor={statusBarColor}
        setStatusBarColor={(color: string) => {
          setStatusBarColor(color)
          if (color) {
            localStorage.setItem("notepad-statusbar-color", color)
          } else {
            localStorage.removeItem("notepad-statusbar-color")
          }
        }}
        statusBarTextColor={statusBarTextColor}
        setStatusBarTextColor={(color: string) => {
          setStatusBarTextColor(color)
          if (color) {
            localStorage.setItem("notepad-statusbar-text-color", color)
          } else {
            localStorage.removeItem("notepad-statusbar-text-color")
          }
        }}
      />
    </div>
    </TooltipProvider>
  )
}
