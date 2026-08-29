# 05 — Design System

**Status:** extracted from the Phase 2 prototype, 2026-08-29.
**Machine-readable source:** [`design/tokens.css`](../design/tokens.css) — copy it into the app
verbatim. This document explains and pins it; it does not replace it.
**Visual reference:** the canvas at <https://claude.ai/code/artifact/141693a7-0b34-4fae-a25e-72ecad4b3d30>
(boards 01 Colour, 02 Type/space/form, 03 Semantic states).

Every value below was read out of the prototype. Hex codes are the sRGB rendering of the authored
oklch values — **oklch is authoritative**; the hex column exists so a value can be pasted into a tool
that will not take oklch. Regenerate the hex column rather than hand-editing it.

---

## 1. Reference products

**IBM Carbon** — typographic lineage only. The type is the IBM Plex superfamily and the neutrals are
deliberately restrained in the same spirit.

**The layout, density and component anatomy are NOT Carbon's.** They were derived from the
constraints in §10. Judge this design against the constraint list, not against Carbon.

There is no second or third reference product. This was not modelled on an existing app.

---

## 2. Colour

One neutral ramp, four semantic families. Dark redefines **only** the aliases in §2.2 — never the
ramp, never a scale.

### 2.1 Neutral ramp (theme-independent)

| Token | oklch | Hex |
| --- | --- | --- |
| `--n-0` | `oklch(0.995 0.002 250)` | `#FCFDFF` |
| `--n-50` | `oklch(0.977 0.003 250)` | `#F6F8F9` |
| `--n-100` | `oklch(0.958 0.004 250)` | `#EFF1F4` |
| `--n-200` | `oklch(0.918 0.006 250)` | `#E1E4E8` |
| `--n-300` | `oklch(0.858 0.008 250)` | `#CCD1D5` |
| `--n-400` | `oklch(0.650 0.012 250)` | `#8A9096` |
| `--n-500` | `oklch(0.588 0.013 250)` | `#777D84` |
| `--n-600` | `oklch(0.472 0.015 252)` | `#555C64` |
| `--n-700` | `oklch(0.362 0.016 254)` | `#383E46` |
| `--n-800` | `oklch(0.268 0.017 256)` | `#21262E` |
| `--n-900` | `oklch(0.196 0.016 258)` | `#11151C` |
| `--n-950` | `oklch(0.148 0.014 258)` | `#070B11` |

All twelve steps feed an alias. **No alias invents a grey.**

### 2.2 Aliases — the only colour names a component may use

| Token | Light | Dark | Notes |
| --- | --- | --- | --- |
| `--surface-page` | `#F6F8F9` | `#11151C` | app ground |
| `--surface-raised` | `#FCFDFF` | `#21262E` | cards. In dark a raised surface is **lighter** than the page |
| `--surface-sunken` | `#EFF1F4` | `#070B11` | explanation panels inside a card |
| `--surface-inset` | `#E1E4E8` | `#11151C` | recessed controls: chips, kbd, code, meter track, answered tile |
| `--surface-hover` | `#EFF1F4` | `#383E46` | pointer over a control |
| `--surface-active` | `#E1E4E8` | `#555C64` | control held down |
| `--ink-primary` | `#11151C` | `#EFF1F4` | 18.0:1 / 13.4:1 on a card |
| `--ink-secondary` | `#383E46` | `#CCD1D5` | explanation prose |
| `--ink-muted` | `#555C64` | `#8A9096` | meta text |
| `--ink-faint` | `#8A9096` | `#777D84` | **decorative only** — never small copy (3.2:1) |
| `--ink-inverse` | `#FCFDFF` | `#070B11` | |
| `--line-subtle` | `#E1E4E8` | `#21262E` | decorative separators |
| `--line-default` | `#CCD1D5` | `#383E46` | decorative, heavier |
| `--line-strong` | `#8A9096` | `#555C64` | |
| `--line-control` | `#777D84` | `#777D84` | **any border that identifies a control or a state.** ≥3:1 in both themes; same step in both |
| `--scrim` | `oklch(0.20 0.02 258 / 0.45)` | `oklch(0.06 0.01 258 / 0.66)` | modal backdrop; alpha is load-bearing, do not flatten to hex |

### 2.3 Semantic families

Each family carries the same five roles, so any component can be restated in another state by
swapping one prefix.

