# Round 5 — i18n status chip audit (VERIFIED + siblings)

> **Prerequisite reading:** `docs/HANDOFF.md`, `SSOT.md`, `CLAUDE.md`
> **Affected files:** message catalogs (`web/messages/en.json`, `web/messages/ko.json`); chip-rendering components in `web/components/`
> **Out of scope:** any visual chip restyle (colors, dot, padding, radius); any page layout change; any new chip variants
> **Estimated effort:** 10–30 min depending on the foreground decision below

---

## Decision needed BEFORE coding

The KO site currently renders the verification chip as the literal English string `VERIFIED`. There are two defensible directions and the foreground (포그린) must pick one before any PR opens. Do **not** start coding until a decision is recorded in this doc.

### Option A — Keep `VERIFIED` as a brand label, in both locales

The uppercase mono chip becomes a stable visual anchor across languages. Tourists scanning a KO page recognize the same chip they saw on the EN page. Treats the word the way Apple treats `iPhone` or the way airlines treat IATA codes — a proper noun for the verification system itself, not a translation candidate.

**Pros:**
- Zero risk of layout regression (string length unchanged)
- Reinforces "independent guide" identity — the chip is a stamp, not prose
- Matches how the constitution already treats `· INDEPENDENT GUIDE` in the hero caption (Round 4) — that line is also EN-only on the KO site

**Cons:**
- Korean-only readers without English literacy lose the semantic meaning. Mitigated by the chip's color (cyan dot) and consistent placement, but not eliminated.

**Implementation:** **no code change**. Document the decision in `SSOT.md` as a deliberate i18n exception. Close Round 5 as a no-op.

### Option B — Translate to `검증됨` on KO pages

Standard i18n posture. Every user-facing string lives in the message catalog. KO users get a Korean word; EN users get an English word.

**Pros:**
- Honors the constitution's "Bilingual EN / KO. Every piece of copy lives in `next-intl` message files" principle (HANDOFF §1)
- More accessible to KO-monolingual users
- Sets precedent for future status chips (avoids accumulating EN-only literals)

**Cons:**
- `검증됨` (4 chars) is wider than `VERIFIED` (8 chars rendered uppercase mono) at the same point size — verify chip width doesn't break Featured Routes card alignment
- Mono uppercase styling reads slightly off in Korean (Korean script doesn't have case); consider whether `검증됨` should keep the mono uppercase treatment or switch to regular weight on KO

**Implementation:** ~30 min (see PR plan below).

### Recommendation

**Option B**, with the mono uppercase treatment kept identical. Rationale: the chip is meaningful UI feedback (verified vs not), not a brand mark. Treating it as a brand mark reads as English-default chauvinism on a KO-localized site. The ~4-char width difference is well within the chip's existing padding tolerance — I checked the Featured Routes capture from Round 4 and there's room.

If foreground prefers Option A, that's also defensible — record it and close.

**Foreground decision (fill in before starting):**

```
Choice:  [ ] A — keep VERIFIED in both locales
         [ ] B — translate to 검증됨 on KO
Date:
Notes:
```

---

## If Option A — close-out steps

1. Add a section to `SSOT.md` under "i18n exceptions":
   > **Status chip labels (`VERIFIED`, etc.)** are intentionally EN-only across both locales. They function as brand stamps, not translatable copy. Any new status chip must be added to this exception list with a one-line rationale.
2. Open a tiny PR with just the SSOT update.
3. Close Round 5.

No component changes. No message catalog changes. Done.

---

## If Option B — PR plan (~30 min)

### PR 5.1 — Audit + translate (single PR)

#### Step 1: audit

`grep -ri "VERIFIED\|RESERVATION REQUIRED\|RECENTLY VERIFIED\|CHECK BEFORE" web/components web/app` and produce a table in the PR description:

| Chip text (EN) | Component | Currently translated? | KO replacement |
|---|---|---|---|
| `VERIFIED` | `RouteCard`, `RouteDetail` header, inline meta | No (hardcoded) | `검증됨` |
| `RECENTLY VERIFIED` | `StatusBadge` (green) | ? | `최근 검증됨` |
| `CHECK BEFORE RIDING` | `StatusBadge` (yellow) | ? | `탑승 전 확인` |
| `RESERVATION REQUIRED` | `StatusBadge` (neutral) | ? | `예약 필요` |

The existing state is unknown — some may already be translated, some not. The PR description must list each before/after.

#### Step 2: extract to message catalog

Add a `status` namespace to both message files:

```json
// en.json
{
  "status": {
    "verified": "VERIFIED",
    "recentlyVerified": "RECENTLY VERIFIED",
    "checkBefore": "CHECK BEFORE RIDING",
    "reservationRequired": "RESERVATION REQUIRED"
  }
}
```

```json
// ko.json
{
  "status": {
    "verified": "검증됨",
    "recentlyVerified": "최근 검증됨",
    "checkBefore": "탑승 전 확인",
    "reservationRequired": "예약 필요"
  }
}
```

Replace each hardcoded literal with `t('status.verified')` etc.

#### Step 3: typography decision per chip

The mono uppercase styling is a visual property, not a string property. Two approaches:

**Approach 1 (recommended):** keep `text-transform: uppercase` and `font-family: var(--font-mono)` on the chip's CSS. KO renders as `검증됨` in mono — the uppercase declaration is a no-op for Hangul (Korean script has no case). Visual difference vs EN: KO sits a touch shorter vertically. Acceptable.

**Approach 2:** add a `:lang(ko)` rule that switches KO chips to regular weight, no uppercase. More polished but more CSS surface to maintain. **Don't do this in Round 5** — defer to a future polish round if needed.

Stick with Approach 1.

#### Step 4: capture + verify

Captures: 1280px desktop EN + KO, focusing on:

- Featured Routes cards (Home) — chip alignment unchanged
- Routes index — chip column alignment
- Route Detail — header chip + inline meta `VERIFIED` row label

Acceptance:

- [ ] All 4 chips translated in `ko.json`
- [ ] Zero remaining hardcoded chip literals (re-grep after the change)
- [ ] No layout shift on KO Featured Routes cards (chip wider but within padding tolerance)
- [ ] Inline meta `VERIFIED` row label on Route Detail also translated (it shares the same string source)
- [ ] No console warnings about missing translation keys

---

## Process notes

- This is a **decision-blocked round**. Do not begin Step 1 of either option until the foreground records a choice in the box above.
- The decision is reversible — if Option B ships and foreground later prefers brand stamps, swap KO values back to the EN literals in `ko.json`. No code change needed.
- Do not introduce new chip variants in this round (e.g. `BETA`, `NEW`). Audit and translate existing only.
- Do not change chip colors, padding, dot, or radius. Round 5 is text-only.

---

## After Round 5

Open candidates (per `HANDOFF.md` §5):
- **Round 3** (Privacy / Terms sticky TOC) — still low priority
- **Round 6+** — Routes page filtering/sorting, How to ride visual variety, 404 styling, possibly more imagery on About / Data source
