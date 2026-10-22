import type { BindingRole, Bindings, CatalogComponent } from "@lacquer/core";
import bindings from "@lacquer/core/bindings.json" with { type: "json" };
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import {
  FOUNDATIONS,
  type Foundation,
  foundationBySlug,
} from "@/lib/foundations";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return FOUNDATIONS.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = foundationBySlug((await params).slug);
  if (!f) notFound();
  return { title: f.title, description: f.blurb };
}

export default async function FoundationPage({ params }: Props) {
  const f = foundationBySlug((await params).slug);
  if (!f) notFound();
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-lq-inset-sm text-sm">
        <Link
          href="/foundations"
          className="rounded-lq-sm text-lq-fg-muted hover:text-lq-fg-default"
        >
          Foundations
        </Link>
      </nav>
      {f.kind === "tokens" ? (
        <TokensFoundation f={f} bindings={bindings as Bindings} />
      ) : (
        <PrincipleFoundation f={f} spec={await loadSpec(f.id)} />
      )}
    </main>
  );
}

/**
 * The compiled spec, imported as JSON so the bundler carries it rather than
 * tracing a filesystem read into the server output. The id is one of a
 * closed list (lib/foundations.ts), so the template import stays resolvable.
 */
const loadSpec = async (id: string): Promise<CatalogComponent> =>
  (
    await import(`@lacquer/core/components/${id}.json`, {
      with: { type: "json" },
    })
  ).default as CatalogComponent;

// ---------------------------------------------------------------- tokens

type Role = BindingRole & { role: string; html: string; tailwind?: string };

/** The roles in the page's categories, in file order, with both bindings' names. */
function rolesOf(b: Bindings, categories: string[]): Role[] {
  return Object.entries(b.html.roles)
    .filter(([role]) => categories.includes(role.split(".")[0]))
    .map(([role, r]) => ({
      ...r,
      role,
      html: r.var,
      tailwind: b.tailwind.roles[role]?.class,
    }));
}

/** A role's value text per theme, from the compiled theme. */
const themeValue = (b: Bindings, r: Role, mode: "light" | "dark") =>
  b.theme[mode][r.html];

const PROSE: Record<string, ReactNode> = {
  color: (
    <>
      <p>
        A warm near-black, bone, and one accent hue. The neutrals are warmed;
        the one chromatic brand color is the accent, and links, the focus ring,
        and the AI accent are aliases of it. AI is signaled with the brand: no
        AI purple (LQ-STYLE-01).
      </p>
      <p>
        Every role is written in OKLCH, so the dark theme is the same hue at
        another lightness, not a second palette. A role that carries text or a
        control boundary declares what it is read against and the WCAG ratio it
        must clear; the build measures every pairing and fails on a miss. The
        table at the bottom shows that output, and is regenerated on every
        build.
      </p>
    </>
  ),
  type: (
    <>
      <p>
        The platform's sans for text and its monospace for anything that reads
        as code. A text style is one role (a weight, a size, a leading and a
        family together) that a component reads with a single <code>font</code>{" "}
        declaration, so a size can never be paired with the wrong leading.
      </p>
    </>
  ),
  space: (
    <p>
      Developer-tool density: a few insets, a few gaps, four control heights and
      two icon sizes. A control's padding is one shorthand role, block then
      inline, so every control in a row lines up. The prose measure caps an
      assistant message at 65 characters.
    </p>
  ),
  radius: (
    <p>
      Radius is named by what it is on: a control, a surface, a pill. Three
      elevations, all of them quiet. Borders that mark an input clear 3:1
      against the page; dividers do not need to. The focus ring is the brand
      color, two pixels, offset two, and it is never removed without a
      replacement (LQ-FOCUS-01).
    </p>
  ),
  motion: (
    <p>
      Two durations and one easing cover every state change; a spin and a pulse
      cover every wait. Streaming gets three sanctioned animations and nothing
      decorative. Every animation has a reduced-motion fallback: the base item
      collapses durations under <code>prefers-reduced-motion</code>, and the
      reduced-motion streaming principle says what replaces each.
    </p>
  ),
};

