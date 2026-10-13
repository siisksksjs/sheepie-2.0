// components/pdp/product-gallery.tsx
"use client";

import Image from "next/image";
import { useState, type UIEvent } from "react";

import styles from "./pdp.module.css";

export function ProductGallery({ images, name }: { images: { src: string; alt: string }[]; name: string }) {
  const [index, setIndex] = useState(0);

  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    const track = event.currentTarget;
    setIndex(Math.round(track.scrollLeft / Math.max(1, track.clientWidth)));
  };

  return (
    <div className={styles.gallery} aria-label={name}>
      <div className={styles.thumbs}>
        {images.map((image, i) => (
          <button key={image.src} type="button" className={styles.thumb} aria-current={i === index} aria-label={image.alt} onClick={() => setIndex(i)}>
            <Image src={image.src} alt="" fill sizes="76px" className={styles.cover} />
          </button>
        ))}
      </div>
      <div className={styles.main}>
        <Image key={images[index].src} src={images[index].src} alt={images[index].alt} fill preload={index === 0} fetchPriority={index === 0 ? "high" : undefined} sizes="(max-width: 760px) 100vw, 640px" className={styles.cover} />
      </div>
      <div className={styles.track} onScroll={onScroll}>
        {images.map((image, i) => (
          <div key={image.src} className={styles.slide}>
            <Image src={image.src} alt={image.alt} fill loading={i === 0 ? "eager" : undefined} fetchPriority={i === 0 ? "high" : undefined} sizes="(max-width: 760px) 100vw, 640px" className={styles.cover} />
          </div>
        ))}
      </div>
      <div className={styles.dots} aria-hidden="true">
        {images.map((image, i) => (
          <i key={image.src} data-on={i === index} />
        ))}
      </div>
    </div>
  );
}
