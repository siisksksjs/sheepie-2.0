"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import styles from "./bio-page.module.css";

type BioProductGalleryProps = {
  images: string[];
  alt: string;
  productName: string;
};

export function BioProductGallery({ images, alt, productName }: BioProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const atStart = index === 0;
  const atEnd = index === total - 1;

  // Clamped rather than wrapping, so the ends of the set are felt.
  const step = (delta: number) =>
    setIndex((current) => Math.min(total - 1, Math.max(0, current + delta)));

  return (
    <div className={styles.gallery}>
      <Image
        src={images[index]}
        alt={index === 0 ? alt : `${productName}, gambar ${index + 1} dari ${total}`}
        fill
        sizes="(max-width: 480px) 45vw, 14rem"
        className={styles.galleryImage}
      />

      {total > 1 ? (
        <>
          <button
            type="button"
            className={`${styles.galleryArrow} ${styles.galleryPrev}`}
            onClick={() => step(-1)}
            disabled={atStart}
            aria-label={`Gambar sebelumnya, ${productName}`}
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`${styles.galleryArrow} ${styles.galleryNext}`}
            onClick={() => step(1)}
            disabled={atEnd}
            aria-label={`Gambar berikutnya, ${productName}`}
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
          <p className={styles.galleryCount} aria-live="polite">
            {index + 1}/{total}
          </p>
        </>
      ) : null}
    </div>
  );
}
