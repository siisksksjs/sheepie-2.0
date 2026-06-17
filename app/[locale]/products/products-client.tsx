"use client";

import { useRef } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import products from "@/data/products.json";
import { useTranslations, useLocale } from "next-intl";

// Mapping lifestyle images to products
const productLifestyleMap: Record<string, string> = {
  "calmicloud": "/images/edited/DSC01249.JPG", 
  "cervicloud": "/images/edited/DSC01187.JPG", 
  "lumicloud": "/images/edited/DSC01316.JPG" 
};

export function ProductsClient() {
  const t = useTranslations('ProductsPage');

  return (
    <main className="min-h-screen flex flex-col bg-white text-foreground selection:bg-primary/20 overflow-x-hidden">
      <Navbar />
      
      {/* Cinematic Header */}
      <section className="h-[50vh] flex items-center justify-center relative overflow-hidden">
        {/* Subtle background gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        
        <div className="container mx-auto px-4 text-center relative z-10 pt-20">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl font-display font-medium text-primary mb-6 tracking-tight text-balance"
          >
            {t('title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-foreground/70 text-lg max-w-md mx-auto text-pretty"
          >
            {t('subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Parallax Product List */}
      <div className="flex flex-col gap-0 pb-32">
        {products.map((product, index) => (
          <ParallaxProductRow key={product.slug} product={product} index={index} />
        ))}
      </div>

      <Footer />
    </main>
  );
}

function ParallaxProductRow({ product, index }: { product: any, index: number }) {
  const t = useTranslations('ProductsPage');
  const tProd = useTranslations('Products');
  const locale = useLocale();
  const getPath = (path: string) => `/${locale}${path}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const isEven = index % 2 === 0;

  // Gentle Parallax transforms (content stays fully legible — no fade-to-invisible)
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const textY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={containerRef} className="min-h-[80vh] flex items-center py-20 relative">
      <div className="container mx-auto px-4">
        <div className={`grid lg:grid-cols-12 gap-12 lg:gap-20 items-center ${isEven ? '' : ''}`}>
          
          {/* Visual Column (7 cols) */}
          <div className={`lg:col-span-7 relative ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
             
             {/* Main Image Container */}
             <motion.div
               style={{ y }}
               className="relative aspect-[3/4] md:aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_30px_80px_-50px_rgba(33,51,104,0.45)]"
             >
                <Image
                  src={productLifestyleMap[product.slug]}
                  alt={`${tProd(`${product.slug}.name` as any)} in a real sleep setting`}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
             </motion.div>
          </div>

          {/* Content Column (5 cols) */}
          <div className={`lg:col-span-5 relative z-10 space-y-10 ${isEven ? 'lg:order-2' : 'lg:order-1 lg:text-right'}`}>
             <motion.div style={{ y: textY }}>
               <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-medium text-primary leading-[1] mb-4">
                 {tProd(`${product.slug}.name` as any)}
               </h2>
               <p className="text-2xl text-primary/60 font-light italic font-display">
                 {tProd(`${product.slug}.tagline` as any)}
               </p>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className={`h-px w-24 bg-primary/20 ${isEven ? '' : 'ml-auto'}`}
             />

             <p className="text-xl text-foreground/70 leading-relaxed text-pretty">
               {tProd(`${product.slug}.description` as any)}
             </p>

             <div className={`flex items-center gap-6 pt-2 ${isEven ? '' : 'justify-end'}`}>
               <div className="flex items-baseline gap-3">
                 {product.originalPrice && (
                   <span className="text-lg text-foreground/40 line-through decoration-foreground/40">
                     {product.originalPrice}
                   </span>
                 )}
                 <span className="text-3xl font-display text-primary">{product.price}</span>
               </div>
               <Button size="lg" className="px-8" asChild>
                 <Link href={getPath(`/products/${product.slug}`)}>
                   {t('viewDetails')} <ArrowRight className="ml-2 w-4 h-4" />
                 </Link>
               </Button>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}