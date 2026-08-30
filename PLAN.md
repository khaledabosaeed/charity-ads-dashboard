# Charity Ads Dashboard — Design System + Component Refactor

> Status: proposed — not yet implemented. Written 2026-08-28. Companion to `TODO.md` (MVP build log) and `README.md` (setup + MVP decisions).

## Context

`charity-ads-dashboard` is a working Arabic-first (RTL) Next.js 16 + Supabase MVP. The data model, RLS, auth, and calculations are sound. The **interface is not**: it is unmodified shadcn/Tailwind defaults — slate palette, Geist, generic cards — assembled quickly to prove the MVP. It never received a design system, and the component layer has no architecture: primitives, layout chrome, and feature UI are one flat pile, with translation forcing almost every leaf into a client component.

You confirmed three things that govern everything below:

- **Main goal:** the dashboard exists so charities and admins can see, per association and per platform, **whether ad money is producing donations** — ROAS, remaining budget, association return. Reporting and accountability is the job; data entry serves it.
- **Primary users:** media buyers on desktop, and admins on desktop. Arabic-first.
- **Depth:** replace the visual world, not polish it. All product truth, content, routes, RLS, and functionality are preserved.

Intended outcome: a dashboard that answers "is this ad spend working?" in the first viewport, built on a real token system and a three-layer component architecture that makes the next five screens cheap instead of copy-pasted.

---

## What the audit actually found

**Blocking craft defects**

1. **Geist has no Arabic glyphs.** `src/app/layout.tsx` loads `Geist` / `Geist_Mono` with `subsets: ["latin"]`. Every Arabic string in the product — which is all of them by default — renders in an unstyled browser fallback. This is the single largest defect in an Arabic-first product.
2. **The main goal is invisible.** `dashboard-cards.tsx` renders 8 identical, equal-weight cards. ROAS — the answer to the product's whole question — sits last, same size as "donation count". No comparison, no target, no trend, no per-association breakdown.
3. **Currency is dropped on the dashboard.** `formatNumber()` in `dashboard-cards.tsx` hardcodes `en-US` and omits currency entirely; `money()` in `statistics-table.tsx` also hardcodes `en-US`. Arabic locale never formats numbers in Arabic conventions, and budget totals read as bare numbers.
4. **Three different form-control vocabularies coexist.** `statistics-filters.tsx` uses raw `<select>`; `statistics-form.tsx` uses Radix `Select` for association and a raw `<select>` for platform — in the same form, side by side.

**Systemic UX gaps**

5. Mobile nav (`app-shell.tsx`) toggles `hidden`/`block`, shoving content sideways: no overlay, no backdrop, no close-on-navigate, no focus trap, no `aria-current` on the active link.
6. No loading, error, or not-found route files anywhere; `ui/skeleton.tsx` exists and is never imported. Every navigation is a blank wait.
7. `EmptyState` is one generic "no data" everywhere — never teaches the interface or offers the action that would fill it.
8. The 12-column statistics table has no sort, no pagination, no sticky header, no row density control. `@tanstack/react-table` is installed and unused (README §5 flags this as a follow-up).
9. `statistics-form.tsx` is 11 numeric inputs in a flat 2-column grid with no grouping and **no live derived preview** — the user enters budget and spend but cannot see ROAS or remaining until after save, on the very screen where those numbers are the point.
10. Filters have no reset, no active-filter chips, no default period; an admin lands on an unbounded all-time query.

**Token and architecture leaks**

11. `dashboard-chart.tsx` hardcodes `#dc2626` / `#1d4ed8`; `ui/badge.tsx` hardcodes `emerald-100/700`. Colors live outside the token system.
12. `Button` hover is `hover:opacity-90` — not a color token — with no active state, no loading state, no focus-ring offset. The state matrix Operate mode requires (default/hover/focus/active/disabled/loading/error) is roughly half-present across primitives.
13. The dark palette in `globals.css` was never designed (e.g. `--primary-foreground: #0b1220` on `#3b82f6`), and is reachable only via `prefers-color-scheme` — no user toggle.
14. **i18n forces client components.** `PageHeading`, `EmptyState`, `LatestEntriesHeading`, `LoginHeading`, `NewLinkButton`, and both table components are `"use client"` *solely to read the dictionary*. Static text hydrates the entire dashboard.
15. `PageHeading` takes a stringly-typed `titleKey` and resolves it at runtime with a `resolve()` that silently returns the raw path on a miss — discarding the type safety the `Dictionary` interface already provides.
16. `CardTitle` is an `<h3>` styled as a 14px muted label, used as a stat caption — wrong semantics, broken heading order.

