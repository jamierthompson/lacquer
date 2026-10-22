import spec from "@lacquer/core/components/message-state-machine.json" with { type: "json" };
import { describe, expect, it } from "vitest";

import {
  EVENTS,
  eventsFrom,
  initial,
  isPending,
  isTerminal,
  replay,
  STATUSES,
  TERMINAL,
  TRANSITIONS,
  transition,
} from "../../registry/lacquer/foundations/message-state-machine/message-state-machine";

const key = (t: { from: string; on: string; to: string }) =>
  `${t.from} --${t.on}--> ${t.to}`;

// The module ships the table so consumers never need the spec; this is what
// keeps the two identical. The grader runs the same comparison.
describe("the table is the spec's", () => {
  it("has the spec's statuses, in the spec's order", () => {
    expect([...STATUSES]).toEqual(spec.machine.states.map((s) => s.id));
    expect(initial).toBe(spec.machine.initial);
  });

  it("marks terminal exactly the statuses the spec does", () => {
    expect([...TERMINAL].sort()).toEqual(
      spec.machine.states
        .filter((s) => s.terminal)
        .map((s) => s.id)
        .sort(),
    );
  });

  it("has the spec's events", () => {
    expect([...EVENTS].sort()).toEqual(
      spec.api.events.map((e) => e.name).sort(),
    );
  });

  it("has the spec's transitions, row for row", () => {
    expect(TRANSITIONS.map(key)).toEqual(spec.machine.transitions.map(key));
  });
});

describe("the reducer is a lookup (LQ-MACHINE-04)", () => {
  it("changes status only on a listed (from, on) pair", () => {
    for (const from of STATUSES)
      for (const on of EVENTS) {
        const row = TRANSITIONS.find((t) => t.from === from && t.on === on);
        expect(transition(from, on)).toBe(row ? row.to : from);
      }
  });

  it("reaches every status from idle", () => {
    const seen = new Set<string>([initial]);
    const queue = [initial];
    while (queue.length) {
      const s = queue.shift();
      if (s === undefined) break;
      for (const on of eventsFrom(s)) {
        const to = transition(s, on);
        if (!seen.has(to)) {
          seen.add(to);
          queue.push(to);
        }
      }
    }
    expect([...seen].sort()).toEqual([...STATUSES].sort());
  });

  it("derives pending and terminal from the status alone (LQ-MACHINE-05)", () => {
    expect(isPending("idle")).toBe(false);
    expect(isPending("submitted")).toBe(true);
    expect(isPending("awaiting-approval")).toBe(true);
    for (const s of TERMINAL) {
      expect(isTerminal(s)).toBe(true);
      expect(isPending(s)).toBe(false);
    }
  });

  it("replays a turn", () => {
    expect(
      replay(["send", "reasoning-delta", "tool-input-start", "text-delta"]),
    ).toBe("streaming:text");
    expect(replay(["send", "text-delta", "finish", "regenerate"])).toBe(
      "submitted",
    );
    expect(replay(["send", "finish"])).toBe("submitted");
  });
});
