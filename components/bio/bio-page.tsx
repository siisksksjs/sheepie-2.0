import Image from "next/image";
import {
  ArrowUpRight,
  CloudMoon,
  Globe2,
  Instagram,
  MapPin,
  MessageCircle,
  Music2,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import type { BioAction, BioConfig } from "@/data/bio";

import { BioTracker } from "./bio-tracker";
import { MarketplaceButton } from "./marketplace-button";
import { ShareButton } from "./share-button";
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
};

const trustPoints = [
  { icon: ShieldCheck, label: "Bayar di marketplace" },
  { icon: MapPin, label: "Kirim se-Indonesia" },
  { icon: PackageCheck, label: "Material pilihan" },
];

export function BioPage({ config }: BioPageProps) {
  const instagram = config.hubActions.find((action) => action.destination === "instagram")!;
  const tiktok = config.hubActions.find((action) => action.destination === "tiktok")!;

  return (
    <main className={styles.page}>
      <BioTracker />

      <div className={styles.shell}>
        <header
          className={styles.header}
          data-bio-section="bio-header"
          data-bio-track-section="bio-header"
        >
          <span className={styles.mark} aria-hidden="true">
            <CloudMoon size={30} strokeWidth={1.6} />
          </span>
          <h1 className={styles.wordmark}>Sheepie.</h1>
          <p className={styles.tagline}>
            Perlengkapan tidur premium — tiga lapisan istirahat untuk malam yang lebih utuh.
          </p>

          <div className={styles.socialRow}>
            {[instagram, tiktok].map((action) => {
              const Icon = destinationIcons[action.destination];
              return (
                <MarketplaceButton
                  key={action.id}
                  action={action}
                  ctaId={`header_${action.destination}`}
                  section="bio-header"
                  position="header-social"
                  className={styles.iconButton}
                >
                  <Icon size={18} aria-hidden="true" />
                </MarketplaceButton>
              );
            })}
            <ShareButton />
          </div>
        </header>

        <ul
          className={styles.trustStrip}
          data-bio-section="bio-trust"
          data-bio-track-section="bio-trust"
        >
          {trustPoints.map((point) => (
            <li key={point.label}>
              <point.icon size={14} aria-hidden="true" />
              <span>{point.label}</span>
            </li>
          ))}
        </ul>

        <section aria-labelledby="bio-products-heading" className={styles.group}>
          <h2 id="bio-products-heading" className={styles.groupHeading}>
            Produk
          </h2>

          {config.products.map((product) => (
            <article
              key={product.id}
              id={product.id}
              className={styles.productCard}
              data-bio-section={product.id}
              data-bio-track-section={product.id}
              data-bio-product={product.slug}
            >
              <div className={styles.productTop}>
                <Image
                  src={product.image.src}
                  alt={product.image.alt}
                  width={96}
                  height={96}
                  sizes="96px"
                  className={styles.productImage}
                />
                <div className={styles.productCopy}>
                  <p className={styles.productEyebrow}>{product.eyebrow}</p>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productLine}>{product.headline}</p>
                  <p className={styles.productPrice}>{product.price}</p>
                </div>
              </div>

              <div className={styles.productActions}>
                {product.actions.map((action, actionIndex) => (
                  <MarketplaceButton
                    key={action.id}
                    action={action}
                    ctaId={action.id}
                    product={product.slug}
                    section={product.id}
                    position={actionIndex === 0 ? "product-primary" : "product-secondary"}
                    className={actionIndex === 0 ? styles.primaryButton : styles.secondaryButton}
                  >
                    <span>{action.destination === "shopee" ? "Shopee" : "Tokopedia"}</span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </MarketplaceButton>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section
          aria-labelledby="bio-hub-heading"
          className={styles.group}
          data-bio-section="bio-hub"
          data-bio-track-section="bio-hub"
        >
          <h2 id="bio-hub-heading" className={styles.groupHeading}>
            Tautan lain
          </h2>

          {config.hubActions.map((action, index) => {
            const Icon = destinationIcons[action.destination];
            return (
              <MarketplaceButton
                key={action.id}
                action={action}
                ctaId={`hub_${action.destination}`}
                section="bio-hub"
                position={`hub-${index + 1}`}
                className={styles.hubLink}
              >
                <span className={styles.hubIcon} aria-hidden="true">
                  <Icon size={18} />
                </span>
                <span className={styles.hubLabel}>{action.label}</span>
                <ArrowUpRight size={16} aria-hidden="true" className={styles.hubArrow} />
              </MarketplaceButton>
            );
          })}
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
