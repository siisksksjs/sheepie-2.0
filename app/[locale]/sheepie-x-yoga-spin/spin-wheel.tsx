"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Gift, RotateCcw, Sparkles } from "lucide-react";
import styles from "./spin-wheel.module.css";

type PrizeId = "cervicloud" | "lumicloud" | "snack" | "try-again";
type PrizeStock = Record<PrizeId, number>;

type Prize = {
  id: PrizeId;
  wheelLabel: string;
  wheelDetail: string;
  resultTitle: string;
  resultDetail: string;
  claimable: boolean;
};

const STORAGE_KEY = "sheepie-yoga-prize-pool-v1";
const INITIAL_STOCK: PrizeStock = {
  cervicloud: 4,
  lumicloud: 8,
  snack: 13,
  "try-again": 25,
};

const PRIZES: Prize[] = [
  {
    id: "cervicloud",
    wheelLabel: "CerviCloud",
    wheelDetail: "Rp10k Off",
    resultTitle: "Rp10k Discount",
    resultDetail: "for CerviCloud Pillow",
    claimable: true,
  },
  {
    id: "lumicloud",
    wheelLabel: "LumiCloud",
    wheelDetail: "Rp5k Off",
    resultTitle: "Rp5k Discount",
    resultDetail: "for LumiCloud Eye Mask",
    claimable: true,
  },
  {
    id: "snack",
    wheelLabel: "Free",
    wheelDetail: "Snack",
    resultTitle: "Free Snack",
    resultDetail: "A sweet treat after yoga",
    claimable: true,
  },
  {
    id: "try-again",
    wheelLabel: "Better Luck",
    wheelDetail: "Next Time",
    resultTitle: "Better Luck Next Time",
    resultDetail: "Hope your day still feels cloud-soft",
    claimable: false,
  },
];

function isPrizeStock(value: unknown): value is PrizeStock {
  if (!value || typeof value !== "object") return false;
  return PRIZES.every(({ id }) => {
    const count = (value as Record<string, unknown>)[id];
    return typeof count === "number" && Number.isInteger(count) && count >= 0;
  });
}

function loadStock(): PrizeStock {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return { ...INITIAL_STOCK };
    const parsed: unknown = JSON.parse(saved);
    return isPrizeStock(parsed) ? parsed : { ...INITIAL_STOCK };
  } catch {
    return { ...INITIAL_STOCK };
  }
}

function drawPrize(stock: PrizeStock): Prize | null {
  const total = PRIZES.reduce((sum, prize) => sum + stock[prize.id], 0);
  if (total === 0) return null;

  let ticket = Math.floor(Math.random() * total);
  for (const prize of PRIZES) {
    ticket -= stock[prize.id];
    if (ticket < 0) return prize;
  }
  return PRIZES[PRIZES.length - 1];
}

