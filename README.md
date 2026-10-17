# HIKE SAFE — interactive presentation

Separate React + TypeScript + Vite website. The existing Expo mobile app remains in the repository root.

## Run from this repository

```powershell
cd C:\Users\serik\hikingsafe\presentation
npm run dev
```

Open http://127.0.0.1:4173. To create a static release, run `npm run build`; the output is `presentation/dist`.

## Presenter guide

1. Click **PRESENTATION MODE**. Arrow keys move through 12 chapters; Escape exits. Normal scrolling remains available.
2. Open **TRY PROTOTYPE**, then **ENTER FULL DEMO** for a focused view.
3. In the phone, choose **START A HIKE**, review the defaults, then **START HIKE**.
4. Use the scenario buttons: Normal → Stationary 2h+ → GPS lost → Overdue → Critical → SOS → Returned safe.
5. Phone, terrain maps, risk indicator, offline queue and monitoring console share the same reducer.
6. **RESET DEMO** returns the phone to its home screen and clears incidents and history.

The phone's SOS button requires confirmation. The separate presenter scenario panel applies an explicitly simulated SOS directly. A resolved hike ignores later risk actions. Start another hike or reset to begin again.

## What is simulated

All names, GPS positions, samples, timestamps, risk scores, queues and incidents are fictional browser state. Scenario buttons select illustrative snapshots, so their timestamps need not advance in click order. The terrain is an SVG illustration and must not be used for navigation. No device permissions, accounts, Supabase connections or emergency services are used. The architecture diagram describes the intended mobile system, not this website's deployment. Refreshing the page resets the demo.

This same-day demo validates a return time after departure. Real multi-day hikes and validated risk thresholds are outside its scope. Normal route movement is a looping visual simulation, not real GPS tracking. Future features are labeled as possibilities.

## Checks

Run root `npm run lint` and `npm run typecheck`; run `npx vitest run presentation/src/demo.test.ts` from the root for the simulation invariants. The presentation also has its own `typecheck` script.

## Assets

Mountain photograph: https://images.unsplash.com/photo-1464822759023-fed622ff2c3b (Unsplash). Atmospheric illustration, not a verified photograph of the Almaty route. Manrope: Google Fonts; the interface falls back to system sans-serif if unavailable. Mountain imagery is stored locally.

Published with Sites as an owner-private presentation. The hosting identity is stored in `.openai/hosting.json`.
