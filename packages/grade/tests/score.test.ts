import { loadRubric } from "@lacquer/core";
import { describe, expect, it } from "vitest";
import type { Finding } from "../src/finding.ts";
import { deduction, letterOf, score } from "../src/score.ts";

const rubric = await loadRubric();
const f = (
  rule: string,
  level: Finding["level"],
  dimension: string,
  instances = 1,
): Finding => ({
  rule,
  level,
  dimension,
  component: "button",
  message: "",
  instances,
});
const ran = (ids: [string, string][]) =>
  ids.map(([id, dimension]) => ({
    id,
    level: "MUST" as const,
    dimension,
    verdict: "pass" as const,
  }));

describe("the rubric's arithmetic", () => {
  it("deducts per level, then per extra instance up to the cap", () => {
    expect(deduction("MUST", 1, rubric)).toBe(25);
    expect(deduction("MUST", 3, rubric)).toBe(29);
    expect(deduction("MUST", 20, rubric)).toBe(35);
    expect(deduction("SHOULD", 2, rubric)).toBe(10);
    expect(deduction("MAY", 50, rubric)).toBe(0);
  });

  it("maps overall to a letter at the rubric's thresholds", () => {
    expect(letterOf(100, rubric)).toBe("A");
    expect(letterOf(90, rubric)).toBe("A");
    expect(letterOf(89, rubric)).toBe("B");
    expect(letterOf(65, rubric)).toBe("C");
    expect(letterOf(50, rubric)).toBe("D");
    expect(letterOf(0, rubric)).toBe("F");
  });

  it("scores only the dimensions in which a rule ran", () => {
    const s = score(
      [],
      ran([
        ["LQ-STATE-01", "states"],
        ["LQ-TOKEN-01", "tokens"],
      ]),
      rubric,
    );
    expect(s).toEqual({
      overall: 100,
      letter: "A",
      dimensions: { states: 100, tokens: 100 },
    });
  });

  it("weights the mean and caps at C on a MUST in a gate dimension", () => {
    const verdicts = ran([
      ["LQ-FOCUS-01", "accessibility"],
      ["LQ-TOKEN-01", "tokens"],
    ]);
    const s = score(
      [f("LQ-FOCUS-01", "MUST", "accessibility")],
      verdicts,
      rubric,
    );
    // accessibility 75 at weight 1.2, tokens 100 at 0.8 -> 85 -> B, capped to C.
    expect(s.dimensions).toEqual({ accessibility: 75, tokens: 100 });
    expect(s.overall).toBe(85);
    expect(s.letter).toBe("C");
    expect(s.capped).toBe(true);
  });

  it("caps at C on a MUST in states: an untreated state is never an A", () => {
    const verdicts = ran([
      ["LQ-STATE-01", "states"],
      ["LQ-TOKEN-01", "tokens"],
    ]);
    const s = score([f("LQ-STATE-01", "MUST", "states")], verdicts, rubric);
    // states 75 at weight 1.0, tokens 100 at 0.8 -> 86 -> B, capped to C.
    expect(s.overall).toBe(86);
    expect(s.letter).toBe("C");
    expect(s.capped).toBe(true);
  });

  it("does not cap on a MUST outside the gate dimensions", () => {
    const verdicts = ran([
      ["LQ-TOKEN-01", "tokens"],
      ["LQ-STATE-01", "states"],
    ]);
    const s = score([f("LQ-TOKEN-01", "MUST", "tokens")], verdicts, rubric);
    // tokens 75 at weight 0.8, states 100 at 1.0 -> 89 -> B, and no cap.
    expect(s.overall).toBe(89);
    expect(s.letter).toBe("B");
    expect(s.capped).toBeUndefined();
  });

  it("floors a dimension at zero", () => {
    const findings = [
      f("LQ-STATE-01", "MUST", "states", 30),
      f("LQ-STATE-02", "MUST", "states", 30),
      f("LQ-STATE-03", "MUST", "states", 30),
    ];
    const s = score(findings, ran([["LQ-STATE-01", "states"]]), rubric);
    expect(s.dimensions.states).toBe(0);
    expect(s.letter).toBe("F");
  });
});
