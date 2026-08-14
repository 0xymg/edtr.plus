"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { toast } from "sonner"
import { Github, X } from "lucide-react"
import { isMacPlatform } from "@/lib/shortcuts"

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
]

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://edtr.plus"
const GITHUB_URL = "https://github.com/0xymg/edtr.plus"

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

const ink = "text-[#1C1B18] dark:text-[#EDECE8]"
const muted = "text-[#1C1B18]/60 dark:text-[#EDECE8]/60"
const faint = "text-[#1C1B18]/45 dark:text-[#EDECE8]/45"
const hairline = "border-[rgba(55,53,47,0.1)] dark:border-white/10"
const display = "font-[family-name:var(--font-author)] font-bold tracking-[-0.03em]"
const hoverInk = "hover:text-[#1C1B18] dark:hover:text-[#EDECE8]"
// The "+" in the wordmark is the one spot of colour in the whole palette,
// set slightly larger than the letters with a hair of space before it
const plus = "ml-[0.08em] text-[1.1em] text-[#F5A524]"

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className={`rounded-sm border ${hairline} bg-[#F7F7F5] dark:bg-white/5 px-1.5 py-0.5 font-mono text-[11px] ${muted}`}>
      {children}
    </kbd>
  )
}

/** The product name always renders as the wordmark: amber, slightly larger "+". */
function Wordmark() {
  return (
    <span className={`whitespace-nowrap ${display}`}>
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

function scrollToEditor() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

export default function LandingPage() {
  // App command modifier shown in shortcut hints: Alt on Windows/Linux,
  // ⌃⌥ (Control+Option) on macOS. Set after mount so the prerendered HTML
  // (which says "Alt") hydrates cleanly.
  const [mod, setMod] = useState("Alt")
  useEffect(() => {
    if (isMacPlatform()) setMod("⌃⌥")
  }, [])
  const isMacUi = mod === "⌃⌥"
  const cmd = isMacUi ? "⌘" : "Ctrl"
  const cmdShift = isMacUi ? "⌘⇧" : "Ctrl⇧"

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

  return (
    <div className={`bg-white dark:bg-[#06070B] ${ink}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      {/* Editor */}
      <section className="h-screen w-full shrink-0 overflow-hidden bg-background">
        <Notepad />
      </section>

      {/* Nav */}
      <nav className={`sticky top-0 z-50 border-b ${hairline} bg-white/85 dark:bg-[#06070B]/85 backdrop-blur-xl`}>
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className={`${display} text-lg`}>
            EDTR<span className={plus}>+</span>
          </Link>
          <div className={`hidden md:flex items-center gap-7 text-sm ${muted}`}>
            <a href="#features" className={`${hoverInk} transition-colors`}>Features</a>
            <a href="#privacy" className={`${hoverInk} transition-colors`}>Privacy</a>
            <a href="#comparison" className={`${hoverInk} transition-colors`}>Comparison</a>
            <a href="#shortcuts" className={`${hoverInk} transition-colors`}>Shortcuts</a>
            <a href="#faq" className={`${hoverInk} transition-colors`}>FAQ</a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={`${hoverInk} transition-colors`}>Source</a>
          </div>
          <button
            onClick={scrollToEditor}
            className="bg-[#1C1B18] dark:bg-[#EDECE8] px-5 py-2 text-sm font-semibold text-white dark:text-[#1C1B18] hover:bg-[#1C1B18]/80 dark:hover:bg-white transition-colors"
          >
            Open editor ↑
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pb-16 pt-20 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className={`${display} text-[clamp(2.75rem,7vw,4.5rem)] leading-[1.02] tracking-[-0.04em]`}>
            The notepad that&apos;s already open.
          </h1>
          <p className={`mx-auto mt-7 max-w-[46ch] text-lg leading-relaxed ${muted}`}>
            A fast, open-source Notepad++ alternative that runs in your browser.
          </p>
          <p className={`mx-auto mt-3 max-w-[52ch] leading-relaxed ${muted}`}>
            Tabs, syntax highlighting, find &amp; replace, real file access, and more. No download.
            No account. No ads.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={scrollToEditor}
              className="bg-[#1C1B18] dark:bg-[#EDECE8] px-8 py-3.5 text-base font-semibold text-white dark:text-[#1C1B18] hover:bg-[#1C1B18]/80 dark:hover:bg-white transition-colors"
            >
              Open editor ↑
            </button>
            <a
              href="#features"
              className={`border border-[rgba(55,53,47,0.2)] dark:border-white/20 px-8 py-3.5 text-base font-medium ${muted} hover:border-[rgba(55,53,47,0.45)] dark:hover:border-white/45 transition-colors`}
            >
              See features
            </a>
          </div>
          <p className={`mt-6 text-sm ${faint}`}>
            Free forever · Open source · Runs locally in your browser
          </p>
        </div>
      </section>

      {/* Ticker strip */}
      <section className={`border-y ${hairline}`}>
        <div className={`mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-6 py-4 text-center text-[13px] ${faint}`}>
          <span>Ready in about a second</span>
          <span aria-hidden="true">·</span>
          <span>No account</span>
          <span aria-hidden="true">·</span>
          <span>Multi-tab editing</span>
          <span aria-hidden="true">·</span>
          <span>Opens and saves real files</span>
          <span aria-hidden="true">·</span>
          <span>Handles 100,000-line files</span>
          <span aria-hidden="true">·</span>
          <span>Autosave on every keystroke</span>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="scroll-mt-16 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className={`${display} text-[clamp(2rem,4.5vw,3rem)] leading-[1.05]`}>
            A proper text editor, without the installation.
          </h2>
          <p className={`mt-6 text-[17px] leading-relaxed ${muted}`}>
            Sometimes you just need to open a file, change a few lines, or write something down.
          </p>
          <p className={`mt-4 text-[17px] leading-relaxed ${muted}`}>
            <Wordmark /> gives you the familiar tools of a desktop text editor directly in your browser,
            without turning a simple task into another app, account, or subscription.
          </p>

          <div className={`mt-12 grid grid-cols-1 gap-px sm:grid-cols-3 border ${hairline} bg-[rgba(55,53,47,0.1)] dark:bg-white/10`}>
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
              <div key={item.title} className="bg-white dark:bg-[#06070B] p-6">
                <h3 className={`${display} text-lg tracking-[-0.02em]`}>{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed">{withWordmark(item.lead)}</p>
                <p className={`mt-1.5 text-sm leading-relaxed ${muted}`}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={`scroll-mt-16 border-t ${hairline} px-6 py-24`}>
        <div className="mx-auto max-w-3xl">
          <h2 className={`${display} text-[clamp(2rem,4.5vw,3rem)] leading-[1.05]`}>
            Everything you need from a lightweight editor.
          </h2>

          <div className="mt-12 space-y-10">
            {[
              {
                title: "Multiple tabs",
                body: (
                  <>
                    Keep several notes and files open at once without juggling windows.{" "}
                    <Kbd>{mod}+N</Kbd> opens a tab, <Kbd>{mod}+X</Kbd> closes one.
                  </>
                ),
              },
              {
                title: "Syntax highlighting",
                body: "Readable highlighting for 20+ programming and markup languages, loaded on demand as you pick one.",
              },
              {
                title: "Find & replace",
                body: (
                  <>
                    Search quickly, replace text, match case, or use regular expressions.{" "}
                    <Kbd>{cmd}+F</Kbd> opens it right in the editor.
                  </>
                ),
              },
              {
                title: "Command palette",
                body: (
                  <>
                    <Kbd>{cmd}+K</Kbd> searches your files, your folders, and the text inside every
                    open document at once, then jumps straight to the matching line. It runs the
                    editor&apos;s commands from the same box, and switches the file&apos;s language:
                    type <em>json</em>, press Enter, done.
                  </>
                ),
              },
              {
                title: "Open real files",
                body: (
                  <>
                    Open files from your computer and save changes back to disk when your browser
                    supports it. <Kbd>{cmd}+O</Kbd> to open, <Kbd>{cmd}+S</Kbd> to save.
                  </>
                ),
              },
              {
                title: "Large files",
                body: "Work with logs, datasets, configuration files, and other large text files without turning your browser into a slideshow. Only the lines on screen are rendered, so a 100,000-line file behaves like a short note.",
              },
              {
                title: "JSON viewer & formatter",
                body: (
                  <>
                    Set a file to JSON and a collapsible tree opens next to it, so you can read an
                    API response without counting brackets. Format it, minify it, and when it
                    won&apos;t parse, jump straight to the line that broke it.
                  </>
                ),
              },
              {
                title: "Markdown & SVG preview",
                body: (
                  <>
                    Preview Markdown documents and SVG files directly beside your source. Open a{" "}
                    <code className="font-mono text-[13px]">.md</code> or{" "}
                    <code className="font-mono text-[13px]">.svg</code> file and the preview appears
                    on its own.
                  </>
                ),
              },
            ].map((f) => (
              <div key={f.title}>
                <h3 className={`${display} text-xl tracking-[-0.02em]`}>{f.title}</h3>
                <p className={`mt-2 text-[16px] leading-relaxed ${muted}`}>
                  {typeof f.body === "string" ? withWordmark(f.body) : f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section id="privacy" className={`scroll-mt-16 border-t ${hairline} px-6 py-24`}>
        <div className="mx-auto max-w-3xl">
          <h2 className={`${display} text-[clamp(2rem,4.5vw,3rem)] leading-[1.05]`}>
            Your text stays yours.
          </h2>
          <p className={`mt-6 text-[17px] leading-relaxed ${muted}`}>
            <Wordmark /> is designed to work locally in your browser. We don&apos;t need an account to
            identify you, and we don&apos;t need your documents on a server to edit them.
          </p>
          <p className={`mt-4 text-[17px] leading-relaxed ${muted}`}>
            Your notes remain on your device, and files are opened directly from your computer when
            supported by your browser.
          </p>
          <p className={`mt-6 text-[17px] font-medium leading-relaxed ${ink}`}>
            No account. No cloud workspace. No tracking your documents.
          </p>
        </div>
      </section>

      {/* Notepad++ gap */}
      <section id="notepad-plus-plus" className={`scroll-mt-16 border-t ${hairline} px-6 py-24`}>
        <div className="mx-auto max-w-3xl">
          <h2 className={`${display} text-[clamp(2rem,4.5vw,3rem)] leading-[1.05]`}>
            Notepad++ without Windows.
          </h2>
          <p className={`mt-6 text-[17px] leading-relaxed ${muted}`}>
            Notepad++ is great, but it is built for Windows.
          </p>
          <p className={`mt-4 text-[17px] leading-relaxed ${muted}`}>
            <Wordmark /> brings the parts many people use every day to any modern browser: tabs, syntax
            highlighting, find &amp; replace, file editing, keyboard shortcuts, and a fast place to
            work with text.
          </p>
          <p className={`mt-4 text-[17px] leading-relaxed ${muted}`}>
            Use it on macOS, Linux, Windows, ChromeOS, or anywhere else you have a browser. No
            virtual machine. No Wine. No installation.
          </p>
          <button
            onClick={scrollToEditor}
            className="mt-9 bg-[#1C1B18] dark:bg-[#EDECE8] px-8 py-3.5 text-base font-semibold text-white dark:text-[#1C1B18] hover:bg-[#1C1B18]/80 dark:hover:bg-white transition-colors"
          >
            Open the editor ↑
          </button>
        </div>
      </section>

      {/* Comparison */}
      <section id="comparison" className={`scroll-mt-16 border-t ${hairline} px-6 py-24`}>
        <div className="mx-auto max-w-4xl">
          <h2 className={`${display} text-[clamp(2rem,4.5vw,3rem)] leading-[1.05]`}>
            <Wordmark /> vs. the alternatives
          </h2>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className={`border-b ${hairline}`}>
                  <th className="w-[36%] px-4 py-3" />
                  <th className={`bg-[#F7F7F5] dark:bg-white/5 px-4 py-3 text-left font-semibold ${ink}`}><Wordmark /></th>
                  <th className={`px-4 py-3 text-left font-medium ${muted}`}>Notepad++</th>
                  <th className={`px-4 py-3 text-left font-medium ${muted}`}>Cloud editors</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Installation", "None", "Required", "None"],
                  ["Account", "None", "None", "Often required"],
                  ["Runs on macOS", "Yes", "No", "Yes"],
                  ["Runs on Linux", "Yes", "No", "Yes"],
                  ["Syntax highlighting", "Yes", "Yes", "Varies"],
                  ["Multiple tabs", "Yes", "Yes", "Varies"],
                  ["Real file access", "Yes", "Yes", "Often limited"],
                  ["Files uploaded to a server", "No", "No", "Usually"],
                  ["Ads", "No", "No", "Varies"],
                  ["Price", "Free", "Free", "Varies"],
                  ["Open source", "Yes", "Yes", "Varies"],
                ].map(([label, edtr, npp, cloud]) => (
                  <tr key={label} className={`border-b ${hairline} last:border-0`}>
                    <td className={`px-4 py-3 font-medium ${ink}`}>{label}</td>
                    <td className={`bg-[#F7F7F5] dark:bg-white/5 px-4 py-3 font-medium ${ink}`}>{edtr}</td>
                    <td className={`px-4 py-3 ${muted}`}>{npp}</td>
                    <td className={`px-4 py-3 ${muted}`}>{cloud}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`mt-5 text-[13px] ${faint}`}>
            <Wordmark /> is an independent open-source project and is not affiliated with Notepad++.
          </p>
        </div>
      </section>

      {/* Use cases */}
      <section id="use-cases" className={`scroll-mt-16 border-t ${hairline} px-6 py-24`}>
        <div className="mx-auto max-w-3xl">
          <h2 className={`${display} text-[clamp(2rem,4.5vw,3rem)] leading-[1.05]`}>
            Open it when you need to…
          </h2>
          <ul className="mt-8 flex flex-wrap gap-2.5">
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
                className={`border ${hairline} bg-[#F7F7F5] dark:bg-white/5 px-4 py-2 text-sm ${muted}`}
              >
                {use}
              </li>
            ))}
          </ul>
          <p className={`mt-8 text-[17px] leading-relaxed ${muted}`}>
            <Wordmark /> is there when a full editor would be too much and a basic textarea would be too
            little.
          </p>
        </div>
      </section>

      {/* Shortcuts */}
      <section id="shortcuts" className={`scroll-mt-16 border-t ${hairline} px-6 py-24`}>
        <div className="mx-auto max-w-3xl">
          <h2 className={`${display} text-[clamp(2rem,4.5vw,3rem)] leading-[1.05]`}>
            Keyboard friendly.
          </h2>
          <p className={`mt-6 text-[17px] leading-relaxed ${muted}`}>
            Keep your hands on the keyboard. Tab and panel commands sit on <Kbd>{mod}</Kbd> so they
            never collide with your browser&apos;s own shortcuts
            {isMacUi ? ", or with the characters Option types" : ""}.
          </p>

          <div className={`mt-10 grid grid-cols-1 sm:grid-cols-2 border-t ${hairline}`}>
            {[
              ["Command palette", [cmd, "K"]],
              ["Find & replace", [cmd, "F"]],
              ["Save", [cmd, "S"]],
              ["Open file", [cmd, "O"]],
              ["Download file", [cmdShift, "S"]],
              ["New tab", [mod, "N"]],
              ["Close tab", [mod, "X"]],
              ["Toggle sidebar", [mod, "B"]],
              ["Markdown preview", [mod, "P"]],
              ["Toggle comment", [cmd, "/"]],
              ["Format (JSON)", [`${mod}⇧`, "F"]],
              ["Insert indentation", ["Tab"]],
            ].map(([label, keys], i) => (
              <div
                key={i}
                className={`flex items-center justify-between border-b ${hairline} py-3 text-sm ${muted} ${
                  i % 2 === 0 ? "sm:pr-8" : `sm:border-l sm:pl-8 ${hairline}`
                }`}
              >
                <span>{label}</span>
                <span className="flex items-center gap-1">
                  {(keys as string[]).map((k, j) => (
                    <Kbd key={j}>{k}</Kbd>
                  ))}
                </span>
              </div>
            ))}
          </div>
          <p className={`mt-6 text-sm ${faint}`}>
            And the usual editing shortcuts you already know.
          </p>
        </div>
      </section>

      {/* Free means free */}
      <section id="pricing" className={`scroll-mt-16 border-t ${hairline} px-6 py-24`}>
        <div className="mx-auto max-w-3xl">
          <h2 className={`${display} text-[clamp(2rem,4.5vw,3rem)] leading-[1.05]`}>
            Free means free.
          </h2>
          <p className={`mt-6 text-[17px] leading-relaxed ${muted}`}>
            <Wordmark /> has no paid plan. No premium tier. No trial. No ads. No account. The project is
            open source and free to use.
          </p>
          <p className={`mt-4 text-[17px] leading-relaxed ${muted}`}>
            If you want to see how it works, report an issue, or contribute, the source code is
            available on GitHub.
          </p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-9 inline-flex items-center gap-2 border border-[rgba(55,53,47,0.2)] dark:border-white/20 px-8 py-3.5 text-base font-medium ${ink} hover:border-[rgba(55,53,47,0.45)] dark:hover:border-white/45 transition-colors`}
          >
            <Github className="h-4 w-4" /> View on GitHub →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={`scroll-mt-16 border-t ${hairline} px-6 py-24`}>
        <div className="mx-auto max-w-3xl">
          <h2 className={`${display} text-[clamp(2rem,4.5vw,3rem)] leading-[1.05]`}>
            Frequently asked questions
          </h2>

          <div className="mt-8">
            {FAQS.map((faq, i) => (
              <details key={i} className={`group border-t ${hairline} last:border-b`} open={i === 0}>
                <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 py-5 ${display} text-lg tracking-[-0.02em] [&::-webkit-details-marker]:hidden`}>
                  {withWordmark(faq.q)}
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center font-mono text-base ${faint} transition-transform group-open:rotate-45`}>
                    +
                  </span>
                </summary>
                <p className={`max-w-[64ch] pb-6 pr-8 text-[15px] leading-relaxed ${muted}`}>{withWordmark(faq.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="get-started" className={`scroll-mt-16 border-t ${hairline} px-6 py-24`}>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className={`${display} text-[clamp(2rem,5vw,3.25rem)] leading-[1.05]`}>
            Open. Type. Done.
          </h2>
          <p className={`mx-auto mt-6 max-w-[46ch] text-[17px] leading-relaxed ${muted}`}>
            No installation, account, subscription, or ads. Just a fast, open-source text editor in
            your browser.
          </p>
          <button
            onClick={scrollToEditor}
            className="mt-9 bg-[#1C1B18] dark:bg-[#EDECE8] px-8 py-3.5 text-base font-semibold text-white dark:text-[#1C1B18] hover:bg-[#1C1B18]/80 dark:hover:bg-white transition-colors"
          >
            Open <Wordmark /> ↑
          </button>
          <p className={`mt-6 text-sm ${faint}`}>
            Free forever · Open source · No ads
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${hairline} px-6 py-12`}>
        <div className="mx-auto flex max-w-5xl flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <span className={`${display} leading-none`}>
              <span className={`text-lg ${ink}`}>EDTR</span>
              <span className={`text-lg font-semibold ${plus}`}>+</span>
            </span>
            <p className={`mt-2 text-sm ${muted}`}>
              The free online notepad. Notepad++, rebuilt for the browser.
            </p>
          </div>
          <div className="flex flex-col gap-10 sm:flex-row sm:gap-20">
            <div>
              <h3 className={`text-xs font-semibold uppercase tracking-wide ${muted}`}><Wordmark /></h3>
              <div className={`mt-3 flex flex-col gap-2 text-sm ${muted}`}>
                <button onClick={scrollToEditor} className={`text-left ${hoverInk} transition-colors`}>Editor</button>
                <Link href="/blog" className={`${hoverInk} transition-colors`}>Blog</Link>
                <a href="#features" className={`${hoverInk} transition-colors`}>Features</a>
                <a href="#faq" className={`${hoverInk} transition-colors`}>FAQ</a>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-1.5 ${hoverInk} transition-colors`}>
                  <Github className="h-3.5 w-3.5" /> Source
                </a>
                <a href="/llms.txt" className={`${hoverInk} transition-colors`}>llms.txt</a>
              </div>
            </div>
            <div>
              <h3 className={`text-sm ${ink}`}>
                More from <span className={`${display} text-sm`}>Project EDTR</span>
              </h3>
              <div className={`mt-3 flex flex-col gap-2 text-sm ${muted}`}>
                <a href="https://edtr.md" target="_blank" rel="noopener" className={`${hoverInk} transition-colors`}>EDTR.md · Markdown editor</a>
                <a href="https://wordpad.info" target="_blank" rel="noopener" className={`${hoverInk} transition-colors`}>EDTRpad · Word alternative</a>
              </div>
            </div>
          </div>
        </div>
        <div className={`mx-auto mt-10 max-w-5xl border-t ${hairline} pt-6 text-sm ${muted}`}>
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <span>© {new Date().getFullYear()} <Wordmark />. Not affiliated with Notepad++. Independent open source project.</span>
            <span className="whitespace-nowrap">
              Part of <span className={`${display} text-sm ${ink}`}>Project EDTR</span>, brought to you by{" "}
              <a href="https://ymg.digital" target="_blank" rel="noopener" className={`font-medium ${ink} transition-opacity hover:opacity-70`}>ymg.digital</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
