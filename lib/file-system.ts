// File System Access API utilities for EDTR.CC PWA

// ── Type Declarations ──────────────────────────────────────────────

interface LaunchParams {
  files: FileSystemFileHandle[]
  targetURL?: string
}

interface LaunchQueue {
  setConsumer(consumer: (params: LaunchParams) => void): void
}

interface FilePickerAcceptType {
  description?: string
  accept: Record<string, string[]>
}

declare global {
  interface Window {
    launchQueue?: LaunchQueue
    showOpenFilePicker(options?: {
      types?: FilePickerAcceptType[]
      excludeAcceptAllOption?: boolean
      multiple?: boolean
    }): Promise<FileSystemFileHandle[]>
    showDirectoryPicker(options?: {
      id?: string
      mode?: "read" | "readwrite"
      startIn?: FileSystemHandle | "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos"
    }): Promise<FileSystemDirectoryHandle>
  }
}

export interface DirectoryEntry {
  name: string
  relativePath: string
  kind: "file" | "directory"
  handle: FileSystemFileHandle | FileSystemDirectoryHandle
}

// ── Extension ↔ Language Mapping ───────────────────────────────────

const EXT_TO_LANGUAGE: Record<string, string> = {
  txt: "plaintext",
  js: "javascript",
  jsx: "jsx",
  mjs: "javascript",
  ts: "typescript",
  tsx: "tsx",
  py: "python",
  css: "css",
  html: "html",
  htm: "html",
  xml: "xml",
  json: "json",
  md: "markdown",
  sh: "bash",
  sql: "sql",
  java: "java",
  c: "c",
  cpp: "cpp",
  h: "c",
  hpp: "cpp",
  cs: "csharp",
  go: "go",
  rs: "rust",
  php: "php",
  rb: "ruby",
  swift: "swift",
  kt: "kotlin",
  yaml: "yaml",
  yml: "yaml",
  toml: "plaintext",
  ini: "plaintext",
  cfg: "plaintext",
  env: "plaintext",
  gitignore: "plaintext",
  dockerfile: "bash",
  makefile: "bash",
  svg: "svg",
}

const TEXT_EXTENSIONS = new Set(Object.keys(EXT_TO_LANGUAGE))

// Additional extensions that are text but not in language map
const EXTRA_TEXT_EXTENSIONS = new Set([
  "log", "csv", "tsv", "svg", "lock", "conf", "config",
  "editorconfig", "prettierrc", "eslintrc", "babelrc",
])

export function detectLanguageFromExtension(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || ""
  return EXT_TO_LANGUAGE[ext] || "plaintext"
}

export function isTextFile(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase() || ""
  const baseName = filename.toLowerCase()
  // Files without extensions or known text extensions
  return TEXT_EXTENSIONS.has(ext) ||
    EXTRA_TEXT_EXTENSIONS.has(ext) ||
    baseName === "makefile" ||
    baseName === "dockerfile" ||
    baseName === ".gitignore" ||
    baseName === ".env" ||
    !ext // no extension = likely text
}

// ── Feature Detection ──────────────────────────────────────────────

export function supportsFileSystemAccess(): boolean {
  return typeof window !== "undefined" &&
    "showOpenFilePicker" in window &&
    "showDirectoryPicker" in window
}

// ── File Picker ────────────────────────────────────────────────────

const TEXT_FILE_TYPES: FilePickerAcceptType[] = [
  {
    description: "Text files",
    accept: {
      "text/*": [
        ".txt", ".js", ".jsx", ".mjs", ".ts", ".tsx",
        ".py", ".css", ".html", ".htm", ".xml", ".json",
        ".md", ".sh", ".sql", ".java", ".c", ".cpp", ".h", ".hpp",
        ".cs", ".go", ".rs", ".php", ".rb", ".swift", ".kt",
        ".yaml", ".yml", ".toml", ".ini", ".cfg", ".env",
        ".log", ".csv", ".svg", ".conf", ".config",
      ],
    },
  },
]

export async function openFilePicker(): Promise<{ handle: FileSystemFileHandle; file: File }[]> {
  if (supportsFileSystemAccess()) {
    try {
      const handles = await window.showOpenFilePicker({
        types: TEXT_FILE_TYPES,
        excludeAcceptAllOption: false,
        multiple: true,
      })
      const results: { handle: FileSystemFileHandle; file: File }[] = []
      for (const handle of handles) {
        const file = await handle.getFile()
        results.push({ handle, file })
      }
      return results
    } catch (e) {
      if ((e as DOMException).name === "AbortError") return []
      throw e
    }
  }
  // Fallback: <input type="file">
  return openFileFallback()
}

function openFileFallback(): Promise<{ handle: FileSystemFileHandle; file: File }[]> {
  return new Promise((resolve) => {
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true
    input.accept = TEXT_FILE_TYPES[0].accept["text/*"].join(",")
    input.onchange = () => {
      const files = Array.from(input.files || [])
      // No handle available in fallback mode
      resolve(files.map(file => ({ handle: null as unknown as FileSystemFileHandle, file })))
    }
    // Handle cancel
    input.addEventListener("cancel", () => resolve([]))
    input.click()
  })
}

// ── Directory Picker ───────────────────────────────────────────────

export async function openDirectoryPicker(): Promise<{
  dirHandle: FileSystemDirectoryHandle
  entries: DirectoryEntry[]
} | null> {
  if (!supportsFileSystemAccess()) return null
  try {
    const dirHandle = await window.showDirectoryPicker({
      id: "edtr-workspace",
      mode: "readwrite",
    })
    const entries = await readDirectoryRecursive(dirHandle)
    return { dirHandle, entries }
  } catch (e) {
    if ((e as DOMException).name === "AbortError") return null
    throw e
  }
}

export async function readDirectoryRecursive(
  dirHandle: FileSystemDirectoryHandle,
  basePath = ""
): Promise<DirectoryEntry[]> {
  const entries: DirectoryEntry[] = []

  for await (const [name, handle] of (dirHandle as any).entries()) {
    // Skip hidden files/dirs and node_modules
    if (name.startsWith(".") || name === "node_modules" || name === "__pycache__") continue

    const relativePath = basePath ? `${basePath}/${name}` : name

    if (handle.kind === "file") {
      // Only include text-like files
      if (isTextFile(name)) {
        entries.push({ name, relativePath, kind: "file", handle })
      }
    } else if (handle.kind === "directory") {
      entries.push({ name, relativePath, kind: "directory", handle })
      // Recurse into subdirectory
      const children = await readDirectoryRecursive(handle as FileSystemDirectoryHandle, relativePath)
      entries.push(...children)
    }
  }

  // Sort: directories first, then files, alphabetically
  return entries.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "directory" ? -1 : 1
    return a.name.localeCompare(b.name)
  })
}

// ── File Read/Write ────────────────────────────────────────────────

export async function readFileFromHandle(handle: FileSystemFileHandle): Promise<string> {
  const file = await handle.getFile()
  return file.text()
}

export async function writeFileToHandle(handle: FileSystemFileHandle, content: string): Promise<void> {
  const writable = await handle.createWritable()
  await writable.write(content)
  await writable.close()
}
