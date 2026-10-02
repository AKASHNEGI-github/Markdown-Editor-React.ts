/** Escape text for safe insertion into an HTML document. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Only allow http(s), mailto, and relative/anchor URLs through.
 * Blocks javascript:, data:, vbscript:, and other script-executing schemes.
 */
export function sanitizeUrl(url: string): string {
  // Browsers strip ASCII tab/newline/carriage-return characters from a URL
  // — including from the middle of it — before parsing its scheme (see the
  // WHATWG URL Standard's "basic URL parser"). A scheme check that skips
  // this step can be bypassed with an embedded tab, e.g. the literal text
  // "java\tscript:alert(1)": the regex below sees no recognizable scheme
  // and would otherwise let it through unchanged, but a browser still runs
  // it as javascript:. Normalize the same way before inspecting anything,
  // so what we validate is exactly what a browser would act on.
  const trimmed = url.trim().replace(/[\t\n\r]/g, "");
  // Relative paths, anchors, and protocol-relative are fine.
  if (/^(#|\/|\.\.?\/|\?)/.test(trimmed)) return trimmed;
  const schemeMatch = trimmed.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);
  if (!schemeMatch) return trimmed; // no scheme => treat as relative
  const scheme = schemeMatch[1].toLowerCase();
  if (scheme === "http" || scheme === "https" || scheme === "mailto") return trimmed;
  return "#"; // block anything else (javascript:, data:, vbscript:, etc.)
}

/** GitHub-style heading slug: lowercase, spaces -> hyphens, strip punctuation, dedupe. */
export function slugify(text: string, seen: Map<string, number>): string {
  let base = text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
  if (!base) base = "section";
  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count}`;
}

/** Plain-text content of a list of inline nodes (used for heading ids, alt text fallback). */
export function inlineToPlainText(nodes: { type: string; value?: string; children?: unknown[] }[]): string {
  let out = "";
  for (const node of nodes as any[]) {
    if (node.type === "text" || node.type === "inlineCode") out += node.value;
    else if (node.children) out += inlineToPlainText(node.children);
  }
  return out;
}
