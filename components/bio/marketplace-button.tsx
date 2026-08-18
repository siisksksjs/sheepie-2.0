import type { ReactNode } from "react";

import type { BioAction } from "@/data/bio";

type MarketplaceButtonProps = {
  action: BioAction;
  ctaId: string;
  section: string;
  position: string;
  product?: string;
  className?: string;
  children?: ReactNode;
};

export function MarketplaceButton({
  action,
  ctaId,
  section,
  position,
  product,
  className,
  children,
}: MarketplaceButtonProps) {
  // mailto: and tel: hand off to another app; a blank tab would be left behind.
  const opensNewTab = /^https?:/i.test(action.href);

  return (
    <a
      href={action.href}
      target={opensNewTab ? "_blank" : undefined}
      rel={opensNewTab ? "noopener noreferrer" : undefined}
      aria-label={action.accessibleLabel}
      className={className}
      data-bio-cta={ctaId}
      data-bio-product={product}
      data-bio-destination={action.destination}
      data-bio-section={section}
      data-bio-position={position}
    >
      {children ?? action.label}
    </a>
  );
}
