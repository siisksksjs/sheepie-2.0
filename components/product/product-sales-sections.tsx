import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BuyButtons } from "@/components/product/buy-buttons";
import { getProductPageContent } from "@/lib/product-page-content";
import { Check, CircleAlert, PackageCheck, Sparkles } from "lucide-react";

interface ProductVariant {
  name: string;
  price: string;
  originalPrice?: string;
  shopeeUrl: string;
  tokopediaUrl: string;
}

interface Product {
  slug: string;
  name: string;
  tagline: string;
  price: string;
  originalPrice?: string;
  description: string;
  benefits: string[];
  shopeeUrl: string;
  tokopediaUrl: string;
  variants?: ProductVariant[];
}

interface ProductSalesSectionsProps {
  product: Product;
  locale: string;
}

const editedImageMap: Record<string, [string, string, string, string]> = {
  calmicloud: [
    "/images/edited/DSC01249.JPG",
    "/images/edited/DSC01241.JPG",
    "/images/edited/DSC01225.JPG",
    "/images/edited/DSC01263.JPG",
  ],
  cervicloud: [
    "/images/edited/DSC01187.JPG",
    "/images/edited/DSC01139.JPG",
    "/images/edited/DSC01148.JPG",
    "/images/edited/DSC01058.JPG",
  ],
  lumicloud: [
    "/images/edited/DSC01316.JPG",
    "/images/edited/DSC01334.JPG",
    "/images/edited/DSC01278.JPG",
    "/images/edited/DSC01058.JPG",
  ],
};