---

## Plan

### Phase 0 — Capture product truth (write `PRODUCT.md`)

Records the main goal so it survives this and every future session. Sections per the Impeccable product schema:

- **Platform:** `web`
- **Users:** Arabic-speaking media buyers (desktop) entering and reviewing their own associations' campaign numbers; admins (desktop) managing associations/platforms/buyers and reviewing all statistics + audit logs.
- **Product Purpose:** *Prove whether ad spend is producing donations, per association and per platform.* Success = a media buyer or admin can answer that in one glance and defend it with an auditable record.
- **Capabilities and Constraints:** Supabase RLS scopes every read; four derived metrics are computed, never stored (`src/lib/calculations/statistics.ts`); Arabic default with `dir="rtl"`, English secondary via `locale` cookie; roles `admin` / `media_buyer`; audit log is append-only.
- **Evidence on Hand:** no live Supabase instance yet (README §4); no real campaign data, logo, or brand assets — future work must not fabricate any.
- **Product Principles:** the derived metric outranks the raw input · every number is scoped and attributable · Arabic is the design target, not a translation · the audit trail is a feature, not plumbing.

### Phase 1 — Lock the visual world (`DESIGN.md`)

Run the Impeccable concept round rather than picking a look unilaterally:

```
node /home/khaled/.claude/skills/impeccable/scripts/concept-seed.mjs --scope world --mode operate
```

Present three materially different worlds on the decision page; you lock one. Non-negotiable inputs I carry into every candidate, regardless of which you pick:

- **Arabic-first typography.** A real Arabic/Latin superfamily (IBM Plex Sans Arabic, Noto Sans Arabic, or Rubik) as the single UI family, with matched Latin so mixed strings don't jump. Fixed rem scale, ~1.2 ratio — no fluid clamps in product UI. Tabular numerals for every metric.
- **Restrained color with one earned accent** for primary action, current selection, and state. A second neutral layer separates sidebar/topbar from the content surface. A designed dark theme, plus a real user toggle.
- **Semantic metric color** — a small, deliberate positive/warning/negative vocabulary so "spent 94% of budget" and "ROAS 0.6" are legible before they are read.

`DESIGN.md` records the locked world; `globals.css` becomes its token implementation.

### Phase 2 — Token layer (`src/app/globals.css`)

Replace the current 12 flat variables with a real system: neutral ramp, accent ramp, semantic state colors (hover/focus/active/disabled/selected/error/warning/success/info), surface elevation levels, spacing scale, radius scale, motion durations (150–250 ms), and **chart tokens** so `dashboard-chart.tsx` stops hardcoding hex. Both themes defined explicitly, dark keyed off `[data-theme]` *and* `prefers-color-scheme`. Load the Arabic superfamily in `layout.tsx` with the Arabic subset.

### Phase 3 — Component architecture (the refactor)

Three explicit layers, replacing today's flat pile:

```
src/components/
  ui/         # primitives — dumb, tokenized, full state matrix
  patterns/   # composed, product-aware, reused across routes   ← new
  layout/     # app chrome only
src/lib/format/   # locale-aware money / number / percent / date  ← new
```

**`ui/` — primitives.** Refit each existing primitive to the token system with the complete state matrix. Add the missing ones the patterns need: `Sheet` (mobile nav overlay with backdrop + focus trap), `Tooltip`, `Segmented`, `Pagination`, `SortableHeader`. Kill `hover:opacity-90` and every raw Tailwind color.

**`patterns/` — the reuse layer.** This is where the duplication goes to die. Four tables (`statistics`, `associations`, `platforms`, `media-buyers`, `audit-logs`) and three admin forms currently repeat the same structure by hand (~480 lines):

