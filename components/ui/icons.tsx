import * as React from "react";

/**
 * Bespoke Sheepie line-icons for the three sleep pillars. Hand-tuned on a 24px
 * grid, 1.5 stroke, currentColor — distinct from off-the-shelf icon sets so the
 * brand's core concepts don't read as generic.
 */

type IconProps = React.SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Spine S-curve with vertebrae nodes — cervical alignment. */
export function AlignmentIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3c3 2.6 3 6.4 0 9s-3 6.4 0 9" />
      <path d="M12 3.2h.01M12.9 7.4h.01M11.1 11.9h.01M12.9 16.4h.01M12 20.8h.01" />
    </svg>
  );
}

/** Crescent with a single star — darkness / deep night. */
export function DarknessIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.7 6.7 0 0 0 10.7 10.7Z" />
      <path d="M17.4 3.5l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5z" />
    </svg>
  );
}

/** Muted sound waves with a soft slash — silence. */
export function SilenceIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 10v4" />
      <path d="M8.5 8.2a6 6 0 0 1 0 7.6" />
      <path d="M12 5.5a11 11 0 0 1 0 13" />
      <path d="M3.5 3.5l17 17" />
    </svg>
  );
}