export function SpinWheel() {
  const [stock, setStock] = useState<PrizeStock | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stockFrame = window.requestAnimationFrame(() => setStock(loadStock()));

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sheepie-event-sw.js").then(async (registration) => {
        await navigator.serviceWorker.ready;
        const assetUrls = performance
          .getEntriesByType("resource")
          .map((entry) => entry.name)
          .filter((url) => url.startsWith(window.location.origin));
        registration.active?.postMessage({
          type: "CACHE_EVENT",
          urls: [window.location.href, ...assetUrls],
        });
      }).catch(() => {
        // The wheel still works; offline caching will retry on the next visit.
      });
    }

    return () => {
      window.cancelAnimationFrame(stockFrame);
      if (revealTimer.current) clearTimeout(revealTimer.current);
    };
  }, []);

  const spin = () => {
    if (!stock || isSpinning) return;
    const selected = drawPrize(stock);
    if (!selected) {
      setIsFinished(true);
      return;
    }

    setResult(null);
    setIsSpinning(true);

    const selectedIndex = PRIZES.findIndex((prize) => prize.id === selected.id);
    const currentNormalized = ((rotation % 360) + 360) % 360;
    const targetNormalized = (360 - selectedIndex * 90) % 360;
    const landingOffset = Math.random() * 30 - 15;
    const delta = 360 * 7 + ((targetNormalized + landingOffset - currentNormalized + 360) % 360);
    setRotation((current) => current + delta);

    revealTimer.current = setTimeout(() => {
      const nextStock = {
        ...stock,
        [selected.id]: stock[selected.id] - 1,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStock));
      setStock(nextStock);
      setResult(selected);
      setIsSpinning(false);
    }, 5100);
  };

  const spinAgain = () => {
    setResult(null);
    if (stock && Object.values(stock).every((count) => count === 0)) {
      setIsFinished(true);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.grain} aria-hidden="true" />
      <div className={`${styles.cloud} ${styles.cloudOne}`} aria-hidden="true" />
      <div className={`${styles.cloud} ${styles.cloudTwo}`} aria-hidden="true" />
      <div className={`${styles.cloud} ${styles.cloudThree}`} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.brand}>Sheepie<span>.</span></div>
        <div className={styles.collab}>
          <span />
          <p>Sheepie × Yoga Place</p>
          <span />
        </div>
      </header>

      <section className={styles.content}>
        <div className={styles.intro}>
          <div className={styles.eyebrow}><Sparkles size={15} /> khusus untuk kamu</div>
          <h1>Let&apos;s Spin<br /><em>the Wheel.</em></h1>
          <p>Satu putaran menuju hari yang sedikit lebih nyaman.</p>

          <div className={styles.followRow}>
            <aside
              className={`${styles.qrCard} ${isSpinning || result || isFinished ? styles.qrCardHidden : ""}`}
              aria-label="Scan untuk mengikuti Instagram Sheepie"
            >
              <div className={styles.qrImage}>
                <Image
                  src="/images/event/sheepiesleep-id-instagram-qr.svg"
                  alt="QR code menuju Instagram @sheepiesleep.id"
                  width={180}
                  height={180}
                  priority
                />
              </div>
              <div className={styles.qrCopy}>
                <span><i className={styles.instagramMark} aria-hidden="true" /> Scan &amp; follow</span>
                <strong>@sheepiesleep.id</strong>
                <small>Then spin the wheel</small>
              </div>
            </aside>

            <div className={styles.productStack} aria-hidden="true">
              <div className={`${styles.productCard} ${styles.cerviCard}`}>
                <Image
                  src="/images/products/cervicloud/listing-01.png"
                  alt=""
                  width={190}
                  height={190}
                  priority
                />
                <span>CerviCloud</span>
              </div>
              <div className={`${styles.productCard} ${styles.lumiCard}`}>
                <Image
                  src="/images/products/lumicloud/listing-01.png"
                  alt=""
                  width={190}
                  height={190}
                  priority
                />
                <span>LumiCloud</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.wheelStage}>
          <div className={styles.sparkleOne}>✦</div>
          <div className={styles.sparkleTwo}>✦</div>
          <div className={styles.wheelShadow} />
          <div className={styles.pointer} aria-hidden="true"><span /></div>
          <div
            className={styles.wheel}
            style={{ transform: `rotate(${rotation}deg)` }}
            aria-label="Roda hadiah Sheepie"
          >
            <div className={styles.wheelRim} />
            {PRIZES.map((prize, index) => (
              <div
                className={`${styles.prizeLabel} ${styles[`label${index}`]}`}
                key={prize.id}
              >
                <span>{prize.wheelLabel}</span>
                <small>{prize.wheelDetail}</small>
              </div>
            ))}
            <div className={styles.wheelHub}>
              <span className={styles.hubSheep}>☁</span>
            </div>
          </div>

          <button
            className={styles.spinButton}
            type="button"
            onClick={spin}
            disabled={!stock || isSpinning || isFinished}
          >
            {isSpinning ? "Spinning…" : "Spin Now"}
          </button>
          <p className={styles.helper}>Tap to start</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>Sleep well.</span>
        <span className={styles.footerDot}>•</span>
        <span>Dream big.</span>
        <span className={styles.footerDot}>•</span>
        <span>Wake happy.</span>
      </footer>

      {(result || isFinished) && (
        <div className={styles.resultBackdrop} role="dialog" aria-modal="true" aria-live="polite">
          <div className={styles.confetti} aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
          </div>
          <div className={styles.resultCard}>
            <div className={styles.resultIcon}>
              {isFinished ? <Sparkles size={35} /> : result?.claimable ? <Gift size={35} /> : <span>☁</span>}
            </div>
            <p className={styles.resultKicker}>
              {isFinished ? "50 putaran selesai" : result?.claimable ? "Selamat!" : "Terima kasih sudah mencoba"}
            </p>
            <h2>{isFinished ? "Acara Selesai" : result?.resultTitle}</h2>
            <p className={styles.resultDetail}>
              {isFinished ? "Semua kejutan hari ini sudah dibagikan." : result?.resultDetail}
            </p>
            {result?.claimable && (
              <div className={styles.claimNote}>
                <span>✓</span>
                Tunjukkan layar ini kepada staf kami untuk klaim
              </div>
            )}
            {!isFinished && (
              <button className={styles.againButton} type="button" onClick={spinAgain}>
                <RotateCcw size={18} /> Putar lagi
              </button>
            )}
            <div className={styles.resultBrand}>Sheepie<span>.</span></div>
          </div>
        </div>
      )}
    </main>
  );
}
