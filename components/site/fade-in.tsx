"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

import styles from "./site.module.css";

let observer: IntersectionObserver | null = null;

function sharedObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = "true";
            observer!.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
  }
  return observer;
}

/** Fades content in once when it enters the viewport. */
export function FadeIn({
  index = 0,
  className,
  id,
  section,
  children,
}: {
  index?: number;
  className?: string;
  id?: string;
  section?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = sharedObserver();
    io.observe(node);
    return () => io.unobserve(node);
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      data-fade=""
      data-section={section}
      className={[styles.fade, className].filter(Boolean).join(" ")}
      style={{ "--fade-delay": `${index * 70}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
