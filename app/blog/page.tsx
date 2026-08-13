import type { Metadata } from "next"
import Link from "next/link"
import { getAllPosts } from "@/lib/blog"
import { ArrowRight, Github, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog - Tips for Writing, Coding & Productivity",
  description:
    "Read about text editors, coding tips, privacy-first tools, and productivity. Learn how to write and code better with EDTR.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "EDTR Blog - Tips for Writing, Coding & Productivity",
    description:
      "Read about text editors, coding tips, privacy-first tools, and productivity.",
    url: "/blog",
  },
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-[15px] font-semibold tracking-tight">EDTR<span className="text-[#F5A524]">+</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-neutral-900 dark:text-neutral-100 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              <BookOpen className="h-4 w-4" />
              Blog
            </Link>
            <a
              href="https://github.com/0xymg/edtr.plus"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-neutral-500 dark:text-neutral-400 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg bg-neutral-900 dark:bg-white px-4 py-1.5 text-[13px] font-semibold text-white dark:text-neutral-900 transition-all hover:bg-neutral-700 dark:hover:bg-neutral-200"
            >
              Open EDTR
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Header */}
        <section className="relative overflow-hidden px-6 pt-20 pb-12 lg:pt-24 lg:pb-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(circle_at_1px_1px,_rgb(0_0_0/0.06)_1px,_transparent_0)] dark:[background-image:radial-gradient(circle_at_1px_1px,_rgb(255_255_255/0.06)_1px,_transparent_0)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,_black_30%,_transparent_75%)]"
          />
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 px-3 py-1 text-[12px] font-medium text-neutral-600 dark:text-neutral-400 backdrop-blur-sm">
              <BookOpen className="h-3.5 w-3.5" />
              {posts.length} posts
            </div>
            <h1 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-tight">
              Blog
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">
              Tips about text editors, coding, privacy, and productivity.
            </p>
          </div>
        </section>

        {/* Posts */}
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-3xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-6 transition-all hover:-translate-y-0.5 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-lg hover:shadow-neutral-200/40 dark:hover:shadow-black/30"
                >
                  <h2 className="text-[16px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-2 flex-1 text-[13.5px] leading-[1.6] text-neutral-600 dark:text-neutral-400 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {post.keywords.slice(0, 3).map((kw) => (
                      <span
                        key={kw}
                        className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:text-neutral-400"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
                    Read post
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-100 dark:border-neutral-800 px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400">
            &copy; {new Date().getFullYear()} EDTR+
          </span>
          <a
            href="https://github.com/0xymg/edtr.plus"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}
