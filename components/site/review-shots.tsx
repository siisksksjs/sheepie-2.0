import Image from "next/image";

import type { Review } from "@/lib/catalog/reviews";

import { FadeIn } from "./fade-in";
import styles from "./site.module.css";

/**
 * Real marketplace review screenshots: one row of equal cards on wide screens,
 * a swipeable row on phones. Every card takes the shortest screenshot's shape and
 * taller ones are trimmed from the bottom (dates, seller replies), never the review
 * itself at the top. Each opens the full screenshot.
 */
export function ReviewShots({ reviews, label, tone = "day" }: { reviews: Review[]; label: (review: Review) => string; tone?: "day" | "night" }) {
  const ratio = Math.min(...reviews.map((r) => r.height / r.width));
  return (
    <div className={styles.shots} data-tone={tone}>
      {reviews.map((review, i) => (
        <FadeIn key={review.id} index={i} className={styles.shotWrap}>
          <a className={styles.shot} style={{ aspectRatio: `1 / ${ratio.toFixed(4)}` }} href={review.screenshot} target="_blank" rel="noopener noreferrer" aria-label={label(review)}>
            <Image src={review.screenshot} alt={label(review)} fill sizes="(max-width: 760px) 80vw, 400px" />
            <span className={styles.shotTag}>{review.marketplace === "shopee" ? "Shopee" : "Tokopedia"}</span>
          </a>
        </FadeIn>
      ))}
    </div>
  );
}
