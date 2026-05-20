# 🔨 FORGE.md — Cycle Ledger

Autonomous repair ledger for the Nokta host app. Each cycle consumes one
`audit-reports/*.md` and runs the Karpathy autoresearch ratchet loop:
`READ → LOCATE → HYPOTHESIZE → REPAIR → TEST → VERIFY → COMMIT/ROLLBACK`.

- **Agent:** Claude Code (Opus) — single agent, standalone mode.
- **Time box:** 15 min / cycle.
- **TEST gate:** `npx tsc --noEmit` (strict) + `node --test` on `src/lib/*.test.ts`.
- **VERIFY gate:** multimodal compare of a fresh screenshot of the touched
  screen against the report's burn-in region (intent-aligned, not pixel-perfect).
- **Ratchet:** a fix that breaks TEST or fails VERIFY is **rolled back**, never
  committed. Failed hypotheses are kept here as data, not deleted.
- **kg:** scalar effort/value weight — style 5 · layout 10 · feature 15-20.

## Ledger

| # | Report | Hypothesis | Result | Files changed | Test | Commit | kg | Human touch |
|---|--------|-----------|--------|---------------|------|--------|----|-------------|
| 1 | 01-onboarding-cta | Footer lacks horizontal padding; stretched CTA spans edge-to-edge → add `paddingHorizontal` | ✅ success | `src/app/index.tsx` | tsc ✓ · unit ✓ | `@C1@` | 5 | 0 |
| 2 | 02-idealist-badge-clip | Title has no flex/`numberOfLines` and badge no `flexShrink` → constrain title, pin badge | ✅ success | `src/app/ideas/index.tsx` | tsc ✓ · unit ✓ | `@C2@` | 10 | 0 |
| 3 | 03-ideadetail-overflow | Description is cut off because its `Text` lacks a fixed height → wrap description `Text` in `flex:1` View | ❌ rollback | (reverted) | tsc ✓ · **verify ✗** | `@C3@` | 0 | 1 |
| 4 | 03-ideadetail-overflow | Real cause is no scroll container (learned from cycle 3) → swap outer `View` for `ScrollView` | ✅ success | `src/app/ideas/[id].tsx` | tsc ✓ · unit ✓ | `@C4@` | 10 | 0 |
| 5 | 04-idealist-empty | No empty state → add `ListEmptyComponent` with friendly copy + CTA | ✅ success | `src/app/ideas/index.tsx` | tsc ✓ · unit ✓ | `@C5@` | 0 | 15 |

**Totals:** 4 success · 1 rollback · cumulative **40 kg** · **2 human touch points** (see README for the breakdown). kg is monotonically increasing across successful cycles (5 → 15 → 25 → 40) — the ratchet held.

---

## Cycle 1 — OnboardingScreen · Get Started CTA hugs both edges

- **READ.** `audit-reports/01-onboarding-cta.md` — "Get Started" button runs
  edge-to-edge, looks broken; burn-in box spans the full-width button.
- **LOCATE.** `currentScreen: OnboardingScreen` → `src/app/index.tsx`. The CTA is
  `styles.cta` (`alignSelf: "stretch"`) inside `styles.footer`.
- **HYPOTHESIZE.** `footer` has `paddingBottom` but **no horizontal padding**, so
  a stretched child fills the whole width down to x=0 and x=screenWidth. Adding
  `paddingHorizontal` to the footer should inset the CTA on both sides.
- **REPAIR.** `footer: { ..., paddingHorizontal: 20 }`. One line, one concern.
- **TEST.** `tsc --noEmit` ✓ · `node --test src/lib/*.test.ts` ✓ (3/3).
- **VERIFY.** Re-rendered onboarding: CTA now sits 20px inset from both edges,
  matching the report's intent. ✓
- **COMMIT/ROLLBACK.** Commit `@C1@` — `[FORGE: OnboardingScreen] Inset Get Started CTA from screen edges — 5kg`.
- **WRITEBACK.** Golden scenario G1 added to `EVAL.md`. Human touch points: 0.

## Cycle 2 — IdeaListScreen · long title pushes score badge off-screen

- **READ.** `audit-reports/02-idealist-badge-clip.md` — on the long-title card the
  `97 / PURE SLOP` badge is shoved past the right edge and clipped; short-title
  cards are fine. Burn-in box sits on the clipped badge.
- **LOCATE.** `currentScreen: IdeaListScreen` → `src/app/ideas/index.tsx`,
  `IdeaCard` → `styles.cardHeader / cardTitle / badge`.
- **HYPOTHESIZE.** Row is `justifyContent: space-between` but the title has no
  `flex` and no `numberOfLines`, so a long title grows past the badge and the
  badge (no `flexShrink: 0`) gets pushed out. Give the title `flex: 1` +
  `numberOfLines={2}` and pin the badge with `flexShrink: 0`.
- **REPAIR.** `cardTitle: { flex: 1, marginRight: 12 }`, `numberOfLines={2}` on
  the title, `badge: { flexShrink: 0 }`, header `alignItems: flex-start`.
- **TEST.** `tsc --noEmit` ✓ · unit ✓ (3/3).
- **VERIFY.** Long title now clamps to two lines with an ellipsis and the badge
  stays fully visible at the right; short cards unchanged. ✓
- **COMMIT/ROLLBACK.** Commit `@C2@` — `[FORGE: IdeaListScreen] Constrain title + pin slop badge so it stops clipping — 10kg`.
- **WRITEBACK.** Golden scenario G2 added. Human touch points: 0.

## Cycle 3 — IdeaDetailScreen · description overflow (❌ ROLLBACK)

- **READ.** `audit-reports/03-ideadetail-overflow.md` — on the long idea the
  description runs off the bottom edge, can't scroll, STATUS row never shows.
- **LOCATE.** `currentScreen: IdeaDetailScreen` → `src/app/ideas/[id].tsx`.
- **HYPOTHESIZE (wrong).** "The description is cut off because its `Text` has no
  room to grow — wrap it in a `flex: 1` View so it fills the available space."
- **REPAIR.** Wrapped `<Text style={description}>` in `<View style={{flex:1}}>`.
- **TEST.** `tsc --noEmit` ✓ — the change is type-clean.
- **VERIFY (fail).** Re-rendered idea #1: `flex: 1` only redistributes space
  *inside* the still-non-scrolling parent `View`. The description is taller than
  any leftover space, so it **still clips** at the box bottom, and now the pitch
  is squeezed too. The burn-in region (cut-off description tail + missing STATUS)
  is **not** resolved. Intent not met → ratchet rule 2 triggers.
- **COMMIT/ROLLBACK.** **Rolled back** (`git checkout -- ideas/[id].tsx`). No app
  code committed. Commit `@C3@` records this ledger entry only.
- **WRITEBACK / lesson.** The problem is not "the Text needs space" — it is
  "there is no scroll container at all." `flex` cannot fix unbounded content in a
  fixed viewport. **Next cycle must add scrolling, and must not retry `flex` on
  the description.** Human touch points: **1** (I paused the agent to confirm the
  rollback rather than let it pile a second guess on top of the first).
