# Edit Files on Your Computer From the Browser: How It Actually Works

**Meta Title:** Edit Local Files in the Browser — File System Access API Explained | EDTR
**Meta Description:** A simple explanation of how modern browsers let web apps open and save files directly on your computer. Includes practical use cases and limitations.
**Keywords:** file system access api, edit local files browser, browser save file, web app file system, open files from browser, edtr file editing
**Slug:** edit-files-from-the-browser

---

For most of the web's history, browsers could not touch your files. You could **upload** a file (a one-way trip into a server). You could **download** a file (a one-way trip out). But editing a file on your computer directly from a website? Impossible.

That changed. Modern browsers can now open, edit, and save files on your disk — securely, with your permission, and without uploading anything. EDTR uses this to feel like a real desktop editor while still living entirely in a browser tab.

## The Old Way: Upload, Edit, Re-Download

Before this technology existed, the workflow looked like this:

1. Click "Choose file"
2. Pick a file from your disk
3. Wait for it to upload (or read into memory)
4. Edit it
5. Click "Download"
6. Find the downloaded copy
7. Move it back to the original location
8. Delete the duplicate

Eight steps to save a change. And you ended up with `notes (3).txt` next to `notes (2).txt` and `notes.txt`.

This is fine for one-time uploads. Terrible for actual editing.

## The New Way: Direct File Access

The browser now exposes an API called the **File System Access API**. It lets a web page ask: "Can I open this file on your disk?" If you say yes, the page can read it, edit it, and write changes back — to that exact same file, in that exact same place.

The workflow becomes:

1. Open the file in the browser
2. Edit it
3. Press `⌘S`

Three steps. No duplicates. No uploads. The file on your disk is the file you are editing.

## Is This Safe?

This is the first question everyone asks. The short answer: yes, because the browser controls access tightly.

A web page **cannot**:

- Read files you have not opened
- Scan your folders without permission
- Access files after you close the tab without re-asking
- Touch system folders or other apps' data

When you open a file, the browser shows a native file picker — the same one the operating system uses. You explicitly choose what to share. When you save, the browser confirms permission. The web page only ever sees what you give it.

It is closer to "drag a file into an app window" than "let a website crawl your disk."

## What You Can Do With It

Once the browser can read and write files, a lot of useful things open up:

- **Edit real files in real folders** instead of uploading copies
- **Open an entire folder** as a workspace, like a code editor would
- **Save changes back to disk** with a normal keyboard shortcut
- **Watch a file** and re-open it later from a recent list

In EDTR specifically:

- Click "Open File" to pick a file from your disk
- Click "Open Folder" to browse a whole directory in the sidebar
- Edit anything in the editor
- Press `⌘S` to save back to the original location

The browser tab behaves like a tiny VS Code — but you did not install anything.

## Which Browsers Support It

This is the current reality:

- **Chrome** — full support
- **Edge** — full support
- **Opera** — full support
- **Brave** — full support (Chromium-based)
- **Firefox** — not yet supported
- **Safari** — not yet supported

If you use Firefox or Safari, EDTR still works fully for in-browser editing with LocalStorage. You just cannot save directly to your disk. You can always export a file when you need to.

## A Practical Example

Imagine you keep a folder of notes on your laptop:

```
~/notes/
├── ideas.md
├── books.md
├── meeting-2026-05-13.md
└── todo.md
```

With EDTR you can:

1. Open `~/notes/` as a folder in EDTR
2. See all four files in the sidebar
3. Click any one to start editing
4. Press `⌘S` to save changes back to that file
5. Create a new file directly in that folder
6. Open the same folder tomorrow in your real editor (Vim, VS Code, whatever) — your changes are there

There is no copy. No sync. No cloud. It is just your files, edited from a browser tab.

## What This Replaces

This kind of editor is genuinely useful for:

- **Quick edits** to config files (`.env`, `.gitignore`, JSON)
- **READMEs and docs** in a project folder
- **Drafting** posts and notes inside an existing folder
- **Reviewing** a file without firing up an IDE
- **Working from a shared computer** where you cannot install software

It does not replace a full IDE for big projects. It complements it.

## A Note on Permissions

The browser does not remember access between visits by default. If you open `notes.md` today and come back tomorrow, you may need to re-pick the file. This is intentional — the browser leans toward "ask again" instead of "trust forever."

EDTR keeps a list of recently opened files so you can re-open them with one click instead of digging through folders.

## Try It

Open [edtr.plus](https://edtr.plus) in Chrome or Edge. Use the sidebar to open a folder. Edit a file. Save it. Open that file in any other editor — your changes are there.

The browser is finally a real place to edit real files.

---

*Your files. Your folders. Edited from a tab.*
