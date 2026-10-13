import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Client components that import the header/footer (directly or via the Navbar/Footer
// shims) pull the whole catalog into the browser bundle.
const CLIENT_FILES = ["faq/faq-client.tsx", "contact/contact-client.tsx", "blog/blog-list.tsx"];

describe("client components", () => {
  it.each(CLIENT_FILES)("%s does not import the site header, footer or their shims", (file) => {
    const source = readFileSync(join(process.cwd(), "app", "[locale]", file), "utf8");
    expect(source).toMatch(/^"use client";/);
    expect(source).not.toMatch(/components\/layout\/(navbar|footer)|components\/site\/site-(header|footer)|@\/lib\/catalog/);
  });
});
