"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { toast } from "sonner"
import {
  Braces,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  Code,
  CodeXml,
  Command,
  Copy,
  Eye,
  FileText,
  FolderOpen,
  Gauge,
  Github,
  Keyboard,
  Link2,
  Lock,
  Minimize2,
  PanelsTopLeft,
  Replace,
  Search,
  TriangleAlert,
  WandSparkles,
  X,
  Zap,
} from "lucide-react"
import { isMacPlatform } from "@/lib/shortcuts"
import { Logo312 } from "@/components/logo-312"
import styles from "./landing.module.css"

// Ship the landing shell instantly; the editor bundle streams in right after.
// The skeleton mirrors the editor chrome so nothing visibly jumps.
const Notepad = dynamic(() => import("@/components/notepad").then(m => m.Notepad), {
  ssr: false,
  loading: () => (
    <div className="flex h-full flex-col bg-background">
      <div className="flex h-10 shrink-0 items-center border-b border-border bg-card/50">
        <div className="flex h-full items-center gap-2 border-r border-border px-4">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 select-none text-[13px] font-semibold text-muted-foreground">
          EDTR<span className="ml-[0.08em] text-[1.1em] text-[#F5A524]">+</span>
        </div>
      </div>
      <div className="h-9 shrink-0 border-b border-border bg-card/30" />
      <div className="flex-1" />
      <div className="h-7 shrink-0 border-t border-border bg-card/50" />
    </div>
  ),
})

const FAQS = [
  {
    q: "Is EDTR+ free?",
    a: "Yes. Completely free. There is no paid version, subscription, or premium tier.",
  },
  {
    q: "Does EDTR+ show ads?",
    a: "No.",
  },
  {
    q: "Do I need an account?",
    a: "No. Just open the editor and start using it.",
  },
  {
    q: "Is EDTR+ open source?",
    a: "Yes. The source code is publicly available on GitHub under an MIT license.",
  },
  {
    q: "Does EDTR+ upload my files?",
    a: "No. EDTR+ is designed to process your text and files locally in your browser. Your notes stay in your browser's local storage on this device.",
  },
  {
    q: "Can EDTR+ replace Notepad++?",
    a: "For many everyday text-editing tasks, yes. EDTR+ supports tabs, syntax highlighting, find & replace, file access, keyboard shortcuts, and other features commonly used in lightweight desktop editors. Notepad++ remains a much larger Windows application with a broader plugin ecosystem and more advanced desktop functionality.",
  },
  {
    q: "Does it work on macOS?",
    a: "Yes. EDTR+ runs in modern browsers on macOS, Windows, Linux, ChromeOS, and other platforms.",
  },
  {
    q: "Can I edit files directly from my computer?",
    a: "On supported browsers, yes. You can open a local file, edit it, and save your changes back to disk. Chrome, Edge and Opera support this through the File System Access API.",
  },
  {
    q: "Can it handle really large files?",
    a: "Yes. The editor renders only the lines visible on screen, so opening, selecting and editing a 100,000-line file feels the same as a short note.",
  },
  {
    q: "What is the command palette?",
    a: "Press Ctrl+K (⌘K on a Mac) and one search box looks through your file names, folder names and the text inside every open document, then jumps to the matching line. The same box runs editor commands and switches a file's language.",
  },
]

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://edtr.plus"
const GITHUB_URL = "https://github.com/0xymg/edtr.plus"
const CREDIT_URL = "https://312.sh"

// Structured data: WebApplication for the product, FAQPage mirroring the
// visible FAQ section. Rendered as a static JSON-LD script in the SSG HTML.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "EDTR+",
      url: SITE_URL,
      description:
        "A fast, open-source Notepad++ alternative that runs in your browser. Tabs, syntax highlighting, find & replace, real file access. No download, no account, no ads.",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires a modern web browser",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      license: "https://opensource.org/licenses/MIT",
      isAccessibleForFree: true,
      creator: { "@type": "Organization", name: "312", url: CREDIT_URL },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
}

const ink = "text-[var(--pl-ink)]"
const ink70 = "text-[var(--pl-ink-70)]"
const ink50 = "text-[var(--pl-ink-50)]"
const border = "border-[var(--pl-border)]"
const hoverInk = "transition-colors hover:text-[var(--pl-ink)]"
const h2 = `${styles.display} text-[clamp(2rem,5vw,3rem)]`
// The "+" in the wordmark is the one spot of colour in the whole palette,
// set slightly larger than the letters with a hair of space before it
const plus = "ml-[0.08em] text-[1.1em] text-[var(--pl-accent)]"

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className={styles.kbd}>{children}</kbd>
}

