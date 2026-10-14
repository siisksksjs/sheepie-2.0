import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { ArticleBody } from "@/components/pages/article-body";
import styles from "@/components/pages/pages.module.css";
import { PostCard } from "@/components/pages/post-card";
import { FadeIn } from "@/components/site/fade-in";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import site from "@/components/site/site.module.css";
import { isLocale } from "@/i18n/config";
import { getProduct, productPath } from "@/lib/catalog";
import { localeHref } from "@/lib/site/copy";
import { findPost, formatPostDate, journalPosts, postHeadings, postJsonLd, postProduct, readMinutes, relatedPosts, SITE_URL } from "@/lib/site/journal";
import { pagesCopy } from "@/lib/site/pages-copy";

export function generateStaticParams() {
  return journalPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = findPost(slug);
  if (!post) return {};
  const url = `${SITE_URL}/id/blog/${post.slug}`;
  return {
    title: post.seoTitle ?? `${post.title} | Sheepie`,
    description: post.description ?? post.excerpt,
    alternates: { canonical: url },
    robots: locale === "id" ? undefined : { index: false, follow: true },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description ?? post.excerpt,
      images: [{ url: post.image, alt: post.imageAlt ?? post.title }],
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      locale: "id_ID",
    },
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
  const headings = postHeadings(post);
  const hasFaq = post.content.some((b) => b.type === "faq");
  const toc = [...headings, ...(hasFaq ? [{ id: "faq", text: t.faqTitle }] : [])];
  const related = relatedPosts(post);

  return (
    <div className={site.page}>
      <SiteHeader locale={locale} />
      <main>
        <article className={`${site.shell} ${styles.article}`} data-section="article">
          <Link className={styles.back} href={localeHref(locale, "/blog")}>← {t.back}</Link>
          <header className={styles.articleHead}>
            <span className={styles.meta}>
              <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time> · {readMinutes(post)} {t.minRead}
            </span>
            <h1>{post.title}</h1>
            <span className={styles.meta}>
              {t.by} {post.author}
              {post.updated && post.updated !== post.date && (
                <> · {t.updated} <time dateTime={post.updated}>{formatPostDate(post.updated, locale)}</time></>
              )}
            </span>
          </header>
          <div className={styles.articleImg}>
            <Image src={post.image} alt={post.imageAlt ?? ""} fill preload fetchPriority="high" sizes="(max-width: 760px) 100vw, 1080px" className={styles.cover} />
          </div>

          {toc.length >= 4 && (
            <nav className={styles.toc} aria-label={t.toc} data-block="toc">
              <details>
                <summary>{t.toc}</summary>
                <ol>{toc.map((h) => <li key={h.id}><a href={`#${h.id}`}>{h.text}</a></li>)}</ol>
              </details>
            </nav>
          )}

          <ArticleBody blocks={post.content} labels={{ answer: t.answer, faqTitle: t.faqTitle }} />

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

        {related.length > 0 && (
        <section className={`${site.shell} ${styles.block}`} data-section="more">
          <FadeIn><h2 className={styles.h2}>{t.more}</h2></FadeIn>
          <div className={`${styles.posts} ${styles.morePosts}`}>
            {related.map((p, i) => (
              <FadeIn key={p.slug} index={i}>
                <PostCard post={p} locale={locale} />
              </FadeIn>
            ))}
          </div>
        </section>
        )}
      </main>
      {postJsonLd(post).map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
      ))}
      <SiteFooter locale={locale} />
    </div>
  );
}
