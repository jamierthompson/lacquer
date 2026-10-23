/**
 * The runtime checks over a rendered subject: every instance of the
 * component on the page, driven through the states the spec names. One
 * function per rule, keyed by id, so the report can say which rules ran
 * and which were skipped. Everything the functions share (the driven
 * states, the instances) is computed once and memoised on the context.
 */
import path from "node:path";
import type { CatalogComponent, Rule, Vocab } from "@lacquer/core";
import type { Locator } from "playwright";
import { contrast, isTransparent, luminance } from "../colour.ts";
import {
  COLOUR_PROPERTIES,
  NON_VISUAL_PROPERTIES,
  type PageDriver,
  type Snapshot,
} from "../drivers/page.ts";
import type { Finding } from "../finding.ts";
import type { StateCoverage } from "../report.ts";

/** The axe rule tags: WCAG 2.0/2.1/2.2 AA plus best practice, as the site's e2e uses. */
export const AXE_TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

export interface PageContext {
  driver: PageDriver;
  spec: CatalogComponent;
  vocab: Vocab;
  /** Repo-relative path of the page, for findings. */
  file: string;
  /** Absolute path of the html theme, for fragments. */
  instances: Locator[];
  /** How the instances were found. */
  detection: "data-lacquer" | "heuristic";
  /** Memo: the enabled instance and the driven states. */
  _enabled?: Locator | null;
  _driven?: Driven[];
}

export interface Driven {
  id: string;
  required: boolean;
  /** How the grader reached the state. */
  how: string;
  /**
   * The state whose snapshot this one's treatment is measured against:
   * `enabled` for most, `hover` for active, since the pointer is still over
   * the element while it is pressed and the hover treatment is already on.
   */
  against: string;
  /** Styles in the state, when it could be reached; the grader's own scaffolding (an injected part) removed. */
  snapshot?: Snapshot;
  /** The page shows an instance in this state (attribute states), or the state was driven. */
  demonstrated: boolean;
  reason?: string;
}

// ---------------------------------------------------------------- instances

/** `[data-lacquer="<id>"]`, or the spec's root element and its ARIA role as a heuristic for bare fragments. */
export async function findInstances(
  driver: PageDriver,
  spec: CatalogComponent,
): Promise<{ instances: Locator[]; detection: PageContext["detection"] }> {
  const tagged = await driver.pin(`[data-lacquer="${spec.id}"]`);
  if (tagged.length) return { instances: tagged, detection: "data-lacquer" };
  const root = spec.anatomy?.find((p) => p.part === "root");
  const role = spec.accessibility?.role?.match(/^[a-z]+/)?.[0];
  const selectors = [
    root?.element,
    role ? `[role="${role}"]` : null,
    "[onclick]",
  ].filter((s): s is string => Boolean(s));
  const found = await driver.pin(selectors.join(", "));
  return { instances: found, detection: "heuristic" };
}

/**
 * The attribute expressions that express a state, from the vocab, with the
 * one the spec's accessibility.aria names first (button's selected is
 * aria-pressed, a listbox option's is aria-selected).
 */
const expressions = (ctx: PageContext, state: string): string[] => {
  const all = ctx.vocab.states[state]?.attribute ?? [];
  const named = new Set(
    (ctx.spec.accessibility?.aria ?? []).map((a) => a.attr),
  );
  return [...all].sort(
    (a, b) =>
      Number(named.has(b.split("=")[0])) - Number(named.has(a.split("=")[0])),
  );
};

/** A CSS selector for "carries this expression". */
const attributeSelector = (x: string) => {
  const [name, value] = x.split("=");
  return value === undefined ? `[${name}]` : `[${name}="${value}"]`;
};

/** The first instance that is in no attribute state: the enabled fixture. */
async function enabledInstance(ctx: PageContext): Promise<Locator | null> {
  if (ctx._enabled !== undefined) return ctx._enabled;
  const all = Object.values(ctx.vocab.states)
    .flatMap((s) => s.attribute ?? [])
    .map(attributeSelector);
  for (const el of ctx.instances) {
    const inState = await el.evaluate(
      (root, sels) => sels.some((s) => root.matches(s)),
      all,
    );
    if (!inState) {
      ctx._enabled = el;
      return el;
    }
  }
  ctx._enabled = null;
  return null;
}

// ---------------------------------------------------------------- states

/** The part the grader injects while driving loading, when the anatomy has one. */
const INJECTED_PART = "spinner";

