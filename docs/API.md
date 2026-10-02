# API reference

Two entry points:

- **`first-last-markdown-editor`** (`src/index.ts`) — React components plus the full core API. Use this in a React app.
- **`first-last-markdown-editor/core`** (`src/core/index.ts`) — parsing/rendering only, no React and no DOM. Safe in Node (SSR), server components, or a non-React app.

Install with `npm install first-last-markdown-editor`. The examples below import from the package name; `renderToReactElements` is exported from the main entry only (the `/core` entry has no React dependency).

## `<MarkdownEditor />`

```tsx
import { MarkdownEditor } from "first-last-markdown-editor";
import "first-last-markdown-editor/styles.css";

<MarkdownEditor defaultValue="# Hello" onChange={(md) => console.log(md)} />
```

### Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `string` | — | Controlled markdown value. Omit for uncontrolled use. |
| `defaultValue` | `string` | `""` | Initial value when uncontrolled. |
| `onChange` | `(value: string) => void` | — | |
| `mode` / `defaultMode` / `onModeChange` | `"edit" \| "split" \| "preview"` | `"split"` | |
| `fullscreen` / `defaultFullscreen` / `onFullscreenChange` | `boolean` | `false` | Fullscreen is a CSS overlay (`position: fixed`), not the browser Fullscreen API. |
| `toolbar` | `string[] \| false` | all buttons | Which formatting buttons show in the toolbar's first row, and in what order. `false` hides the entire toolbar (both rows). See button ids below. |
| `highlighter` | `(code: string, lang?: string) => Token[]` | built-in tokenizer | Plug in Shiki, highlight.js, etc. |
| `theme` / `defaultTheme` / `onThemeChange` | `"light" \| "dark" \| "auto"` | `"auto"` | `"auto"` follows `prefers-color-scheme`. The toolbar's built-in theme button toggles light/dark; pass `theme`+`onThemeChange` to control it yourself. |
| `placeholder` | `string` | — | |
| `readOnly` | `boolean` | `false` | |
| `disabled` | `boolean` | `false` | |
| `height` / `minHeight` | `string \| number` | `minHeight: "320px"` | Ignored while fullscreen. |
| `className` | `string` | — | |
| `labels` | `ToolbarLabels` | — | Override toolbar button `title`/tooltip text (for i18n). |
| `interactiveChecklists` | `boolean` | `false` | Let clicking a preview checkbox toggle the markdown. |
| `openExternalLinksInNewTab` | `boolean` | `true` | |
| `headingIds` | `boolean` | `true` | Auto-generate GitHub-style heading anchor ids. |
| `showTableTools` | `boolean` | `true` | Contextual add/remove row & column, alignment, and format controls when the cursor is inside a table. |
| `tabIndentation` | `boolean` | `true` | Tab/Shift+Tab indents list lines; otherwise Tab moves focus normally (so keyboard users are never trapped in a single-line, non-list context). |
| `autoContinueList` | `boolean` | `true` | Enter on a list line continues it with the same marker; Enter on an empty item exits the list. |
| `showThemeToggle` | `boolean` | `true` | Show the light/dark toggle button in the toolbar's second row. |
| `showResetButton` | `boolean` | `true` | Show a button that reverts content to the value the editor first mounted with (itself undoable via Ctrl+Z). |
| `showHtmlView` | `boolean` | `true` | Show a 4th view-mode button that displays `getHTML()`'s output as read-only text, in the same body area as the editor/preview (not a separate external panel). |
| `showDownloadButton` | `boolean` | `true` | Show a download icon in the toolbar's second row that prints the current preview (see "Download as PDF" below). |
| `showHelpButton` | `boolean` | `true` | Show a "?" button in the toolbar's second row that opens a quick markdown syntax reference. |
| `showLineNumbers` | `boolean` | `true` | Show a line-number gutter next to the markdown source, matching GitHub's file editor. This disables textarea soft-wrap (long lines scroll horizontally instead) so numbers stay aligned with their line; set to `false` to restore normal wrapping and hide the gutter. |
| `showEditorCopyButton` | `boolean` | `true` | Show a small copy-to-clipboard icon over the writing area, for copying the raw markdown source. |
| `onReset` | `() => void` | — | Called after the reset button (or `ref.reset()`) restores the original content. |

### Download as PDF

The download button calls the browser's own print dialog (`window.print()`)
against a dedicated, always-current render of the preview — not the pane
currently on screen, so it works correctly no matter which view mode is
active. Every browser's print dialog has a "Save as PDF" destination, which
is how this becomes a PDF download without bundling a PDF-generation
library (this package has zero runtime dependencies).

