# Three-Prize Event Wheel Design

## Goal

Remove Free Snack and make the 50-participant Sheepie event wheel feel more generous while keeping the Rp10k discount comparatively rare.

## Prize Pool

- 8 × Rp10k CerviCloud discount — 16%
- 17 × Rp5k LumiCloud discount — 34%
- 25 × Better Luck Next Time — 50%

Exactly 25 of 50 participants can receive a discount. Every completed spin removes one result from the shared device's remaining local pool, so a selected category becomes less likely and cannot be selected after reaching zero.

## Wheel Presentation

The wheel displays three equal 120-degree segments so all options remain readable and visually fair. Visual segment size does not represent odds; the hidden remaining inventory controls the result. The pointer animation lands within the selected segment with safe spacing from segment boundaries.

## State Migration

Use a new local-storage version key. This prevents earlier test spins and the removed `snack` inventory from contaminating the new 50-entry pool. The first load after deployment starts a fresh `8 / 17 / 25` pool on the shared event browser.

## Verification

- Confirm Free Snack is absent from UI, data, and results.
- Confirm the pool totals 50 and uses `8 / 17 / 25`.
- Confirm each chosen outcome lands in the correct 120-degree segment.
- Confirm one result is removed per completed spin and persists after refresh.
- Run TypeScript, targeted lint, production build, and browser interaction checks.
