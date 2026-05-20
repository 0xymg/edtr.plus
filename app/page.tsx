"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Notepad } from "@/components/notepad"
import { toast } from "sonner"
import { Github, X } from "lucide-react"

export default function LandingPage() {
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
    <div className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Editor */}
      <section className="h-screen w-full shrink-0 overflow-hidden bg-background">
        <Notepad />
      </section>

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-8">
          <Link href="/" className="font-mono text-sm font-semibold tracking-tight">
            EDTR<span className="text-amber-500">+</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 font-mono text-xs text-neutral-500 dark:text-neutral-400">
            <a href="#features" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">features</a>
            <a href="#how" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">how</a>
            <a href="#compare" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">compare</a>
            <a href="#faq" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">faq</a>
            <a href="https://github.com/0xymg/edtrcc" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">source</a>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 rounded border border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 px-4 py-1.5 font-mono text-xs font-semibold text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-white transition-colors"
          >
            ↑ editor
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-8 pb-24">
        {/* Hero */}
        <header className="border-b border-neutral-200 dark:border-neutral-800 py-20 lg:py-28">
          <p className="mb-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[.14em] text-neutral-400 dark:text-neutral-500">
            <span className="inline-block h-px w-6 bg-current" aria-hidden="true" />
            a plain text editor for the browser
          </p>

          <h1 className="mb-7 max-w-[14ch] font-[family-name:var(--font-hanken)] text-[clamp(3rem,7vw,6rem)] font-medium leading-[0.98] tracking-[-0.035em]">
            The notepad<br />
            you actually<br />
            <em className="italic font-normal text-neutral-400 dark:text-neutral-600">wanted.</em>
          </h1>

          <p className="mb-3 max-w-[52ch] text-lg leading-relaxed text-neutral-500 dark:text-neutral-400">
            EDTR+ is an online text editor with modern design. No installs, no accounts, no waiting. Open a tab and start typing.
          </p>

          <p className="mb-9 font-mono text-xs tracking-[.02em] text-neutral-400 dark:text-neutral-600">
            inspired by{" "}
            <a href="https://notepad-plus-plus.org/" target="_blank" rel="noopener noreferrer" className="text-neutral-500 dark:text-neutral-500 underline underline-offset-3 hover:text-neutral-700 dark:hover:text-neutral-400 transition-colors">Notepad++</a>
            , rebuilt for the browser.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 rounded border border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 px-5 py-3 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-white transition-colors"
            >
              Open the editor <span className="font-mono">→</span>
            </button>
            <a
              href="#features"
              className="flex items-center gap-2 rounded border border-neutral-300 dark:border-neutral-700 px-5 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:border-neutral-500 dark:hover:border-neutral-500 transition-colors"
            >
              See features
            </a>
            <span className="ml-1 font-mono text-xs text-neutral-400 dark:text-neutral-500">free · no sign-up · open source</span>
          </div>
        </header>

        {/* §01 What is EDTR+ */}
        <section id="what" className="border-b border-neutral-200 dark:border-neutral-800 py-16 lg:py-[72px] md:grid md:grid-cols-[160px_1fr] md:gap-8">
          <div className="mb-5 md:mb-0 md:pt-2">
            <span className="block font-mono text-[10.5px] uppercase tracking-[.14em] text-neutral-400 dark:text-neutral-600 mb-1.5">§01</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[.14em] text-neutral-500 dark:text-neutral-500">what is EDTR+</span>
          </div>
          <div>
            <h2 className="mb-6 max-w-[22ch] font-[family-name:var(--font-hanken)] text-[clamp(1.75rem,3.4vw,2.625rem)] font-medium leading-[1.08] tracking-[-0.025em]">
              A text editor that opens like a tab,{" "}
              <em className="italic font-normal text-neutral-400 dark:text-neutral-600">not an app.</em>
            </h2>
            <p className="mb-4 max-w-[56ch] text-[17px] leading-relaxed text-neutral-900 dark:text-neutral-100">
              Open edtr.plus and start typing. No download, no account. Your work stays in the browser; save to disk when you want.
            </p>
            <p className="max-w-[62ch] text-[14.5px] leading-[1.8] text-neutral-500 dark:text-neutral-400">
              Inspired by Notepad++. Good for notes, code snippets, configs, or anything that&apos;s just text. Open a Markdown or SVG file and a live preview appears automatically.
            </p>
          </div>
        </section>

        {/* §02 Features */}
        <section id="features" className="border-b border-neutral-200 dark:border-neutral-800 py-16 lg:py-[72px] md:grid md:grid-cols-[160px_1fr] md:gap-8">
          <div className="mb-5 md:mb-0 md:pt-2">
            <span className="block font-mono text-[10.5px] uppercase tracking-[.14em] text-neutral-400 dark:text-neutral-600 mb-1.5">§02</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[.14em] text-neutral-500 dark:text-neutral-500">features</span>
          </div>
          <div>
            <h2 className="mb-6 max-w-[22ch] font-[family-name:var(--font-hanken)] text-[clamp(1.75rem,3.4vw,2.625rem)] font-medium leading-[1.08] tracking-[-0.025em]">
              Works the way{" "}
              <em className="italic font-normal text-neutral-400 dark:text-neutral-600">you expect.</em>
            </h2>

            {/* Bento grid */}
            <div className="grid grid-cols-6 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-md overflow-hidden">
              <div className="col-span-6 sm:col-span-3 bg-white dark:bg-neutral-950 p-5 lg:p-6">
                <p className="font-mono text-[10.5px] uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-600 mb-3">/01 · highlighting</p>
                <h3 className="text-[15px] font-semibold mb-2">Syntax for 20+ languages</h3>
                <p className="text-[13.5px] text-neutral-500 dark:text-neutral-400 max-w-[38ch] mb-3">Color-coded highlighting. Change language in the status bar.</p>
                <div className="flex flex-wrap gap-1.5 font-mono text-[11px] text-neutral-500 dark:text-neutral-500">
                  {["JS", "TS", "Python", "Go", "Rust", "C", "C++", "Java", "HTML", "CSS", "JSON", "SQL", "Bash", "…"].map((l) => (
                    <span key={l} className="border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 rounded-full">{l}</span>
                  ))}
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3 bg-white dark:bg-neutral-950 p-5 lg:p-6">
                <p className="font-mono text-[10.5px] uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-600 mb-3">/02 · workspace</p>
                <h3 className="text-[15px] font-semibold mb-2">Multi-tab editing</h3>
                <p className="text-[13.5px] text-neutral-500 dark:text-neutral-400 max-w-[38ch]">
                  Multiple documents open at once.{" "}
                  <kbd className="rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600 dark:text-neutral-400">Alt+N</kbd>{" "}
                  for a new tab,{" "}
                  <kbd className="rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600 dark:text-neutral-400">Alt+X</kbd>{" "}
                  to close. Find &amp; replace with regex.
                </p>
              </div>

              <div className="col-span-6 sm:col-span-2 bg-white dark:bg-neutral-950 p-5 lg:p-6">
                <p className="font-mono text-[10.5px] uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-600 mb-3">/03 · privacy</p>
                <h3 className="text-[15px] font-semibold mb-2">Local-first</h3>
                <p className="text-[13.5px] text-neutral-500 dark:text-neutral-400">Your files stay in your browser. No telemetry, no analytics.</p>
              </div>

              <div className="col-span-6 sm:col-span-2 bg-white dark:bg-neutral-950 p-5 lg:p-6">
                <p className="font-mono text-[10.5px] uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-600 mb-3">/04 · disk</p>
                <h3 className="text-[15px] font-semibold mb-2">Real file access</h3>
                <p className="text-[13.5px] text-neutral-500 dark:text-neutral-400">Open and save files on your machine via the File System Access API.</p>
              </div>

              <div className="col-span-6 sm:col-span-2 bg-white dark:bg-neutral-950 p-5 lg:p-6">
                <p className="font-mono text-[10.5px] uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-600 mb-3">/05 · autosave</p>
                <h3 className="text-[15px] font-semibold mb-2">Autosave</h3>
                <p className="text-[13.5px] text-neutral-500 dark:text-neutral-400">Written to browser storage on every change. Close the tab; it&apos;s still there.</p>
              </div>

              <div className="col-span-6 sm:col-span-3 bg-white dark:bg-neutral-950 p-5 lg:p-6">
                <p className="font-mono text-[10.5px] uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-600 mb-3">/06 · preview</p>
                <h3 className="text-[15px] font-semibold mb-2">Markdown &amp; SVG preview</h3>
                <p className="text-[13.5px] text-neutral-500 dark:text-neutral-400">Open a <code className="font-mono text-[12px]">.md</code> or <code className="font-mono text-[12px]">.svg</code> file and a live preview opens automatically alongside the editor.</p>
              </div>

              <div className="col-span-6 sm:col-span-3 bg-white dark:bg-neutral-950 p-5 lg:p-6">
                <p className="font-mono text-[10.5px] uppercase tracking-[.12em] text-neutral-400 dark:text-neutral-600 mb-3">/07 · footprint</p>
                <h3 className="text-[15px] font-semibold mb-1">Sub-second cold start.</h3>
                <p className="text-[13.5px] text-neutral-500 dark:text-neutral-400">The editor runtime is lazy-loaded and cached after first visit.</p>
              </div>
            </div>
          </div>
        </section>

        {/* §03 How to use */}
        <section id="how" className="border-b border-neutral-200 dark:border-neutral-800 py-16 lg:py-[72px] md:grid md:grid-cols-[160px_1fr] md:gap-8">
          <div className="mb-5 md:mb-0 md:pt-2">
            <span className="block font-mono text-[10.5px] uppercase tracking-[.14em] text-neutral-400 dark:text-neutral-600 mb-1.5">§03</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[.14em] text-neutral-500 dark:text-neutral-500">how to use it</span>
          </div>
          <div>
            <h2 className="mb-6 max-w-[22ch] font-[family-name:var(--font-hanken)] text-[clamp(1.75rem,3.4vw,2.625rem)] font-medium leading-[1.08] tracking-[-0.025em]">
              Five steps.{" "}
              <em className="italic font-normal text-neutral-400 dark:text-neutral-600">Four of them optional.</em>
            </h2>

            <ol className="m-0 p-0 list-none">
              {[
                {
                  title: "Open edtr.plus",
                  body: <>Type <strong className="text-neutral-900 dark:text-neutral-100">edtr.plus</strong> in your address bar. The editor opens immediately at the top of the page.</>,
                },
                {
                  title: "Start typing",
                  body: "Just type. Autosave writes to browser storage on every change.",
                },
                {
                  title: "Create multiple tabs",
                  body: <>Press <kbd className="rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-1.5 py-0.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">Alt+N</kbd> for a new tab and <kbd className="rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-1.5 py-0.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">Alt+X</kbd> to close. Work on multiple files at once.</>,
                },
                {
                  title: "Choose a language",
                  body: "Click the language selector in the status bar.",
                },
                {
                  title: "Open or save a real file",
                  body: <>On Chrome and Edge, open files directly from your file system. <kbd className="rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-1.5 py-0.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">⌘S</kbd> saves back to disk.</>,
                },
              ].map((step, i) => (
                <li key={i} className="grid grid-cols-[48px_1fr] gap-4 py-[18px] border-t border-neutral-200 dark:border-neutral-800 last:border-b last:border-neutral-200 dark:last:border-neutral-800">
                  <span className="font-mono text-[13px] text-neutral-400 dark:text-neutral-600 pt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[16.5px] font-semibold tracking-tight mb-0.5">{step.title}</h3>
                    <p className="text-[14.5px] leading-[1.65] text-neutral-500 dark:text-neutral-400 max-w-[54ch]">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* §04 Compare */}
        <section id="compare" className="border-b border-neutral-200 dark:border-neutral-800 py-16 lg:py-[72px] md:grid md:grid-cols-[160px_1fr] md:gap-8">
          <div className="mb-5 md:mb-0 md:pt-2">
            <span className="block font-mono text-[10.5px] uppercase tracking-[.14em] text-neutral-400 dark:text-neutral-600 mb-1.5">§04</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[.14em] text-neutral-500 dark:text-neutral-500">compared to</span>
          </div>
          <div>
            <h2 className="mb-4 max-w-[22ch] font-[family-name:var(--font-hanken)] text-[clamp(1.75rem,3.4vw,2.625rem)] font-medium leading-[1.08] tracking-[-0.025em]">
              Where EDTR+ sits.
            </h2>
            <p className="mb-6 max-w-[56ch] text-[14.5px] text-neutral-500 dark:text-neutral-400">A short, honest comparison against the two other ways people edit text today.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-[13.5px] border-collapse">
                <thead>
                  <tr>
                    <th className="text-left border-b border-neutral-200 dark:border-neutral-800 px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[.1em] text-neutral-400 dark:text-neutral-600 font-normal w-[34%]" />
                    <th className="text-left border-b border-neutral-200 dark:border-neutral-800 px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[.1em] text-neutral-500 dark:text-neutral-400 font-normal bg-neutral-50 dark:bg-neutral-900/60">EDTR+</th>
                    <th className="text-left border-b border-neutral-200 dark:border-neutral-800 px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[.1em] text-neutral-400 dark:text-neutral-600 font-normal">desktop editors</th>
                    <th className="text-left border-b border-neutral-200 dark:border-neutral-800 px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[.1em] text-neutral-400 dark:text-neutral-600 font-normal">cloud editors</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Install required", "no", "yes", "no"],
                    ["Account / sign-up", "no", "no", "usually yes"],
                    ["Where your data lives", "your device", "your device", "a server"],
                    ["Cold start time", "< 1 s", "2–10 s", "2–6 s"],
                    ["Price", "free", "mixed", "mixed"],
                  ].map(([label, edtr, desktop, cloud]) => (
                    <tr key={label} className="border-b border-neutral-100 dark:border-neutral-900 last:border-0">
                      <td className="px-4 py-3.5 font-medium text-neutral-700 dark:text-neutral-300">{label}</td>
                      <td className="px-4 py-3.5 text-neutral-900 dark:text-neutral-100 font-medium bg-neutral-50 dark:bg-neutral-900/60">
                        <span className="mr-1.5 font-mono text-[12px] text-amber-500">✓</span>{edtr}
                      </td>
                      <td className="px-4 py-3.5 text-neutral-500 dark:text-neutral-400">{desktop}</td>
                      <td className="px-4 py-3.5 text-neutral-500 dark:text-neutral-400">{cloud}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* §05 Shortcuts */}
        <section id="shortcuts" className="border-b border-neutral-200 dark:border-neutral-800 py-16 lg:py-[72px] md:grid md:grid-cols-[160px_1fr] md:gap-8">
          <div className="mb-5 md:mb-0 md:pt-2">
            <span className="block font-mono text-[10.5px] uppercase tracking-[.14em] text-neutral-400 dark:text-neutral-600 mb-1.5">§05</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[.14em] text-neutral-500 dark:text-neutral-500">shortcuts</span>
          </div>
          <div>
            <h2 className="mb-3 max-w-[22ch] font-[family-name:var(--font-hanken)] text-[clamp(1.75rem,3.4vw,2.625rem)] font-medium leading-[1.08] tracking-[-0.025em]">
              Made for the keyboard.
            </h2>
            <p className="mb-6 text-[14px] text-neutral-500 dark:text-neutral-400 max-w-[54ch]">
              Designed to avoid conflicts with your browser. On macOS,{" "}
              <kbd className="rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600 dark:text-neutral-400">Alt</kbd>{" "}
              is{" "}
              <kbd className="rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600 dark:text-neutral-400">⌥ Option</kbd>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-neutral-200 dark:border-neutral-800">
              {[
                ["Open file", ["⌘", "O"]],
                ["Save file", ["⌘", "S"]],
                ["New tab", ["Alt", "N"]],
                ["Close tab", ["Alt", "X"]],
                ["Toggle sidebar", ["Alt", "B"]],
                ["Download file", ["⌘⇧", "S"]],
                ["Toggle comment", ["⌘", "/"]],
                ["Format (JSON)", ["Alt⇧", "F"]],
                ["Markdown preview", ["Alt", "P"]],
                ["Insert indentation", ["Tab", ""]],
              ].map(([label, keys], i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center py-3 border-b border-neutral-200 dark:border-neutral-800 text-[13.5px] text-neutral-500 dark:text-neutral-400 ${
                    i % 2 === 0 ? "sm:pr-6" : "sm:pl-6 sm:border-l sm:border-neutral-200 dark:sm:border-neutral-800"
                  }`}
                >
                  <span>{label}</span>
                  <span className="flex items-center gap-1">
                    {(keys as string[]).filter(Boolean).map((k, j) => (
                      <kbd key={j} className="rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-1.5 py-0.5 font-mono text-[11px] text-neutral-700 dark:text-neutral-300">
                        {k}
                      </kbd>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* §06 FAQ */}
        <section id="faq" className="border-b border-neutral-200 dark:border-neutral-800 py-16 lg:py-[72px] md:grid md:grid-cols-[160px_1fr] md:gap-8">
          <div className="mb-5 md:mb-0 md:pt-2">
            <span className="block font-mono text-[10.5px] uppercase tracking-[.14em] text-neutral-400 dark:text-neutral-600 mb-1.5">§06</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[.14em] text-neutral-500 dark:text-neutral-500">frequently asked</span>
          </div>
          <div>
            <h2 className="mb-6 max-w-[22ch] font-[family-name:var(--font-hanken)] text-[clamp(1.75rem,3.4vw,2.625rem)] font-medium leading-[1.08] tracking-[-0.025em]">
              Answers, <em className="italic font-normal text-neutral-400 dark:text-neutral-600">kept short.</em>
            </h2>

            {[
              {
                q: "Is EDTR+ free to use?",
                a: "Yes. No ads, no sign-up, no premium plan. Open source.",
              },
              {
                q: "Where does my writing go?",
                a: "Browser local storage only. You can save to disk or download a file. Nothing goes to a server.",
              },
              {
                q: "Do I need to create an account?",
                a: "No. Open edtr.plus and start typing.",
              },
              {
                q: "Which browsers are supported?",
                a: "Current versions of Chrome, Edge, Firefox, Safari, and Chromium-based browsers all work. For the best local-file experience, use a browser with File System Access API support (Chrome, Edge, Opera).",
              },
              {
                q: "How is EDTR+ different from Notepad++?",
                a: "Notepad++ is a desktop app for Windows. EDTR+ runs in the browser on any OS, no install. Same idea: fast, tabs, syntax highlighting.",
              },
              {
                q: "Which languages have syntax highlighting?",
                a: "JavaScript, TypeScript, Python, Go, Rust, C, C++, C#, Java, Kotlin, Swift, Ruby, PHP, HTML, CSS, JSON, YAML, Markdown, SQL, Bash, and more.",
              },
              {
                q: "Is it open source?",
                a: "Yes. The source code is on GitHub under an MIT license. File an issue or contribute at github.com/0xymg/edtrcc.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group border-t border-neutral-200 dark:border-neutral-800 last:border-b last:border-neutral-200 dark:last:border-neutral-800"
                open={i === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-[family-name:var(--font-hanken)] text-[21px] font-medium tracking-[-0.02em] text-neutral-900 dark:text-neutral-100 [&::-webkit-details-marker]:hidden group-open:text-amber-600 dark:group-open:text-amber-400 transition-colors">
                  {faq.q}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 font-mono text-[15px] text-neutral-400 dark:text-neutral-600 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="pb-5 pr-8 text-[14.5px] leading-[1.7] text-neutral-500 dark:text-neutral-400 max-w-[64ch]">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA strip */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-8 items-center rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 px-10 py-14">
          <div>
            <h2 className="mb-2 font-[family-name:var(--font-hanken)] text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-[1.1] tracking-[-0.025em]">
              Open a tab.{" "}
              <em className="italic font-normal text-neutral-400 dark:text-neutral-600">Start typing.</em>
            </h2>
            <p className="text-[14.5px] text-neutral-500 dark:text-neutral-400">
              Type <strong className="text-neutral-900 dark:text-neutral-100">edtr.plus</strong> in your address bar.
            </p>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 rounded border border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 px-6 py-3 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-white transition-colors whitespace-nowrap"
          >
            Open the editor <span className="font-mono">→</span>
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-2 sm:grid-cols-3 gap-8 text-[13px] text-neutral-500 dark:text-neutral-400">
          <div>
            <h4 className="font-mono text-[10.5px] uppercase tracking-[.14em] text-neutral-400 dark:text-neutral-600 mb-2.5">EDTR+</h4>
            <ul className="space-y-1.5">
              <li><a href="https://edtr.plus/" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">edtr.plus</a></li>
              <li><Link href="/blog" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[10.5px] uppercase tracking-[.14em] text-neutral-400 dark:text-neutral-600 mb-2.5">Project</h4>
            <ul className="space-y-1.5">
              <li>
                <a href="https://github.com/0xymg/edtrcc" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors flex items-center gap-1.5">
                  <Github className="h-3 w-3" /> source
                </a>
              </li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-mono text-[10.5px] uppercase tracking-[.14em] text-neutral-400 dark:text-neutral-600 mb-2.5">Legal</h4>
            <ul className="space-y-1.5">
              <li><a href="/privacy" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">privacy</a></li>
              <li><a href="/terms" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">terms</a></li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-3 pt-5 border-t border-neutral-100 dark:border-neutral-900 flex flex-col sm:flex-row justify-between gap-2 font-mono text-[11px] text-neutral-400 dark:text-neutral-600">
            <span>© {new Date().getFullYear()} EDTR+</span>
            <span>not affiliated with Notepad++ · independent open source project</span>
            <span>made for keyboards, not clouds.</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
