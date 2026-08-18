"use client";

import Image from "next/image";
import { useState } from "react";

import type { BioProduct, BioTestimonial } from "@/data/bio";

import styles from "./bio-page.module.css";

type BioTestimonialsProps = {
  products: BioProduct[];
  testimonials: BioTestimonial[];
  logos: Record<"shopee" | "tokopedia", string>;
};

export function BioTestimonials({ products, testimonials, logos }: BioTestimonialsProps) {
  const available = products.filter((product) =>
    testimonials.some((review) => review.product === product.slug),
  );
  const [activeSlug, setActiveSlug] = useState(available[0]?.slug);

  if (available.length === 0) return null;

  const shown = testimonials.filter((review) => review.product === activeSlug);

  return (
    <>
      <div className={styles.reviewTabs} role="tablist" aria-label="Ulasan per produk">
        {available.map((product) => (
          <button
            key={product.slug}
            type="button"
            role="tab"
            id={`reviews-tab-${product.slug}`}
            aria-selected={product.slug === activeSlug}
            aria-controls={`reviews-panel-${product.slug}`}
            data-selected={product.slug === activeSlug}
            className={styles.reviewTab}
            onClick={() => setActiveSlug(product.slug)}
          >
            {product.name}
          </button>
        ))}
      </div>

      <ul
        className={styles.testimonialList}
        role="tabpanel"
        id={`reviews-panel-${activeSlug}`}
        aria-labelledby={`reviews-tab-${activeSlug}`}
      >
        {shown.map((testimonial) => (
          <li key={testimonial.id} className={styles.testimonialCard}>
            <div className={styles.testimonialHead}>
              <span className={styles.testimonialAuthor}>{testimonial.author}</span>
              <Image
                src={logos[testimonial.marketplace]}
                alt={testimonial.marketplace === "shopee" ? "Shopee" : "Tokopedia"}
                width={16}
                height={16}
                className={styles.testimonialSource}
              />
            </div>
            {/* The capture is a 3x phone screenshot, so it stays readable at column width. */}
            <Image
              src={testimonial.screenshot.src}
              alt={testimonial.quote}
              width={testimonial.screenshot.width}
              height={testimonial.screenshot.height}
              sizes="(max-width: 480px) 92vw, 28rem"
              className={styles.testimonialImage}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
