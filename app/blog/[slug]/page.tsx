import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPostBySlug, getAllPosts } from "@/lib/blog"
import { ArrowLeft, Github, BookOpen, Clock } from "lucide-react"

interface Props {
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const post = getPostBySlug(slug)

    if (!post) {
        return {
            title: "Post Not Found",
        }
    }

    return {
        title: post.metaTitle || post.title,
        description: post.metaDescription,
        keywords: post.keywords,
        alternates: {
            canonical: `/blog/${post.slug}`,
        },
        openGraph: {
            title: post.metaTitle || post.title,
            description: post.metaDescription,
            type: "article",
            url: `/blog/${post.slug}`,
        },
    }
}

export function generateStaticParams() {
    const posts = getAllPosts()
    return posts.map((post) => ({
        slug: post.slug,
    }))
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params
    const post = getPostBySlug(slug)

    if (!post) {
        notFound()
    }

    // Calculate read time (rough estimate)
    const wordCount = post.content.split(/\s+/).length
    const readTime = Math.ceil(wordCount / 200)

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://edtr.plus"
    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.metaDescription,
        url: `${siteUrl}/blog/${post.slug}`,
        author: { "@type": "Organization", name: "EDTR+", url: siteUrl },
        publisher: { "@type": "Organization", name: "EDTR+", url: siteUrl },
    }

    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            {/* Navigation */}
            <nav className="sticky top-0 z-50 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2.5">
                        <span className="text-[15px] font-semibold tracking-tight">EDTR+</span>
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
                            href="https://github.com/0xymg/edtrcc"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-neutral-500 dark:text-neutral-400 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-100"
                        >
                            <Github className="h-4 w-4" />
                            GitHub
                        </a>
                    </div>
                </div>
            </nav>

            <main className="flex-1">
                <article className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
                    <Link
                        href="/blog"
                        className="group mb-10 inline-flex items-center gap-2 text-[13px] font-medium text-neutral-500 dark:text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
                    >
                        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                        Back to blog
                    </Link>

                    <header className="mb-12">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.15]">
                            {post.title}
                        </h1>

                        <div className="mt-8 flex flex-wrap items-center gap-y-4 gap-x-6 border-y border-neutral-100 dark:border-neutral-800 py-6">
                            <div className="flex items-center gap-2 text-[13px] font-medium text-neutral-500 dark:text-neutral-400">
                                <Clock className="h-3.5 w-3.5" />
                                {readTime} min read
                            </div>
                            {post.keywords.length > 0 && (
                                <div className="flex items-center gap-2 text-[13px] font-medium text-neutral-500 dark:text-neutral-400">
                                    <BookOpen className="h-3.5 w-3.5" />
                                    {post.keywords[0]}
                                </div>
                            )}
                        </div>
                    </header>

                    <div
                        className="prose prose-neutral dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <div className="mt-16 flex flex-wrap gap-2 pt-8 border-t border-neutral-100 dark:border-neutral-800">
                        {post.keywords.map((kw) => (
                            <span
                                key={kw}
                                className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-1 text-[12px] font-medium text-neutral-600 dark:text-neutral-400"
                            >
                                {kw}
                            </span>
                        ))}
                    </div>

                    <div className="mt-12 flex justify-between border-t border-neutral-100 dark:border-neutral-800 pt-8">
                        <Link
                            href="/blog"
                            className="group inline-flex items-center gap-2 text-[13px] font-medium text-neutral-500 dark:text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                            All posts
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 dark:bg-white px-4 py-2 text-[13px] font-semibold text-white dark:text-neutral-900 transition-all hover:bg-neutral-700 dark:hover:bg-neutral-200"
                        >
                            Open EDTR
                        </Link>
                    </div>
                </article>
            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-100 dark:border-neutral-800 px-6 py-8">
                <div className="mx-auto flex max-w-6xl items-center justify-between">
                    <span className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400">
                        &copy; {new Date().getFullYear()} EDTR+
                    </span>
                    <div className="flex gap-6">
                        <Link
                            href="/blog"
                            className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
                        >
                            Blog
                        </Link>
                        <a
                            href="https://github.com/0xymg/edtrcc"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
                        >
                            GitHub
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