/** The product name always renders as the wordmark: amber, slightly larger "+". */
function Wordmark() {
  return (
    <span className={`whitespace-nowrap ${styles.display}`}>
      EDTR<span className={plus}>+</span>
    </span>
  )
}

/**
 * Renders copy that is stored as a plain string (FAQ entries also feed the
 * JSON-LD schema, which must stay plain text) with the wordmark styled.
 */
function withWordmark(text: string) {
  const parts = text.split("EDTR+")
  // One inline element, not a list of siblings: callers put this inside flex
  // rows (the FAQ summary is `justify-between`), where loose parts would be
  // spread across the row instead of reading as a sentence.
  return (
    <span>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Wordmark />}
          {part}
        </React.Fragment>
      ))}
    </span>
  )
}

/** "item · item · item" lines, so the separator never lives inside the copy. */
function DotSeparated({ items }: { items: string[] }) {
  return (
    <span className="inline-flex max-w-full flex-wrap items-baseline justify-center gap-y-2">
      {items.map((item, i) => (
        <React.Fragment key={item}>
          {i > 0 && <span aria-hidden className={`mx-2 ${ink50}`}>·</span>}
          <span>{item}</span>
        </React.Fragment>
      ))}
    </span>
  )
}

function IconTile({ icon: Icon, size = "md" }: { icon: React.ElementType; size?: "sm" | "md" | "lg" }) {
  const box = size === "sm" ? "size-10" : size === "lg" ? "size-14" : "size-12"
  return (
    <div className={`${styles.iconTile} ${box} shrink-0`}>
      <Icon className={size === "sm" ? "h-5 w-5" : "h-6 w-6"} strokeWidth={1.6} aria-hidden="true" />
    </div>
  )
}

function scrollToEditor() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

/**
 * Scroll back up to the editor, then ask it for the command palette. The
 * palette is a modal that locks page scroll, so it opens only once the
 * smooth scroll has actually arrived (or after a short ceiling).
 */
function openPalette() {
  const open = () => window.dispatchEvent(new Event("edtr-plus:open-palette"))
  if (window.scrollY < 2) {
    open()
    return
  }
  window.scrollTo({ top: 0, behavior: "smooth" })
  const started = performance.now()
  const wait = () => {
    if (window.scrollY < 2 || performance.now() - started > 2000) open()
    else requestAnimationFrame(wait)
  }
  requestAnimationFrame(wait)
}

