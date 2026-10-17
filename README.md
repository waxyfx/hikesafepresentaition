# HIKE SAFE — interactive presentation

Separate React + TypeScript + Vite website. The existing Expo mobile app remains in the repository root.

## Run from this repository

```powershell
cd C:\Users\serik\hikingsafe\presentation
npm run dev
```

Open http://127.0.0.1:4173. To create a static release, run `npm run build`; the output is `presentation/dist`.

## Presenter guide

1. Click **PRESENTATION MODE**. Arrow keys move through 14 chapters; Escape exits. Normal scrolling remains available.
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

New reference-inspired scenes: 16 hiking portraits orbit and scatter around a scroll-revealed manifesto; a draggable four-card video carousel; a pinned three-state check-in phone. The carousel supports arrow keys, touch swipes and pause. Video playback stops offscreen, while the page is hidden, and when reduced motion is requested. The check-in story is explicitly illustrative, separate from the interactive app simulation. Scroll or select its chips to change scenes.

The four video/poster pairs are linked directly from the exact CloudFront URLs provided in the design attachment, without downloading. They require an internet connection; colored card backgrounds and text remain usable if media cannot load. Inter and Inter Tight come from Google Fonts, with system fallbacks.

`public/hiker-portraits.png` was created using the built-in ImageGen tool. Prompt: “Create one square illustration containing a perfectly regular 4 by 4 grid of sixteen different friendly original 3D toy hiking characters, one head-and-shoulders portrait per equal square cell. Warm cream solid background throughout, no gutters or lines. Each adult character wears an outdoor jacket or beanie and has a distinctive colorful stylized face. Handmade clay and felt textures, soft studio lighting, premium playful product illustration, centered front-facing portraits. Green, purple, orange, teal, pink, blue, yellow color accents. No writing, logos or recognizable existing characters. Exactly sixteen portraits, four rows and four columns, each wholly contained in its own cell.”

The Sites owner-private hosting identity is stored in `.openai/hosting.json`.
