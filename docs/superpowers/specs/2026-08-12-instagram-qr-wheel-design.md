# Instagram QR Wheel Design

## Goal

Increase `@sheepiesleep.id` Instagram follows at the offline event without adding an unlock step to the shared-device wheel.

## Experience

The main wheel screen shows a large, scannable Instagram QR card centered beneath the introduction. Its instruction asks participants to scan and follow `@sheepiesleep.id`, then spin directly on the shared device. There is no checkbox, confirmation button, account login, or follow verification in the application.

The QR uses high error correction without a center logo so it remains visually clean and maximally reliable. A self-contained gradient Instagram mark replaces the generic line icon so its appearance is consistent across browsers.

The QR card is visible only while the wheel is idle. It disappears during the five-second spin and remains hidden behind the result dialog, focusing attention on the outcome. Tapping “Putar lagi” returns to the idle state and restores the QR card for the next participant.

## Technical Design

The QR code points to `https://www.instagram.com/sheepiesleep.id` and is stored as a static SVG in `public/images/event/` so the shared event page can render it without fetching a third-party QR service. The existing service worker automatically caches the same-origin image along with other page resources.

The existing local 50-prize pool, odds, result flow, and offline behavior remain unchanged.

## Verification

- Confirm the composited QR—including the center Sheepie badge—decodes to the official Instagram URL.
- Confirm the card appears before a spin and is hidden while spinning.
- Confirm “Putar lagi” restores the QR card.
- Run TypeScript, targeted lint, production build, and a browser interaction check.
