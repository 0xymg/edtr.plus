"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Notepad } from "@/components/notepad"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  ArrowUp,
  ArrowRight,
  Github,
  Zap,
  Shield,
  Code2,
  Layers,
  Download,
  FolderOpen,
  X,
  Save,
  KeyRound,
  Sparkles,
  Star,
} from "lucide-react"

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
        {
          id: "edtr-markdown-prompt",
          duration: 6000,
        }
      )
    }, 450)

    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      {/* Editor Section */}
      <section className="h-screen w-full shrink-0 overflow-hidden bg-background">
        <Notepad />
      </section>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-[15px] font-semibold tracking-tight">EDTR+</span>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/0xymg/edtrcc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-neutral-500 dark:text-neutral-400 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1.5 rounded-lg bg-neutral-900 dark:bg-white px-4 py-1.5 text-[13px] font-semibold text-white dark:text-neutral-900 transition-all hover:bg-neutral-700 dark:hover:bg-neutral-200"
            >
              Back to Editor
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-20 pb-16 lg:pt-28 lg:pb-24">
          {/* Dotted background pattern */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(circle_at_1px_1px,_rgb(0_0_0/0.08)_1px,_transparent_0)] dark:[background-image:radial-gradient(circle_at_1px_1px,_rgb(255_255_255/0.08)_1px,_transparent_0)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,_black_30%,_transparent_75%)]"
          />
          {/* Soft glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200/40 via-fuchsia-200/30 to-amber-200/30 blur-3xl dark:from-indigo-500/10 dark:via-fuchsia-500/10 dark:to-amber-500/5"
          />

          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 px-4 py-1.5 text-[13px] font-medium text-neutral-600 dark:text-neutral-400 backdrop-blur-sm shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                Simple. Ultra fast. Open source.
              </div>

              <h1 className="text-[clamp(2.5rem,5.5vw,4.25rem)] font-bold leading-[1.05] tracking-tight">
                The notepad you{" "}
                <span className="bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
                  actually wanted.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                Notepad++ speed meets modern design. No installs, no accounts, no waiting. Open a tab and start typing.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 dark:bg-white px-8 text-[14px] font-semibold text-white dark:text-neutral-900 shadow-lg shadow-neutral-900/10 dark:shadow-white/10 transition-all hover:-translate-y-0.5 hover:bg-neutral-700 dark:hover:bg-neutral-200 hover:shadow-xl sm:w-auto"
                >
                  Start Writing
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <a
                  href="https://github.com/0xymg/edtrcc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-8 text-[14px] font-semibold text-neutral-700 dark:text-neutral-300 transition-all hover:-translate-y-0.5 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 sm:w-auto"
                >
                  <Star className="h-4 w-4 text-amber-500 transition-transform group-hover:scale-110" />
                  Star on GitHub
                </a>
              </div>

              {/* Trust line */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-neutral-500 dark:text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  No sign-up
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Saved locally
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Open source
                </span>
              </div>
            </div>

            {/* Keyboard shortcuts */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-neutral-500 dark:text-neutral-500">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-1.5 py-0.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">⌥T</kbd>
                New tab
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-1.5 py-0.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">⌥W</kbd>
                Close tab
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-1.5 py-0.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">⌘S</kbd>
                Save
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-1.5 py-0.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">⌘B</kbd>
                Toggle sidebar
              </span>
            </div>
          </div>
        </section>

        {/* Open Source */}
        <section className="border-t border-neutral-100 dark:border-neutral-800 px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-[12px] font-medium text-neutral-600 dark:text-neutral-400">
              <Github className="h-3.5 w-3.5" />
              MIT Licensed
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">Open Source</h2>
            <div className="mt-6 space-y-4 text-[15px] leading-[1.8] text-neutral-600 dark:text-neutral-400">
              <p>
                EDTR is free and open source software. The source code is available on GitHub. If you find a bug, want to request a feature, or want to contribute code, you are welcome to do so. The project is built with Next.js, React, TypeScript, and Tailwind CSS.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="https://github.com/0xymg/edtrcc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 items-center gap-2 rounded-lg bg-neutral-900 dark:bg-white px-6 text-[13px] font-semibold text-white dark:text-neutral-900 transition-all hover:bg-neutral-700 dark:hover:bg-neutral-200"
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
              <a
                href="https://github.com/0xymg/edtrcc/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 text-[13px] font-semibold text-neutral-700 dark:text-neutral-300 transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                Report an issue
              </a>
            </div>

            <div className="mt-10 border-t border-neutral-100 dark:border-neutral-800 pt-8">
              <p className="mb-4 text-[13px] font-medium text-neutral-500 dark:text-neutral-400">Contributors</p>
              <div className="flex gap-3">
                {["0xymg"].map((username) => (
                  <a
                    key={username}
                    href={`https://github.com/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative"
                    title={username}
                  >
                    <img
                      src={`https://github.com/${username}.png`}
                      alt={username}
                      className="h-10 w-10 rounded-full ring-2 ring-white dark:ring-neutral-950 transition-transform group-hover:scale-110"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What is EDTR */}
        <section className="border-t border-neutral-100 dark:border-neutral-800 px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Free Online Notepad for Writing and Code</h2>
            <div className="mt-6 space-y-4 text-[15px] leading-[1.8] text-neutral-600 dark:text-neutral-400">
              <p>
                EDTR is a free online notepad and code editor that works directly in your browser. It is inspired by Notepad++ and built for people who want a fast, simple text editor without downloading any software. You can use EDTR to write quick notes, draft documents, edit code snippets, keep to-do lists, or work on any kind of plain text file.
              </p>
              <p>
                There is no account to create and no sign-up process. You open the website, start typing, and your work is automatically saved to your browser&apos;s local storage. If you close the tab or shut down your computer, your notes will still be there when you come back. EDTR does not upload anything to a server. Your data stays on your device at all times.
              </p>
              <p>
                EDTR supports syntax highlighting for over 20 programming languages. If you are a developer, you can use it to quickly edit JavaScript, TypeScript, Python, HTML, CSS, JSON, SQL, or any other supported language with proper color-coded highlighting. It is a good alternative to opening a full IDE when you just need to write or review a small piece of code.
              </p>
            </div>
          </div>
        </section>

        {/* How to use */}
        <section className="border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How to use EDTR</h2>
            <p className="mt-3 text-[15px] leading-[1.7] text-neutral-600 dark:text-neutral-400">
              Five steps. No setup required.
            </p>

            <ol className="mt-8 space-y-4">
              {[
                { title: "Open the editor", body: <>Go to <Link href="/" className="font-medium text-neutral-900 dark:text-neutral-100 underline underline-offset-2">edtr.plus</Link> in any modern browser. The editor loads instantly at the top of the page.</> },
                { title: "Start typing", body: <>You can begin writing immediately. Your content is saved automatically after every change.</> },
                { title: "Create multiple tabs", body: <>Press <kbd className="rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-1.5 py-0.5 font-mono text-[12px] text-neutral-600 dark:text-neutral-400">⌥T</kbd> (or <kbd className="rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-1.5 py-0.5 font-mono text-[12px] text-neutral-600 dark:text-neutral-400">Alt+T</kbd> on Windows) to open a new tab. Work on multiple files at the same time.</> },
                { title: "Choose a language", body: <>Click the language selector in the bottom status bar to enable syntax highlighting for your code.</> },
                { title: "Open files from your computer", body: <>On Chrome and Edge, open files and folders directly from your file system. Changes are saved back to disk when you press <kbd className="rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-1.5 py-0.5 font-mono text-[12px] text-neutral-600 dark:text-neutral-400">⌘S</kbd>.</> },
              ].map((step, i) => (
                <li key={i} className="flex gap-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-4 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 dark:bg-white text-[13px] font-semibold text-white dark:text-neutral-900">
                    {i + 1}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h3 className="text-[14.5px] font-semibold text-neutral-900 dark:text-neutral-100">{step.title}</h3>
                    <p className="mt-1 text-[14px] leading-[1.65] text-neutral-600 dark:text-neutral-400">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-neutral-100 dark:border-neutral-800 px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Everything you need, nothing you don&apos;t</h2>
              <p className="mt-3 text-[15px] leading-[1.7] text-neutral-600 dark:text-neutral-400">
                A focused set of features built around speed and privacy.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Code2,
                  iconColor: "text-indigo-500",
                  iconBg: "bg-indigo-50 dark:bg-indigo-500/10",
                  title: "Syntax Highlighting",
                  desc: "Color-coded highlighting for 20+ languages including JavaScript, TypeScript, Python, Go, Rust, and more. Powered by highlight.js.",
                },
                {
                  icon: Layers,
                  iconColor: "text-fuchsia-500",
                  iconBg: "bg-fuchsia-50 dark:bg-fuchsia-500/10",
                  title: "Multi-tab Editing",
                  desc: "Open multiple files in separate tabs, just like a desktop editor. Each tab has its own language and filename.",
                },
                {
                  icon: Save,
                  iconColor: "text-emerald-500",
                  iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
                  title: "Automatic Saving",
                  desc: "Every keystroke is persisted to your browser's LocalStorage. Close the tab, come back later — your work is still there.",
                },
                {
                  icon: KeyRound,
                  iconColor: "text-amber-500",
                  iconBg: "bg-amber-50 dark:bg-amber-500/10",
                  title: "No Login Required",
                  desc: "No accounts, no email verification, no passwords. Open the page and start typing. That's it.",
                },
                {
                  icon: FolderOpen,
                  iconColor: "text-sky-500",
                  iconBg: "bg-sky-50 dark:bg-sky-500/10",
                  title: "Open Local Files",
                  desc: "On Chrome and Edge, open files and folders directly from your disk via the File System Access API. Save back with ⌘S.",
                },
                {
                  icon: Shield,
                  iconColor: "text-violet-500",
                  iconBg: "bg-violet-50 dark:bg-violet-500/10",
                  title: "Private by Default",
                  desc: "Your text never leaves your device. No content tracking, no third-party access. Just local storage.",
                },
                {
                  icon: Zap,
                  iconColor: "text-yellow-500",
                  iconBg: "bg-yellow-50 dark:bg-yellow-500/10",
                  title: "Ultra Fast",
                  desc: "No heavy frameworks in the editor path. Type, switch tabs, and search with near-zero latency.",
                },
                {
                  icon: Download,
                  iconColor: "text-teal-500",
                  iconBg: "bg-teal-50 dark:bg-teal-500/10",
                  title: "Export Anywhere",
                  desc: "Download files individually or export your entire workspace. Take your data with you whenever you want.",
                },
              ].map(({ icon: Icon, iconColor, iconBg, title, desc }) => (
                <div
                  key={title}
                  className="group relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-6 transition-all hover:-translate-y-0.5 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-lg hover:shadow-neutral-200/40 dark:hover:shadow-black/30"
                >
                  <div className={cn("inline-flex h-10 w-10 items-center justify-center rounded-xl", iconBg)}>
                    <Icon className={cn("h-5 w-5", iconColor)} />
                  </div>
                  <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-[1.65] text-neutral-600 dark:text-neutral-400">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Keyboard Shortcuts Table */}
        <section className="border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Keyboard Shortcuts</h2>
            <p className="mt-3 text-[15px] leading-[1.7] text-neutral-600 dark:text-neutral-400">
              On Windows and Linux, use <kbd className="rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-1.5 py-0.5 font-mono text-[12px] text-neutral-600 dark:text-neutral-400">Ctrl</kbd> instead of <kbd className="rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-1.5 py-0.5 font-mono text-[12px] text-neutral-600 dark:text-neutral-400">⌘</kbd> and <kbd className="rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-1.5 py-0.5 font-mono text-[12px] text-neutral-600 dark:text-neutral-400">Alt</kbd> instead of <kbd className="rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-1.5 py-0.5 font-mono text-[12px] text-neutral-600 dark:text-neutral-400">⌥</kbd>. Tab/sidebar shortcuts use <kbd className="rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-1.5 py-0.5 font-mono text-[12px] text-neutral-600 dark:text-neutral-400">⌥</kbd> to avoid conflicts with your browser.
            </p>
            <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40">
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60">
                    <th className="px-5 py-3 font-semibold text-neutral-700 dark:text-neutral-300">Shortcut</th>
                    <th className="px-5 py-3 font-semibold text-neutral-700 dark:text-neutral-300">Action</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-600 dark:text-neutral-400">
                  {[
                    ["⌥T", "Open a new tab"],
                    ["⌥W", "Close the current tab"],
                    ["⌘S", "Save file"],
                    ["⌘⇧S", "Download file"],
                    ["⌘B", "Toggle sidebar"],
                    ["⌘⇧V", "Toggle markdown preview"],
                    ["⌘/", "Toggle comment"],
                    ["⇧⌥F", "Format code (JSON)"],
                    ["Tab", "Insert indentation"],
                  ].map(([shortcut, action], i) => (
                    <tr key={i} className="border-b border-neutral-100 dark:border-neutral-800 last:border-0 transition-colors hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40">
                      <td className="px-5 py-3">
                        <kbd className="rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-2 py-0.5 font-mono text-[12px] text-neutral-700 dark:text-neutral-300">{shortcut}</kbd>
                      </td>
                      <td className="px-5 py-3">{action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Supported Languages */}
        <section className="border-t border-neutral-100 dark:border-neutral-800 px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Supported Programming Languages</h2>
            <p className="mt-3 text-[15px] leading-[1.7] text-neutral-600 dark:text-neutral-400">
              Syntax highlighting for 20+ languages and markup formats, powered by highlight.js. Pick a language from the status bar.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "JavaScript", "TypeScript", "Python", "HTML", "CSS", "JSON",
                "Markdown", "Bash", "SQL", "Java", "C", "C++",
                "C#", "Go", "Rust", "PHP", "Ruby", "Swift",
                "Kotlin", "YAML", "XML",
              ].map((lang) => (
                <span
                  key={lang}
                  className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-[13px] font-medium text-neutral-600 dark:text-neutral-400 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Who can use */}
        <section className="border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Who is EDTR for?</h2>
            <p className="mt-3 text-[15px] leading-[1.7] text-neutral-600 dark:text-neutral-400">
              Anyone who needs a quick, distraction-free text editor in the browser.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { tag: "Developers", desc: "Quickly edit or review code snippets without opening a full IDE." },
                { tag: "Students", desc: "Take notes, draft assignments, and organize study material locally." },
                { tag: "Writers", desc: "A clean writing environment with no toolbars or formatting distractions." },
                { tag: "Researchers", desc: "Collect notes from different sources across multiple organized tabs." },
                { tag: "Engineers", desc: "Scratch space for diffs, config snippets, and quick JSON inspection." },
                { tag: "Anyone", desc: "A reliable notepad you can open in seconds while browsing the web." },
              ].map(({ tag, desc }) => (
                <div
                  key={tag}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-4 transition-colors hover:border-neutral-300 dark:hover:border-neutral-700"
                >
                  <h3 className="text-[14.5px] font-semibold text-neutral-900 dark:text-neutral-100">{tag}</h3>
                  <p className="mt-1 text-[13.5px] leading-[1.65] text-neutral-600 dark:text-neutral-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-neutral-100 dark:border-neutral-800 px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Frequently Asked Questions</h2>
            <p className="mt-3 text-[15px] leading-[1.7] text-neutral-600 dark:text-neutral-400">
              Everything you might wonder about EDTR.
            </p>

            <div className="mt-8 space-y-3">
              {[
                {
                  q: "Is EDTR free to use?",
                  a: "Yes. EDTR is completely free. There are no paid plans, no premium features, and no subscriptions. The entire editor is open source and available to everyone.",
                },
                {
                  q: "Do I need to create an account?",
                  a: "No. EDTR does not have user accounts. You can start using it immediately without signing up, logging in, or providing any personal information.",
                },
                {
                  q: "Where are my notes stored?",
                  a: "Your notes are stored in your browser's LocalStorage. They stay on your device and are never uploaded to any server. If you clear your browser's storage or cache, your notes will be deleted, so make sure to export important files.",
                },
                {
                  q: "How is EDTR different from Notepad++?",
                  a: "Notepad++ is a desktop application that you download and install on Windows. EDTR is a browser-based editor inspired by Notepad++ that offers a similar experience with syntax highlighting, multi-tab editing, and fast performance — running in your browser on any operating system without installation.",
                },
                {
                  q: "Can I open files from my computer?",
                  a: "Yes. On Chrome and Edge, EDTR supports the File System Access API. You can open files and folders from your local disk, edit them in the browser, and save changes directly back to your file system.",
                },
                {
                  q: "What programming languages does EDTR support?",
                  a: "EDTR supports syntax highlighting for over 20 languages including JavaScript, TypeScript, Python, HTML, CSS, JSON, Go, Rust, C, C++, C#, Java, PHP, Ruby, Swift, Kotlin, SQL, Bash, Markdown, YAML, and XML.",
                },
                {
                  q: "Can I use EDTR on my phone or tablet?",
                  a: "EDTR is designed for desktop browsers but works on mobile devices as well. The editor is responsive and adapts to smaller screens, though the full experience is best on a desktop or laptop.",
                },
              ].map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 px-5 transition-colors open:border-neutral-300 dark:open:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-700"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[15px] font-medium text-neutral-900 dark:text-neutral-100 [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="pb-5 pr-8 text-[14px] leading-[1.7] text-neutral-600 dark:text-neutral-400">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="border-t border-neutral-100 dark:border-neutral-800 px-6 py-10">
          <div className="mx-auto max-w-3xl">
            <p className="text-[12px] leading-[1.7] text-neutral-500 dark:text-neutral-500">
              Disclaimer: EDTR stores your notes in your browser&apos;s LocalStorage. If you clear your browser&apos;s cache, cookies, or storage, your notes will be deleted. Please export important files to your local device regularly. EDTR is not affiliated with Notepad++ or any other text editor. EDTR.PLUS is an independent, open source project.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-100 dark:border-neutral-800 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400">
            © {new Date().getFullYear()} EDTR+
          </span>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/0xymg/edtrcc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              GitHub
            </a>
            <Link
              href="/blog"
              className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              Blog
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
