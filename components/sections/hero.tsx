"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

export function Hero() {
  const t = useTranslations('Hero');
  const locale = useLocale();
  const getPath = (path: string) => `/${locale}${path}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={containerRef} className="relative w-full min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
      
      {/* Dynamic Background Text (Subtle Layer) */}
      <div className="absolute top-[5%] left-0 w-full overflow-hidden opacity-[0.03] select-none pointer-events-none">
        <h1 className="text-[20vw] font-display font-black whitespace-nowrap text-primary animate-marquee">
          {t('bgText')}
        </h1>
      </div>

      <div className="container mx-auto px-4 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left: Typography & Story */}
        <div className="lg:col-span-6 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            <div className="flex items-center gap-4">
               <div className="h-px w-12 bg-primary/40" />
               <span className="text-primary/70 text-sm font-medium font-body">
                 {t('subtitle')}
               </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-medium text-primary leading-[0.9] tracking-tight text-balance">
              {t.rich('title', {
                br: () => <br/>,
                span1: (chunks) => <span className="italic font-light text-primary/70">{chunks}</span>
              })}
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-foreground/75 font-normal leading-relaxed max-w-md text-pretty"
          >
            {t.rich('description', {
                br: () => <br/>,
                span1: (chunks) => <span className="font-medium text-foreground">{chunks}</span>
            })}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <Button size="lg" asChild>
              <Link href="#products">{t('ctaPrimary')}</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href={getPath("/about")}>{t('ctaSecondary')}</Link>
            </Button>
          </motion.div>
        </div>
        
        {/* Right: Immersive Image with Parallax */}
        <div className="lg:col-span-6 relative h-[50vh] lg:h-[70vh] w-full">
           <motion.div style={{ y, scale }} className="relative w-full h-full">
             <div className="absolute inset-0 rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl">
               <Image 
                src="/images/edited/DSC01334.JPG"
                alt="A woman waking rested after a night with Sheepie sleep essentials"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
               {/* Editorial Overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent mix-blend-multiply" />
             </div>
             
           </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-primary/40">{t('scroll')}</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-primary/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}