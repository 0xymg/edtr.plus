export interface JsonErrorLocation {
    offset: number
    line: number
    column: number
}

/**
 * Works out where a JSON.parse failure happened.
 *
 * Engines disagree on the message format, and none of them is guaranteed to
 * carry an offset:
 *   V8 (old):  Unexpected token o in JSON at position 21
 *   V8 (new):  Unexpected token 'o', ..."b": oops }" is not valid JSON
 *   Firefox:   JSON.parse: unexpected character at line 3 column 9 of the JSON data
 *   Safari:    JSON Parse error: Unexpected identifier "oops"
 *
 * So we try, in order: an explicit position, an explicit line/column, and
 * finally the snippet V8 quotes back to us — located in the source text.
 */
export function locateJsonError(content: string, error: unknown): JsonErrorLocation | null {
    const message = error instanceof Error ? error.message : String(error)

    const at = (offset: number): JsonErrorLocation => {
        const clamped = Math.max(0, Math.min(offset, content.length))
        let line = 1
        let lastBreak = -1
        for (let i = 0; i < clamped; i++) {
            if (content.charCodeAt(i) === 10) {
                line++
                lastBreak = i
            }
        }
        return { offset: clamped, line, column: clamped - lastBreak }
    }

    const position = /position (\d+)/.exec(message)
    if (position) return at(Number(position[1]))

    const lineCol = /line (\d+) column (\d+)/.exec(message)
    if (lineCol) {
        const targetLine = Number(lineCol[1])
        const column = Number(lineCol[2])
        let offset = 0
        for (let l = 1; l < targetLine; l++) {
            const next = content.indexOf("\n", offset)
            if (next === -1) break
            offset = next + 1
        }
        return at(offset + column - 1)
    }

    // V8 quotes a snippet of the document: ..."1, "b": oops }" is not valid JSON
    const snippet = /\.\.\.?"(.+)" is not valid JSON/.exec(message)
    if (snippet) {
        const found = content.indexOf(snippet[1])
        if (found !== -1) return at(found)
    }

    // Last resort: the token it choked on, if it is quoted and unambiguous
    const token = /Unexpected (?:token|identifier) ['"]?([^'"\s,]+)/.exec(message)
    if (token) {
        const found = content.indexOf(token[1])
        if (found !== -1) return at(found)
    }

    return null
}
