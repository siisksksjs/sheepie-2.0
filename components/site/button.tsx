import Link from "next/link";
import type { ReactNode } from "react";

import styles from "./site.module.css";

export type ButtonVariant = "ink" | "cream" | "line" | "lineLight";

export function buttonClass(variant: ButtonVariant, wide = false): string {
  return [styles.btn, styles[variant], wide ? styles.wide : ""].filter(Boolean).join(" ");
}

export function ButtonLink({
  href,
  variant,
  wide,
  className,
  children,
}: {
  href: string;
  variant: ButtonVariant;
  wide?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={[buttonClass(variant, wide), className].filter(Boolean).join(" ")}>
      {children}
    </Link>
  );
}
