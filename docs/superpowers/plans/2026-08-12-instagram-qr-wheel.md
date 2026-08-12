# Instagram QR Wheel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a low-friction Instagram follow prompt and QR code to the shared-device event wheel without adding an unlock gate.

**Architecture:** Generate a static same-origin QR image for the official Sheepie Instagram profile and render it as an idle-state card inside the existing wheel component. Drive visibility from the component's existing `isSpinning` and `result` states, leaving prize selection and storage untouched.

**Tech Stack:** Next.js 16, React 19, CSS Modules, static SVG assets, Playwright browser verification

---

### Task 1: Add the Instagram QR asset

**Files:**
- Create: `public/images/event/sheepie-instagram-qr.svg`

- [x] **Step 1:** Generate an SVG QR code containing `https://www.instagram.com/sheepiesleep.id` with sufficient quiet space.
- [x] **Step 2:** Decode or scan the generated asset and verify the exact URL.

### Task 2: Add the idle-state QR card

**Files:**
- Modify: `app/[locale]/sheepie-x-yoga-spin/spin-wheel.tsx`
- Modify: `app/[locale]/sheepie-x-yoga-spin/spin-wheel.module.css`

- [x] **Step 1:** Render a compact card containing the QR image, `Scan & Follow`, and `@sheepiesleep.id` while `!isSpinning && !result && !isFinished`.
- [x] **Step 2:** Position the card alongside the wheel on desktop and below the instruction content on smaller screens without obscuring the spin control.
- [x] **Step 3:** Add accessible alternative text and maintain the existing no-gate spin behavior.

### Task 3: Verify the event flow

**Files:**
- Test: `/private/tmp/sheepie_wheel_check.cjs`

- [x] **Step 1:** Run `npx tsc --noEmit` and expect exit code 0.
- [x] **Step 2:** Run targeted ESLint on the event files and expect exit code 0.
- [x] **Step 3:** Run `npm run build` and expect the event route in the successful build output.
- [x] **Step 4:** Run the browser check and verify the QR is visible before spin, hidden during spin/result, restored after “Putar lagi,” and decodes to the official Instagram URL.
