import Image from "next/image";
import {
  ArrowUpRight,
  Globe2,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Music2,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Star,
} from "lucide-react";

import type { BioAction, BioConfig } from "@/data/bio";

import { BioPostHog } from "./bio-posthog";
import { BioTracker } from "./bio-tracker";
import { MarketplaceButton } from "./marketplace-button";
import styles from "./bio-page.module.css";

type BioPageProps = {
  config: BioConfig;
};

const destinationIcons: Record<BioAction["destination"], typeof Globe2> = {
  website: Globe2,
  shopee: ShoppingBag,
  tokopedia: ShoppingBag,
  instagram: Instagram,
  tiktok: Music2,
  whatsapp: MessageCircle,
  email: Mail,
};

/**
 * Official marketplace marks, taken from each store's own published app icon,
 * so a shopper recognises the destination before reading the label.
 */
const brandLogos: Partial<Record<BioAction["destination"], string>> = {
  shopee: "/images/bio/shopee-logo.png",
  tokopedia: "/images/bio/tokopedia-logo.png",
};

const trustPoints = [
  { icon: ShieldCheck, label: "Bayar di marketplace" },
  { icon: MapPin, label: "Kirim se-Indonesia" },
  { icon: PackageCheck, label: "Material pilihan" },
];

export function BioPage({ config }: BioPageProps) {
  return (
    <main className={styles.page}>
      <BioPostHog />
      <BioTracker />

      <nav
        className={styles.nav}
        aria-label="Sheepie"
        data-bio-section="bio-header"
        data-bio-track-section="bio-header"
      >
        <Image
          src="/images/bio/sheepie-logo.png"
          alt="Sheepie"
          width={400}
          height={265}
          priority
          className={styles.logo}
        />
      </nav>

      <div className={styles.shell}>
        <section
          className={styles.banner}
          data-bio-section="bio-banner"
          data-bio-track-section="bio-banner"
        >
          <Image
            src={config.bannerImage.src}
            alt={config.bannerImage.alt}
            fill
            priority
            sizes="(max-width: 480px) 100vw, 30rem"
            className={styles.bannerImage}
          />
        </section>

        <ul
          className={styles.trustStrip}
          data-bio-section="bio-trust"
          data-bio-track-section="bio-trust"
        >
          {trustPoints.map((point) => (
            <li key={point.label}>
              <point.icon size={13} aria-hidden="true" />
              <span>{point.label}</span>
            </li>
          ))}
        </ul>

        <section aria-labelledby="bio-products-heading" className={styles.group}>
          <h2 id="bio-products-heading" className={styles.groupHeading}>
            Produk
          </h2>

          <div className={styles.productGrid}>
            {config.products.map((product) => {
              const shopee = product.actions.find((action) => action.destination === "shopee")!;

              return (
                <article
                  key={product.id}
                  id={product.id}
                  className={styles.productCard}
                  data-bio-section={product.id}
                  data-bio-track-section={product.id}
                  data-bio-product={product.slug}
                >
                  <div className={styles.productMedia}>
                    <Image
                      src={product.image.src}
                      alt={product.image.alt}
                      fill
                      sizes="(max-width: 480px) 45vw, 14rem"
                      className={styles.productImage}
                    />
                  </div>
                  <div className={styles.productBody}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productEyebrow}>{product.eyebrow}</p>
                    <p className={styles.productPrice}>{product.price}</p>
                    <MarketplaceButton
                      action={shopee}
                      ctaId={shopee.id}
                      product={product.slug}
                      section={product.id}
                      position="product-primary"
                      className={styles.primaryButton}
                    >
                      <span>Beli di Shopee</span>
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </MarketplaceButton>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section
          aria-labelledby="bio-hub-heading"
          className={styles.group}
          data-bio-section="bio-hub"
          data-bio-track-section="bio-hub"
        >
          <h2 id="bio-hub-heading" className={styles.groupHeading}>
            Kunjungi kami
          </h2>

          <div className={styles.hubGrid}>
            {config.hubActions.map((action, index) => {
              const Icon = destinationIcons[action.destination];
              const logo = brandLogos[action.destination];
              return (
                <MarketplaceButton
                  key={action.id}
                  action={action}
                  ctaId={`hub_${action.destination}`}
                  section="bio-hub"
                  position={`hub-${index + 1}`}
                  className={styles.hubLink}
                >
                  {logo ? (
                    <Image src={logo} alt="" width={22} height={22} className={styles.hubLogo} />
                  ) : (
                    <Icon size={17} aria-hidden="true" />
                  )}
                  <span>{action.label}</span>
                </MarketplaceButton>
              );
            })}
          </div>
        </section>

        {config.testimonials.length > 0 ? (
          <section
            aria-labelledby="bio-testimonials-heading"
            className={styles.group}
            data-bio-section="bio-testimonials"
            data-bio-track-section="bio-testimonials"
          >
            <h2 id="bio-testimonials-heading" className={styles.groupHeading}>
              <Star size={13} aria-hidden="true" /> Kata pembeli
            </h2>

            {config.products.map((product) => {
              const reviews = config.testimonials.filter(
                (testimonial) => testimonial.product === product.slug,
              );
              if (reviews.length === 0) return null;

              return (
                <div key={`reviews-${product.slug}`} className={styles.reviewGroup}>
                  <h3 className={styles.reviewGroupHeading}>{product.name}</h3>

                  <ul className={styles.testimonialList}>
                    {reviews.map((testimonial) => (
                      <li key={testimonial.id} className={styles.testimonialCard}>
                        <div className={styles.testimonialHead}>
                          <span
                            className={styles.testimonialStars}
                            aria-label="Lima dari lima bintang"
                          >
                            {"\u2605\u2605\u2605\u2605\u2605"}
                          </span>
                          <span className={styles.testimonialAuthor}>{testimonial.author}</span>
                          <Image
                            src={brandLogos[testimonial.marketplace]!}
                            alt={testimonial.marketplace === "shopee" ? "Shopee" : "Tokopedia"}
                            width={16}
                            height={16}
                            className={styles.testimonialSource}
                          />
                        </div>
                        <p className={styles.testimonialQuote}>{testimonial.quote}</p>
                        <a
                          href={testimonial.screenshot.src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.testimonialProof}
                        >
                          Lihat tangkapan layar ulasan
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </section>
        ) : null}

        <footer
          className={styles.footer}
          data-bio-section="bio-footer"
          data-bio-track-section="bio-footer"
        >
          <p className={styles.disclosure}>
            Analitik anonim: kami tidak menyimpan nama, email, atau alamat IP mentah.
          </p>
          <p className={styles.copyright}>© {new Date().getFullYear()} Sheepie</p>
        </footer>
      </div>
    </main>
  );
}
