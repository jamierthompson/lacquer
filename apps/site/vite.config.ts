import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  // The site imports what it needs from @lacquer/core and @lacquer/react; it
  // serves no static files of its own.
  publicDir: false,
});
