"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import blogData from "@/data/blog.json";
import { ArrowRight, Clock } from "lucide-react";

/** `header` and `footer` are rendered by the server page so the catalog stays out of the client bundle. */
export function BlogList({ header, footer }: { header: ReactNode; footer: ReactNode }) {
  const t = useTranslations('Blog');
  const locale = useLocale();
  const getPath = (path: string) => `/${locale}${path}`;

  // Split into featured and regular posts
  const featuredPost = blogData[0];
  const regularPosts = blogData.slice(1);

  return (
    <main className="min-h-screen flex flex-col bg-white selection:bg-primary/20">
      {header}
      
      {/* Editorial Header */}
      <section className="relative pt-32 pb-24 text-center overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[#F8FAFC] -z-20" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 -z-10" />
        
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/10 bg-white/50 backdrop-blur-sm text-xs font-bold tracking-widest text-primary/60 uppercase"
          >
            {t('subtitle')}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-display font-medium text-primary mb-6 tracking-tight"
          >
            {t('title')}
          </motion.h1>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-24">
        {/* Featured Post */}
        {featuredPost && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-20"
          >
            <Link href={getPath(`/blog/${featuredPost.slug}`)} className="group grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-[2rem]">
                <Image 
                  src={featuredPost.image} 
                  alt={featuredPost.title} 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              
              <div className="md:col-span-4 space-y-6">
                 <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-primary/40 uppercase">
                   <span className="px-2 py-1 bg-primary/5 rounded-md">{featuredPost.date}</span>
                   <span>•</span>
                   <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featuredPost.readTime}</span>
                 </div>
                 
                 <h2 className="text-3xl md:text-4xl font-display font-medium text-primary group-hover:text-primary/70 transition-colors leading-tight">
                   {featuredPost.title}
                 </h2>
                 
                 <p className="text-muted-foreground font-light leading-relaxed line-clamp-3 text-lg">
                   {featuredPost.excerpt}
                 </p>
                 
                 <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                    {t('readMore')} <ArrowRight className="ml-2 w-4 h-4" />
                 </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Regular Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {regularPosts.map((post, i) => (
            <motion.article 
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col space-y-5"
            >
              <Link href={getPath(`/blog/${post.slug}`)} className="block overflow-hidden rounded-2xl aspect-[3/2] relative">
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
              </Link>
              
              <div className="space-y-3">
                 <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-primary/40 uppercase">
                   <span>{post.date}</span>
                   <span className="w-1 h-1 bg-primary/20 rounded-full" />
                   <span>{post.readTime}</span>
                 </div>
                 
                 <h2 className="text-2xl font-display font-medium text-primary group-hover:text-primary/80 transition-colors line-clamp-2">
                   <Link href={getPath(`/blog/${post.slug}`)}>
                     {post.title}
                   </Link>
                 </h2>
                 
                 <p className="text-muted-foreground font-light leading-relaxed line-clamp-2 text-sm">
                   {post.excerpt}
                 </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {footer}
    </main>
  );
}