import { describe, expect, it } from "vitest";

import { discountPercent, formatIdr, parseIdr } from "./price";

describe("IDR prices", () => {
  it("parses the strings used in data/products.json", () => {
    expect(parseIdr("IDR 838.000")).toBe(838000);
    expect(parseIdr("IDR 1.399.000")).toBe(1399000);
  });

  it("refuses strings without digits", () => {
    expect(() => parseIdr("IDR")).toThrow(/Not an IDR amount/);
  });

  it("formats with dot thousands and no space", () => {
    expect(formatIdr(838000)).toBe("Rp838.000");
    expect(formatIdr(1399000)).toBe("Rp1.399.000");
    expect(formatIdr(88000)).toBe("Rp88.000");
  });

  it("rounds the discount to a whole percent", () => {
    expect(discountPercent(838000, 1399000)).toBe(40);
    expect(discountPercent(218000, 299000)).toBe(27);
    expect(discountPercent(88000, 108000)).toBe(19);
  });

  it("reports no discount when there is nothing to save", () => {
    expect(discountPercent(198000, 198000)).toBeNull();
    expect(discountPercent(198000, null)).toBeNull();
    expect(discountPercent(200000, 150000)).toBeNull();
  });
});
