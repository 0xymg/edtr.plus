"use client"

import { useEffect } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { toast } from "sonner"
import { Github, X } from "lucide-react"

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
          EDTR+
        </div>
      </div>
      <div className="h-9 shrink-0 border-b border-border bg-card/30" />
      <div className="flex-1" />
      <div className="h-7 shrink-0 border-t border-border bg-card/50" />
    </div>
  ),
})

const ink = "text-[#1C1B18] dark:text-[#EDECE8]"
const muted = "text-[#1C1B18]/60 dark:text-[#EDECE8]/60"
const faint = "text-[#1C1B18]/45 dark:text-[#EDECE8]/45"
const hairline = "border-[rgba(55,53,47,0.1)] dark:border-white/10"
const display = "font-[family-name:var(--font-hanken)] font-bold tracking-[-0.03em]"

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className={`rounded-sm border ${hairline} bg-[#F7F7F5] dark:bg-white/5 px-1.5 py-0.5 font-mono text-[11px] ${muted}`}>
      {children}
    </kbd>
  )
}

function scrollToEditor() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

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
    <div className={`bg-white dark:bg-[#161512] ${ink}`}>
      {/* Editor */}
      <section className="h-screen w-full shrink-0 overflow-hidden bg-background">
        <Notepad />
      </section>

      {/* Nav */}
      <nav className={`sticky top-0 z-50 border-b ${hairline} bg-white/85 dark:bg-[#161512]/85 backdrop-blur-xl`}>
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className={`${display} text-lg`}>
            EDTR<span className={faint}>+</span>
          </Link>
          <div className={`hidden md:flex items-center gap-7 text-sm ${muted}`}>
            <a href="#features" className="hover:text-[#1C1B18] dark:hover:text-[#EDECE8] transition-colors">Features</a>
            <a href="#how" className="hover:text-[#1C1B18] dark:hover:text-[#EDECE8] transition-colors">How it works</a>
            <a href="#comparison" className="hover:text-[#1C1B18] dark:hover:text-[#EDECE8] transition-colors">Comparison</a>
            <a href="#faq" className="hover:text-[#1C1B18] dark:hover:text-[#EDECE8] transition-colors">FAQ</a>
            <a href="https://github.com/0xymg/edtrcc" target="_blank" rel="noopener noreferrer" className="hover:text-[#1C1B18] dark:hover:text-[#EDECE8] transition-colors">Source</a>
          </div>
          <button
            onClick={scrollToEditor}
            className="bg-[#1C1B18] dark:bg-[#EDECE8] px-5 py-2 text-sm font-semibold text-white dark:text-[#1C1B18] hover:bg-[#1C1B18]/80 dark:hover:bg-white transition-colors"
          >
            Open editor →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pb-16 pt-20 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className={`${display} text-[clamp(2.75rem,7vw,4.5rem)] leading-[1.02] tracking-[-0.04em]`}>
            The notepad that&apos;s already open.
          </h1>
          <p className={`mx-auto mt-7 max-w-[52ch] text-lg leading-relaxed ${muted}`}>
            A free Notepad++ alternative in your browser. Tabs, syntax highlighting for 20+ languages,
            find &amp; replace, real file access. No download, no license, no account.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={scrollToEditor}
              className="bg-[#1C1B18] dark:bg-[#EDECE8] px-8 py-3.5 text-base font-semibold text-white dark:text-[#1C1B18] hover:bg-[#1C1B18]/80 dark:hover:bg-white transition-colors"
            >
              Start typing →
            </button>
            <a
              href="#features"
              className={`border border-[rgba(55,53,47,0.2)] dark:border-white/20 px-8 py-3.5 text-base font-medium ${muted} hover:border-[rgba(55,53,47,0.45)] dark:hover:border-white/45 transition-colors`}
            >
              See features
            </a>
          </div>
          <p className={`mt-6 text-sm ${faint}`}>
            Free forever · Nothing to install · Nothing to sign up for
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
          <span>Autosave on every keystroke</span>
        </div>
      </section>

      {/* Keyboard-first */}
      <section id="shortcuts" className="scroll-mt-16 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className={`${display} text-[clamp(2rem,4.5vw,3rem)] leading-[1.05]`}>
            No menus to hunt through. Just shortcuts.
          </h2>
          <p className={`mt-6 text-[17px] leading-relaxed ${muted}`}>
            Everything in EDTR+ is a couple of keystrokes away, and none of them fight your browser.{" "}
            <Kbd>Alt+N</Kbd> opens a tab, <Kbd>Alt+X</Kbd> closes it, <Kbd>⌘S</Kbd> saves straight to
            disk. On macOS, <Kbd>Alt</Kbd> is <Kbd>⌥ Option</Kbd>.
          </p>
          <p className={`mt-4 text-[17px] leading-relaxed ${muted}`}>
            This is the real reason editing here is faster than opening a desktop app. Not because the
            page loads quicker, though it does. Because the distance between wanting a new scratch file
            and having one is two keys.
          </p>

          <div className={`mt-10 grid grid-cols-1 sm:grid-cols-2 border-t ${hairline}`}>
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
          <button onClick={scrollToEditor} className={`mt-8 text-[15px] font-medium underline underline-offset-4 ${ink} hover:opacity-70 transition-opacity`}>
            Try it, press Alt+N in the editor →
          </button>
        </div>
      </section>

      {/* Speed / why */}
      <section className={`border-t ${hairline} px-6 py-24`}>
        <div className="mx-auto max-w-3xl">
          <h2 className={`${display} text-[clamp(2rem,4.5vw,3rem)] leading-[1.05]`}>
            You wanted to jot one thing down. That shouldn&apos;t cost you a launch screen.
          </h2>
          <p className={`mt-6 text-[17px] leading-relaxed ${muted}`}>
            You know the sequence. Open the editor and wait for it to load, dismiss the update prompt,
            close yesterday&apos;s workspace. Or paste into a cloud doc, sign into the right account,
            wait for the file list.
          </p>
          <p className={`mt-4 text-[17px] leading-relaxed ${muted}`}>
            EDTR+ skips all of it. You&apos;re already in the editor — it&apos;s the first thing on this
            page. Type, save or download, close the tab. The whole thing takes as long as the typing does.
          </p>
          <p className={`mt-4 text-[17px] leading-relaxed ${ink}`}>
            It&apos;s the part of a code editor most people actually use: tabs, highlighting, find &amp;
            replace, save. With none of the part they don&apos;t.
          </p>
          <button
            onClick={scrollToEditor}
            className="mt-9 bg-[#1C1B18] dark:bg-[#EDECE8] px-8 py-3.5 text-base font-semibold text-white dark:text-[#1C1B18] hover:bg-[#1C1B18]/80 dark:hover:bg-white transition-colors"
          >
            Open the editor →
          </button>
        </div>
      </section>

      {/* Comparison */}
      <section id="comparison" className={`scroll-mt-16 border-t ${hairline} px-6 py-24`}>
        <div className="mx-auto max-w-4xl">
          <p className={`text-sm font-medium ${faint}`}>Where it fits</p>
          <h2 className={`${display} mt-2 text-[clamp(2rem,4.5vw,3rem)] leading-[1.05]`}>
            Where EDTR+ sits.
          </h2>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className={`border-b ${hairline}`}>
                  <th className="w-[36%] px-4 py-3" />
                  <th className={`bg-[#F7F7F5] dark:bg-white/5 px-4 py-3 text-left font-semibold ${ink}`}>EDTR+</th>
                  <th className={`px-4 py-3 text-left font-medium ${muted}`}>Notepad++</th>
                  <th className={`px-4 py-3 text-left font-medium ${muted}`}>Cloud editors</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Install needed", "No", "Yes", "No"],
                  ["Account needed", "No", "No", "Usually yes"],
                  ["Runs on Mac / Linux / phone", "Yes", "Windows only", "Yes"],
                  ["Where your file lives", "Your device", "Your device", "A server"],
                  ["Ready to type in", "~1 second", "After install", "After sign-in"],
                  ["Tabs, syntax, find & replace", "Yes", "Yes", "Varies"],
                  ["Price", "Free", "Free", "Mixed"],
                ].map(([label, edtr, npp, cloud]) => (
                  <tr key={label} className={`border-b ${hairline} last:border-0`}>
                    <td className={`px-4 py-3.5 font-medium ${ink}`}>{label}</td>
                    <td className={`bg-[#F7F7F5] dark:bg-white/5 px-4 py-3.5 font-medium ${ink}`}>{edtr}</td>
                    <td className={`px-4 py-3.5 ${muted}`}>{npp}</td>
                    <td className={`px-4 py-3.5 ${muted}`}>{cloud}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`mt-5 text-[13px] ${faint}`}>
            EDTR+ is an independent open-source project and is not affiliated with Notepad++.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={`scroll-mt-16 border-t ${hairline} px-6 py-24`}>
        <div className="mx-auto max-w-3xl">
          <h2 className={`${display} text-[clamp(2rem,4.5vw,3rem)] leading-[1.05]`}>
            Everything you&apos;d expect. Nothing you have to learn.
          </h2>

          <div className="mt-12 space-y-10">
            {[
              {
                title: "Syntax highlighting for 20+ languages",
                body: (
                  <>
                    JavaScript, TypeScript, Python, Go, Rust, C, C++, Java, HTML, CSS, JSON, SQL, Bash
                    and more. Pick the language from the status bar, or open a file and let the
                    extension decide.
                  </>
                ),
              },
              {
                title: "A real multi-tab workspace",
                body: (
                  <>
                    Keep as many documents open as you like. <Kbd>Alt+N</Kbd> for a new tab,{" "}
                    <Kbd>Alt+X</Kbd> to close one. Find &amp; replace works across the document,
                    with regex when you want it.
                  </>
                ),
              },
              {
                title: "Opens what you already have",
                body: (
                  <>
                    On Chrome and Edge, open files straight from your file system and save back with{" "}
                    <Kbd>⌘S</Kbd> — the File System Access API, no upload step, no conversion queue.
                    Everywhere else, download works with one shortcut.
                  </>
                ),
              },
              {
                title: "Markdown & SVG preview, built in",
                body: (
                  <>
                    Open a <code className="font-mono text-[13px]">.md</code> or{" "}
                    <code className="font-mono text-[13px]">.svg</code> file and a live preview appears
                    alongside the editor. No plugin, no setting.
                  </>
                ),
              },
            ].map((f) => (
              <div key={f.title}>
                <h3 className={`${display} text-xl tracking-[-0.02em]`}>{f.title}</h3>
                <p className={`mt-2 text-[16px] leading-relaxed ${muted}`}>{f.body}</p>
              </div>
            ))}
          </div>

          <p className={`mt-12 text-sm ${faint}`}>
            Also in there:{" "}
            <span className={muted}>
              word wrap · dark mode · unlimited undo and redo · autosave on every keystroke, so
              there&apos;s no save button to remember
            </span>
          </p>
        </div>
      </section>

      {/* Privacy */}
      <section id="privacy" className={`scroll-mt-16 border-t ${hairline} px-6 py-24`}>
        <div className="mx-auto max-w-3xl">
          <h2 className={`${display} text-[clamp(2rem,4.5vw,3rem)] leading-[1.05]`}>
            Your text stays in your browser.
          </h2>
          <p className={`mt-6 text-[17px] leading-relaxed ${muted}`}>
            There&apos;s no upload and no copy on our servers. What you type is written to your
            browser&apos;s local storage on this device, and it&apos;s still there when you come back
            to the tab.
          </p>
          <p className={`mt-4 text-[17px] leading-relaxed ${muted}`}>
            We can&apos;t read your notes, because we never receive them. Nothing is scanned, nothing
            is used for training, nothing is sold. The source is on GitHub if you&apos;d rather verify
            than trust.
          </p>
        </div>
      </section>

      {/* How */}
      <section id="how" className={`scroll-mt-16 border-t ${hairline} px-6 py-24`}>
        <div className="mx-auto max-w-3xl">
          <h2 className={`${display} text-[clamp(2rem,4.5vw,3rem)] leading-[1.05]`}>
            Three steps, and the first one already happened.
          </h2>
          <div className={`mt-10 grid grid-cols-1 gap-px sm:grid-cols-3 border ${hairline} bg-[rgba(55,53,47,0.1)] dark:bg-white/10`}>
            {[
              {
                n: "1",
                title: "Open",
                body: "You're on the page, so the editor is loaded. Scroll up and the cursor is yours.",
              },
              {
                n: "2",
                title: "Write",
                body: "Type. Open tabs, pick a language, find & replace. Everything saves as you go.",
              },
              {
                n: "3",
                title: "Save or download",
                body: "⌘S saves straight to disk on Chrome and Edge. ⌘⇧S downloads a copy anywhere.",
              },
            ].map((step) => (
              <div key={step.n} className="bg-white dark:bg-[#161512] p-6">
                <span className={`${display} text-3xl ${faint}`}>{step.n}</span>
                <h3 className={`${display} mt-3 text-lg tracking-[-0.02em]`}>{step.title}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${muted}`}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What people open it for */}
      <section className={`border-t ${hairline} px-6 py-24`}>
        <div className="mx-auto max-w-3xl">
          <h2 className={`${display} text-[clamp(2rem,4.5vw,3rem)] leading-[1.05]`}>
            What people open it for
          </h2>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {[
              "A quick note before the thought escapes",
              "A config file someone pasted in chat",
              "Cleaning up a JSON blob",
              "A code snippet that needs highlighting",
              "A Markdown file with a live preview",
              "Editing a file on a computer that isn't yours",
              "A scratch pad that survives closing the tab",
            ].map((use) => (
              <li
                key={use}
                className={`border ${hairline} bg-[#F7F7F5] dark:bg-white/5 px-4 py-2 text-sm ${muted}`}
              >
                {use}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Notepad++ gap */}
      <section className={`border-t ${hairline} px-6 py-24`}>
        <div className="mx-auto max-w-3xl">
          <h2 className={`${display} text-[clamp(2rem,4.5vw,3rem)] leading-[1.05]`}>
            Looking for Notepad++ on a Mac?
          </h2>
          <p className={`mt-6 text-[17px] leading-relaxed ${muted}`}>
            Notepad++ has been the fast, no-nonsense text editor for over twenty years — on Windows.
            There&apos;s no official Mac or Linux build, which leaves an awkward gap, because TextEdit
            can&apos;t highlight code and a full IDE is overkill for a config file.
          </p>
          <p className={`mt-4 text-[17px] leading-relaxed ${muted}`}>
            EDTR+ covers what Notepad++ does day to day: tabs, syntax highlighting, find &amp; replace,
            fast startup. It runs in a browser tab instead of an installed window, so it also works on
            a Mac, a Chromebook, a phone, or a computer you don&apos;t have permission to install
            software on.
          </p>
          <button onClick={scrollToEditor} className={`mt-8 text-[15px] font-medium underline underline-offset-4 ${ink} hover:opacity-70 transition-opacity`}>
            Open the editor →
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={`scroll-mt-16 border-t ${hairline} px-6 py-24`}>
        <div className="mx-auto max-w-3xl">
          <h2 className={`${display} text-[clamp(2rem,4.5vw,3rem)] leading-[1.05]`}>
            Questions worth answering
          </h2>

          <div className="mt-8">
            {[
              {
                q: "Is EDTR+ free to use?",
                a: "Yes. No ads, no sign-up, no premium tier, no trial clock. It's open source under an MIT license.",
              },
              {
                q: "If I close the tab, do I lose my work?",
                a: "No. Every keystroke is written to your browser's local storage. Come back to the tab and it's still there.",
              },
              {
                q: "Do I need an account?",
                a: "No. There's nothing to sign up for — the editor at the top of this page is the whole product.",
              },
              {
                q: "Where does my writing go?",
                a: "Nowhere. It stays in your browser's local storage on this device. Nothing is uploaded, scanned, or used for training.",
              },
              {
                q: "Can I open and save real files?",
                a: "Yes. On Chrome, Edge and Opera, the File System Access API lets you open files from disk and save back with ⌘S. On other browsers, you can download with ⌘⇧S.",
              },
              {
                q: "How is EDTR+ different from Notepad++?",
                a: "Notepad++ is a desktop app for Windows. EDTR+ runs in the browser on any OS, with no install. Same idea: fast, tabs, syntax highlighting.",
              },
              {
                q: "Which languages have syntax highlighting?",
                a: "JavaScript, TypeScript, Python, Go, Rust, C, C++, C#, Java, Kotlin, Swift, Ruby, PHP, HTML, CSS, JSON, YAML, Markdown, SQL, Bash, and more.",
              },
              {
                q: "Which browsers work?",
                a: "Current versions of Chrome, Edge, Firefox, Safari and other Chromium-based browsers. For the best local-file experience, use one with File System Access API support (Chrome, Edge, Opera).",
              },
            ].map((faq, i) => (
              <details key={i} className={`group border-t ${hairline} last:border-b`} open={i === 0}>
                <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 py-5 ${display} text-lg tracking-[-0.02em] [&::-webkit-details-marker]:hidden`}>
                  {faq.q}
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center font-mono text-base ${faint} transition-transform group-open:rotate-45`}>
                    +
                  </span>
                </summary>
                <p className={`max-w-[64ch] pb-6 pr-8 text-[15px] leading-relaxed ${muted}`}>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={`border-t ${hairline} px-6 py-24`}>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className={`${display} text-[clamp(2rem,5vw,3.25rem)] leading-[1.05]`}>
            Nothing to install. Nothing to sign. Just type.
          </h2>
          <button
            onClick={scrollToEditor}
            className="mt-9 bg-[#1C1B18] dark:bg-[#EDECE8] px-8 py-3.5 text-base font-semibold text-white dark:text-[#1C1B18] hover:bg-[#1C1B18]/80 dark:hover:bg-white transition-colors"
          >
            Start typing →
          </button>
          <p className={`mt-6 text-sm ${faint}`}>
            Free forever · Ready in about a second · Your text stays on your device
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${hairline} px-6 py-12`}>
        <div className="mx-auto max-w-5xl">
          <div className={`grid grid-cols-2 gap-8 sm:grid-cols-3 text-sm ${muted}`}>
            <div>
              <h4 className={`${display} text-sm mb-3 ${ink}`}>EDTR<span className={faint}>+</span></h4>
              <ul className="space-y-2">
                <li><a href="https://edtr.plus/" className="hover:text-[#1C1B18] dark:hover:text-[#EDECE8] transition-colors">edtr.plus</a></li>
                <li><Link href="/blog" className="hover:text-[#1C1B18] dark:hover:text-[#EDECE8] transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className={`${display} text-sm mb-3 ${ink}`}>Project</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://github.com/0xymg/edtrcc" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#1C1B18] dark:hover:text-[#EDECE8] transition-colors">
                    <Github className="h-3.5 w-3.5" /> Source
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h4 className={`${display} text-sm mb-3 ${ink}`}>Legal</h4>
              <ul className="space-y-2">
                <li><a href="/privacy" className="hover:text-[#1C1B18] dark:hover:text-[#EDECE8] transition-colors">Privacy</a></li>
                <li><a href="/terms" className="hover:text-[#1C1B18] dark:hover:text-[#EDECE8] transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className={`mt-10 flex flex-col justify-between gap-2 border-t ${hairline} pt-6 text-[13px] sm:flex-row ${faint}`}>
            <span>© {new Date().getFullYear()} EDTR+</span>
            <span>Not affiliated with Notepad++ · Independent open-source project</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
