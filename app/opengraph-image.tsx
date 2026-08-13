import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import path from "node:path"

export const runtime = "nodejs"
export const alt = "EDTR+ | The notepad that's already open. Free online Notepad++ alternative."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
  const authorBold = await readFile(
    path.join(process.cwd(), "app", "fonts", "Author-Bold.woff")
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#1C1B18",
          fontFamily: "Author",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span style={{ fontSize: 56, fontWeight: 700, color: "#EDECE8", letterSpacing: "-0.02em" }}>
            EDTR
          </span>
          <span style={{ fontSize: 60, fontWeight: 700, color: "#F5A524", marginLeft: 5 }}>+</span>
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: "-0.04em",
            color: "#EDECE8",
            maxWidth: 900,
          }}
        >
          The notepad that&apos;s already open.
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 30,
            color: "rgba(237,236,232,0.55)",
          }}
        >
          Free forever · Nothing to install · Nothing to sign up for
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Author", data: authorBold, weight: 700, style: "normal" }],
    }
  )
}
