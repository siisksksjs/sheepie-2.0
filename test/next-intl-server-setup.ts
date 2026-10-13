import { vi } from "vitest";

// Pages call setRequestLocale (next-intl) to render statically. Under Vitest the
// react-client build of next-intl/server throws for it, so make it a no-op here.
vi.mock("next-intl/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next-intl/server")>();
  return { ...actual, setRequestLocale: () => {} };
});
