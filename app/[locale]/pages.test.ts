import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import AboutPage from "@/app/[locale]/about/page";
import JournalPage from "@/app/[locale]/blog/page";
import GuidePage from "@/app/[locale]/calmicloud-earplug-guide/page";
import ContactPage from "@/app/[locale]/contact/page";
import retired from "@/data/retired-posts.json";
import { journalPosts } from "@/lib/site/journal";

const params = (locale: "id" | "en") => ({ params: Promise.resolve({ locale }) });

describe("content pages", () => {
  it("About tells the story and links each product", async () => {
    const html = renderToStaticMarkup(await AboutPage(params("id")));
    expect(html).toContain("Istirahat bukan kemewahan.<em>Itu pondasi.</em>");
    for (const slug of ["cervicloud", "lumicloud", "calmicloud"]) expect(html).toContain(`href="/id/products/${slug}"`);
    expect(html).toContain("https://wa.me/6285117186188");
  });

  it("Contact leads with WhatsApp and lists the stores and email", async () => {
    const html = renderToStaticMarkup(await ContactPage(params("en")));
    expect(html).toContain('data-whatsapp="contact"');
    expect(html).toContain("0851-1718-6188");
    expect(html).toContain("https://shopee.co.id/sheepie.sleep");
    expect(html).toContain("mailto:hello@sheepiesleep.com");
    expect(html).not.toContain("<form");
  });

  it("Blog starts empty and points readers to the products meanwhile", async () => {
    expect(journalPosts).toEqual([]);
    const html = renderToStaticMarkup(await JournalPage(params("id")));
    expect(html).toContain('data-section="empty"');
    for (const slug of ["cervicloud", "lumicloud", "calmicloud"]) expect(html).toContain(`href="/id/products/${slug}"`);
  });

  it("retires every old article to a product page or the home page", () => {
    expect(retired).toHaveLength(13);
    for (const r of retired) expect(["", "/products/cervicloud", "/products/lumicloud", "/products/calmicloud"]).toContain(r.to);
  });

  it("CalmiCloud guide teaches the outer-ear method in four steps", async () => {
    const html = renderToStaticMarkup(await GuidePage(params("id")));
    for (const n of [1, 2, 3, 4]) expect(html).toContain(`calmi-step-${n}.webp`);
    expect(html).toContain("Jangan didorong masuk ke dalam lubang telinga");
    expect(html).not.toMatch(/medical|kelas medis|saluran telinga lalu putar/i);
  });
});
