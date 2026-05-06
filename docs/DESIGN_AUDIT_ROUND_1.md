# Seoul Autonomous — Design Audit Round 1

Scope: Layout consistency across all pages. No content / copy changes. No new features.
Goal: Bring all 9 pages onto a single layout system before further visual work.
Out of scope: Route Detail redesign (Round 2), longform TOC (Round 3), Home hero visuals (Round 4), i18n labels (Round 5).

## Pages affected

All 9 pages, both en and ko locales:

- Home (/)
- Routes (/routes)
- Route Detail (/routes/[id])
- How to ride (/how-to-ride)
- FAQ (/faq)
- About (/about)
- Data source (/data-source)
- Privacy (/privacy)
- Terms (/terms)

## Task 1.0 — Remove the "N" floating mark

> HIGHEST PRIORITY

Symptom: A small circular N icon is fixed to the bottom-left of the viewport on every page (desktop + mobile). It overlaps content (e.g. covers route cards on Home, body copy on About).

Root cause hypothesis: Next.js dev indicator, OR a leftover component in app/layout.tsx.

Steps:
1. First confirm reproduction in a production build:
   `npm run build && npm start`
2. If gone in production — disable the dev indicator in next.config
3. If still there in production — search for the source and remove it

Acceptance: No floating N visible on any page in either dev or production.

## Task 1.1 — Introduce single PageContainer

Symptom: Every page has a different effective content width on desktop.

Action: Replace all per-page max-width / container classes with a single component.

| Page | width prop | Note |
|------|-----------|------|
| Home | default (1120px) | |
| Routes | default | |
| Route Detail | default | Round 2 will redesign internals |
| How to ride | default | |
| FAQ | longform (720px) | |
| About | longform | |
| Data source | longform | |
| Privacy | longform | |
| Terms | longform | |

Acceptance:
- All 4 "default" pages have visually identical content width on desktop
- All 5 "longform" pages have visually identical (narrower) content width on desktop
- Mobile is unchanged (auto-fits via px-5)

## Task 1.2 — Move EN/KO toggle into GlobalHeader

Symptom: Toggle position inconsistent across pages. Routes has no toggle.

Action: Make the toggle a permanent part of GlobalHeader. Remove it from every page header.

Desktop: `[ logo ]  [ Routes  How to ride  FAQ ]  [ EN | KO ]`
Mobile: EN/KO pill to the left of hamburger icon (one-tap, no sheet open needed)

Acceptance:
- Toggle appears on every page in the same position
- No page renders a duplicate toggle
- Mobile has a one-tap path to switch locale

## Task 1.3 — Footer cleanup

Symptom:
- Disclaimer appears twice on some pages
- Footer link layout broken on mobile (uneven rows)

Action:
a. Deduplicate the disclaimer (render exactly once in footer)
b. Restructure footer links into two named groups (Menu / Policy)
c. Disclaimer + copyright block below with border-t

New i18n strings: footer.menu, footer.policy

Acceptance:
- Disclaimer appears exactly once on every page
- Footer links in two clearly grouped lists
- Mobile: groups stack vertically. Desktop: side-by-side

## Task 1.4 — Remove redundant H1 in page headers

Symptom: Several pages render the same string twice (context label + body H1).

Affected: About, FAQ, Data source, Privacy, Terms
Not affected (keep both): How to ride, Route Detail

Action: Remove the context label next to the back button on affected pages. Keep back button only.

Acceptance:
- Affected pages show back button alone in header strip
- How to ride and Route Detail unchanged

## Task 1.5 — Hamburger sheet ordering

Action: Add visual separator (hr) before Privacy/Terms in the mobile drawer.

Acceptance: Visual separator between content links and policy links.

## Verification checklist

| # | Check | Pages |
|---|-------|-------|
| 1 | No floating N mark | all |
| 2 | Default-width pages same width on desktop | Home, Routes, Route Detail, How to ride |
| 3 | Longform pages same width on desktop | FAQ, About, Data source, Privacy, Terms |
| 4 | EN/KO toggle in GlobalHeader on every page | all |
| 5 | EN/KO toggle reachable on mobile in one tap | all (mobile) |
| 6 | Disclaimer text appears once per page | all |
| 7 | Footer links grouped, no broken wrapping | all |
| 8 | Longform pages: back button only, no duplicate title | 5 longform pages |
| 9 | How to ride and Route Detail headers unchanged | those two |
| 10 | Hamburger sheet separator before policy links | all (mobile) |

## What Round 1 deliberately does NOT touch

- Route Detail layout / 4-grid / sticky CTA (Round 2)
- FAQ accordion conversion + TOC (Round 3)
- Longform sticky TOC sidebar (Round 3)
- Home hero right-side composition (Round 4)
- "VERIFIED" i18n (Round 5)
- Any copy / content changes
- Any color / typography changes
