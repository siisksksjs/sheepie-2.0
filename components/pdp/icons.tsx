// components/pdp/icons.tsx
import type { IconName } from "@/lib/catalog/types";

const paths: Record<IconName, string> = {
  neck: "M4 15c3-4 13-4 16 0M6 15v3h12v-3M12 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6z",
  cool: "M12 2v20M4 6l16 12M20 6L4 18",
  foam: "M7 8h10a4 4 0 0 1 0 9H7a4 4 0 0 1 0-9zM8 8c0 2 8 2 8 0",
  wash: "M4 7h16l-1.5 12h-13zM4 7c2 2 4 2 6 0s4-2 6 0 4 2 4 0",
  dark: "M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z",
  eye: "M3 12c4-6 14-6 18 0M7 13l-1 2M12 14v2M17 13l1 2",
  hair: "M5 20c0-9 3-15 7-15s7 6 7 15M9 20c0-6 1-10 3-10s3 4 3 10",
  travel: "M3 14l18-7-6 13-3-5z",
  ear: "M8 10a4 4 0 1 1 8 0c0 3-3 4-3 7a2 2 0 0 1-4 0",
  mold: "M6 14c0-4 3-8 6-8s6 4 6 8-3 5-6 5-6-1-6-5z",
  case: "M4 8h16v10H4zM4 11h16",
  reuse: "M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2M18 4v5h-5M6 20v-5h5",
};

export function ProductIcon({ name }: { name: IconName }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}