/** The spec's loading markup, when the anatomy has a spinner part: what an implementation adds while loading. */
const loadingMarkup = (spec: CatalogComponent) =>
  spec.anatomy?.some((p) => p.part === INJECTED_PART)
    ? `<span data-slot="${INJECTED_PART}" aria-hidden="true"></span>`
    : undefined;

/**
 * A snapshot without the part the grader injected: the scaffolding is not
 * the implementation's treatment, so it must not count as one. A loading
 * state whose only difference from enabled is the grader's own spinner has
 * no treatment.
 */
const withoutInjected = (s: Snapshot): Snapshot => {
  const { [INJECTED_PART]: _, ...rest } = s;
  return rest;
};

/** Reach every state the spec names on the enabled instance and read its styles. */
async function driveStates(ctx: PageContext): Promise<Driven[]> {
  if (ctx._driven) return ctx._driven;
  const { driver, spec } = ctx;
  const enabled = await enabledInstance(ctx);
  const out: Driven[] = [];
  const base = enabled ? await driver.snapshot(enabled) : undefined;
  for (const s of spec.states ?? []) {
    const required = s.required !== false;
    const v = ctx.vocab.states[s.id];
    if (s.id === "enabled") {
      out.push({
        id: s.id,
        required,
        how: "default",
        against: s.id,
        snapshot: base,
        demonstrated: Boolean(enabled),
        reason: enabled ? undefined : "no instance is in the enabled state",
      });
      continue;
    }
    if (!enabled) {
      out.push({
        id: s.id,
        required,
        how: v?.input ?? v?.attribute?.[0] ?? "",
        against: "enabled",
        demonstrated: false,
        reason: "no enabled instance to drive",
      });
      continue;
    }
    if (v?.input) {
      const how = `input: ${v.input}`;
      let snapshot: Snapshot | undefined;
      let reason: string | undefined;
      if (v.input === "hover")
        snapshot = await driver.hover(enabled, () => driver.snapshot(enabled));
      else if (v.input === "press")
        snapshot = await driver.press(enabled, () => driver.snapshot(enabled));
      else if (v.input === "keyboard-focus")
        snapshot = await driver.keyboardFocus(enabled, async (landed) => {
          if (!landed) reason = "Tab does not reach the element";
          return driver.snapshot(enabled);
        });
      out.push({
        id: s.id,
        required,
        how,
        // Pressing keeps the pointer over the element, so the hover
        // treatment is on; active has to differ from hover, not from enabled.
        against: v.input === "press" ? "hover" : "enabled",
        snapshot,
        demonstrated: !reason,
        reason,
      });
      continue;
    }
    if (v?.attribute?.length) {
      const attrs = expressions(ctx, s.id);
      const selectors = attrs.map(attributeSelector);
      let demonstrated = 0;
      for (const el of ctx.instances)
        if (
          await el.evaluate(
            (root, sels: string[]) => sels.some((x) => root.matches(x)),
            selectors,
          )
        )
          demonstrated++;
      // An optional state the page does not show is not driven: the
      // treatment belongs to the component that uses it (a toggle button).
      const markup = s.id === "loading" ? loadingMarkup(spec) : undefined;
      const snapshot =
        demonstrated > 0 || required
          ? await driver.withAttributes(
              enabled,
              [attrs[0]],
              async () => {
                const snap = await driver.snapshot(enabled);
                return markup ? withoutInjected(snap) : snap;
              },
              markup,
            )
          : undefined;
      out.push({
        id: s.id,
        required,
        how: `attribute: ${attrs[0]}`,
        against: "enabled",
        snapshot,
        demonstrated: demonstrated > 0,
        reason:
          demonstrated > 0
            ? undefined
            : required
              ? "no instance on the page carries the state's attribute"
              : "optional and not demonstrated",
      });
      continue;
    }
    out.push({
      id: s.id,
      required,
      how: "",
      against: "enabled",
      demonstrated: false,
      reason: "the vocab gives this state no attribute and no input",
    });
  }
  ctx._driven = out;
  return out;
}

export interface Delta {
  part: string;
  property: string;
  from: string;
  to: string;
}

/** What changed between two snapshots, ignoring non-visual properties. */
export function diff(a: Snapshot, b: Snapshot): Delta[] {
  const out: Delta[] = [];
  for (const part of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[part] ?? {};
    const y = b[part] ?? {};
    for (const property of new Set([...Object.keys(x), ...Object.keys(y)])) {
      if (NON_VISUAL_PROPERTIES.has(property)) continue;
      if ((x[property] ?? "") !== (y[property] ?? ""))
        out.push({
          part,
          property,
          from: x[property] ?? "",
          to: y[property] ?? "",
        });
    }
  }
  return out;
}

