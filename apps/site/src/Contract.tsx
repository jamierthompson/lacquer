import type { CatalogComponent, Rule } from "@lacquer/core";

interface Props {
  entry: CatalogComponent;
  /** The status the stage is showing right now. */
  current?: string;
  /** Every status the stage has shown this session. */
  visited: ReadonlySet<string>;
}

/**
 * The entry's contract, read from dist/components/<id>.json and shown beside
 * the live component: lifecycle, states, rules and token roles. States tick
 * off as the stage reaches them.
 */
export function Contract({ entry, current, visited }: Props) {
  // A `states` id like `streaming` is reached by any `streaming:*` status.
  const seen = (id: string) =>
    visited.has(id) || [...visited].some((v) => v.split(":")[0] === id);
  const isCurrent = (id: string) =>
    current === id || current?.split(":")[0] === id;
  const rules = entry.rules.resolved;
  const required = rules.filter((r) => r.polarity === "require");
  const forbidden = rules.filter((r) => r.polarity === "forbid");

  return (
    <>
      {entry.machine && (
        <section>
          <h2>Lifecycle</h2>
          <p className="meta">
            {[...visited].length} of {entry.machine.states.length} states
            reached.
          </p>
          <table className="contract-table">
            <thead>
              <tr>
                <th scope="col">State</th>
                <th scope="col">Composer</th>
                <th scope="col">Announcement</th>
              </tr>
            </thead>
            <tbody>
              {entry.machine.states.map((s) => (
                <tr
                  key={s.id}
                  data-seen={visited.has(s.id) || undefined}
                  aria-current={current === s.id ? "true" : undefined}
                >
                  <th scope="row">
                    <Tick on={visited.has(s.id)} />
                    <code>{s.id}</code>
                    {s.terminal && <small> terminal</small>}
                  </th>
                  <td>{s.composer_control}</td>
                  <td>{s.announcement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {entry.states?.length ? (
        <section>
          <h2>States</h2>
          <table className="contract-table">
            <thead>
              <tr>
                <th scope="col">State</th>
                <th scope="col">Treatment</th>
                <th scope="col">A11y</th>
              </tr>
            </thead>
            <tbody>
              {entry.states.map((s) => (
                <tr
                  key={s.id}
                  data-seen={seen(s.id) || undefined}
                  aria-current={isCurrent(s.id) ? "true" : undefined}
                >
                  <th scope="row">
                    <Tick on={seen(s.id)} />
                    <code>{s.id}</code>
                  </th>
                  <td>{s.treatment}</td>
                  <td>{s.a11y}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      <section>
        <h2>Rules</h2>
        {required.length > 0 && (
          <>
            <h3>Required</h3>
            <ul className="rules">
              {required.map((r) => (
                <RuleItem key={r.id} rule={r} />
              ))}
            </ul>
          </>
        )}
        {forbidden.length > 0 && (
          <>
            <h3>Forbidden</h3>
            <ul className="rules">
              {forbidden.map((r) => (
                <RuleItem key={r.id} rule={r} />
              ))}
            </ul>
          </>
        )}
      </section>

      {(entry.tokens?.defines?.length || entry.tokens?.consumes?.length) && (
        <section>
          <h2>Token roles</h2>
          {entry.tokens?.defines?.length ? (
            <p>
              <span className="meta">Defines </span>
              {entry.tokens.defines.map((t) => (
                <code key={t} className="chip">
                  {t}
                </code>
              ))}
            </p>
          ) : null}
          {entry.tokens?.consumes?.length ? (
            <p>
              <span className="meta">Consumes </span>
              {entry.tokens.consumes.map((t) => (
                <code key={t} className="chip">
                  {t}
                </code>
              ))}
            </p>
          ) : null}
        </section>
      )}
    </>
  );
}

function Tick({ on }: { on: boolean }) {
  return (
    <span className="tick" data-on={on || undefined} aria-hidden="true">
      {on ? "✓" : "○"}
    </span>
  );
}

function RuleItem({ rule }: { rule: Rule }) {
  return (
    <li>
      <code>{rule.id}</code> <small className="meta">{rule.level}</small>
      {rule.title && <strong> {rule.title}.</strong>} {rule.statement}
      {rule.owner === "shared" && <small className="meta"> (shared)</small>}
    </li>
  );
}
