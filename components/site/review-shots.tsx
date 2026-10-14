import Image from "next/image";

import type { Review } from "@/lib/catalog/reviews";

import { FadeIn } from "./fade-in";
import styles from "./site.module.css";

/**
 * Real marketplace review screenshots, shown as they are: a masonry of cards on
 * wide screens, a swipeable row on phones. Each opens the full screenshot.
 */
export function ReviewShots({ reviews, label, tone = "day" }: { reviews: Review[]; label: (review: Review) => string; tone?: "day" | "night" }) {
  return (
    <div className={styles.shots} data-tone={tone}>
      {reviews.map((review, i) => (
        <FadeIn key={review.id} index={i} className={styles.shotWrap}>
          <a className={styles.shot} href={review.screenshot} target="_blank" rel="noopener noreferrer" aria-label={label(review)}>
            <Image src={review.screenshot} alt={label(review)} width={review.width} height={review.height} sizes="(max-width: 760px) 80vw, 400px" />
            <span className={styles.shotTag}>{review.marketplace === "shopee" ? "Shopee" : "Tokopedia"}</span>
          </a>
        </FadeIn>
      ))}
    </div>
  );
}
