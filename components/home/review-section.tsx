import { FadeIn } from "@/components/site/fade-in";
import { ReviewShots } from "@/components/site/review-shots";
import site from "@/components/site/site.module.css";
import type { Locale } from "@/i18n/config";
import { getReviews } from "@/lib/catalog/reviews";
import type { ProductSlug } from "@/lib/catalog/types";
import { homeCopy } from "@/lib/site/home-copy";

import styles from "./home.module.css";

/** Real marketplace review screenshots for one product. */
export function ReviewSection({ locale, slug, tone }: { locale: Locale; slug: ProductSlug; tone: "day" | "night" }) {
  const t = homeCopy[locale].reviews;

  return (
    <section className={`${styles.reviews} ${tone === "night" ? styles.night : ""}`} data-section={`${slug}-reviews`}>
      <div className={site.shell}>
        <FadeIn><h2>{slug === "cervicloud" ? t.cervi : t.lumi}</h2></FadeIn>
        <ReviewShots reviews={getReviews(slug)} tone={tone} label={(r) => `${t.viewOriginal}: ${r.author}`} />
      </div>
    </section>
  );
}
