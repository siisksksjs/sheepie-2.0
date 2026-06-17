"use client";

import { motion } from "framer-motion";
import { Coffee, Smartphone, Wind, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

const ritualKeys = [
  { icon: Smartphone, id: "digital" },
  { icon: Coffee, id: "caffeine" },
  { icon: Wind, id: "breath" }
];

export function SleepAcademy() {
  const t = useTranslations('SleepAcademy');

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-4">
        
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Header */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 mb-12 lg:mb-0">
             <h2 className="text-4xl md:text-5xl font-display font-medium text-primary leading-tight text-balance">
               {t.rich('title', {
                 br: () => <br/>,
                 span1: (chunks) => <span className="italic text-primary/70">{chunks}</span>
               })}
             </h2>
             <p className="text-foreground/70 leading-relaxed text-pretty">
               {t('description')}
             </p>
          </div>

          {/* Cards */}
          <div className="lg:col-span-8 grid gap-6">
            {ritualKeys.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-border/40 hover:shadow-md transition-shadow"
              >
                 <div className="flex gap-6 items-start">
                   <div className="p-4 bg-primary/5 rounded-2xl text-primary shrink-0">
                     <item.icon className="w-6 h-6" strokeWidth={1.5} />
                   </div>
                   <div className="space-y-3">
                     <h3 className="text-xl font-display font-medium text-foreground">{t(`rituals.${item.id}.title` as any)}</h3>
                     <p className="text-foreground/70 leading-relaxed text-pretty">
                       {t(`rituals.${item.id}.desc` as any)}
                     </p>
                     <div className="flex items-center gap-2 text-sm text-primary font-medium bg-primary/5 w-fit px-3 py-1 rounded-full">
                       <CheckCircle2 className="w-4 h-4" />
                       {t(`rituals.${item.id}.action` as any)}
                     </div>
                   </div>
                 </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}