import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const brand = (name: string) => join(process.cwd(), "public", "brand", name);

describe("brand assets", () => {
  it.each(["mendung-white.png", "mendung-sky.png", "mendung-ink.png"])(
    "ships the %s pattern tile small enough to repeat cheaply",
    (name) => {
      expect(existsSync(brand(name))).toBe(true);
      expect(statSync(brand(name)).size).toBeLessThan(120_000);
    },
  );

  it.each(["mendung-white", "mendung-sky", "mendung-ink"])(
    "ships a WebP %s tile smaller than its PNG fallback",
    (name) => {
      const webp = brand(`${name}.webp`);
      expect(existsSync(webp)).toBe(true);
      expect(statSync(webp).size).toBeLessThan(statSync(brand(`${name}.png`)).size);
    },
  );

  it.each(["lamb-blue.png", "lamb-white.png", "icesilk.jpg"])("ships %s", (name) => {
    expect(existsSync(brand(name))).toBe(true);
    expect(statSync(brand(name)).size).toBeGreaterThan(5_000);
  });
});
