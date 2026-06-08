---
title: css-standards

name: css-standards
description: Write modern, maintainable, and cross-browser CSS using the latest CSS specifications. Use when implementing layouts with Flexbox, Grid, or Subgrid, applying container queries, using modern selectors (:has, :is, :where), controlling the cascade with @layer and @scope, working with custom properties and @property, doing color and theming with OKLCH and color-mix, styling typography with text-wrap and variable fonts, implementing entry animations with @starting-style, building forms with field-sizing and accent-color, using Anchor Positioning, or applying scroll and visibility optimizations.
license: MIT
compatibility: opencode
metadata:
  author: opencode
  version: "1.0.0"
  domain: frontend
  triggers: CSS, CSS standards, modern CSS, cascade layers, @layer, @scope, specificity, logical properties, Flexbox, CSS Grid, Subgrid, container queries, @container, custom properties, @property, CSS selectors, :has, :is, :where, :focus-visible, :user-valid, color-mix, OKLCH, light-dark, color scheme, text-wrap, text-box-trim, text-wrap balance, variable fonts, @font-face, CSS nesting, @starting-style, transition-behavior, field-sizing, accent-color, scrollbar-gutter, content-visibility, anchor positioning, anchor-name, position-anchor, @supports, prefers-reduced-motion, env, CSS container query units
  role: specialist
  scope: implementation
  output-format: code
  related-skills: css-motion-systems, tailwind-design-system, html-semantics, frontend-design, a11y-engineer, design-system
  targets-version: ""
  last-reviewed: 2026-06-08
  spec-source: https://www.w3.org/Style/CSS/
parent: Frontend
nav_order: 4
---

# css-standards

Senior CSS specialist with deep expertise in modern CSS specifications, cross-browser layout, color science, typography, progressive enhancement, and design system implementation.

## When to Use

- Structuring page layouts with Flexbox, Grid, or Subgrid
- Controlling cascade and specificity with `@layer`, `@scope`, and `:where()`
- Building responsive components that adapt to their container, not just the viewport
- Using modern color functions (OKLCH, `color-mix()`, relative color syntax) for theming
- Managing custom properties with typed registration via `@property`
- Writing clean selector logic with `:has()`, `:is()`, `:user-valid`, and `:focus-visible`
- Implementing text balancing, trimming, and variable font control
- Using native CSS nesting instead of a preprocessor
- Animating elements entering the page with `@starting-style`
- Styling form controls with `field-sizing`, `accent-color`, and `appearance`
- Positioning elements relative to other elements with Anchor Positioning
- Optimizing rendering with `content-visibility` and `contain-intrinsic-size`
- Writing responsive, accessible styles that respect user preferences (`prefers-reduced-motion`, `prefers-color-scheme`, `prefers-contrast`)

## When NOT to Use

