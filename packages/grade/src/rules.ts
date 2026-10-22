/**
 * Which rules a subject is graded against, and why a rule the grader cannot
 * execute is skipped.
 *
 * An entry is graded against its resolved rules (the shared rules it cites
 * plus its local ones) and, when it is a rendered component, against every
 * universal rule whose `applies_to` names it: `*`, its group, or its id.
 * A rule in that set that no check implements for the subject's kind is
 * reported as skipped with the reason; it is never dropped.
 */
import type { CatalogComponent, Rule } from "@lacquer/core";

export type SubjectKind = "page" | "module";

/** Does a shared rule's applies_to name this entry? */
export function appliesTo(rule: Rule, spec: CatalogComponent): boolean {
  const targets = rule.applies_to ?? [];
  if (targets.includes(spec.id)) return true;
  if (targets.includes(`group:${spec.group}`)) return true;
  // `*` means every interactive component; a principle or a pattern renders nothing itself.
  return targets.includes("*") && spec.kind === "component";
}

/** The rules the subject is graded against, cited and local first, universal after, unique by id. */
export function rulesFor(spec: CatalogComponent, catalog: Rule[]): Rule[] {
  const out = new Map<string, Rule>();
  for (const r of spec.rules.resolved) out.set(r.id, r);
  for (const r of catalog)
    if (r.owner === "shared" && !out.has(r.id) && appliesTo(r, spec))
      out.set(r.id, r);
  return [...out.values()];
}

/**
 * Why a rule is skipped for a subject the grader cannot execute it on. The
 * key is the rule id, or `kind:<id>` when the reason depends on the subject.
 */
export const SKIP_REASONS: Record<string, string> = {
  "LQ-BUTTON-04":
    "Needs a press handler to inspect; the html reference has none. Lands with the React implementation.",
  "LQ-BUTTON-06":
    "Needs a form whose validity the button is bound to; none in the subject.",
  "LQ-MACHINE-01":
    "A consumer rule: checked on the components that render from the machine, not on the machine.",
  "LQ-MACHINE-02":
    "A consumer rule: the composer is what wires Stop and Regenerate; checked on composer.",
  "LQ-MACHINE-03":
    "A consumer rule: checked on message, which keeps the partial output.",
  "LQ-RECOVER-01":
    "A consumer rule: checked on composer and message, which render the controls.",
  "LQ-ERR-01":
    "A consumer rule: checked on composer and message, which hold the draft and the error.",
  "LQ-A11Y-01":
    "A consumer rule: live regions belong to the components that stream; checked there.",
  "LQ-STYLE-01":
    "Needs the AI accent role resolved against the brand; the token build proves the alias, the grader does not read it yet.",
  "module:LQ-TOKEN-02": "The module has no styles, so it consumes no role.",
};

export function skipReason(rule: Rule, kind: SubjectKind): string {
  return (
    SKIP_REASONS[`${kind}:${rule.id}`] ??
    SKIP_REASONS[rule.id] ??
    `The grader has no check for this rule against a ${kind === "page" ? "rendered page" : "module"} yet; its detect clause is ${rule.detect?.runtime ? "runtime" : rule.detect?.static ? "static" : "unspecified"}.`
  );
}
