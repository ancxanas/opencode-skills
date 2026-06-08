---
title: a11y-engineer

name: a11y-engineer
description: Implement and audit web accessibility (WCAG 2.1/2.2). Use when adding ARIA attributes, ensuring keyboard navigation, auditing color contrast, fixing focus management, testing with screen readers, or meeting accessibility compliance requirements.
license: MIT
compatibility: opencode
metadata:
  author: opencode
  version: "1.0.0"
  domain: frontend
  triggers: a11y, accessibility, WCAG, ARIA, screen reader, keyboard navigation, focus management, color contrast, axe-core, Lighthouse accessibility, assistive technology, 508 compliance, ADA compliance, accessibility audit
  role: specialist
  scope: implementation
  output-format: code
  related-skills: frontend-design, react-expert, vue-expert, angular-architect, test-master, css-motion-systems
  spec-source: https://www.w3.org/TR/WCAG22/
parent: Frontend
nav_order: 1
render_with_liquid: false
---
{% raw %}


# a11y Engineer

Senior accessibility engineer with deep expertise in WCAG compliance, ARIA patterns, assistive technology support, and inclusive design.

## When to Use

- Auditing or fixing web accessibility issues
- Adding ARIA attributes to custom components
- Ensuring keyboard navigation works throughout an app
- Fixing color contrast ratios for WCAG AA/AAA
- Managing focus order and focus visibility
- Testing with screen readers (VoiceOver, NVDA, JAWS)
- Meeting compliance requirements (ADA, Section 508, EN 301 549)

## When NOT to Use

- Native platform accessibility (iOS, Android) — use platform-specific skills
- Document accessibility (PDF, DOCX) — use document skills
- Physical accessibility or hardware

## WCAG Levels

| Level | Requirement | Target |
|-------|-------------|--------|
| **A** | Minimum — essential barriers removed | All content must pass |
| **AA** | Standard — most common legal target | Industry standard |
| **AAA** | Advanced — enhanced usability | Nice-to-have, not always achievable |

Prioritize AA compliance for production applications.

## ARIA Patterns

### Landmarks

```html
<header role="banner">
<nav role="navigation" aria-label="Main">
<main role="main">
<aside role="complementary">
<footer role="contentinfo">
```

Use semantic HTML elements before ARIA roles. ARIA is only needed when HTML semantics are insufficient.

### Live Regions

```html
<div role="status" aria-live="polite">
  <!-- Dynamic updates read on idle -->
</div>

<div role="alert" aria-live="assertive">
  <!-- Critical updates read immediately -->
</div>
```

### Dialog

```html
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Deletion</h2>
  <button onClick={closeDialog}>Cancel</button>
  <button onClick={confirm}>Delete</button>
</div>
```

Focus trap within dialog. Return focus to trigger element on close.

### Tabs

```html
<div role="tablist" aria-label="Settings">
  <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1">General</button>
  <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2">Advanced</button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">...</div>
<div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>...</div>
```

Keyboard: Arrow keys switch tabs, Tab moves into active tabpanel.

## Focus Management

### Focus Order

Tab order must follow logical reading order. Avoid:

```html
<!-- Bad: tabindex creates unexpected order -->
<div tabindex="1">First</div>
<div tabindex="3">Third</div>
<div tabindex="2">Second</div>
```

Use `tabindex="0"` for interactive elements, `tabindex="-1"` for programmatic focus, `tabindex > 0` almost never.

### Focus Trap

```typescript
function useFocusTrap(containerRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const focusable = container.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0] as HTMLElement;
    const last = focusable[focusable.length - 1] as HTMLElement;

    function handleTab(e: KeyboardEvent) {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    container.addEventListener('keydown', handleTab);
    first.focus();
    return () => container.removeEventListener('keydown', handleTab);
  }, []);
}
```

### Focus Indicators

Never remove `:focus` outlines globally. Use `:focus-visible` to show focus only for keyboard users:

```css
/* Works in modern browsers */
:focus:not(:focus-visible) {
  outline: none;
}
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

## Color Contrast

### Minimum Ratios

| Level | Normal text | Large text (18px+ bold or 24px+) | UI components |
|-------|-------------|----------------------------------|---------------|
| **AA** | 4.5:1 | 3:1 | 3:1 |
| **AAA** | 7:1 | 4.5:1 | — |

### Tools

- **axe-core**: Automated testing in CI
- **Lighthouse**: Built-in DevTools audit
- **Contrast Ratio**: Manual check (https://contrast-ratio.com)
- **Colour Oracle**: Simulate color blindness

### What to Check

- Text on background
- Placeholder text (must meet 4.5:1 against background)
- Focus indicators
- Error states (not just color — add icon + text)
- Link text in paragraphs
- Disabled states (reduce opacity but keep minimum contrast)

## Keyboard Navigation

### Required Patterns

| Pattern | Keys |
|---------|------|
| Navigation | Tab / Shift+Tab |
| Buttons/links | Enter |
| Select/menu | Space |
| Radio group | Arrow keys |
| Slider | Arrow keys + Home/End |
| Tree view | Arrow keys + Enter |
| Grid | Arrow keys + Ctrl+Arrow for cell-to-cell |

### Skip Links

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

Visible on focus, hidden otherwise. Should be first focusable element.

## Screen Reader Testing

### Setup

| Screen Reader | Platform | Key commands |
|--------------|----------|--------------|
| **VoiceOver** | macOS/iOS | Cmd+F5 toggle, Ctrl+Option+arrows navigate |
| **NVDA** | Windows | Insert+arrows navigate |
| **JAWS** | Windows | Insert+arrows navigate |

### Test Checklist

- [ ] All content is reachable via Tab / arrow keys
- [ ] Images have meaningful `alt` text (or `alt=""` for decorative)
- [ ] Forms have associated `<label>` elements
- [ ] Error messages are announced (use `aria-describedby` or `role="alert"`)
- [ ] Dynamic content changes are announced (use `aria-live`)
- [ ] Custom components function with expected ARIA patterns
- [ ] PDFs have readable text layer (not scanned images)

## Automated Auditing

### axe-core (CI integration)

```bash
npx axe --exit --show-errors --dir ./report http://localhost:3000
```

### Lighthouse CI

```bash
npx lhci autorun --collect.url=http://localhost:3000
```

### ESLint Plugin

```json
{
  "extends": ["plugin:jsx-a11y/recommended"]
}
```

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Ensure state changes remain clear even without animation. See css-motion-systems skill for detailed motion guidance.

{% endraw %}
