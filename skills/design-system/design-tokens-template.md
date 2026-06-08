------
{% raw %}
--|---------|---------|
| `color` | All color tokens | `color-brand-primary` |
| `spacing` | Margin, padding, gap | `spacing-md` |
| `typography` | Font families, sizes, weights | `typography-size-lg` |
| `border` | Width, radius, style | `border-radius-sm` |
| `shadow` | Box shadows, elevation | `shadow-lg` |
| `opacity` | Transparency levels | `opacity-disabled` |
| `z-index` | Stacking order | `z-index-modal` |
| `animation` | Duration, easing | `animation-duration-fast` |
| `breakpoint` | Responsive breakpoints | `breakpoint-md` |
| `size` | Sizing (width, height) | `size-icon` |

## Token Hierarchy

### 1. Brand Tokens (raw values)
```css
--color-brand-blue: #0066CC;
--color-brand-green: #00AA55;
--spacing-unit: 4px;
--font-primary: "Inter", system-ui, sans-serif;
```

### 2. Semantic Tokens (purpose-mapped)
```css
--color-primary: var(--color-brand-blue);
--color-success: var(--color-brand-green);
--color-danger: var(--color-brand-red);
--spacing-inset-sm: calc(var(--spacing-unit) * 2);
--spacing-stack-md: calc(var(--spacing-unit) * 4);
```

### 3. Component Tokens (component-scoped)
```css
--button-bg: var(--color-primary);
--button-text: var(--color-text-inverse);
--button-padding: var(--spacing-inset-sm) var(--spacing-inset-md);
--card-radius: var(--border-radius-md);
--card-shadow: var(--shadow-sm);
```

## Tailwind v4 @theme Format
```css
/* app.css */
@import "tailwindcss";

@theme {
  /* Brand tokens */
  --color-brand-blue: #0066CC;
  --color-brand-green: #00AA55;

  /* Semantic tokens */
  --color-primary: var(--color-brand-blue);
  --color-success: var(--color-brand-green);

  /* Spacing scale */
  --spacing-xs: 2px;
  --spacing-sm: 4px;
  --spacing-md: 8px;
  --spacing-lg: 16px;
  --spacing-xl: 32px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

  /* Animations */
  --animate-fade-in: fade-in 0.2s ease-out;
  --animate-slide-up: slide-up 0.3s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { transform: translateY(8px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

## Typical Spacing Scale
| Token | Value | Common Use |
|-------|-------|------------|
| `spacing-xxs` | 2px | Fine adjustments |
| `spacing-xs` | 4px | Tight icon spacing |
| `spacing-sm` | 8px | Inset padding (tight), form field gaps |
| `spacing-md` | 12px | Button padding, card padding |
| `spacing-lg` | 16px | Section padding, card margin |
| `spacing-xl` | 24px | Page section gaps |
| `spacing-2xl` | 32px | Component groups |
| `spacing-3xl` | 48px | Page sections |
| `spacing-4xl` | 64px | Hero spacing |

## Typography Scale (modular)
```css
--typography-size-xs: 0.75rem;   /* 12px */
--typography-size-sm: 0.875rem;  /* 14px */
--typography-size-base: 1rem;     /* 16px */
--typography-size-lg: 1.125rem;   /* 18px */
--typography-size-xl: 1.25rem;    /* 20px */
--typography-size-2xl: 1.5rem;    /* 24px */
--typography-size-3xl: 1.875rem;  /* 30px */
--typography-size-4xl: 2.25rem;   /* 36px */
--typography-size-5xl: 3rem;      /* 48px */
--typography-size-6xl: 3.75rem;   /* 60px */
```

## Color Token Organization
```
color-{role}-{variant}-{strength}
```
- Roles: brand, primary, secondary, neutral, success, warning, danger, info
- Variants: bg, text, border, icon
- Strengths (for neutral): 50, 100, 200, ..., 900, 950

{% endraw %}
