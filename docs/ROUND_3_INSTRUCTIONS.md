# Round 3 — Privacy / Terms sticky TOC

> **Prerequisite reading:** `docs/HANDOFF.md`, `SSOT.md`, `CLAUDE.md`
> **Affected pages:** `/[locale]/privacy`, `/[locale]/terms` (EN + KO)
> **Out of scope:** any other page, FAQ TOC, About TOC

---

## Goal

Privacy and Terms are 8 / 11 sections of dense legal text on a 720px longform width. Round 1.6 added cyan section numerals and dividers, but on desktop ≥ lg the right side of the viewport sits empty and users have no way to jump to a specific clause.

Add a sticky table-of-contents sidebar on desktop with scroll-spy. On mobile, expose the same TOC as a collapsible block at the top of the page.

---

## Layout target

### Desktop ≥ 1024px

```
┌─ PageContainer (longform 720) ──────────────────────────┐
│                                                          │
│  ┌─ TOC sidebar (220) ─┐  ┌─ Body (720) ──────────────┐ │
│  │ sticky top-24       │  │ <h1>Terms of Use          │ │
│  │                     │  │                           │ │
│  │ 1. Acceptance       │  │ 1. Acceptance of Terms   │ │
│  │ 2. Description      │  │ ...                       │ │
│  │ 3. User Conduct  ◀  │  │ 2. Description           │ │
│  │ 4. ...              │  │ ...                       │ │
│  └─────────────────────┘  └───────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

The page wrapper widens to `220 + 40 (gap) + 720 = 980px` content + container padding. **PageContainer should switch to a wider variant for these two pages on desktop only**, so the body column itself stays at 720px (longform readability constraint, locked).

### Mobile < 1024px

TOC sidebar hidden. At the top of the page (after H1, before the first section):

```
<details className={tocCollapse}>
  <summary>Jump to section ▾</summary>
  <ul>… same links …</ul>
</details>
```

Body remains 720px / fluid as today.

---

## PR plan

Three small PRs. Stop and capture between each.

### PR 3.1 — TOC component (no scroll-spy yet)

Goal: render the static sidebar + mobile collapse, links scroll to anchors. Active state not implemented yet.

**New component:** `web/components/legal/LegalTOC.tsx`

```tsx
type Section = { id: string; number: string; title: string };

export function LegalTOC({ sections }: { sections: Section[] }) {
  // desktop: <nav className={sidebar}>
  // mobile: <details className={collapse}>
  // both render the same <ul> of <a href={`#${id}`}>
}
```

**Section data:** derived from existing message keys at build time. Each section heading already has a stable id — confirm the slug pattern. If sections currently lack `id` attributes, add them based on the section number (e.g. `id="section-1"`, `id="section-2"`).

**CSS module:** `LegalTOC.module.css`

- `.sidebar` — `position: sticky; top: 96px; width: 220px; align-self: flex-start;`
- `.list` — `display: flex; flex-direction: column; gap: 6px;`
- `.link` — `font-size: 14px; color: var(--color-fg-3); padding: 6px 0 6px 12px; border-left: 2px solid transparent;`
- `.link:hover` — `color: var(--color-fg-1);`
- `.collapse` — mobile `<details>` shell; `summary` styled as small uppercase muted label with chevron
- Hide `.sidebar` below `lg` (≥ 1024px), hide `.collapse` at `lg` and up

**Page integration:** `web/app/[locale]/privacy/page.tsx` and `terms/page.tsx`

Wrap the existing body in a flex row at the page level:

```tsx
<PageContainer width="legal">  {/* see PR 3.0 below */}
  <div className={page.layout}>
    <LegalTOC sections={...} />
    <article className={page.body}>{/* existing LegalDocument */}</article>
  </div>
</PageContainer>
```

`.layout` — desktop: `display: flex; gap: 40px;` / mobile: `display: block;`
`.body` — `max-width: 720px; flex: 1;`

### PR 3.0 — PageContainer `legal` variant (do this first, alongside 3.1)

Add a third width to `PageContainer`:

```tsx
width === "legal"  // max-width: 980px (220 + 40 + 720)
```

Apply only to `/privacy` and `/terms`. Other longform pages stay on `longform` (720). Document this in `HANDOFF.md` §2 under the page width table.

### PR 3.2 — Scroll-spy active state

Implement `IntersectionObserver` to track which section is in view and apply `.active` to the matching TOC link.

**Hook:** `useActiveSection(sectionIds: string[]): string | null`

- Observe each `#section-N` heading element
- Use `rootMargin: "-20% 0px -70% 0px"` so a section becomes "active" when its heading crosses ~20% from the top of the viewport
- Threshold `[0, 1]`
- Return the id of the section currently active

**Active style:**
- `.link.active` — `color: var(--color-accent); border-left-color: var(--color-accent);`
- Smooth visual transition: `transition: color 150ms, border-color 150ms;`

**Edge cases:**
- At very top of page (above first section): no active state, or fall back to first section. Pick "no active state" — less visual noise.
- At very bottom: last section should remain active even after its heading scrolls past the rootMargin (use a footer sentinel if needed).

### PR 3.3 — Polish

- Smooth-scroll on link click: `scrollBehavior: "smooth"` on the html element, OR `scroll-margin-top: 96px` on each section heading so anchors don't sit under the sticky GlobalHeader.
- Mobile `<details>` — auto-collapse after a link is clicked (small client-side effect)
- Verify keyboard nav: TOC links Tab-reachable, focus ring visible on `.link:focus-visible`

---

## i18n keys

This round adds **two** new keys per locale:

```json
"legal.tocTitle": "On this page" / "이 페이지 내용"
"legal.jumpToSection": "Jump to section" / "섹션 바로가기"
```

Section titles themselves **already exist** as message keys (used in the body H2s). The TOC reuses those — no new keys per section.

⚠️ **Get foreground sign-off on the two new strings before starting PR 3.1.**

---

## Acceptance criteria

Per PR, verify with desktop 1280px + mobile 375px captures, EN + KO:

### PR 3.0 + 3.1
- [ ] Privacy page wraps body at 980px on desktop; TOC + body sit side by side
- [ ] Terms page same
- [ ] Other longform pages (FAQ, About, Data source) unchanged at 720px
- [ ] TOC sidebar shows all sections with cyan numbers + title
- [ ] Click a link → page scrolls to that section
- [ ] Mobile: sidebar hidden, `<details>` collapse appears at top with same links

### PR 3.2
- [ ] Scrolling the page updates the active TOC link in real time
- [ ] Active link has cyan text + cyan left border
- [ ] At top of page, no link is active (or first link is active — pick one and stick with it)
- [ ] At bottom of page, last section remains highlighted

### PR 3.3
- [ ] Smooth scroll on link click
- [ ] Section heading does not hide under GlobalHeader after click (scroll-margin-top accounts for it)
- [ ] Mobile `<details>` auto-collapses after click
- [ ] Tab navigation works through TOC links

---

## Process notes

- Each PR closes only after capture sign-off from design Claude.
- If implementation reveals a layout regression on /privacy or /terms (e.g. body suddenly looks different at 720), pause and report — don't push.
- TOC component lives in `components/legal/`, not `components/ui/` — it's specific to legal pages and the directory should make that clear.
- Do not generalize this for FAQ, About, etc. in this round. If foreground later wants a TOC for FAQ, that's a separate round.

---

## After Round 3

Next: Round 4 (Home hero right-side composition) — see `HANDOFF.md` §5.
