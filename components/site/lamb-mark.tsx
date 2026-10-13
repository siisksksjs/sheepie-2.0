import Image from "next/image";

import styles from "./site.module.css";

export function LambMark({
  tone = "blue",
  size,
  breathe = false,
  className,
}: {
  tone?: "blue" | "white";
  size: number;
  breathe?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={tone === "blue" ? "/brand/lamb-blue.png" : "/brand/lamb-white.png"}
      alt=""
      width={size}
      height={size}
      className={[breathe ? styles.breathe : "", className].filter(Boolean).join(" ")}
    />
  );
}
