import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPostBySlug, getAllPosts } from "@/lib/blog"
import { ArrowLeft, Github, BookOpen, Calendar, Clock, Share2 } from "lucide-react"

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
        openGraph: {
            title: post.metaTitle || post.title,
            description: post.metaDescription,
            type: "article",
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
                    </div>
                </div>
            </nav>

            <main className="flex-1">
                <article className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
                    <Link
                        href="/blog"
                        className="group mb-10 inline-flex items-center gap-2 text-[13px] font-medium text-neutral-400 transition-colors hover:text-neutral-900"
                    >
                        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                        Back to blog
                    </Link>

                    <header className="mb-12">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.15]">
                            {post.title}
                        </h1>

                        <div className="mt-8 flex flex-wrap items-center gap-y-4 gap-x-6 border-y border-neutral-100 py-6">
                            <div className="flex items-center gap-2 text-[13px] font-medium text-neutral-500">
                                <Calendar className="h-3.5 w-3.5" />
                                March 6, 2026
                            </div>
                            <div className="flex items-center gap-2 text-[13px] font-medium text-neutral-500">
                                <Clock className="h-3.5 w-3.5" />
                                {readTime} min read
                            </div>
                            <div className="flex items-center gap-2 text-[13px] font-medium text-neutral-500">
                                <Share2 className="h-3.5 w-3.5" />
                                Share
                            </div>
                        </div>
                    </header>

                    <div
                        className="prose prose-neutral max-w-none text-neutral-800"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    <div className="mt-16 flex flex-wrap gap-2 pt-8 border-t border-neutral-100">
                        {post.keywords.map((kw) => (
                            <span
                                key={kw}
                                className="rounded-lg bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-500"
                            >
                                {kw}
                            </span>
                        ))}
                    </div>
                </article>
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
                    <div className="flex gap-6">
                        <Link
                            href="/blog"
                            className="text-[13px] font-medium text-neutral-400 transition-colors hover:text-neutral-600"
                        >
                            Blog
                        </Link>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] font-medium text-neutral-400 transition-colors hover:text-neutral-600"
                        >
                            GitHub
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
