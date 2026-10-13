export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "id";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "id" || value === "en";
}
