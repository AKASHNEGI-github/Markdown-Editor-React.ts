<<<<<<< HEAD
const CHECKBOX_LINE_RE = /^(\s*(?:[-*+]|\d+[.)])\s+)\[( |x|X)\](\s+.*)?$/;
=======
// Matches a task-list line, optionally nested in blockquotes / alerts ("> - [ ] x").
const CHECKBOX_LINE_RE = /^((?:\s*>)*\s*(?:[-*+]|\d+[.)])\s+)\[( |x|X)\](\s+.*)?$/;
const FENCE_OPEN_RE = /^(`{3,}|~{3,})/;

/** Removes leading blockquote markers and indentation so fences inside quotes are detected. */
function stripQuotePrefix(line: string): string {
  return line.replace(/^(?:\s*>)*\s*/, "");
}
>>>>>>> c24d699 (updated the project)

/**
 * Flips the checked state of the `index`-th checklist item found in `source`,
 * scanning top-to-bottom. This matches the parser's document (depth-first)
 * order because nested list lines always appear, indented, before the next
 * sibling line in the raw text.
<<<<<<< HEAD
=======
 *
 * Lines inside fenced code blocks (``` or ~~~) are ignored: they render as
 * code, not as checkboxes, so counting them would shift every later index.
>>>>>>> c24d699 (updated the project)
 */
export function toggleCheckboxInMarkdown(source: string, index: number, checked?: boolean): string {
  const lines = source.split("\n");
  let count = 0;
<<<<<<< HEAD
  for (let i = 0; i < lines.length; i++) {
=======
  let fence: { char: string; len: number } | null = null;
  for (let i = 0; i < lines.length; i++) {
    const bare = stripQuotePrefix(lines[i]);
    if (fence) {
      const close = bare.match(FENCE_OPEN_RE);
      if (close && close[1][0] === fence.char && close[1].length >= fence.len && bare.slice(close[1].length).trim() === "") {
        fence = null;
      }
      continue;
    }
    const open = bare.match(FENCE_OPEN_RE);
    if (open) {
      fence = { char: open[1][0], len: open[1].length };
      continue;
    }
>>>>>>> c24d699 (updated the project)
    const m = lines[i].match(CHECKBOX_LINE_RE);
    if (!m) continue;
    if (count === index) {
      const current = m[2].toLowerCase() === "x";
      const next = checked ?? !current;
      lines[i] = `${m[1]}[${next ? "x" : " "}]${m[3] ?? ""}`;
      break;
    }
    count++;
  }
  return lines.join("\n");
}
