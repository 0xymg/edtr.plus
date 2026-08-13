// App shortcuts must never collide with what the OS or browser already owns.
//
// - macOS: bare Option+letter TYPES characters (Option+N = "˜" dead key), and
//   ⌘⌥+letter hits browser menu shortcuts (⌘⌥B = Chrome's Bookmark Manager,
//   ⌘⌥L = Downloads). Control+Option (⌃⌥) is unused by the system and types
//   nothing, so app commands live there.
// - Windows/Linux: plain Alt+letter is safe for the letters we use, while
//   Ctrl+Alt is AltGr on many layouts (incl. Turkish) and would swallow
//   character input — so Alt stays.
export const isMacPlatform = () =>
  typeof navigator !== "undefined" &&
  /Mac|iP(hone|ad|od)/i.test(navigator.platform || navigator.userAgent)

/** True when the event carries this app's command modifier (⌃⌥ on macOS, Alt elsewhere). */
export const hasAppModifier = (e: Pick<KeyboardEvent, "altKey" | "ctrlKey" | "metaKey">) =>
  isMacPlatform()
    ? e.ctrlKey && e.altKey && !e.metaKey
    : e.altKey && !e.ctrlKey && !e.metaKey

/** Human-readable label for the app command modifier. */
export const appModLabel = () => (isMacPlatform() ? "⌃⌥" : "Alt")
