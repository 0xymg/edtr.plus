import type { Metadata } from "next"
import Link from "next/link"
import { getAllPosts } from "@/lib/blog"
import { ArrowRight, Github, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog - Tips for Writing, Coding & Productivity",
  description:
    "Read about text editors, PWAs, coding tips, privacy-first tools, and productivity. Learn how to write and code better with EDTR.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "EDTR Blog - Tips for Writing, Coding & Productivity",
    description:
      "Read about text editors, PWAs, coding tips, privacy-first tools, and productivity.",
    url: "/blog",
  },
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-neutral-900">
              <img src="/icon.svg" alt="EDTR" className="h-full w-full object-cover" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">EDTR</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-neutral-900 transition-colors hover:bg-neutral-100"
            >
              <BookOpen className="h-4 w-4" />
              Blog
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-1.5 text-[13px] font-semibold text-white transition-all hover:bg-neutral-700"
            >
              Open EDTR
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Header */}
        <section className="px-6 pt-16 pb-12 lg:pt-20 lg:pb-16">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">
              Tips about text editors, coding, PWAs, privacy, and productivity.
            </p>
          </div>
        </section>

        {/* Posts */}
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-3xl">
            <div className="space-y-1">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-xl px-0 py-5 transition-colors border-b border-neutral-100 last:border-0"
                >
                  <h2 className="text-[17px] font-semibold tracking-tight group-hover:text-neutral-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-neutral-500 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.keywords.slice(0, 3).map((kw) => (
                      <span
                        key={kw}
                        className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
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
              &copy; {new Date().getFullYear()} EDTR.CC
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
