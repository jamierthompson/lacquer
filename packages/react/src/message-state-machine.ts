/**
 * Message state machine — the react implementation.
 * Spec: @lacquer/core, spec/catalog/ai/foundations/message-state-machine/message-state-machine.yaml
 *
 * The YAML is the contract. This module reads `machine` from the compiled
 * entry in @lacquer/core, so the transitions table here is the one in the
 * spec; the status and event unions below are checked against it when the
 * module loads and the import fails loudly if they ever disagree.
 *
 * The reducer is a lookup in that table (LQ-MACHINE-04): an event with no
 * row for the current status leaves the status unchanged. There is one
 * status value and nothing beside it (LQ-MACHINE-05); everything a component
 * needs (is the composer showing Stop? is the turn over?) is derived from it.
 */
import { useReducer } from "react";

import spec from "@lacquer/core/components/message-state-machine.json";

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
  "text-delta",
  "approval-requested",
  "approval-responded",
  "finish",
  "error",
  "stop",
  "retry",
  "regenerate",
] as const;
export type Event = (typeof EVENTS)[number];

export interface Transition {
  from: Status;
  on: Event;
  to: Status;
}

/** One row of the spec's `machine.states`: what the user sees in a status. */
export interface StatusDescription {
  id: Status;
  terminal: boolean;
  user_sees: string;
  composer_control: string;
  announcement: string;
}

const isStatus = (s: string): s is Status =>
  (STATUSES as readonly string[]).includes(s);
const isEvent = (e: string): e is Event =>
  (EVENTS as readonly string[]).includes(e);

function load() {
  const machine = spec.machine;
  const described = new Set<string>();
  const states: StatusDescription[] = machine.states.map((s) => {
    if (!isStatus(s.id)) throw new Error(`spec names unknown status ${s.id}`);
    described.add(s.id);
    return {
      id: s.id,
      terminal: s.terminal === true,
      user_sees: s.user_sees ?? "",
      composer_control: s.composer_control ?? "",
      announcement: s.announcement ?? "",
    };
  });
  for (const s of STATUSES)
    if (!described.has(s)) throw new Error(`spec does not describe ${s}`);
  const transitions: Transition[] = machine.transitions.map((t) => {
    if (!isStatus(t.from) || !isStatus(t.to) || !isEvent(t.on))
      throw new Error(`spec row ${t.from} →(${t.on}) ${t.to} is not typed`);
    return { from: t.from, on: t.on, to: t.to };
  });
  if (!isStatus(machine.initial))
    throw new Error(`spec initial ${machine.initial} is not a status`);
  return { initial: machine.initial, states, transitions };
}

const machine = load();

/** `machine.initial` from the spec. */
export const initial: Status = machine.initial;

/** `machine.transitions` from the spec, in spec order. */
export const transitions: readonly Transition[] = machine.transitions;

/** `machine.states` from the spec, in spec order. */
export const states: readonly StatusDescription[] = machine.states;

/**
 * The reducer. A lookup in the transitions table and nothing else: an event
 * with no row for the current status is ignored (LQ-MACHINE-04).
 */
export function transition(status: Status, event: Event): Status {
  const row = transitions.find((t) => t.from === status && t.on === event);
  return row ? row.to : status;
}

/** The events the table accepts from a status, in spec order. */
export const eventsFrom = (status: Status): Event[] =>
  transitions.filter((t) => t.from === status).map((t) => t.on);

/** The spec's description of a status. */
export const describe = (status: Status): StatusDescription =>
  states.find((s) => s.id === status)!;

/** complete, error or cancelled: the turn is over. */
export const isTerminal = (status: Status): boolean =>
  describe(status).terminal;

/**
 * submitted, streaming:* or awaiting-approval: the composer shows Stop
 * (LQ-MACHINE-02). Derived, never stored (LQ-MACHINE-05).
 */
export const isPending = (status: Status): boolean =>
  status !== initial && !isTerminal(status);

/** The status after replaying a sequence of events from `start`. */
export const replay = (events: readonly Event[], start: Status = initial) =>
  events.reduce(transition, start);

/**
 * One status per thread, held in React state. Components receive the status
 * as a prop and render from it; nothing reads message text (LQ-MACHINE-01).
 */
export function useMessageMachine(start: Status = initial) {
  return useReducer(transition, start);
}
