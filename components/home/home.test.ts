import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Home from "@/app/[locale]/page";

async function render(locale: "id" | "en") {
  const element = await Home({ params: Promise.resolve({ locale }) });
  return renderToStaticMarkup(element);
}

describe("home page", () => {
  it("runs the night arc in the owner's order", async () => {
    const html = await render("id");
    const order = [...html.matchAll(/data-section="([^"]+)"/g)].map((m) => m[1]).filter((s) => s !== "footer");
    expect(order).toEqual(["hero", "products", "cervicloud", "cervicloud-reviews", "lumicloud", "lumicloud-reviews"]);
    expect(html.indexOf('data-section="lumicloud-reviews"')).toBeLessThan(html.indexOf('data-section="footer"'));
  });

  it("leads with both hero products", async () => {
    const html = await render("id");
    expect(html).toContain('id="hero"');
    expect(html).toContain("Leher tertopang, mata tetap gelap.");
    expect(html).toContain('href="/id/products/cervicloud"');
    expect(html).toContain('href="/id/products/lumicloud"');
    expect(html).toContain('data-overlay="true"');
  });

  it("shows CerviCloud and LumiCloud as equal cards and CalmiCloud as a companion", async () => {
    const html = await render("id");
    expect(html).toContain('data-product-card="cervicloud"');
    expect(html).toContain('data-product-card="lumicloud"');
    expect(html).not.toContain('data-product-card="calmicloud"');
    expect(html).toContain('data-companion="calmicloud"');
    expect(html).toContain('href="/id/products/cervicloud?option=case"');
  });

  it("quotes masked reviewers with a link to the original screenshot", async () => {
    const html = await render("id");
    expect(html).toContain("/images/bio/testimonials/cervicloud-3-review.jpg");
    expect(html).toContain("/images/bio/testimonials/lumicloud-1-review.jpg");
    expect(html).not.toContain("steve969");
  });

  it("renders the lights-out band with its animated layers", async () => {
    const html = await render("id");
    expect(html).toContain('id="lights"');
    for (const layer of ["sky", "far", "near", "content"]) expect(html).toContain(`data-lights="${layer}"`);
  });

  it("renders English copy on /en", async () => {
    const html = await render("en");
    expect(html).toContain("Neck supported, eyes kept dark.");
    expect(html).toContain('href="/en/products/lumicloud"');
  });
});
