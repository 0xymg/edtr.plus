"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Notepad } from "@/components/notepad"
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
            <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-neutral-900">
              <img src="/icon.svg" alt="EDTR" className="h-full w-full object-cover" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">EDTR</span>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-1.5 text-[13px] font-semibold text-white transition-all hover:bg-neutral-700"
            >
              Back to Editor
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-4 py-1.5 text-[13px] font-medium text-neutral-600 dark:text-neutral-400">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                Simple. Ultra fast. Open source.
              </div>

              <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.1] tracking-tight">
                The notepad you{" "}
                <span className="bg-gradient-to-r from-neutral-400 to-neutral-300 bg-clip-text text-transparent">
                  actually wanted.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-neutral-500">
                Notepad++ speed meets modern design. No installs, no accounts, no waiting. Open a tab and start typing.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-8 text-[14px] font-semibold text-white transition-all hover:bg-neutral-700 hover:shadow-lg sm:w-auto"
                >
                  Start Writing
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-8 text-[14px] font-semibold text-neutral-700 dark:text-neutral-300 transition-all hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 sm:w-auto"
                >
                  <Github className="h-4 w-4" />
                  Star on GitHub
                </a>
              </div>
            </div>

            {/* Keyboard shortcuts */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-neutral-400">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] text-neutral-500">⌘T</kbd>
                New tab
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] text-neutral-500">⌘W</kbd>
                Close tab
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] text-neutral-500">⌘S</kbd>
                Save
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] text-neutral-500">⌘L</kbd>
                Toggle sidebar
              </span>
            </div>
          </div>
        </section>

        {/* Open Source */}
        <section className="border-t border-neutral-100 dark:border-neutral-800 px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Open Source</h2>
            <div className="mt-6 space-y-4 text-[15px] leading-[1.8] text-neutral-600 dark:text-neutral-400">
              <p>
                EDTR is free and open source software. The source code is available on GitHub. If you find a bug, want to request a feature, or want to contribute code, you are welcome to do so. The project is built with Next.js, React, TypeScript, and Tailwind CSS.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 items-center gap-2 rounded-lg bg-neutral-900 px-6 text-[13px] font-semibold text-white transition-all hover:bg-neutral-700"
              >
                <Github className="h-4 w-4" />
                View on GitHub
              </a>
            </div>

            <div className="mt-10 border-t border-neutral-100 dark:border-neutral-800 pt-8">
              <p className="mb-4 text-[13px] font-medium text-neutral-400 dark:text-neutral-500">Contributors</p>
              <div className="flex gap-3">
                {["0xymg"].map((username) => (
                  <a
                    key={username}
                    href={`https://github.com/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                    title={username}
                  >
                    <img
                      src={`https://github.com/${username}.png`}
                      alt={username}
                      className="h-9 w-9 rounded-full transition-transform group-hover:scale-110"
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
        <section className="border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How to use EDTR</h2>
            <div className="mt-6 space-y-4 text-[15px] leading-[1.8] text-neutral-600 dark:text-neutral-400">
              <p>
                Using EDTR is straightforward. Here is how to get started:
              </p>
              <ol className="list-decimal space-y-3 pl-5">
                <li><strong>Open the editor.</strong> Go to <Link href="/" className="text-neutral-900 underline underline-offset-2">edtr.cc</Link> in any modern browser. The editor loads instantly at the top of the page.</li>
                <li><strong>Start typing.</strong> You can begin writing immediately. Your content is saved automatically after every change.</li>
                <li><strong>Create multiple tabs.</strong> Press <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[12px] text-neutral-500">⌘T</kbd> (or <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[12px] text-neutral-500">Ctrl+T</kbd> on Windows) to open a new tab. You can work on multiple files at the same time.</li>
                <li><strong>Choose a language.</strong> Click the language selector in the bottom status bar to enable syntax highlighting for your code.</li>
                <li><strong>Open files from your computer.</strong> On Chrome and Edge, you can open files and folders directly from your file system. Changes are saved back to disk when you press <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[12px] text-neutral-500">⌘S</kbd>.</li>
                <li><strong>Install as an app.</strong> You can install EDTR as a Progressive Web App (PWA) from your browser. Once installed, it works offline and appears in your dock or taskbar like a native application.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-neutral-100 dark:border-neutral-800 px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">EDTR Notepad Features</h2>
            <div className="mt-6 space-y-6 text-[15px] leading-[1.8] text-neutral-600 dark:text-neutral-400">
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">A. Syntax Highlighting</h3>
                <p className="mt-1">EDTR highlights your code with proper colors as you type. It supports over 20 languages including JavaScript, TypeScript, Python, HTML, CSS, JSON, Go, Rust, C, C++, Java, PHP, Ruby, Swift, Kotlin, SQL, Bash, Markdown, YAML, and XML. You can select the language from the status bar at the bottom of the editor.</p>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">B. Multi-tab Editing</h3>
                <p className="mt-1">You can open multiple files in separate tabs, just like in Notepad++ or any desktop code editor. Each tab has its own content, language setting, and file name. Use <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[12px] text-neutral-500">⌘T</kbd> to create a new tab and <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[12px] text-neutral-500">⌘W</kbd> to close the current tab.</p>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">C. Automatic Saving</h3>
                <p className="mt-1">Your notes are saved automatically to your browser&apos;s LocalStorage after every change. You do not need to press a save button. If you close the browser and open EDTR again later, all your tabs and content will be restored exactly as you left them.</p>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">D. No Login Required</h3>
                <p className="mt-1">EDTR does not require you to create an account or log in. There are no user accounts, no email verification, and no passwords. You can start using the editor immediately without any sign-up process.</p>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">E. Open Files From Your Computer</h3>
                <p className="mt-1">On supported browsers (Chrome, Edge), you can open individual files or entire folders from your local file system using the File System Access API. You can edit these files in the browser and save your changes directly back to disk with <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[12px] text-neutral-500">⌘S</kbd>.</p>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">F. Works Offline as a PWA</h3>
                <p className="mt-1">EDTR can be installed as a Progressive Web App. Once installed, it works without an internet connection. You can also set it as the default app for opening text files on your operating system, so you can right-click a file and choose &quot;Open with EDTR&quot;.</p>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">G. Private and Secure</h3>
                <p className="mt-1">All your data is stored locally on your device. EDTR does not send your content to any server. There is no tracking, no analytics on your text, and no third-party access to your notes. Your files stay on your machine.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Keyboard Shortcuts Table */}
        <section className="border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Keyboard Shortcuts</h2>
            <p className="mt-3 text-[15px] leading-[1.8] text-neutral-600 dark:text-neutral-400">
              EDTR supports the following keyboard shortcuts for faster editing. On Windows and Linux, use Ctrl instead of ⌘.
            </p>
            <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50">
                    <th className="px-5 py-3 font-semibold text-neutral-700">Shortcut</th>
                    <th className="px-5 py-3 font-semibold text-neutral-700">Action</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-600">
                  {[
                    ["⌘T", "Open a new tab"],
                    ["⌘W", "Close the current tab"],
                    ["⌘S", "Save file"],
                    ["⌘⇧S", "Download file"],
                    ["⌘L", "Toggle sidebar"],
                    ["⌘/", "Toggle comment"],
                    ["⇧⌥F", "Format code (JSON)"],
                    ["Tab", "Insert indentation"],
                  ].map(([shortcut, action], i) => (
                    <tr key={i} className="border-b border-neutral-100 last:border-0">
                      <td className="px-5 py-3">
                        <kbd className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[12px] text-neutral-500">{shortcut}</kbd>
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
            <p className="mt-3 text-[15px] leading-[1.8] text-neutral-600 dark:text-neutral-400">
              EDTR includes syntax highlighting for the following programming and markup languages. The highlighting is powered by highlight.js and works as you type. You can select the language from the status bar at the bottom of the editor.
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
                  className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1 text-[13px] font-medium text-neutral-600"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Who can use */}
        <section className="border-t border-neutral-100 bg-neutral-50/50 px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Who Can Use EDTR?</h2>
            <div className="mt-6 space-y-4 text-[15px] leading-[1.8] text-neutral-600">
              <p>EDTR is useful for anyone who needs a quick, distraction-free text editor in the browser. Here are some common use cases:</p>
              <ul className="list-disc space-y-3 pl-5">
                <li><strong>Developers</strong> who need to quickly edit or review code snippets without opening a full IDE. EDTR works well for writing JavaScript, Python, HTML, CSS, JSON, and other languages with syntax highlighting.</li>
                <li><strong>Students</strong> who want to take notes, draft assignments, or organize study material in a simple text editor. Everything is saved locally so there is no risk of losing work.</li>
                <li><strong>Writers and bloggers</strong> who need a clean writing environment without formatting distractions. EDTR gives you plain text with no toolbars, no formatting buttons, and no unnecessary UI elements.</li>
                <li><strong>Researchers</strong> who need to collect notes, paste text from different sources, or keep track of ideas while browsing. You can create multiple tabs to organize your research by topic.</li>
                <li><strong>Anyone</strong> who needs a quick notepad while browsing the internet. Whether you want to save a phone number, draft a quick email, or write down a to-do list, EDTR is there when you need it.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-neutral-100 bg-neutral-50/50 px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Frequently Asked Questions</h2>

            <div className="mt-8 space-y-4">
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
                  a: "Your notes are stored in your browser's LocalStorage. This means they stay on your device and are never uploaded to any server. If you clear your browser's storage or cache, your notes will be deleted, so make sure to export important files.",
                },
                {
                  q: "Can I use EDTR offline?",
                  a: "Yes. You can install EDTR as a Progressive Web App (PWA) from your browser. Once installed, it works fully offline without needing an internet connection.",
                },
                {
                  q: "How is EDTR different from Notepad++?",
                  a: "Notepad++ is a desktop application that you download and install on Windows. EDTR is a browser-based editor inspired by Notepad++ that offers a similar experience with syntax highlighting, multi-tab editing, and fast performance. The difference is that EDTR runs in your browser on any operating system without needing to install anything.",
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
                  a: "EDTR is designed for desktop browsers but works on mobile devices as well. The editor is responsive and adapts to smaller screens, though the full experience is best on a desktop or laptop computer.",
                },
              ].map((faq, i) => (
                <details key={i} className="group border-b border-neutral-200 pb-4 last:border-0">
                  <summary className="flex cursor-pointer items-center justify-between py-2 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span className="ml-4 text-neutral-400 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 text-[14px] leading-[1.7] text-neutral-500">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="border-t border-neutral-100 px-6 py-10">
          <div className="mx-auto max-w-3xl">
            <p className="text-[12px] leading-[1.7] text-neutral-400">
              Disclaimer: EDTR stores your notes in your browser&apos;s LocalStorage. If you clear your browser&apos;s cache, cookies, or storage, your notes will be deleted. Please export important files to your local device regularly. EDTR is not affiliated with Notepad++ or any other text editor. EDTR.CC is an independent, open source project.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-100 px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-md bg-neutral-900">
              <img src="/icon.svg" alt="EDTR" className="h-full w-full object-cover" />
            </div>
            <span className="text-[13px] font-medium text-neutral-400">
              © {new Date().getFullYear()} EDTR.CC
            </span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-medium text-neutral-400 transition-colors hover:text-neutral-600"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}
