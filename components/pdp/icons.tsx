// components/pdp/icons.tsx
import {
  AirplaneTilt,
  ArrowsClockwise,
  Bed,
  Ear,
  EyeClosed,
  Feather,
  HandGrabbing,
  MoonStars,
  Package,
  Snowflake,
  WashingMachine,
  Waves,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

import type { IconName } from "@/lib/catalog/types";

const icons: Record<IconName, Icon> = {
  neck: Bed,
  cool: Snowflake,
  foam: Waves,
  wash: WashingMachine,
  dark: MoonStars,
  eye: EyeClosed,
  hair: Feather,
  travel: AirplaneTilt,
  ear: Ear,
  mold: HandGrabbing,
  case: Package,
  reuse: ArrowsClockwise,
};

/** Phosphor duotone glyphs: the soft fill picks up the tile's sky tone. */
export function ProductIcon({ name, size = 22 }: { name: IconName; size?: number }) {
  const Glyph = icons[name];
  return <Glyph size={size} weight="duotone" aria-hidden="true" />;
}
