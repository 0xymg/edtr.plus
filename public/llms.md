# EDTR

> Free online notepad and code editor. Notepad++ speed in your browser.

| | |
|---|---|
| **Website** | [edtr.cc](https://edtr.cc) |
| **Editor** | [edtr.cc/notepad](https://edtr.cc/notepad) |
| **GitHub** | [github.com/0xymg/edtr.plus](https://github.com/0xymg/edtr.plus) |
| **License** | MIT |
| **Full docs** | [edtr.cc/llms-full.txt](https://edtr.cc/llms-full.txt) |

## What is EDTR?

EDTR is a free, open source, browser-based text editor and notepad inspired by Notepad++. It runs entirely in your browser with no accounts, no downloads, and no cloud storage. All data is saved to your browser's LocalStorage.

## Features

- **Syntax highlighting** for 20+ programming languages
- **Multi-tab editing** with keyboard shortcuts (Alt+N / ⌃⌥N, Alt+X / ⌃⌥X)
- **Automatic saving** to browser LocalStorage
- **File System Access API** — open/save files from disk (Chrome, Edge)
- **PWA** — install as a desktop app, works offline
- **No login required** — no accounts, no sign-up
- **Private** — no server-side storage, no tracking
- **Dark/light theme** with customizable status bar colors
- **Code formatting** for JSON
- **Word/character count** in real-time
- **File export** as .txt or .zip

## Supported Languages

`JavaScript` `TypeScript` `Python` `HTML` `CSS` `JSON` `Markdown` `Bash` `SQL` `Java` `C` `C++` `C#` `Go` `Rust` `PHP` `Ruby` `Swift` `Kotlin` `YAML` `XML`

## Keyboard Shortcuts

The app modifier is `Alt` on Windows/Linux and `⌃⌥` (Control+Option) on macOS, chosen so shortcuts never collide with system/browser shortcuts or the characters Option types.

| Windows / Linux | macOS | Action |
|----------|----------|--------|
| `Ctrl+O` | `⌘O` | Open file from disk |
| `Ctrl+S` | `⌘S` | Save |
| `Ctrl+Shift+S` | `⌘⇧S` | Download |
| `Alt+N` | `⌃⌥N` | New tab |
| `Alt+X` | `⌃⌥X` | Close tab |
| `Alt+B` | `⌃⌥B` | Toggle sidebar |
| `Alt+P` | `⌃⌥P` | Markdown/SVG preview |
| `Ctrl+F` | `⌘F` | Find & replace |
| `Ctrl+/` | `⌘/` | Toggle comment |
| `Alt+Shift+F` | `⌃⌥⇧F` | Format (JSON) |

## Tech Stack

Next.js 16, React 19, TypeScript, Tailwind CSS v4, CodeMirror 6 (virtualized editor core), Shadcn/UI, Radix UI, File System Access API, LocalStorage, Service Worker (PWA)
