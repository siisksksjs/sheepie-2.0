import Image from "next/image";
import {
  Globe2,
  Heart,
  Instagram,
  Mail,
  MessageCircle,
  Music2,
  ShoppingBag,
  Star,
} from "lucide-react";

import type { BioAction, BioConfig } from "@/data/bio";

import { BioPostHog } from "./bio-posthog";
import { BioProductGallery } from "./bio-product-gallery";
import { BioTestimonials } from "./bio-testimonials";
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
  tiktok: "/images/bio/tiktok-logo.png",
};

/** Storefronts, in the order they should be offered. */
const MARKETPLACE_IDS = ["bio-hub-shopee", "bio-hub-tokopedia", "bio-hub-tiktok"] as const;

/** Ways to follow or reach us, in the order they should be offered. */
const CONNECT_IDS = [
  "bio-hub-instagram",
  "bio-connect-tiktok",
  "bio-hub-website",
  "bio-hub-email",
  "bio-hub-whatsapp",
] as const;

/** Figures supplied by the store owner. */
const trustStats = [
  { icon: Star, value: "4.9/5", label: "from 1000+ reviews" },
  { icon: Heart, value: "1000+", label: "happy sleepers" },
  // A real map of the archipelago rather than a generic glyph.
  { map: "/images/bio/indonesia.svg", value: "Proudly", label: "Indonesian Brand" },
] as const;

export function BioPage({ config }: BioPageProps) {
  return (
    <main className={styles.page}>
      <BioPostHog />
      <BioTracker />

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
          sizes="100vw"
          className={styles.bannerImage}
        />
        <a
          href="#bio-produk"
          className={styles.bannerLink}
          aria-label="Lihat produk Sheepie"
        />
      </section>

      <div className={styles.shell}>
        <ul
          className={styles.statRow}
          data-bio-section="bio-trust"
          data-bio-track-section="bio-trust"
        >
          {trustStats.map((stat) => (
            <li key={stat.label} className={styles.stat}>
              <p className={styles.statValue}>
                {"map" in stat ? (
                  <Image
                    src={stat.map}
                    alt=""
                    width={44}
                    height={17}
                    // Next's optimizer rejects SVG by default; serve the file as-is.
                    unoptimized
                    className={styles.statMap}
                  />
                ) : (
                  <stat.icon size={18} strokeWidth={1.7} aria-hidden="true" />
                )}
                {stat.value}
              </p>
              <p className={styles.statLabel}>{stat.label}</p>
            </li>
          ))}
        </ul>

        <section
          id="bio-produk"
          aria-labelledby="bio-products-heading"
          className={styles.group}
        >
          <h2 id="bio-products-heading" className={styles.sectionTitle}>
            Our Bestsellers
          </h2>

          <div className={styles.productGrid}>
            {config.products.map((product) => {
              const shopee = product.actions.find((action) => action.destination === "shopee")!;

              return (
                <article
                  key={product.id}
                  id={product.id}
                  className={styles.productBand}
                  data-bio-section={product.id}
                  data-bio-track-section={product.id}
                  data-bio-product={product.slug}
                >
                  <BioProductGallery
                    images={product.gallery}
                    alt={product.image.alt}
                    productName={product.name}
                  />

                  <div className={styles.productBuy}>
                    <div className={styles.productCopy}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      {product.rating ? (
                        <p
                          className={styles.rating}
                          aria-label={`Rating ${product.rating.score} dari 5${
                            product.rating.count ? `, ${product.rating.count} ulasan` : ""
                          }`}
                        >
                          <span className={styles.ratingStars} aria-hidden="true">
                            {"\u2605\u2605\u2605\u2605\u2605"}
                          </span>
                          <span aria-hidden="true">
                            {product.rating.score}/5
                            {product.rating.count ? ` (${product.rating.count})` : ""}
                          </span>
                        </p>
                      ) : null}
                      <p className={styles.productLine}>{product.headline}</p>
                    </div>
                    <MarketplaceButton
                      action={shopee}
                      ctaId={shopee.id}
                      product={product.slug}
                      section={product.id}
                      position="product-primary"
                      className={styles.buyButton}
                    >
                      Shop now
                    </MarketplaceButton>
                  </div>
                </article>
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
            <h2 id="bio-testimonials-heading" className={styles.sectionTitle}>
              Loved by Our Sleepers
            </h2>

            <BioTestimonials products={config.products} testimonials={config.testimonials} />
          </section>
        ) : null}

        <section
          aria-labelledby="bio-hub-heading"
          className={styles.group}
          data-bio-section="bio-hub"
          data-bio-track-section="bio-hub"
        >
          <h2 id="bio-hub-heading" className={styles.sectionTitle}>
            Shop Everywhere
          </h2>
          <p className={styles.shopSubheading}>Find Sheepie on your favorite platform</p>

          <div className={styles.shopRow}>
            {MARKETPLACE_IDS.flatMap((id) => {
              const action = config.hubActions.find((entry) => entry.id === id);
              if (!action) return [];
              const destination = action.destination;

              return [
                <MarketplaceButton
                  key={action.id}
                  action={action}
                  ctaId={`hub_${action.destination}`}
                  section="bio-hub"
                  position={`shop-${destination}`}
                  className={styles.shopLink}
                >
                  <Image
                    src={brandLogos[destination]!}
                    alt=""
                    width={22}
                    height={22}
                    unoptimized
                    className={styles.shopLogo}
                  />
                  <span>{action.label}</span>
                </MarketplaceButton>,
              ];
            })}
          </div>

          <p className={styles.connectHeading}>Let&apos;s stay connected</p>
          <div className={styles.connectRow}>
            {CONNECT_IDS.flatMap((id, index) => {
              const action = config.hubActions.find((entry) => entry.id === id);
              if (!action) return [];
              const Icon = destinationIcons[action.destination];

              return [
                  <MarketplaceButton
                    key={action.id}
                    action={action}
                    ctaId={`connect_${action.destination}`}
                    section="bio-hub"
                    position={`connect-${index + 1}`}
                    className={styles.connectLink}
                  >
                  <Icon size={20} aria-hidden="true" />
                  <span>{action.label}</span>
                </MarketplaceButton>,
              ];
            })}
          </div>
        </section>

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
