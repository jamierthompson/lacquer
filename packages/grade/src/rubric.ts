import type { Rubric } from "@lacquer/core";

/** The rubric dimension a rule id belongs to: an exact id beats a prefix. Mirrors core's build check. */
export function dimensionOf(rubric: Rubric, ruleId: string): string | null {
  let best: { name: string; length: number } | null = null;
  for (const [name, d] of Object.entries(rubric.dimensions))
    for (const prefix of d.rule_prefixes)
      if (
        (ruleId === prefix || ruleId.startsWith(`${prefix}-`)) &&
        (!best || prefix.length > best.length)
      )
        best = { name, length: prefix.length };
  return best?.name ?? null;
}