/** Would the change survive a grayscale screenshot? A non-colour change, or a colour change in luminance. */
export function survivesGrayscale(deltas: Delta[]): boolean {
  for (const d of deltas) {
    if (!COLOUR_PROPERTIES.has(d.property)) return true;
    const ta = isTransparent(d.from);
    const tb = isTransparent(d.to);
    if (ta !== tb) return true;
    if (ta && tb) continue;
    const la = luminance(d.from);
    const lb = luminance(d.to);
    if (la !== null && lb !== null && Math.abs(la - lb) > 0.005) return true;
  }
  return false;
}

const describe = (deltas: Delta[]) =>
  deltas
    .slice(0, 4)
    .map((d) => `${d.part}.${d.property}: ${d.from} → ${d.to}`)
    .join("; ") + (deltas.length > 4 ? ` (+${deltas.length - 4})` : "");

// ---------------------------------------------------------------- checks

type Check = (ctx: PageContext, rule: Rule) => Promise<Finding[]>;

const at = (ctx: PageContext, selector?: string) => ({
  file: ctx.file,
  selector,
});

const stateFinding = (
  ctx: PageContext,
  rule: Rule,
  state: string,
  message: string,
  evidence: string,
): Finding => ({
  rule: rule.id,
  component: ctx.spec.id,
  state,
  message,
  location: at(ctx, `[data-lacquer="${ctx.spec.id}"]`),
  evidence,
});

/** The snapshot a driven state's treatment is measured against, when both were reached. */
const reference = (driven: Driven[], d: Driven): Snapshot | undefined =>
  driven.find((x) => x.id === d.against)?.snapshot;

const STATE_01: Check = async (ctx, rule) => {
  const driven = await driveStates(ctx);
  const out: Finding[] = [];
  for (const d of driven) {
    const base = reference(driven, d);
    if (d.id === d.against || !d.snapshot || !base) continue;
    if (diff(base, d.snapshot).length === 0)
      out.push(
        stateFinding(
          ctx,
          rule,
          d.id,
          `The ${d.id} state has no visual treatment: nothing differs from ${d.against}.`,
          `${d.how}; computed styles of the root and its parts are identical to ${d.against}`,
        ),
      );
  }
  return out;
};

const STATE_02: Check = async (ctx, rule) => {
  const driven = await driveStates(ctx);
  const out: Finding[] = [];
  for (const d of driven) {
    const base = reference(driven, d);
    if (d.id === d.against || !d.snapshot || !base) continue;
    const deltas = diff(base, d.snapshot);
    if (deltas.length && !survivesGrayscale(deltas))
      out.push(
        stateFinding(
          ctx,
          rule,
          d.id,
          `The ${d.id} state is expressed by hue alone; in grayscale it is the ${d.against} state.`,
          describe(deltas),
        ),
      );
  }
  return out;
};

const STATE_03: Check = async (ctx, rule) => {
  const driven = await driveStates(ctx);
  const out: Finding[] = [];
  for (const d of driven) {
    const attr = expressions(ctx, d.id);
    if (!attr.length || !d.required || d.demonstrated) continue;
    out.push(
      stateFinding(
        ctx,
        rule,
        d.id,
        `The ${d.id} state is required and no instance carries its attribute (${attr.join(" or ")}).`,
        `${ctx.instances.length} instance(s), none matching ${attr.map(attributeSelector).join(", ")}`,
      ),
    );
  }
  return out;
};