- UI component libraries that already encapsulate styling (use the library's theming API)
- Animation and motion design — use `css-motion-systems` for transitions, keyframes, scroll-driven animations, and View Transitions API
- Design system tokenization with Tailwind — use `tailwind-design-system`
- Layout decisions that are better handled by a framework's built-in abstraction

## Core Principles

1. **Cascade over specificity** — Use `@layer` and `@scope` to control source order. Reserve specificity battles for edge cases.
2. **Intrinsic sizing first** — Let content determine size before imposing extrinsic constraints. `width: min(100%, max-content)` beats fixed pixel widths.
3. **Progressive enhancement** — Use `@supports()` to layer advanced features. The page works without them.
4. **Logical properties everywhere** — `margin-inline-start` over `margin-left`. Proper i18n support from the start.
5. **OKLCH for color** — Perceptually uniform, wider gamut, and `color-mix()` works intuitively.
6. **Container queries over viewport queries** — Components should respond to their parent, not the window.

## 1. Cascade & Specificity

### @layer — Controlled Source Order

Define layers in a single block at the top of your stylesheet. The order of `@layer` statements determines cascade priority: **later layers override earlier ones**.

```css
/* Layer declaration order sets priority */
@layer reset, base, components, utilities, overrides;

/* Layer contents can be defined anywhere */
@layer reset {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
  }
}

@layer components {
  .card { padding: 1rem; border-radius: 0.5rem; }
}
```

- **Unlayered styles** beat all layered styles. Always put everything in a layer to keep the cascade predictable.
- **Layer nesting:** `@layer framework.components` creates sub-layers that can be interleaved independently.
- **`!important` in layers** reverses layer order — the **earliest** layer wins for `!important`. Use `!important` only in utility layers.

### Specificity Rules

```
Inline styles > IDs > Classes/Attributes/Pseudo-classes > Elements/Pseudo-elements
```

- `:is()` takes the **highest** specificity of its arguments (`:is(#id, .class)` = ID level)
- `:where()` always has **zero** specificity — use it for resets and defaults
- `:not()` takes the specificity of its **argument** (`:not(#id)` = ID level)
- `@scope` limits specificity to the scope root — declarations inside can still be overridden by outer same-specificity rules
- `:has()` specificity = highest specificity among its arguments (same as `:is()`)

### @scope — Scoped Styles (Baseline Newly Available 2025)

```css
@scope (.card) {
  :scope { /* .card itself */ }
  p { /* only <p> inside .card */ }
}

/* With lower/upper bounds */
@scope (.card) to (.footer) {
  /* targets .card but NOT .card .footer */
}
```

- Replaces BEM naming in many cases — don't need a class on every child
- `:scope` refers to the scope root element
- `to (selector)` sets the **lower bound** — scoping stops there
- Browser support: Chrome 118+, Safari 17.4+, Firefox 146+ (all major as of 2026)

### Practical Specificity Management

```css
/* Reset/lowest priority — zero specificity */
:where(h1, h2, h3) { margin-block: 0; }

/* Base component styles — class level */
:where(.btn) { /* see x.css layer */ }

/* Component overrides in dedicated layer */
@layer components { .btn-primary { background: oklch(55% 0.2 25); } }

/* Highest — utilities */
@layer utilities {
  .m-0 { margin: 0; }
}
```

## 2. Box Model & Intrinsic Sizing

### The Two Box Models

```css
/* Content-box (default) — width = content width only */
/* Border-box — width = content + padding + border */
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

### Intrinsic Sizing Keywords

```css
/* Content-determined */
width: min-content;   /* narrowest without overflow */
width: max-content;   /* never wraps */
width: fit-content;   /* max-content if space, min-content if not */

/* Extrinsic (fixed) */
width: 100%;          /* fills container */
inline-size: 60ch;    /* capped at ~60 characters */
```

### When to Use What

| Use case | Property |
|----------|----------|
| Image should shrink but not exceed natural size | `max-width: 100%` |
| Button grows with text but stops at container | `width: fit-content; max-width: 100%` |
| Sidebar shrinks to narrowest content | `width: min-content` |
| Card grid items equal width | `min-width: 0` on flex children + `flex-basis: 200px` |

### aspect-ratio

```css
/* Width-driven: height follows */
img, video, iframe { aspect-ratio: 16 / 9; }

/* Height-driven: width follows */
.hero { aspect-ratio: 2 / 1; inline-size: 100%; }

/* Intrinsic override: set explicit width AND height, then aspect-ratio will be auto */
img { width: 100%; height: auto; aspect-ratio: attr(width) / attr(height); }
```

### Logical Properties — i18n-Safe Layout

```css
/* Physical — direction-dependent */
margin-left: 1rem;
padding-top: 0.5rem;
border-right: 2px solid;

/* Logical — adapts to writing direction */
margin-inline-start: 1rem;  /* left in LTR, right in RTL */
padding-block-start: 0.5rem; /* top in horizontal writing modes */
border-inline-end: 2px solid;

/* Shorthand reference */
margin-block: 1rem 2rem;     /* top & bottom */
margin-inline: 1rem auto;    /* left & right */
inset: 0;                     /* all four = top: 0; right: 0; bottom: 0; left: 0 */
inset-block: 1rem;            /* top & bottom */
inset-inline: 1rem;           /* left & right */
```

- Use logical properties **everywhere** by default. Physical properties only when the intent is truly direction-dependent (e.g., chevron icons that should point right in LTR, left in RTL).

### contain-intrinsic-size

```css
/* Tells the browser the estimated size of an element with content-visibility */
.element {
  content-visibility: auto;
  contain-intrinsic-size: 300px 200px; /* width, height */
}

/* Shorthand with auto — uses actual rendered size after first paint */
contain-intrinsic-size: auto 300px;
```

- Prevents scrollbar jank when using `content-visibility: auto`
- The `auto` keyword stores the last-rendered size for future off-screen appearances

## 3. Layout — Flexbox

### When to Use

- One-dimensional layouts (row OR column)
- Distributing space among items
- Aligning items along the cross axis
- Unknown number of children
- Need for wrapping (`flex-wrap: wrap`)

### Container Properties

```css
.flex-container {
  display: flex;
  flex-direction: row;           /* default: row | column | row-reverse | column-reverse */
  flex-wrap: wrap;               /* nowrap | wrap | wrap-reverse */
  justify-content: space-between; /* main axis: flex-start | flex-end | center | space-between | space-around | space-evenly */
  align-items: center;           /* cross axis: stretch | flex-start | flex-end | center | baseline */
  align-content: stretch;        /* multi-line cross axis: stretch | flex-start | flex-end | center | space-between | space-around */
  gap: 1rem;                     /* row-gap and column-gap shorthand */
}
```

### Item Properties

```css
.flex-item {
  flex-grow: 1;    /* 0 = don't grow, 1+ = distribute remaining space proportionally */
  flex-shrink: 1;  /* 1 = shrink if needed, 0 = don't shrink */
  flex-basis: auto; /* auto | 0 | <length> — initial main size */
  align-self: center; /* overrides align-items for this item */
  order: 0;         /* visual order (use sparingly — affects tab order) */
}
```

### Critical Gotchas

```css
/* GOTCHA 1: flex-basis: 0 vs auto */
/* flex-basis: 0 — all items start at 0, space distributed evenly by flex-grow ratios */
/* flex-basis: auto — items start at their content width, remaining space distributed */
.item-group { flex: 1 1 0; }     /* equal-width columns */
.content-group { flex: 1 1 auto; } /* columns sized by content */

/* GOTCHA 2: min-width: auto — flex items default to min-content minimum */
/* Prevents items from shrinking below their content — override if needed */
.flex-item { min-width: 0; }     /* allows shrinking below content */

/* GOTCHA 3: gap + auto margins */
/* auto margins eat gap spacing — use gap alone for consistent spacing */
.nav { display: flex; gap: 1rem; }
.nav .spacer { margin-inline-start: auto; } /* pushes subsequent items to the right */
```

### Shorthands

```css
flex: 1;          /* flex-grow: 1; flex-shrink: 1; flex-basis: 0%; */
flex: 1 1 200px;  /* grow, shrink, basis */
flex: auto;       /* flex-grow: 1; flex-shrink: 1; flex-basis: auto; */
```

## 4. Layout — CSS Grid

### When to Use

- Two-dimensional layouts (rows AND columns)
- Explicit placement in a grid template
- Overlapping items
- Content that needs to align across rows and columns simultaneously

### Defining the Grid

```css
.grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;             /* three columns, middle is 2x */
  grid-template-rows: auto 1fr auto;               /* header, main, footer */
  gap: 1rem;                                       /* row-gap column-gap shorthand */
  grid-template-areas:                             /* name cells for placement */
    "header header header"
    "sidebar main aside"
    "footer footer footer";
}

