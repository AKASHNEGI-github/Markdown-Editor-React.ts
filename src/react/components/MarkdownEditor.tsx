"use client";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { CSSProperties, KeyboardEvent, UIEvent } from "react";
import { useMarkdownEditorState } from "../hooks/useMarkdownEditorState";
import { useControllableState } from "../hooks/useControllableState";
import { Toolbar, type EditorMode, type EditorTheme, type ToolbarLabels } from "./Toolbar";
import { Preview } from "./Preview";
import { TableTools } from "./TableTools";
import { matchShortcut } from "../../editor/shortcuts";
import {
  toggleBold,
  toggleItalic,
  toggleUnderline,
  toggleStrikethrough,
  toggleInlineCode,
  toggleUnorderedList,
  toggleOrderedList,
  toggleChecklist,
  toggleBlockquote,
  setHeadingLevel,
  insertLink,
  continueList,
  indentLines,
  outdentLines,
} from "../../editor/commands";
import { toggleCheckboxInMarkdown } from "../../editor/checklist";
import { markdownToHtml } from "../../core/index";
import { CopyIconSmall, CheckIconSmall } from "./Icons";
import type { Highlighter } from "../../highlighter/index";
import type { EditorState } from "../../editor/types";

export type { EditorMode, EditorTheme } from "./Toolbar";

export interface MarkdownEditorProps {
  /** Controlled markdown value. Omit (with `defaultValue`) for uncontrolled use. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;

  mode?: EditorMode;
  defaultMode?: EditorMode;
  onModeChange?: (mode: EditorMode) => void;

  fullscreen?: boolean;
  defaultFullscreen?: boolean;
  onFullscreenChange?: (fullscreen: boolean) => void;

  theme?: EditorTheme;
  defaultTheme?: EditorTheme;
  onThemeChange?: (theme: EditorTheme) => void;

  /** Which toolbar buttons to show, and in what order. `false` hides the toolbar entirely. */
  toolbar?: string[] | false;
  /** Custom syntax highlighter (e.g. wrapping Shiki). Defaults to the built-in tokenizer. */
  highlighter?: Highlighter;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  height?: string | number;
  minHeight?: string | number;
  className?: string;
  labels?: ToolbarLabels;
  /** Let the preview's checkboxes be clicked to toggle the underlying markdown. Off by default. */
  interactiveChecklists?: boolean;
  openExternalLinksInNewTab?: boolean;
  headingIds?: boolean;
  showTableTools?: boolean;
  /** Tab/Shift+Tab indents list lines; otherwise Tab moves focus normally. Default true. */
  tabIndentation?: boolean;
  /** Pressing Enter in a list continues it with the same marker. Default true. */
  autoContinueList?: boolean;
  /** Show the light/dark theme toggle button in the toolbar. Default true. */
  showThemeToggle?: boolean;
  /** Show the "reset to original content" button in the toolbar. Default true. */
  showResetButton?: boolean;
  /** Show the "view rendered HTML source" mode button in the toolbar. Default true. */
  showHtmlView?: boolean;
  /** Show the "download/print preview as PDF" button in the toolbar. Default true. */
  showDownloadButton?: boolean;
  /** Show the "?" markdown syntax guide button in the toolbar. Default true. */
  showHelpButton?: boolean;
  /** Show line numbers in the gutter next to the markdown source. Default true. Disables textarea soft-wrap so numbers stay aligned with their line, matching GitHub's file editor. */
  showLineNumbers?: boolean;
  /** Show a "copy markdown source" button over the writing area. Default true. */
  showEditorCopyButton?: boolean;
  /** Called when the reset button is used, after content has been reset. */
  onReset?: () => void;
}

export interface MarkdownEditorHandle {
  getMarkdown: () => string;
  getHTML: () => string;
  focus: () => void;
  undo: () => void;
  redo: () => void;
  setMode: (mode: EditorMode) => void;
  reset: () => void;
}

const SHORTCUT_COMMANDS: Record<string, (s: EditorState) => EditorState> = {
  bold: toggleBold,
  italic: toggleItalic,
  underline: toggleUnderline,
  strikethrough: toggleStrikethrough,
  inlineCode: toggleInlineCode,
  link: insertLink,
  heading1: (s) => setHeadingLevel(s, 1),
  heading2: (s) => setHeadingLevel(s, 2),
  heading3: (s) => setHeadingLevel(s, 3),
  orderedList: toggleOrderedList,
  unorderedList: toggleUnorderedList,
  checklist: toggleChecklist,
  blockquote: toggleBlockquote,
};

