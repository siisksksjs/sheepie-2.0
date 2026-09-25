"use client";

import { useCallback, useState, type ComponentProps } from "react";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductDetails, type ProductColor } from "@/components/product/product-details";

type ProductHeroProps = {
  product: ComponentProps<typeof ProductDetails>["product"] & { images: string[] };
  productName: string;
  locale: string;
};

const NO_COLORS: ProductColor[] = [];

/** Gallery and details side by side, kept in sync through the colour picker. */
export function ProductHero({ product, productName, locale }: ProductHeroProps) {
  const colors = product.colors ?? NO_COLORS;
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0]?.name ?? null);
  const [jumpTo, setJumpTo] = useState<{ index: number }>();

  const handleColorSelect = (color: ProductColor) => {
    setSelectedColor(color.name);
    const index = product.images.indexOf(color.image);
    if (index >= 0) setJumpTo({ index });
  };

  // Swiping onto a colour's photo selects that colour too.
  const handleIndexChange = useCallback(
    (index: number) => {
      const color = colors.find((item) => item.image === product.images[index]);
      if (color) setSelectedColor(color.name);
    },
    [colors, product.images],
  );

  return (
    <div className="relative grid w-full gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
      <div className="w-full min-w-0 lg:col-span-7 lg:sticky lg:top-24 lg:self-start">
        <ProductGallery
          images={product.images}
          productName={productName}
          jumpTo={jumpTo}
          onIndexChange={colors.length > 0 ? handleIndexChange : undefined}
        />
      </div>

      <div className="relative w-full min-w-0 lg:col-span-5">
        <ProductDetails
          product={product}
          locale={locale}
          selectedColor={selectedColor}
          onColorSelect={handleColorSelect}
        />
      </div>
    </div>
  );
}
