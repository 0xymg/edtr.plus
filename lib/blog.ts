import fs from "fs"
import path from "path"

export interface BlogPost {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  content: string
  excerpt: string
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

function parseMeta(raw: string): {
  title: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  slug: string
  body: string
} {
  const lines = raw.split("\n")
  let title = ""
  let metaTitle = ""
  let metaDescription = ""
  let keywords: string[] = []
  let slug = ""
  let bodyStartIndex = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (line.startsWith("# ") && !title) {
      title = line.replace(/^#\s+/, "")
    } else if (line.startsWith("**Meta Title:**")) {
      metaTitle = line.replace("**Meta Title:**", "").trim()
    } else if (line.startsWith("**Meta Description:**")) {
      metaDescription = line.replace("**Meta Description:**", "").trim()
    } else if (line.startsWith("**Keywords:**")) {
      keywords = line
        .replace("**Keywords:**", "")
        .trim()
        .split(",")
        .map((k) => k.trim())
    } else if (line.startsWith("**Slug:**")) {
      slug = line.replace("**Slug:**", "").trim()
    } else if (line === "---") {
      bodyStartIndex = i + 1
      break
    }
  }

  const body = lines.slice(bodyStartIndex).join("\n").trim()

  return { title, metaTitle, metaDescription, keywords, slug, body }
}

function mdToHtml(md: string): string {
  let html = md

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3 class="mt-8 mb-3 text-lg font-semibold text-neutral-900">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="mt-10 mb-4 text-xl font-bold text-neutral-900">$1</h2>')

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-neutral-900">$1</strong>')

  // Inline code
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[13px] text-neutral-600">$1</code>'
  )

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-neutral-900 underline underline-offset-2 hover:text-neutral-600">$1</a>'
  )

  // Tables
  html = html.replace(/^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)+)/gm, (_match, header: string, _sep: string, body: string) => {
    const headers = header.split("|").filter((c: string) => c.trim()).map((c: string) => c.trim())
    const rows = body.trim().split("\n").map((r: string) => r.split("|").filter((c: string) => c.trim()).map((c: string) => c.trim()))

    const th = headers.map((h: string) => `<th class="px-4 py-2.5 text-left text-[13px] font-semibold text-neutral-700">${h}</th>`).join("")
    const tr = rows.map((row: string[]) => {
      const td = row.map((c: string) => `<td class="px-4 py-2.5 text-[13px] text-neutral-600">${c}</td>`).join("")
      return `<tr class="border-b border-neutral-100 last:border-0">${td}</tr>`
    }).join("")

    return `<div class="my-6 overflow-hidden rounded-xl border border-neutral-200"><table class="w-full"><thead><tr class="border-b border-neutral-100 bg-neutral-50">${th}</tr></thead><tbody>${tr}</tbody></table></div>`
  })

  // Unordered lists
  html = html.replace(
    /^- (.+)$/gm,
    '<li class="ml-5 list-disc text-neutral-600">$1</li>'
  )
  html = html.replace(
    /((?:<li class="ml-5 list-disc[^>]*>.*<\/li>\n?)+)/g,
    '<ul class="my-4 space-y-1.5">$1</ul>'
  )

  // Ordered lists
  html = html.replace(
    /^\d+\. (.+)$/gm,
    '<li class="ml-5 list-decimal text-neutral-600">$1</li>'
  )
  html = html.replace(
    /((?:<li class="ml-5 list-decimal[^>]*>.*<\/li>\n?)+)/g,
    '<ol class="my-4 space-y-1.5">$1</ol>'
  )

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="my-8 border-neutral-200" />')

  // Italics
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>")

  // Paragraphs: wrap remaining lines
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ""
      if (trimmed.startsWith("<")) return trimmed
      return `<p class="my-4 text-[15px] leading-[1.8] text-neutral-600">${trimmed.replace(/\n/g, " ")}</p>`
    })
    .join("\n")

  return html
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8")
    const { title, metaTitle, metaDescription, keywords, slug, body } = parseMeta(raw)
    const content = mdToHtml(body)

    // First paragraph as excerpt
    const excerptMatch = body.match(/^[A-Z].+/m)
    const excerpt = excerptMatch ? excerptMatch[0].slice(0, 160) + "..." : metaDescription

    return {
      slug: slug || file.replace(".md", ""),
      title,
      metaTitle,
      metaDescription,
      keywords,
      content,
      excerpt,
    }
  })
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}