/* Auto-fill vs auto-fit — critical difference */
.grid-auto-fill {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  /* Creates new tracks even if empty (preserves grid structure) */
}

.grid-auto-fit {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  /* Collapses empty tracks (tracks with no items are 0 width) */
}
```

### Placing Items

```css
/* Named area placement */
header { grid-area: header; }
article { grid-area: main; }

/* Line-based placement */
.item {
  grid-column: 1 / 3;   /* start line / end line */
  grid-row: 2 / 4;      /* span 2 rows */
  grid-column: 1 / -1;  /* from first to last line */
  grid-column: span 2;  /* shorthand for span 2 columns */
}

/* Automatic placement with span */
.item-wide { grid-column: span 2; }
.item-tall { grid-row: span 2; }
```

### Subgrid — Aligning Across Components (all major browsers)

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

/* Each card aligns its internal rows to the grid tracks */
.card {
  display: grid;
  grid-row: span 1;
  grid-template-rows: subgrid;
  /* Card title, body, and footer align across all cards in the row */
}
```

- Subgrid inherits the **track sizing** of the parent grid. The child grid's rows/columns snap to the parent's tracks.
- Use for aligning card titles, form labels, or table-like structures without extra wrappers.

### Grid vs Flexbox Decision

| Need | Use |
|------|-----|
| One-dimensional (row OR column) | Flexbox |
| Two-dimensional (rows AND columns) | Grid |
| Content dictates size | Flexbox (`flex-basis: auto`) |
| Container dictates size | Grid (`1fr`) |
| Equal-height items in a row | Either — flex `align-items: stretch` or grid |
| Items need to overlap | Grid (`grid-column` / `grid-row` overlapping) |
| Unknown number of items | Flexbox (`flex-wrap: wrap`) or Grid (`auto-fill`) |

### Masonry

CSS masonry layout (`grid-template-rows: masonry`) is not yet cross-browser. It is:
- **Chrome:** Behind flag (experimental)
- **Safari:** Implementing (not shipping)
- **Firefox:** No signal

**Do not use in production.** Use a JS library (Masonry, Isotope) or a column layout as fallback.

## 5. Layout — Other Patterns

### Multi-Column Layout

```css
.text-content {
  columns: 3;              /* auto column count */
  column-width: 20rem;     /* minimum column width */
  column-gap: 2rem;
  column-rule: 1px solid oklch(80% 0.02 200);
  orphans: 3;              /* minimum lines before break */
  widows: 3;               /* minimum lines after break */
}

/* Break control */
h2 { break-after: column; }        /* force column break after heading */
.no-break { break-inside: avoid; } /* keep element intact in one column */
```

### display: contents

```css
/* Removes the element's box from the layout — children are promoted */
.split-layout { display: contents; }
```

- The element no longer generates a box. Its children become children of the next ancestor in the tree.
- **Useful for:** Wrapper elements that exist only for semantics but interfere with grid/flex layout.
- **A11y warning:** `display: contents` removes the element **from the accessibility tree** too. Only use on elements that are purely presentational and have no semantic meaning (e.g., flex wrapper `<div>`). Never use on interactive elements, form controls, or landmarks.

### display: flow-root

```css
/* Creates a new block formatting context — contains floats */
.parent { display: flow-root; }
```

- Replaces the clearfix hack. A single declaration. Use it instead of `overflow: hidden` (which clips shadows) or `::after` clearfix patterns.

## 6. Container Queries

### Basic Setup

```css
/* Define the containment context on a parent */
.card-container {
  container-type: inline-size;
  container-name: card; /* optional, for disambiguation */
}

/* Query based on container width */
@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}

@container card (inline-size > 300px) {
  .card-title { font-size: 1.25rem; }
}

/* Shorthand */
.parent {
  container: card / inline-size;
}
```

### Container Query Units

| Unit | Relative to |
|------|------------|
| `cqw` | 1% of container width |
| `cqh` | 1% of container height |
| `cqi` | 1% of container inline size |
| `cqb` | 1% of container block size |
| `cqmin` | Smaller of `cqi` or `cqb` |
| `cqmax` | Larger of `cqi` or `cqb` |

```css
@container (inline-size > 500px) {
  .card-title { font-size: clamp(1rem, 3cqi, 2rem); }
  .card-body { padding: 2cqi; }
}
```

### When Container Queries Don't Work

- Container query size is always **parent width**, not the element's own width (use `@container` on a wrapper)
- Cannot query height from `container-type: inline-size` — use `container-type: size` but that also applies `contain: layout style size` which can cause issues
- Needs a **containment context** — element that doesn't naturally provide one (inline elements, replaced elements)

## 7. Custom Properties & @property

### var() — Basic Patterns

```css
:root {
  --color-primary: oklch(55% 0.2 25);
  --spacing-unit: 0.5rem;
  --max-width: 80ch;
}

.card {
  background: var(--color-primary);
  padding: calc(var(--spacing-unit) * 4);
  max-width: var(--max-width, 60ch); /* fallback if --max-width is missing */
}

/* Fallback chaining */
.element {
  color: var(--theme-text, var(--fallback-text, black));
}
```

### @property — Typed Custom Properties

