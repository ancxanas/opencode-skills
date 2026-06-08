------
{% raw %}
-----|---------------|
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

{% endraw %}