| Role | correct (hue 150) | incorrect (hue 27) | flagged (hue 78) | accent / current (hue 258) |
| --- | --- | --- | --- | --- |
| `-ink` light | `#15612F` | `#9E2D28` | `#7A5103` | `#1F54A0` |
| `-ink` dark | `#86D396` | `#FB8D82` | `#EABA67` | `#90BCFE` |
| `-solid` light | `#2A7B42` | `#C33E38` | `#AC7400` | `#2A67BD` |
| `-solid` dark | `#48A260` | `#D84E46` | `#D2992E` | `#5691E9` |
| `-surface` light | `#E2F7E5` | `#FFECE8` | `#FFF0D4` | `#E6F2FF` |
| `-surface` dark | `#1D3724` | `#492522` | `#402F12` | `#1F314C` |
| `-line` light | `#A3D0AB` | `#F2B7AF` | `#E5C38F` | `#9EC0F2` |
| `-line` dark | `#366240` | `#83453F` | `#725524` | `#395888` |
| `-on-solid` light | `#F7FEF8` | `#FFFAF9` | `#1E1406` | `#FAFCFF` |
| `-on-solid` dark | `#050C06` | `#130807` | `#100A03` | `#070B12` |

**`accent` is the neutral ramp's own hue (258) with the chroma turned up.** "You are here" must never
read as a new colour in the system. Do not substitute a different hue for it.

Interaction variants exist only for the two families that fill a button:

| Token | Light | Dark |
| --- | --- | --- |
| `--accent-solid-hover` | `#1A57AD` | `#6BA3F5` |
| `--accent-solid-active` | `#0D4A9C` | `#7CB0FD` |
| `--incorrect-solid-hover` | `#B02B27` | `#EA665C` |
| `--incorrect-solid-active` | `#9C211F` | `#F47C70` |

---

## 3. Typography

| Role | Family | Size token | px | Weight | Line-height | Tracking |
| --- | --- | --- | --- | --- | --- | --- |
| Screen title (h1) | ui | `--text-xl` | 26 | 600 | 1.15 | −0.011em |
| Section title (h2) | ui | `--text-lg` | 20 | 600 | 1.35 | — |
| Sub-head (h3) | ui | `--text-sm` | 14 | 600 | 1.35 | — |
| Board title | ui | `--text-2xl` | 34 | 600 | 1.15 | −0.011em |
| Body / interface | ui | `--text-base` | 16 | 400 | 1.5 | — |
| **Prose** | **serif** | `--text-prose` | **17** | 400 | **1.65** | — |
| Small / meta | ui | `--text-xs` | 12.5 | 400 | 1.35 | — |
| Eyebrow | ui | `--text-xs` | 12.5 | 600 | 1.35 | 0.08em, uppercase |
| Micro (tile numerals) | mono | `--text-2xs` | 11 | 500 | 1.35 | — |
| Code | mono | 0.92em of parent | — | 400 | inherit | — |
| Clock | mono | `--text-clock` | 30 | 500 | 1.15 | −0.011em |
| Score numeral | mono | `--text-3xl` | 44 | 500 | 1.15 | −0.02em |

**Families**

```css
--font-ui:    "IBM Plex Sans", "Segoe UI", system-ui, sans-serif;
--font-prose: "IBM Plex Serif", Georgia, "Times New Roman", serif;
--font-mono:  "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace;
```

### The reading spec — the one that matters

Question stems, all four option texts and every explanation share it:

```css
font-family: var(--font-prose);   /* IBM Plex Serif */
font-size:   var(--text-prose);   /* 17px */
line-height: var(--leading-prose);/* 1.65 */
max-width:   var(--measure-prose);/* 68ch */
```

The review screen renders four explanations for each of sixty questions. This spec is set for that
screen first and the chrome second. **Do not shrink prose to fit a layout** — change the layout.

Measures: `--measure-prose: 68ch` (anything read repeatedly), `--measure-wide: 78ch` (section ledes,
read once), `--measure-ui: 52ch` (helper text).

All numerals in scores, timers and tables use `font-variant-numeric: tabular-nums`.

---

## 4. Spacing scale

`2 · 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96` px — tokens `--space-0` … `--space-9`.

Nothing off-scale. Prefer `gap` over margins: sibling groups (buttons, chips, tiles, nav items) are
laid out with flex/grid + `gap`, never with per-element margins or source whitespace.

---

## 5. Radius

| Token | px | Used for |
| --- | --- | --- |
| `--radius-sm` | 4 | navigator tiles, code, kbd, small swatches |
| `--radius-md` | 6 | **buttons and inputs** |
| `--radius-lg` | 10 | **cards, panels, modals** |
| `--radius-pill` | 999 | chips, meters, avatar, option key |

