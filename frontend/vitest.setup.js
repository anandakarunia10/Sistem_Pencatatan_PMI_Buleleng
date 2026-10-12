import "@testing-library/jest-dom/vitest";
import { vi, expect } from "vitest";

// expose expect ke global (WAJIB untuk jest-dom)
global.expect = expect;

// mock fetch
global.fetch = vi.fn();

// mock router next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }) => children,
  },
}));

// mock loading component
vi.mock("@/components/loading/loading", () => ({
  default: () => "Loading...",
}));