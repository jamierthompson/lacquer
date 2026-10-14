import catalog from "@lacquer/core/catalog.json";

// Entry paths in the catalog are relative to packages/core; the site serves
// packages/core/spec as its public directory, so strip that first segment.
const url = (entryPath: string, file: string) =>
  `/${entryPath.replace(/^spec\//, "")}/${file}`;

export default function App() {
  return (
    <main>
      <h1>Lacquer</h1>
      <p>
        {catalog.counts.total} entries. Entries with an HTML reference link to
        it.
      </p>
      <ul>
        {catalog.components.map((c) => {
          const html = c.implementations?.find((i) => i.renderer === "html");
          return (
            <li key={c.id}>
              {html ? <a href={url(c.path, html.file)}>{c.id}</a> : c.id}{" "}
              <small>{c.status}</small>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
