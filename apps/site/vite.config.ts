import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  // Serve the catalog as static files, so every reference page and example
  // in packages/core/spec/catalog opens at /catalog/... with its relative
  // link to /bindings/html.theme.css intact.
  publicDir: "../../packages/core/spec",
});