const FOCUS_01: Check = async (ctx, rule) => {
  const driven = await driveStates(ctx);
  const base = driven.find((d) => d.id === "enabled")?.snapshot;
  const focus = driven.find((d) => d.id === "focus-visible");
  const enabled = await enabledInstance(ctx);
  if (!base || !focus?.snapshot || !enabled) return [];
  const root = focus.snapshot.root;
  const ringless =
    (root["outline-style"] === "none" ||
      parseFloat(root["outline-width"]) === 0) &&
    root["box-shadow"] === base.root["box-shadow"];
  if (ringless)
    return [
      stateFinding(
        ctx,
        rule,
        "focus-visible",
        "Keyboard focus has no visible ring: the outline is removed and no box-shadow replaces it.",
        `outline-style ${root["outline-style"]}, outline-width ${root["outline-width"]}, box-shadow unchanged`,
      ),
    ];
  if (root["outline-style"] === "none") return [];
  const out: Finding[] = [];
  const page = await ctx.driver.pageBackground(enabled);
  const vsPage = contrast(root["outline-color"], page);
  if (vsPage < 3)
    out.push(
      stateFinding(
        ctx,
        rule,
        "focus-visible",
        `The focus ring is ${vsPage.toFixed(2)}:1 against the page; it needs 3:1.`,
        `outline-color ${root["outline-color"]} on ${page}`,
      ),
    );
  const offset = parseFloat(root["outline-offset"]) || 0;
  const bg = root["background-color"];
  if (offset < 1 && !isTransparent(bg)) {
    const vsComponent = contrast(root["outline-color"], bg);
    if (vsComponent < 3)
      out.push(
        stateFinding(
          ctx,
          rule,
          "focus-visible",
          `The focus ring sits on the component (offset ${root["outline-offset"]}) at ${vsComponent.toFixed(2)}:1; it needs 3:1.`,
          `outline-color ${root["outline-color"]} on ${bg}`,
        ),
      );
  }
  return out;
};

/** The root is the spec's native element and the keyboard activates it. */
async function nativeElement(ctx: PageContext, rule: Rule): Promise<Finding[]> {
  const element = ctx.spec.anatomy?.find((p) => p.part === "root")?.element;
  if (!element) return [];
  const out: Finding[] = [];
  const wrong: string[] = [];
  for (const el of ctx.instances) {
    const tag = await el.evaluate((root) => root.tagName.toLowerCase());
    if (tag !== element) wrong.push(`<${tag}>`);
  }
  if (wrong.length)
    out.push({
      rule: rule.id,
      component: ctx.spec.id,
      message: `The root is not the native <${element}>: ${[...new Set(wrong)].join(", ")} with a handler instead.`,
      location: at(ctx),
      evidence: `${wrong.length} of ${ctx.instances.length} instance(s)`,
      instances: wrong.length,
    });
  const enabled = await enabledInstance(ctx);
  if (enabled) {
    const clicks = await ctx.driver.countClicks(enabled, async () => {
      await enabled.focus().catch(() => {});
      await ctx.driver.page.keyboard.press("Enter");
      await ctx.driver.page.keyboard.press("Space");
    });
    if (clicks < 2)
      out.push({
        rule: rule.id,
        component: ctx.spec.id,
        state: "focus-visible",
        message:
          "Enter and Space do not both activate the control from the keyboard.",
        location: at(ctx),
        evidence: `${clicks} activation(s) from Enter + Space; a native <${element}> gives 2`,
      });
  }
  return out;
}

const SEM_01: Check = (ctx, rule) => nativeElement(ctx, rule);
const BUTTON_01: Check = (ctx, rule) => nativeElement(ctx, rule);

/** Instances whose accessible name is empty. */
async function unnamed(
  ctx: PageContext,
): Promise<{ el: Locator; iconOnly: boolean }[]> {
  const out: { el: Locator; iconOnly: boolean }[] = [];
  for (const el of ctx.instances) {
    const name = await ctx.driver.accessibleName(el);
    if (name.trim()) continue;
    const iconOnly = await el.evaluate(
      (root) =>
        !root.textContent?.trim() && Boolean(root.querySelector("svg, img")),
    );
    out.push({ el, iconOnly });
  }
  return out;
}

const NAME_01: Check = async (ctx, rule) => {
  const list = await unnamed(ctx);
  if (!list.length) return [];
  return [
    {
      rule: rule.id,
      component: ctx.spec.id,
      message: `${list.length} instance(s) have no accessible name.`,
      location: at(ctx),
      evidence: "the accessible name computes to empty",
      instances: list.length,
    },
  ];
};

const BUTTON_05: Check = async (ctx, rule) => {
  const list = (await unnamed(ctx)).filter((x) => x.iconOnly);
  if (!list.length) return [];
  return [
    {
      rule: rule.id,
      component: ctx.spec.id,
      message: `${list.length} icon-only instance(s) have no accessible name.`,
      location: at(ctx),
      evidence: "the only child is an icon and no aria-label is set",
      instances: list.length,
    },
  ];
};

