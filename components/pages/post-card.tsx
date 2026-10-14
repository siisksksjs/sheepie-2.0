import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { localeHref } from "@/lib/site/copy";
import { formatPostDate, type JournalPost, readMinutes } from "@/lib/site/journal";
import { pagesCopy } from "@/lib/site/pages-copy";

import styles from "./pages.module.css";

export function PostCard({ post, locale }: { post: JournalPost; locale: Locale }) {
  return (
    <Link className={styles.post} href={localeHref(locale, `/blog/${post.slug}`)}>
      <span className={styles.postImg}>
        <Image src={post.image} alt={post.imageAlt ?? ""} fill sizes="(max-width: 760px) 100vw, 33vw" className={styles.cover} />
      </span>
      <span className={styles.meta}>{formatPostDate(post.date, locale)} · {readMinutes(post)} {pagesCopy[locale].journal.minRead}</span>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
    </Link>
  );
}
