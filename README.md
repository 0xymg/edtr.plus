<div align="center">

# EDTR+

**The notepad that's already open.**

A fast, open-source Notepad++ alternative that runs in your browser.
Tabs, syntax highlighting, find & replace, real file access, and more.
No download. No account. No ads.

**[Open the editor →](https://edtr.plus)**

Free forever · Open source · Runs locally in your browser

</div>

![EDTR+](https://edtr.plus/opengraph-image)

---

## A proper text editor, without the installation

Sometimes you just need to open a file, change a few lines, or write something down.

EDTR+ gives you the familiar tools of a desktop text editor directly in your browser, without turning a simple task into another app, account, or subscription.

|  |  |
| --- | --- |
| **Instant** | Open EDTR+ and start typing. No launch screen, setup, or sign-in. |
| **Local** | Your text stays in your browser. Files you open are processed on your device, not uploaded to a server. |
| **Capable** | More than a basic online notepad: tabs, syntax highlighting, find & replace, large file support, previews, and direct file access are built in. |

## Features

- **Multiple tabs** — keep several notes and files open at once, with folders, drag & drop, and per-file download.
- **Syntax highlighting** — 20+ programming and markup languages, each grammar loaded on demand.
- **Find & replace** — `⌘F` opens it right in the editor, with regex and match-case.
- **Command palette** — `⌘K` searches file names, folder names, and the text inside *every* open document at once, then jumps straight to the matching line. It also runs the editor's commands and switches the file's language: type `json`, hit Enter, and the open file is JSON.
- **Large files** — the editor renders only the lines on screen, so a 100,000-line log opens, selects, and edits like a short note.
- **JSON viewer & formatter** — a collapsible JSON tree with expand/collapse all, plus format, minify, and parse errors that point at the exact line.
- **Markdown & SVG preview** — live preview beside your source, including Mermaid diagrams, ABC notation, and Vega-Lite charts.
- **Open real files** — read and write files on your machine through the File System Access API (Chrome, Edge, Opera); download works everywhere else.
- **Autosave** — every keystroke goes to browser storage. Close the tab; it's still there.
- **Yours to look at** — light and dark themes, custom editor fonts, and a status bar you can recolor.
- **PWA** — install it and it works offline.

## Your text stays yours

EDTR+ is designed to work locally in your browser. There is no account to identify you and no copy of your documents on a server. Your notes stay in this browser's local storage, and files you open from disk are read directly by the browser.

**No account. No cloud workspace. No tracking your documents.**

## Notepad++ without Windows

Notepad++ is great, but it is built for Windows. EDTR+ brings the parts people use every day to any modern browser: tabs, syntax highlighting, find & replace, file editing, keyboard shortcuts, and a fast place to work with text.

Use it on macOS, Linux, Windows, ChromeOS, or anywhere else you have a browser. No virtual machine. No Wine. No installation.

## Keyboard shortcuts

Shortcuts are chosen so they don't collide with your system or browser. The app modifier is **Alt** on Windows/Linux and **⌃⌥ (Control+Option)** on macOS — a combination the OS leaves alone, so nothing clashes with browser menus or with the characters the Option key types.

The one deliberate exception is `⌘F` / `Ctrl+F`: while the editor is focused it opens find & replace, because that habit is too strong to break. Everywhere else on the page, your browser's find-in-page still works.

| Action | Windows / Linux | macOS |
| --- | --- | --- |
| Command palette | `Ctrl+K` | `⌘K` |
| Find & replace | `Ctrl+F` | `⌘F` |
| Open file from disk | `Ctrl+O` | `⌘O` |
| Save | `Ctrl+S` | `⌘S` |
| Download file | `Ctrl+Shift+S` | `⌘⇧S` |
| New tab | `Alt+N` | `⌃⌥N` |
| Close tab | `Alt+X` | `⌃⌥X` |
| Toggle sidebar | `Alt+B` | `⌃⌥B` |
| Toggle preview / JSON viewer | `Alt+P` | `⌃⌥P` |
| Format document | `Alt+Shift+F` | `⌃⌥⇧F` |
| Toggle comment | `Ctrl+/` | `⌘/` |
| Insert indentation | `Tab` | `Tab` |

## Open it when you need to…

Edit a JSON file · inspect a log · fix a config · write Markdown · clean up some text · check a code snippet · take a quick note · open a file without launching a full IDE.

EDTR+ is there when a full editor would be too much and a basic textarea would be too little.

## Tech stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Editor core**: [CodeMirror 6](https://codemirror.net/) — virtualized rendering, lazy-loaded
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide](https://lucide.dev/)
- **Persistence**: LocalStorage + File System Access API

Everything heavy (the editor, Markdown preview, diagram renderers, the JSON viewer, the command palette) is behind a dynamic import, so the first paint stays small and the rest streams in as it is needed.

## Running it locally

```bash
pnpm install
pnpm dev
```

The app runs at `http://localhost:3000`. `pnpm build` produces the production build.

## Contributing

EDTR+ is **100% open source** and community-driven. Contributions are welcome as long as they respect the project's core values: **purity, simplicity, and raw performance.**

1. **Fork** the repository
2. **Clone** it to your machine
3. **Install** dependencies: `pnpm install`
4. **Run** in development: `pnpm dev`
5. **Submit** a PR with a clear description of your changes

> [!IMPORTANT]
> To protect the performance profile, avoid adding large dependencies unless there is no alternative. If something is only needed after a user interaction (preview, export, diagrams), load it lazily with a dynamic import — and never feed a whole document through React state on every keystroke.

## Built by

Created and maintained by [0xymg](https://github.com/0xymg).

Part of **Project EDTR**: [EDTR.md](https://edtr.md) (Markdown editor) · [EDTRpad](https://wordpad.info) (Word alternative)

## License

MIT — free to use and build upon.

---

*Not affiliated with Notepad++. Independent open source project.*