const ANAT_01: Check = async (ctx, rule) => {
  const parts = (ctx.spec.anatomy ?? []).filter(
    (p) => p.part !== "root" && p.required !== false,
  );
  const missing: string[] = [];
  for (const p of parts) {
    let found = false;
    for (const el of ctx.instances)
      if ((await el.locator(`[data-slot="${p.part}"]`).count()) > 0) {
        found = true;
        break;
      }
    if (!found) missing.push(p.part);
  }
  if (!missing.length) return [];
  return [
    {
      rule: rule.id,
      component: ctx.spec.id,
      message: `Required part(s) ${missing.join(", ")} render with no data-slot in any instance.`,
      location: at(ctx),
      evidence: `looked for [data-slot="${missing.join('"], [data-slot="')}"] in ${ctx.instances.length} instance(s)`,
      instances: missing.length,
    },
  ];
};

/** The rule's stoplist: labels that do not say what happens. */
const STOPLIST = new Set(["ok", "okay", "yes", "no", "submit", "click here"]);

const COPY_01: Check = async (ctx, rule) => {
  const bad: string[] = [];
  for (const el of ctx.instances) {
    const name = (await ctx.driver.accessibleName(el)).trim();
    if (STOPLIST.has(name.toLowerCase().replace(/[.!…]+$/, ""))) bad.push(name);
  }
  if (!bad.length) return [];
  return [
    {
      rule: rule.id,
      component: ctx.spec.id,
      message: `Label(s) ${bad.map((b) => `"${b}"`).join(", ")} do not say what happens.`,
      location: at(ctx),
      evidence: "matches the stoplist (OK, Yes, No, Submit, Click here)",
      instances: bad.length,
    },
  ];
};

const BUTTON_02: Check = async (ctx, rule) => {
  const out: Finding[] = [];
  const enabled = await enabledInstance(ctx);
  const { driver } = ctx;
  if (enabled) {
    const before = (await enabled.boundingBox())?.width ?? 0;
    const busy = expressions(ctx, "loading");
    const disabled = expressions(ctx, "disabled").filter((x) =>
      x.startsWith("aria-"),
    );
    await driver.withAttributes(
      enabled,
      [...busy, ...disabled],
      async () => {
        await driver.wait();
        const during = (await enabled.boundingBox())?.width ?? 0;
        if (Math.abs(during - before) > 0.5)
          out.push(
            stateFinding(
              ctx,
              rule,
              "loading",
              `Loading changes the button's width from ${before.toFixed(1)}px to ${during.toFixed(1)}px; the label and everything beside it shift.`,
              `width before ${before.toFixed(1)}px, during ${during.toFixed(1)}px`,
            ),
          );
        const clicks = await driver.countClicks(enabled, async () => {
          await enabled.click({ force: true, timeout: 1000 }).catch(() => {});
          await enabled.focus().catch(() => {});
          await driver.page.keyboard.press("Enter");
        });
        if (clicks > 0)
          out.push(
            stateFinding(
              ctx,
              rule,
              "loading",
              "A press while loading reaches the handler; re-submission is not blocked.",
              `${clicks} activation(s) from a click and Enter during loading`,
            ),
          );
      },
      loadingMarkup(ctx.spec),
    );
  }
  // An instance captured mid-load that swapped its label for the spinner.
  let swapped = 0;
  for (const el of ctx.instances) {
    const hit = await el.evaluate((root) => {
      const animated = [...root.querySelectorAll("*")].some(
        (e) => getComputedStyle(e).animationName !== "none",
      );
      const busy = root.getAttribute("aria-busy") === "true";
      const text = Boolean(root.textContent?.trim());
      return animated && (!busy || !text);
    });
    if (hit) swapped++;
  }
  if (swapped)
    out.push(
      stateFinding(
        ctx,
        rule,
        "loading",
        `${swapped} instance(s) show a spinner without aria-busy or without their label.`,
        'an animated descendant with no aria-busy="true" on the root, or no text left in it',
      ),
    );
  return out;
};

const BUTTON_03: Check = async (ctx, rule) => {
  const views = await ctx.driver.page.evaluate((id) => {
    const VIEW =
      'dialog, [role="dialog"], main, section, article, aside, nav, form, [role="region"]';
    const counts = new Map<Element, number>();
    for (const el of document.querySelectorAll(
      `[data-lacquer="${id}"][data-emphasis="primary"]`,
    )) {
      const view = el.parentElement?.closest(VIEW) ?? document.body;
      counts.set(view, (counts.get(view) ?? 0) + 1);
    }
    return [...counts].map(([view, n]) => ({
      view: view.tagName.toLowerCase() + (view.id ? `#${view.id}` : ""),
      n,
    }));
  }, ctx.spec.id);
  return views
    .filter((v) => v.n > 1)
    .map((v) => ({
      rule: rule.id,
      component: ctx.spec.id,
      message: `${v.n} primary buttons in one view (${v.view}); a view has at most one.`,
      location: at(ctx, v.view),
      evidence: `[data-emphasis="primary"] × ${v.n} under ${v.view}`,
      instances: v.n,
    }));
};

