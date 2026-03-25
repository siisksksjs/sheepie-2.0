"use client";

import { Button } from "@/components/ui/button";
import { generateMarketplaceUrl } from "@/lib/utm";
import { trackMarketplaceClick } from "@/lib/analytics";
import { ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";

interface BuyButtonsProps {
  shopeeUrl: string;
  tokopediaUrl: string;
  productSlug: string;
  className?: string;
}

export function BuyButtons({ shopeeUrl, tokopediaUrl, productSlug, className }: BuyButtonsProps) {
  const pathname = usePathname();
  const isId = pathname?.startsWith("/id");

  const handleBuy = (marketplace: 'shopee' | 'tokopedia', url: string) => {
    trackMarketplaceClick({
      product_slug: productSlug,
      marketplace,
      page_path: pathname || 'unknown',
    });
    
    const finalUrl = generateMarketplaceUrl(url, productSlug);
    window.open(finalUrl, '_blank');
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Button 
        size="lg" 
        className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
        onClick={() => handleBuy('shopee', shopeeUrl)}
      >
        <ShoppingBag className="mr-2 h-4 w-4" />
        {isId ? "Belanja di Shopee" : "Buy on Shopee"}
      </Button>
      <Button 
        size="lg" 
        variant="outline" 
        className="w-full border-primary/20 text-primary hover:bg-primary/5 transition-all duration-300 hover:scale-[1.02]"
        onClick={() => handleBuy('tokopedia', tokopediaUrl)}
      >
        <ShoppingBag className="mr-2 h-4 w-4" />
        {isId ? "Belanja di Tokopedia" : "Buy on Tokopedia"}
      </Button>
    </div>
  );
}
