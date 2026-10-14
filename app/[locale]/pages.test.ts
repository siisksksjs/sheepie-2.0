import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import AboutPage from "@/app/[locale]/about/page";
import ArticlePage from "@/app/[locale]/blog/[slug]/page";
import JournalPage from "@/app/[locale]/blog/page";
import ContactPage from "@/app/[locale]/contact/page";
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

  it("Journal features the first post and lists the rest", async () => {
    const html = renderToStaticMarkup(await JournalPage(params("id")));
    for (const post of journalPosts) expect(html).toContain(`href="/id/blog/${post.slug}"`);
  });

  it("An article renders its blocks and links the product it is about", async () => {
    const post = journalPosts[0];
    const html = renderToStaticMarkup(await ArticlePage({ params: Promise.resolve({ locale: "id", slug: post.slug }) }));
    expect(html).toContain(post.title);
    expect(html).toContain('data-article-product="cervicloud"');
    expect(html).toContain('data-section="more"');
  });
});