const MOTION_02: Check = async (ctx, rule) => {
  const enabled = await enabledInstance(ctx);
  if (!enabled) return [];
  const { driver } = ctx;
  const out: Finding[] = [];
  await driver.reducedMotion(true);
  try {
    const busy = expressions(ctx, "loading");
    const seen = await driver.withAttributes(
      enabled,
      busy,
      () =>
        enabled.evaluate((root) => {
          const moving: string[] = [];
          for (const a of root.getAnimations({ subtree: true })) {
            if (a.playState !== "running") continue;
            const effect = a.effect as KeyframeEffect | null;
            const frames = effect?.getKeyframes?.() ?? [];
            const props = new Set(
              frames.flatMap((f) =>
                Object.keys(f).filter(
                  (k) =>
                    ![
                      "offset",
                      "easing",
                      "composite",
                      "computedOffset",
                    ].includes(k),
                ),
              ),
            );
            const movement = [...props].filter((p) =>
              /^(transform|translate|rotate|scale|offset|top|left|right|bottom|inset|margin|width|height|block-size|inline-size)/.test(
                p,
              ),
            );
            if (movement.length)
              moving.push(
                `${(a as CSSAnimation).animationName ?? "animation"} (${movement.join(", ")})`,
              );
          }
          const transition = getComputedStyle(root)
            .transitionDuration.split(",")
            .map((d) => parseFloat(d) * (d.trim().endsWith("ms") ? 1 : 1000))
            .filter((d) => d > 150);
          return { moving, transition };
        }),
      loadingMarkup(ctx.spec),
    );
    if (seen.moving.length)
      out.push(
        stateFinding(
          ctx,
          rule,
          "loading",
          "Under prefers-reduced-motion a movement animation still runs.",
          seen.moving.join("; "),
        ),
      );
    if (seen.transition.length)
      out.push(
        stateFinding(
          ctx,
          rule,
          "enabled",
          `Under prefers-reduced-motion a transition of ${Math.max(...seen.transition)}ms still runs.`,
          `transition-duration ${seen.transition.join(", ")}ms`,
        ),
      );
  } finally {
    await driver.reducedMotion(false);
  }
  return out;
};

const A11Y_02: Check = async (ctx, rule) => {
  const violations = await ctx.driver.axe(AXE_TAGS);
  return violations.map((v) => ({
    rule: rule.id,
    component: ctx.spec.id,
    message: `axe ${v.id}: ${v.help}.`,
    location: at(ctx, v.nodes[0]),
    evidence: `${v.impact || "violation"}; ${v.nodes.length} node(s): ${v.nodes.slice(0, 3).join(", ")}${v.nodes.length > 3 ? ", …" : ""}; ${v.helpUrl}`,
    instances: v.nodes.length,
  }));
};

/** The checks the grader can run on a rendered page, by rule id. */
export const PAGE_CHECKS: Record<string, Check> = {
  "LQ-STATE-01": STATE_01,
  "LQ-STATE-02": STATE_02,
  "LQ-STATE-03": STATE_03,
  "LQ-FOCUS-01": FOCUS_01,
  "LQ-SEM-01": SEM_01,
  "LQ-NAME-01": NAME_01,
  "LQ-ANAT-01": ANAT_01,
  "LQ-COPY-01": COPY_01,
  "LQ-MOTION-02": MOTION_02,
  "LQ-A11Y-02": A11Y_02,
  "LQ-BUTTON-01": BUTTON_01,
  "LQ-BUTTON-02": BUTTON_02,
  "LQ-BUTTON-03": BUTTON_03,
  "LQ-BUTTON-05": BUTTON_05,
};

/**
 * The coverage grid rows, from the driven states alone: demonstrated or
 * not. A demonstrated state starts as `pass`; `assemble` turns it into
 * `fail` once findings have ids and some name the state.
 */
export async function coverage(ctx: PageContext): Promise<StateCoverage[]> {
  const driven = await driveStates(ctx);
  return driven.map((d) => ({
    id: d.id,
    required: d.required,
    status: !d.demonstrated ? (d.required ? "missing" : "skipped") : "pass",
    how: d.how || undefined,
    reason: d.reason,
  }));
}

export const relative = (repo: string, file: string) =>
  path.relative(repo, file).split(path.sep).join("/");
