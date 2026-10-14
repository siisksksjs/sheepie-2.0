"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { buttonClass } from "@/components/site/button";

import styles from "./pages.module.css";

/**
 * The article's product, pinned to the bottom of the screen once the reader is past
 * the hero image, and tucked away again when the footer comes into view.
 */
export function ArticleStickyBar({ href, slug, name, image, price, label, cta }: { href: string; slug: string; name: string; image: string; price: string; label: string; cta: string }) {
  const [past, setPast] = useState(false);
  const [atFooter, setAtFooter] = useState(false);
  const show = past && !atFooter;

  useEffect(() => {
    const hero = document.querySelector("[data-article-hero]");
    const footer = document.querySelector("footer");
    const heroIo = new IntersectionObserver(([e]) => setPast(!e.isIntersecting && e.boundingClientRect.top < 0));
    const footIo = new IntersectionObserver(([e]) => setAtFooter(e.isIntersecting));
    if (hero) heroIo.observe(hero);
    if (footer) footIo.observe(footer);
    return () => {
      heroIo.disconnect();
      footIo.disconnect();
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.stickyBar = show ? "true" : "false";
    return () => {
      delete document.documentElement.dataset.stickyBar;
    };
  }, [show]);

  return (
    <div className={styles.articleSticky} data-show={show} aria-hidden={!show} inert={!show}>
      <div className={styles.articleStickyIn}>
        <span className={styles.articleStickyImg}>
          <Image src={image} alt="" fill sizes="52px" className={styles.cover} />
        </span>
        <span className={styles.articleStickyText}>
          <small>{label}</small>
          <b>{name}</b>
        </span>
        <span className={styles.articleStickyPrice}>{price}</span>
        <Link className={buttonClass("ink")} href={href} data-article-product={slug}>
          {cta} →
        </Link>
      </div>
    </div>
  );
}
