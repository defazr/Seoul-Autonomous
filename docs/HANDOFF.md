# Seoul Autonomous — Design Handoff

> **As of**: 2026-05-07
> **Repo**: `defazr/Seoul-Autonomous`
> **Web app**: `web/` (Next.js, App Router, next-intl, CSS Modules)
> **Status**: Round 1 + Round 2 complete. Round 3 / 4 / 5 pending.

---

## 1. Project context

**Seoul Autonomous** is an independent guide site for foreign tourists riding Seoul's autonomous buses and robotaxis. It is **not real-time** — all route information is manually verified and dated.

Three constraints govern every design decision:

1. **No real-time language.** Never say "arriving in 3 min", "next bus", "live status". Always anchor with "Verified May 1, 2026" or "Information based on Kakao Map. Please confirm before riding."
2. **Bilingual EN / KO.** Every piece of copy lives in `next-intl` message files. No hardcoded user-facing strings.
3. **Dark tech tone.** Black background, cyan (`--color-accent`) accents only on primary actions and key data points. No gradients, no decorative illustration.

Design tokens live in `web/app/globals.css` as CSS variables. Component styles are CSS Modules — never Tailwind.

---

## 2. Layout system (locked — do not change without a round)

### PageContainer

Single component governs every page's content width.

```tsx
// web/components/layout/PageContainer.tsx
<PageContainer width="default">  // max-width: 1120px
<PageContainer width="longform"> // max-width: 720px
```

| Pages on `default` (1120) | Pages on `longform` (720) |
|---|---|
| Home | FAQ |
| Routes | About |
| Route Detail | Data source |
| How to ride | Privacy |
| | Terms |

GlobalHeader's inner wrapper also uses **1120px** max-width to match — so the logo, nav, and EN/KO toggle align with the body content edge on `default` pages.

Side padding: `20px` (mobile) / `24px` (≥ md).

### GlobalHeader

```
[ logo · Seoul Autonomous ]   [ Routes  How to ride  FAQ ]   [ EN | KO ]   [☰ on mobile]
```

- Logo wraps a `<Link href="/">` — that's the only Home link in the header.
- EN/KO toggle is **only here**. Never per-page.
- Mobile: hamburger sheet contains nav links with a divider before Privacy/Terms.

### GlobalFooter

Two link groups on desktop (2-column grid), stacked on mobile:

- **Menu**: Home, Routes, How to ride, FAQ, Data source, About
- **Policy**: Privacy, Terms

No "MENU" / "POLICY" header labels — visual gap separates them.

Single disclaimer line + copyright below the link grid, separated by `border-t pt-6 mt-10`.

**Disclaimer text appears exactly once per page** (only inside GlobalFooter — never in page body).

---

## 3. Component patterns established

### Page header (longform pages)

Back button alone. No context label next to it. The body H1 is the only title.

Exception: **How to ride** (header label "How to ride" + body H1 "How to ride a Seoul autonomous bus") and **Route Detail** (back + route code chip + mode chip + status pill) keep their distinct headers.

### Inline meta rows (Route Detail)

Replaces the old 4-grid card layout. Used for HOURS / DAYS / STOPS / VERIFIED:

```
HOURS                    10:00 – 16:00
DAYS                     Weekdays
STOPS                    12 stops
VERIFIED                 May 1, 2026
```

- Label: uppercase, `text-fg-3`, `tracking-wider`
- Value: `text-fg-1`, body size, right-aligned
- Rows separated by `border-b border-border-1/40`, last row has no border
- No cyan accent on values (cyan is reserved for actions and key data points)

### Stops list (Route Detail)

Vertical timeline only. The horizontal `RouteDiagram` was removed in PR 2.2 — same information, two visualizations was redundant and broke at long route counts.

- Default: collapsed to first / turnaround / last (3 dots)
- Toggle: "Show all N stops" expands the full list
- Turnaround stop dot is cyan; others are `--color-fg-4`

### Status badges

- "Recently verified" — green dot
- "Check before riding" — yellow dot
- "Reservation required" — neutral

