"use client";
import { Popover } from "./Popover";
import { HelpIcon } from "./Icons";

const ROWS: { syntax: string; label: string }[] = [
  { syntax: "**bold**", label: "Bold" },
  { syntax: "*italic*", label: "Italic" },
  { syntax: "<u>underline</u>", label: "Underline" },
  { syntax: "~~strikethrough~~", label: "Strikethrough" },
  { syntax: "<sub>2</sub>", label: "Subscript" },
  { syntax: "<sup>2</sup>", label: "Superscript" },
  { syntax: "`code`", label: "Inline code" },
  { syntax: "[text](url)", label: "Link" },
  { syntax: "![alt](url)", label: "Image" },
  { syntax: "# … ######", label: "Heading 1–6" },
  { syntax: "---", label: "Horizontal rule" },
  { syntax: "> quote", label: "Quote" },
  { syntax: "> [!NOTE]", label: "Alert (also TIP, IMPORTANT, WARNING, CAUTION)" },
  { syntax: "<details>…</details>", label: "Collapsible section (dropdown)" },
  { syntax: "1. item", label: "Ordered list" },
  { syntax: "- item", label: "Unordered list" },
  { syntax: "- [ ] item", label: "Checklist" },
  { syntax: "| a | b |", label: "Table" },
  { syntax: "```lang", label: "Code block" },
  { syntax: "::: code-group", label: "Tabbed code group" },
];

export function HelpMenu({ disabled, title, theme }: { disabled?: boolean; title: string; theme?: string }) {
  return (
    <Popover
      ariaLabel="About and syntax guide"
      theme={theme}
      panelClassName="mde-help-popover"
      trigger={({ ref, onClick, open }) => (
        <button
          ref={ref}
          type="button"
          className="mde-toolbar-btn"
          title={title}
          aria-label={title}
          aria-haspopup="true"
          aria-expanded={open}
          disabled={disabled}
          onClick={onClick}
        >
          <HelpIcon />
        </button>
      )}
    >
      {() => (
        <div className="mde-help-panel">
          <p className="mde-help-intro">
            A practical subset of CommonMark + GFM, plus GitHub-style alerts, collapsible sections, and tabbed code
            groups. Only <code>&lt;u&gt;</code>, <code>&lt;sub&gt;</code>, <code>&lt;sup&gt;</code>, and{" "}
            <code>&lt;details&gt;</code>/<code>&lt;summary&gt;</code> are recognized as HTML — everything else is
            shown as plain text.
          </p>
          <table className="mde-help-table">
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <td>
                    <code>{row.syntax}</code>
                  </td>
                  <td>{row.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Popover>
  );
}
