/**
 * Composer — the react implementation.
 * Spec: @lacquer/core, spec/catalog/ai/conversation/composer/composer.yaml
 *
 * The form renders from the thread `status` it is given and from nothing
 * else (LQ-MACHINE-01). The primary control is one icon-button whose
 * action is `stop` while the status is pending and `send` otherwise
 * (LQ-COMPOSER-01); keeping it one element is what keeps focus in place
 * across the swap (LQ-COMPOSER-03). Nothing here clears the draft except
 * an accepted submit (LQ-COMPOSER-02), and nothing submits while a turn is
 * pending (LQ-COMPOSER-04). Attachments, the toolbar and the disclaimer
 * are slots. The stylesheet is the HTML reference's.
 */
import "@lacquer/core/catalog/ai/conversation/composer/examples/html/composer.css";
import {
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { IconButton } from "./icon-button.tsx";
import { isPending, type Status } from "./message-state-machine.ts";
import { Textarea } from "./textarea.tsx";

export const COMPOSER_STRINGS = {
  send: "Send message",
  stop: "Stop generating",
  placeholder: "Message…",
};

export interface ComposerProps {
  /** The thread status from message-state-machine. */
  status: Status;
  /** The draft, when controlled. */
  value?: string;
  /** The initial draft, when uncontrolled. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** The draft, when Enter or Send is pressed while filled and no turn is pending. */
  onSubmit?: (value: string) => void;
  /** Stop or Esc while a turn is pending. */
  onStop?: () => void;
  disabled?: boolean;
  placeholder?: string;
  /** The accessible name of the form and of the textarea. */
  label?: string;
  submitKey?: "enter" | "mod-enter";
  /** Lines the textarea grows to before it scrolls. */
  maxRows?: number;
  /** Empty the draft when a submit is accepted. */
  clearOnSubmit?: boolean;
  density?: "full" | "compact";
  attachments?: ReactNode;
  toolbar?: ReactNode;
  disclaimer?: ReactNode;
  strings?: Partial<typeof COMPOSER_STRINGS>;
}

export function Composer({
  status,
  value,
  defaultValue = "",
  onChange,
  onSubmit,
  onStop,
  disabled = false,
  placeholder,
  label = "Message",
  submitKey = "enter",
  maxRows = 8,
  clearOnSubmit = true,
  density = "full",
  attachments,
  toolbar,
  disclaimer,
  strings,
}: ComposerProps) {
  const s = { ...COMPOSER_STRINGS, ...strings };
  const [draft, setDraft] = useState(defaultValue);
  const text = value ?? draft;
  const empty = text.trim() === "";
  const pending = isPending(status);
  const action = pending ? "stop" : "send";
  const control = useRef<HTMLTextAreaElement>(null);

  const update = (next: string) => {
    if (value === undefined) setDraft(next);
    onChange?.(next);
  };

  // The only path that submits, and the only path that clears the draft.
  const submit = () => {
    if (pending || empty || disabled) return;
    onSubmit?.(text);
    if (clearOnSubmit) update("");
    control.current?.focus();
  };

  const stop = () => {
    if (pending) onStop?.();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Enter") return;
    const mod = e.metaKey || e.ctrlKey;
    const wantsSubmit = submitKey === "enter" ? !e.shiftKey : mod;
    if (!wantsSubmit) return;
    // Enter is the submit key: it never inserts a newline, even while it
    // cannot submit (LQ-COMPOSER-04).
    e.preventDefault();
    submit();
  };

  const onFormKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Escape" && pending) {
      e.preventDefault();
      stop();
    }
  };

  const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

  return (
    <form
      data-lacquer="composer"
      data-density={density}
      data-status={status}
      data-empty={empty || undefined}
      aria-label={label}
      aria-disabled={disabled || undefined}
      onSubmit={onFormSubmit}
      onKeyDown={onFormKeyDown}
    >
      <div data-slot="frame">
        {attachments != null && (
          <div data-slot="attachments">{attachments}</div>
        )}
        <Textarea
          part="textarea"
          ref={control}
          sizing="autosize"
          frame="borderless"
          rows={1}
          maxRows={maxRows}
          value={text}
          onChange={update}
          onKeyDown={onKeyDown}
          placeholder={placeholder ?? s.placeholder}
          aria-label={label}
          disabled={disabled}
        />
        <div data-slot="footer">
          {density === "full" && toolbar != null && (
            <div data-slot="toolbar">{toolbar}</div>
          )}
          <IconButton
            part="primary-control"
            data-action={action}
            emphasis="filled"
            shape="round"
            size={density === "compact" ? "sm" : "md"}
            label={action === "stop" ? s.stop : s.send}
            softDisabled={action === "send" && empty}
            disabled={disabled}
            aria-keyshortcuts={
              action === "send"
                ? submitKey === "enter"
                  ? "Enter"
                  : "Meta+Enter Control+Enter"
                : undefined
            }
            onClick={action === "stop" ? stop : submit}
          >
            {action === "stop" ? <StopGlyph /> : <SendGlyph />}
          </IconButton>
        </div>
      </div>
      {disclaimer != null && <p data-slot="disclaimer">{disclaimer}</p>}
    </form>
  );
}

function SendGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
    </svg>
  );
}

function StopGlyph() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <rect x="4" y="4" width="8" height="8" rx="1" />
    </svg>
  );
}
