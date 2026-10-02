import type {
  AlertType,
  Alignment,
  BlockNode,
  CodeBlockNode,
  CodeGroupNode,
  DetailsNode,
  DocumentNode,
  InlineNode,
  ListItemNode,
  ListNode,
  TableNode,
} from "../types";
import { escapeHtml, sanitizeUrl } from "../utils";
import { highlight as defaultHighlight, type Highlighter, type Token } from "../../highlighter";

export interface RenderOptions {
  /** Custom syntax highlighter. Defaults to the built-in dependency-free tokenizer. */
  highlighter?: Highlighter;
  /** Whether external links open in a new tab. Default true. */
  openExternalLinksInNewTab?: boolean;
}

interface Ctx {
  highlighter: Highlighter;
  openExternalLinksInNewTab: boolean;
  nextId: () => number;
  /** Set to true the first time a copy button is rendered, so the shared click-delegation script is only emitted when it's actually needed. */
  usedCopyButton: { v: boolean };
}

const ALERT_LABELS: Record<AlertType, string> = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
};

// Minimal, license-free inline icons (single path each) per alert type.
const ALERT_ICONS: Record<AlertType, string> = {
  note: '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M8 1a7 7 0 100 14A7 7 0 008 1zm.75 10.5h-1.5V7h1.5v4.5zM8 5.75a.9.9 0 110-1.8.9.9 0 010 1.8z"/></svg>',
  tip: '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M8 1a4.5 4.5 0 00-2.5 8.25c.32.22.5.58.5.98V11h4v-.77c0-.4.18-.76.5-.98A4.5 4.5 0 008 1zM6 13h4v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-1z"/></svg>',
  important: '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M1 8a7 7 0 1114 0A7 7 0 011 8zm7.75-3.25h-1.5v4.5h1.5v-4.5zM8 11.75a.9.9 0 100-1.8.9.9 0 000 1.8z"/></svg>',
  warning: '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M8 1.5l7 12.5H1L8 1.5zm.75 5h-1.5v4h1.5v-4zM8 11.75a.9.9 0 100 1.8.9.9 0 000-1.8z"/></svg>',
  caution: '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M5 1h6l4 4v6l-4 4H5l-4-4V5l4-4zm2.25 3.5v4.5h1.5V4.5h-1.5zM8 11.75a.9.9 0 100 1.8.9.9 0 000-1.8z"/></svg>',
};

// Inline glyphs for the copy button, kept in sync with the React renderer's
// CopyGlyph (see toReact.tsx). Embedded as strings so the static export's
// delegated click handler (see renderToHtml) can swap them at runtime.
const COPY_ICON_SVG =
  '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5.5" y="5.5" width="7" height="7" rx="1"/><rect x="3.5" y="3.5" width="7" height="7" rx="1"/></svg>';
const CHECK_ICON_SVG =
  '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7"/></svg>';

function renderTokensHtml(tokens: Token[]): string {
  return tokens
    .map((t) => (t.type === "plain" ? escapeHtml(t.text) : `<span class="mde-tok-${t.type}">${escapeHtml(t.text)}</span>`))
    .join("");
}

function renderCodeBlockHtml(node: CodeBlockNode, ctx: Ctx): string {
  ctx.usedCopyButton.v = true;
  const tokens = ctx.highlighter(node.code, node.lang);
  const titleHtml = node.title ? `<div class="mde-code-title">${escapeHtml(node.title)}</div>` : "";
  const langAttr = node.lang ? ` data-lang="${escapeHtml(node.lang)}"` : "";
  return (
    `<div class="mde-code-block">${titleHtml}` +
    `<button type="button" class="mde-copy-btn" data-mde-copy aria-label="Copy code" title="Copy code">${COPY_ICON_SVG}</button>` +
    `<pre class="mde-pre"><code class="mde-code"${langAttr}>${renderTokensHtml(tokens)}</code></pre></div>`
  );
}

function renderDetailsHtml(node: DetailsNode, ctx: Ctx): string {
  const openAttr = node.open ? " open" : "";
  return (
    `<details class="mde-details"${openAttr}>` +
    `<summary class="mde-summary">${renderInlineHtml(node.summary, ctx)}</summary>` +
    `<div class="mde-details-body">${renderBlocksHtml(node.children, ctx)}</div></details>`
  );
}

