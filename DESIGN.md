---
name: المسقط — The Elevation
description: A measured architectural drawing for charity ad performance — hairlines, hatch, and one green datum that is zero everywhere.
colors:
  paper: "#f7f3ec"
  paper-sunk: "#efe8dc"
  paper-raised: "#fffdf8"
  ink: "#16191c"
  ink-2: "#5b6167"
  ink-3: "#62686f"
  line: "#ddd4c4"
  line-2: "#c3b7a2"
  line-3: "#16191c"
  amber: "#e59731"
  amber-deep: "#b9722a"
  amber-ink: "#7a4712"
  amber-wash: "#f8e6cd"
  amber-veil: "#fcf2e3"
  datum: "#1f7a4d"
  datum-2: "#3f9d6c"
  datum-wash: "#dff0e5"
  alarm: "#b3341f"
  alarm-wash: "#f8e2dd"
  rail: "#e59731"
  rail-ink: "#1a1207"
  rail-ink-2: "#4a3009"
  rail-line: "#c67f22"
  ring: "#b9722a"
typography:
  display:
    fontFamily: "Alexandria, Segoe UI, system-ui, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Alexandria, Segoe UI, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Alexandria, Segoe UI, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Alexandria, Segoe UI, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Alexandria, Segoe UI, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1
  annotation:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "0.14em"
  figure:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontFeature: "tnum 1, lnum 1"
rounded:
  sheet: "2px"
spacing:
  hairline: "1px"
  datum: "2px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  gutter: "24px"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.rail-ink}"
    rounded: "{rounded.sheet}"
    padding: "0 16px"
    height: "40px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.amber-deep}"
    textColor: "{colors.rail-ink}"
  button-outline:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    height: "40px"
  button-outline-hover:
    backgroundColor: "{colors.paper-sunk}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.sheet}"
  button-datum:
    backgroundColor: "{colors.datum}"
    textColor: "#ffffff"
    rounded: "{rounded.sheet}"
  button-destructive:
    backgroundColor: "{colors.alarm}"
    textColor: "#ffffff"
    rounded: "{rounded.sheet}"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    padding: "8px 12px"
    height: "40px"
  field-focus:
    backgroundColor: "{colors.paper-raised}"
  sheet:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
  rail:
    backgroundColor: "{colors.rail}"
    textColor: "{colors.rail-ink}"
    width: "15.5rem"
  rail-item-active:
    backgroundColor: "{colors.rail-ink}"
    textColor: "{colors.rail}"
    rounded: "{rounded.sheet}"
  badge-default:
    backgroundColor: "{colors.amber-veil}"
    textColor: "{colors.amber-ink}"
    rounded: "{rounded.sheet}"
    padding: "2px 8px"
  badge-success:
    backgroundColor: "{colors.datum-wash}"
    textColor: "{colors.datum}"
    rounded: "{rounded.sheet}"
  badge-muted:
    backgroundColor: "{colors.paper-sunk}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.sheet}"
  badge-destructive:
    backgroundColor: "{colors.alarm-wash}"
    textColor: "{colors.alarm}"
    rounded: "{rounded.sheet}"
---

# Design System: المسقط — The Elevation

## Overview

**Creative North Star: "The Elevation"**

The company mark is a building drawn in elevation — seven stepped storeys over a green ground-swoosh. This application is the rest of that sheet. Every screen behaves like a measured architectural drawing: quantities are drawn as mass, consumed quantity is a hatched cut through that mass, and zero is a green datum line that runs beneath every figure in the product. Numbers are not reported here, they are *dimensioned* — a label above, a measured extent with tick serifs, the figure beneath.

