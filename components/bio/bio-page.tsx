import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  CloudMoon,
  Globe2,
  Instagram,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Music2,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import type { BioAction, BioConfig } from "@/data/bio";
import { AlignmentIcon, DarknessIcon, SilenceIcon } from "@/components/ui/icons";

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

const pillarIcons = [AlignmentIcon, DarknessIcon, SilenceIcon];

export function BioPage({ config }: BioPageProps) {
  const instagram = config.hubActions.find((action) => action.destination === "instagram")!;
  const tiktok = config.hubActions.find((action) => action.destination === "tiktok")!;

  return (
    <main className={styles.page}>
      <BioTracker />
      <div className={styles.ambientCloud} aria-hidden="true" />

      <header
        className={styles.header}
        data-bio-section="bio-header"
        data-bio-track-section="bio-header"
      >
        <a className={styles.wordmark} href="#bio-hero" aria-label="Sheepie, kembali ke atas">
          <span className={styles.mark} aria-hidden="true">
            <CloudMoon size={20} strokeWidth={1.7} />
          </span>
          <span>Sheepie.</span>
        </a>

        <div className={styles.headerActions}>
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

      <section
        id="bio-hero"
        className={styles.hero}
        data-bio-section="bio-hero"
        data-bio-track-section="bio-hero"
      >
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Perlengkapan tidur premium</p>
          <h1>Tidur lebih utuh.<br />Bangun lebih jernih.</h1>
          <p className={styles.heroLead}>
            Tiga lapisan istirahat yang dirancang untuk menyelaraskan tubuh, meredupkan dunia,
            dan melembutkan kebisingan.
          </p>
          <a className={styles.textLink} href="#bio-product-alignment">
            Temukan sistem tidurmu <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>

        <div className={styles.heroVisual}>
          <Image
            src={config.heroImage.src}
            alt={config.heroImage.alt}
            fill
            priority
            sizes="(max-width: 767px) 100vw, 56vw"
            className={styles.heroImage}
          />
          <div className={styles.heroNote}>
            <span>01—03</span>
            <p>Satu ritual.<br />Tiga lapisan tenang.</p>
          </div>
        </div>
      </section>

      <section
        className={styles.systemIntro}
        data-bio-section="bio-system-intro"
        data-bio-track-section="bio-system-intro"
      >
        <p className={styles.sectionIndex}>Sistem istirahat Sheepie</p>
        <h2>Malam yang baik bukan satu produk. Ia adalah kondisi yang terasa tepat.</h2>
        <p>
          Mulai dari kebutuhan yang paling terasa malam ini. Setiap produk berdiri sendiri,
          sekaligus melengkapi ritual tidur yang lebih tenang.
        </p>
      </section>

      <div className={styles.productStories} data-bio-section="bio-products">
        {config.products.map((product, index) => {
          const PillarIcon = pillarIcons[index];

          return (
            <section
              key={product.id}
              id={product.id}
              className={styles.productStory}
              data-bio-section={product.id}
              data-bio-track-section={product.id}
              data-bio-product={product.slug}
            >
              <div className={styles.productVisual}>
                <span className={styles.productNumber} aria-hidden="true">
                  0{index + 1}
                </span>
                <Image
                  src={product.image.src}
                  alt={product.image.alt}
                  fill
                  sizes="(max-width: 767px) 92vw, 48vw"
                  className={styles.productImage}
                />
              </div>

              <div className={styles.productCopy}>
                <div className={styles.pillarLabel}>
                  <PillarIcon width={22} height={22} aria-hidden="true" />
                  <span>{product.eyebrow}</span>
                </div>
                <p className={styles.productName}>{product.name}</p>
                <h2>{product.headline}</h2>
                <p className={styles.productDescription}>{product.description}</p>
                <p className={styles.price}>
                  <span>Mulai dari</span>
                  {product.price}
                </p>
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
                      <span>{action.label}</span>
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </MarketplaceButton>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section
        className={styles.hub}
        data-bio-section="bio-hub"
        data-bio-track-section="bio-hub"
      >
        <div className={styles.hubHeading}>
          <p className={styles.sectionIndex}>Semua pintu menuju Sheepie</p>
          <h2>Pilih tempat belanja dan terhubung yang paling nyaman.</h2>
        </div>
        <div className={styles.hubLinks}>
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
                  <Icon size={20} />
                </span>
                <span>{action.label}</span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </MarketplaceButton>
            );
          })}
        </div>
      </section>

      <section
        className={styles.trust}
        data-bio-section="bio-trust"
        data-bio-track-section="bio-trust"
      >
        <div className={styles.trustIntro}>
          <p className={styles.sectionIndex}>Beristirahat dengan tenang</p>
          <h2>Belanja sederhana, langsung di marketplace pilihanmu.</h2>
        </div>
        <div className={styles.trustGrid}>
          <article>
            <LockKeyhole aria-hidden="true" />
            <h3>Pembayaran di marketplace</h3>
            <p>Pembayaran diproses melalui sistem aman Shopee atau Tokopedia.</p>
          </article>
          <article>
            <MapPin aria-hidden="true" />
            <h3>Pengiriman Indonesia</h3>
            <p>Pesanan dapat dikirim ke berbagai wilayah di seluruh Indonesia.</p>
          </article>
          <article>
            <PackageCheck aria-hidden="true" />
            <h3>Material pilihan</h3>
            <p>Dipilih untuk rasa nyaman, fungsi yang jelas, dan pemakaian sehari-hari.</p>
          </article>
        </div>
      </section>

      <section
        className={styles.finalCta}
        data-bio-section="bio-final"
        data-bio-track-section="bio-final"
      >
        <ShieldCheck size={30} strokeWidth={1.4} aria-hidden="true" />
        <p className={styles.sectionIndex}>Malam ini bisa terasa berbeda</p>
        <h2>Mulai dari lapisan istirahat yang paling kamu butuhkan.</h2>
        <div className={styles.finalActions}>
          {config.hubActions
            .filter((action) => action.destination === "shopee" || action.destination === "tokopedia")
            .map((action, index) => (
              <MarketplaceButton
                key={`final-${action.id}`}
                action={action}
                ctaId={`final_${action.destination}`}
                section="bio-final"
                position={index === 0 ? "final-primary" : "final-secondary"}
                className={index === 0 ? styles.finalPrimary : styles.finalSecondary}
              >
                <span>{action.label}</span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </MarketplaceButton>
            ))}
        </div>
      </section>

      <footer
        className={styles.footer}
        data-bio-section="bio-footer"
        data-bio-track-section="bio-footer"
      >
        <a className={styles.footerMark} href="#bio-hero">
          Sheepie.
        </a>
        <p>Perlengkapan tidur premium untuk esok yang lebih jernih.</p>
        <p className={styles.disclosure}>
          Analitik anonim: kami tidak menyimpan nama, email, atau alamat IP mentah.
        </p>
        <p className={styles.copyright}>© {new Date().getFullYear()} Sheepie</p>
      </footer>
    </main>
  );
}
