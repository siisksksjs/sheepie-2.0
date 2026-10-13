import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { use } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

// Pick a few distinct images for the grid to tell a story
const aboutImages = [
  "/images/edited/DSC01241.JPG", // Heroic
  "/images/edited/DSC01263.JPG", // Detail
  "/images/edited/DSC01334.JPG", // Relaxed (Hero variant)
  "/images/edited/DSC01148.JPG", // Texture
  "/images/edited/DSC01313.JPG", // Context
  "/images/edited/DSC01225.JPG", // Lifestyle
];

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'AboutPage'});
 
  return {
    title: t('metaTitle'),
    description: t('metaDescription')
  };
}

export default function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('AboutPage');

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8 mb-24">
          <span className="text-primary/60 text-sm font-bold tracking-widest uppercase">{t('label')}</span>
          <h1 className="font-display text-5xl md:text-7xl font-medium text-primary leading-[1.1]">
            {t.rich('title', {
              br: () => <br/>,
              span1: (chunks) => <span className="italic text-primary/70">{chunks}</span>
            })}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
            {t('intro')}
          </p>
        </div>

        {/* Masonry-ish Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-24">
           {aboutImages.map((src, idx) => (
             <div key={idx} className={`relative rounded-2xl overflow-hidden bg-muted ${idx % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square md:aspect-[3/4]'} ${idx === 1 ? 'md:translate-y-12' : ''} ${idx === 4 ? 'md:-translate-y-12' : ''}`}>
               <Image 
                 src={src} 
                 alt="Sheepie Lifestyle" 
                 fill 
                 className="object-cover hover:scale-105 transition-transform duration-700"
                 sizes="(max-width: 768px) 50vw, 33vw"
               />
             </div>
           ))}
        </div>

        <div className="max-w-3xl mx-auto prose prose-lg prose-headings:font-display prose-headings:font-medium prose-p:font-light prose-p:text-muted-foreground text-center">
          <h2>{t('sectionTitle')}</h2>
          <p>
            {t.rich('p1', {
              strong1: (chunks) => <strong>{chunks}</strong>,
              strong2: (chunks) => <strong>{chunks}</strong>,
              strong3: (chunks) => <strong>{chunks}</strong>
            })}
          </p>
          <p>
            {t('p2')}
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}