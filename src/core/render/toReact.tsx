"use client";
import { useState, type CSSProperties, type ReactElement, type ReactNode } from "react";
import type {
  AlertType,
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
import { sanitizeUrl } from "../utils";
import { highlight as defaultHighlight, type Highlighter, type Token } from "../../highlighter";

export interface ReactRenderOptions {
  /** Custom syntax highlighter. Defaults to the built-in dependency-free tokenizer. */
  highlighter?: Highlighter;
  /** Whether external links open in a new tab. Default true. */
  openExternalLinksInNewTab?: boolean;
  /** Let the viewer click checkboxes to toggle them. Off by default. */
  interactiveChecklists?: boolean;
  /** Called with the checklist item's document-order index and its new checked state. */
  onToggleCheckbox?: (index: number, checked: boolean) => void;
}

interface Ctx {
  highlighter: Highlighter;
  openExternalLinksInNewTab: boolean;
  interactiveChecklists: boolean;
  onToggleCheckbox?: (index: number, checked: boolean) => void;
  keySeed: { n: number };
  checklistIndex: { n: number };
}

const ALERT_LABELS: Record<AlertType, string> = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
};

function AlertIcon({ type }: { type: AlertType }) {
  const d: Record<AlertType, string> = {
    note: "M8 1a7 7 0 100 14A7 7 0 008 1zm.75 10.5h-1.5V7h1.5v4.5zM8 5.75a.9.9 0 110-1.8.9.9 0 010 1.8z",
    tip: "M8 1a4.5 4.5 0 00-2.5 8.25c.32.22.5.58.5.98V11h4v-.77c0-.4.18-.76.5-.98A4.5 4.5 0 008 1zM6 13h4v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-1z",
    important: "M1 8a7 7 0 1114 0A7 7 0 011 8zm7.75-3.25h-1.5v4.5h1.5v-4.5zM8 11.75a.9.9 0 100-1.8.9.9 0 000 1.8z",
    warning: "M8 1.5l7 12.5H1L8 1.5zm.75 5h-1.5v4h1.5v-4zM8 11.75a.9.9 0 100 1.8.9.9 0 000-1.8z",
    caution: "M5 1h6l4 4v6l-4 4H5l-4-4V5l4-4zm2.25 3.5v4.5h1.5V4.5h-1.5zM8 11.75a.9.9 0 100 1.8.9.9 0 000-1.8z",
  };
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true">
      <path fill="currentColor" d={d[type]} />
    </svg>
  );
}

/** Small inline glyph: overlapping squares (copy), or a checkmark once copied. */
function CopyGlyph({ copied }: { copied: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={14}
      height={14}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {copied ? (
        <path d="M3.5 8.5l3 3 6-7" />
      ) : (
        <>
          <rect x="5.5" y="5.5" width="7" height="7" rx="1" />
          <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
        </>
      )}
    </svg>
  );
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const label = copied ? "Copied" : "Copy code";
  return (
    <button
      type="button"
      className={`mde-copy-btn${copied ? " mde-copied" : ""}`}
      aria-label={label}
      title={label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable; ignore */
        }
      }}
    >
      <CopyGlyph copied={copied} />
    </button>
  );
}

function renderTokensReact(tokens: Token[]): ReactNode {
  return tokens.map((t, i) =>
    t.type === "plain" ? (
      <span key={i}>{t.text}</span>
    ) : (
      <span key={i} className={`mde-tok-${t.type}`}>
        {t.text}
      </span>
    ),
  );
}

function CodeBlockView({ node, ctx }: { node: CodeBlockNode; ctx: Ctx }) {
  const tokens = ctx.highlighter(node.code, node.lang);
  return (
    <div className="mde-code-block">
      {/* {node.title && <div className="mde-code-title">{node.title}</div>} */}
      <CopyButton code={node.code} />
      <pre className="mde-pre">
        <code className="mde-code" data-lang={node.lang ?? ""}>
          {renderTokensReact(tokens)}
        </code>
      </pre>
    </div>
  );
}

