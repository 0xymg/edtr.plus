"use client"

import React from "react"
import dynamic from "next/dynamic"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkSupersub from "remark-supersub"
import remarkMath from "remark-math"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import "github-markdown-css/github-markdown.css"
import "katex/dist/katex.min.css"
import "highlight.js/styles/github.css"

// Diagram renderers are huge (mermaid ~2MB, abcjs, vega) — load each only
// when a document actually contains that block type.
const Mermaid = dynamic(() => import("../mermaid").then(m => m.Mermaid), { ssr: false })
const AbcNotation = dynamic(() => import("../abc-notation").then(m => m.AbcNotation), { ssr: false })
const VegaChart = dynamic(() => import("../vega-chart").then(m => m.VegaChart), { ssr: false })

interface PreviewPaneProps {
    language: string
    content: string
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({ language, content }) => {
    return (
        <div className="flex-1 overflow-auto h-full border-l border-border bg-card/10">
            <div className="p-8 max-w-4xl mx-auto h-full flex flex-col">
                {language === "markdown" ? (
                    <article className="markdown-body !bg-transparent !text-foreground transition-all duration-200">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath, remarkSupersub]}
                            rehypePlugins={[rehypeHighlight, rehypeKatex]}
                            components={{
                                code({ node, inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || '')
                                    if (!inline && match && match[1] === 'mermaid') {
                                        return <Mermaid chart={String(children).replace(/\n$/, '')} />
                                    }
                                    if (!inline && match && match[1] === 'abc') {
                                        return <AbcNotation notation={String(children).replace(/\n$/, '')} />
                                    }
                                    if (!inline && match && (match[1] === 'vega' || match[1] === 'vega-lite')) {
                                        return <VegaChart specString={String(children).replace(/\n$/, '')} />
                                    }
                                    return (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </article>
                ) : language === "svg" ? (
                    <div
                        className="flex-1 flex items-center justify-center p-4 bg-white/5 rounded-lg border border-border/50 shadow-inner overflow-auto"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                ) : null}
            </div>
        </div>
    )
}