export const MarkdownEditor = forwardRef<MarkdownEditorHandle, MarkdownEditorProps>(function MarkdownEditor(props, ref) {
  const {
    value,
    defaultValue = "",
    onChange,
    mode: modeProp,
    defaultMode = "split",
    onModeChange,
    fullscreen: fullscreenProp,
    defaultFullscreen = false,
    onFullscreenChange,
    theme: themeProp,
    defaultTheme = "auto",
    onThemeChange,
    toolbar,
    highlighter,
    placeholder,
    readOnly = false,
    disabled = false,
    height,
    minHeight = "320px",
    className,
    labels,
    interactiveChecklists = false,
    openExternalLinksInNewTab = true,
    headingIds = true,
    showTableTools = true,
    tabIndentation = true,
    autoContinueList = true,
    showThemeToggle = true,
    showResetButton = true,
    showHtmlView = true,
    showDownloadButton = true,
    showHelpButton = true,
    showLineNumbers = true,
    showEditorCopyButton = true,
    onReset,
  } = props;

  const editor = useMarkdownEditorState({ value, defaultValue, onChange });
  const [mode, setMode] = useControllableState<EditorMode>(modeProp, defaultMode, onModeChange);
  const [fullscreen, setFullscreen] = useControllableState<boolean>(fullscreenProp, defaultFullscreen, onFullscreenChange);
  const [theme, setTheme] = useControllableState<EditorTheme>(themeProp, defaultTheme, onThemeChange);
  const [mobilePane, setMobilePane] = useState<"edit" | "preview">("edit");

  // Captured once, on mount, so the "reset" button has an original value to return to.
  const initialValueRef = useRef<string>(value ?? defaultValue);

  const getHtml = useCallback(
    () => markdownToHtml(editor.value, { headingIds }, { highlighter, openExternalLinksInNewTab }),
    [editor.value, headingIds, highlighter, openExternalLinksInNewTab],
  );

  const handleReset = useCallback(() => {
    editor.setValue(initialValueRef.current);
    onReset?.();
  }, [editor, onReset]);

  // Printing (used for "download as PDF"): there is no bundled PDF library
  // (this package ships with zero runtime dependencies), so this uses the
  // browser's own print dialog — which every browser can also "Save as PDF"
  // from — against a dedicated, always-up-to-date render of the preview.
  //
  // That render is portaled straight to document.body (see printContainer
  // below) instead of being mounted inside .mde-root like everything else
  // in this component. This matters because .mde-root can sit anywhere in
  // a host page's own layout — below a page heading, above a footer, inside
  // a sidebar, and so on. Print CSS can only hide elements it knows about,
  // so hiding just .mde-root's own siblings (as an earlier version of this
  // did) leaves every *other* ancestor's content fully visible on the
  // printed page. Rendering the print-only content outside that layout
  // entirely, then hiding everything else in the page during print (see
  // the `body > *:not(.mde-print-root)` rule in styles.css), is what
  // guarantees the printed output is only ever this editor's own content.
  //
  // The container is only created for the brief duration of a print, not
  // kept alive on every keystroke, so it doesn't cost anything otherwise.
  const [printing, setPrinting] = useState(false);
  const [printContainer, setPrintContainer] = useState<HTMLDivElement | null>(null);
  const printTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const handleDownloadPdf = useCallback(() => setPrinting(true), []);

  // Create/remove the body-level print container exactly while printing.
  useEffect(() => {
    if (!printing || typeof document === "undefined") return;
    const node = document.createElement("div");
    node.className = "mde-print-root";
    document.body.appendChild(node);
    setPrintContainer(node);
    return () => {
      node.remove();
      setPrintContainer(null);
    };
  }, [printing]);

  // Once the container exists and the portaled preview below has had a
  // chance to commit and paint into it, trigger the actual print. Gating
  // on `printContainer` (not just `printing`) avoids ever calling print()
  // against an empty container.
  useEffect(() => {
    if (!printing || !printContainer) return;
    // A short delay so the print-only preview is guaranteed to have
    // painted before print() fires.
    printTimerRef.current = setTimeout(() => window.print(), 50);
    const handleAfterPrint = () => setPrinting(false);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      clearTimeout(printTimerRef.current);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [printing, printContainer]);

  const gutterRef = useRef<HTMLDivElement>(null);
  const handleTextareaScroll = useCallback((e: UIEvent<HTMLTextAreaElement>) => {
    if (gutterRef.current) gutterRef.current.scrollTop = e.currentTarget.scrollTop;
  }, []);
  const lineCount = useMemo(() => editor.value.split("\n").length, [editor.value]);
  const currentLine = useMemo(
    () => editor.value.slice(0, editor.selection.start).split("\n").length,
    [editor.value, editor.selection.start],
  );

  useImperativeHandle(
    ref,
    () => ({
      getMarkdown: () => editor.value,
      getHTML: () => getHtml(),
      focus: () => editor.textareaRef.current?.focus(),
      undo: editor.undo,
      redo: editor.redo,
      setMode: (m: EditorMode) => setMode(m),
      reset: handleReset,
    }),
    [editor, getHtml, setMode, handleReset],
  );

  const handleToggleCheckbox = useCallback(
    (index: number, checked: boolean) => {
      editor.setValue(toggleCheckboxInMarkdown(editor.value, index, checked));
    },
    [editor],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      const cmdId = matchShortcut(e);
      if (cmdId === "undo") {
        e.preventDefault();
        editor.undo();
        return;
      }
      if (cmdId === "redo") {
        e.preventDefault();
        editor.redo();
        return;
      }
      if (cmdId && SHORTCUT_COMMANDS[cmdId]) {
        e.preventDefault();
        editor.runCommand(SHORTCUT_COMMANDS[cmdId]);
        return;
      }

      if (e.key === "Tab" && tabIndentation) {
        const ta = e.currentTarget;
        const hasSelection = ta.selectionStart !== ta.selectionEnd;
        const lineStart = ta.value.lastIndexOf("\n", ta.selectionStart - 1) + 1;
        const isListLine = /^\s*([-*+]|\d+[.)])\s+/.test(ta.value.slice(lineStart, ta.selectionEnd));
        if (hasSelection || isListLine) {
          e.preventDefault();
          editor.runCommand(e.shiftKey ? outdentLines : indentLines);
        }
        // Otherwise let Tab move focus normally, so keyboard users are never trapped.
        return;
      }

      if (e.key === "Enter" && !e.shiftKey && autoContinueList) {
        const ta = e.currentTarget;
        const state: EditorState = { value: ta.value, selection: { start: ta.selectionStart, end: ta.selectionEnd } };
        const next = continueList(state);
        if (next) {
          e.preventDefault();
          editor.runCommand(() => next);
        }
      }
    },
    [editor, tabIndentation, autoContinueList],
  );

  const toggleFullscreenHandler = useCallback(() => setFullscreen(!fullscreen), [fullscreen, setFullscreen]);
  const toggleThemeHandler = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [theme, setTheme]);

  // Fullscreen is a fixed overlay covering the viewport; without this, the
  // page behind it can still scroll, showing a second scrollbar alongside
  // the editor's own. Lock body scroll for as long as we're fullscreen.
  useEffect(() => {
    if (!fullscreen || typeof document === "undefined") return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [fullscreen]);

  const rootStyle: CSSProperties = {
    height: fullscreen ? undefined : height,
    minHeight: fullscreen ? undefined : minHeight,
  };

  const showEdit = mode === "edit" || mode === "split";
  const showPreview = mode === "preview" || mode === "split";
  const showHtmlPane = mode === "html";

  const htmlOutput = useMemo(() => (showHtmlPane ? getHtml() : ""), [showHtmlPane, getHtml]);

  return (
    <div
      className={`mde-root${fullscreen ? " mde-fullscreen" : ""}${className ? ` ${className}` : ""}`}
      data-theme={theme}
      style={rootStyle}
    >
      {toolbar !== false && (
        <Toolbar
          runCommand={editor.runCommand}
          undo={editor.undo}
          redo={editor.redo}
          canUndo={editor.canUndo}
          canRedo={editor.canRedo}
          disabled={disabled || readOnly}
          buttons={toolbar === undefined ? undefined : toolbar}
          labels={labels}
          mode={mode}
          onModeChange={setMode}
          fullscreen={fullscreen}
          onToggleFullscreen={toggleFullscreenHandler}
          theme={theme}
          onToggleTheme={toggleThemeHandler}
          onReset={handleReset}
          onDownloadPdf={handleDownloadPdf}
          showThemeToggle={showThemeToggle}
          showResetButton={showResetButton}
          showHtmlView={showHtmlView}
          showDownloadButton={showDownloadButton}
          showHelpButton={showHelpButton}
        />
      )}
      <div className={`mde-body mde-mode-${mode}`} data-mobile-pane={mode === "split" ? mobilePane : undefined}>
        {mode === "split" && (
          <div className="mde-mobile-tabs" data-visible="true">
            <button
              type="button"
              className={`mde-toolbar-btn mde-text-btn${mobilePane === "edit" ? " mde-active" : ""}`}
              onClick={() => setMobilePane("edit")}
              aria-pressed={mobilePane === "edit"}
            >
              Edit
            </button>
            <button
              type="button"
              className={`mde-toolbar-btn mde-text-btn${mobilePane === "preview" ? " mde-active" : ""}`}
              onClick={() => setMobilePane("preview")}
              aria-pressed={mobilePane === "preview"}
            >
              Preview
            </button>
          </div>
        )}
        {showEdit && (
          <div className="mde-edit-pane">
            {showTableTools && !readOnly && !disabled && (
              <TableTools value={editor.value} selection={editor.selection} runCommand={editor.runCommand} />
            )}
            <div className="mde-textarea-wrap">
              {showLineNumbers && (
                <div className="mde-gutter" ref={gutterRef} aria-hidden="true">
                  {Array.from({ length: lineCount }, (_, i) => (
                    <div key={i} className={`mde-gutter-line${i + 1 === currentLine ? " mde-gutter-line-active" : ""}`}>
                      {i + 1}
                    </div>
                  ))}
                </div>
              )}
              <textarea
                ref={editor.textareaRef}
                className={`mde-textarea${showLineNumbers ? " mde-textarea-nowrap" : ""}`}
                wrap={showLineNumbers ? "off" : undefined}
                value={editor.value}
                onChange={editor.handleTextareaChange}
                onSelect={editor.handleSelect}
                onKeyDown={handleKeyDown}
                onScroll={showLineNumbers ? handleTextareaScroll : undefined}
                placeholder={placeholder}
                readOnly={readOnly}
                disabled={disabled}
                spellCheck
                aria-label="Markdown source"
              />
              {showEditorCopyButton && !readOnly && <CopyMarkdownButton value={editor.value} />}
            </div>
          </div>
        )}
        {showPreview && (
          <Preview
            value={editor.value}
            highlighter={highlighter}
            openExternalLinksInNewTab={openExternalLinksInNewTab}
            interactiveChecklists={interactiveChecklists && !readOnly}
            onToggleCheckbox={handleToggleCheckbox}
            headingIds={headingIds}
            className="mde-preview-pane"
          />
        )}
        {showHtmlPane && (
          <div className="mde-html-pane">
            <CopyHtmlButton html={htmlOutput} />
            <pre className="mde-html-view">
              <code>{htmlOutput}</code>
            </pre>
          </div>
        )}
      </div>
      {printContainer &&
        createPortal(
          // mde-theme-scope re-establishes the --mde-* variable scope outside
          // .mde-root's own DOM subtree (see styles.css), the same pattern
          // Popover.tsx uses for its own document.body portals. The print
          // media query then forces these to plain light-on-white values
          // regardless of `theme`, so data-theme here is just for
          // consistency, not because the printed result depends on it.
          <div className="mde-print-only mde-theme-scope" data-theme={theme}>
            <Preview
              value={editor.value}
              highlighter={highlighter}
              openExternalLinksInNewTab={openExternalLinksInNewTab}
              headingIds={headingIds}
              className="mde-preview-pane"
            />
          </div>,
          printContainer,
        )}
    </div>
  );
});

function CopyMarkdownButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const label = copied ? "Copied" : "Copy markdown";
  return (
    <button
      type="button"
      className={`mde-copy-btn mde-editor-copy-btn${copied ? " mde-copied" : ""}`}
      aria-label={label}
      title={label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable; ignore */
        }
      }}
    >
      {copied ? <CheckIconSmall /> : <CopyIconSmall />}
    </button>
  );
}

function CopyHtmlButton({ html }: { html: string }) {
  const [copied, setCopied] = useState(false);
  const label = copied ? "Copied" : "Copy HTML";
  return (
    <button
      type="button"
      className={`mde-copy-btn mde-html-copy-btn${copied ? " mde-copied" : ""}`}
      aria-label={label}
      title={label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(html);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable; ignore */
        }
      }}
    >
      {copied ? <CheckIconSmall /> : <CopyIconSmall />}
    </button>
  );
}
