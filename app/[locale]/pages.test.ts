import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import AboutPage from "@/app/[locale]/about/page";
import ArticlePage from "@/app/[locale]/blog/[slug]/page";
import JournalPage from "@/app/[locale]/blog/page";
import GuidePage from "@/app/[locale]/calmicloud-earplug-guide/page";
import ContactPage from "@/app/[locale]/contact/page";
import retired from "@/data/retired-posts.json";
import { formatPostDate, journalPosts, postJsonLd } from "@/lib/site/journal";

const params = (locale: "id" | "en") => ({ params: Promise.resolve({ locale }) });

describe("content pages", () => {
  it("About tells the story and links each product", async () => {
    const html = renderToStaticMarkup(await AboutPage(params("id")));
    expect(html).toContain("Istirahat bukan kemewahan.<em>Itu fondasi.</em>");
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

  it("Blog lists the published articles", async () => {
    expect(journalPosts.length).toBeGreaterThan(0);
    const html = renderToStaticMarkup(await JournalPage(params("id")));
    expect(html).not.toContain('data-section="empty"');
    expect(html).toContain(`href="/id/blog/${journalPosts[0].slug}"`);
  });

  it("articles render the answer box, table, FAQ, contents and structured data", async () => {
    const html = renderToStaticMarkup(await ArticlePage({ params: Promise.resolve({ locale: "id", slug: "posisi-tidur-yang-benar" }) }));
    for (const block of ["answer", "table", "faq", "toc"]) expect(html).toContain(`data-block="${block}"`);
    expect(html).toContain('<h2 id="tidur-miring">');
    expect(html).toContain('href="#faq"');
    expect(html).toContain("14 Oktober 2026");
    expect(html).toContain('"@type":"BlogPosting"');
    expect(html).toContain('"@type":"FAQPage"');
    expect(html).toContain('data-article-product="cervicloud"');
  });

  it("every article is well-formed and makes no medical claims", () => {
    const retiredSlugs = new Set(retired.map((r) => r.slug));
    for (const post of journalPosts) {
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(formatPostDate(post.date, "id")).not.toContain("Invalid");
      expect(retiredSlugs.has(post.slug)).toBe(false);
      expect((post.description ?? post.excerpt).length).toBeLessThanOrEqual(160);
      expect(postJsonLd(post).length).toBeGreaterThanOrEqual(2);
      expect(JSON.stringify(post.content)).not.toMatch(/menyembuhkan|mengobati|terapi|medical|kelas medis|dijamin/i);
    }
  });

  it("retires every old article to a product page or the home page", () => {
    expect(retired).toHaveLength(13);
    for (const r of retired) expect(["", "/products/cervicloud", "/products/lumicloud", "/products/calmicloud"]).toContain(r.to);
  });

  it("CalmiCloud guide teaches the outer-ear method in four steps", async () => {
    const html = renderToStaticMarkup(await GuidePage(params("id")));
    for (const n of [1, 2, 3, 4]) expect(html).toContain(`calmi-step-${n}.webp`);
    expect(html).toContain("Jangan didorong masuk ke liang telinga");
    expect(html).not.toMatch(/medical|kelas medis|saluran telinga lalu putar/i);
  });
});
