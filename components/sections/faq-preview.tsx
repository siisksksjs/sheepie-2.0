"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";

// Define keys to look up
const faqKeys = [
  "calmi.reusable",
  "lumi.eyelashes",
  "cervi.firmness",
  "shipping.duration"
];

export function FAQPreview() {
  const t = useTranslations('FAQPreview');
  const tFAQ = useTranslations('FAQs');
  const locale = useLocale();
  const getPath = (path: string) => `/${locale}${path}`;

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-medium text-primary text-balance">
            {t('title')}
          </h2>
        </div>
        
        <div className="space-y-4">
          {faqKeys.map((key, i) => (
            <FAQItem 
              key={i} 
              question={tFAQ(`${key}.q` as any)} 
              answer={tFAQ(`${key}.a` as any)} 
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="link" className="text-primary text-lg" asChild>
            <Link href={getPath("/faq")}>{t('viewAll')} &rarr;</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-border/40 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-6 text-left"
      >
        <span className="font-medium text-lg text-primary">{question}</span>
        <div className={`p-1 rounded-full bg-primary/5 transition-colors ${isOpen ? 'bg-primary text-white' : 'text-primary'}`}>
           {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 text-foreground/70 leading-relaxed text-pretty">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}