function TokensFoundation({
  f,
  bindings,
}: {
  f: Extract<Foundation, { kind: "tokens" }>;
  bindings: Bindings;
}) {
  const roles = rolesOf(bindings, f.categories);
  const groups = new Map<string, Role[]>();
  for (const r of roles) {
    const key = r.role.split(".").slice(0, 2).join(".");
    groups.set(key, [...(groups.get(key) ?? []), r]);
  }
  const contrast = bindings.contrast.filter((p) =>
    f.categories.includes(p.role.split(".")[0]),
  );
  return (
    <>
      <header className="mb-lq-inset-lg">
        <h1 className="text-3xl font-semibold tracking-tight">{f.title}</h1>
        <div className="mt-lq-inset-sm flex max-w-lq-measure-prose flex-col gap-lq-gap-sm leading-7 text-lq-fg-muted [&_code]:rounded-lq-sm [&_code]:bg-lq-bg-surface-tertiary [&_code]:px-1 [&_code]:font-lq-mono [&_code]:text-sm [&_code]:text-lq-fg-default">
          {PROSE[f.categories[0]]}
        </div>
      </header>
      {[...groups].map(([group, rs]) => (
        <section key={group} className="mb-lq-inset-lg">
          <h2 className="mb-lq-inset-sm font-lq-mono text-sm text-lq-fg-muted">
            {group}.*
          </h2>
          <ul className="flex flex-col divide-y divide-lq-border-subtle border-y border-lq-border-subtle">
            {rs.map((r) => (
              <li
                key={r.role}
                className="grid gap-lq-gap-sm py-lq-inset-sm sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] sm:items-center"
              >
                <div className="min-w-0">
                  <p className="font-lq-mono text-sm">{r.role}</p>
                  {r.description ? (
                    <p className="mt-1 text-sm text-lq-fg-muted">
                      {r.description}
                    </p>
                  ) : null}
                </div>
                <Specimen r={r} />
                <dl className="min-w-0 font-lq-mono text-xs text-lq-fg-muted">
                  <Value
                    label="light"
                    value={themeValue(bindings, r, "light")}
                  />
                  {themeValue(bindings, r, "dark") ? (
                    <Value
                      label="dark"
                      value={themeValue(bindings, r, "dark")}
                    />
                  ) : null}
                  <Value label="html" value={r.html} />
                  {r.tailwind ? (
                    <Value label="tailwind" value={r.tailwind} />
                  ) : null}
                </dl>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {contrast.length > 0 ? <ContrastTable pairings={contrast} /> : null}
    </>
  );
}

function Value({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-lq-gap-sm">
      <dt className="w-14 shrink-0">{label}</dt>
      <dd className="min-w-0 truncate text-lq-fg-default" title={value}>
        {value}
      </dd>
    </div>
  );
}

/** What a role looks like, read live through its own property, in both themes where it has two values. */
function Specimen({ r }: { r: Role }) {
  const v = `var(${r.html})`;
  switch (r.type) {
    case "color":
      return (
        <Modes>
          {(mode) => (
            <span
              className={cn(
                "block h-lq-control-sm w-full rounded-lq-sm border border-lq-border-subtle",
                mode,
              )}
              style={{ background: v }}
            />
          )}
        </Modes>
      );
    case "dimension":
      if (r.role.startsWith("radius"))
        return (
          <Box style={{ borderRadius: v }} className="h-lq-control-md w-24" />
        );
      if (r.role.startsWith("size.icon"))
        return <Box style={{ width: v, height: v }} />;
      if (r.role.startsWith("size.control"))
        return <Box style={{ height: v }} className="w-24" />;
      return <Bar style={{ width: v }} />;
    case "shorthand":
      return (
        <Box style={{ padding: v }} className="w-fit">
          <span className="block h-lq-icon-sm w-16 rounded-lq-sm bg-lq-bg-selected" />
        </Box>
      );
    case "typography":
      return (
        <p style={{ font: v }} className="truncate">
          The finishing school for AI-generated UI
        </p>
      );
    case "fontFamily":
      return (
        <p style={{ fontFamily: v }} className="truncate text-lg">
          Aa Bb Cc 0123 {"{}"} =&gt;
        </p>
      );
    case "shadow":
      return (
        <Modes>
          {(mode) => (
            <span
              className={cn(
                "block h-lq-control-md w-full rounded-lq-surface bg-lq-bg-surface-secondary",
                mode,
              )}
              style={{ boxShadow: v }}
            />
          )}
        </Modes>
      );
    case "duration":
      return (
        <span
          className="block h-lq-control-sm w-24 rounded-lq-sm bg-lq-bg-primary transition-transform ease-lq-standard hover:translate-x-lq-inset-md motion-reduce:transition-none"
          style={{ transitionDuration: v }}
          title="Hover: the transition runs at this duration"
        />
      );
    case "cubicBezier":
      return (
        <span
          className="block h-lq-control-sm w-24 rounded-lq-sm bg-lq-bg-primary transition-transform duration-lq-base hover:translate-x-lq-inset-md motion-reduce:transition-none"
          style={{ transitionTimingFunction: v }}
          title="Hover: the transition runs on this easing"
        />
      );
    case "number":
      if (r.role === "opacity.disabled")
        return (
          <span
            className="inline-flex h-lq-control-sm items-center rounded-lq-control bg-lq-bg-primary px-lq-inset-sm text-sm text-lq-fg-on-primary"
            style={{ opacity: v }}
          >
            Disabled
          </span>
        );
      if (r.role === "size.measure.prose")
        return <Bar style={{ width: v }} className="max-w-full" />;
      return null;
    default:
      return null;
  }
}

/** The same specimen in the light and the dark theme, each in its own scope. */
function Modes({
  children,
}: {
  children: (mode: "light" | "dark") => ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 gap-lq-gap-xs">
      {(["light", "dark"] as const).map((mode) => (
        <div
          key={mode}
          className={cn(
            mode,
            "rounded-lq-sm bg-lq-bg-surface p-lq-gap-xs",
            mode === "dark" ? "p-1" : "p-1",
          )}
        >
          {children(mode)}
        </div>
      ))}
    </div>
  );
}

const Box = ({
  style,
  className,
  children,
}: {
  style: CSSProperties;
  className?: string;
  children?: ReactNode;
}) => (
  <span
    className={cn(
      "block border border-lq-border-default bg-lq-bg-surface-secondary",
      className,
    )}
    style={style}
  >
    {children}
  </span>
);

const Bar = ({
  style,
  className,
}: {
  style: CSSProperties;
  className?: string;
}) => (
  <span
    className={cn(
      "block h-lq-icon-sm rounded-lq-sm bg-lq-bg-primary",
      className,
    )}
    style={style}
  />
);

function ContrastTable({ pairings }: { pairings: Bindings["contrast"] }) {
  // One row per (role, on); the two themes side by side.
  const rows = new Map<
    string,
    { role: string; on: string; min: number; light?: number; dark?: number }
  >();
  for (const p of pairings) {
    const key = `${p.role}|${p.on}|${p.min}`;
    const row = rows.get(key) ?? { role: p.role, on: p.on, min: p.min };
    row[p.context as "light" | "dark"] = p.ratio;
    rows.set(key, row);
  }
  const failed = pairings.filter((p) => !p.pass).length;
  return (
    <section className="mb-lq-inset-lg">
      <h2 className="text-xl font-semibold tracking-tight">Contrast, proven</h2>
      <p className="mt-2 max-w-lq-measure-prose text-sm leading-6 text-lq-fg-muted">
        {pairings.length} pairings the tokens declare, measured as WCAG 2.x
        ratios by the build. Text clears 4.5:1, a control boundary 3:1.{" "}
        {failed === 0 ? "All of them pass." : `${failed} fail.`}
      </p>
      <div className="mt-lq-inset-sm overflow-x-auto">
        <table className="w-full border-collapse font-lq-mono text-xs">
          <thead>
            <tr className="border-b border-lq-border-default text-left text-lq-fg-muted">
              <th className="py-2 pr-lq-gap-md font-normal">role</th>
              <th className="py-2 pr-lq-gap-md font-normal">on</th>
              <th className="py-2 pr-lq-gap-md text-right font-normal">
                floor
              </th>
              <th className="py-2 pr-lq-gap-md text-right font-normal">
                light
              </th>
              <th className="py-2 text-right font-normal">dark</th>
            </tr>
          </thead>
          <tbody>
            {[...rows.values()].map((row) => (
              <tr
                key={`${row.role}|${row.on}|${row.min}`}
                className="border-b border-lq-border-subtle"
              >
                <td className="py-1.5 pr-lq-gap-md">{row.role}</td>
                <td className="py-1.5 pr-lq-gap-md">{row.on}</td>
                <td className="py-1.5 pr-lq-gap-md text-right text-lq-fg-muted">
                  {row.min}:1
                </td>
                <Ratio value={row.light} min={row.min} />
                <Ratio value={row.dark} min={row.min} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const Ratio = ({ value, min }: { value?: number; min: number }) => (
  <td
    className={cn(
      "py-1.5 pr-lq-gap-md text-right last:pr-0",
      value !== undefined && value < min && "text-lq-status-error",
    )}
  >
    {value === undefined ? "" : `${value.toFixed(2)}:1`}
  </td>
);

// ---------------------------------------------------------------- principles

function PrincipleFoundation({
  f,
  spec,
}: {
  f: Extract<Foundation, { kind: "principle" }>;
  spec: CatalogComponent;
}) {
  const lists: { title: string; items?: string[] }[] = [
    { title: "Use when", items: spec.usage?.use_when },
    { title: "Avoid", items: spec.usage?.avoid_when },
    { title: "Pairs with", items: spec.usage?.pairs_well_with },
    { title: "Found in", items: spec.found_in },
    { title: "Also called", items: spec.aliases },
  ];
  return (
    <>
      <header className="mb-lq-inset-lg">
        <p className="font-lq-mono text-sm text-lq-accent-brand">
          {spec.kind} · {spec.status}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          {spec.name ?? f.title}
        </h1>
        {spec.summary ? (
          <p className="mt-lq-inset-sm max-w-lq-measure-prose leading-7 text-lq-fg-muted">
            {spec.summary}
          </p>
        ) : null}
      </header>
      {spec.anatomy?.length ? (
        <section className="mb-lq-inset-lg">
          <h2 className="mb-lq-inset-sm text-xl font-semibold tracking-tight">
            What it requires
          </h2>
          <ol className="grid gap-lq-gap-sm sm:grid-cols-2">
            {spec.anatomy.map((part, i) => (
              <li
                key={part.part}
                className="flex gap-lq-gap-sm rounded-lq-surface border border-lq-border-default bg-lq-bg-surface-secondary p-lq-inset-md"
              >
                <span className="font-lq-mono text-xs text-lq-accent-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-6">
                  {part.description ?? part.part}
                </p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
      {spec.accessibility?.notes ? (
        <section className="mb-lq-inset-lg">
          <h2 className="mb-lq-inset-sm text-xl font-semibold tracking-tight">
            Accessibility
          </h2>
          <p className="max-w-lq-measure-prose leading-7">
            {spec.accessibility.notes}
          </p>
        </section>
      ) : null}
      {spec.api?.interactions?.length ? (
        <section className="mb-lq-inset-lg">
          <h2 className="mb-lq-inset-sm text-xl font-semibold tracking-tight">
            Interactions
          </h2>
          <ul className="flex flex-wrap gap-lq-gap-xs">
            {spec.api.interactions.map((x) => (
              <li
                key={x}
                className="rounded-lq-pill border border-lq-border-default px-lq-inset-sm py-1 text-sm"
              >
                {x}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <section className="mb-lq-inset-lg grid gap-lq-gap-md sm:grid-cols-2">
        {lists
          .filter((l) => l.items?.length)
          .map((l) => (
            <div key={l.title}>
              <h2 className="mb-2 text-sm font-semibold">{l.title}</h2>
              <ul className="flex flex-col gap-1 text-sm text-lq-fg-muted">
                {(l.items as string[]).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ))}
      </section>
      {spec.usage?.exemplars?.length ? (
        <section className="mb-lq-inset-lg">
          <h2 className="mb-lq-inset-sm text-xl font-semibold tracking-tight">
            Exemplars
          </h2>
          <ul className="flex flex-col gap-lq-gap-xs text-sm leading-6">
            {spec.usage.exemplars.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {spec.sources?.length ? (
        <section className="mb-lq-inset-lg">
          <h2 className="mb-lq-inset-sm text-sm font-semibold">Sources</h2>
          <ul className="flex flex-col gap-1 text-sm">
            {spec.sources.map((s) => (
              <li key={s}>
                <a
                  href={s}
                  className="rounded-lq-sm break-all text-lq-fg-link underline-offset-4 hover:underline"
                >
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {spec.missing.length ? (
        <p className="border-t border-lq-border-subtle pt-lq-inset-sm text-xs text-lq-fg-muted">
          Draft. The spec still lacks {spec.missing.length} item
          {spec.missing.length === 1 ? "" : "s"} against the definition of done:{" "}
          {spec.missing.join(", ")}.
        </p>
      ) : null}
    </>
  );
}
