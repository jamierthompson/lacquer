import { Link } from "react-router";

import { entries } from "./catalog.ts";
import { demos } from "./demos.ts";

export function Index() {
  return (
    <section>
      <h1>Catalog</h1>
      <p>
        {entries.length} entries. An entry with a React implementation links to
        its page.
      </p>
      <ul className="entries">
        {entries.map((c) => (
          <li key={c.id}>
            {demos[c.id] ? (
              <Link to={`/${c.id}`}>{c.name}</Link>
            ) : (
              <span>{c.name}</span>
            )}{" "}
            <small className="meta">
              {c.kind} · {c.status}
            </small>
          </li>
        ))}
      </ul>
    </section>
  );
}
