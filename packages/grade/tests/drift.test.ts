import { describe, expect, it } from "vitest";
import { drift, gate, same } from "../src/drift.ts";
import type { Report } from "../src/report.ts";

const base = (): Report => ({
  version: 1,
  mode: "runtime",
  generated_at: "2026-10-22T00:00:00.000Z",
  component: "button",
  subject: { kind: "url", file: "x.html" },
  detected: [],
  states: [
    { id: "enabled", required: true, status: "pass" },
    { id: "hover", required: true, status: "pass" },
    { id: "selected", required: false, status: "skipped" },
  ],
  rules: [
    { id: "LQ-STATE-01", level: "MUST", dimension: "states", verdict: "pass" },
    {
      id: "LQ-COPY-01",
      level: "SHOULD",
      dimension: "content",
      verdict: "skipped",
    },
  ],
  score: {
    overall: 100,
    letter: "A",
    dimensions: { states: 100, content: 100 },
  },
  findings: [],
  summary: "",
});

describe("the gate", () => {
  it("fails on any MUST finding and passes otherwise", () => {
    const r = base();
    expect(gate(r)).toEqual([]);
    r.findings.push({
      id: "LQ-STATE-01#1",
      rule: "LQ-STATE-01",
      level: "MUST",
      dimension: "states",
      component: "button",
      message: "",
      instances: 1,
    });
    expect(gate(r)).toEqual(["gate: 1 MUST finding (LQ-STATE-01)"]);
  });
});

describe("drift against the baseline", () => {
  it("is quiet when nothing regressed, even if the timestamp moved", () => {
    const a = base();
    const b = { ...base(), generated_at: "2026-10-23T00:00:00.000Z" };
    expect(drift(a, b)).toEqual([]);
    expect(same(a, b)).toBe(true);
  });

  it("names a lost state, a rule that now fails and a lower dimension", () => {
    const a = base();
    const b = base();
    b.states[1] = {
      id: "hover",
      required: true,
      status: "fail",
      findings: ["LQ-STATE-01#1"],
    };
    b.rules[0] = { ...b.rules[0], verdict: "fail", findings: 1 };
    b.score = {
      overall: 88,
      letter: "B",
      dimensions: { states: 75, content: 100 },
    };
    expect(drift(a, b)).toEqual([
      "state hover: was pass, now fail",
      "rule LQ-STATE-01: was pass, now fail (1 finding)",
      "dimension states: was 100, now 75",
      "overall: was 100, now 88",
    ]);
  });

  it("treats a skipped rule that now runs and passes as no drift", () => {
    const a = base();
    const b = base();
    b.rules[1] = {
      ...b.rules[1],
      verdict: "pass",
      how: "runtime",
      findings: 0,
    };
    expect(drift(a, b)).toEqual([]);
    expect(same(a, b)).toBe(false);
  });

  it("reports a rule that passed and is now skipped or gone", () => {
    const a = base();
    const skipped = base();
    skipped.rules[0] = {
      ...skipped.rules[0],
      verdict: "skipped",
      reason: "check removed",
    };
    expect(drift(a, skipped)).toEqual([
      "rule LQ-STATE-01: was pass, now skipped (check removed)",
    ]);
    const gone = base();
    gone.rules = gone.rules.filter((r) => r.id !== "LQ-STATE-01");
    expect(drift(a, gone)).toEqual([
      "rule LQ-STATE-01: was pass, now absent from the report",
    ]);
  });

  it("reports a state the spec dropped", () => {
    const a = base();
    const b = base();
    b.states = b.states.filter((s) => s.id !== "hover");
    expect(drift(a, b)).toEqual([
      "state hover: was pass, now absent from the spec",
    ]);
  });
});
