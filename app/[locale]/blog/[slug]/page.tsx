import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import styles from "@/components/pages/pages.module.css";
import { PostCard } from "@/components/pages/post-card";
import { FadeIn } from "@/components/site/fade-in";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import site from "@/components/site/site.module.css";
import { isLocale } from "@/i18n/config";
import { getProduct, productPath } from "@/lib/catalog";
import { localeHref } from "@/lib/site/copy";
import { findPost, journalPosts, postProduct, relatedPosts } from "@/lib/site/journal";
import { pagesCopy } from "@/lib/site/pages-copy";

const baseUrl = "https://sheepiesleep.com";

export function generateStaticParams() {
  return journalPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = findPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Sheepie Journal`,
    description: post.excerpt,
    alternates: { canonical: `${baseUrl}/id/blog/${post.slug}` },
    robots: locale === "id" ? undefined : { index: false, follow: true },
    openGraph: { type: "article", url: `${baseUrl}/id/blog/${post.slug}`, images: [post.image] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const post = findPost(slug);
  if (!post) notFound();
  const t = pagesCopy[locale].journal;
  const productSlug = postProduct(post);
  const product = productSlug ? getProduct(productSlug, locale) : null;

  return (
    <div className={site.page}>
      <SiteHeader locale={locale} />
      <main>
        <article className={`${site.shell} ${styles.article}`} data-section="article">
          <Link className={styles.back} href={localeHref(locale, "/blog")}>← {t.back}</Link>
          <header className={styles.articleHead}>
            <span className={styles.meta}>{post.date} · {post.readTime}</span>
            <h1>{post.title}</h1>
            <span className={styles.meta}>{t.by} {post.author}</span>
          </header>
          <div className={styles.articleImg}>
            <Image src={post.image} alt="" fill preload fetchPriority="high" sizes="(max-width: 760px) 100vw, 1080px" className={styles.cover} />
          </div>

          <div className={styles.prose}>
            {post.content.map((block, i) => {
              // Article copy is authored in this repo (data/blog.json) and may carry inline links.
              if (block.type === "ul") {
                return (
                  <ul key={i}>
                    {block.items.map((item) => <li key={item} dangerouslySetInnerHTML={{ __html: item }} />)}
                  </ul>
                );
              }
              if (block.type === "h2") return <h2 key={i}>{block.text}</h2>;
              if (block.type === "h3") return <h3 key={i}>{block.text}</h3>;
              return <p key={i} dangerouslySetInnerHTML={{ __html: block.text }} />;
            })}
          </div>

          {product && (
            <Link className={styles.productCard} href={productPath(locale, product.slug)} data-article-product={product.slug}>
              <span className={styles.postImg}>
                <Image src={product.card.image} alt="" fill sizes="96px" className={styles.cover} />
              </span>
              <span>
                <small>{t.productTitle}</small>
                <b>{product.name}</b>
              </span>
              <em>{t.productCta} →</em>
            </Link>
          )}
        </article>

        <section className={`${site.shell} ${styles.block}`} data-section="more">
          <FadeIn><h2 className={styles.h2}>{t.more}</h2></FadeIn>
          <div className={`${styles.posts} ${styles.morePosts}`}>
            {relatedPosts(post).map((p, i) => (
              <FadeIn key={p.slug} index={i}>
                <PostCard post={p} locale={locale} />
              </FadeIn>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
