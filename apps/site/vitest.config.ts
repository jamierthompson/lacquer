import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const alias = { "@": fileURLToPath(new URL(".", import.meta.url)) };

export default defineConfig({
  resolve: { alias },
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["tests/unit/**/*.test.ts"],
          environment: "node",
        },
      },
      {
        plugins: [react()],
        resolve: { alias },
        test: {
          name: "component",
          include: ["tests/component/**/*.test.tsx"],
          environment: "jsdom",
          setupFiles: ["tests/setup.ts"],
        },
      },
    ],
  },
});
