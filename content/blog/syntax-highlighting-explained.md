# What Is Syntax Highlighting and Why Every Coder Needs It

**Meta Title:** What Is Syntax Highlighting? A Beginner's Guide | EDTR
**Meta Description:** Syntax highlighting colors your code so you can read it faster and catch mistakes sooner. Learn how it works and why every editor — including EDTR — uses it.
**Keywords:** syntax highlighting, code highlighting, code editor colors, programming colors, highlight js, javascript syntax highlight, python syntax highlight
**Slug:** syntax-highlighting-explained

---

Look at a wall of code in black-and-white. Now look at the same code with colors — keywords in purple, strings in green, comments in gray. Which one is easier to read?

You did not even need to think about it. That is what syntax highlighting does for you, every time you open a file in a real editor.

## What It Is

**Syntax highlighting** is the practice of coloring different parts of code based on what they mean. Keywords, variables, strings, numbers, comments, and operators each get their own color.

It is purely visual. The code runs the same whether it is highlighted or not. But for you — the human reading it — the difference is huge.

A small example. Plain text:

```
function greet(name) { return "Hello, " + name; }
```

With highlighting (in your head):

- `function` → purple (keyword)
- `greet` → blue (function name)
- `name` → black (variable)
- `return` → purple (keyword)
- `"Hello, "` → green (string)
- `+` → red (operator)

Your eye instantly groups things. You read by *shape*, not letter by letter.

## How It Actually Works

Syntax highlighting is **not magic**. The editor follows these steps:

1. **Tokenize** the code — break it into the smallest meaningful pieces (a keyword, a number, a string).
2. **Classify** each token — is this a keyword? A variable? A function call?
3. **Style** each class — apply a color (and sometimes a font weight or style) based on the classification.

This usually relies on grammar rules per language. The editor knows, for example, that `if` is a keyword in JavaScript but just a word in plain text.

EDTR uses **highlight.js** under the hood — a small, fast library that supports over 190 languages.

## Why It Matters

Highlighting is not just decoration. It changes how you work.

### 1. You Catch Mistakes Faster

Forgot to close a string? The rest of the line turns into the string color. You see the bug before you run the code.

Typoed a keyword? It does not get the keyword color. Instant visual alarm.

### 2. You Read Code Faster

Your brain processes color much faster than text. With highlighting, you can scan a 200-line file in seconds and find the function, the loop, or the variable you need.

### 3. You Stay Focused

Comments fade into a muted gray. Strings stand out. Keywords announce themselves. The structure of the code becomes obvious without you having to think about it.

### 4. You Switch Languages Without Friction

If you write Python in the morning and TypeScript in the afternoon, consistent highlighting helps your brain switch context. The colors give you a familiar landmark even when the syntax is different.

## What Highlighting Cannot Do

Some things look similar to highlighting but are not the same:

- **Linting** — finds actual errors (highlighting only classifies syntax)
- **Type checking** — verifies types match (highlighting does not understand types)
- **Auto-complete** — suggests code (highlighting only colors what you already typed)
- **Refactoring** — rewrites code safely (highlighting is read-only)

These are deeper features that some editors layer on top. Highlighting is the foundation.

## A Quick Tour of Common Color Roles

Most editors follow rough conventions. Once you know them, every editor feels familiar:

- **Keywords** (`if`, `return`, `function`) — usually purple or blue
- **Strings** (`"hello"`) — usually green or orange
- **Numbers** (`42`, `3.14`) — usually orange or red
- **Comments** (`// note`) — always muted (gray or italic)
- **Functions** — usually blue
- **Types and classes** — usually teal or yellow
- **Errors** — almost always red

Themes change the specific colors, but the **roles** stay consistent. That is why a "dark" theme from one editor feels like a "dark" theme in another.

## EDTR's Highlighting Support

EDTR has syntax highlighting for 20+ languages out of the box, including:

JavaScript, TypeScript, Python, HTML, CSS, JSON, Markdown, Bash, SQL, Java, C, C++, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, YAML, and XML.

To switch a tab's language:

1. Open or create a tab
2. Click the language selector in the bottom status bar
3. Pick a language

The highlighting updates instantly as you type — no save, no reload.

## When You Do Not Need It

Plain text is fine for plain text. Notes, to-do lists, draft emails, and freeform writing usually look better without highlighting. EDTR defaults new tabs to **plaintext** for this reason.

Use highlighting when:

- You are writing or reading code
- You are debugging a config file
- You are writing Markdown (so the headings stand out)
- You are reviewing JSON or YAML structure

Otherwise, leave it off. Less is more.

## A Tiny Experiment

Open [edtr.plus](https://edtr.plus), paste any code snippet you have lying around, and try switching between **plaintext** and the actual language. Notice how your eyes work harder on the plain version.

That difference — that is what highlighting does for you, every minute of every coding day.

---

*Code is communication. Colors make it readable.*