- `DataTable` — one `@tanstack/react-table`-backed table with sort, pagination, sticky header, density, per-column alignment, RTL-correct, and typed column defs. All five tables become column definitions.
- `FilterBar` — one filter vocabulary (Radix `Select` everywhere, never raw `<select>`), with active-filter chips, reset, and a sensible default period. Replaces `statistics-filters.tsx` and serves the admin lists too.
- `StatCard` / `StatGrid` — a stat card with a **primary/secondary tier**, delta, target, and correct semantics (`<dt>/<dd>`, not `<h3>`).
- `FormLayout` / `FormSection` / `FormActions` — one form skeleton; `statistics-form.tsx`, `association-form.tsx`, `platform-form.tsx`, `media-buyer-form.tsx` become field lists.
- `EmptyState` variants — first-run, filtered-to-zero, and permission-scoped, each with the action that resolves it.
- `ConfirmDialog` — one destructive-confirm, replacing per-table ad hoc dialogs.

**`lib/format/`** — locale-aware `money`, `number`, `percent`, `date`, `metric`, driven by the active locale and `currency_code`, replacing the two hardcoded `en-US` formatters. `src/lib/calculations/statistics.ts` stays exactly as is (pure, tested) — formatting moves out of components, math does not move.

**Server/client boundary.** Make the dictionary server-resolvable: a `getServerDictionary()` reading the `locale` cookie, so `PageHeading`, `EmptyState`, headings, and table shells render on the server. Keep `I18nProvider` only for genuinely interactive components (locale switcher, forms, filters). Replace `PageHeading`'s `titleKey` string with a typed `title: string` passed from the server, deleting the runtime `resolve()`. **Expected: most of the current `"use client"` directives disappear.**

### Phase 4 — Redesign the screens against the main goal

- **Dashboard** — restructure around the question. A hero answer row (ROAS, spend vs budget with a progress meter, donations) at primary tier; supporting totals at secondary tier; then per-association / per-platform performance, which the product needs and currently has nowhere. Chart moves to tokenized colors, RTL-correct axes, formatted dates, custom tooltip. A default period so the landing view is bounded.
- **Statistics list** — `DataTable` with sort + pagination; the 12 columns get a priority order, with secondary metrics behind a density/column toggle instead of a 12-wide horizontal scroll.
- **Statistics form** — grouped sections (Scope · Period · Budget · Results · Notes) with a **live derived panel** showing ROAS, remaining budget, spend %, and avg donation as the user types, using the existing calculation functions. Currency becomes a select, not a free-text 3-char input.
- **Admin lists + audit log** — same `DataTable`; audit log gets filters and pagination.
- **App shell** — proper `Sheet`-based mobile nav (backdrop, focus trap, close-on-navigate), `aria-current` on the active item, sidebar section grouping once admin items appear, theme toggle beside the locale switcher.
- **States** — `loading.tsx` skeletons per route (finally using `ui/skeleton.tsx`), `error.tsx`, `not-found.tsx`; loading state on every submit button.
- **Login + forbidden** — brought into the locked world.

### Phase 5 — Verify (one batched pass, then stop)

1. `npm run lint` · `npx tsc --noEmit` · `npm run test` · `npm run build` — all four must pass, as they do today.
2. `node /home/khaled/.claude/skills/impeccable/scripts/detect.mjs --json <changed files>` — the mechanical design detector, run once at the end.
3. Browser pass on `npm run dev`: desktop + mobile, **Arabic RTL and English LTR**, light and dark, across `/login`, `/dashboard`, `/statistics`, `/statistics/new`, `/admin/*`. One batched round of fixes, one confirming round, then done.
4. Keyboard + focus check on nav, filters, table sort, and dialogs.

Supabase-dependent verification (`supabase db reset`, Playwright e2e, RLS checklist) still needs your live instance — unchanged by this work, since no query, policy, or action signature changes.

---

## Explicitly out of scope

Database migrations, RLS policies, server action signatures, and `src/lib/calculations/statistics.ts` math are untouched. No new product features, no password reset, no new roles. English copy stays as authored; Arabic copy is preserved verbatim unless you approve a change.

## Files that change most

- New: `PRODUCT.md`, `DESIGN.md`, `src/components/patterns/*`, `src/lib/format/*`, per-route `loading.tsx` / `error.tsx`
- Rewritten: `src/app/globals.css`, `src/app/layout.tsx`, `src/components/ui/*`, `src/components/layout/*`, `src/app/(dashboard)/dashboard/*`
- Reduced to configuration: the five `*-table.tsx` files and the four `*-form.tsx` files
