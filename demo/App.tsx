<<<<<<< HEAD
=======
// import { useState } from "react";
// import { MarkdownEditor, MarkdownViewer } from "../src/react/index";
// import "../src/react/styles.css";

// const SAMPLE = `# Markdown Editor Demo

// This editor supports **bold**, *italic*, ***both***, ~~strikethrough~~, <u>underline</u>, inline \`code\`, X<sup>2</sup> and H<sub>2</sub>O.

// ## Alerts

// > [!NOTE]
// > This is a note alert.

// > [!TIP]
// > This is a tip alert.

// > [!WARNING]
// > This is a warning alert.

// ## Lists

// - Bulleted item
// - Another item
//   - Nested item

// 1. First
// 2. Second
// 3. Third

// - [ ] Todo item
// - [x] Done item

// ## Links and images

// [Anthropic](https://www.anthropic.com "Anthropic homepage")

// ## Table

// | Feature | Status |
// | ------- | :----: |
// | Bold | Done |
// | Tables | Done |

// ## Collapsible section

// <details>
// <summary>Click to expand</summary>

// Hidden content can include **formatting**, lists, and even code:

// \`\`\`js
// console.log("still just markdown");
// \`\`\`

// </details>

// ## Code

// \`\`\`js
// function greet(name) {
//   // says hello
//   return \`Hello, \${name}!\`;
// }
// console.log(greet("world"));
// \`\`\`

// ::: code-group
// \`\`\`js [JavaScript]
// console.log("hi");
// \`\`\`
// \`\`\`python [Python]
// print("hi")
// \`\`\`
// \`\`\`bash [Shell]
// echo "hi"
// \`\`\`
// :::

// ---

// Try the toolbar's second row: reset, theme, view mode (including the new
// HTML-source view), and fullscreen are all built into the editor itself now.

// Try opening the **Table**, **Alert**, or **Dropdown (<details>)** toolbar
// buttons too — popovers now always match the editor's current theme, even if
// you toggle light/dark while one is open, and never get clipped or create a
// stray scrollbar.

// Notice the line numbers next to this text, the copy icon above the writing
// area, the download icon (prints the preview — "Save as PDF" from there
// works in every browser), and the **?** guide in the toolbar's second row.
// `;

// export function App() {
//   const [value, setValue] = useState(SAMPLE);

//   return (
//     <div className="demo-shell">
//       <h1>Markdown Editor</h1>
//       <MarkdownEditor value={value} onChange={setValue} interactiveChecklists height="600px" />

//       <h1>Markdown Viewer (read-only)</h1>
//       <MarkdownViewer value={value} />
//     </div>
//   );
// }



>>>>>>> c24d699 (updated the project)
import { useState } from "react";
import { MarkdownEditor, MarkdownViewer } from "../src/react/index";
import "../src/react/styles.css";

<<<<<<< HEAD
const SAMPLE = `# Markdown Editor Demo

This editor supports **bold**, *italic*, ***both***, ~~strikethrough~~, <u>underline</u>, inline \`code\`, X<sup>2</sup> and H<sub>2</sub>O.
=======
const SAMPLE = `# Markdown Editor: Feature Test

This document exercises every feature the editor supports: inline formatting, headings, alerts, blockquotes, lists, task lists, tables, syntax highlighting, code groups, collapsible sections, and security edge cases. Task-list checkboxes in the preview are clickable, so try them.

---

## Inline Formatting

