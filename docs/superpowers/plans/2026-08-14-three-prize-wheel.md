# Three-Prize Event Wheel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the four-option event wheel with three options backed by a fresh 50-entry `8 / 17 / 25` prize pool.

**Architecture:** Keep the existing local weighted draw model, but remove the snack prize and migrate to a new storage key. Rebuild the wheel geometry around three equal 120-degree segments while continuing to calculate the selected landing angle from the weighted result.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, localStorage, Playwright

---

### Task 1: Update prize data and persisted pool

**Files:**
- Modify: `app/[locale]/sheepie-x-yoga-spin/spin-wheel.tsx`

- [x] **Step 1:** Remove `snack` from `PrizeId` and `PRIZES`.
- [x] **Step 2:** Change initial stock to `{ cervicloud: 8, lumicloud: 17, "try-again": 25 }`.
- [x] **Step 3:** Change the storage key to `sheepie-yoga-prize-pool-v2` so earlier test spins cannot enter the new pool.
- [x] **Step 4:** Replace 90-degree landing math with 120-degree landing math and keep the random landing offset inside segment boundaries.

### Task 2: Update the three-segment wheel presentation

**Files:**
- Modify: `app/[locale]/sheepie-x-yoga-spin/spin-wheel.module.css`

- [x] **Step 1:** Replace the four-color 90-degree conic gradient with three 120-degree segments.
- [x] **Step 2:** Position three labels at the center of their segments and remove the fourth label rule.
- [x] **Step 3:** Update desktop and mobile label transforms so all text stays within the circular rim.

### Task 3: Verify behavior

**Files:**
- Test: `/private/tmp/sheepie_three_prize_check.cjs`

- [x] **Step 1:** Verify source and rendered UI contain no Free Snack prize.
- [x] **Step 2:** Verify the initialized pool equals `8 / 17 / 25`, totals 50, decrements once per completed spin, and persists after refresh.
- [x] **Step 3:** Run TypeScript, targeted ESLint, and `npm run build` with exit code 0.
- [x] **Step 4:** Capture desktop and mobile screenshots and confirm labels stay within the wheel.
