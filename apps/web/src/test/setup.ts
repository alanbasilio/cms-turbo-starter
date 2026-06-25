import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// React Testing Library doesn't auto-clean without globals; do it explicitly.
afterEach(() => {
  cleanup();
});
