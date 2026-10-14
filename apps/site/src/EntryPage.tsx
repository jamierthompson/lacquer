import { Suspense, use, useCallback, useState } from "react";
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

function Live({ id, demo }: { id: string; demo: Demo }) {
  const spec = use(loadSpec(id, demo));
  const [current, setCurrent] = useState<string>();
  const [visited, setVisited] = useState<ReadonlySet<string>>(new Set());
  const onStatus = useCallback((status: string) => {
    setCurrent(status);
    setVisited((v) => (v.has(status) ? v : new Set(v).add(status)));
  }, []);
  const react = spec.implementations?.find((i) => i.renderer === "react");
  const Stage = demo.component;

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
        <section className="stage" aria-label="Live">
          <Stage onStatus={onStatus} />
        </section>
        <aside className="contract" aria-label="Contract">
          <Contract entry={spec} current={current} visited={visited} />
        </aside>
      </div>
    </>
  );
}