function renderCodeGroupHtml(node: CodeGroupNode, ctx: Ctx): string {
  const id = `mde-cg-${ctx.nextId()}`;
  const tabs = node.blocks
    .map(
      (b, i) =>
        `<button type="button" class="mde-code-group-tab${i === 0 ? " mde-active" : ""}" data-index="${i}">${escapeHtml(
          b.title ?? b.lang ?? `Tab ${i + 1}`,
        )}</button>`,
    )
    .join("");
  const panels = node.blocks
    .map((b, i) => `<div class="mde-code-group-panel${i === 0 ? " mde-active" : ""}" data-index="${i}">${renderCodeBlockHtml(b, ctx)}</div>`)
    .join("");
  const script = `<script>(function(){var el=document.getElementById(${JSON.stringify(id)});if(!el)return;var tabs=el.querySelectorAll('.mde-code-group-tab');var panels=el.querySelectorAll('.mde-code-group-panel');tabs.forEach(function(btn){btn.addEventListener('click',function(){var idx=btn.getAttribute('data-index');tabs.forEach(function(b){b.classList.toggle('mde-active',b===btn)});panels.forEach(function(p){p.classList.toggle('mde-active',p.getAttribute('data-index')===idx)})})})})();</script>`;
  return `<div class="mde-code-group" id="${id}"><div class="mde-code-group-tabs" role="tablist">${tabs}</div>${panels}${script}</div>`;
}

function alignStyle(a: Alignment): string {
  return a ? ` style="text-align:${a}"` : "";
}

function renderTableHtml(node: TableNode, ctx: Ctx): string {
  const head = node.header.map((cell, i) => `<th${alignStyle(node.align[i])}>${renderInlineHtml(cell, ctx)}</th>`).join("");
  const rows = node.rows
    .map((row) => `<tr>${row.map((cell, i) => `<td${alignStyle(node.align[i])}>${renderInlineHtml(cell, ctx)}</td>`).join("")}</tr>`)
    .join("");
  return `<div class="mde-table-wrapper"><table class="mde-table"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderItemChildrenHtml(children: BlockNode[], tight: boolean, ctx: Ctx): string {
  if (tight) {
    return children.map((c) => (c.type === "paragraph" ? renderInlineHtml(c.children, ctx) : renderBlockHtml(c, ctx))).join("");
  }
  return renderBlocksHtml(children, ctx);
}

function renderListItemHtml(item: ListItemNode, tight: boolean, ctx: Ctx): string {
  const isChecklist = item.checked !== undefined && item.checked !== null;
  const cls = isChecklist ? "mde-li mde-checklist-item" : "mde-li";
  const checkbox = isChecklist
    ? `<input type="checkbox" class="mde-checkbox" ${item.checked ? "checked" : ""} disabled />`
    : "";
  return `<li class="${cls}">${checkbox}<span class="mde-li-content">${renderItemChildrenHtml(item.children, tight, ctx)}</span></li>`;
}

function renderListHtml(node: ListNode, ctx: Ctx): string {
  const tag = node.ordered ? "ol" : "ul";
  const startAttr = node.ordered && node.start && node.start !== 1 ? ` start="${node.start}"` : "";
  const cls = node.ordered ? "mde-list mde-list-ordered" : "mde-list mde-list-unordered";
  const items = node.items.map((item) => renderListItemHtml(item, node.tight, ctx)).join("");
  return `<${tag}${startAttr} class="${cls}">${items}</${tag}>`;
}

function renderBlockHtml(node: BlockNode, ctx: Ctx): string {
  switch (node.type) {
    case "heading": {
      const idAttr = node.id ? ` id="${escapeHtml(node.id)}"` : "";
      const anchor = node.id
        ? `<a href="#${escapeHtml(node.id)}" class="mde-heading-anchor" aria-hidden="true" tabindex="-1">#</a>`
        : "";
      return `<h${node.depth}${idAttr} class="mde-heading mde-h${node.depth}">${anchor}${renderInlineHtml(node.children, ctx)}</h${node.depth}>`;
    }
    case "paragraph":
      return `<p class="mde-p">${renderInlineHtml(node.children, ctx)}</p>`;
    case "thematicBreak":
      return `<hr class="mde-hr" />`;
    case "blockquote":
      return `<blockquote class="mde-blockquote">${renderBlocksHtml(node.children, ctx)}</blockquote>`;
    case "alert":
      return (
        `<div class="mde-alert mde-alert-${node.alertType}" role="note">` +
        `<div class="mde-alert-title">${ALERT_ICONS[node.alertType]}<span>${ALERT_LABELS[node.alertType]}</span></div>` +
        `<div class="mde-alert-body">${renderBlocksHtml(node.children, ctx)}</div></div>`
      );
    case "list":
      return renderListHtml(node, ctx);
    case "codeBlock":
      return renderCodeBlockHtml(node, ctx);
    case "codeGroup":
      return renderCodeGroupHtml(node, ctx);
    case "table":
      return renderTableHtml(node, ctx);
    case "details":
      return renderDetailsHtml(node, ctx);
    default:
      return "";
  }
}

