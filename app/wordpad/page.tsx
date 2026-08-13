import type { Metadata } from "next"
import { HugerteEditor } from "@/components/wordpad/hugerte-editor"

export const metadata: Metadata = {
    title: "Free Online WordPad, a Rich Text Editor in Your Browser",
    description:
        "A free WordPad replacement in your browser. Rich text formatting, no download, no account. Your document stays on your device.",
    alternates: {
        canonical: "/wordpad",
    },
    openGraph: {
        title: "Free Online WordPad, a Rich Text Editor in Your Browser",
        description:
            "A free WordPad replacement in your browser. Rich text formatting, no download, no account.",
        url: "/wordpad",
    },
}

export default function WordpadPage() {
    return (
        <main className="fixed inset-0 bg-background">
            <HugerteEditor />
        </main>
    )
}
