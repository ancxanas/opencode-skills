# Linear Easing Patterns

Use `linear()` for piecewise velocity control — custom motion signatures that `cubic-bezier()` cannot produce.

## When to Use `linear()` over `cubic-bezier()`

- Multi-phase motion (bounce, spring-like overshoot, elastic)
- Constant-speed segments with abrupt direction changes
- Staggered step effects within a single animation
- Precise midpoint control at specific percentage points

## Common Patterns

### 1. Overshoot (slight bounce at end)

```css
/* Ease-in with a small overshoot flick at 80% */
animation: slide-in 300ms linear(--overshoot);
@keyframes slide-in {
  from { translate: -100% 0; }
  to   { translate: 0 0; }
}
```

```
linear(0, 0.003 8%, 0.013 15.5%, 0.029 22%, 0.052 28%, 0.082 33.5%, 0.286 48%, 0.396 53.5%, 0.517 58.5%, 0.644 63%, 0.772 67.5%, 0.898 72%, 1 76.5%, 1.031 81%, 1.03 84.5%, 1.008 88%, 0.999 91.5%, 0.998 95%, 1 100%)
```

This creates a subtle spring-like settle at the end of the motion.

### 2. Snap (rapid advance + settle)

```css
/* Quick advance to 80%, then settle into final position */
animation: snap-in 200ms linear(--snap);
```

```
linear(0, 0.3 10%, 0.7 20%, 0.9 27%, 0.95 32%, 0.98 37%, 0.995 44%, 1 52%, 1.015 58%, 1.01 63%, 1.002 70%, 0.999 78%, 0.998 86%, 0.999 93%, 1 100%)
```

Use for menu open, toast appear, tooltip reveal.

### 3. Bounce (multiple rebounds)

```css
/* Repeating bounce settle */
animation: bounce-in 400ms linear(--bounce);
```

```
linear(0, 0.004 4%, 0.016 8%, 0.035 11.5%, 0.063 15%, 0.116 19%, 0.197 23%, 0.302 27%, 0.425 30.5%, 0.561 34%, 0.703 37.5%, 0.844 41%, 1 46%, 0.968 49%, 1.013 52%, 0.988 55%, 1.002 58%, 0.998 61%, 1 64%, 1.001 68%, 1 72% ... )
```

Reserve for playful UIs. Avoid in productivity/tool contexts.

### 4. Anticipation (pull back before spring forward)

```css
/* Pull back 10%, then spring forward */
animation: anticipate 350ms linear(--anticipate);
```

```
linear(0, -0.05 15%, -0.09 25%, -0.07 30%, 0 38%, 0.3 48%, 0.65 56%, 0.87 62%, 0.96 67%, 0.995 72%, 1 77%, 1.01 82%, 1.005 87%, 1 92%, 1 100%)
```

Use for drawer open, sheet reveal, element entering from off-screen.

## Testing Checklist

- [ ] Does not cause motion sickness (keep overshoot < 10%)
- [ ] Reduced motion override present (`prefers-reduced-motion: reduce`)
- [ ] Works at both fast and slow durations (duration + 200% test)
- [ ] Does not flash or flicker on low-end devices

## Reference

- [W3C CSS Easing Level 2: `linear()` function](https://www.w3.org/TR/css-easing-2/#the-linear-easing-function)
- [MDN: `linear()` easing](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function#linear_easing_function)
