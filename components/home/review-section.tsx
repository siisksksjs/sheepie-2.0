import { FadeIn } from "@/components/site/fade-in";
import site from "@/components/site/site.module.css";
import type { Locale } from "@/i18n/config";
import { excerpt, getReviews, type Review } from "@/lib/catalog/reviews";
import type { ProductSlug } from "@/lib/catalog/types";
import { homeCopy } from "@/lib/site/home-copy";

import styles from "./home.module.css";

function Card({ review, big, viewOriginal, index }: { review: Review; big?: boolean; viewOriginal: string; index: number }) {
  return (
    <FadeIn index={index}>
      <figure className={`${styles.rv} ${big ? styles.rvBig : ""}`}>
        <blockquote>“{big ? review.quote : excerpt(review.quote, 24)}”</blockquote>
        <figcaption>
          <b>{review.author}</b> · {review.marketplace === "shopee" ? "Shopee" : "Tokopedia"}
          <a href={review.screenshot} target="_blank" rel="noopener noreferrer">{viewOriginal}</a>
        </figcaption>
      </figure>
    </FadeIn>
  );
}

export function ReviewSection({
  locale,
  slug,
  featuredId,
  tone,
}: {
  locale: Locale;
  slug: ProductSlug;
  featuredId: string;
  tone: "day" | "night";
}) {
  const t = homeCopy[locale].reviews;
  const reviews = getReviews(slug);
  const featured = reviews.find((r) => r.id === featuredId) ?? reviews[0];
  const rest = reviews.filter((r) => r !== featured).slice(0, 2);

  return (
    <section className={`${styles.reviews} ${tone === "night" ? styles.night : ""}`} data-section={`${slug}-reviews`}>
      <div className={site.shell}>
        <FadeIn><h2>{slug === "cervicloud" ? t.cervi : t.lumi}</h2></FadeIn>
        <div className={styles.rvGrid}>
          <Card review={featured} big viewOriginal={t.viewOriginal} index={0} />
          <div className={styles.rvCol}>
            {rest.map((review, i) => (
              <Card key={review.id} review={review} viewOriginal={t.viewOriginal} index={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
