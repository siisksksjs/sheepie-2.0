import { describe, expect, it } from "vitest";

import { excerpt, getReviews } from "./reviews";

describe("reviews", () => {
  it("returns the three bio testimonials per product", () => {
    for (const slug of ["cervicloud", "lumicloud", "calmicloud"] as const) {
      const reviews = getReviews(slug);
      expect(reviews).toHaveLength(3);
      for (const review of reviews) {
        expect(review.slug).toBe(slug);
        expect(review.screenshot).toMatch(/^\/images\/bio\/testimonials\/.+\.jpg$/);
      }
    }
  });

  it("never exposes a raw marketplace handle", () => {
    const authors = getReviews("lumicloud").map((r) => r.author);
    expect(authors).not.toContain("steve969");
    for (const author of authors) expect(author).toMatch(/\*{3,}/);
  });

  it("keeps short quotes whole", () => {
    expect(excerpt("bantal nya adem", 10)).toBe("bantal nya adem");
  });

  it("cuts long quotes on a word boundary and marks the cut", () => {
    expect(excerpt("satu dua tiga, empat lima", 3)).toBe("satu dua tiga…");
  });
});