---

## 6. Shadows

Elevation lifts a surface off the page. It is never decoration.

```css
/* light */
--shadow-sm: 0 1px 2px oklch(0.20 0.02 258 / 0.06);
--shadow-md: 0 1px 2px oklch(0.20 0.02 258 / 0.05), 0 8px 18px -8px oklch(0.20 0.02 258 / 0.10);
--shadow-lg: 0 2px 4px oklch(0.20 0.02 258 / 0.05), 0 18px 36px -14px oklch(0.20 0.02 258 / 0.14);
/* dark */
--shadow-sm: 0 1px 2px oklch(0.05 0.01 258 / 0.40);
--shadow-md: 0 1px 2px oklch(0.05 0.01 258 / 0.35), 0 8px 18px -8px oklch(0.05 0.01 258 / 0.55);
--shadow-lg: 0 2px 4px oklch(0.05 0.01 258 / 0.35), 0 18px 36px -14px oklch(0.05 0.01 258 / 0.65);
```

`sm` = cards at rest. `md` = sticky bars. `lg` = the submit and time-expired dialogs. Nothing else.

---

## 7. Controls

### 7.1 Heights

| Token | px | Used for |
| --- | --- | --- |
| `--control-h-xs` | 22 | inline score chips |
| `--control-h-sm` | 26 | chips |
| `--control-h-md` | 30 | compact buttons, review filters |
| `--control-h` | 36 | standard buttons |
| `--control-h-lg` | 44 | primary actions; **the minimum touch target** |

Other fixed sizes: `--tile-size: 34px` (navigator tile, **pointer-only**), `--key-size: 28px` (option
letter, avatar), meters `--meter-h-sm: 6px` / `--meter-h: 8px` / `--meter-h-lg: 14px` (pass-mark bar).

On any touch layout every target — including navigator tiles — is at least 44×44. The 34px tile is
never used on a touch layout.

### 7.2 Buttons, all states

Base: height `--control-h`, padding `0 --space-4`, radius `--radius-md`, `--text-sm`/500, 1px border.

| Variant | Default | Hover | Active | Disabled |
| --- | --- | --- | --- | --- |
| **Secondary** (`.btn`) | bg `--surface-raised`, border `--line-control`, text `--ink-primary` | bg `--surface-hover` | bg `--surface-active` | text `--ink-faint`, border `--line-subtle`, `cursor: not-allowed`, no hover change |
| **Primary** (`.btn--primary`) | bg + border `--accent-solid`, text `--accent-on-solid` | bg + border `--accent-solid-hover` | `--accent-solid-active` | as above |
| **Ghost** (`.btn--quiet`) | transparent, no border, text `--ink-secondary` | bg `--surface-hover`, text `--ink-primary`, border stays transparent | bg `--surface-active` | as above |
| **Destructive** (`.btn--danger`) | bg + border `--incorrect-solid`, text `--incorrect-on-solid` | `--incorrect-solid-hover` | `--incorrect-solid-active` | as above |

Destructive is used in exactly one place: **Submit and see score**. Submitting is irreversible, so it
does not get the accent.

**Loading state is not specified.** The prototype has no async action slow enough to need one. Decide
it in Phase 4 if the app needs it — do not improvise it from another product.

### 7.3 Focus

```css
outline: 2px solid var(--focus-ring);   /* = --accent-solid */
outline-offset: 2px;
```

One rule, every control, both themes, applied on `:focus-visible`. **Never removed.** The 2px offset
is what lets it read over a filled button as well as an outlined one.

### 7.4 Forms

The v1 product has no text inputs. The controls that exist:

- **Radio-equivalent** — the answer option row. Full-width, 1px border + 3px left rule, radius
  `--radius-md`, padding `--space-4`, grid `28px 1fr` with `--space-3` gap.
- **Checkbox** — 16×16, radius `--radius-sm`, border `--line-control`; checked = `--accent-solid` fill
  with a check glyph in `--accent-on-solid`.
- **Segmented control** — `--control-h`, radius `--radius-md`, 1px `--line-control`, dividers
  `--line-control`; selected segment `--accent-solid` / `--accent-on-solid`.

Error state: not needed in v1 (no free-form input). Labels sit above their control, `--text-xs`/600
uppercase with `--tracking-eyebrow`.

---

## 8. Semantic states — the product-specific core

