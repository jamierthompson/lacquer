/**
 * The module checks against the registry's message state machine, and
 * against a mutated copy, so a table that drifts from the spec is a MUST
 * finding and not a silent pass.
 */
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { loadComponent, loadRules } from "@lacquer/core";
import { describe, expect, it } from "vitest";
import { checkMachine } from "../src/checks/machine.ts";
import { gradeComponent } from "../src/grade.ts";
import { rulesFor } from "../src/rules.ts";
import { subjectsFor } from "../src/subject.ts";

const REPO = path.resolve(import.meta.dirname, "../../..");
const spec = await loadComponent("message-state-machine");
const rules = rulesFor(spec, (await loadRules()).rules);

describe("message-state-machine", () => {
  it("grades the registry module as finished", async () => {
    const [{ subject, report }] = await gradeComponent(
      "message-state-machine",
      REPO,
    );
    expect(subject.kind).toBe("module");
    expect(report.findings).toEqual([]);
    expect(report.rules.find((r) => r.id === "LQ-MACHINE-04")).toMatchObject({
      verdict: "pass",
      how: "runtime",
    });
    expect(report.rules.find((r) => r.id === "LQ-MACHINE-05")).toMatchObject({
      verdict: "pass",
      how: "static",
    });
    expect(report.rules.find((r) => r.id === "LQ-MACHINE-01")?.verdict).toBe(
      "skipped",
    );
    expect(report.states.map((s) => s.status)).toEqual(Array(7).fill("pass"));
    expect(report.score.letter).toBe("A");
  });

  it("fails a module whose table drifts from the spec", async () => {
    const [subject] = await subjectsFor(spec, REPO);
    if (subject.kind !== "module") throw new Error("expected a module subject");
    const dir = await mkdtemp(path.join(tmpdir(), "lq-machine-"));
    const file = path.join(dir, "message-state-machine.ts");
    const src = await readFile(subject.file, "utf8");
    // Drop a row and add a branch beside the table.
    const mutated = src
      .replace(
        `  { from: "streaming:text", to: "complete", on: "finish" },\n`,
        "",
      )
      .replace(
        "export function transition(status: Status, event: Event): Status {",
        'export function transition(status: Status, event: Event): Status {\n  if (status === "error" && event === "finish") return "complete";',
      );
    expect(mutated).not.toBe(src);
    await writeFile(file, mutated);
    const hook = path.join(dir, "use.ts");
    await writeFile(
      hook,
      'import { useState } from "react";\nexport const isLoading = useState(false);\n',
    );
    const result = await checkMachine(
      spec,
      { ...subject, file, files: [file, hook] },
      rules,
      "x.ts",
    );
    const ids = result.findings.map((f) => f.rule);
    expect(ids).toContain("LQ-MACHINE-04");
    expect(ids).toContain("LQ-MACHINE-05");
    const table = result.findings.find((f) =>
      f.message.includes("transitions table"),
    );
    expect(table?.evidence).toContain(
      "missing: streaming:text --finish--> complete",
    );
    const reducer = result.findings.find((f) =>
      f.message.includes("outside the table"),
    );
    expect(reducer?.evidence).toContain("error --finish--> complete");
  });
});
