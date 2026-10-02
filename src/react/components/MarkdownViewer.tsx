"use client";
import { useMemo } from "react";
import { parseMarkdown } from "../../core/parser/index";
import { renderToReactElements } from "../../core/render/toReact";
import type { Highlighter } from "../../highlighter/index";

export interface MarkdownViewerProps {
  value: string;
  highlighter?: Highlighter;
  openExternalLinksInNewTab?: boolean;
  headingIds?: boolean;
  theme?: "light" | "dark" | "auto";
  className?: string;
}

/** Read-only rendering of a markdown string. Use this for saved/received content you don't need to edit. */
export function MarkdownViewer({
  value,
  highlighter,
  openExternalLinksInNewTab = true,
  headingIds = true,
  theme = "auto",
  className,
}: MarkdownViewerProps) {
  const doc = useMemo(() => parseMarkdown(value, { headingIds }), [value, headingIds]);
  const content = useMemo(
    () => renderToReactElements(doc, { highlighter, openExternalLinksInNewTab }),
    [doc, highlighter, openExternalLinksInNewTab],
  );
  return (
    <div className={`mde-root mde-viewer-root${className ? ` ${className}` : ""}`} data-theme={theme}>
      <div className="mde-preview">{content}</div>
    </div>
  );
}
