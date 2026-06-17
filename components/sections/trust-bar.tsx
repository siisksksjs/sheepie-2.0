"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, Heart, Moon } from "lucide-react";
import { useTranslations } from "next-intl";

const benefits = [
  { icon: Moon, id: "betterSleep" },
  { icon: ShieldCheck, id: "quality" },
  { icon: Truck, id: "shipping" },
  { icon: Heart, id: "community" },
];

export function TrustBar() {
  const t = useTranslations('TrustBar');

  return (
    <section className="py-20 border-b border-border/40 bg-white relative z-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 md:gap-12 md:divide-x divide-border/50">
          {benefits.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center text-center gap-4 md:px-6"
            >
              <item.icon className="w-7 h-7 text-primary" strokeWidth={1.25} />
              <div className="space-y-1.5">
                <h3 className="font-display font-medium text-lg text-foreground">{t(`${item.id}.title` as any)}</h3>
                <p className="text-sm text-foreground/65 leading-relaxed max-w-[18ch] mx-auto text-pretty">{t(`${item.id}.desc` as any)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}