Here is a sentence with **bold text**, _italic text_, ***bold italic***, ~~strikethrough~~, <u>underline</u>, and \`inline code\`. Chemistry and math work too: H<sub>2</sub>O, CO<sub>2</sub>, E = mc<sup>2</sup>, x<sup>n+1</sup>.

Formatting can be nested: **bold with _italic_ inside**, _italic with **bold** inside_, and **a ~~struck~~ word in bold**. Inline code can contain backticks when fenced by doubles: \`\` const s = \`template\`; \`\`.

Escaping: \\*not italic\\*, \\_not italic either\\_, \\# not a heading, and \\[not a link\\](nope).

A hard line break using a trailing backslash:\\
this text starts on a new line, without starting a new paragraph.

### Links and Images

- Inline link: [Visit GitHub](https://github.com) opens in a new tab.
- Link with a title: [Anthropic](https://www.anthropic.com "Anthropic homepage"), hover to see it.
- Autolink: <https://example.com/docs?page=1&sort=asc>
- Email: [Send mail](mailto:hello@example.com)
- Relative link: [API docs](./docs/API.md)
- Anchor link: [Jump to Tables](#tables)

![Markdown editor screenshot](https://raw.githubusercontent.com/AKASHNEGI-github/Markdown-Editor-React.ts/main/image.png "Editor screenshot")

---

## Headings

Headings 1 and 2 are used for this document's structure. Levels 3 to 6 follow:

### Heading level 3

#### Heading level 4

##### Heading level 5

###### Heading level 6

### A heading with \`code\`, **bold**, and a [link](https://example.com)

---
>>>>>>> c24d699 (updated the project)

## Alerts

> [!NOTE]
<<<<<<< HEAD
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
=======
> This is a **note** alert. It supports inline \`code\`, **bold**, and _italic_ text inside.

> [!TIP]
> Use \`npm run dev\` to start the development server. Tip alerts are great for shortcuts and best practices.

> [!IMPORTANT]
> Always commit your \`.env.example\` file but **never** commit your actual \`.env\`. This is important for security.

> [!WARNING]
> Calling this API without authentication will hit the **60 requests/hour** rate limit very quickly.

> [!CAUTION]
> Running \`DROP TABLE users;\` is irreversible. Make sure you have a backup before proceeding.

### Alert with rich content

> [!TIP]
> Alerts can hold more than one paragraph, plus lists and code:
>
> 1. Install the package: \`npm install akash-negi-markdown-editor\`
> 2. Import the stylesheet once in your entry file
> 3. Render the component
>
> \`\`\`tsx
> import { MarkdownEditor } from "akash-negi-markdown-editor";
> import "akash-negi-markdown-editor/styles.css";
> \`\`\`
>
> See the [API docs](./docs/API.md) for every prop.

---

## Blockquotes

> "Programs must be written for people to read, and only incidentally for machines to execute."
>
> — Harold Abelson and Gerald Jay Sussman, *Structure and Interpretation of Computer Programs*

### Nested blockquotes

> Level one: the outer quote.
>
> > Level two: a reply nested inside.
> >
> > > Level three: and one more level down.
>
> Back at level one.

### Quote containing a list and code

> Shopping list:
>
> - Apples
> - Bread
>   - Sourdough
>   - Rye
>
> And a command to remember:
>
> \`\`\`bash
> echo "buy milk"
> \`\`\`

---

## Lists

### Ordered

1. Install dependencies with \`npm install\`
2. Copy \`.env.example\` to \`.env\` and fill in your values
3. Run database migrations: \`npm run migrate\`
4. Start the development server: \`npm run dev\`
5. Open \`http://localhost:5173\` in your browser

### Ordered, starting at 5

5. Fifth
6. Sixth
7. Seventh

### Ordered with a closing parenthesis

1) First
2) Second
3) Third

### Unordered

- **React**: UI library for building component trees
- **Vite**: Lightning-fast bundler and dev server
  - HMR (Hot Module Replacement) out of the box
  - Native ESM support
- **Zustand**: Minimal state management
- **Marked**: Fast markdown parser

### Deeply nested, mixed ordered and unordered

- Frontend
  1. Components
     - \`Navbar.tsx\`: top navigation bar
     - \`Sidebar.tsx\`: collapsible file tree
     - \`Viewer.tsx\`: content renderer
  2. Utilities
     - \`markdown.ts\`: parsing pipeline
     - \`api.ts\`: network calls
- Backend (future)
  - Auth
    1. OAuth login
    2. Session refresh
  - Storage

### Loose list (blank lines between items)

- First item, with space around it

- Second item, also with space around it

- Third item

### List items with several blocks

1. **Create the project**

   Run the scaffold command, then open the folder:

   \`\`\`bash
   npm create vite@latest my-app -- --template react-ts
   cd my-app
   \`\`\`

2. **Install the editor**

   \`\`\`bash
   npm install akash-negi-markdown-editor
   \`\`\`

3. **Use it**

   Import the component and the stylesheet, then render \`<MarkdownEditor />\`.

---

## Task Lists

### Basic

- [x] Set up project structure
- [x] Implement markdown parser
- [x] Add syntax highlighting
- [x] GitHub-style alerts
- [x] Code tabs with \`::: code-group\`
- [ ] Search inside the editor
- [ ] Export to PDF without the print dialog
- [ ] Mobile toolbar polish

### Nested, with formatting

- [ ] Release **v0.2**
  - [x] Fix checklist toggling in the viewer
  - [x] Make the stylesheet resilient to global CSS
  - [ ] Write the _changelog_
    - [ ] Draft notes in \`CHANGELOG.md\`
    - [ ] Review with a [teammate](https://example.com)
- [x] Publish to npm

### Inside a blockquote

> - [ ] A task inside a quote
> - [x] A finished task inside a quote
>   - [ ] A nested task inside a quote

### Checklist next to a code fence

The line in the fence below looks like a task but is code. It must not become a checkbox, and ticking the boxes around it must still toggle the right items.

- [ ] Task before the fence

\`\`\`md
- [ ] I am inside a code fence, not a checkbox
- [x] Me neither
\`\`\`

- [ ] Task after the fence
- [x] Another task after the fence

---

## Tables

### HTTP Status Codes

| Code | Name                  | Meaning                                    |
|------|-----------------------|--------------------------------------------|
| 200  | OK                    | Request succeeded                          |
| 201  | Created               | Resource created successfully              |
| 301  | Moved Permanently     | Resource has a new permanent URL           |
| 400  | Bad Request           | Server cannot process the request          |
| 401  | Unauthorized          | Authentication is required                 |
| 403  | Forbidden             | Server refuses to authorize the request    |
| 404  | Not Found             | Resource does not exist                    |
| 500  | Internal Server Error | Server encountered an unexpected condition |

### Column alignment

| Left aligned | Centered | Right aligned |
|:-------------|:--------:|--------------:|
| apples       |    3     |         $1.20 |
| watermelons  |    12    |        $34.50 |
| figs         |    150   |     $1,024.00 |

### Inline formatting in cells

| Syntax          | Example                    | Notes                        |
|-----------------|----------------------------|------------------------------|
| Bold            | **important**              | Use for key terms            |
| Italic          | _emphasis_                 | Use sparingly                |
| Code            | \`npm run build\`            | Monospaced                   |
| Link            | [GitHub](https://github.com) | Opens in a new tab         |
| Strikethrough   | ~~obsolete~~               | GFM extension                |
| Escaped pipe    | a \\| b                     | A literal pipe in a cell     |

### Wide table (horizontal scroll test)

| ID | Name | Email | Role | Department | Location | Start date | Manager | Status | Notes |
|----|------|-------|------|------------|----------|------------|---------|--------|-------|
| 1  | Ada Lovelace | ada@example.com | Engineer | Research | London | 2021-03-01 | Charles Babbage | Active | Writes the first program |
| 2  | Grace Hopper | grace@example.com | Admiral | Compilers | Arlington | 2020-07-15 | Howard Aiken | Active | Coined the term "debugging" |
| 3  | Alan Turing | alan@example.com | Mathematician | Cryptanalysis | Bletchley Park | 2019-09-01 | Alastair Denniston | Retired | Proposed the Turing test |

---

## Syntax Highlighting

**TypeScript**

\`\`\`ts
interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
}

async function fetchUser(id: number): Promise<User> {
  const res = await fetch(\`/api/users/\${id}\`)
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
  return res.json() as Promise<User>
}
\`\`\`

**Python**

\`\`\`python
from dataclasses import dataclass
from typing import Optional
import httpx

@dataclass
class User:
    id: int
    name: str
    email: str

async def fetch_user(user_id: int) -> Optional[User]:
    async with httpx.AsyncClient() as client:
        r = await client.get(f"/api/users/{user_id}")
        r.raise_for_status()
        return User(**r.json())
\`\`\`

**Bash**

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

PROJECT=\${1:?usage: deploy.sh owner/repo [branch]}
BRANCH=\${2:-main}

echo "Cloning $PROJECT on branch $BRANCH..."
git clone --branch "$BRANCH" --depth 1 "https://github.com/$PROJECT.git"
cd "$(basename "$PROJECT")"
npm install && npm run build
echo "Done ✓"
\`\`\`

**JSON**

\`\`\`json
{
  "name": "my-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.3.0",
    "akash-negi-markdown-editor": "^0.1.1"
  }
}
\`\`\`

**SQL**

\`\`\`sql
-- Top 5 customers by revenue in 2025
SELECT c.id,
       c.name,
       SUM(o.total) AS revenue
FROM customers AS c
JOIN orders AS o ON o.customer_id = c.id
WHERE o.created_at >= '2025-01-01'
  AND o.status <> 'cancelled'
GROUP BY c.id, c.name
HAVING SUM(o.total) > 1000
ORDER BY revenue DESC
LIMIT 5;
\`\`\`

**YAML**

\`\`\`yaml
name: CI
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
\`\`\`

**Go**

\`\`\`go
package main

import (
	"fmt"
	"sync"
)

func main() {
	var wg sync.WaitGroup
	results := make(chan int, 3)
	for i := 1; i <= 3; i++ {
		wg.Add(1)
		go func(n int) {
			defer wg.Done()
			results <- n * n
		}(i)
	}
	wg.Wait()
	close(results)
	for r := range results {
		fmt.Println(r)
	}
}
\`\`\`

**Rust**

\`\`\`rust
use std::collections::HashMap;

fn word_count(text: &str) -> HashMap<String, usize> {
    let mut counts = HashMap::new();
    for word in text.split_whitespace() {
        *counts.entry(word.to_lowercase()).or_insert(0) += 1;
    }
    counts
}

fn main() {
    let counts = word_count("the quick brown fox jumps over the lazy dog the end");
    println!("{:?}", counts.get("the"));
}
\`\`\`

**HTML**

\`\`\`html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Hello</title>
  </head>
  <body>
    <button id="go" class="primary" disabled>Click me</button>
    <script src="/main.js"></script>
  </body>
</html>
\`\`\`

**CSS**

\`\`\`css
:root {
  --accent: #0969da;
}

.card:hover > .title::after {
  content: "→";
  color: var(--accent);
  transition: transform 0.2s ease-in-out;
}

@media (max-width: 600px) {
  .card { padding: 0.5rem 1rem; }
}
\`\`\`

**Diff**

\`\`\`diff
--- a/greeting.js
+++ b/greeting.js
@@ -1,4 +1,4 @@
 function greet(name) {
-  return "Hello, " + name;
+  return \`Hello, \${name}!\`;
 }
\`\`\`

### Code block with a title

\`\`\`js [src/greet.js]
export function greet(name) {
  // says hello
  return \`Hello, \${name}!\`;
}
\`\`\`

### Fences without a language, or with an unknown one

\`\`\`
No language given: rendered as plain text.
    Indentation   and   spacing   are   preserved.
\`\`\`

\`\`\`brainfuck
++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.
\`\`\`

### Tilde fences

~~~python
print("fenced with tildes")
~~~

### A fenced block that contains fences (four backticks outside)

\`\`\`\`md
Here is how you write a code block in markdown:

\`\`\`js
console.log("hello");
\`\`\`
\`\`\`\`

### Long line (horizontal scroll test)

\`\`\`javascript
// This line is intentionally very long to test horizontal scrolling in the code block renderer: it should scroll and not break the layout of the page at all.
const result = await Promise.all(files.map(async (file) => ({ path: file.path, content: await fetchFileContent(owner, repo, branch, file.path), type: getFileType(file.path) })))
\`\`\`

---

## Code Groups

The following example adds two integers in several languages. Wrap consecutive fenced blocks in \`::: code-group\` to get a single tabbed block. The text inside \`[]\` becomes the tab title.

::: code-group
\`\`\`c++ [C++]
#include <iostream>
using namespace std;

int main() {
    int a = 10, b = 20;
    cout << a + b << endl;
    return 0;
}
\`\`\`

\`\`\`py [Python]
a = 10
b = 20

print(a + b)
\`\`\`

\`\`\`js [JavaScript]
const a = 10;
const b = 20;

console.log(a + b);
\`\`\`

\`\`\`java [Java]
public class Main {
    public static void main(String[] args) {
        int a = 10;
        int b = 20;

        System.out.println(a + b);
    }
}
\`\`\`
:::

### Group of config files

::: code-group
\`\`\`json [config.json]
{
  "port": 8080,
  "debug": true
}
\`\`\`
\`\`\`yaml [config.yaml]
port: 8080
debug: true
\`\`\`
\`\`\`bash [.env]
PORT=8080
DEBUG=true
\`\`\`
:::

### Without the wrapper, fences stay separate

These two blocks are not inside \`::: code-group\`, so they render as two ordinary titled blocks:

\`\`\`js [first.js]
console.log("first");
\`\`\`

\`\`\`py [second.py]
print("second")
\`\`\`

---

## Collapsible Sections

<details>
<summary>Click to expand (closed by default)</summary>

Hidden content can include **formatting**, lists, tables, and code:

- First hidden item
- Second hidden item

| Setting | Value |
|---------|-------|
| \`theme\` | \`auto\` |
| \`height\`| \`600px\` |
>>>>>>> c24d699 (updated the project)

\`\`\`js
console.log("still just markdown");
\`\`\`

</details>

<<<<<<< HEAD
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
=======
<details open>
<summary>This one starts open</summary>

It uses \`<details open>\`, so the content is visible until you collapse it.

</details>

<details>
<summary>Nested sections</summary>

The outer section holds an inner one:

<details>
<summary>Inner section</summary>

Inner content, with a task list:

- [ ] Inner task one
- [x] Inner task two

</details>

</details>

---

## Horizontal Rules

Three styles, all rendered the same:

---

***

___

Below the rules.

---

## Mixed Content After an Alert

> [!NOTE]
> The section below mixes a table, a code block, and a list, all immediately after an alert to check that spacing is consistent.

| Key         | Value           |
|-------------|-----------------|
| \`owner\`     | \`facebook\`      |
| \`repo\`      | \`react\`         |
| \`branch\`    | \`main\`          |

\`\`\`bash
curl "https://api.github.com/repos/facebook/react/git/trees/main?recursive=1"
\`\`\`

The response includes:
- \`tree\`: flat array of all file blobs
- \`truncated\`: \`true\` if the repository tree exceeds the API's size limit
- \`sha\`: the tree SHA for caching purposes

---

## Security and Edge Cases

Only a small set of HTML tags is interpreted (\`<u>\`, \`<sub>\`, \`<sup>\`, \`<details>\`, \`<summary>\`). Everything else is shown as literal text, never rendered:

<div class="box" onclick="alert('hi')">This div is shown as text</div>

<script>alert("not executed")</script>

Unsafe link targets are neutralized: [this javascript link](javascript:alert(1)) points to \`#\`, and so does [this data link](data:text/html,hello).

A very long unbroken word should wrap or scroll instead of breaking the layout: Supercalifragilisticexpialidocious_Supercalifragilisticexpialidocious_Supercalifragilisticexpialidocious_Supercalifragilisticexpialidocious

A very long URL: https://example.com/a/really/long/path/that/keeps/going/and/going/and/going/and/going/and/going/and/going/and/going?with=query&and=more&params=here

Unicode and emoji pass through untouched: café, naïve, 日本語のテキスト, Привет, 🚀 ✅ 🎉

---

Try the toolbar too: the **Table**, **Alert**, and **Dropdown** buttons, the view modes (edit, split, preview, HTML source), the theme toggle, fullscreen, and the **?** guide.
>>>>>>> c24d699 (updated the project)
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
<<<<<<< HEAD
}
=======
}
>>>>>>> c24d699 (updated the project)
