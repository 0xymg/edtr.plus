# EDTR+

**The notepad that's already open.**

EDTR+ is a free, browser-based Notepad++ alternative built for speed and privacy. Tabs, syntax highlighting, find & replace, real file access — no download, no license, no account. Open a tab and start typing.

![EDTR Hero](https://edtr.cc/og-image.png)

## ⚡ Features

- **Instant start**: The landing shell paints immediately; the editor bundle streams in right after. Heavy libraries (Markdown preview, diagrams, syntax highlighting) load on demand, never in the first paint.
- **Privacy first**: All data is stored in **LocalStorage**. Your notes never cross the wire — nothing is scanned, uploaded, or used for training.
- **Real file access**: Open and save files on disk via the File System Access API (Chrome, Edge, Opera). Download works everywhere else.
- **Multi-tab workspace**: Unlimited tabs, folders, drag & drop, find & replace with regex (`⌘F`).
- **Big-file ready**: The editor core is CodeMirror 6 with virtualized rendering — only visible lines hit the DOM, so 100,000-line files open, select, and edit instantly.
- **Syntax highlighting**: 20+ languages, loaded on demand per language.
- **Markdown & SVG preview**: Open a `.md` or `.svg` file and a live preview appears alongside the editor — with Mermaid, ABC notation, and Vega-Lite support.
- **PWA native**: Offline-first design. Install it on your machine and use it anywhere.

## ⌨️ Keyboard Shortcuts

Shortcuts are chosen to never collide with system or browser shortcuts. The app modifier is **Alt** on Windows/Linux and **⌃⌥ (Control+Option)** on macOS — a combination the OS leaves alone, so nothing clashes with browser menus or the characters Option types.

| Action | Windows / Linux | macOS |
| --- | --- | --- |
| Open file | `Ctrl+O` | `⌘O` |
| Save file | `Ctrl+S` | `⌘S` |
| Download file | `Ctrl+Shift+S` | `⌘⇧S` |
| New tab | `Alt+N` | `⌃⌥N` |
| Close tab | `Alt+X` | `⌃⌥X` |
| Toggle sidebar | `Alt+B` | `⌃⌥B` |
| Markdown/SVG preview | `Alt+P` | `⌃⌥P` |
| Format (JSON) | `Alt+Shift+F` | `⌃⌥⇧F` |
| Find & replace | `Ctrl+F` | `⌘F` |
| Toggle comment | `Ctrl+/` | `⌘/` |
| Insert indentation | `Tab` | `Tab` |

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Editor core**: [CodeMirror 6](https://codemirror.net/) (virtualized, lazy-loaded)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Persistence**: Browser LocalStorage API

## 🤝 Open Source & Contributions

EDTR+ is **100% open source** and community-driven. We welcome all contributions that respect the project's core values: **Purity, Simplicity, and Raw Performance.**

### How to Contribute:
1. **Fork** the repository.
2. **Clone** it to your local machine.
3. **Install** dependencies: `pnpm install`
4. **Run** in development: `pnpm dev`
5. **Submit** a PR with a clear description of your changes.

> [!IMPORTANT]
> To maintain the performance profile, please avoid adding large external dependencies unless absolutely necessary. If a dependency is only needed after user interaction (preview, export, diagrams), load it lazily with a dynamic import.

## Built by
Created and maintained by [0xymg](https://github.com/0xymg).

## License
MIT License - feel free to use and build upon this utility.

---
*Built with precision for the creative web.*
