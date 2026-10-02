import { useState } from "react";
import { MarkdownEditor, MarkdownViewer } from "../src/react/index";
import "../src/react/styles.css";

const SAMPLE = `# Markdown Editor Demo

This editor supports **bold**, *italic*, ***both***, ~~strikethrough~~, <u>underline</u>, inline \`code\`, X<sup>2</sup> and H<sub>2</sub>O.

## Alerts

> [!NOTE]
> This is a note alert.

> [!TIP]
> This is a tip alert.

> [!WARNING]
> This is a warning alert.

## Lists

- Bulleted item
- Another item
  - Nested item

1. First
2. Second
3. Third

- [ ] Todo item
- [x] Done item

## Links and images

[Anthropic](https://www.anthropic.com "Anthropic homepage")

## Table

| Feature | Status |
| ------- | :----: |
| Bold | Done |
| Tables | Done |

## Collapsible section

<details>
<summary>Click to expand</summary>

Hidden content can include **formatting**, lists, and even code:

\`\`\`js
console.log("still just markdown");
\`\`\`

</details>

## Code

\`\`\`js
function greet(name) {
  // says hello
  return \`Hello, \${name}!\`;
}
console.log(greet("world"));
\`\`\`

::: code-group
\`\`\`js [JavaScript]
console.log("hi");
\`\`\`
\`\`\`python [Python]
print("hi")
\`\`\`
\`\`\`bash [Shell]
echo "hi"
\`\`\`
:::

---

Try the toolbar's second row: reset, theme, view mode (including the new
HTML-source view), and fullscreen are all built into the editor itself now.

Try opening the **Table**, **Alert**, or **Dropdown (<details>)** toolbar
buttons too — popovers now always match the editor's current theme, even if
you toggle light/dark while one is open, and never get clipped or create a
stray scrollbar.

Notice the line numbers next to this text, the copy icon above the writing
area, the download icon (prints the preview — "Save as PDF" from there
works in every browser), and the **?** guide in the toolbar's second row.
`;

export function App() {
  const [value, setValue] = useState(SAMPLE);

  return (
    <div className="demo-shell">
      <h1>Markdown Editor</h1>
      <MarkdownEditor value={value} onChange={setValue} interactiveChecklists height="600px" />

      <h1>Markdown Viewer (read-only)</h1>
      <MarkdownViewer value={value} />
    </div>
  );
}
