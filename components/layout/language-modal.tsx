"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function LanguageModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('LanguageModal');
  const currentLocale = useLocale();
  const isEventPage = pathname.endsWith('/sheepie-x-yoga-spin');

  useEffect(() => {
    if (isEventPage) return;
    // Check if user has already made a choice
    const hasChosen = localStorage.getItem('language-chosen');
    if (!hasChosen) {
      const frame = window.requestAnimationFrame(() => setOpen(true));
      return () => window.cancelAnimationFrame(frame);
    }
  }, [isEventPage]);

  const selectLanguage = (newLocale: string) => {
    // Save preference
    localStorage.setItem('language-chosen', 'true');
    
    // Switch URL if needed
    if (newLocale !== currentLocale) {
      const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
      router.push(newPath);
    }
    
    setOpen(false);
  };

  if (isEventPage) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md [&>button]:hidden" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center space-y-4">
          <DialogTitle className="text-2xl font-display font-bold text-primary">
            {t('title')}
          </DialogTitle>
          <DialogDescription className="text-lg font-light text-muted-foreground">
            {t('subtitle')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full h-14 text-lg font-medium hover:bg-primary/5 hover:border-primary/50 transition-all"
            onClick={() => selectLanguage('en')}
          >
            {t('english')}
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full h-14 text-lg font-medium hover:bg-primary/5 hover:border-primary/50 transition-all"
            onClick={() => selectLanguage('id')}
          >
            {t('indonesian')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
