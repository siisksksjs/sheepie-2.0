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
  return (
    <a
      href={action.href}
      target="_blank"
      rel="noopener noreferrer"
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
