# Tailwind v4 @theme Token Reference

## @theme Directives

```css
/* app.css */
@import "tailwindcss";
```

### Theme Variable Convention
```css
@theme {
  /* Override any default Tailwind token */
  --color-primary: #0066CC;
  --font-family-sans: "Inter", system-ui, sans-serif;

  /* Extend with custom tokens — available as: bg-primary, font-sans */
}
```

## Common Token Overrides

### Colors
```css
@theme {
  --color-brand-50: #eff6ff;
  --color-brand-100: #dbeafe;
  --color-brand-200: #bfdbfe;
  --color-brand-300: #93c5fd;
  --color-brand-400: #60a5fa;
  --color-brand-500: #3b82f6;
  --color-brand-600: #2563eb;
  --color-brand-700: #1d4ed8;
  --color-brand-800: #1e40af;
  --color-brand-900: #1e3a8a;
  --color-brand-950: #172554;
}
```

### Typography
```css
@theme {
  --font-family-sans: "Inter", system-ui, sans-serif;
  --font-family-mono: "JetBrains Mono", "Fira Code", monospace;

  --font-size-xs: 0.75rem;
  --font-size-xs--line-height: 1rem;
  --font-size-sm: 0.875rem;
  --font-size-sm--line-height: 1.25rem;
  --font-size-base: 1rem;
  --font-size-base--line-height: 1.5rem;
  --font-size-lg: 1.125rem;
  --font-size-lg--line-height: 1.75rem;
  --font-size-xl: 1.25rem;
  --font-size-xl--line-height: 1.75rem;
  --font-size-2xl: 1.5rem;
  --font-size-2xl--line-height: 2rem;
  --font-size-3xl: 1.875rem;
  --font-size-3xl--line-height: 2.25rem;
  --font-size-4xl: 2.25rem;
  --font-size-4xl--line-height: 2.5rem;
  --font-size-5xl: 3rem;
  --font-size-5xl--line-height: 1.16;
  --font-size-6xl: 3.75rem;
  --font-size-6xl--line-height: 1;
  --font-size-7xl: 4.5rem;
  --font-size-7xl--line-height: 1;
  --font-size-8xl: 6rem;
  --font-size-8xl--line-height: 1;
  --font-size-9xl: 8rem;
  --font-size-9xl--line-height: 1;
}
```

### Spacing
```css
@theme {
  --spacing-unit: 4px;
  --spacing-xs: calc(var(--spacing-unit) * 1);    /* 4px  */
  --spacing-sm: calc(var(--spacing-unit) * 2);     /* 8px  */
  --spacing-md: calc(var(--spacing-unit) * 3);     /* 12px */
  --spacing-lg: calc(var(--spacing-unit) * 4);     /* 16px */
  --spacing-xl: calc(var(--spacing-unit) * 6);     /* 24px */
  --spacing-2xl: calc(var(--spacing-unit) * 8);    /* 32px */
  --spacing-3xl: calc(var(--spacing-unit) * 12);   /* 48px */
  --spacing-4xl: calc(var(--spacing-unit) * 16);   /* 64px */
  --spacing-5xl: calc(var(--spacing-unit) * 24);   /* 96px */
}
```

### Shadows
```css
@theme {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

### Border Radius
```css
@theme {
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
}
```

## Key v3 → v4 Migration

| v3 Config | v4 Equivalent |
|-----------|---------------|
| `theme.extend.colors` | `@theme { --color-* }` |
| `tailwind.config.js` | `app.css` with `@theme` |
| `darkMode: "class"` | Default (class-based) |
| `@apply` with `!important` | `@apply` uses specificity, not `!important` |
| `@layer utilities { ... }` | `@utility` directive |
| Plugins | `@plugin` directive or import |
| Variants (`hover:`, `focus:`) | No change — same as v3 |
| Arbitrary values `w-[30px]` | Same syntax |

## Utility Classes to Remember
| Category | Class | Output |
|----------|-------|--------|
| Container | `container` | `width: 100%` + breakpoint max-width |
| Aspect ratio | `aspect-square` | `aspect-ratio: 1 / 1` |
| Overscroll | `overscroll-contain` | `overscroll-behavior: contain` |
| Pointer events | `pointer-events-none` | `pointer-events: none` |
| Touch action | `touch-pan-y` | `touch-action: pan-y` |
| User select | `select-none` | `user-select: none` |
| Scroll behavior | `scroll-smooth` | `scroll-behavior: smooth` |
| Forced color adjust | `forced-color-adjust-auto` | `forced-color-adjust: auto` |
