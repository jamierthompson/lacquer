import { Suspense, use, useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

import { entry } from "./catalog.ts";
import { Contract } from "./Contract.tsx";
import { type Demo, demos, loadSpec } from "./demos.ts";

export function EntryPage() {
  const { id } = useParams();
  const row = entry(id);
  if (!row) return <p>No entry called “{id}”.</p>;
  const demo = demos[row.id];

  return (
    <article className="entry">
      <header className="entry-header">
        <p className="meta">
          {row.kind} · {row.catalog}/{row.group} · tier {row.tier} ·{" "}
          {row.status}
        </p>
        <h1>{row.name}</h1>
        <p className="summary">{row.summary}</p>
      </header>
      {demo ? (
        <Suspense fallback={<p className="meta">Loading the contract…</p>}>
          <Live id={row.id} demo={demo} />
        </Suspense>
      ) : (
        <p className="meta">No live demo yet.</p>
      )}
    </article>
  );
}

/** The element is, or is inside, a Lacquer component on the stage. */
const inComponent = (t: EventTarget | null): t is Element =>
  t instanceof Element && t.closest("[data-lacquer]") !== null;

function Live({ id, demo }: { id: string; demo: Demo }) {
  const spec = use(loadSpec(id, demo));
  const [current, setCurrent] = useState<string>();
  const [visited, setVisited] = useState<ReadonlySet<string>>(new Set());
  const visit = useCallback((state: string) => {
    setVisited((v) => (v.has(state) ? v : new Set(v).add(state)));
  }, []);
  const onStatus = useCallback(
    (status: string) => {
      setCurrent(status);
      visit(status);
    },
    [visit],
  );
  const react = spec.implementations?.find((i) => i.renderer === "react");
  const Stage = demo.component;

  // hover, focus-visible and active are reached by using the component, so
  // they are read off the stage rather than reported by the demo.
  const stage = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const hover = (e: PointerEvent) => inComponent(e.target) && visit("hover");
    const active = (e: PointerEvent) =>
      inComponent(e.target) && visit("active");
    const focus = (e: FocusEvent) =>
      inComponent(e.target) &&
      e.target.matches(":focus-visible") &&
      visit("focus-visible");
    el.addEventListener("pointerover", hover);
    el.addEventListener("pointerdown", active);
    el.addEventListener("focusin", focus);
    return () => {
      el.removeEventListener("pointerover", hover);
      el.removeEventListener("pointerdown", active);
      el.removeEventListener("focusin", focus);
    };
  }, [visit]);

  return (
    <>
      {react?.package && (
        <p className="meta">
          <code>
            {react.package}
            {react.export && `#${react.export}`}
          </code>
        </p>
      )}
      <div className="entry-grid">
        <section className="stage" aria-label="Live" ref={stage}>
          <Stage onStatus={onStatus} onVisit={visit} />
        </section>
        <aside className="contract" aria-label="Contract">
          <Contract entry={spec} current={current} visited={visited} />
        </aside>
      </div>
    </>
  );
}
