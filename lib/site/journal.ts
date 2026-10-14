import blogData from "@/data/blog.json";
import type { Locale } from "@/i18n/config";
import type { ProductSlug } from "@/lib/catalog/types";

/**
 * Article content blocks. Text fields may carry inline HTML links (copy is authored in this repo).
 * - answer: the short answer box at the top, written to be lifted into a featured snippet.
 * - table: comparison table; the first column reads as the row label.
 * - faq: questions rendered as an accordion and emitted as FAQPage structured data.
 * - tip: a highlighted practical note.
 */
export type JournalBlock =
  | { type: "p" | "h3" | "tip"; text: string }
  | { type: "h2"; text: string; id?: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "answer"; title?: string; text: string }
  | { type: "table"; caption?: string; head: string[]; rows: string[][] }
  | { type: "faq"; items: { q: string; a: string }[] };

export type JournalPost = {
  slug: string;
  title: string;
  /** Overrides the <title> tag; defaults to the title. */
  seoTitle?: string;
  /** Meta description; defaults to the excerpt. */
  description?: string;
  excerpt: string;
  image: string;
  imageAlt?: string;
  author: string;
  /** ISO dates, e.g. "2026-10-19". */
  date: string;
  updated?: string;
  /** The product the article leads to; guessed from the slug when missing. */
  product?: ProductSlug;
  content: JournalBlock[];
};

export const SITE_URL = "https://sheepiesleep.com";

export const journalPosts = (blogData as JournalPost[]).slice().sort((a, b) => b.date.localeCompare(a.date));

export function findPost(slug: string): JournalPost | undefined {
  return journalPosts.find((p) => p.slug === slug);
}

/** The product an article leads to; null for general articles. */
export function postProduct(post: JournalPost): ProductSlug | null {
  if (post.product) return post.product;
  const s = post.slug;
  if (/bantal|leher|cervical|tulang/.test(s)) return "cervicloud";
  if (/mask|masker|mata|terang|darkness|cahaya/.test(s)) return "lumicloud";
  if (/earplug|bising|suara|berisik|telinga/.test(s)) return "calmicloud";
  return null;
}

/** Other posts, the same product's first. */
export function relatedPosts(post: JournalPost, count = 3): JournalPost[] {
  const product = postProduct(post);
  const others = journalPosts.filter((p) => p.slug !== post.slug);
  return [...others.filter((p) => postProduct(p) === product), ...others.filter((p) => postProduct(p) !== product)].slice(0, count);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** The h2s, with the anchor ids the article renders, for the table of contents. */
export function postHeadings(post: JournalPost): { id: string; text: string }[] {
  return post.content.flatMap((b) => (b.type === "h2" ? [{ id: b.id ?? slugify(b.text), text: b.text }] : []));
}

function plain(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

/** Reading time at ~200 words a minute, counting every block. */
export function readMinutes(post: JournalPost): number {
  const text = post.content
    .map((b) => {
      if ("items" in b && b.type !== "faq") return b.items.join(" ");
      if (b.type === "table") return [...b.head, ...b.rows.flat()].join(" ");
      if (b.type === "faq") return b.items.map((i) => `${i.q} ${i.a}`).join(" ");
      return b.text;
    })
    .join(" ");
  return Math.max(1, Math.round(plain(text).split(" ").length / 200));
}

export function formatPostDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "id" ? "id-ID" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }).format(
    new Date(`${iso}T00:00:00+07:00`),
  );
}

/** BlogPosting, BreadcrumbList and (when the article has one) FAQPage structured data. */
export function postJsonLd(post: JournalPost): object[] {
  const url = `${SITE_URL}/id/blog/${post.slug}`;
  const graph: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description ?? post.excerpt,
      image: [`${SITE_URL}${post.image}`],
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      inLanguage: "id-ID",
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: post.author, url: SITE_URL },
      publisher: { "@type": "Organization", name: "Sheepie", url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/lamb-blue.png` } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Sheepie", item: `${SITE_URL}/id` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/id/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];
  const faq = post.content.flatMap((b) => (b.type === "faq" ? b.items : []));
  if (faq.length) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((i) => ({ "@type": "Question", name: plain(i.q), acceptedAnswer: { "@type": "Answer", text: plain(i.a) } })),
    });
  }
  return graph;
}
