# Round 4 — Home hero, night bus photograph (Option B5)

> **Prerequisite reading:** `docs/HANDOFF.md`, `SSOT.md`, `CLAUDE.md`
> **Affected page:** `/[locale]` (Home)
> **Out of scope:** any other page; FeaturedRoutes / CTASection layout; mobile redesign; other pages' imagery
> **Selected variant:** B5 — Photograph in right column (chosen 2026-05-09, supersedes B1 spec from earlier draft)
> **Imagery scope:** **Home hero only.** Other pages stay text-first for Round 4. Adding imagery to Route Detail / About / How-to-ride is deferred to a future round.

---

## Goal

The Home hero currently sits left-aligned, with empty right space at desktop ≥ 1120px. Round 4 fills the right column with a single high-tone photograph — a white autonomous bus on a wet Seoul street at night, with cyan interior glow that matches the brand accent. The image is **on-tone reportage**, not decorative illustration: it shows the actual product (a bus), not abstract graphics.

The photograph is the **only** new visual asset added in this round. We are intentionally not introducing imagery elsewhere.

---

## Two PRs

### PR 4.0 — Footer copyright centering (5 min, do first)

Tiny polish PR, separate from the hero work.

**File:** `web/components/common/SiteFooter.module.css`

Add `text-align: center` to the `.copyright` rule (or whichever class wraps `© 2026 Seoul Autonomous. Independent guide.`). Apply on **all viewports** — desktop and mobile.

**Do not** change the disclaimer (`Pilot service operated by …`). It stays left-aligned.

**Acceptance:** desktop 1280px capture, EN + KO. Confirm:
- Copyright line is horizontally centered
- Disclaimer line is unchanged (still left)
- Mobile 375px — no regression

---

### PR 4.1 — Hero 2-column with photograph

#### Layout

`Hero.tsx` becomes a 2-column grid at desktop ≥ 980px:

```css
.heroGrid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 64px;
  align-items: center;
}
@media (max-width: 980px) {
  .heroGrid { grid-template-columns: 1fr; }
  .heroRight { display: none; }
}
```

Left column: existing hero content (badge, H1, description, CTA row) — **no changes**.

Right column: the photograph wrapped in a card.

#### Image asset

**Source file:** `web/public/images/hero-bus-night.webp` (copied from Downloads, renamed)

**Display size:** 480 × 340 CSS pixels. Source is large enough for 2x retina.

**Crop:** Use `object-fit: cover` and `object-position: center`. The bus stays centered horizontally; minor top/bottom trim is acceptable.

#### Markup

```tsx
<div className={styles.heroRight}>
  <figure className={styles.heroFigure}>
    <img
      src="/images/hero-bus-night.webp"
      alt=""           {/* decorative — alt is empty intentionally */}
      width={480}
      height={340}
      loading="eager"  {/* above the fold */}
    />
    <figcaption className={styles.heroCaption}>
      Verified {latestVerifiedDate} · Independent guide
    </figcaption>
  </figure>
</div>
```

`alt=""` is correct here — the image is decorative reinforcement of the text headline, not standalone information.

#### Visual spec

```css
.heroFigure {
  position: relative;
  width: 100%;
  max-width: 480px;
  aspect-ratio: 480 / 340;
  border: 1px solid var(--color-border-1);
  border-radius: var(--radius-lg);          /* 12px */
  overflow: hidden;
  margin-left: auto;                         /* right-align inside grid cell */
}
.heroFigure img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}
.heroCaption {
  position: absolute;
  right: 12px;
  bottom: 10px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.65);
  text-transform: uppercase;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
}
```

**No filters, no overlays, no gradients.** The image already carries the brand cyan in its lighting.

#### Caption content

Format: `VERIFIED {date} · INDEPENDENT GUIDE`

`{date}` comes from `getLatestVerifiedDate()` helper in `web/lib/routes.ts`. Add if it doesn't exist:

```ts
export function getLatestVerifiedDate(): string {
  // Returns the most recent route.lastChecked across verified routes
}
```

"Independent guide" is hard-coded — brand assertion, not user-facing copy needing translation.

#### i18n keys

**Zero new keys.**

#### Mobile

Right column hidden entirely (`display: none` below 980px). Hero falls back to current single-column form. Do **not** stack the image below the H1 on mobile.

---

## Acceptance criteria

Captures: desktop 1280px + 1024px + mobile 375px, EN + KO.

- [ ] **PR 4.0**: copyright centered, disclaimer untouched, no other footer change
- [ ] Hero is 2-column at ≥ 980px, 1-column below
- [ ] Image is sharp at 1280px (no upscaling artifacts)
- [ ] Caption legible over the image's brightest area
- [ ] Title still constrained to `max-width: 700px` in the left column
- [ ] Mobile 375px: image hidden, hero matches Round 1.5 baseline
- [ ] No layout shift in FeaturedRoutes / CTASection below
- [ ] No console errors / warnings
- [ ] Tab order: badge → CTAs → FeaturedRoutes (image is decorative, not focusable)

---

## Process notes

- The image is **the** visual addition for this round. Do not propose adding more imagery elsewhere.
- No animation on the image (no fade-in, no parallax). Static. Animation reads as "live" content — constitution rule #10 violation.
- If the caption looks out of place, propose alternative (e.g. small caption row below instead of overlay) and capture both for foreground decision.
- File path: `web/public/images/hero-bus-night.webp`. Do not commit Korean-filename version.
- The earlier B1 stat-panel spec is **abandoned** for Round 4.

---

## After Round 4

Open candidates (per `HANDOFF.md` §5):
- **Round 3** (Privacy / Terms sticky TOC) — still low priority
- **Round 5** (i18n label cleanup — VERIFIED chip) — small
- **Round 6+** — Routes filtering, How to ride visual variety, 404 styling, more imagery on other pages