function CodeGroupView({ node, ctx }: { node: CodeGroupNode; ctx: Ctx }) {
  const [active, setActive] = useState(0);
  return (
    <div className="mde-code-group">
      <div className="mde-code-group-tabs" role="tablist">
        {node.blocks.map((b, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`mde-code-group-tab${i === active ? " mde-active" : ""}`}
            onClick={() => setActive(i)}
          >
            {b.title ?? b.lang ?? `Tab ${i + 1}`}
          </button>
        ))}
      </div>
      {node.blocks.map((b, i) => (
        <div key={i} className={`mde-code-group-panel${i === active ? " mde-active" : ""}`} hidden={i !== active}>
          <CodeBlockView node={b} ctx={ctx} />
        </div>
      ))}
    </div>
  );
}

function DetailsView({ node, ctx }: { node: DetailsNode; ctx: Ctx }) {
  return (
    <details className="mde-details" open={node.open || undefined}>
      <summary className="mde-summary">{renderInlineReact(node.summary, ctx)}</summary>
      <div className="mde-details-body">{renderBlocksReact(node.children, ctx)}</div>
    </details>
  );
}

function alignStyle(a: TableNode["align"][number]): CSSProperties | undefined {
  return a ? { textAlign: a } : undefined;
}

function TableView({ node, ctx }: { node: TableNode; ctx: Ctx }) {
  return (
    <div className="mde-table-wrapper">
      <table className="mde-table">
        <thead>
          <tr>
            {node.header.map((cell, i) => (
              <th key={i} style={alignStyle(node.align[i])}>
                {renderInlineReact(cell, ctx)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {node.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} style={alignStyle(node.align[ci])}>
                  {renderInlineReact(cell, ctx)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ListItemView({ item, tight, ctx }: { item: ListItemNode; tight: boolean; ctx: Ctx }) {
  const isChecklist = item.checked !== undefined && item.checked !== null;
  const myIndex = isChecklist ? ctx.checklistIndex.n++ : -1;
  const body = renderItemChildrenReact(item.children, tight, ctx);
  return (
    <li className={isChecklist ? "mde-li mde-checklist-item" : "mde-li"}>
      {isChecklist && (
        <input
          type="checkbox"
          className="mde-checkbox"
          checked={!!item.checked}
          disabled={!ctx.interactiveChecklists}
          onChange={(e) => ctx.onToggleCheckbox?.(myIndex, e.target.checked)}
          aria-label="Toggle task"
        />
      )}
      <span className="mde-li-content">{body}</span>
    </li>
  );
}

function ListView({ node, ctx }: { node: ListNode; ctx: Ctx }) {
  const cls = node.ordered ? "mde-list mde-list-ordered" : "mde-list mde-list-unordered";
  const items = node.items.map((item, i) => <ListItemView key={i} item={item} tight={node.tight} ctx={ctx} />);
  return node.ordered ? (
    <ol className={cls} start={node.start && node.start !== 1 ? node.start : undefined}>
      {items}
    </ol>
  ) : (
    <ul className={cls}>{items}</ul>
  );
}

function renderItemChildrenReact(children: BlockNode[], tight: boolean, ctx: Ctx): ReactNode {
  if (tight) {
    return children.map((c, i) =>
      c.type === "paragraph" ? <span key={i}>{renderInlineReact(c.children, ctx)}</span> : <BlockView key={i} node={c} ctx={ctx} />,
    );
  }
  return renderBlocksReact(children, ctx);
}

function BlockView({ node, ctx }: { node: BlockNode; ctx: Ctx }): ReactElement | null {
  switch (node.type) {
    case "heading": {
      const Tag = `h${node.depth}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      return (
        <Tag id={node.id || undefined} className={`mde-heading mde-h${node.depth}`}>
          {node.id && (
            <a href={`#${node.id}`} className="mde-heading-anchor" aria-hidden="true" tabIndex={-1}>
              #
            </a>
          )}
          {renderInlineReact(node.children, ctx)}
        </Tag>
      );
    }
    case "paragraph":
      return <p className="mde-p">{renderInlineReact(node.children, ctx)}</p>;
    case "thematicBreak":
      return <hr className="mde-hr" />;
    case "blockquote":
      return <blockquote className="mde-blockquote">{renderBlocksReact(node.children, ctx)}</blockquote>;
    case "alert":
      return (
        <div className={`mde-alert mde-alert-${node.alertType}`} role="note">
          <div className="mde-alert-title">
            <AlertIcon type={node.alertType} />
            <span>{ALERT_LABELS[node.alertType]}</span>
          </div>
          <div className="mde-alert-body">{renderBlocksReact(node.children, ctx)}</div>
        </div>
      );
    case "list":
      return <ListView node={node} ctx={ctx} />;
    case "codeBlock":
      return <CodeBlockView node={node} ctx={ctx} />;
    case "codeGroup":
      return <CodeGroupView node={node} ctx={ctx} />;
    case "table":
      return <TableView node={node} ctx={ctx} />;
    case "details":
      return <DetailsView node={node} ctx={ctx} />;
    default:
      return null;
  }
}

function renderBlocksReact(nodes: BlockNode[], ctx: Ctx): ReactNode {
  return nodes.map((n, i) => <BlockView key={i} node={n} ctx={ctx} />);
}

function renderInlineNodeReact(node: InlineNode, ctx: Ctx, key: number): ReactNode {
  switch (node.type) {
    case "text":
      return node.value;
    case "strong":
      return <strong key={key}>{renderInlineReact(node.children, ctx)}</strong>;
    case "emphasis":
      return <em key={key}>{renderInlineReact(node.children, ctx)}</em>;
    case "strikethrough":
      return <del key={key}>{renderInlineReact(node.children, ctx)}</del>;
    case "underline":
      return <u key={key}>{renderInlineReact(node.children, ctx)}</u>;
    case "subscript":
      return <sub key={key}>{renderInlineReact(node.children, ctx)}</sub>;
    case "superscript":
      return <sup key={key}>{renderInlineReact(node.children, ctx)}</sup>;
    case "inlineCode":
      return (
        <code key={key} className="mde-inline-code">
          {node.value}
        </code>
      );
    case "link": {
      const url = sanitizeUrl(node.url);
      const isExternal = /^https?:/i.test(url);
      const extra =
        isExternal && ctx.openExternalLinksInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {};
      return (
        <a key={key} href={url} title={node.title} className="mde-link" {...extra}>
          {renderInlineReact(node.children, ctx)}
        </a>
      );
    }
    case "image": {
      const url = sanitizeUrl(node.url);
      return <img key={key} src={url} alt={node.alt} title={node.title} className="mde-image" loading="lazy" />;
    }
    case "break":
      return <br key={key} />;
    default:
      return null;
  }
}

function renderInlineReact(nodes: InlineNode[], ctx: Ctx): ReactNode {
  return nodes.map((n, i) => renderInlineNodeReact(n, ctx, i));
}

/** Renders a parsed document to React elements. Used by the live preview and MarkdownViewer. */
export function renderToReactElements(doc: DocumentNode, options: ReactRenderOptions = {}): ReactNode {
  const ctx: Ctx = {
    highlighter: options.highlighter ?? defaultHighlight,
    openExternalLinksInNewTab: options.openExternalLinksInNewTab ?? true,
    interactiveChecklists: options.interactiveChecklists ?? false,
    onToggleCheckbox: options.onToggleCheckbox,
    keySeed: { n: 0 },
    checklistIndex: { n: 0 },
  };
  return <div className="mde-content">{renderBlocksReact(doc.children, ctx)}</div>;
}
