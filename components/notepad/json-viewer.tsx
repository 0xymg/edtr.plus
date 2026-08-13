"use client"

import React from "react"
import { ChevronDown, ChevronRight, Copy, Check, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface JsonViewerProps {
    content: string
    /** Jump the editor to a document offset (used for parse errors). */
    onRevealOffset?: (offset: number) => void
}

/**
 * Nodes deeper than this start collapsed. A 5MB API dump would otherwise
 * mount tens of thousands of rows on the first paint; collapsed branches
 * render nothing until they are opened.
 */
const AUTO_EXPAND_DEPTH = 2
/** Children rendered per branch before a "show more" step. */
const CHUNK = 100

type Json = null | boolean | number | string | Json[] | { [k: string]: Json }

function valueClass(v: Json): string {
    if (v === null) return "text-[var(--syn-comment)]"
    switch (typeof v) {
        case "string": return "text-[var(--syn-string)]"
        case "number": return "text-[var(--syn-number)]"
        case "boolean": return "text-[var(--syn-keyword)]"
        default: return ""
    }
}

function preview(v: Json): string {
    if (Array.isArray(v)) return `[] ${v.length} ${v.length === 1 ? "item" : "items"}`
    if (v && typeof v === "object") {
        const n = Object.keys(v).length
        return `{} ${n} ${n === 1 ? "key" : "keys"}`
    }
    return ""
}

const Row: React.FC<{
    label?: string
    value: Json
    depth: number
    isLast: boolean
}> = ({ label, value, depth, isLast }) => {
    const isBranch = value !== null && typeof value === "object"
    const [open, setOpen] = React.useState(depth < AUTO_EXPAND_DEPTH)
    const [limit, setLimit] = React.useState(CHUNK)

    const entries = React.useMemo(() => {
        if (!isBranch) return []
        return Array.isArray(value)
            ? value.map((v, i) => [String(i), v] as [string, Json])
            : Object.entries(value as Record<string, Json>)
    }, [isBranch, value])

    const indent = { paddingLeft: depth * 14 }

    if (!isBranch) {
        return (
            <div className="flex items-start gap-1.5 py-[1px] font-mono text-[12px]" style={indent}>
                <span className="w-3.5 shrink-0" />
                {label !== undefined && (
                    <span className="shrink-0 text-[var(--syn-property)]">{label}:</span>
                )}
                <span className={cn("break-all", valueClass(value))}>
                    {typeof value === "string" ? `"${value}"` : String(value)}
                </span>
                {!isLast && <span className="text-muted-foreground">,</span>}
            </div>
        )
    }

    const bracket = Array.isArray(value) ? ["[", "]"] : ["{", "}"]

    return (
        <div>
            <div
                className="flex cursor-pointer items-start gap-1.5 rounded-sm py-[1px] font-mono text-[12px] hover:bg-accent/50"
                style={indent}
                onClick={() => setOpen(o => !o)}
            >
                <span className="mt-[3px] shrink-0 text-muted-foreground">
                    {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </span>
                {label !== undefined && (
                    <span className="shrink-0 text-[var(--syn-property)]">{label}:</span>
                )}
                <span className="text-muted-foreground">
                    {open ? bracket[0] : preview(value)}
                </span>
            </div>

            {open && (
                <>
                    {entries.slice(0, limit).map(([k, v], i) => (
                        <Row
                            key={k}
                            label={Array.isArray(value) ? undefined : k}
                            value={v}
                            depth={depth + 1}
                            isLast={i === entries.length - 1}
                        />
                    ))}
                    {entries.length > limit && (
                        <button
                            onClick={() => setLimit(l => l + CHUNK)}
                            className="ml-1 rounded-sm px-2 py-0.5 font-mono text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground"
                            style={{ marginLeft: (depth + 1) * 14 }}
                        >
                            Show {Math.min(CHUNK, entries.length - limit)} more of {entries.length}…
                        </button>
                    )}
                    <div className="py-[1px] font-mono text-[12px] text-muted-foreground" style={indent}>
                        <span className="ml-[14px]">{bracket[1]}{!isLast && ","}</span>
                    </div>
                </>
            )}
        </div>
    )
}

/**
 * Turns the "Unexpected token … at position N" message browsers give us into
 * a line/column pair, so an invalid document can be pointed at instead of
 * just rejected.
 */
function parseErrorLocation(content: string, message: string) {
    const match = /position (\d+)/.exec(message)
    if (!match) return null
    const offset = Math.min(Number(match[1]), content.length)
    let line = 1
    let lastBreak = -1
    for (let i = 0; i < offset; i++) {
        if (content.charCodeAt(i) === 10) {
            line++
            lastBreak = i
        }
    }
    return { offset, line, column: offset - lastBreak }
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ content, onRevealOffset }) => {
    const [copied, setCopied] = React.useState(false)

    const parsed = React.useMemo(() => {
        const trimmed = content.trim()
        if (!trimmed) return { ok: true as const, value: null as Json, empty: true }
        try {
            return { ok: true as const, value: JSON.parse(trimmed) as Json, empty: false }
        } catch (e) {
            const message = e instanceof Error ? e.message : "Invalid JSON"
            return { ok: false as const, message, location: parseErrorLocation(content, message) }
        }
    }, [content])

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(content)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch {
            /* clipboard blocked — nothing useful to do */
        }
    }

    if (!parsed.ok) {
        return (
            <div className="flex h-full flex-col border-l border-border bg-card/10">
                <div className="flex items-center gap-2 border-b border-border px-3 py-1.5 text-xs text-muted-foreground">
                    <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                    <span>Invalid JSON</span>
                </div>
                <div className="flex-1 overflow-auto p-4">
                    <p className="font-mono text-[12px] leading-relaxed text-destructive">{parsed.message}</p>
                    {parsed.location && (
                        <button
                            onClick={() => onRevealOffset?.(parsed.location!.offset)}
                            className="mt-3 rounded-sm border border-border px-2 py-1 font-mono text-[11px] text-foreground transition-colors hover:bg-accent"
                        >
                            Go to line {parsed.location.line}, column {parsed.location.column} →
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-full flex-col border-l border-border bg-card/10">
            <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-1.5 text-xs text-muted-foreground">
                <span>JSON viewer</span>
                <button
                    onClick={copy}
                    className="flex items-center gap-1 rounded-sm px-1.5 py-0.5 transition-colors hover:bg-accent hover:text-foreground"
                    aria-label="Copy JSON"
                >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
            <div className="flex-1 overflow-auto p-3">
                {parsed.empty ? (
                    <p className="text-xs text-muted-foreground">Nothing to show yet.</p>
                ) : (
                    <Row value={parsed.value} depth={0} isLast />
                )}
            </div>
        </div>
    )
}