```css
/* Register a typed custom property */
@property --rotation {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

@property --gradient-start {
  syntax: "<color>";
  inherits: true;
  initial-value: oklch(60% 0.15 280);
}

@property --alpha {
  syntax: "<number> | <percentage>";
  inherits: false;
  initial-value: 1;
}

/* Without @property, custom properties can't animate interpolated values */
/* With @property, transitions and keyframes work correctly */
.element {
  --rotation: 0deg;
  rotate: var(--rotation);
  transition: --rotation 0.3s ease;
}

.element:hover {
  --rotation: 180deg;
}
```

- **Why needed:** Unregistered custom properties are treated as strings (can't animate). `@property` tells the browser the type, enabling interpolation.
- **Key use cases:** Animating gradients (`--gradient-point: 0%`), colors (`--accent: oklch(55% 0.2 25)`), angles (`--rotation: 0deg`), lengths (`--slide-distance: 0px`)
- **Batch registration:** Register critical properties in CSS via `@property` (preferred). Use `CSS.registerProperty()` in JS only when you need dynamic syntax.
- Browser support: All major (Chrome 85+, Safari 15.4+, Firefox 128+)

### When to Use @property vs var()

| Need | Use |
|------|-----|
| Store a value for reuse | `var()`, no `@property` needed |
| Animate/interpolate the value | `@property` with `syntax` |
| Validate at assignment time | `@property` with `syntax: "<length>"` |
| Fallback chain on missing value | `var(--x, fallback)` |
| Component-scoped tokens | `var()` scoped to component root |

## 8. Modern Selectors

### :has() — The Parent Selector (all major browsers)

```css
/* Style a card differently when it contains an image */
.card:has(img) { grid-template-rows: auto 1fr; }

/* Previous sibling styling */
h2:has(+ p) { margin-bottom: 0; }              /* h2 followed by p */
h2:has(+ .meta) { border-bottom: 1px solid; }  /* h2 followed by .meta */

/* Form state — parent highlight */
.field:has(:user-invalid) { border-color: red; }
.field:has(:focus-visible) { box-shadow: 0 0 0 2px blue; }

/* Multiple conditions */
.card:has(img, video) { background: black; }   /* card with image OR video */

/* Checkbox/radio — label highlight when checked */
label:has(input:checked) { font-weight: bold; }
```

**Performance rules:**
- Scope `:has()` to the nearest meaningful parent — avoid `html:has()`, `body:has()`, or `:root:has()` (triggers full-document style invalidation)
- `:has()` on small subtrees is fine — it does not cause performance issues in practice for typical selectors
- Cannot cross Shadow DOM boundaries

### :is() vs :where()

```css
/* :is() — takes the HIGHEST specificity of its arguments */
:is(.important, #hero) p { }   /* specificity = 1 ID + 1 element */

/* :where() — always ZERO specificity */
:where(.important, #hero) p { } /* specificity = 0 + 1 element = 0,0,1 */

/* Practical: reset with zero specificity */
:where(a, button, input) { all: revert; }
:where(h1, h2, h3, h4) { margin: 0; }

/* Practical: group styles without raising specificity */
nav :where(a, button) { text-decoration: none; }
```

### :nth-child(An+B of S)

```css
/* Select every even article inside .list */
.list > :nth-child(even of article) { background: #f5f5f5; }

/* Previously required :nth-child(even) which catches ALL children */
/* Now you can filter to only <article> elements */
```

### :empty vs :blank

```css
/* :empty — no children at all (whitespace is counted, so <p> </p> is NOT :empty) */
.error:empty { display: none; }

/* :blank — empty OR whitespace-only (newer, check support) */
input:blank { border-color: lightgray; }
```

### :focus-visible

```css
/* Focus ring only for keyboard users, not mouse clicks */
:focus-visible {
  outline: 2px solid oklch(55% 0.2 25);
  outline-offset: 2px;
}

/* Remove default focus ring for mouse users while keeping keyboard accessibility */
:focus:not(:focus-visible) {
  outline: none;
}
```

- Always use `:focus-visible` for custom focus styles. Never remove `outline` without replacing it with `:focus-visible` handling.

### :user-valid / :user-invalid

```css
/* Only style validation after user interaction — not on page load */
input:user-valid { border-color: green; }
input:user-invalid { border-color: red; }
```

- Unlike `:valid`/`:invalid` which fire immediately on page load, `:user-valid`/`:user-invalid` only match after the user has interacted with the field

### :target — Current URL Hash Target

```css
/* Highlight the element that matches the current URL fragment */
section:target {
  background: oklch(95% 0.02 250);
  scroll-margin-top: 2rem;
}
```

## 9. Color & Theming

### OKLCH — The Preferred Color Space

```css
/* OKLCH: lightness, chroma, hue — perceptually uniform */
--primary: oklch(55% 0.2 25);         /* vibrant orange-red */
--neutral: oklch(40% 0.01 0);         /* gray (near-zero chroma) */
--muted: oklch(60% 0.05 250);         /* desaturated blue */

/* OKLAB: lightness, a-axis, b-axis — same space, cartesian coordinates */
--complement: oklab(65% -0.05 0.15);

/* Why OKLCH: */
/* 1. Perceptually uniform — a 10% lightness change looks equal to the eye */
/* 2. Wide gamut — covers P3 display colors natively */
/* 3. Intuitive — chroma and hue are separate concerns */
/* 4. color-mix() works correctly — mixing two OKLCH colors stays in gamut */
```

### color-mix()

```css
/* Mix colors in a chosen color space */
--surface: oklch(90% 0.01 200);
--text: oklch(20% 0.02 200);
--text-muted: color-mix(in oklch, var(--text), var(--surface) 40%);

/* Weighted mixing */
--accent-light: color-mix(in oklch, var(--accent) 15%, white);   /* 15% accent, 85% white */
--accent-dark: color-mix(in oklch, var(--accent) 85%, black);    /* 85% accent, 15% black */

/* Mix in different spaces */
color-mix(in srgb, red, blue);
color-mix(in hsl, hsl(0 100% 50%), hsl(240 100% 50%));
color-mix(in oklab, oklab(60% 0.2 0.1), oklab(40% -0.1 0.2));
```

- Use `in oklch` or `in oklab` by default. HSL mixing produces muddy results. sRGB mixing clips gamut.

### Relative Color Syntax

```css
/* Derive a new color from an existing one by manipulating channels */
--primary: oklch(55% 0.2 25);

--primary-light: oklch(from var(--primary) 80% c h);       /* increase lightness only */
--primary-dim: oklch(from var(--primary) l 0.05 h);        /* desaturate, keep hue */
--primary-shift: oklch(from var(--primary) l c calc(h + 180)); /* complementary hue */
--primary-faded: color-mix(in oklch, var(--primary) 30%, transparent);

/* RGB variant */
--accent-rgb: rgb(200 50 80);
--accent-faded: rgb(from var(--accent-rgb) r g b / 0.5);   /* same color, half opacity */
```

### light-dark() — Zero-JS Dark Mode

```css
/* Single function that returns different values per color scheme */
:root {
  color-scheme: light dark;
}

body {
  color: light-dark(oklch(20% 0.02 260), oklch(85% 0.01 260));
  background: light-dark(white, oklch(15% 0.02 260));
}

:root:has(#theme-toggle:checked) { color-scheme: dark; }
```

- Requires `color-scheme: light dark` on `:root` to function
- `color-scheme` inherits — setting `color-scheme: light` on a subtree forces `light-dark()` to return light values there
- Does **not** work inside `@media` or `@container` queries — only works in property values
- Much simpler than the manual `@media (prefers-color-scheme: dark)` pattern for simple light/dark switches

### accent-color

```css
/* Style form control accents in one line */
:root { accent-color: oklch(55% 0.2 25); }

/* Per-element override */
input[type="checkbox"].danger { accent-color: red; }
```

- Affects `<input type="checkbox">`, `<input type="radio">`, `<input type="range">`, `<progress>`
- Does not let you restyle the entire control — only the accent tint

## 10. Typography

### text-wrap Control

```css
/* Balance headlines — automatically wraps to minimize orphans */
h1, h2, h3 {
  text-wrap: balance;
  max-inline-size: 30ch; /* optional constraint */
}

/* Pretty — optimizes for fewer breaks */
.content-body {
  text-wrap: pretty;
}

/* Default quick behavior (modern default) */
p { text-wrap: wrap; }

/* No wrapping */
.nowrap { text-wrap: nowrap; }
```

- `text-wrap: balance` only works for **inline-size constrained** elements (up to ~100 characters, 5-6 lines max — browser heuristic)
- `text-wrap: pretty` is a lighter optimization for body text (avoids single words on last line)
- Both are **progressive enhancements** — fall back to `wrap` gracefully if unsupported

### text-box-trim / text-box-edge (Chrome + Safari, no Firefox)

```css
/* Trim leading (half-leading) above text caps and below descenders */
h1 {
  text-box-trim: trim-both;                    /* trim both start and end */
  text-box-edge: cap alphabetic;               /* reference edges */

  /* Shorthand */
  text-box: trim-both cap alphabetic;
}
```

- Solves the decades-old problem of extra space above/below text that makes vertical centering imprecise
- Use as progressive enhancement — `@supports (text-box-trim: trim-both) { ... }`
- Firefox gap: Behind flag, not shipping. Design systems that need pixel-perfect alignment should provide both versions.

### Variable Fonts

```css
/* Use weight, width, slant axes directly */
@font-face {
  font-family: "MyVariable";
  src: url("MyVariable.woff2") format("woff2-variations");
  font-weight: 100 900;
  font-stretch: 75% 125%;
}

body {
  font-family: "MyVariable", serif;
  font-weight: 350;                    /* any number in range */
  font-stretch: 110%;                  /* condensed to expanded */
  font-variation-settings: "wght" 350, "wdth" 110;
}
```

- `font-variation-settings` overrides the higher-level properties (`font-weight`, `font-stretch`) — prefer the standard properties when the axis maps directly
- Custom axes use 4-letter tags: `"GRAD"` (grade), `"slnt"` (slant), `"ital"` (italic), `"opsz"` (optical size)
- Performance: Variable fonts are a single file covering many weights, smaller than loading 5+ individual font files

### @font-face Strategy

```css
@font-face {
  font-family: "Body";
  src: url("body.woff2") format("woff2");
  font-display: swap;                  /* show fallback text, then swap */
  font-weight: 400;
  font-style: normal;
  ascent-override: 90%;
  descent-override: 20%;
  line-gap-override: 0%;
}

/* Use size-adjust to normalize font metrics across typefaces */
@font-face {
  font-family: "Brand";
  src: url("brand.woff2") format("woff2");
  font-display: swap;
  size-adjust: 95%;                    /* scale this font relative to fallback */
}
```

- `ascent-override`, `descent-override`, `line-gap-override` reduce layout shift by matching fallback font metrics to the web font
- `size-adjust` lets you normalize different font sizes so the fallback occupies the same space

### Line Clamping

```css
.clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

- The `-webkit-` prefixed `line-clamp` approach is the only widely supported method
- No standard `line-clamp` property exists yet cross-browser
- Alternative: use `max-height` with `overflow: hidden` when possible

### Hyphenation & Overflow

```css
p {
  hyphens: auto;                    /* enables dictionary-based hyphenation */
  overflow-wrap: break-word;        /* breaks words at arbitrary points when needed */
  /* OR for long URLs */
  word-break: break-all;            /* breaks at any character — more aggressive */
}

/* Prevent overflow on any element */
pre, code, kbd {
  overflow-wrap: anywhere;          /* softer than break-all, breaks at fallback points */
  overflow-x: auto;                 /* adds scrollbar if still overflows */
}

/* Truncate */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### initial-letter (Safari + Chrome partial, no Firefox)

```css
p::first-letter {
  initial-letter: 3 2;              /* 3 lines tall, 2 lines sink (baseline drop) */
  /* OR */
  initial-letter: 3;                /* drop cap, 3 lines tall */
}

@supports not (initial-letter: 3) {
  p::first-letter {
    font-size: 3em;
    float: left;
    line-height: 0.9;
    margin-inline-end: 0.15em;
  }
}
```

**Do not rely on it cross-browser.** Always provide a fallback (float-based drop cap).

## 11. CSS Nesting

### Syntax

```css
.card {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;

  /* Nest selectors inside */
  & h2 { font-size: 1.25rem; }                /* .card h2 */
  .body { color: gray; }                       /* .card .body */
  > .header { border-bottom: 1px solid; }     /* .card > .header */
  &:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); } /* .card:hover */

  /* Media queries inside */
  @media (max-width: 600px) {
    padding: 0.5rem;
  }

  /* Container queries inside */
  @container (min-width: 400px) {
    display: grid;
  }
}
```

### When & Is Required

```css
.card {
  /* NOT required before class, pseudo-class, attribute selectors */
  .body { }                  /* OK — .card .body */
  &:hover { }                /* OK — .card:hover */
  [data-state="active"] { }  /* OK — .card[data-state="active"] */

  /* REQUIRED before tag/element selectors */
  & p { margin: 0; }        /* .card p — must use & */
  &::before { content: ""; } /* .card::before — must use & */
}
```

- Without `&`, selectors that start with a tag name would be ambiguous (is it a nested selector or a new rule?)
- `&` can appear anywhere in the selector: `.dark & { }` for context-based styling

### Nesting at-rules

```css
.card {
  @media (width > 600px) {
    flex-direction: row;
  }

  @supports (display: grid) {
    display: grid;
  }

  @layer components {
    color: red;
  }
}
```

- The `&` is optional before `@media`, `@supports`, `@layer`, `@scope`, `@container` inside nesting
- These are called **conditional rules** — they wrap declarations rather than concatenating selectors

## 12. Animating State Changes

### @starting-style — Entry Animations (all major browsers)

```css
/* Animate elements when they first appear in the DOM */
@starting-style {
  .toast {
    opacity: 0;
    translate: 0 -1rem;
  }
}

.toast {
  transition: opacity 0.3s, translate 0.3s;
}

/* Works with display: none → block transitions via transition-behavior */
.modal {
  transition: opacity 0.3s, display 0.3s allow-discrete, overlay 0.3s allow-discrete;
  opacity: 1;
}

.modal[open] {
  opacity: 0;
}

@starting-style {
  .modal[open] {
    opacity: 0;
  }
}
```

- `@starting-style` defines the **before state** for elements entering the page
- Required for popover, dialog, and any element toggled with `display: none`

### transition-behavior: allow-discrete

```css
/* Enable transitions on discrete properties (display, overlay, column-count) */
.sidebar {
  transition:
    translate 0.3s,
    display 0.3s allow-discrete;    /* the magic keyword */
  translate: 0;
}

.sidebar.closed {
  display: none;
  translate: -100%;
}
```

- Without `allow-discrete`, the browser cannot animate `display: none` → `block`
- Combine with `@starting-style` for enter animations

### overlay Keyword

```css
/* Applies to top-layer elements (popover, dialog with :modal) */
.popover {
  transition:
    opacity 0.3s,
    display 0.3s allow-discrete,
    overlay 0.3s allow-discrete;    /* animate removal from top layer */
  opacity: 1;
}
```

- The `overlay` property is implicitly set on top-layer elements by the browser
- Adding `overlay` to transition declarations ensures the element is still rendered during exit animation, even after being removed from the top layer

### interpolate-size (Chromium only — use with @supports)

```css
@supports (interpolate-size: allow-keywords) {
  .accordion-panel {
    interpolate-size: allow-keywords;
    transition: height 0.3s;
    height: 0;
  }

  .accordion-panel.open { height: auto; }
}

@supports not (interpolate-size: allow-keywords) {
  /* Fallback: use max-height hack */
  .accordion-panel { overflow: hidden; transition: max-height 0.3s; max-height: 0; }
  .accordion-panel.open { max-height: 500px; }
}
```

- `interpolate-size: allow-keywords` enables animating to/from `height: auto`, `width: fit-content`, etc.
- Only in Chrome 129+. Always provide a `max-height` fallback.

## 13. Form Styling

### field-sizing — Content-Aware Form Controls (all major as of 2026)

```css
/* Auto-grow textareas and inputs based on content */
textarea, input[type="text"], select {
  field-sizing: content;
}

/* Fixed sizing (default) */
input { field-sizing: fixed; }
```

- `field-sizing: content` — the element sizes to fit its content, with `min-height`/`max-height` constraints
- Now supported in all major browsers (Chrome 123+, Safari 26.2+, Firefox 152+)
- Replaces the old JS auto-grow textarea pattern

### appearance: none — Custom Controls

```css
/* Remove native OS styling for full customization */
.custom-select {
  appearance: none;
  background: white;
  border: 1px solid oklch(80% 0.02 260);
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  background-image: url("data:image/svg+xml,...chevron...");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
}

/* Checkbox */
input[type="checkbox"].custom {
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid oklch(60% 0.1 260);
  border-radius: 0.25rem;
  display: inline-grid;
  place-items: center;
}

input[type="checkbox"].custom:checked {
  background: oklch(55% 0.2 25);
  border-color: oklch(55% 0.2 25);
}

input[type="checkbox"].custom:checked::before {
  content: "✓";
  color: white;
}
```

- `appearance: none` removes browser-default styling. You must supply your own focus, checked, disabled, and error states.
- Always include `:focus-visible` styling for custom controls
- For `<select>`, `appearance: none` does not give you full control over the dropdown popup — only the closed button

### file-selector-button

```css
/* Style the file picker button */
input[type="file"]::file-selector-button {
  background: oklch(55% 0.2 25);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}
```

### Range Input Styling

```css
input[type="range"] {
  accent-color: oklch(55% 0.2 25);
  height: 0.5rem;
  border-radius: 0.25rem;
  /* Further customization requires -webkit- / -moz- pseudo-elements */
}
```

- Use `accent-color` for a simple tint. Full custom range styling still requires browser-prefixed pseudo-elements.
- The track and thumb cannot be styled uniformly across browsers without `-webkit-slider-thumb`, `-moz-range-track`, etc.

## 14. Scroll & Visibility

### scrollbar-gutter

```css
/* Reserve space for the scrollbar even when not scrolling — prevents layout shift */
.scrollable {
  scrollbar-gutter: stable;           /* always reserve space */
  scrollbar-gutter: stable both-edges; /* reserve on both sides (centers content) */
  scrollbar-gutter: auto;             /* default — scrollbar overlays or shifts */
}
```

- **Critical for:** Any container that might overflow and toggle scrollbar visibility — prevents content reflow
- `stable` is especially important for modals and sidebars

### overscroll-behavior

```css
/* Prevent scroll chaining (e.g., scroll end on a modal scrolls the page behind) */
.modal-content {
  overscroll-behavior: contain;
}

/* Prevent pull-to-refresh on nav */
.nav {
  overscroll-behavior: none;
}
```

### scroll-snap

```css
.scroll-container {
  scroll-snap-type: x mandatory;      /* x | y | block | inline | both */
  overflow-x: auto;
  scroll-behavior: smooth;
}

.scroll-item {
  scroll-snap-align: start;           /* start | center | end */
  scroll-snap-stop: always;           /* always | normal — prevents skipping items */
}
```

- `scroll-snap-type: x mandatory` forces the container to always land on a snap point
- `scroll-snap-type: x proximity` lets the browser decide when to snap (less strict but less predictable)

### content-visibility — Render Optimization

```css
/* Skip rendering for off-screen elements — significantly improves initial load */
.section-below-fold {
  content-visibility: auto;
  contain-intrinsic-size: 600px;      /* prevents scrollbar jank */
}

/* Entirely hidden (removed from accessibility too) */
.hidden-from-render {
  content-visibility: hidden;
}
```

- `content-visibility: auto` skips layout, paint, and compositing for elements outside the viewport
- **Always** pair with `contain-intrinsic-size` to prevent scroll size from collapsing
- Testing required — measure with and without. Some layouts (especially ones relying on container query size) may break because the container has no size while off-screen.

## 15. Anchor Positioning

### Basic Setup

```css
/* Make an element a target anchor */
.trigger {
  anchor-name: --tooltip;
  /* OR the shorthand */
  anchor-name: --menu, --tooltip;  /* multiple names per element */
}

/* Position the tooltip relative to the anchor */
.tooltip {
  position: absolute;                 /* or fixed — both work */
  position-anchor: --tooltip;

  /* Placement — placed using inset-area */
  inset-area: block-end;              /* centered below the anchor */

  /* OR manual positioning */
  bottom: anchor(top);                /* .tooltip's bottom aligned to .trigger's top */
  left: anchor(center);               /* .tooltip's left centered to .trigger */

  /* Fallback if no anchor */
  top: calc(anchor(top) + 4px);
}
```

### inset-area Shorthand

```css
.tooltip {
  inset-area: top;                    /* centered above */
  inset-area: right;                  /* centered right */
  inset-area: bottom;                 /* centered below */
  inset-area: left;                   /* centered left */
  inset-area: block-end;              /* logical version of bottom */
  inset-area: inline-start;           /* logical version of left */
  inset-area: center right;           /* vertically centered, right */
  inset-area: block-start span-all;   /* spans full width above */
}
```

### position-try-fallbacks — Automatic Repositioning

```css
.tooltip {
  position-anchor: --trigger;
  inset-area: top;

  /* Try positions if tooltip overflows */
  position-try-fallbacks: flip-block,  /* flip to opposite block side */
                          flip-inline, /* flip to opposite inline side */
                          top left;    /* specific fallback position */
}
```

- `position-try-order: most-width` (or `most-height`, `most-block-size`) picks the fallback that gives the most space
- Browser tries each fallback and uses the first one that fits

### @supports Guarding

```css
@supports (anchor-name: --x) {
  .tooltip {
    position-anchor: --trigger;
    inset-area: bottom;
  }
}

/* Fallback for non-supporting browsers (Safari/Firefox older versions) */
@supports not (anchor-name: --x) {
  .tooltip {
    position: absolute;
    top: 100%;
    left: 50%;
    translate: -50% 4px;
  }
}
```

- Anchor Positioning shipped in all major engines (Chrome 125+, Safari 18+, Firefox 147+)
- Still has interop bugs in some edge cases — use `@supports` for production safety

## 16. Responsive & Environment

### Range-Syntax @media

```css
/* Modern range syntax — cleaner than min/max */
@media (width >= 768px) { }            /* 768px and wider */
@media (width < 480px) { }             /* narrower than 480px */
@media (480px <= width < 1024px) { }   /* between 480px and 1024px */
@media (height > 800px) { }            /* taller than 800px */

/* Equivalent older syntax */
@media (min-width: 768px) { }
@media (max-width: 479px) { }
@media (min-width: 480px) and (max-width: 1023px) { }
```

- Range syntax is supported in all major browsers. Prefer it for readability.

### @supports — Feature Detection

```css
/* Layer advanced features behind feature queries */
@supports (display: grid) {
  .layout { display: grid; }
}

@supports not (display: grid) {
  .layout { display: flex; flex-wrap: wrap; }
}

/* Multiple conditions */
@supports (selector(:has(a))) and (aspect-ratio: 1) {
  /* :has and aspect-ratio both supported */
}

/* Querying specific property values */
@supports (container-type: inline-size) {
  @container (min-width: 400px) { /* works */ }
}
```

- `@supports selector(...)` tests if a selector is supported — critical for `:has()`, `:focus-visible`, `:user-valid`

### User Preference Media Queries

```css
/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Dark mode (when using @media instead of light-dark()) */
@media (prefers-color-scheme: dark) {
  :root { --bg: oklch(15% 0.02 260); --text: oklch(85% 0.01 260); }
}

/* High contrast */
@media (prefers-contrast: more) {
  * { outline: 1px solid currentColor; }
}

/* Reduced transparency */
@media (prefers-reduced-transparency: reduce) {
  * { opacity: revert; backdrop-filter: none; }
}

/* Reduced data */
@media (prefers-reduced-data: reduce) {
  img { content: url("/images/placeholder.svg"); }
}
```

### Environment Variables (env())

```css
/* Safe area insets — notch/rounded corners on mobile */
body {
  padding-inline: env(safe-area-inset-left) env(safe-area-inset-right);
  padding-block: env(safe-area-inset-top) env(safe-area-inset-bottom);
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
           env(safe-area-inset-bottom) env(safe-area-inset-left);
}

/* Viewport segments — foldable devices */
.split-view {
  margin-inline-start: env(viewport-segment-left 0 0);
  margin-inline-end: env(viewport-segment-right 0 0);
}

/* Title bar area (PWA) */
.titlebar {
  padding-top: env(titlebar-area-height);
  left: env(titlebar-area-x);
}
```

### dynamic-range — Wide Color Gamut Detection

```css
/* Serve sRGB fallback, upgrade to P3 color when possible */
.splash {
  background: oklch(65% 0.15 280);          /* sRGB-safe */
}

@supports (color: oklch(65% 0.2 320)) and (dynamic-range: high) {
  .splash {
    background: oklch(65% 0.25 280);        /* P3 — wider gamut */
  }
}
```

## Progressive Enhancement Checklist

When using newer CSS features, follow this order:

1. **Build baseline** — functional layout with older CSS (float/Flexbox for Grid, `max-height` for animating `auto`, fallback colors in sRGB)
2. **Layer on enhancements** — Grid, container queries, Anchor Positioning, `field-sizing`, etc.
3. **Guard with @supports** — Feature-detect before using advanced selectors, properties, or functions
4. **Test fallback** — Verify the page is functional without the new feature
5. **Own the progressive nature** — The modern experience can be richer than the fallback. That's the point.

## Browser Support Reference

| Feature | Chrome | Safari | Firefox | Production |
|---------|--------|--------|---------|------------|
| `@layer` | 99+ | 15.4+ | 97+ | ✅ Safe |
| `@scope` | 118+ | 17.4+ | 146+ | ✅ Safe |
| `@property` | 85+ | 15.4+ | 128+ | ✅ Safe |
| `@container` | 105+ | 16+ | 110+ | ✅ Safe |
| Subgrid | 117+ | 16+ | 71+ | ✅ Safe |
| `:has()` | 105+ | 15.4+ | 121+ | ✅ Safe |
| `:focus-visible` | 86+ | 15.4+ | 85+ | ✅ Safe |
| `:user-valid` | 119+ | 17.5+ | 131+ | ✅ Safe |
| CSS nesting | 120+ | 17.2+ | 117+ | ✅ Safe |
| `@starting-style` | 117+ | 17.5+ | 129+ | ✅ Safe |
| `color-mix()` | 111+ | 16.2+ | 113+ | ✅ Safe |
| `light-dark()` | 123+ | 17.5+ | 120+ | ✅ Safe |
| `field-sizing` | 123+ | 26.2+ | 152+ | ✅ Safe |
| `text-wrap: balance` | 114+ | 17.4+ | 121+ | ✅ Safe |
| `text-box-trim` | 133+ | 18.2+ | — | ⚠️ No Firefox |
| Anchor Positioning | 125+ | 18+ | 147+ | ⚠️ Some interop bugs |
| `interpolate-size` | 129+ | — | — | ❌ Chrome only |
| `initial-letter` | 110+ (partial) | 9+ (prefixed) | — | ❌ Not cross-browser |

This file is a living reference. As browser support improves, sections guarded with `@supports` can be promoted to baseline usage.
