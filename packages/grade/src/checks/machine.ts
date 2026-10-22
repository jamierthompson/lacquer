/**
 * The module checks: a registry lib imported in Node and exercised
 * directly. Today that is the message state machine, whose contract is the
 * `machine` block of its spec: the table in the module must be the spec's
 * table (LQ-MACHINE-04, static), the reducer must change the status only on
 * a listed (from, on) pair (LQ-MACHINE-04, runtime), and nothing may be
 * stored beside the status (LQ-MACHINE-05). State coverage for a principle
 * is reachability: every state the spec names can be reached from initial.
 */
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import type { CatalogComponent, Rule } from "@lacquer/core";
import type { Finding } from "../finding.ts";
import type { StateCoverage } from "../report.ts";
import type { Subject } from "../subject.ts";

interface MachineModule {
  STATUSES: readonly string[];
  EVENTS: readonly string[];
  TRANSITIONS: readonly { from: string; to: string; on: string }[];
  initial: string;
  transition(status: string, event: string): string;
}

const key = (t: { from: string; on: string; to: string }) =>
  `${t.from} --${t.on}--> ${t.to}`;

export interface ModuleResult {
  findings: Finding[];
  verdicts: Record<string, { how: "static" | "runtime" }>;
  states: StateCoverage[];
}

export async function checkMachine(
  spec: CatalogComponent,
  subject: Extract<Subject, { kind: "module" }>,
  rules: Rule[],
  file: string,
): Promise<ModuleResult> {
  const machine = spec.machine;
  if (!machine) throw new Error(`${spec.id} has no machine block`);
  const mod = (await import(pathToFileURL(subject.file).href)) as MachineModule;
  const findings: Finding[] = [];
  const verdicts: ModuleResult["verdicts"] = {};
  const ids = new Set(rules.map((r) => r.id));
  const at = { file };

  if (ids.has("LQ-MACHINE-04")) {
    verdicts["LQ-MACHINE-04"] = { how: "runtime" };
    const specRows = machine.transitions.map(key);
    const modRows = mod.TRANSITIONS.map(key);
    const missing = specRows.filter((r) => !modRows.includes(r));
    const extra = modRows.filter((r) => !specRows.includes(r));
    if (missing.length || extra.length)
      findings.push({
        rule: "LQ-MACHINE-04",
        component: spec.id,
        message: "The module's transitions table is not the spec's.",
        location: at,
        evidence: [
          missing.length ? `missing: ${missing.join("; ")}` : "",
          extra.length ? `extra: ${extra.join("; ")}` : "",
        ]
          .filter(Boolean)
          .join(" | "),
        instances: missing.length + extra.length,
      });
    const specStates = machine.states.map((s) => s.id);
    if (
      [...mod.STATUSES].sort().join() !== [...specStates].sort().join() ||
      mod.initial !== (machine.initial ?? specStates[0])
    )
      findings.push({
        rule: "LQ-MACHINE-04",
        component: spec.id,
        message: "The module's statuses or initial status are not the spec's.",
        location: at,
        evidence: `module: ${mod.STATUSES.join(", ")} from ${mod.initial}; spec: ${specStates.join(", ")} from ${machine.initial}`,
      });
    const deviations: string[] = [];
    for (const from of mod.STATUSES)
      for (const on of mod.EVENTS) {
        const row = machine.transitions.find(
          (t) => t.from === from && t.on === on,
        );
        const expected = row ? row.to : from;
        const got = mod.transition(from, on);
        if (got !== expected)
          deviations.push(`${from} --${on}--> ${got} (table: ${expected})`);
      }
    if (deviations.length)
      findings.push({
        rule: "LQ-MACHINE-04",
        component: spec.id,
        message: "The reducer changes the status outside the table.",
        location: at,
        evidence: deviations.slice(0, 6).join("; "),
        instances: deviations.length,
      });
  }

  if (ids.has("LQ-MACHINE-05")) {
    verdicts["LQ-MACHINE-05"] = { how: "static" };
    for (const f of subject.files) {
      const src = await readFile(f, "utf8");
      const hits = [
        ...src.matchAll(
          /\buseState\s*\(|\b(is(Loading|Streaming|Pending|Running|Done)|done)\s*[:=]\s*(true|false|useState)/g,
        ),
      ];
      if (hits.length)
        findings.push({
          rule: "LQ-MACHINE-05",
          component: spec.id,
          message: "A boolean lives beside the status.",
          location: { file: f },
          evidence: hits.map((h) => h[0]).join(", "),
          instances: hits.length,
        });
    }
  }

  // Coverage: every state the spec names is reachable from initial. A spec
  // state names a machine status or a family of them (streaming → streaming:*).
  const reachable = new Set<string>([mod.initial]);
  const queue = [mod.initial];
  while (queue.length) {
    const s = queue.shift() as string;
    for (const on of mod.EVENTS) {
      const to = mod.transition(s, on);
      if (!reachable.has(to)) {
        reachable.add(to);
        queue.push(to);
      }
    }
  }
  const states: StateCoverage[] = (spec.states ?? []).map((s) => {
    const statuses = mod.STATUSES.filter(
      (x) => x === s.id || x.startsWith(`${s.id}:`),
    );
    const ok = statuses.length > 0 && statuses.every((x) => reachable.has(x));
    return {
      id: s.id,
      required: s.required !== false,
      status: ok ? "pass" : "missing",
      how: statuses.length ? `status: ${statuses.join(", ")}` : undefined,
      reason: ok ? undefined : "not reachable from initial through the table",
    };
  });

  return { findings, verdicts, states };
}
