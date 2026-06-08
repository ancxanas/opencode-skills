# View Transitions API Recipes

Production patterns for same-document and cross-document view transitions.

## Same-Document Transitions

### List to Detail

```css
/* Shared element: the item transitioning from list to detail */
.card-${id} {
  view-transition-name: card-${id};
}
```

```css
/* Entry animation: content fades up */
::view-transition-new(root) {
  animation: fade-up 250ms ease-out;
}
```

### Tab Switch

Give each tab panel a unique `view-transition-name`:

```css
.tab-panel {
  view-transition-name: tab-panel;
}
```

For independent entry/exit animation per panel, use separate names.

### Accordion Open/Close

No shared element naming needed — wrap toggle in `document.startViewTransition()`:

```javascript
document.startViewTransition(() => {
  panel.classList.toggle('open');
});
```

The default crossfade is usually sufficient. Add `height` animation if smoother expansion is needed.

## Cross-Document (MPA) Transitions

### Setup

```css
@view-transition {
  navigation: auto;
}
```

### Shared Element Across Pages

Consistent `view-transition-name` across navigations creates seamless continuity:

```css
/* Same class on the header element on every page */
.site-header {
  view-transition-name: site-header;
}

.main-nav {
  view-transition-name: main-nav;
}
```

### Entry/Exit Animations

```css
/* Page content slides */
::view-transition-old(root) {
  animation: slide-out-left 250ms ease-in;
}
::view-transition-new(root) {
  animation: slide-in-right 250ms ease-out;
}
```

## Fallback Strategy

```javascript
if (!document.startViewTransition) {
  // Apply state change directly — no transition
  updateDOM();
} else {
  document.startViewTransition(() => updateDOM());
}
```

For cross-document, feature-detect with:

```css
@supports (view-transition-name: none) {
  @view-transition { navigation: auto; }
}
```

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 0.01ms !important;
  }
}
```

## Reference

- [MDN: View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
- [W3C CSS View Transitions Level 1](https://www.w3.org/TR/css-view-transitions-1/)