These carry the product. **Colour is never the only signal**, because the review screen is almost
entirely red and green.

| State | Colour | Cue without colour |
| --- | --- | --- |
| **correct** | `--correct-*` | Check glyph, 3px solid left rule, filled key letter, and the words "Correct answer" / "Correct · your answer" |
| **incorrect** | `--incorrect-*` | Cross glyph, 3px solid left rule, filled key letter, and the words "Your answer" |
| **flagged** | `--flagged-*` | Flag glyph in the toolbar; a **folded top-right corner** on the tile. Layers over any other state |
| **unanswered** | neutral only | Dashed 1px `--line-control` border, no fill. Deliberately has no hue of its own |
| **current** | `--accent-*` | Filled tile plus the 2px focus ring at 2px offset |

**Flagged is orthogonal.** It is drawn *over* whatever the tile already is, so a question can be
answered-and-flagged or unanswered-and-flagged without a sixth colour. Do not model it as a value in
the same enum as answered/unanswered.

**Wrong-but-not-chosen** is a sixth option-row state: neutral surface, dash glyph, the words "Not
correct", and its explanation still shown. Every option is explained, always.

Verification: board 03 ends with the whole set rendered at `filter: grayscale(1)`. If a new state is
not legible there, it is not finished.

---

## 9. Clock

Three states, and the ramp is **weight as much as hue** — quiet ink, then a tinted chip, then a solid
fill. Warning reuses `flagged`, critical reuses `incorrect`. The clock introduces no colour of its own.

| State | Threshold | Ink | Surface | Border |
| --- | --- | --- | --- | --- |
| normal | > 20:00 | `--ink-primary` | transparent | `--line-subtle` |
| warning | 20:00 → 5:00 | `--flagged-ink` | `--flagged-surface` | `--flagged-line` |
| critical | < 5:00 | `--incorrect-on-solid` | `--incorrect-solid` | `--incorrect-solid` |

Thresholds are exported for the app, not just for CSS:

```css
--clock-threshold-warning:  1200s;   /* 20 minutes remaining */
--clock-threshold-critical: 300s;    /*  5 minutes remaining */
```

The remaining time is always written out numerically as well. A glance at a colour is not a reading.

---

## 10. Accessibility floor — verified, not assumed

- **40 colour pairs** were computed through oklch → sRGB → WCAG relative luminance in **both themes**.
  All pass: 4.5:1 for text, 3:1 for non-text (WCAG 1.4.11). Re-run after any colour change.
- Decorative hairlines (`--line-subtle`, `--line-default`) are deliberately below 3:1 — 1.4.11 exempts
  them. Any border that *identifies* a control or a state uses `--line-control`, which clears 3:1.
- `--ink-faint` clears 3:1, not 4.5:1. It is for decoration only. Small essential copy uses
  `--ink-muted` or darker.
- Touch targets ≥ 44×44 on touch layouts.
- Motion respects `prefers-reduced-motion: reduce` (transitions collapse to 1ms; state changes remain).

---

## 11. Motion

```css
--duration-fast: 120ms;   /* buttons, chips, tiles */
--duration-base: 200ms;   /* option rows, clock state changes */
--ease-standard: cubic-bezier(0.2, 0, 0.15, 1);
```

Only `background-color`, `border-color` and `color` are transitioned. **Nothing moves position on
hover** — no lift, no scale, no shift. Someone is reading under a clock.

---

## 12. The forbidden list

1. **Never introduce a new colour.** If an existing ramp step is close, it is the answer. New hues
   need a decision-log entry.
2. **Never introduce a new grey.** Twelve steps, all in use.
3. **Never use a raw value where a token exists** — no literal px, hex, or oklch in a component.
4. **Never signal state with colour alone.** Every state needs a glyph, a border treatment, or a word.
5. **Never remove the focus outline**, and never replace it with a colour change alone.
6. **Never shrink prose below `--text-prose` (17px)** or widen it past `--measure-prose` (68ch).
7. **No gradients, no glows, no decorative shadows.** Three elevation levels, used as listed in §6.
8. **No emoji in the UI.** Icons are inline stroke SVG on a 14/16/20/24 grid, `currentColor`.
9. **No more than two font weights per screen** (500 and 600 over the 400 body).
10. **Nothing moves on hover.**
11. **Never use `--ink-faint` for text a user must read.**
12. **Never use the 34px navigator tile on a touch layout.**
13. **Do not paint fake OS chrome** — no drawn status bar, no drawn keyboard.