These replaced the original real-time-implying labels ("Operating", "3 min", etc.) per the no-real-time constraint.

### Section numbering (Privacy / Terms)

Major section headings (1. / 2. / 3. ...) have cyan numerals. Sub-numbering (3.1, 3.2) stays default. Sections are separated by a thin `--color-border-1` divider — no divider above the first section.

### Card grid (About)

Three sections rendered as cards:
- "What this site is" — full-width single card (intro)
- "Data and accuracy" + "Information verification" — 2-column grid on desktop, stacked on mobile

Card style: `bg-zinc-900/40`, `border border-zinc-800`, `rounded-xl`, `p-8`.

### Route Detail desktop layout

2-column at ≥ lg:
- **Left** (~70%): STOPS card (label inside the card, top-padding 24px) + supporting sections
- **Right** (~30%, sticky `top-24`): Meta inline rows + "Open in Kakao Map" CTA + "View all routes" secondary

Mobile: 1-column, **`gap-y-6` (24px)** between stacked cards.

---

## 4. What's been done

### Round 1 — Layout consistency
- 1.0 Removed Next.js dev N indicator (`devIndicators: false`)
- 1.1 PageContainer (1120 / 720), 9 pages applied
- 1.2 EN/KO toggle moved to GlobalHeader, removed from 8 page headers
- 1.3 RoutesList duplicate disclaimer removed
- 1.4 5 longform pages — duplicate topTitle removed
- 1.5 Hamburger sheet — separator before Privacy/Terms

### Round 1.5 — Polish
- Home width matches header (FeaturedRoutes/CTASection padding fixed)
- About 2-column card layout
- FAQ — wider gap between questions (no i18n key additions)
- GlobalHeader inner wrapper aligned to PageContainer 1120 — logo now sits on the same x as body content

### Round 1.6 — Longform visual rhythm
- Privacy / Terms — cyan numerals on major sections
- Section dividers (`--color-border-1`), none above first section

### Round 2 — Route Detail redesign
- 2.1 Meta 4-grid → inline rows (HOURS / DAYS / STOPS / VERIFIED)
- 2.2 Removed `RouteDiagram` (horizontal). Vertical `StopsList` is the single timeline. Outbound/Inbound implied by turnaround dot accent.
- 2.3 Desktop 2-column with sticky right sidebar; STOPS label moved inside the left card so both columns' top edges align
- 2.3.1 Mobile fix — `gap-y-6` between stacked cards (was nearly touching)

---

## 5. What's NOT done — roadmap

Listed in recommended order. Each is a self-contained round.

### Round 3 — Privacy / Terms sticky TOC
**Priority: low.** These pages are legal-obligation surfaces; readability matters more than visual variety. Already improved with cyan numerals + dividers in Round 1.6.

If pursued:
- Desktop ≥ lg: 220px sticky sidebar at `top-24`, scroll-spy via `IntersectionObserver`
  - Inactive: `text-fg-3`
  - Active: `text-accent` + 2px left border
- Mobile: hidden sidebar, `<details>` "Jump to section" at top
- Body stays at 720px longform width on the right
- Adds i18n keys for section titles — get content owner sign-off first

### Round 4 — Home hero right-side composition
**Priority: medium.** Current Home hero is left-aligned with empty right column on desktop ≥ 1120.

Options:
- **A (safe)** — center the hero content, no right-side element
- **B (richer)** — add a visual block on the right: large wordmark watermark, abstract route diagram, or stylized Seoul mark
  - Mobile: hidden
  - Must not introduce gradient or decorative illustration (tone violation)

Recommend prototyping B as a static SVG composition first.

### Round 5 — i18n label cleanup
**Priority: low.** "VERIFIED" chip currently displays "VERIFIED" in both EN and KO. Decide: keep as a brand label (no change) OR translate to "검증됨" on KO pages.

Audit all uppercase status chips for the same question.

### Round 6+ — Open
- Routes page filtering/sorting (currently no filter UI)
- How to ride — possible visual variety in the steps section
- 404 / error page styling

---

## 6. Process rules (learned the hard way)