export default function LandingPage() {
  // App command modifier shown in shortcut hints: Alt on Windows/Linux,
  // ⌃⌥ (Control+Option) on macOS. Set after mount so the prerendered HTML
  // (which uses the Windows/Linux labels) hydrates cleanly.
  const [isMacUi, setIsMacUi] = useState(false)
  useEffect(() => {
    if (isMacPlatform()) setIsMacUi(true)
  }, [])
  const mod = isMacUi ? "⌃⌥" : "Alt"
  const cmd = isMacUi ? "⌘" : "Ctrl"
  // macOS writes chords glued together (⌘⇧S); everyone else joins with "+".
  const keys = (...parts: string[]) => parts.join(isMacUi ? "" : "+")
  const shift = isMacUi ? "⇧" : "Shift"

  useEffect(() => {
    const timer = window.setTimeout(() => {
      toast.custom(
        (id) => (
          <div className="relative grid min-w-0 grid-cols-[auto_1fr] gap-x-3 gap-y-2 rounded-[inherit] bg-card p-4 pr-10 text-card-foreground">
            <button
              type="button"
              onClick={() => toast.dismiss(id)}
              className="absolute right-3 top-3 rounded-sm p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src="/icon.svg"
              alt="EDTR.md"
              className="mt-0.5 h-9 w-9 shrink-0 object-contain"
            />
            <div className="min-w-0">
              <p className="text-sm font-bold tracking-[0.02em] text-card-foreground">TRY EDTR.MD</p>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                A fast <strong>Markdown</strong> editor with live preview, diagrams, math, and export tools.
              </p>
            </div>
            <a
              href="https://edtr.md"
              target="_blank"
              rel="noopener noreferrer"
              className="col-start-2 text-sm font-medium text-primary underline underline-offset-4"
            >
              Open edtr.md
            </a>
          </div>
        ),
        { id: "edtr-markdown-prompt", duration: 6000 }
      )
    }, 450)
    return () => window.clearTimeout(timer)
  }, [])

  const paletteCommands: Array<{
    group?: string
    icon: React.ElementType
    label: string
    hint?: string
  }> = [
    { group: "Languages", icon: CodeXml, label: "Set language to JSON", hint: "↵" },
    { group: "In open files", icon: FileText, label: "api-response.json", hint: "line 14" },
    { group: "Actions", icon: WandSparkles, label: "Format JSON", hint: keys(mod, shift, "F") },
    { icon: Minimize2, label: "Minify JSON" },
    { icon: Link2, label: "Copy link to this note" },
    { icon: FolderOpen, label: "Open file from disk", hint: keys(cmd, "O") },
  ]

  const shortcuts: Array<[string, string]> = [
    ["Command palette", keys(cmd, "K")],
    ["Find & replace", keys(cmd, "F")],
    ["Open file from disk", keys(cmd, "O")],
    ["Save", keys(cmd, "S")],
    ["Download file", keys(cmd, shift, "S")],
    ["New tab", keys(mod, "N")],
    ["Close tab", keys(mod, "X")],
    ["Toggle sidebar", keys(mod, "B")],
    ["Toggle preview / JSON viewer", keys(mod, "P")],
    ["Format document", keys(mod, shift, "F")],
    ["Toggle comment", keys(cmd, "/")],
    ["Insert indentation", "Tab"],
  ]

  const features: Array<{ icon: React.ElementType; title: string; body: React.ReactNode }> = [
    {
      icon: PanelsTopLeft,
      title: "Multiple tabs",
      body: (
        <>
          Keep several notes and files open at once, with folders, drag &amp; drop and per-file
          download. <Kbd>{keys(mod, "N")}</Kbd> opens a tab, <Kbd>{keys(mod, "X")}</Kbd> closes one.
        </>
      ),
    },
    {
      icon: Code,
      title: "Syntax highlighting",
      body: "Readable highlighting for 20+ programming and markup languages, each grammar loaded on demand as you pick one.",
    },
    {
      icon: Replace,
      title: "Find & replace",
      body: (
        <>
          Search, replace, match case, or use regular expressions. <Kbd>{keys(cmd, "F")}</Kbd> opens
          it right in the editor.
        </>
      ),
    },
    {
      icon: FolderOpen,
      title: "Open real files",
      body: (
        <>
          Open files from your computer and save changes back to disk in Chrome, Edge and Opera.{" "}
          <Kbd>{keys(cmd, "O")}</Kbd> to open, <Kbd>{keys(cmd, "S")}</Kbd> to save. Download works
          everywhere else.
        </>
      ),
    },
    {
      icon: Gauge,
      title: "Large files",
      body: "Only the lines on screen are rendered, so a 100,000-line log opens, selects and edits like a short note. Your browser never turns into a slideshow.",
    },
    {
      icon: Eye,
      title: "Markdown & SVG preview",
      body: (
        <>
          Open a <code className="font-mono text-[13px]">.md</code> or{" "}
          <code className="font-mono text-[13px]">.svg</code> file and a live preview appears beside
          the source, with Mermaid diagrams, ABC notation and Vega-Lite charts.
        </>
      ),
    },
  ]

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      {/* Editor */}
      <section className="h-screen w-full shrink-0 overflow-hidden bg-background">
        <Notepad />
      </section>

      <div className={styles.landing}>
        {/* ── Announcement ── */}
        <div className={`${styles.soft} border-y ${border} text-[13px]`}>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-5 py-2.5 text-center">
            <span className="inline-flex min-w-0 items-center gap-2">
              <span className={`border border-[var(--pl-border-strong)] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${ink70}`}>
                New
              </span>
              <span className={ink70}>
                A JSON viewer and formatter: set any file to JSON and read it as a tree.
              </span>
            </span>
            <a href="#json" className={`whitespace-nowrap ${styles.textLink}`}>
              See it →
            </a>
          </div>
        </div>

        {/* ── Nav ── */}
        <header className={`sticky top-0 z-50 border-b ${border} bg-[var(--pl-bg)]/85 backdrop-blur-xl`}>
          {/* The links are absolutely centred: with justify-between they would sit
              wherever the logo and the button leave room, which is not the middle. */}
          <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link href="/" className="text-xl leading-none" aria-label="EDTR+ home">
              <Wordmark />
            </Link>
            <nav className={`absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 text-[13px] ${ink70} lg:flex`}>
              <a href="#command-palette" className={hoverInk}>Command palette</a>
              <a href="#features" className={hoverInk}>Features</a>
              <a href="#comparison" className={hoverInk}>Comparison</a>
              <a href="#shortcuts" className={hoverInk}>Shortcuts</a>
              <a href="#faq" className={hoverInk}>FAQ</a>
              <Link href="/blog" className={hoverInk}>Blog</Link>
            </nav>
            <button
              type="button"
              onClick={scrollToEditor}
              className="bg-[var(--pl-ink)] px-4 py-2 text-[13px] font-semibold text-[var(--pl-bg)] transition-opacity hover:opacity-90"
            >
              Open editor ↑
            </button>
          </div>
        </header>

        <main>
          {/* ── Hero ── */}
          <section className={`${styles.hero} px-6 pb-16 pt-16 sm:pb-20 sm:pt-24`}>
            <div className="mx-auto max-w-4xl text-center">
              <h1 className={`${styles.display} text-[clamp(2.75rem,7vw,4.5rem)] leading-[1.02]! tracking-[-0.04em]!`}>
                The notepad that&apos;s already open.
              </h1>
              <p className={`mx-auto mt-7 max-w-2xl text-base leading-relaxed sm:text-lg ${ink70}`}>
                A fast, open-source Notepad++ alternative that runs in your browser. Tabs, syntax
                highlighting, find &amp; replace, real file access, and a command palette for
                everything else. No download. No account. No ads.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={scrollToEditor}
                  className={`${styles.primaryAction} w-full sm:w-auto`}
                >
                  Start typing ↑
                </button>
                <button
                  type="button"
                  onClick={openPalette}
                  className={`${styles.secondaryAction} w-full sm:w-auto`}
                >
                  Try the command palette <Kbd>{keys(cmd, "K")}</Kbd>
                </button>
              </div>
              <p className={`mt-6 text-[13px] ${ink50}`}>
                Free forever · Open source · Runs locally in your browser
              </p>
            </div>
          </section>

          {/* ── Trust bar ── */}
          <section className={`${styles.trust} border-b ${border}`}>
            <ul className={`${styles.trustItems} mx-auto max-w-6xl`}>
              {[
                "Free, with no ads",
                "Nothing to install or sign up for",
                "Autosaves on every keystroke",
                "Opens and saves real files",
              ].map((item) => (
                <li key={item}>
                  <Check className="h-[18px] w-[18px]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ── Command palette ── */}
          <section id="command-palette" className="px-6 py-24">
            <div className={`${styles.split} mx-auto max-w-6xl`}>
              <div>
                <IconTile icon={Command} />
                <h2 className={`${h2} mt-6`}>
                  Everything is one <Kbd>{keys(cmd, "K")}</Kbd> away.
                </h2>
                <div className={`mt-8 space-y-5 text-[17px] leading-relaxed ${ink70}`}>
                  <p>
                    <Kbd>{keys(cmd, "K")}</Kbd> opens one search box that looks through your file
                    names, your folder names, and the text inside every open document at once. Pick
                    a result and you land on the matching line.
                  </p>
                  <p>
                    The same box runs the editor&apos;s commands: format, minify, open, save, copy a
                    link to the note. And it switches the file&apos;s language: type{" "}
                    <em>json</em>, press Enter, and the file is JSON, highlighting and tree view
                    included.
                  </p>
                  <p>
                    If you&apos;ve used VS Code, GitHub or Linear, your hands already know this one.
                  </p>
                </div>
              </div>

              {/* Every row opens the real palette in the editor above. */}
              <div className={styles.panel}>
                <div className={styles.panelHeading}>
                  <span>Command palette</span>
                  <Kbd>{keys(cmd, "K")}</Kbd>
                </div>
                <div className={styles.paletteInput}>
                  <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className={ink}>
                    json<span className={styles.caret} aria-hidden="true" />
                  </span>
                </div>
                <div className={styles.commandList}>
                  {paletteCommands.map((c) => (
                    <React.Fragment key={c.label}>
                      {c.group && <div className={styles.commandGroup}>{c.group}</div>}
                      <button type="button" onClick={openPalette} className={styles.commandItem}>
                        <c.icon className="h-4 w-4" aria-hidden="true" />
                        <span className="truncate">{c.label}</span>
                        {c.hint && <span className={styles.commandHint}>{c.hint}</span>}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
                <div className={styles.panelFooter}>
                  <button type="button" onClick={openPalette} className={styles.textLink}>
                    Try it: open the palette in the editor ↑
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ── JSON viewer ── */}
          <section id="json" className={`${styles.soft} border-t ${border} px-6 py-24`}>
            <div className={`${styles.split} mx-auto max-w-6xl`}>
              <div>
                <IconTile icon={Braces} />
                <h2 className={`${h2} mt-6`}>Paste JSON. Read a tree.</h2>
                <div className={`mt-8 space-y-5 text-[17px] leading-relaxed ${ink70}`}>
                  <p>
                    Set a file to JSON and a collapsible tree opens next to it, so you can read an
                    API response without counting brackets. Expand or collapse everything at once,
                    or walk it one level at a time.
                  </p>
                  <p>
                    Format it, minify it, copy it back out. And when it won&apos;t parse, the error
                    points at the exact line and column, one click from the spot that broke it.
                  </p>
                  <p>
                    <Kbd>{keys(mod, "P")}</Kbd> toggles the tree, the same key that toggles the
                    Markdown and SVG preview.
                  </p>
                </div>
              </div>

              <div className={styles.panel} aria-hidden="true">
                <div className={styles.panelHeading}>
                  <Braces className="h-4 w-4" />
                  <span>api-response.json</span>
                  <span className={`flex items-center gap-2.5 ${ink50}`}>
                    <ChevronsUpDown className="h-4 w-4" />
                    <ChevronsDownUp className="h-4 w-4" />
                    <Copy className="h-4 w-4" />
                  </span>
                </div>
                <div className={styles.tree}>
                  <div className={styles.treeRow}>
                    <ChevronDown className="h-3.5 w-3.5" />
                    <span className={styles.treeMeta}>{"{ }"} 4 keys</span>
                  </div>
                  <div className="pl-6">
                    <div className={styles.treeRow}>
                      <span className={styles.treeKey}>id:</span>
                      <span className={styles.treeNumber}>1042</span>
                    </div>
                    <div className={styles.treeRow}>
                      <span className={styles.treeKey}>status:</span>
                      <span className={styles.treeString}>&quot;active&quot;</span>
                    </div>
                    <div className={styles.treeRow}>
                      <span className={styles.treeKey}>public:</span>
                      <span className={styles.treeBool}>false</span>
                    </div>
                    <div className={styles.treeRow}>
                      <ChevronDown className="-ml-5 h-3.5 w-3.5" />
                      <span className={styles.treeKey}>tags:</span>
                      <span className={styles.treeMeta}>[ ] 3 items</span>
                    </div>
                    <div className="pl-6">
                      {["notes", "json", "local"].map((tag, i) => (
                        <div key={tag} className={styles.treeRow}>
                          <span className={styles.treeMeta}>{i}:</span>
                          <span className={styles.treeString}>&quot;{tag}&quot;</span>
                        </div>
                      ))}
                    </div>
                    <div className={styles.treeRow}>
                      <ChevronRight className="-ml-5 h-3.5 w-3.5" />
                      <span className={styles.treeKey}>owner:</span>
                      <span className={styles.treeMeta}>{"{ }"} 2 keys</span>
                    </div>
                  </div>
                </div>
                <div className={styles.parseError}>
                  <TriangleAlert className="h-4 w-4" />
                  <span>Unexpected token in config.json</span>
                  <span className={`${styles.textLink} ${ink}`}>Go to line 14, column 3 →</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Why ── */}
          <section id="why" className={`border-t ${border} px-6 py-24`}>
            <div className="mx-auto max-w-3xl">
              <div className="flex justify-center">
                <IconTile icon={Zap} size="lg" />
              </div>
              <h2 className={`${h2} mt-6 text-center`}>
                A proper text editor, without the installation.
              </h2>
              <div className={`mt-8 space-y-5 text-[17px] leading-relaxed ${ink70}`}>
                <p>
                  Sometimes you just need to open a file, change a few lines, or write something
                  down. You know the routine: launch an IDE and wait for it to index a project you
                  don&apos;t need, or paste into a bare textarea that forgets everything when the
                  tab closes.
                </p>
                <p>
                  <Wordmark /> skips all of it.{" "}
                  <strong className={`font-semibold ${ink}`}>It&apos;s the editor at the top of this page.</strong>{" "}
                  Type, paste, open a file, save it back. The whole thing takes as long as the edit
                  does.
                </p>
              </div>
            </div>
            <div className={`mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-px border ${border} bg-[var(--pl-border)] sm:grid-cols-3`}>
              {[
                {
                  title: "Instant",
                  lead: "Open EDTR+ and start typing.",
                  body: "No launch screen, setup, or sign-in.",
                },
                {
                  title: "Local",
                  lead: "Your text stays in your browser.",
                  body: "Files you open are processed on your device, not uploaded to our servers.",
                },
                {
                  title: "Capable",
                  lead: "More than a basic online notepad.",
                  body: "Tabs, syntax highlighting, find & replace, large file support, previews, and direct file access are built in.",
                },
              ].map((item) => (
                <div key={item.title} className={styles.featureCard}>
                  <h3 className={`${styles.display} text-lg`}>{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed">{withWordmark(item.lead)}</p>
                  <p className={`mt-1.5 text-sm leading-relaxed ${ink50}`}>{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Comparison ── */}
          <section id="comparison" className={`${styles.soft} border-t ${border} px-6 py-24`}>
            <div className="mx-auto max-w-4xl">
              <h2 className={`${h2} text-center`}>
                <Wordmark /> vs. the alternatives
              </h2>
              <div className={`${styles.comparison} mt-12 overflow-x-auto`}>
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className={`border-b ${border}`}>
                      <th scope="col" className="w-[36%]">
                        <span className="sr-only">Feature</span>
                      </th>
                      <th scope="col" className={`font-semibold ${ink}`}><Wordmark /></th>
                      <th scope="col" className={`font-medium ${ink70}`}>Notepad++</th>
                      <th scope="col" className={`font-medium ${ink70}`}>Cloud editors</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--pl-border)]">
                    {[
                      ["Installation", "None", "Required", "None"],
                      ["Account", "None", "None", "Often required"],
                      ["Runs on macOS & Linux", "Yes", "No", "Yes"],
                      ["Syntax highlighting", "Yes", "Yes", "Varies"],
                      ["Multiple tabs", "Yes", "Yes", "Varies"],
                      ["Real file access", "Yes", "Yes", "Often limited"],
                      ["100,000-line files", "Yes", "Yes", "Varies"],
                      ["Files uploaded to a server", "No", "No", "Usually"],
                      ["Ads", "No", "No", "Varies"],
                      ["Price", "Free", "Free", "Varies"],
                      ["Open source", "Yes", "Yes", "Varies"],
                    ].map(([label, edtr, npp, cloud]) => (
                      <tr key={label}>
                        <th scope="row" className={`font-medium ${ink70}`}>{label}</th>
                        <td className={`font-semibold ${ink}`}>{edtr}</td>
                        <td className={ink50}>{npp}</td>
                        <td className={ink50}>{cloud}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className={`mt-4 text-center text-xs ${ink50}`}>
                <Wordmark /> is an independent open-source project and is not affiliated with
                Notepad++.
              </p>
              <nav aria-label="Related reading" className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
                <Link href="/blog/notepad-plus-plus-in-your-browser" className={styles.textLink}>Notepad++ in your browser</Link>
                <Link href="/blog/edit-files-from-the-browser" className={styles.textLink}>Edit local files from the browser</Link>
                <Link href="/blog/best-free-online-code-editors" className={styles.textLink}>Why use an online code editor</Link>
              </nav>
            </div>
          </section>

          {/* ── Features ── */}
          <section id="features" className={`border-t ${border} px-6 py-24`}>
            <div className="mx-auto max-w-6xl">
              <h2 className={`${h2} mx-auto max-w-2xl text-center`}>
                Everything you need from a lightweight editor.
              </h2>
              <div className={`${styles.featureGrid} ${styles.three} mt-14`}>
                {features.map((f) => (
                  <div key={f.title} className={styles.featureCard}>
                    <div className="mb-4">
                      <IconTile icon={f.icon} size="sm" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                    <p className={`text-sm ${ink50}`}>
                      {typeof f.body === "string" ? withWordmark(f.body) : f.body}
                    </p>
                  </div>
                ))}
              </div>
              <div className={`mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-center text-sm ${ink50}`}>
                <span className={`font-medium ${ink70}`}>Also in there:</span>
                <DotSeparated
                  items={[
                    "autosave on every keystroke",
                    "light and dark themes",
                    "custom editor fonts",
                    "a status bar you can recolor",
                    "installs as an app and works offline",
                  ]}
                />
              </div>
            </div>
          </section>

          {/* ── Privacy ── */}
          <section id="privacy" className={`${styles.soft} border-t ${border} px-6 py-24`}>
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
              <IconTile icon={Lock} size="lg" />
              <h2 className={h2}>Your text stays yours.</h2>
              <p className={`text-lg leading-relaxed ${ink70}`}>
                <Wordmark /> is designed to work locally in your browser. We don&apos;t need an
                account to identify you, and we don&apos;t need your documents on a server to edit
                them.
              </p>
              <p className={`leading-relaxed ${ink70}`}>
                Your notes remain on your device, and files are opened directly from your computer
                when supported by your browser.
              </p>
              <p className={`font-medium leading-relaxed ${ink}`}>
                No account. No cloud workspace. No tracking your documents.
              </p>
            </div>
          </section>

          {/* ── How it works ── */}
          <section id="how" className={`border-t ${border} px-6 py-24`}>
            <div className="mx-auto max-w-5xl">
              <h2 className={`${h2} mx-auto max-w-2xl text-center`}>
                Three steps. The first one already happened.
              </h2>
              <div className={`${styles.steps} mt-12 grid gap-8 sm:grid-cols-3`}>
                {[
                  {
                    title: "Open",
                    body: <>You&apos;re on this page, so the editor is already loaded. Scroll up and the cursor is yours.</>,
                  },
                  {
                    title: "Type or open a file",
                    body: <>Type, paste, or press <Kbd>{keys(cmd, "O")}</Kbd> to open a file from your computer. Every keystroke is saved as you go.</>,
                  },
                  {
                    title: "Save or download",
                    body: <><Kbd>{keys(cmd, "S")}</Kbd> writes back to the file on disk where your browser allows it. <Kbd>{keys(cmd, shift, "S")}</Kbd> downloads a copy anywhere.</>,
                  },
                ].map((s, i) => (
                  <div key={s.title}>
                    <div className={`mb-4 flex size-11 items-center justify-center border border-[var(--pl-border-strong)] bg-[var(--pl-surface)] text-lg font-semibold`}>
                      {i + 1}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                    <p className={`leading-relaxed ${ink50}`}>{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Shortcuts ── */}
          <section id="shortcuts" className={`${styles.soft} border-t ${border} px-6 py-24`}>
            <div className={`${styles.split} mx-auto max-w-6xl`}>
              <div>
                <IconTile icon={Keyboard} />
                <h2 className={`${h2} mt-6`}>Keyboard friendly.</h2>
                <div className={`mt-8 space-y-5 text-[17px] leading-relaxed ${ink70}`}>
                  <p>
                    Keep your hands on the keyboard. Tab and panel commands sit on{" "}
                    <Kbd>{mod}</Kbd> so they never collide with your browser&apos;s own shortcuts
                    {isMacUi ? ", or with the characters Option types" : ""}.
                  </p>
                  <p>
                    The one deliberate exception is <Kbd>{keys(cmd, "F")}</Kbd>: while the editor is
                    focused it opens find &amp; replace, because that habit is too strong to break.
                    Everywhere else on the page, your browser&apos;s find-in-page still works.
                  </p>
                  <p>And the usual editing shortcuts you already know.</p>
                </div>
              </div>
              <div className={styles.panel}>
                <div className={styles.panelHeading}>
                  <Keyboard className="h-4 w-4" aria-hidden="true" />
                  <span>Shortcuts</span>
                  <span className={`text-xs font-normal ${ink50}`}>
                    {isMacUi ? "macOS" : "Windows & Linux"}
                  </span>
                </div>
                <div>
                  {shortcuts.map(([label, combo]) => (
                    <div key={label} className={styles.shortcutRow}>
                      <span>{label}</span>
                      <Kbd>{combo}</Kbd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Use cases ── */}
          <section id="use-cases" className={`border-t ${border} px-6 py-24`}>
            <div className="mx-auto max-w-4xl text-center">
              <h2 className={h2}>Open it when you need to…</h2>
              <ul className="mt-10 flex flex-wrap items-center justify-center gap-3">
                {[
                  "Edit a JSON file",
                  "Inspect a log",
                  "Fix a config",
                  "Write Markdown",
                  "Clean up some text",
                  "Check a code snippet",
                  "Take a quick note",
                  "Open a file without launching a full IDE",
                ].map((use) => (
                  <li
                    key={use}
                    className={`border border-[var(--pl-border-strong)] px-4 py-2 text-sm ${ink70}`}
                  >
                    {use}
                  </li>
                ))}
              </ul>
              <p className={`mx-auto mt-10 max-w-2xl text-[17px] leading-relaxed ${ink70}`}>
                <Wordmark /> is there when a full editor would be too much and a basic textarea
                would be too little.
              </p>
            </div>
          </section>

          {/* ── Notepad++ gap ── */}
          <section id="notepad-plus-plus" className={`border-t ${border} px-6 py-24`}>
            <div className="mx-auto max-w-3xl">
              <h2 className={`${h2} text-center`}>Notepad++ without Windows.</h2>
              <div className={`mt-8 space-y-5 text-[17px] leading-relaxed ${ink70}`}>
                <p>Notepad++ is great, but it is built for Windows.</p>
                <p>
                  <Wordmark /> brings the parts many people use every day to any modern browser:
                  tabs, syntax highlighting, find &amp; replace, file editing, keyboard shortcuts,
                  and a fast place to work with text.
                </p>
                <p>
                  Use it on macOS, Linux, Windows, ChromeOS, or anywhere else you have a browser. No
                  virtual machine. No Wine. No installation.
                </p>
              </div>
              <div className="mt-8 text-center">
                <button type="button" onClick={scrollToEditor} className={styles.textLink}>
                  Open the editor ↑
                </button>
              </div>
            </div>
          </section>

          {/* ── Free means free ── */}
          <section id="pricing" className={`${styles.soft} border-t ${border} px-6 py-24`}>
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <IconTile icon={Github} size="lg" />
              <h2 className={`${h2} mt-6`}>Free means free.</h2>
              <p className={`mt-6 text-[17px] leading-relaxed ${ink70}`}>
                <Wordmark /> has no paid plan. No premium tier. No trial. No ads. No account. The
                project is open source under the MIT license and free to use.
              </p>
              <p className={`mt-4 text-[17px] leading-relaxed ${ink70}`}>
                If you want to see how it works, report an issue, or contribute, the source code is
                on GitHub.
              </p>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.secondaryAction} mt-9`}
              >
                <Github className="h-4 w-4" aria-hidden="true" /> View on GitHub →
              </a>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section id="faq" className={`border-t ${border} px-6 py-24`}>
            <div className="mx-auto max-w-3xl">
              <h2 className={`${h2} text-center`}>Frequently asked questions</h2>
              <div className={`${styles.faq} mt-12 divide-y divide-[var(--pl-border)] border-y ${border}`}>
                {FAQS.map((faq, i) => (
                  <details key={faq.q} className="group" open={i === 0}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[17px] font-medium">
                      {withWordmark(faq.q)}
                      <span className={`text-xl leading-none ${ink50} transition-transform group-open:rotate-45`} aria-hidden="true">
                        +
                      </span>
                    </summary>
                    <p className={`max-w-[65ch] pb-6 pr-8 text-[15px] leading-relaxed ${ink70}`}>
                      {withWordmark(faq.a)}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* ── Final CTA ── */}
          <section id="get-started" className={`${styles.soft} border-t ${border} px-6 py-24`}>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className={`${styles.display} text-[clamp(2rem,5vw,3.25rem)]`}>
                Open. Type. Done.
              </h2>
              <p className={`mx-auto mt-6 max-w-[46ch] text-[17px] leading-relaxed ${ink70}`}>
                No installation, account, subscription, or ads. Just a fast, open-source text
                editor in your browser.
              </p>
              <button
                type="button"
                onClick={scrollToEditor}
                className={`${styles.primaryAction} mt-9`}
              >
                Open <Wordmark /> ↑
              </button>
              <p className={`mt-5 text-[13px] ${ink50}`}>
                Free forever · Ready in about a second · Your text stays on your device
              </p>
            </div>
          </section>
        </main>

        {/* ── Footer ── */}
        <footer className={`border-t ${border} px-6 py-12`}>
          {/* Two blocks: brand on the left, both link groups together on the right. */}
          <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:justify-between">
            <div className="max-w-xs">
              <span className="text-lg leading-none"><Wordmark /></span>
              <p className={`mt-2 text-sm ${ink50}`}>
                The free online notepad. Notepad++, rebuilt for the browser.
              </p>
            </div>
            <div className="flex flex-col gap-10 sm:flex-row sm:gap-20">
              <div>
                <h3 className={`text-xs font-semibold uppercase tracking-wide ${ink50}`}><Wordmark /></h3>
                <div className={`mt-3 flex flex-col items-start gap-2 text-sm ${ink50}`}>
                  <button type="button" onClick={scrollToEditor} className={hoverInk}>Editor</button>
                  <Link href="/blog" className={hoverInk}>Blog</Link>
                  <a href="#features" className={hoverInk}>Features</a>
                  <a href="#faq" className={hoverInk}>FAQ</a>
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1.5 ${hoverInk}`}>
                    <Github className="h-3.5 w-3.5" aria-hidden="true" /> Source
                  </a>
                  <a href="/llms.txt" className={hoverInk}>llms.txt</a>
                </div>
              </div>
              <div>
                <h3 className={`text-sm ${ink}`}>
                  More from <span className={`${styles.display} tracking-tight`}>Project EDTR</span>
                </h3>
                <div className={`mt-3 flex flex-col gap-2 text-sm ${ink50}`}>
                  <a href="https://edtr.md" target="_blank" rel="noopener" className={hoverInk}>EDTR.md · Markdown editor</a>
                  <a href="https://wordpad.info" target="_blank" rel="noopener" className={hoverInk}>EDTRpad · Word alternative</a>
                </div>
              </div>
            </div>
          </div>
          <div className={`mx-auto mt-10 max-w-6xl border-t ${border} pt-6 text-sm ${ink50}`}>
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <div className="space-y-1 text-center sm:text-start">
                <p>© {new Date().getFullYear()} <Wordmark />. Not affiliated with Notepad++.</p>
                <p>Independent open source project, MIT licensed.</p>
              </div>
              <span className="whitespace-nowrap">
                Part of <span className={`${styles.display} tracking-tight ${ink}`}>Project EDTR</span>, brought to you by{" "}
                <a
                  href={CREDIT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block ${ink} transition-opacity hover:opacity-70`}
                  title="312"
                >
                  <Logo312 className="inline-block aspect-[824/259] h-[0.75em] w-auto align-baseline" />
                </a>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
