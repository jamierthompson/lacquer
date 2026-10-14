/**
 * Approval prompt — the react implementation.
 * Spec: @lacquer/core, spec/catalog/ai/agentic/approval-prompt/approval-prompt.yaml
 *
 * Inline in the turn, never a modal (LQ-APPROVAL-05). The title is the
 * thread's one assertive alert; the payload is verbatim (LQ-APPROVAL-01);
 * the Always option exists only with a scope in its label and never for a
 * destroy (LQ-APPROVAL-03). Focus lands on Allow once, or on Deny for a
 * destroy, and never on Always (LQ-APPROVAL-02). The decide event fires
 * from the user's activation, Enter or Esc and from nothing else
 * (LQ-APPROVAL-04). The options are catalog buttons, the correction is the
 * catalog textarea; the stylesheet is the HTML reference's.
 */
import "@lacquer/core/catalog/ai/agentic/approval-prompt/examples/html/approval-prompt.css";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { Button } from "./button.tsx";
import { Textarea } from "./textarea.tsx";

export const APPROVAL_STRINGS = {
  needed: "Approval needed",
  allow: "Allow once",
  always: "Always allow {scope}",
  deny: "Deny",
  correction: "What should it do instead?",
  allowed: "Allowed once",
  allowed_always: "Always allowed: {scope}",
  denied: "Denied",
  denied_with: "Denied: {correction}",
  timed_out: "Timed out, denied",
  touches: "Touches",
  reversible: "Reversible",
  reach: "Reach",
};

export type Decision = "allow-once" | "allow-always" | "deny" | "timed-out";

/** What the user can decide. A time-out is the product's, never the prompt's. */
export type UserDecision = Exclude<Decision, "timed-out">;

export interface Risk {
  touches?: string;
  reversible?: string;
  reach?: string;
}

export interface ApprovalPromptProps {
  /** From the tool part's state, never inferred. */
  state: "approval-requested" | "approval-responded";
  /** Verb, object and scope in one phrase (LQ-GATE-02). */
  title: string;
  /** What will run, verbatim. Required for write and destroy (LQ-APPROVAL-01). */
  payload?: string;
  payloadFormat?: "command" | "text";
  risk?: Risk;
  effect?: "read" | "write" | "destroy";
  /** When given, the Always option is rendered and named with it (LQ-APPROVAL-03). */
  alwaysScope?: string;
  /** Required when the state is approval-responded. */
  decision?: Decision;
  /** The correction recorded with a deny. */
  correction?: string;
  /** Move focus to the default option on entering approval-requested (LQ-APPROVAL-02). */
  autoFocus?: boolean;
  onDecide?: (decision: UserDecision, correction?: string) => void;
  autonomy?: ReactNode;
  strings?: Partial<typeof APPROVAL_STRINGS>;
}

/** The option that holds focus on entering approval-requested (LQ-APPROVAL-02). */
export const defaultOption = (effect: "read" | "write" | "destroy") =>
  effect === "destroy" ? "deny" : "allow";