The system exists to refuse one specific thing: the SaaS card grid, where eight equal white boxes make eight unequal numbers look identical. Nothing in this world is a rounded card with a soft shadow. Surfaces are hairline rectangles — sheets — and each carries a title block naming what it is, over what extent, at what revision. Colour never scatters into accents: amber owns whole regions (the full-height navigation rail, the section band, the login's start half) and the green datum owns exactly one meaning. Density is high and deliberate; this is a back-office tool where a media buyer logs a period in under a minute and an admin reads a portfolio off one line.

Light is warm drafting paper; dark is blueprint ink. The two themes are not a tint of each other — in dark the amber stops being a wash and becomes the *line work* itself, the way a blueprint reverses its drawing. The rail stays a filled amber field in both, because identity does not toggle.

**Key Characteristics:**
- Hairline rectangles, never rounded cards; the only radius in the system is 2px
- Three line weights and never a fourth
- 45° hatch is the one texture, and it means "consumed" or "not yet drawn"
- A 2px green datum that is zero, everywhere, on every surface that measures anything
- Amber owns whole regions of the screen, never individual accents
- Two typefaces: Alexandria for lettering, Archivo tabular for every figure
- Motion is inking: line work draws itself in the order a drafter works, and text never moves
- Arabic-first and direction-agnostic; every offset is logical

## Colors

A drafting palette: warm paper and near-black ink carrying two committed signal colours from the company mark — the amber of the tower and the green of the ground — plus one correction red.

### Primary
- **Drawing Amber** (`{colors.amber}`): The mass. Owns whole regions — the full-height nav rail, the primary button block, the consumed portion of a section band, the login's start half. It is the brand tower's own colour and never appears as a small decorative accent.
- **Deep Amber** (`{colors.amber-deep}`): Line weight and hover state for amber surfaces; the focus ring; the chart's spend stroke; the caret colour.
- **Burnt Amber Ink** (`{colors.amber-ink}`): The only amber safe as small text on paper. Every "amount spent" figure is set in it.
- **Amber Veil / Amber Wash** (`{colors.amber-veil}`, `{colors.amber-wash}`): The faintest amber grounds — table row hover, status tag fill, the open ground of an undrawn section band.

### Secondary
- **Datum Green** (`{colors.datum}`): Zero. It is never used decoratively. It draws the 2px datum under every section band, the chart's `y=0` reference line, the advertising-return series, the remaining-budget figure, and the short rule inside an empty state.
- **Datum Light** (`{colors.datum-2}`): The hover state of a datum-coloured control. No other role.
- **Datum Wash** (`{colors.datum-wash}`): Ground for a success tag.

### Tertiary
- **Correction Red** (`{colors.alarm}`): The red pencil of a drawing — corrections, overruns, deletions. When spend runs past its budget edge, the overrun is drawn in this colour with a dense hatch and a doubled vertical rule at the budget edge.
- **Correction Wash** (`{colors.alarm-wash}`): Ground for a destructive tag or an inline error.

### Neutral
- **Drafting Paper** (`{colors.paper}`): The page ground and the resting fill of every input field.
- **Sunk Paper** (`{colors.paper-sunk}`): Recessed ground — table headers and footers, tab strips, ghost-button hover.
- **Raised Paper** (`{colors.paper-raised}`): Every sheet, title block, dialog, and tooltip. A sheet is lighter than the board it sits on.
- **Ink** (`{colors.ink}`): Headings and every figure that is not signal-coloured.
- **Ink-2 / Ink-3** (`{colors.ink-2}`, `{colors.ink-3}`): Labels, annotations, axis ticks, placeholder text.
- **Line / Line-2 / Line-3** (`{colors.line}`, `{colors.line-2}`, `{colors.line-3}`): The three drafting weights — see the rule below.
- **Rail inks** (`{colors.rail-ink}`, `{colors.rail-ink-2}`, `{colors.rail-line}`): The ink set that reads on amber. Any text or divider placed on an amber region takes these, never the paper ink set.

### Dark theme
Dark is a *reversal*, not a dim. Paper becomes blueprint ink (`#0e1216`), ink becomes warm bone (`#e9e3d7`), and — the load-bearing difference — the hatch stops being black at 16% and becomes **amber at 34%** (`rgb(237 169 75 / 0.34)`). The line work of the drawing is amber in dark. The rail does *not* invert: it stays a filled amber field (deepened to `#bd7a24` so its ink stays legible), because the rail is identity and identity is constant across themes.

### Named Rules

**The Three Weights Rule.** There are exactly three line values and never a fourth. `line` is the hairline that divides (rows, sheet edges, internal rules). `line-2` is the drawn edge that encloses (title blocks, fields, the section band's frame). `line-3` is the cut — full ink, reserved for the cut face in a section band, the heavy rule under a table header, and the doubled rule under a totals row. If a divider seems to want a new weight, it wants one of these three.

**The Datum Rule.** Green means zero and nothing else. It is never a success colour, never a brand accent, never a chart series chosen for variety. Every surface that measures a quantity draws the same 2px datum beneath it — the section band, the chart's reference line, the login's amber half, the empty state. A viewer who learns the datum on one screen has learned it on all of them.

**The Whole Region Rule.** Amber owns a region or it does not appear. Permitted regions: the navigation rail, the topbar below `md`, the primary button block, the drawn mass of a section band, the login's start half. Forbidden: a coloured left stripe on a card, a tinted icon, a coloured heading, a lone status dot. At `md`+ the rail carries the amber; below `md` the rail collapses into a drawer and the **topbar itself becomes the amber band**, so colour still owns a whole region at 390px.

**The Ink Set Rule.** Text on paper takes `ink`/`ink-2`/`ink-3`. Text on amber takes `rail-ink`/`rail-ink-2` and dividers there take `rail-line`. The two sets never mix; the brand amber is a light colour and may not carry small paper-ink text.

## Typography

**Lettering Font:** Alexandria (with Segoe UI, system-ui, sans-serif) — Arabic and Latin from one geometric hand
**Figure Font:** Archivo (with ui-sans-serif, system-ui) — a grotesque with true tabular numerals

**Character:** One geometric humanist hand does all the lettering in both scripts, so the Arabic is not a translation of a Latin design — it is the same voice. Against it, every numeral in the product is set in a second, narrower grotesque with tabular lining figures, so digits stack into a readable column down a schedule. The pairing is the drawing's own convention: hand lettering for words, a stencil for dimensions.

### Hierarchy
- **Display** (600, `2.75rem` down to `1.875rem`, 1.25, -0.02em tracking): The login's brand line only. It appears once in the product.
- **Headline** (600, `1.25rem`/`1.125rem`, 1.2): The sheet name inside a title block; the login sheet's heading.
- **Title** (600, `0.875rem`, 1.3): A ruled section heading, a chart header. Always accompanied by its hairline rule.
- **Body** (400, `0.875rem`, 1.6): Supporting prose, dialog descriptions. Rare; this product is figures and labels, not paragraphs.
- **Label** (500, `0.8125rem`, 1): Form labels, nav items, table cells, user plate.
- **Annotation** (`.annot`, 500, `0.6875rem`, 1.35): The drafting annotation — every metric label, every table column head, every legend key, every note under a figure. Under `[dir="ltr"]` only, it switches to the figure face, uppercases, and tracks to `0.14em`. Arabic takes neither uppercasing nor letter-spacing, so under RTL it stays as-is in the lettering face.
- **Figure** (`.figure`, 600, `1.5rem`–`1.75rem` in a dimension cell, `0.8125rem` in a schedule, 1, -0.01em): Every number. Tabular lining numerals, `direction: ltr` with `unicode-bidi: isolate` so a figure reads left-to-right inside an Arabic sentence.

### Named Rules

**The Figure Face Rule.** Any numeral a user reads as a measurement is set in `.figure` — dimension cells, table numeric columns, chart axes and tooltips, date inputs, number inputs, revision stamps. A number that is part of a sentence is not a measurement and stays in the lettering face. Never mix the two faces inside one column.

**The Annotation Rule.** Labels are annotations, not headings. Every metric label, column head, and legend entry is `.annot`. It carries the tracked uppercase treatment only under LTR, because Arabic has no case and rejects tracking — the class handles this; never hardcode `uppercase` or `tracking-*` on a label.

## Layout

The shell is a two-part drawing board. At `md` and above, a permanent 15.5rem amber rail runs the full height of the start edge — sticky, carrying the company lockup at its head, navigation in the middle, and the user plate at its foot the way a title block names who drew the sheet. The content column beside it carries a sticky 56px topbar and a main region padded `16px` → `24px` → `32px` across `sm`/`lg`, capped at `86rem` and centred.

Below `md` the rail leaves the flow entirely and becomes a drawer over an ink scrim; the topbar takes over as the amber region and grows a menu toggle and a compact stamp lockup.

Every screen is a vertical stack of sheets at a `24px` gutter, opening with a title block. Inside a sheet, the padding rhythm is `16px` at base and `20px` from `sm`; internal vertical rhythm runs on `4/8/12/16/20`. The dimension grid steps `2 → 3 → 4` columns across base/`sm`/`lg` and is divided by a 1px gap over a `line` background rather than per-cell borders, so the grid closes cleanly at every breakpoint and in both directions.

Breakpoints in use: `sm` 640, `md` 768 (the rail threshold), `lg` 1024, `xl` 1280.

### Named Rules

**The Logical Offset Rule.** Every offset is logical — `start-*`, `end-*`, `ms-*`, `pe-*`, `inset-inline-*`. No `left`/`right` in layout. **The one exception, and it is load-bearing:** CSS logical insets resolve against the *element's own* `direction`, and `.figure` sets `direction: ltr`. So a `.figure` element positioned with `start-*` lands on the wrong side of an RTL page. Two live bugs came from exactly this (a section band's percent reading, a date field's calendar button). When an element is direction-flipped, put the positioning on a plain wrapper, or use physical sides deliberately.

**The Visually-Hidden Pin Rule.** `.sr-only` is given `inset-inline-start: 0; top: 0`. Tailwind's own `sr-only` leaves the element at its static position, which inside an RTL flex row landed far outside the page box and stretched the document ~971px sideways, pushing the layout out of the visual viewport. Keep the override; `not-sr-only` still restores static position so the responsive `sm:not-sr-only` variants work.

**The Overflow Contract.** `html` carries `overflow-x: clip` and every content wrapper carries `min-w-0`. Wide content (schedules, charts) scrolls inside its own container with `overscroll-x-contain`; the page body never scrolls sideways.

## Elevation & Depth

**This system is flat.** Depth is drawn, not lit. Separation comes from three things in order of preference: a hairline border, a tonal step between `paper` / `paper-raised` / `paper-sunk`, and — only for elements that genuinely float above the board — a single soft ambient shadow.

There are no resting shadows on content surfaces. A sheet is distinguished from the board by being one tonal step lighter and having a hairline edge, never by lifting off it.

### Shadow Vocabulary
- **Sheet ambient** (`0 1px 2px rgb(35 26 12 / 0.05), 0 8px 24px -12px rgb(35 26 12 / 0.18)`; dark: `0 1px 2px rgb(0 0 0 / 0.4), 0 8px 24px -12px rgb(0 0 0 / 0.6)`): Available as `--sheet-shadow` for a surface that must read as lifted off the board. Used sparingly.
- **Dialog** (`0 8px 30px -10px rgb(0 0 0 / 0.4)`): A modal genuinely floats; it gets the diffuse drop.
- **Tooltip** (`0 2px 10px -4px rgb(0 0 0 / 0.25)`): The chart's drawn tooltip, which tracks a cursor over content.
- **Drawer** (`0 0 40px -8px rgb(0 0 0 / 0.5)`): The mobile rail over its scrim.

### Named Rules

**The Drawn-Not-Lit Rule.** Depth is a border and a tone step. Shadows exist only where an element is genuinely detached from the drawing surface — dialogs, drawers, cursor-tracking tooltips. A sheet, a title block, a dimension cell, a table, a form fieldset: all flat, all hairline.

## Shapes

The form language is the drafting square. Every corner in the system is a 2px radius — effectively square, softened only enough to avoid a printed-pixel look — and that single value (`{rounded.sheet}`) is the entire radius scale. There is no `lg`, no `full`, no pill. The rule holds literally, browser surfaces included: the scrollbar thumb is drawn as a `line-2` bar with the same 2px corner, inset from the paper by a 3px border, so even the chrome the browser supplies reads as a ruled element rather than a capsule.

Surfaces are rectangles enclosed by a hairline. The recurring silhouettes are: the **sheet** (hairline rectangle, raised paper), the **title block** (a heavier `line-2` rectangle divided by an internal hairline into a name row and an annotation row), the **dimension string** (a horizontal rule with a 1px tick serif rising at each end, label above, figure below), and the **section band** (a framed mass with a solid hatched region cut from the start edge and a datum beneath).

The one texture is a 45° hatch in two densities — `.hatch` (4px pitch) for open or unresolved regions, `.hatch-dense` (2px pitch) for a solid consumed mass and for an overrun. A drafting-board grid (`.board-grid`, 32px squares in `line`) exists for one purpose only: a large empty ground that *is* the drawing board, as on the login's paper half.

### Named Rules

**The Squared Rule.** Nothing is a pill and nothing is a circle. Buttons, tags, fields, tabs, avatars, and checkboxes are all 2px-cornered rectangles. A status is a squared tag with a hairline, never a coloured dot and never a rounded chip.

**The Board-Grid Rule.** `.board-grid` is licensed only where the surface it fills *is* the drafting board — a full-bleed empty half of a screen. It is not wallpaper: never place it behind a floating panel or card, where it becomes decoration rather than material. (A `/forbidden` screen that used it that way was redrawn to remove it.)

**The Hatch Rule.** Hatch means one of two things — quantity consumed, or region not yet drawn (empty states, skeletons). It never appears as ornament, and it never appears on a surface that is complete and full.

## Components

### Buttons
- **Shape:** Squared block (2px radius), 40px tall (32px `sm`, 36px square `icon`), 16px horizontal, 500 weight.
- **Primary:** The amber mass — `{colors.amber}` fill, `{colors.rail-ink}` text, `{colors.amber-deep}` hairline. It is a drawn block, not a pill. One per sheet, sitting in the title block.
- **Outline:** Raised paper, `line-2` edge, ink text. The default secondary.
- **Ghost:** Transparent with a transparent border (so it does not shift on hover), `ink-2` text, sunk-paper hover. Used for chrome controls.
- **Datum / Destructive:** Green and correction red fills, white text (sunk paper in dark). Reserved for confirming-to-zero and deleting.
- **Hover / Active:** Colour deepens; `active:translate-y-px` — the block is pressed into the sheet. 150ms transition on background, border, colour, transform only.
- **Pending:** A `pending` prop sets `data-pending` and `aria-busy`, and a 2px hairline in `currentColor` is ruled back and forth along the button's bottom edge (42% wide, 1100ms, looping) — work in progress drawn as a rule being ruled, not a spinner. Under reduced motion the same mark becomes a static full-width bar at lower opacity, so the state is still visible and `aria-busy` still reports it.
- **On the rail:** ghost and outline buttons swap to the rail ink set (`text-rail-ink`, `hover:bg-rail-line`) and swap back at `md` — the same button reads correctly on amber and on paper.

### Sheets / Containers
- **Corner Style:** 2px (square).
- **Background:** `paper-raised` on the `paper` board.
- **Border:** 1px `line` for a sheet; 1px `line-2` for a title block or a section band frame.
- **Shadow:** None at rest. See Elevation.
- **Internal Padding:** 16px base, 20px from `sm`.
- A sheet never appears without a title block or a ruled heading naming it.

### Inputs / Fields
- **Style:** A ruled blank — `paper` fill (one step *below* the sheet it sits on, so the blank reads as recessed), 1px `line-2` edge, 2px corners, 40px tall, 14px text.
- **Focus:** Border inks to `amber-deep` and the fill lifts to `paper-raised` — the blank fills in when you write on it. Plus the global 2px `ring` outline at 2px offset.
- **Number inputs** automatically take `.figure`; textareas share the same class with `min-h-20` and a vertical resize.
- **Selects** are native, drawn as the same blank with a hand-drawn 1.2-stroke chevron at the end edge.
- **Dates** are never native `type="date"` — Chromium draws segment order from the browser's UI locale and ignores `lang`, which prints `mm/dd/yyyy` on an Arabic sheet. The visible control is an ISO text field in the figure face; the native picker is hidden behind a calendar button. Both paths write the same ISO string.
- **Checkboxes** are drawn, not borrowed: a 1rem square with a `line-2` edge, amber fill when checked, and a rail-ink tick drawn from two borders.
- **Grouping:** Related fields sit in a `<fieldset>` with a hairline border and an inset `.annot` legend straddling the top rule — a ruled group on the sheet.

### Schedules (tables)
- **Character:** A drawing schedule, not a data grid.
- A heavy `line-3` double-weight rule under the header on sunk paper; hairline `line` dividers between rows; a doubled `border-double` `line-3` rule closing a totals row.
- Column heads are `.annot`. Numeric columns are `.figure` and end-aligned, so digits stack.
- Row hover washes to `amber-veil`. A pinned first column sticks to the start edge with its own end border and inherits the row hover.
- The whole table scrolls inside a bordered, `overscroll-x-contain` container.

### Navigation
- **Rail:** A full-height amber field, 15.5rem, with the company lockup at the head over a `rail-line` rule and the user plate at the foot over another.
- **Items:** 13px/500 with a 16px 1.75-stroke line icon, 2px corners.
- **Active:** The item inverts — `rail-ink` fill, `rail` text. The block *is* the state, so there is no dot, bar, or chevron announcing it.
- **Hover:** `rail-line`.
- **Mobile:** Below `md` the rail becomes a drawer over an ink scrim, dismissible on Escape and on backdrop press, entering with `.ink-in`.

### Badges
Squared tags (2px) with a hairline in the matching ink, 11px/500, `2px 8px`. Four tones: amber (default), datum (success), muted, correction (destructive). Never a pill, never a lone colour dot.

### Signature Component: The Section Band
The system's centrepiece and the reason it exists. A quantity drawn as mass with a visible cut:
- The frame is a `line-2` rectangle on `amber-veil`, 64px tall (80px from `sm`).
- The **budget extent** is drawn from the start edge, open and faintly hatched at 40% opacity.
- The **consumed mass** is solid amber over it with a dense hatch at 50% — the cut through the material.
- The **cut face** is a 1px `line-3` vertical rule at the boundary. The percentage reads inside the mass, in rail ink, hidden below 14% where it would not fit.
- An **overrun** past the budget edge is drawn in correction red with a dense hatch, and the budget edge grows a 2px `line-3` rule that overhangs the frame by 6px top and bottom.
- The **datum** — a 2px green rule — runs the full width beneath the mass.
- Above the mass sits the dimension string (label, budget figure); beneath it, spent read from the start and remaining (or overrun) read from the end.
- **On mount** (`animate`) the band draws itself in a drafter's order: the datum is ruled first with `.rule-in` (340ms), then the mass and any overrun are struck from it with `.strike` (560ms, starting at 140ms). Zero exists before any quantity does. When the band is live rather than mounting, the same geometry moves instead: width and `inset-inline-start` transition over 300ms, so a changing figure slides rather than redraws.

### Signature Component: The Dimension Cell
Every metric is annotated the same way: a `.annot` label with a reserved `2.7em` min-height so labels of different lengths still align their rules, then a measured rule with a 1px tick serif at each end in the cell's tone (`ink`/`amber`/`datum`/`alarm`), then the figure at `1.5rem`–`1.75rem`, then an optional note. Cells are assembled into a `DimensionGrid` divided by 1px gaps over a `line` ground.

The dimension string is the third step of the sequence: the rule carries `.rule-in`, and `DimensionGrid` sets `--draw-delay: 340ms + i × 40ms` on each cell's wrapper, which inherits down to the rule inside it. The strings are therefore set out one after another with a capped stagger, the way a drafter works across a sheet. The labels and figures themselves are legible from 0ms — only the rules are drawn.

### Charts
The drawing owns the chart's furniture. Axis ticks are 11px figure-face in `ink-3`; the grid is horizontal-only in `line`; there is no axis line on Y. Spend is an area filled with a **45° SVG hatch pattern** (6px, amber at 16% under a 1.4-stroke `amber-deep` line) and stroked at 1.5px; return is a 2px `datum` line with no dots. The `y=0` **datum is a 2px `ReferenceLine` in green** — the same datum as everywhere else. The cursor is a dashed `line-3` rule; the tooltip is a miniature sheet with its own title-block row and two figures. Recharts' own series animation stays off (`isAnimationActive={false}`); instead the whole plot is traced last, as one drawing: the plot wrapper carries `.plot-in` (600ms, starting at 460ms), a clip sweep left-to-right. No series draws itself independently of the others.

### Empty States
Nothing drawn yet: a **dashed** `line-2` rectangle with a hatched interior, a short message, and a 24px green datum rule beneath it. Never a placeholder figure, never an illustration. Loading uses the same logic — a `.hatch` skeleton on sunk paper.

### Named Rules

**The One Action Rule.** A sheet's primary action lives in its title block, beside the sheet name. Not floating, not repeated at the foot, not duplicated in the rail.

**The Inking Rule.** The world's native motion is inking: a line appears along its own length, in the order a drafter works. The sequence is fixed and every surface uses the same one — the datum is ruled first (`.rule-in`, 340ms, so zero exists before any quantity), the mass is struck from it (`.strike`, 560ms, from 140ms), the dimension strings are set out with a capped stagger (`--draw-delay: 340ms + i × 40ms`), and the plot is traced last (`.plot-in`, 600ms, from 460ms). `.ink-in` (400ms, opacity plus a 4px rise) is the one non-drawn motion, reserved for a surface arriving over the sheet rather than being drawn on it: the mobile drawer and the dialog overlay. Every step reads its own start time from `--draw-delay`, so components compose the order and the stylesheet holds no hard-coded timeline. One curve throughout: `--ease-draw` (`cubic-bezier(0.16, 1, 0.3, 1)`). State changes remain a 150ms transition on background, border, colour, and a 1px press.

**The Text-Never-Moves Rule.** Only line work is drawn. Every figure, label, and heading is legible at 0ms — no fade, no rise, no stagger on text. A dimension cell's rule inks in while its number is already readable beside it. If a new surface wants its content to animate, animate the rule under it, not the words.

**The Clip-Not-Scale Rule.** A struck mass is revealed with `clip-path`, never `scaleX`. Scaling shears the 45° hatch off its angle, and the hatch angle is the one texture in the system. Any future reveal over hatched material uses a clip.

**The Time-Order Rule.** `rule-in` and `strike` are direction-aware: they start from the sheet's start edge, so they mirror under RTL (`transform-origin` flips; `strike` swaps to a mirrored keyframe). `plot-in` deliberately does not — it sweeps left-to-right in both scripts, because the chart's x-axis is time and the drawing follows the data, not the reading direction. Direction-awareness is a property of the sheet, not of the plot.

**The Reduced-Motion Rule.** Reduced motion is targeted, not blanket. The four drawing animations (`.rule-in`, `.strike`, `.plot-in`, `.ink-in`) are disabled so the sheet simply arrives complete; colour, border, and focus feedback all survive, because a user who asks for less motion has not asked for less state. The pending mark stays visible as a static full-width ruled bar instead of a travelling one, and `aria-busy` still reports. Never restore the blanket `*` override that killed state feedback along with the drawing.

## Do's and Don'ts

### Do:
- **Do** build every screen from the six drawing primitives — `Sheet`, `TitleBlock`, `DimensionCell`, `DimensionGrid`, `SectionBand`, `RuledHeading`. A new surface should need no new container.
- **Do** open every sheet with a title block naming it, its filter extent, and its revision.
- **Do** draw the 2px green datum beneath anything that measures a quantity, and use green for nothing else.
- **Do** set every measured numeral in `.figure` and every label in `.annot`.
- **Do** keep to the three line weights: `line` divides, `line-2` encloses, `line-3` cuts.
- **Do** let amber own a whole region — and below `md`, hand that region to the topbar when the rail collapses.
- **Do** use logical offsets everywhere, and put positioning on a plain wrapper whenever the positioned element is `direction`-flipped (anything carrying `.figure`).
- **Do** give an unresolved region a hatch and a dashed edge rather than a placeholder number.
- **Do** keep the amber rail filled in dark mode; in dark, let amber carry the hatch and line work instead of the fills.
- **Do** sequence a new surface's entrance with `--draw-delay` in the drafter's order — datum, mass, dimension strings, plot — and let every figure and label be legible at 0ms.
- **Do** reveal anything hatched with `clip-path`, and keep `plot-in` sweeping left-to-right in both scripts because the axis is time.

### Don't:
- **Don't** ship a rounded card. 2px is the only radius; nothing is a pill or a circle.
- **Don't** add a fourth line weight, a second texture, or a hatch angle other than 45°.
- **Don't** scatter amber into accents — no coloured icons, coloured headings, coloured side stripes, or lone status dots.
- **Don't** use green as a generic success or brand colour, or red for anything but a correction, overrun, or deletion.
- **Don't** put `amber` (`#e59731`) behind small paper-ink text, or paper ink on an amber region — switch to the rail ink set.
- **Don't** put a resting shadow on a sheet, title block, dimension cell, table, or fieldset.
- **Don't** use `.board-grid` behind a floating panel; it is licensed only where the surface itself is the drafting board.
- **Don't** use a native `type="date"` control — it prints the browser's locale segment order over an Arabic sheet.
- **Don't** hardcode `uppercase` or `tracking-*` on a label; `.annot` applies them under LTR only, because Arabic takes neither.
- **Don't** remove the `.sr-only` inset override, or `overflow-x: clip` on `html` — both hold the RTL layout inside the viewport.
- **Don't** animate chart series individually; the plot is traced as one drawing, and Recharts' own series animation stays off.
- **Don't** animate text — no fading, rising, or staggering figures, labels, or headings. Draw the rule, not the word.
- **Don't** reveal a hatched mass with `scaleX`; it shears the 45° hatch off its angle. Use `clip-path`.
- **Don't** hard-code a timeline in the stylesheet or invent a second easing curve; compose the order with `--draw-delay` and use `--ease-draw`.
- **Don't** restore a blanket `*` reduced-motion override; disable the four drawing animations only, and keep colour, state, and focus feedback alive.