export function ProductSalesSections({ product, locale }: ProductSalesSectionsProps) {
  const content = getProductPageContent(product.slug, locale);
  const isId = locale === "id";
  const repeatedMarqueeItems = [...content.marquee, ...content.marquee];
  const [lifestyleImage, detailImageOne, detailImageTwo, detailImageThree] =
    editedImageMap[product.slug] || editedImageMap.cervicloud;

  return (
    <div className="space-y-10 lg:space-y-14">
      <section className="overflow-hidden rounded-full border border-border/60 bg-primary text-primary-foreground shadow-lg shadow-primary/10">
        <div className="flex w-max min-w-full animate-marquee gap-6 py-4 pr-6">
          {repeatedMarqueeItems.map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-center gap-6 whitespace-nowrap pl-6">
              <Sparkles className="h-4 w-4 opacity-80" />
              <span className="text-sm font-medium tracking-[0.22em] uppercase">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-border/60 bg-[linear-gradient(180deg,#ffffff_0%,#f4f8fb_100%)] p-8 shadow-sm lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/70">{content.problemTitle}</p>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{content.problemIntro}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[340px] overflow-hidden rounded-[1.75rem] bg-[#eef4fb]">
              <Image
                src={lifestyleImage}
                alt={`${product.name} lifestyle`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                  {isId ? "Real sleep problem" : "Real sleep problem"}
                </p>
                <p className="mt-2 max-w-sm text-base leading-7">
                  {isId
                    ? "Produk ini paling efektif saat Anda datang dengan satu pain point yang jelas, bukan sekadar ingin upgrade aesthetic kamar."
                    : "This works best when the customer arrives with one clear pain point, not just a vague desire to upgrade sleep aesthetics."}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="relative min-h-[162px] overflow-hidden rounded-[1.5rem] border border-border/60 bg-white">
                <Image
                  src={detailImageOne}
                  alt={`${product.name} detail`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 24vw"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="relative min-h-[162px] overflow-hidden rounded-[1.5rem] border border-border/60 bg-white">
                  <Image
                    src={detailImageTwo}
                    alt={`${product.name} angle view`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 12vw"
                  />
                </div>
                <div className="relative min-h-[162px] overflow-hidden rounded-[1.5rem] border border-border/60 bg-white">
                  <Image
                    src={detailImageThree}
                    alt={`${product.name} close-up`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 12vw"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {content.problemPoints.map((point) => (
              <div key={point} className="rounded-[1.5rem] border border-border/60 bg-white/90 p-5">
                <CircleAlert className="h-5 w-5 text-primary" />
                <p className="mt-4 text-sm leading-7 text-foreground/85">{point}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-primary/10 bg-primary p-8 text-primary-foreground shadow-lg shadow-primary/10 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-foreground/70">{content.solutionTitle}</p>
          <p className="mt-4 text-base leading-8 text-primary-foreground/80">{content.solutionIntro}</p>
          <div className="mt-8 space-y-4">
            {content.features.map((feature) => (
              <div key={feature.title} className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-white/12 p-2">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-primary-foreground/78">{feature.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-border/60 bg-white p-5 shadow-sm lg:p-6">
          <div className="relative min-h-[360px] overflow-hidden rounded-[1.6rem] bg-[#eef4fb]">
            <Image
              src={detailImageOne}
              alt={`${product.name} feature visual`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 34vw"
            />
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[2rem] border border-border/60 bg-white p-8 shadow-sm lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/70">
              {isId ? "At a glance" : "At a glance"}
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {content.features.map((feature, index) => {
                const image = [detailImageOne, detailImageTwo, detailImageThree][index] || detailImageOne;
                return (
                  <div key={feature.title} className="overflow-hidden rounded-[1.5rem] border border-border/60 bg-[#fbfcfe]">
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={image}
                        alt={feature.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 22vw"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{feature.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {content.keyBenefits.slice(0, 3).map((benefit) => (
              <div key={benefit} className="rounded-[1.5rem] border border-border/60 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfd_100%)] p-5 shadow-sm">
                <Check className="h-5 w-5 text-primary" />
                <p className="mt-4 text-sm leading-7 text-foreground/85">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-border/60 bg-white p-8 shadow-sm lg:p-10">
          <div className="flex items-center gap-3">
            <PackageCheck className="h-5 w-5 text-primary" />
            <h2 className="text-2xl text-primary">{content.goodFitTitle}</h2>
          </div>
          <ul className="mt-6 space-y-4">
            {content.goodFit.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-7 text-foreground/85">
                <Check className="mt-1 h-4 w-4 flex-none text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[2rem] border border-border/60 bg-[#fbfcfe] p-8 shadow-sm lg:p-10">
          <div className="flex items-center gap-3">
            <CircleAlert className="h-5 w-5 text-primary" />
            <h2 className="text-2xl text-primary">{content.notFitTitle}</h2>
          </div>
          <ul className="mt-6 space-y-4">
            {content.notFit.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-7 text-foreground/85">
                <CircleAlert className="mt-1 h-4 w-4 flex-none text-primary/70" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border/60 bg-white p-8 shadow-sm lg:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/70">{content.compareTitle}</p>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{content.compareLead}</p>
        </div>

        <div className="mt-8 overflow-x-auto">
          <div className="min-w-[720px] overflow-hidden rounded-[1.5rem] border border-border/60">
            <div className="grid grid-cols-[1.1fr_1fr_1fr] bg-primary px-5 py-4 text-sm font-semibold text-primary-foreground">
              <div>{isId ? "Aspek" : "Category"}</div>
              <div>Sheepie</div>
              <div>{content.compareGenericLabel}</div>
            </div>
            {content.comparisonRows.map((row, index) => (
              <div
                key={row.label}
                className={`grid grid-cols-[1.1fr_1fr_1fr] gap-4 px-5 py-5 text-sm leading-7 ${
                  index % 2 === 0 ? "bg-[#f8fbfd]" : "bg-white"
                }`}
              >
                <div className="font-medium text-foreground">{row.label}</div>
                <div className="text-foreground/80">{row.sheepie}</div>
                <div className="text-muted-foreground">{row.generic}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-border/60 bg-[linear-gradient(180deg,#213368_0%,#2d437f_100%)] p-8 text-primary-foreground shadow-lg shadow-primary/10 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-foreground/70">{content.bundleTitle}</p>
          <p className="mt-4 max-w-xl text-base leading-8 text-primary-foreground/80">{content.bundleBody}</p>
          <div className="mt-8">
            <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              <Link href={`/${locale}/products/${content.relatedSlug}`}>{content.relatedCta}</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border/60 bg-white p-8 shadow-sm lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/70">{content.faqTitle}</p>
          <div className="relative mt-6 h-44 overflow-hidden rounded-[1.5rem] border border-border/60 bg-[#eef4fb]">
            <Image
              src={lifestyleImage}
              alt={`${product.name} FAQ visual`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/25 to-transparent" />
          </div>
          <Accordion type="single" collapsible className="mt-6">
            {content.faqs.map((faq, index) => (
              <AccordionItem key={faq.q} value={`faq-${index}`} className="border-border/60">
                <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-7 text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="rounded-[2.2rem] border border-primary/10 bg-[linear-gradient(135deg,#eef4fb_0%,#ffffff_50%,#f4f8fb_100%)] p-8 shadow-sm lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary/70">
              {isId ? "Langkah berikutnya" : "Next step"}
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl leading-tight text-primary lg:text-4xl">{content.ctaTitle}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">{content.ctaBody}</p>
            <p className="mt-4 text-sm leading-7 text-foreground/75">{content.ctaNote}</p>
          </div>

          <div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
            <BuyButtons
              shopeeUrl={product.variants?.[0]?.shopeeUrl ?? product.shopeeUrl}
              tokopediaUrl={product.variants?.[0]?.tokopediaUrl ?? product.tokopediaUrl}
              productSlug={product.slug}
              className="w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
