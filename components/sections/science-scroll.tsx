"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { AlignmentIcon, DarknessIcon, SilenceIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

const scienceSteps = [
  {
    id: "alignment",
    icon: AlignmentIcon,
    image: "/images/edited/DSC01139.JPG",
    accent: "text-white",
    productLink: "/products/cervicloud"
  },
  {
    id: "darkness",
    icon: DarknessIcon,
    image: "/images/edited/DSC01058.JPG",
    accent: "text-secondary",
    productLink: "/products/lumicloud"
  },
  {
    id: "silence",
    icon: SilenceIcon,
    image: "/images/edited/DSC01316.JPG",
    accent: "text-secondary",
    productLink: "/products/calmicloud"
  }
];

export function ScienceScroll() {
  const t = useTranslations('ScienceScroll');
  const locale = useLocale();
  const getPath = (path: string) => `/${locale}${path}`;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.35) setActiveStep(0);
    else if (latest < 0.7) setActiveStep(1);
    else setActiveStep(2);
  });

  return (
    <section ref={containerRef} className="relative h-[350vh] bg-[#0A0A0A] text-white">
      
      <div className="sticky top-0 h-screen flex flex-col md:flex-row overflow-hidden">
        
        {/* Left: Cinematic Image Area */}
        <div className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden">
           <AnimatePresence mode="popLayout">
             <motion.div
               key={activeStep}
               initial={{ opacity: 0, scale: 1.1 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 1, ease: "easeInOut" }}
               className="absolute inset-0"
             >
               <Image 
                 src={scienceSteps[activeStep].image} 
                 alt={t(`steps.${scienceSteps[activeStep].id}.subtitle` as any)} 
                 fill 
                 className="object-cover opacity-80"
                 priority
               />
               <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent md:bg-gradient-to-l" />
             </motion.div>
           </AnimatePresence>
        </div>

        {/* Right: Content Area Background */}
        <div className="hidden md:block w-1/2 h-full bg-[#0A0A0A]" />
      </div>

      {/* Scrolling Text Content (Overlaid on Desktop) */}
      <div className="absolute top-0 right-0 w-full md:w-1/2 z-20">
        {scienceSteps.map((step, index) => (
          <div key={step.id} className="h-screen flex items-center justify-center p-8 md:p-16">
             <motion.div 
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ margin: "-20% 0px -20% 0px" }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               className="space-y-6 max-w-lg"
             >
                <div className={`flex items-center gap-3 ${step.accent}`}>
                  <div className="p-3 rounded-full bg-white/5 border border-white/20">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em]">{t('method', {index: index + 1})}</span>
                </div>
                
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium leading-tight">
                  {t(`steps.${step.id}.subtitle` as any)}
                </h3>
                
                <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed">
                  {t(`steps.${step.id}.description` as any)}
                </p>

                <div className="pt-4">
                  <Button variant="outline" className="rounded-full h-12 px-8 border-white/20 bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300" asChild>
                    <Link href={getPath(step.productLink)}>
                        {t('explore', {product: t(`steps.${step.id}.productName` as any)})}
                    </Link>
                  </Button>
                </div>
             </motion.div>
          </div>
        ))}
      </div>

    </section>
  );
}