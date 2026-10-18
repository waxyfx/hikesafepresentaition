# HIKE SAFE — Assignment 1 presentation

Live site: https://waxyfx.github.io/hikesafepresentaition/

The existing presentation is organized into 15 chapters: introduction, problem, evidence, Almaty, current approaches, solution, evidence-to-design, mechanism, technical logic, live prototype, architecture, limitations, future work, conclusion, references. Eight institutional sources are cited inline; unverified dates are marked n.d. Demo data and design hypotheses are distinguished from research.

## Run and publish

Run npm install and npm run dev in this folder. For GitHub Pages run npm run build:pages, commit docs/, and publish main /docs. The existing Expo app lives in the parent workspace; public/prototype contains its real web export. No replacement app screens are used.

Refresh the prototype from the parent workspace with EXPO_NO_DOTENV=1 and EXPO_PUBLIC_PRESENTATION=true, then run npx expo export --platform web --output-dir presentation/public/prototype. Rebuild the website afterwards. The export disables the backend and uses a temporary SQLite database. Native behavior is unchanged. The Pages build only rebases exported asset paths. isolation.js supplies the browser isolation headers needed by SQLite on static hosting; it does not cache requests.

## Presenter guide

Use PRESENTATION MODE and arrow keys for the 15 chapters; Escape exits. In LIVE PROTOTYPE choose Start a hike → Medeu → Continue through the existing review flow → Start a hike. Then demonstrate WALKING → STATIONARY → GPS LOST → OVERDUE → CRITICAL. Use the actual app's SOS confirmation and Finish hike controls. RESET DEMO clears only the disposable iframe session. OPEN APP opens a separate fresh session; FULL SCREEN expands the demonstration.

GPS LOST uses stale simulated fixes. The app must show UNKNOWN movement and no inactivity reason. The adjacent console and technical risk gauge receive snapshots directly from the original runtime. A low score with unknown GPS is not proof of safety. Backend delivery and emergency services are disabled in this website. Browser GPS is simulated, maps are schematic, and reload discards the session.

## Validation and rubric review

- Structure: exact 15-section sequence, presentation controls, concise headings, evidence labels and diagrams.
- Evidence: eight traceable sources, local official totals with scope caveat, no invented outcome statistics; preliminary thresholds are labelled.
- Local relevance: Almaty route materials and emergency guidance; no claim of measured route coverage or incident rates.
- Solution: explicit definition, bounded functional comparison, evidence-to-feature mapping, original prototype reused.
- Limits: no field validation, official dispatch, satellite communication, guaranteed GPS or guaranteed delivery; no grade is guaranteed.

Root lint and typecheck, presentation typecheck, and 119 existing tests pass, including the added GPS-loss regression in the runtime test. Browser checks cover hike creation, stationary versus missing GPS, critical incident, SOS confirmation, completion, reset, and the static Pages export.

## Assets

Mountain photograph: https://images.unsplash.com/photo-1464822759023-fed622ff2c3b (Unsplash). Atmospheric illustration, not a verified photograph of the Almaty route. Manrope: Google Fonts; the interface falls back to system sans-serif if unavailable. Mountain imagery is stored locally.

New reference-inspired scenes: 16 hiking portraits orbit and scatter around a scroll-revealed manifesto; a draggable four-card video carousel; a pinned three-state check-in phone. The carousel supports arrow keys, touch swipes and pause. Video playback stops offscreen, while the page is hidden, and when reduced motion is requested. The check-in story is explicitly illustrative, separate from the interactive app simulation. Scroll or select its chips to change scenes.

The four video/poster pairs are linked directly from the exact CloudFront URLs provided in the design attachment, without downloading. They require an internet connection; colored card backgrounds and text remain usable if media cannot load. Inter and Inter Tight come from Google Fonts, with system fallbacks.

`public/hiker-portraits.png` was created using the built-in ImageGen tool. Prompt: “Create one square illustration containing a perfectly regular 4 by 4 grid of sixteen different friendly original 3D toy hiking characters, one head-and-shoulders portrait per equal square cell. Warm cream solid background throughout, no gutters or lines. Each adult character wears an outdoor jacket or beanie and has a distinctive colorful stylized face. Handmade clay and felt textures, soft studio lighting, premium playful product illustration, centered front-facing portraits. Green, purple, orange, teal, pink, blue, yellow color accents. No writing, logos or recognizable existing characters. Exactly sixteen portraits, four rows and four columns, each wholly contained in its own cell.”

The Sites owner-private hosting identity is stored in `.openai/hosting.json`.
