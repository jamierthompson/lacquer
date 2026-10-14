/**
 * Tool-call card — the react implementation.
 * Spec: @lacquer/core, spec/catalog/ai/conversation/tool-call-card/tool-call-card.yaml
 *
 * A disclosure: a native button header and a labelled region. The state is
 * the `state` prop from the tool part, written to data-state; nothing here
 * reads the output to decide anything (LQ-TOOLCARD-01). The body opens
 * itself on output-error and approval-requested and is collapsed otherwise
 * unless the user toggled it (LQ-TOOLCARD-02). Output is text, JSON or a
 * React node; a string is never HTML (LQ-TOOLCARD-03). The approval prompt
 * is a slot, so the card has no approve or deny of its own. When the body
 * collapses around the focus (the prompt was answered), the header takes
 * it, as a disclosure does. The stylesheet is the HTML reference's; the
 * actions are catalog buttons.
 */
import "@lacquer/core/catalog/ai/conversation/tool-call-card/examples/html/tool-call-card.css";
import {
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type ReactNode,
} from "react";

import { Button } from "./button.tsx";

export const TOOL_STATES = [
  "input-streaming",
  "input-available",
  "approval-requested",
  "approval-responded",
  "output-available",
  "output-error",
  "output-denied",
] as const;
export type ToolState = (typeof TOOL_STATES)[number];

export const TOOL_CARD_STRINGS = {
  pending: "Pending",
  running: "Running",
  approval: "Needs approval",
  approved: "Approved",
  denied: "Denied",
  completed: "Completed",
  error: "Error",
  retry: "Retry",
  copy: "Copy",
  show_all: "Show all",
  denied_by: "Denied by you.",
};

export interface ToolCallCardProps {
  /** From the tool part's lifecycle, never inferred from content. */
  state: ToolState;
  /** Humanised, with its target. The caller humanises; the card does not. */
  name: string;
  effect?: "read" | "write" | "destroy";
  density?: "row" | "card";
  input?: unknown;
  /** A string, JSON, or a registered React node. Never HTML. */
  output?: unknown;
  error?: string;
  /** In approval-responded: whether the decision was an allow. */
  approved?: boolean;
  icon?: ReactNode;
  /** The approval prompt, rendered after the input while a decision is pending or recorded. */
  approval?: ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** When given, Retry is rendered while the state is output-error. */
  onRetry?: () => void;
  /** Milliseconds before elapsed time shows while running. LQ-WAIT-01 requires it by 10 s. */
  elapsedAfter?: number;
  strings?: Partial<typeof TOOL_CARD_STRINGS>;
}

/** The body opens itself in these states and in no others (LQ-TOOLCARD-02). */
export const opensByDefault = (state: ToolState): boolean =>
  state === "output-error" || state === "approval-requested";

/** The status text per state, from the spec's strings. */
const STATUS: Record<ToolState, keyof typeof TOOL_CARD_STRINGS> = {
  "input-streaming": "pending",
  "input-available": "running",
  "approval-requested": "approval",
  "approval-responded": "approved",
  "output-available": "completed",
  "output-error": "error",
  "output-denied": "denied",
};

/** The approval slot is shown from the request until the denial is recorded. */
const SHOWS_APPROVAL: readonly ToolState[] = [
  "approval-requested",
  "approval-responded",
  "output-denied",
];

