// components/pdp/product-gallery.tsx
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useSelectedOption } from "./option-context";
import styles from "./pdp.module.css";

/**
 * One swipeable strip (scroll-snap) at every width, with arrow buttons and a
 * thumbnail row, so every photo is reachable by touch, mouse or keyboard.
 */
export function ProductGallery({ images: base, name }: { images: { src: string; alt: string }[]; name: string }) {
  const { bundle } = useSelectedOption();
  // A picked pack with its own photo leads the gallery.
  const images = bundle?.image ? [{ src: bundle.image, alt: `${name} · ${bundle.label}` }, ...base] : base;
  const [index, setIndex] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  // Show the pack photo as soon as the shopper picks a pack.
  useEffect(() => {
    track.current?.scrollTo({ left: 0 });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset the counter when the photo set changes
    setIndex(0);
  }, [bundle?.key]);
  const last = images.length - 1;

  const go = (next: number) => {
    const el = track.current;
    if (!el) return;
    const i = Math.max(0, Math.min(last, next));
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
    setIndex(i);
  };

  const onScroll = () => {
    const el = track.current;
    if (el) setIndex(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
  };

  return (
    <div className={styles.gallery} aria-roledescription="carousel" aria-label={name}>
      <div className={styles.viewer}>
        <div ref={track} className={styles.track} onScroll={onScroll}>
          {images.map((image, i) => (
            <div key={image.src} className={styles.slide} aria-hidden={i !== index}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                preload={i === 0}
                fetchPriority={i === 0 ? "high" : undefined}
                loading={i === 0 ? undefined : "lazy"}
                sizes="(max-width: 760px) 100vw, 640px"
                className={styles.cover}
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button type="button" className={`${styles.arrow} ${styles.arrowPrev}`} onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous photo">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button type="button" className={`${styles.arrow} ${styles.arrowNext}`} onClick={() => go(index + 1)} disabled={index === last} aria-label="Next photo">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
            </button>
            <span className={styles.count} aria-live="polite">{index + 1} / {images.length}</span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className={styles.thumbs}>
          {images.map((image, i) => (
            <button key={image.src} type="button" className={styles.thumb} aria-current={i === index} aria-label={image.alt} onClick={() => go(i)}>
              <Image src={image.src} alt="" fill sizes="72px" className={styles.cover} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
