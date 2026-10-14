import { Link, Outlet } from "react-router";

export function Layout() {
  return (
    <>
      <header className="site-header">
        <Link to="/" className="site-name">
          Lacquer
        </Link>
        <span className="site-tagline">
          The finishing school for AI-generated UI
        </span>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
    </>
  );
}