export function ToolCallCard({
  state,
  name,
  effect = "read",
  density = "row",
  input,
  output,
  error,
  approved,
  icon,
  approval,
  defaultOpen = false,
  onOpenChange,
  onRetry,
  elapsedAfter = 10000,
  strings,
}: ToolCallCardProps) {
  const s = { ...TOOL_CARD_STRINGS, ...strings };
  const id = useId();
  const nameId = `${id}name`;
  const bodyId = `${id}body`;

  // The user's toggle, or null for "as the state says". Entering a state
  // that opens by default clears the toggle, so error and approval always
  // show even if the user had closed the body earlier.
  const [toggled, setToggled] = useState<boolean | null>(null);
  const [seen, setSeen] = useState(state);
  if (seen !== state) {
    setSeen(state);
    if (opensByDefault(state)) setToggled(null);
  }
  const open = toggled ?? (opensByDefault(state) || defaultOpen);
  const toggle = () => {
    setToggled(!open);
    onOpenChange?.(!open);
  };

  // Whether focus is in the body, kept by hand: an element removed while
  // focused fires no blur, so this still says yes after the prompt's
  // buttons go away. A collapse that hides the focus moves it to the header.
  const header = useRef<HTMLButtonElement>(null);
  const focusWithin = useRef(false);
  const onBodyBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) focusWithin.current = false;
  };
  useLayoutEffect(() => {
    if (open || !focusWithin.current) return;
    focusWithin.current = false;
    header.current?.focus();
  }, [open]);

  const running = state === "input-available";
  const statusKey =
    state === "approval-responded" && approved === false
      ? "denied"
      : STATUS[state];
  const showsApproval = approval != null && SHOWS_APPROVAL.includes(state);
  const copyable = state === "output-available" && typeof output === "string";
  const retryable = state === "output-error" && onRetry !== undefined;

  return (
    <div
      role="group"
      aria-labelledby={nameId}
      aria-busy={running || undefined}
      data-lacquer="tool-call-card"
      data-state={state}
      data-effect={effect}
      data-density={density}
    >
      <button
        ref={header}
        type="button"
        data-slot="header"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={toggle}
      >
        {icon != null && (
          <span data-slot="icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span data-slot="name" id={nameId}>
          {name}
        </span>
        <span data-slot="status">
          {running && <span data-slot="spinner" aria-hidden="true" />}
          {s[statusKey]}
        </span>
        {running && <Elapsed after={elapsedAfter} />}
        <span data-slot="chevron" aria-hidden="true">
          ›
        </span>
      </button>
      <div
        data-slot="body"
        id={bodyId}
        role="region"
        aria-labelledby={nameId}
        hidden={!open}
        onFocus={() => (focusWithin.current = true)}
        onBlur={onBodyBlur}
      >
        {input !== undefined && <pre data-slot="input">{json(input)}</pre>}
        {showsApproval && <div data-slot="approval">{approval}</div>}
        {state === "output-error" ? (
          <p data-slot="output" role="alert">
            {error}
          </p>
        ) : state === "output-denied" ? (
          approval == null && <p data-slot="output">{s.denied_by}</p>
        ) : (
          <Output value={output} />
        )}
        {(retryable || copyable) && (
          <div data-slot="actions">
            {retryable && (
              <Button emphasis="outline" size="xs" onClick={onRetry}>
                {s.retry}
              </Button>
            )}
            {copyable && (
              <Button
                emphasis="ghost"
                size="xs"
                onClick={() => navigator.clipboard?.writeText(output)}
              >
                {s.copy}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Text as text, JSON as JSON, a node as itself; never innerHTML (LQ-TOOLCARD-03). */
function Output({ value }: { value: unknown }) {
  if (value === undefined || value === null) return null;
  if (isValidElement(value)) return <div data-slot="output">{value}</div>;
  return (
    <pre data-slot="output">
      {typeof value === "string" ? value : json(value)}
    </pre>
  );
}

const json = (v: unknown) =>
  typeof v === "string" ? v : JSON.stringify(v, null, 2);

/** Seconds since mount, shown after `after` ms; outside any live region. */
function Elapsed({ after }: { after: number }) {
  const [seconds, setSeconds] = useState<number | null>(null);
  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => {
      const ms = Date.now() - start;
      setSeconds(ms >= after ? Math.floor(ms / 1000) : null);
    }, 1000);
    return () => clearInterval(t);
  }, [after]);
  return seconds === null ? null : <span data-slot="elapsed">{seconds}s</span>;
}