export function ApprovalPrompt({
  state,
  title,
  payload,
  payloadFormat = "command",
  risk,
  effect = "write",
  alwaysScope,
  decision,
  correction,
  autoFocus = true,
  onDecide,
  autonomy,
  strings,
}: ApprovalPromptProps) {
  const s = { ...APPROVAL_STRINGS, ...strings };
  const id = useId();
  const titleId = `${id}title`;
  const riskId = `${id}risk`;
  const requested = state === "approval-requested";
  const root = useRef<HTMLFormElement>(null);
  const decided = useRef<HTMLParagraphElement>(null);
  // Set by a decision made here, so the decision line takes the focus the
  // buttons had; a decision made elsewhere (a time-out) moves nothing.
  const moveFocus = useRef(false);
  const [text, setText] = useState("");

  // Focus the default option on entering approval-requested. The effect is
  // read off the root so a later change of effect does not steal focus.
  useEffect(() => {
    if (!requested || !autoFocus) return;
    const el = root.current;
    if (!el) return;
    const slot = defaultOption(
      (el.dataset.effect as "read" | "write" | "destroy") ?? "write",
    );
    el.querySelector<HTMLElement>(`[data-slot="${slot}"]`)?.focus();
  }, [requested, autoFocus]);

  useEffect(() => {
    if (requested || !moveFocus.current) return;
    moveFocus.current = false;
    decided.current?.focus();
  }, [requested]);

  // The only path to a decision: a button, Enter or Esc (LQ-APPROVAL-04).
  const decide = (d: UserDecision, c?: string) => {
    if (!requested) return;
    moveFocus.current = true;
    onDecide?.(d, c);
  };
  const deny = () => decide("deny", text.trim() || undefined);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    decide("allow-once");
  };
  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      deny();
    }
  };
  const onCorrectionKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      deny();
    }
  };

  const rows = risk
    ? (
        [
          ["touches", risk.touches],
          ["reversible", risk.reversible],
          ["reach", risk.reach],
        ] as const
      ).filter((r): r is [keyof Risk, string] => r[1] !== undefined)
    : [];

  return (
    <form
      ref={root}
      data-lacquer="approval-prompt"
      data-state={state}
      data-effect={effect}
      data-decision={requested ? undefined : decision}
      aria-labelledby={titleId}
      aria-describedby={requested && rows.length ? riskId : undefined}
      onSubmit={onSubmit}
      onKeyDown={onKeyDown}
    >
      <div
        data-slot="title"
        id={titleId}
        role={requested ? "alert" : undefined}
      >
        {requested && <span data-slot="eyebrow">{s.needed}</span>}
        {title}
      </div>
      {requested && payload !== undefined && (
        <pre data-slot="payload" data-format={payloadFormat}>
          {payload}
        </pre>
      )}
      {requested && rows.length > 0 && (
        <dl data-slot="risk" id={riskId}>
          {rows.map(([k, v]) => (
            <Row key={k} term={s[k]} detail={v} />
          ))}
        </dl>
      )}
      {requested && (
        <div data-slot="actions">
          <Button
            part="allow"
            type="submit"
            emphasis={effect === "destroy" ? "destructive" : "primary"}
            size="sm"
          >
            {s.allow}
          </Button>
          {alwaysScope !== undefined && effect !== "destroy" && (
            <Button
              part="always"
              emphasis="outline"
              size="sm"
              onClick={() => decide("allow-always")}
            >
              {s.always.replace("{scope}", alwaysScope)}
            </Button>
          )}
          <Button part="deny" emphasis="outline" size="sm" onClick={deny}>
            {s.deny}
          </Button>
          {autonomy != null && <span data-slot="autonomy">{autonomy}</span>}
        </div>
      )}
      {requested && (
        <Textarea
          part="correction"
          size="sm"
          rows={1}
          maxRows={4}
          value={text}
          onChange={setText}
          onKeyDown={onCorrectionKeyDown}
          placeholder={s.correction}
          aria-label={s.correction}
        />
      )}
      {!requested && (
        <p data-slot="decision" role="status" tabIndex={-1} ref={decided}>
          {decisionText(decision, { alwaysScope, correction }, s)}
        </p>
      )}
    </form>
  );
}

function Row({ term, detail }: { term: string; detail: string }) {
  return (
    <>
      <dt>{term}</dt>
      <dd>{detail}</dd>
    </>
  );
}

/** The one line that records the outcome, from the spec's strings. */
export function decisionText(
  decision: Decision | undefined,
  { alwaysScope, correction }: { alwaysScope?: string; correction?: string },
  s: typeof APPROVAL_STRINGS = APPROVAL_STRINGS,
): string {
  switch (decision) {
    case "allow-once":
      return s.allowed;
    case "allow-always":
      return s.allowed_always.replace("{scope}", alwaysScope ?? "");
    case "deny":
      return correction
        ? s.denied_with.replace("{correction}", correction)
        : s.denied;
    case "timed-out":
      return s.timed_out;
    default:
      return "";
  }
}
