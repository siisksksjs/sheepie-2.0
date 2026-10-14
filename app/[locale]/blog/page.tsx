import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageIntro } from "@/components/pages/page-intro";
import styles from "@/components/pages/pages.module.css";
import { PostCard } from "@/components/pages/post-card";
import { FadeIn } from "@/components/site/fade-in";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import site from "@/components/site/site.module.css";
import { isLocale } from "@/i18n/config";
import { localeHref } from "@/lib/site/copy";
import { getProducts, productPath } from "@/lib/catalog";
import { journalPosts } from "@/lib/site/journal";
import { pagesCopy } from "@/lib/site/pages-copy";

const baseUrl = "https://sheepiesleep.com";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `${baseUrl}/id/blog` },
    // Articles are written in Indonesian; the English listing points search engines there.
    robots: locale === "id" ? undefined : { index: false, follow: true },
  };
}

export default async function JournalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = pagesCopy[locale].journal;
  const [featured, ...rest] = journalPosts;
  const products = getProducts(locale);

  return (
    <div className={site.page}>
      <SiteHeader locale={locale} />
      <main>
        <PageIntro eyebrow={t.eyebrow} title={t.title} intro={t.intro} />

        {!featured ? (
          <section className={`${site.shell} ${styles.channels}`} data-section="empty">
            <div className={styles.faqNote}>
              <span>
                <b className={styles.emptyTitle}>{t.emptyTitle}</b>
                {t.emptyBody}
              </span>
            </div>
            <div className={`${styles.posts} ${styles.morePosts}`}>
              {products.map((product) => (
                <Link key={product.slug} className={styles.post} href={productPath(locale, product.slug)}>
                  <span className={styles.postImg}>
                    <Image src={product.card.image} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" className={styles.cover} />
                  </span>
                  <h3>{product.name}</h3>
                  <p>{product.card.line}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <>
          <section className={site.shell} data-section="featured">
            <FadeIn>
              <Link className={styles.featured} href={localeHref(locale, `/blog/${featured.slug}`)}>
                <span className={styles.featuredImg}>
                  <Image src={featured.image} alt="" fill preload sizes="(max-width: 760px) 100vw, 55vw" className={styles.cover} />
                </span>
                <span>
                  <span className={styles.chip}>{t.featured}</span>
                  <h2>{featured.title}</h2>
                  <p>{featured.excerpt}</p>
                  <span className={`${styles.meta} ${styles.featuredMeta}`}>{featured.author} · {featured.date} · {featured.readTime}</span>
                  <span className={styles.readMore}>{t.read} →</span>
                </span>
              </Link>
            </FadeIn>
          </section>

          <section className={`${site.shell} ${styles.block}`} data-section="posts">
            <div className={styles.posts}>
              {rest.map((post, i) => (
                <FadeIn key={post.slug} index={i % 3}>
                  <PostCard post={post} locale={locale} />
                </FadeIn>
              ))}
            </div>
          </section>
          </>
        )}
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
