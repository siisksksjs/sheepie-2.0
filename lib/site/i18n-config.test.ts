import { describe, expect, it } from "vitest";

import { defaultLocale, isLocale, locales } from "@/i18n/config";

describe("locale config", () => {
  it("serves Indonesian first", () => {
    expect(defaultLocale).toBe("id");
    expect(locales).toEqual(["id", "en"]);
  });

  it("recognises only supported locales", () => {
    expect(isLocale("id")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});