function renderBlocksHtml(nodes: BlockNode[], ctx: Ctx): string {
  return nodes.map((n) => renderBlockHtml(n, ctx)).join("\n");
}

function renderInlineNodeHtml(node: InlineNode, ctx: Ctx): string {
  switch (node.type) {
    case "text":
      return escapeHtml(node.value);
    case "strong":
      return `<strong>${renderInlineHtml(node.children, ctx)}</strong>`;
    case "emphasis":
      return `<em>${renderInlineHtml(node.children, ctx)}</em>`;
    case "strikethrough":
      return `<del>${renderInlineHtml(node.children, ctx)}</del>`;
    case "underline":
      return `<u>${renderInlineHtml(node.children, ctx)}</u>`;
    case "subscript":
      return `<sub>${renderInlineHtml(node.children, ctx)}</sub>`;
    case "superscript":
      return `<sup>${renderInlineHtml(node.children, ctx)}</sup>`;
    case "inlineCode":
      return `<code class="mde-inline-code">${escapeHtml(node.value)}</code>`;
    case "link": {
      const url = sanitizeUrl(node.url);
      const isExternal = /^https?:/i.test(url);
      const targetAttr = isExternal && ctx.openExternalLinksInNewTab ? ' target="_blank" rel="noopener noreferrer"' : "";
      const titleAttr = node.title ? ` title="${escapeHtml(node.title)}"` : "";
      return `<a href="${escapeHtml(url)}"${titleAttr}${targetAttr} class="mde-link">${renderInlineHtml(node.children, ctx)}</a>`;
    }
    case "image": {
      const url = sanitizeUrl(node.url);
      const titleAttr = node.title ? ` title="${escapeHtml(node.title)}"` : "";
      return `<img src="${escapeHtml(url)}" alt="${escapeHtml(node.alt)}"${titleAttr} class="mde-image" loading="lazy" />`;
    }
    case "break":
      return `<br />`;
    default:
      return "";
  }
}

function renderInlineHtml(nodes: InlineNode[], ctx: Ctx): string {
  return nodes.map((n) => renderInlineNodeHtml(n, ctx)).join("");
}

// Single delegated click handler for every copy button in the export (plain
// code blocks and code-group panels alike). Installed once per page even if
// this output is embedded more than once, and falls back to a hidden
// textarea + execCommand('copy') for older/non-secure-context browsers that
// don't expose navigator.clipboard.
function copyButtonScript(): string {
  return (
    `<script>(function(){` +
    `if(window.__mdeCopyInit)return;window.__mdeCopyInit=true;` +
    `var COPY=${JSON.stringify(COPY_ICON_SVG)};var CHECK=${JSON.stringify(CHECK_ICON_SVG)};` +
    `document.addEventListener('click',function(e){` +
    `var btn=e.target&&e.target.closest?e.target.closest('[data-mde-copy]'):null;if(!btn)return;` +
    `var block=btn.closest('.mde-code-block');var codeEl=block&&block.querySelector('.mde-code');if(!codeEl)return;` +
    `var text=codeEl.textContent||'';` +
    `function reset(){btn.classList.remove('mde-copied');btn.innerHTML=COPY;btn.setAttribute('aria-label','Copy code');btn.setAttribute('title','Copy code');}` +
    `function done(){btn.classList.add('mde-copied');btn.innerHTML=CHECK;btn.setAttribute('aria-label','Copied');btn.setAttribute('title','Copied');setTimeout(reset,1500);}` +
    `if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(done,function(){});}` +
    `else{try{var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';` +
    `document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);done();}catch(err){}}` +
    `});})();</script>`
  );
}

/** Renders a parsed document to a self-contained HTML string (no <html>/<body> wrapper). */
export function renderToHtml(doc: DocumentNode, options: RenderOptions = {}): string {
  let counter = 0;
  const ctx: Ctx = {
    highlighter: options.highlighter ?? defaultHighlight,
    openExternalLinksInNewTab: options.openExternalLinksInNewTab ?? true,
    nextId: () => ++counter,
    usedCopyButton: { v: false },
  };
  const body = renderBlocksHtml(doc.children, ctx);
  const script = ctx.usedCopyButton.v ? copyButtonScript() : "";
  return `<div class="mde-content">${body}</div>${script}`;
}
