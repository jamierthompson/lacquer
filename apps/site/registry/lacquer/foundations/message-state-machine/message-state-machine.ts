/**
 * Message state machine: the assistant-turn lifecycle every AI component
 * renders from. Spec: packages/core/spec/catalog/ai/foundations/
 * message-state-machine/message-state-machine.yaml (the `machine` block).
 *
 * The transitions table lives here, in the file consumers install, so the
 * module has no dependency on the spec. A test in the repo asserts it equals
 * the spec's table row for row, and the grader runs the same check, so the
 * two cannot drift.
 *
 * The reducer is a lookup in the table and nothing else (LQ-MACHINE-04): an
 * event with no row for the current status leaves the status unchanged.
 * There is one status value and nothing beside it (LQ-MACHINE-05); whether
 * the composer shows Stop, whether the turn is over, is derived from it.
 */

export const STATUSES = [
  "idle",
  "submitted",
  "streaming:reasoning",
  "streaming:tool",
  "streaming:text",
  "awaiting-approval",
  "complete",
  "error",
  "cancelled",
] as const;
export type Status = (typeof STATUSES)[number];

export const EVENTS = [
  "send",
  "reasoning-delta",
  "tool-input-start",
  "approval-requested",
  "approval-responded",
  "text-delta",
  "finish",
  "error",
  "stop",
  "retry",
  "regenerate",
] as const;
export type Event = (typeof EVENTS)[number];

export interface Transition {
  from: Status;
  to: Status;
  on: Event;
}

/** Where a thread starts. */
export const initial: Status = "idle";

/** The statuses in which the turn is over and the composer shows Send. */
export const TERMINAL: ReadonlySet<Status> = new Set<Status>([
  "complete",
  "error",
  "cancelled",
]);

/**
 * The whole contract: a status changes only through one of these rows
 * (from, on) → to. Keep it identical to the spec's `machine.transitions`.
 */
export const TRANSITIONS: readonly Transition[] = [
  { from: "idle", to: "submitted", on: "send" },
  { from: "submitted", to: "streaming:reasoning", on: "reasoning-delta" },
  { from: "submitted", to: "streaming:tool", on: "tool-input-start" },
  { from: "submitted", to: "streaming:text", on: "text-delta" },
  { from: "streaming:reasoning", to: "streaming:tool", on: "tool-input-start" },
  { from: "streaming:reasoning", to: "streaming:text", on: "text-delta" },
  { from: "streaming:tool", to: "awaiting-approval", on: "approval-requested" },
  { from: "awaiting-approval", to: "streaming:tool", on: "approval-responded" },
  { from: "streaming:tool", to: "streaming:text", on: "text-delta" },
  { from: "streaming:tool", to: "streaming:tool", on: "tool-input-start" },
  { from: "streaming:text", to: "streaming:tool", on: "tool-input-start" },
  { from: "streaming:text", to: "complete", on: "finish" },
  { from: "streaming:tool", to: "complete", on: "finish" },
  { from: "submitted", to: "error", on: "error" },
  { from: "streaming:reasoning", to: "error", on: "error" },
  { from: "streaming:tool", to: "error", on: "error" },
  { from: "streaming:text", to: "error", on: "error" },
  { from: "submitted", to: "cancelled", on: "stop" },
  { from: "streaming:reasoning", to: "cancelled", on: "stop" },
  { from: "streaming:tool", to: "cancelled", on: "stop" },
  { from: "streaming:text", to: "cancelled", on: "stop" },
  { from: "awaiting-approval", to: "cancelled", on: "stop" },
  { from: "complete", to: "submitted", on: "regenerate" },
  { from: "error", to: "submitted", on: "retry" },
  { from: "cancelled", to: "submitted", on: "regenerate" },
  { from: "complete", to: "submitted", on: "send" },
  { from: "error", to: "submitted", on: "send" },
  { from: "cancelled", to: "submitted", on: "send" },
];

/**
 * The reducer. A lookup in the table: the row for (status, event) gives the
 * next status, and no row means the event is ignored.
 */
export function transition(status: Status, event: Event): Status {
  for (const row of TRANSITIONS)
    if (row.from === status && row.on === event) return row.to;
  return status;
}

/** The events the table accepts from a status, in table order. */
export const eventsFrom = (status: Status): Event[] =>
  TRANSITIONS.filter((t) => t.from === status).map((t) => t.on);

/** complete, error or cancelled: the turn is over. */
export const isTerminal = (status: Status): boolean => TERMINAL.has(status);

/**
 * submitted, streaming:* or awaiting-approval: a turn is in flight and the
 * composer shows Stop (LQ-MACHINE-02). Derived, never stored.
 */
export const isPending = (status: Status): boolean =>
  status !== initial && !isTerminal(status);

/** The status after replaying a sequence of events from `start`. */
export const replay = (
  events: readonly Event[],
  start: Status = initial,
): Status => events.reduce(transition, start);
