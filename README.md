# Felt & Fern — Storefront

The customer-facing site for **Felt & Fern**, the minimalist cat-toy brand. The debut
collection is presented as **launching soon**: there is no cart or checkout — every product
CTA feeds the waitlist signup, which stores contacts in a Resend audience.

## Highlights

- **Felt & Fern hero video** — a full-bleed cinematic header. `src/assets/video/hero-felt-fern.mp4`
  carries the refreshed brand system and uses `src/assets/brand/hero-felt-fern-poster.jpg` as its
  poster. The AI Gateway generation scripts remain in `scripts/` for future video refreshes.
- **Interactive 3D** — real product models (`<model-viewer>`) you can drag, spin and zoom
  (The Prey, The Arc, The Burrow) in the Spotlight + 3D gallery sections.
- **Editorial-luxury design system** — Fraunces (display) + Plus Jakarta Sans (UI), warm
  cream/espresso palette, double-bezel cards, button-in-button CTAs, film-grain overlay,
  spring-physics motion, and scroll-reveal choreography (Framer Motion).
- **Real waitlist** — the footer form posts to `api/waitlist.js`, which upserts the contact
  into the "Felt & Fern Waitlist" audience in Resend (`RESEND_API_KEY` comes from the
  Vercel Marketplace integration).

## Stack

React 18 · Vite 6 · Tailwind CSS 3 · Framer Motion · `@google/model-viewer` · Resend (waitlist)

Logo: the Felt & Fern sprig mark (from the `felt-fern-hub` brand kit) inlined in the nav and
footer, and as `public/favicon.svg`.

## Run

```bash
npm install
npm run dev        # http://localhost:5173 (UI only — /api/waitlist needs `vercel dev`)
vercel dev         # UI + the waitlist function
npm run build      # production build → dist/
```

## Regenerate the hero video

Auth uses the Vercel AI Gateway via `AI_GATEWAY_API_KEY` or `VERCEL_OIDC_TOKEN` (pulled into
`.env`, gitignored). Video generation needs gateway credits.

```bash
node scripts/gen-hero-i2v.mjs            # the hero: image-to-video from a product still
node scripts/gen-video.mjs hero-ambient  # alternate: ambient text-to-video scene
```

Image-to-video takes the seed image as a base64 **data URI** (`prompt: { image, text }`) — no
hosting needed. Inspect a result with ffmpeg/Python: `ffprobe` for metadata, frame extraction +
numpy frame-diffs to confirm smooth motion and no warping.

Notes from building this:
- `xai/grok-imagine-video-1.5-preview` is **image-to-video only** (no text-to-video) — used for the hero.
- `xai/grok-imagine-video` supports text-to-video — used for the ambient alternate.
- Below a $100 gateway balance, video is rate-limited to **1 request/minute** — scripts disable
  SDK retries and wait out 429s.

## Structure

```
api/waitlist.js           # Vercel function → Resend audience
src/
  App.jsx                 # page composition
  components/
    Nav.jsx               # fluid-island nav + mobile glass menu
    Hero.jsx              # AI video hero with parallax
    Marquee.jsx           # materials marquee
    Story.jsx             # brand philosophy / positioning
    Spotlight.jsx         # The Arc, interactive 3D, on espresso
    Collection.jsx        # 4-piece preview bento
    ModelGallery.jsx      # tabbed 3D viewer
    Sets.jsx              # Good-Better-Best tiers
    Subscription.jsx      # Fresh Play plans
    Materials.jsx         # sustainability + impact bento
    Footer.jsx            # waitlist CTA + footer
    ui.jsx                # icons, Reveal, Button, Bezel
  data/products.js        # catalogue + pricing
scripts/gen-video.mjs     # AI Gateway video generation
```
