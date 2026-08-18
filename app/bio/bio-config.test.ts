import { describe, expect, it } from "vitest";

import productsSource from "@/data/products.json";
import siteSource from "@/data/site.json";
import { createBioConfig, isValidWhatsAppUrl } from "@/data/bio";

const expectedSlugs = ["cervicloud", "lumicloud", "calmicloud"];

describe("bio page configuration", () => {
  it("keeps exactly the three sleep-system products in intentional order", () => {
    const config = createBioConfig();

    expect(config.products.map((product) => product.slug)).toEqual(expectedSlugs);
    expect(config.products.map((product) => product.name)).toEqual([
      "CerviCloud",
      "LumiCloud",
      "CalmiCloud",
    ]);
  });

  it("uses unique, stable IDs and non-empty Indonesian product copy", () => {
    const config = createBioConfig();
    const productIds = config.products.map((product) => product.id);
    const actionIds = [
      ...config.products.flatMap((product) => product.actions.map((action) => action.id)),
      ...config.hubActions.map((action) => action.id),
    ];

    expect(new Set(productIds).size).toBe(productIds.length);
    expect(new Set(actionIds).size).toBe(actionIds.length);

    for (const product of config.products) {
      expect(product.id).toMatch(/^bio-product-[a-z-]+$/);
      expect(product.eyebrow.trim()).not.toBe("");
      expect(product.headline.trim()).not.toBe("");
      expect(product.description.trim()).not.toBe("");
      expect(product.image.src).toMatch(/^\/images\//);
      expect(product.image.alt.trim()).not.toBe("");
    }
  });

  it("maps prices and product destinations directly from the current product source", () => {
    const config = createBioConfig();

    for (const product of config.products) {
      const source = productsSource.find((item) => item.slug === product.slug);
      expect(source).toBeDefined();
      expect(product.price).toBe(source?.price);
      expect(product.actions).toEqual([
        expect.objectContaining({ destination: "shopee", href: source?.shopeeUrl }),
        expect.objectContaining({ destination: "tokopedia", href: source?.tokopediaUrl }),
      ]);
    }
  });

  it("keeps every destination secure and maps social links from the site source", () => {
    const config = createBioConfig();
    const urls = [
      ...config.products.flatMap((product) => product.actions.map((action) => action.href)),
      ...config.hubActions.map((action) => action.href),
    ];

    const emailAction = config.hubActions.find((action) => action.destination === "email")!;
    expect(emailAction.href).toBe("mailto:hello@sheepiesleep.com");
    // Everything that is not the contact address must still be an https destination.
    expect(
      urls.filter((url) => url !== emailAction.href).every((url) => url.startsWith("https://")),
    ).toBe(true);
    expect(config.hubActions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ destination: "instagram", href: siteSource.socials.instagram }),
        expect.objectContaining({ destination: "tiktok", href: siteSource.socials.tiktok }),
      ]),
    );
  });

  it.each([
    "https://wa.me/628123456789",
    "https://wa.me/628123456789?text=Halo%20Sheepie",
    "https://api.whatsapp.com/send?phone=628123456789",
    "https://api.whatsapp.com/send?phone=628123456789&text=Halo%20Sheepie",
  ])("accepts an approved WhatsApp destination: %s", (url) => {
    expect(isValidWhatsAppUrl(url)).toBe(true);
    expect(createBioConfig(url).hubActions.at(-1)).toEqual(
      expect.objectContaining({ destination: "whatsapp", href: url }),
    );
  });

  it.each([
    undefined,
    "",
    "http://wa.me/628123456789",
    "https://wa.me/",
    "https://wa.me/0",
    "https://wa.me/1",
    "https://wa.me/1234567",
    "https://wa.me/1234567890123456",
    "https://wa.me/+628123456789",
    "https://wa.me/62812abc",
    "https://wa.me/628123456789/extra",
    "https://wa.me//628123456789",
    "https://wa.me/628123456789?phone=628123456789",
    "https://wa.me:443/628123456789",
    "https://user:pass@wa.me/628123456789",
    "https://wa.me/628123456789#contact",
    "https://api.whatsapp.com/send",
    "https://api.whatsapp.com/send/",
    "https://api.whatsapp.com/628123456789?phone=628123456789",
    "https://api.whatsapp.com/send?phone=0",
    "https://api.whatsapp.com/send?phone=1234567",
    "https://api.whatsapp.com/send?phone=1234567890123456",
    "https://api.whatsapp.com/send?phone=%2B628123456789",
    "https://api.whatsapp.com/send?phone=62812abc",
    "https://api.whatsapp.com/send?phone=628123456789&phone=628123456780",
    "https://api.whatsapp.com/send?phone=628123456789&redirect=evil",
    "https://api.whatsapp.com:443/send?phone=628123456789",
    "https://user@api.whatsapp.com/send?phone=628123456789",
    "https://api.whatsapp.com/send?phone=628123456789#contact",
    "https://example.com/628123456789",
    "https://wa.me.evil.example/628123456789",
    "javascript:alert(1)",
  ])("omits absent or invalid WhatsApp destinations: %s", (url) => {
    expect(isValidWhatsAppUrl(url)).toBe(false);
    expect(createBioConfig(url).hubActions.some((action) => action.destination === "whatsapp")).toBe(
      false,
    );
  });
});
