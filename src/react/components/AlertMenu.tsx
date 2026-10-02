"use client";
import { Popover } from "./Popover";
import { AlertIcon, ChevronDownIcon } from "./Icons";
import { ALERT_KINDS, type AlertKind } from "../../editor/commands";

const LABELS: Record<AlertKind, string> = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
};

export function AlertMenu({
  onPick,
  disabled,
  title,
  theme,
}: {
  onPick: (kind: AlertKind) => void;
  disabled?: boolean;
  title: string;
  theme?: string;
}) {
  return (
    <Popover
      ariaLabel="Insert alert"
      theme={theme}
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
          <AlertIcon />
          <ChevronDownIcon />
        </button>
      )}
    >
      {(close) => (
        <div className="mde-menu" role="menu">
          {ALERT_KINDS.map((kind) => (
            <button
              key={kind}
              type="button"
              role="menuitem"
              className={`mde-menu-item mde-alert-menu-item mde-alert-${kind}`}
              onClick={() => {
                onPick(kind);
                close();
              }}
            >
              {LABELS[kind]}
            </button>
          ))}
        </div>
      )}
    </Popover>
  );
}
