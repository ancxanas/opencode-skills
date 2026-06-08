# Modern CSS Properties Quick Reference

## Layout

| Property | Module | Description |
|----------|--------|-------------|
| `display: flex` | [CSS Flexbox](https://www.w3.org/TR/css-flexbox-1/) | One-dimensional layout |
| `display: grid` | [CSS Grid](https://www.w3.org/TR/css-grid-1/) | Two-dimensional layout |
| `display: subgrid` | [CSS Grid 2](https://www.w3.org/TR/css-grid-2/) | Inherit parent grid tracks |
| `gap`, `row-gap`, `column-gap` | [Box Alignment](https://www.w3.org/TR/css-align-3/) | Spacing between items |
| `grid-template-rows/cols: subgrid` | CSS Grid 2 | Pass through tracks |
| `container-type`, `container-name` | [Containment 3](https://www.w3.org/TR/css-contain-3/) | Container queries |
| `@container` | Containment 3 | Query container size/style |

## Cascade & Specificity

| Property / At-rule | Module | Description |
|--------------------|--------|-------------|
| `@layer` | [Cascade 5](https://www.w3.org/TR/css-cascade-5/) | Explicit cascade layers |
| `@scope` | [CSS Nesting](https://www.w3.org/TR/css-nesting-1/) | Scoped styles with lower/upper boundaries |
| `:where()` | [Selectors 4](https://www.w3.org/TR/selectors-4/) | Zero-specificity selector |
| `:is()` | Selectors 4 | Forgiving selector list (highest specificity) |
| `:has()` | Selectors 4 | Parent selector |

## Color & Theming

| Property / Function | Module | Description |
|---------------------|--------|-------------|
| `oklch()` | [Color 4](https://www.w3.org/TR/css-color-4/) | Perceptually uniform color space |
| `oklab()` | Color 4 | Same as OKLCH, Cartesian |
| `color-mix()` | [Color 5](https://www.w3.org/TR/css-color-5/) | Mix two colors in any space |
| `light-dark()` | [Color 6](https://www.w3.org/TR/css-color-6/) | Light/dark value pair |
| `color-scheme` | [Color Adjustment](https://www.w3.org/TR/css-color-adjust-1/) | Opt into OS color scheme |
| `@property` | [Properties & Values](https://www.w3.org/TR/css-properties-values-api-1/) | Typed custom properties (Houdini) |
| `--custom: value` | Custom Properties | CSS variables (live in cascade) |

## Typography

| Property | Module | Description |
|----------|--------|-------------|
| `text-wrap: balance` | [Text 4](https://www.w3.org/TR/css-text-4/) | Balanced line breaks (headings) |
| `text-wrap: pretty` | Text 4 | Avoid orphaned words |
| `text-box-trim` | [Inline Layout 3](https://www.w3.org/TR/css-inline-3/) | Trim leading/baseline space |
| `font-size: clamp(...)` | CSS Values | Fluid typography |
| `@font-tech` | [Fonts 5](https://www.w3.org/TR/css-fonts-5/) | Font technology selection |

## Animations & Transitions

| Property / At-rule | Module | Description |
|---------------------|--------|-------------|
| `@starting-style` | [CSS Transitions 2](https://www.w3.org/TR/css-transitions-2/) | Entry animations for `display: none` → block |
| `transition-behavior: allow-discrete` | CSS Transitions 2 | Animate discrete properties |
| `overlay` | CSS Transitions 2 | Animate top-layer exit |
| `view-transition-name` | [View Transitions](https://www.w3.org/TR/css-view-transitions-1/) | SPA view transitions |

## Forms & Interaction

| Property | Module | Description |
|----------|--------|-------------|
| `field-sizing: content` | [CSS UI 4](https://www.w3.org/TR/css-ui-4/) | Auto-resize textareas |
| `accent-color` | CSS UI 4 | Theme form controls |
| `scrollbar-gutter` | [Scrollbars](https://www.w3.org/TR/css-scrollbars-1/) | Reserve scrollbar space |
| `content-visibility` | [Containment 2](https://www.w3.org/TR/css-contain-2/) | Lazy render off-screen |
| `interpolate-size` | (draft) | Allow/all keyword for animation to `auto` |

## Anchor Positioning

| Property | Module | Description |
|----------|--------|-------------|
| `anchor-name` | [Anchor Positioning](https://www.w3.org/TR/css-anchor-position-1/) | Name an anchor element |
| `position-anchor` | Anchor Positioning | Attach to anchor |
| `anchor()` | Anchor Positioning | Position relative to anchor |
| `anchor-size()` | Anchor Positioning | Size relative to anchor |
| `@position-try` | Anchor Positioning | Fallback positions |
| `position-try-options` | Anchor Positioning | Try alternate positions |

## Selectors (Modern)
| Selector | Works | Use For |
|----------|-------|---------|
| `:focus-visible` | All modern | Keyboard focus only |
| `:user-invalid` | Chrome, FF | After user interaction |
| `:user-valid` | Chrome, FF | After user interaction |
| `:has(>` | All modern | Direct children |
| `:has(+ sibling)` | All modern | Adjacent sibling |
| `::target-text` | Chrome, FF | Text fragment highlight |
