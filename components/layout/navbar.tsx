"use client";

import Link from "next/link";
import siteData from "@/data/site.json";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { useTranslations, useLocale } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";

export function Navbar() {
  const t = useTranslations('Navbar');
  const locale = useLocale();

  // Helper to get localized path
  const getPath = (path: string) => `/${locale}${path === '/' ? '' : path}`;

  const navItems = [
    { label: t('home'), href: "/" },
    { label: t('collection'), href: "/products" },
    { label: t('journal'), href: "/blog" },
    { label: t('about'), href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href={getPath("/")} className="font-display text-2xl font-bold text-primary">
          {siteData.name}
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={getPath(item.href)}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA & Switcher */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <Button asChild size="sm">
            <Link href={getPath("/products")}>
              {t('shopNow')}
            </Link>
          </Button>
        </div>
        
        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="text-left border-b pb-4 mb-4">
                <SheetTitle className="font-display text-2xl font-bold text-primary">
                  {siteData.name}
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col gap-4 py-4">
                {navItems.map((item) => (
                  <SheetClose key={item.href} asChild>
                    <Link
                      href={getPath(item.href)}
                      className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-2"
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </div>

              <div className="mt-8">
                <SheetClose asChild>
                  <Button asChild className="w-full h-12 text-base">
                    <Link href={getPath("/products")}>
                      {t('shopAll')}
                    </Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}