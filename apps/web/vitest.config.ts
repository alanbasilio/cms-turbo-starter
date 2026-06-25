import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Honor the `@/*` paths from tsconfig.json natively (Vitest 4+).
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    environmentOptions: { jsdom: { url: "http://localhost:3000" } },
    // Generated client code is exercised through tests, not unit-tested itself.
    exclude: ["**/node_modules/**", "src/generated/**"],
  },
});
