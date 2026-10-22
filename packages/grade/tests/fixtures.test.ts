/**
 * The anti-examples are the grader's negative fixtures: each cites the
 * rules it breaks, and every cited rule the grader can execute must fire
 * on it. The reference implementation is the positive fixture: zero MUST
 * findings, every required state passing.
 */
import path from "node:path";
import { loadComponent, resolvePath } from "@lacquer/core";
import { describe, expect, it } from "vitest";
import { PAGE_CHECKS } from "../src/checks/page.ts";
import { gradeComponent, gradeFragment } from "../src/grade.ts";

const REPO = path.resolve(import.meta.dirname, "../../..");
const spec = await loadComponent("button");
/** The rules the grader implements for a page subject, static ones included. */
const implemented = new Set([
  ...Object.keys(PAGE_CHECKS),
  "LQ-TOKEN-01",
  "LQ-TOKEN-02",
]);

describe("button's anti-examples fail the rules they cite", () => {
  for (const anti of spec.examples?.anti ?? []) {
    const executable = (anti.violates ?? []).filter((r) => implemented.has(r));
    it(`${anti.id}: ${executable.join(", ")}`, async () => {
      const file = resolvePath(path.join(spec.path, anti.file));
      const report = await gradeFragment("button", file, REPO);
      const fired = new Set(report.findings.map((f) => f.rule));
      for (const rule of executable)
        expect(fired, `${rule} should fire`).toContain(rule);
      expect(report.findings.some((f) => f.level === "MUST")).toBe(true);
      expect(report.score.letter).not.toBe("A");
    }, 60_000);
  }
});

describe("button's reference is finished", () => {
  it("has zero MUST findings and every required state passing", async () => {
    const [{ report }] = await gradeComponent("button", REPO);
    expect(report.findings.filter((f) => f.level === "MUST")).toEqual([]);
    for (const s of report.states.filter((x) => x.required))
      expect(s.status, s.id).toBe("pass");
    expect(report.rules.filter((r) => r.verdict === "fail")).toEqual([]);
    expect(report.detected[0]).toMatchObject({
      id: "button",
      how: "data-lacquer",
    });
  }, 90_000);
});
