import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import blogData from "@/data/blog.json";
import { ArrowLeft } from "lucide-react";

const baseUrl = "https://sheepiesleep.com";

export async function generateStaticParams() {
  return blogData.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const post = blogData.find((p) => p.slug === slug);
  
  if (!post) return {};
  
  return {
    title: `${post.title} | Sheepie Journal`,
    description: post.excerpt,
    alternates: {
      canonical: `${baseUrl}/id/blog/${post.slug}`,
    },
    robots: locale === 'id'
      ? undefined
      : {
          index: false,
          follow: true,
        },
    openGraph: {
      url: `${baseUrl}/id/blog/${post.slug}`,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const post = blogData.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const t = await getTranslations({locale, namespace: 'Blog'});

  return (
    <main className="min-h-screen flex flex-col bg-white selection:bg-primary/20">
      <Navbar />
      
      <article className="pt-32 pb-24">
        {/* Header */}
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-6 mb-12">
           <Link 
             href={`/${locale}/blog`} 
             className="inline-flex items-center text-sm font-bold tracking-widest uppercase text-primary/40 hover:text-primary transition-colors mb-4"
           >
             <ArrowLeft className="mr-2 w-4 h-4" /> {t('back')}
           </Link>
           
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-primary leading-tight">
             {post.title}
           </h1>
           
           <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground font-light">
             <span>{post.date}</span>
             <span className="w-1 h-1 bg-border rounded-full" />
             <span>{post.readTime}</span>
           </div>
        </div>

        {/* Featured Image */}
        <div className="container mx-auto px-4 max-w-5xl mb-16">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-sm">
            <Image 
              src={post.image} 
              alt={post.title} 
              fill 
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-lg prose-headings:font-display prose-headings:font-medium prose-p:font-light prose-p:text-muted-foreground prose-a:text-primary max-w-none">
            {post.content.map((block: any, i: number) => {
              if (block.type === 'h2') {
                return <h2 key={i} className="text-3xl text-primary mt-12 mb-6">{block.text}</h2>;
              }
              if (block.type === 'h3') {
                return <h3 key={i} className="text-2xl text-primary mt-8 mb-4">{block.text}</h3>;
              }
              if (block.type === 'p') {
                return <p key={i} className="leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: block.text }} />;
              }
              if (block.type === 'ul') {
                return (
                  <ul key={i} className="list-disc pl-6 mb-6 space-y-2">
                    {block.items.map((item: string, j: number) => (
                      <li key={j} className="text-muted-foreground font-light" dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                  </ul>
                );
              }
              return null;
            })}
          </div>
          
          <div className="border-t border-border/40 mt-16 pt-8 flex justify-between items-center text-sm text-muted-foreground">
             <div className="flex items-center gap-2">
               <span className="font-bold text-primary/40 uppercase tracking-widest">{t('writtenBy')}</span>
               <span className="text-primary font-medium">{post.author}</span>
             </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