That render is portaled straight to `document.body` for the duration of the
print, rather than being mounted inside the editor's own DOM subtree. This
matters for a component meant to be embedded in an arbitrary host page: the
editor rarely sits as a direct child of `<body>`, so a print stylesheet that
only hides the editor's *own* siblings would leave whatever else the host
page renders around it — a page heading above, a footer below, other
components alongside — fully visible on the printed page too. Portaling the
print-only render to `document.body` and hiding everything else in the page
during print (rather than trying to hide just the editor's neighbors) is
what guarantees the printed output is only ever this editor's own content,
regardless of where or in what layout it's embedded. A `@media print`
stylesheet forces a plain light appearance (headings, tables, code, and
alerts keep their structure and syntax-highlighting colors, but never print
a dark background) regardless of the on-screen theme.

### Toolbar layout

The toolbar has two rows: the first is the scrollable row of formatting
buttons (governed by the `toolbar` prop and button ids below); the second
is a fixed row of editor-level controls — reset, download-as-PDF, the
markdown syntax guide, theme toggle, the four view-mode buttons (edit /
split / preview / **HTML source**), and fullscreen. This second row isn't
configurable by button id (it reflects editor state directly), but each
control can be hidden individually via `showThemeToggle`,
`showResetButton`, `showHtmlView`, `showDownloadButton`, `showHelpButton`,
`showModeControls`, and `showFullscreenControl` — the latter two are
documented above the table implicitly and default to `true`.

Heading level and code-block language are chosen from icon-triggered
dropdown menus (not native `<select>` elements), consistent with the
existing Table/Alert dropdowns — all of them are portaled popovers that
never get clipped by the toolbar's horizontal scroll.

### Toolbar button ids (row 1)

`undo redo heading bold italic underline strikethrough subscript superscript
inlineCode link image unorderedList orderedList checklist blockquote alert
details codeBlock codeGroup table horizontalRule`

### Ref (imperative handle)

```tsx
const ref = useRef<MarkdownEditorHandle>(null);
<MarkdownEditor ref={ref} ... />
ref.current?.getMarkdown();
ref.current?.getHTML();
ref.current?.focus();
ref.current?.undo();
ref.current?.redo();
ref.current?.setMode("preview"); // "edit" | "split" | "preview" | "html"
ref.current?.reset(); // same as clicking the toolbar's reset button
```

## `<MarkdownViewer />`

Read-only rendering, for content you don't need to edit (e.g. a saved post).

```tsx
import { MarkdownViewer } from "first-last-markdown-editor";
<MarkdownViewer value={markdown} />
```

Props: `value`, `highlighter`, `openExternalLinksInNewTab`, `headingIds`, `theme`, `className`.

## Core functions (`first-last-markdown-editor/core`)

```ts
import { parseMarkdown, renderToHtml, markdownToHtml } from "first-last-markdown-editor/core";

const doc = parseMarkdown(markdownString, { headingIds: true }); // -> DocumentNode (AST)
const html = renderToHtml(doc, { highlighter, openExternalLinksInNewTab }); // -> string
const html2 = markdownToHtml(markdownString); // parse + render in one call
```

- **`parseMarkdown(source, options?) -> DocumentNode`** — no DOM required; safe on the server.
- **`renderToHtml(doc, options?) -> string`** — self-contained HTML (no `<html>`/`<body>` wrapper). Includes a tiny inline `<script>` per code group for tab switching, so it still works outside React (e.g. emailed HTML, a static export). Safe by construction: only `u`/`sub`/`sup` pass through as real tags; everything else is escaped, and URLs are scheme-checked.
- **`markdownToHtml(source, parseOptions?, renderOptions?) -> string`** — convenience wrapper.
- **`renderToReactElements(doc, options?) -> ReactNode`** (from `first-last-markdown-editor`) — what `MarkdownEditor`'s preview and `MarkdownViewer` use internally. Prefer the components unless you need custom layout around the rendered output.
- **`supportedLanguages() -> { label, value }[]`** and **`isLanguageSupported(lang)`** — from the highlighter registry.

### AST shape

See `src/core/types.ts` for the full, commented type definitions (`DocumentNode`, `BlockNode`, `InlineNode`, and friends). Useful if you want to transform or lint content before rendering.

## Editor engine (exported from the main entry)

Pure functions for building your own toolbar or automations, independent of the bundled `<MarkdownEditor />` UI:

```ts
import { toggleBold, setHeadingLevel, insertTable } from "first-last-markdown-editor";

const next = toggleBold({ value: "hello", selection: { start: 0, end: 5 } });
// -> { value: "**hello**", selection: { start: 2, end: 7 } }
```

Every command is `(state: EditorState) => EditorState` where
`EditorState = { value: string; selection: { start: number; end: number } }` — a
pure transform, easy to test and compose. See `src/editor/commands.ts` for
the full list (headings, lists, checklist, blockquote, code block/group,
table, link/image, alert, collapsible section (`insertDetails`), horizontal
rule, indent/outdent, `continueList` for Enter-key list continuation).

Also exported: `HistoryStack` (undo/redo), `toggleCheckboxInMarkdown`
(flips the Nth checklist item in raw markdown — used for the preview's
interactive checkboxes), and the table helpers (`findTableAt`,
`addTableRow`, `addTableColumn`, `removeTableRow`, `removeTableColumn`,
`setTableColumnAlign`, `formatTable`).

## Highlighter plugin interface

```ts
type Highlighter = (code: string, lang: string | undefined) => Token[];
type Token = { type: TokenType; text: string };
```

Pass your own to `highlighter` on `MarkdownEditor`/`MarkdownViewer`/render
options to replace the built-in tokenizer (e.g. to wrap Shiki for exact,
grammar-based highlighting). Token `type` values map to `.mde-tok-*` CSS
classes in `styles.css` — restyle via the `--mde-tok-*` CSS variables rather
than forking the stylesheet.

## Theming

Everything is driven by `--mde-*` CSS custom properties on `.mde-root`
(colors, radii, fonts). Override them from your app's CSS — no need to edit
`styles.css`. See the variable list at the top of that file.

The editor's own chrome (toolbar active/pressed states, focus rings, the
table-size picker, the active code-group tab underline) is intentionally
monochrome — it uses `--mde-text`/`--mde-bg` rather than `--mde-accent`, so
there's no blue anywhere in the UI itself. `--mde-accent` is reserved for
rendered *content* that conventionally needs a distinct color — currently
just hyperlinks (`.mde-link`) in the preview — since desaturating links
would make them hard to recognize as clickable.
