"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export function ContactClient() {
  const t = useTranslations('ContactPage');

  return (
    <main className="min-h-screen flex flex-col bg-white selection:bg-primary/20">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-20 text-center bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-medium text-primary mb-6"
          >
            {t('title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground font-light max-w-lg mx-auto leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-display font-medium text-primary mb-6">{t('infoTitle')}</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/5 rounded-full text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block font-bold text-foreground mb-1">{t('emailLabel')}</span>
                    <a href="mailto:hello@sheepiesleep.com" className="text-muted-foreground hover:text-primary transition-colors">
                      hello@sheepiesleep.com
                    </a>
                    <p className="text-sm text-muted-foreground/60 mt-1">{t('emailNote')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/5 rounded-full text-primary">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="block font-bold text-foreground mb-1">{t('socialLabel')}</span>
                    <p className="text-muted-foreground mb-2">{t('socialNote')}</p>
                    <div className="flex gap-4">
                      <a href="https://www.instagram.com/sheepiesleep.id" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary underline underline-offset-4">Instagram</a>
                      <a href="https://www.tiktok.com/@sheepiesleep" target="_blank" className="text-sm font-medium text-primary underline underline-offset-4">TikTok</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-primary/5 rounded-3xl border border-primary/10">
              <h4 className="font-display font-medium text-primary text-xl mb-4">{t('marketplaceTitle')}</h4>
              <p className="text-muted-foreground font-light mb-6">
                {t('marketplaceDesc')}
              </p>
              <div className="flex gap-4">
                <Button variant="outline" size="sm" className="bg-white border-primary/20 text-primary hover:bg-primary hover:text-white" asChild>
                  <a href="https://shopee.co.id/sheepie.sleep" target="_blank">{t('shopeeChat')}</a>
                </Button>
                <Button variant="outline" size="sm" className="bg-white border-primary/20 text-primary hover:bg-primary hover:text-white" asChild>
                  <a href="https://tokopedia.link/NrBaSzhY3Yb" target="_blank">{t('tokopediaChat')}</a>
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl shadow-primary/5 border border-border/40">
            <h3 className="text-2xl font-display font-medium text-primary mb-8">{t('formTitle')}</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-muted-foreground ml-1">{t('formLabels.name')}</label>
                  <Input id="name" placeholder={t('formPlaceholders.name')} className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-white transition-all" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-muted-foreground ml-1">{t('formLabels.email')}</label>
                  <Input id="email" type="email" placeholder={t('formPlaceholders.email')} className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-white transition-all" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-muted-foreground ml-1">{t('formLabels.subject')}</label>
                <Input id="subject" placeholder={t('formPlaceholders.subject')} className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-white transition-all" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-muted-foreground ml-1">{t('formLabels.message')}</label>
                <Textarea id="message" placeholder={t('formPlaceholders.message')} className="min-h-[150px] rounded-xl bg-muted/30 border-transparent focus:bg-white transition-all resize-none p-4" />
              </div>

              <Button size="lg" className="w-full h-12 rounded-full text-base font-medium bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20">
                {t('submit')}
              </Button>
            </form>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
