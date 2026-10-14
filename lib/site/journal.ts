import blogData from "@/data/blog.json";
import type { ProductSlug } from "@/lib/catalog/types";

export type JournalBlock = { type: "p" | "h2" | "h3"; text: string } | { type: "ul"; items: string[] };

export type JournalPost = {
  slug: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  content: JournalBlock[];
};

export const journalPosts = blogData as JournalPost[];

export function findPost(slug: string): JournalPost | undefined {
  return journalPosts.find((p) => p.slug === slug);
}

/** The product an article is mostly about, guessed from its slug; null for general articles. */
export function postProduct(post: JournalPost): ProductSlug | null {
  const s = post.slug;
  if (/bantal|leher|cervical|tulang/.test(s)) return "cervicloud";
  if (/mask|masker|mata|terang|darkness|cahaya/.test(s)) return "lumicloud";
  if (/earplug|bising|suara|berisik/.test(s)) return "calmicloud";
  return null;
}

/** Other posts, the same product's first. */
export function relatedPosts(post: JournalPost, count = 3): JournalPost[] {
  const product = postProduct(post);
  const others = journalPosts.filter((p) => p.slug !== post.slug);
  return [...others.filter((p) => postProduct(p) === product), ...others.filter((p) => postProduct(p) !== product)].slice(0, count);
}
