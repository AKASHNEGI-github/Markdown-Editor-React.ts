# Syntax reference ("our flavor")

This editor supports a practical subset of CommonMark + GFM (GitHub Flavored
Markdown), plus a small set of documented extensions. Anything not listed
here is intentionally unsupported — see [Not supported](#not-supported).

## Inline

| Feature | Syntax | Notes |
|---|---|---|
| Bold | `**bold**` or `__bold__` | |
| Italic | `*italic*` or `_italic_` | |
| Bold + italic | `***both***` | |
| Strikethrough | `~~strike~~` | GFM |
| Underline | `<u>text</u>` | Whitelisted HTML — see [HTML policy](#html-policy) |
| Subscript | `<sub>2</sub>` | e.g. `H<sub>2</sub>O` |
| Superscript | `<sup>2</sup>` | e.g. `x<sup>2</sup>` |
| Inline code | `` `code` `` | |
| Link | `[text](url)` or `[text](url "title")` | |
| Image | `![alt](url)` or `![alt](url "title")` | URL only, no upload |
| Autolink | `<https://example.com>` | |
| Escaping | `\*not italic\*` | Backslash escapes the next punctuation character |
| Hard line break | line ends with two+ spaces, or a trailing `\` | A single Enter with no trailing spaces is a soft break (renders as a space), same as GitHub READMEs |

## Block

| Feature | Syntax | Notes |
|---|---|---|
| Headings | `#` through `######` | ATX style only (no `===`/`---` underline headings). Auto-generates a GitHub-style anchor id. |
| Horizontal rule | `---`, `***`, or `___` | Must be alone on its line (with up to 3 leading spaces); no "spaced" variant like `- - -` |
| Paragraph | plain text | |
| Blockquote | `> text` | Every line of the quote needs its own `>` |
| Alert | `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]` as the first line of a blockquote | Matches GitHub's alert syntax exactly |
| Unordered list | `- item`, `* item`, or `+ item` | |
| Ordered list | `1. item` or `1) item` | Starting number is preserved |
| Checklist | `- [ ] todo` / `- [x] done` | GFM task list; nests inside any list |
| Nested lists | indent by 2+ spaces | |
| Table | pipe-delimited with a `---` delimiter row | Alignment: `:---` left, `:---:` center, `---:` right |
| Fenced code block | ` ```lang ` ... ` ``` ` (or `~~~`) | Optional `[Title]` after the language: ` ```js [app.js] ` |
| Tabbed code group | see below | Explicit `::: code-group` wrapper |
| Collapsible section (dropdown) | see below | `<details>`/`<summary>`, matching GitHub's syntax |

### Tabbed code groups

````
::: code-group
```js [JavaScript]
console.log("hi");
```
```python [Python]
print("hi")
```
:::
````

Renders as a single block with clickable tabs. The `[Title]` in each fence's
info string becomes the tab label (falls back to the language name). In a
renderer that doesn't understand `::: code-group`, each fenced block still
displays normally — nothing is lost.

### Alerts

```
> [!WARNING]
> This action cannot be undone.
```

The five types are `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, and `CAUTION`
(case-insensitive). There are no custom titles, matching GitHub's syntax
exactly. In a renderer without alert support, this still displays as an
ordinary blockquote with `[!WARNING]` as its first line.

### Collapsible sections (dropdowns)

```
<details>
<summary>Click to expand</summary>

Hidden content — any block markdown is allowed here, including lists,
tables, and fenced code.

</details>
```

Matches GitHub's collapsible-section syntax. Only the bare `<details>` /
`<details open>` and `<summary>...</summary>` forms are recognized — no
other attributes — consistent with the [HTML policy](#html-policy) below.
Add the `open` attribute (`<details open>`) to render it expanded by
default. If no `<summary>` line is given, the label defaults to "Details".
Sections can be nested.

## HTML policy

For security, **only `<u>`, `<sub>`, `<sup>`, and the block-level
`<details>`/`<summary>` pair are recognized as HTML**, and even those only
in their exact documented forms (no extra attributes beyond `<details
open>`). Every other tag — `<div>`, `<script>`, `<img>`, `<br>`, a
`<details>` with a `class` or other attribute, anything — is shown as
literal, escaped text rather than being rendered as an element. This is a
safe-by-construction design: there is no sanitizer trying to strip "bad"
HTML after the fact, because no other HTML is ever interpreted as HTML in
the first place.

Link and image URLs are restricted to `http:`, `https:`, `mailto:`, and
relative/anchor paths. A `javascript:` or `data:` URL is replaced with `#`.

## Not supported

These are deliberate omissions to keep the parser small, fast, and
predictable, and to avoid classic markdown ambiguities:

- **Setext headings** (`Title\n=====`) — use `# Title` instead. This also
  means `---` is never ambiguous with a heading underline.
- **Indented code blocks** (4-space indent) — use fenced blocks (` ``` `)
  instead. This removes a common source of nested-list parsing ambiguity.
- **Raw HTML** other than `<u>`, `<sub>`, `<sup>`, and `<details>`/`<summary>`
  — see [HTML policy](#html-policy).
- **Reference-style links** (`[text][ref]` + `[ref]: url`) — use inline
  links.
- **Footnotes, math (LaTeX), Mermaid diagrams, emoji shortcodes,
  highlight/mark** — not in v1. A `highlighter` prop lets a host app plug in
  richer code highlighting (e.g. Shiki) without changing this list.
- **Image uploads** — images are URL-only, matching plain markdown.

## Syntax highlighting languages

Built in, dependency-free tokenizers cover: JavaScript/JSX, TypeScript/TSX,
JSON, HTML/XML/SVG, CSS, C, C++, C#, Java, Go, Rust, PHP, Python, Bash/Shell,
SQL, YAML, Markdown, Diff, and Plain Text. Call `supportedLanguages()` for
the exact list of aliases (e.g. `js`, `ts`, `py`, `sh`, `cpp`). An unknown
language name renders as plain, uncolored text — it never errors.

For anything beyond this approximate, hand-written tokenizer, pass a
`highlighter` function to `MarkdownEditor` / `MarkdownViewer` that wraps a
library like Shiki. See `docs/API.md`.
