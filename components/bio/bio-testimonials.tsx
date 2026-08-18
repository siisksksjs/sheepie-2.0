"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

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
  const [preview, setPreview] = useState<BioTestimonial | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // <dialog> gives focus trapping, Escape, and inert background for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (preview && !dialog.open) dialog.showModal();
    if (!preview && dialog.open) dialog.close();
  }, [preview]);

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
              <span className={styles.testimonialStars} aria-label="Lima dari lima bintang">
                {"★★★★★"}
              </span>
              <span className={styles.testimonialAuthor}>{testimonial.author}</span>
              <Image
                src={logos[testimonial.marketplace]}
                alt={testimonial.marketplace === "shopee" ? "Shopee" : "Tokopedia"}
                width={16}
                height={16}
                className={styles.testimonialSource}
              />
            </div>
            <p className={styles.testimonialQuote}>{testimonial.quote}</p>
            {/* Without JavaScript this stays a plain link to the image. */}
            <a
              href={testimonial.screenshot.src}
              className={styles.testimonialProof}
              onClick={(event) => {
                event.preventDefault();
                setPreview(testimonial);
              }}
            >
              Lihat tangkapan layar ulasan
            </a>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className={styles.previewDialog}
        aria-label="Tangkapan layar ulasan"
        onClose={() => setPreview(null)}
        onClick={(event) => {
          // Clicking the backdrop resolves to the dialog element itself.
          if (event.target === dialogRef.current) setPreview(null);
        }}
      >
        {preview ? (
          <div className={styles.previewBody}>
            <button
              type="button"
              className={styles.previewClose}
              onClick={() => setPreview(null)}
              aria-label="Tutup tangkapan layar"
            >
              <X size={18} aria-hidden="true" />
            </button>
            <Image
              src={preview.screenshot.src}
              alt={`Ulasan ${preview.author} di ${
                preview.marketplace === "shopee" ? "Shopee" : "Tokopedia"
              }`}
              width={preview.screenshot.width}
              height={preview.screenshot.height}
              // Unoptimised so the original capture is served: a downscaled
              // variant would put the review text back below reading size.
              unoptimized
              className={styles.previewImage}
            />
          </div>
        ) : null}
      </dialog>
    </>
  );
}