### One round at a time
Never bundle visual changes from different concerns into one PR. Round 1 was 5 sequential PRs precisely so regressions could be pinpointed.

### Capture-driven verification
Each round closes only after desktop + mobile screenshots from the implementer match the design intent. Code-only review missed two real regressions during this project.

### No new i18n keys without sign-off
i18n key additions are scope creep. If a round needs new strings, raise it explicitly — don't ship it inside a "polish" PR. (R8B lesson.)

### Real-time language is forbidden
Anything that implies live data is a regression. Always anchor with "Verified [date]" or "Please confirm before riding." See `CLAUDE.md` in repo root for the enforced rule list.

### Out-of-scope = open an issue
If implementation reveals a bug or visual problem outside the current round's scope, open a tracking note — do not fix in-flight.

---

## 7. Files of interest

```
web/
├── app/
│   ├── globals.css                          # design tokens
│   ├── [locale]/
│   │   ├── layout.tsx                       # GlobalHeader + GlobalFooter mount
│   │   ├── page.tsx                         # Home
│   │   ├── routes/page.tsx
│   │   ├── routes/[id]/page.tsx             # Route Detail (Round 2 work lives here)
│   │   ├── routes/[id]/page.module.css
│   │   ├── how-to-ride/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── about/page.tsx                   # 2-column cards (Round 1.5)
│   │   ├── data-source/page.tsx
│   │   ├── privacy/page.tsx                 # cyan numerals (Round 1.6)
│   │   └── terms/page.tsx                   # cyan numerals (Round 1.6)
├── components/
│   ├── layout/
│   │   └── PageContainer.tsx                # 1120 / 720 single source
│   ├── common/
│   │   ├── GlobalHeader.tsx                 # inner wrapper also 1120
│   │   ├── GlobalHeader.module.css
│   │   ├── SiteFooter.tsx                   # Menu / Policy groups
│   │   ├── SiteFooter.module.css
│   │   ├── MobileDrawer.tsx                 # separator before Privacy/Terms
│   │   └── MobileDrawer.module.css
│   ├── legal/
│   │   ├── LegalDocument.tsx                # cyan numerals + dividers (Round 1.6)
│   │   └── LegalDocument.module.css
│   ├── route-detail/
│   │   ├── StopsList.tsx                    # vertical timeline (sole stop viz)
│   │   ├── StopsList.module.css
│   │   ├── MapLinkButton.tsx                # "Open in Kakao Map" CTA
│   │   └── MapLinkButton.module.css
│   ├── home/
│   │   ├── Hero.tsx                         # right-side empty (Round 4 target)
│   │   ├── FeaturedRoutes.tsx
│   │   └── CTASection.tsx
│   └── ui/
│       ├── LangToggle.tsx                   # in GlobalHeader only
│       └── Pill.tsx                         # status badges
├── messages/
│   ├── en.json
│   └── ko.json
├── next.config.js                           # devIndicators disabled
└── CLAUDE.md                                # constitutional rules (rule 3 = no real-time)
```

```
SSOT.md          # 11-item agreed constitution (do not modify without 3-party + foreground)
CLAUDE.md        # enforcement rules for code agents
```

---

## 8. Resuming work — checklist

Before starting any new round:

1. Read `SSOT.md` and `CLAUDE.md` at repo root
2. Read this file
3. Pull latest `main`, run `npm run dev` from `web/`, sanity check all 9 pages on desktop + mobile
4. Confirm scope with foreground (포그린) — what's in, what's out, what's deferred
5. Open a single round document (e.g. `DESIGN_AUDIT_ROUND_3.md`) with task list, acceptance criteria, and PR plan
6. Implement in small PRs, capture screenshots, get visual sign-off, then close the round

---

## 9. Contacts / handoff

- **Foreground (포그린)** — owns scope, priority, sign-off
- **Design Claude (this thread)** — visual review, regression diagnosis, round planning
- **Claude Code** — implementation, GitHub PRs

To resume work in a new design session, paste this file and the current screenshots. The roadmap in §5 picks up from where Round 2 closed.
