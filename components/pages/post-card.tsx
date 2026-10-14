import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/i18n/config";
import { localeHref } from "@/lib/site/copy";
import type { JournalPost } from "@/lib/site/journal";

import styles from "./pages.module.css";

export function PostCard({ post, locale }: { post: JournalPost; locale: Locale }) {
  return (
    <Link className={styles.post} href={localeHref(locale, `/blog/${post.slug}`)}>
      <span className={styles.postImg}>
        <Image src={post.image} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" className={styles.cover} />
      </span>
      <span className={styles.meta}>{post.date} · {post.readTime}</span>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
    </Link>
  );
}
