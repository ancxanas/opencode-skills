---
title: html-semantics

name: html-semantics
description: Write modern, semantic, accessible, and performant HTML5. Use when structuring web documents, choosing HTML elements, implementing native overlays (dialog, popover), using responsive images (picture, srcset), building forms with proper validation and autocomplete, creating Web Components, optimizing resource loading, adding SEO/OG metadata, or following current HTML Living Standard best practices.
license: MIT
compatibility: opencode
metadata:
  author: opencode
  version: "1.0.0"
  domain: frontend
  triggers: HTML, semantic HTML, HTML5, web components, custom elements, dialog, popover, details, responsive images, srcset, picture, form validation, autocomplete, Web Component, Shadow DOM, SEO, Open Graph, meta tags, HTML Living Standard, progressive enhancement, inert, focus management, lazy loading, fetchpriority, preload, landmark elements, heading hierarchy, ARIA HTML
  role: specialist
  scope: implementation
  output-format: code
  related-skills: a11y-engineer, frontend-design, css-motion-systems, tailwind-design-system, javascript-pro, secure-code-guardian
  spec-source: https://html.spec.whatwg.org/multipage/
parent: Frontend
nav_order: 8
render_with_liquid: false
---

# html-semantics

Senior HTML specialist with deep expertise in the HTML Living Standard, semantic markup, native browser APIs, accessibility-first patterns, and performance optimization.

## When to Use

- Structuring web documents with semantic landmarks and heading hierarchy
- Choosing the correct HTML element based on meaning, not appearance
- Implementing native overlays (dialog, popover, details/summary)
- Building responsive images with picture, srcset, sizes, and modern formats
- Creating accessible forms with proper labels, autocomplete, inputmode, and validation
- Writing Web Components (Custom Elements, Shadow DOM, templates/slots)
- Optimizing resource loading (preload, preconnect, fetchpriority, lazy loading)
- Adding SEO metadata (title, description, canonical, Open Graph, Twitter Cards, JSON-LD structured data)
- Managing focus (inert, tabindex, autofocus, focus management patterns)
- Working with media elements (video, audio, loading attribute, captions)
- Reviewing or auditing HTML for correctness, security, and standards compliance

## Core Principles

1. **Semantic first** — Choose elements by meaning, not appearance. `<div>` and `<span>` are fallbacks, not defaults.
2. **Accessibility by default** — Native HTML elements have built-in keyboard handling, focus management, and screen reader semantics. Use them before reaching for ARIA.
3. **Progressive enhancement** — Start with functional HTML, layer CSS for presentation, add JS for enhancement.
4. **Performance starts in `<head>`** — Preload, preconnect, defer, lazy loading, and explicit dimensions prevent layout shifts and speed up perceived load.
5. **Validate** — Run the W3C HTML validator. A document that doesn't validate will have unpredictable browser behavior.

## 1. Fundamental Structure and Semantics

### Essential `<head>` Elements

Every page gets these:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Descriptive Page Title | Site Name</title>
  <meta name="description" content="One sentence, 140-160 characters.">
  <link rel="canonical" href="https://example.com/this-page">
</head>
```

### SEO and Social Metadata

```html
<!-- Open Graph -->
<meta property="og:title" content="Title for Social Media">
<meta property="og:description" content="Description for social cards">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">

<!-- JSON-LD Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Page Title",
  "description": "Page description"
}
</script>

<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">

<!-- Theme color -->
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
```

### Landmarks and Document Structure

Use semantic landmarks for regional navigation. Screen readers expose these as jump points.

```html
<body>
  <header>  <!-- implicit role="banner" when top-level -->
    <nav aria-label="Main">
      <a href="/">Home</a>
    </nav>
  </header>

  <main>  <!-- one per page -->
    <article>
      <h1>Page Title</h1>  <!-- exactly one h1 per page -->
      <section>
        <h2>Section Heading</h2>
        <!-- content -->
      </section>
    </article>

    <aside>
      <!-- tangentially related content -->
    </aside>
  </main>

  <footer>  <!-- implicit role="contentinfo" when top-level -->
    <p>&copy; 2026 Site Name</p>
  </footer>
</body>
```

Rules:
- Exactly one `<h1>` per page or view (modal dialogs can also have an `<h1>`)
- Never skip heading levels (`<h2>` → `<h3>`, never `<h2>` → `<h4>`)
- Landmarks get `aria-label` when there are multiple of the same type (e.g., two `<nav>` elements)
- `<search>` replaces `role="search"` — use it for search/filter regions
- `<div>` is a fallback when no semantic element fits, never the default

### Semantic Choices

| Content | Use | Not |
|---------|-----|-----|
| Primary content | `<main>` | `<div class="main">` |
| Self-contained piece | `<article>` | `<div class="post">` |
| Thematic group, needs heading | `<section>` | `<div class="section">` |
| Navigation | `<nav>` | `<div class="nav">` |
| Sidebar / related | `<aside>` | `<div class="sidebar">` |
| Page/section header | `<header>` | `<div class="header">` |
| Page/section footer | `<footer>` | `<div class="footer">` |
| Click action | `<button>` | `<div onclick>` |
| URL navigation | `<a href="...">` | `<div onclick="location.href">` |
| Emphasis | `<em>` | `<span class="italic">` |
| Importance | `<strong>` | `<span class="bold">` |
| List | `<ul>` / `<ol>` / `<dl>` | `<div>` with bullets |
| Figure with caption | `<figure>` + `<figcaption>` | `<div>` with class |

## 2. Content Grouping and Attribution

### Lists

```html
<!-- Unordered: order doesn't matter -->
<ul>
  <li>Item</li>
</ul>

<!-- Ordered: order matters -->
<ol>
  <li>First step</li>
</ol>

<!-- Description list: key-value pairs -->
<dl>
  <dt>Term</dt>
  <dd>Definition</dd>
</dl>
```

### Figures

```html
<figure>
  <img src="chart.png" alt="Bar chart showing 40% growth">
  <figcaption>Q3 2025 Revenue Growth</figcaption>
</figure>
```

### Blockquotes

```html
<blockquote cite="https://example.com/source">
  <p>Quoted text here.</p>
</blockquote>
```

### Tables

```html
<table>
  <caption>2025 Sales by Quarter</caption>
  <thead>
    <tr>
      <th scope="col">Quarter</th>
      <th scope="col">Revenue</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Q1</th>
      <td>$50,000</td>
    </tr>
  </tbody>
</table>
```

DO NOT fake tables with CSS grid or flexbox — screen readers cannot navigate them as data tables.

## 3. Forms and Input

### Labels

Every form control gets a real `<label>`:

```html
<!-- Method 1: for + id -->
<label for="email">Email</label>
<input type="email" id="email" name="email" autocomplete="email">

<!-- Method 2: wrapping -->
<label>
  Name
  <input type="text" name="name" autocomplete="name">
</label>
```

### Grouping

```html
<fieldset>
  <legend>Shipping Address</legend>
  <!-- form controls -->
</fieldset>
```

### Input Types and autocomplete

Pick the type that matches the data and always set `autocomplete`:

```html
<input type="email" autocomplete="email">
<input type="tel" autocomplete="tel">
<input type="url" autocomplete="url">
<input type="number" autocomplete="cc-number">
<input type="password" autocomplete="current-password">
<input type="password" autocomplete="new-password">  <!-- registration -->
<input type="text" autocomplete="street-address">
<input type="date" autocomplete="bday">
```

Use `inputmode` to refine the keyboard without changing validation semantics:

```html
<input type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="cc-number">
<input type="text" inputmode="email" autocomplete="email">
```

### autocomplete Rules

- **DO NOT** use `autocomplete="off"` on credential, address, payment, or contact fields. Browsers and password managers ignore it by design.
- Use specific tokens: `autocomplete="email"`, `"street-address"`, `"cc-number"`, `"current-password"`, `"new-password"`, `"one-time-code"`.

### Native Validation

```html
<input type="email" required minlength="3">
<input type="text" pattern="[A-Za-z]+">
```

### Boolean Attributes

Never use redundant values with boolean attributes:

```html
<!-- DON'T -->
<input disabled="disabled">
<input required="true">

<!-- DO -->
<input disabled>
<input required>
```

### Form-associated Elements Outside a `<form>`

Use the `form` attribute to associate inputs with a form they don't descend from:

```html
<form id="checkout" method="post">
  <!-- ... -->
</form>
<input type="text" form="checkout" name="name">
```

### `<datalist>` for Suggestions

For lightweight autocomplete suggestions (note: unstylable in most browsers):

```html
<label for="browser">Choose a browser</label>
<input list="browsers" id="browser" name="browser">
<datalist id="browsers">
  <option value="Chrome">
  <option value="Firefox">
  <option value="Safari">
</datalist>
```

## 4. Native Overlays: Dialog and Popover

### `<dialog>` — Native Modal

Use `<dialog>` for modal dialogs that require user action. `showModal()` gives you:
- Automatic focus trapping
- `Escape` key dismissal
- `::backdrop` styling
- `inert` on background content
- Correct screen reader announcements

```html
<dialog id="confirm-dialog" aria-labelledby="dialog-title">
  <form method="dialog">
    <h2 id="dialog-title">Confirm Action</h2>
    <p>Are you sure?</p>
    <menu>
      <button value="cancel">Cancel</button>
      <button value="confirm" autofocus>Confirm</button>
    </menu>
  </form>
</dialog>

<button onclick="document.getElementById('confirm-dialog').showModal()">
  Open Dialog
</button>
```

```javascript
// Light-dismiss on backdrop click (with closedby="any" attribute this is native)
dialog.showModal()
```

For light-dismiss (closing on backdrop click), add the `closedby` attribute:

```html
<dialog closedby="any">  <!-- or "closes" for Escape only -->
```

- **DO** use `<form method="dialog">` to dismiss natively and return button values
- **DO** use `autofocus` on the primary action button inside dialogs
- **DON'T** use `show()` for modals where focus traps are expected — use `showModal()`
- **DON'T** call `showModal()` on an element with a `popover` attribute (mutually exclusive states)

### Popover API

Use for non-modal overlays (menus, tooltips, toasts) that don't need focus traps.

Three types:

| State | Behavior | Use Case |
|-------|----------|----------|
| `popover="auto"` (default) | Light dismiss, closes other auto popovers, responds to Esc | Dropdown menus, navigation |
| `popover="hint"` | Light dismiss, doesn't close auto popovers, closes other hints | Tooltips, help text |
| `popover="manual"` | No light dismiss, no auto-close, must toggle explicitly | Toasts, persistent overlays |

```html
<button popovertarget="menu">Open Menu</button>
<div id="menu" popover="auto">
  <ul role="menu">
    <li role="menuitem"><button>Edit</button></li>
    <li role="menuitem"><button>Delete</button></li>
  </ul>
</div>

<!-- Hint popover (tooltip) -->
<button popovertarget="tooltip1">Hover for info</button>
<div id="tooltip1" popover="hint">Additional context</div>
```

For hover/focus-triggered popovers without JavaScript, use **interest invokers**:

```html
<button interestfor="profile-card">View Profile</button>
<div id="profile-card" popover="hint">Profile details here</div>
```

CSS for interest invoker delays:
```css
#profile-card {
  interest-delay: 300ms;
  transition: opacity 0.2s;
}
```

Popover-to-dialog hybrid (combine dialog semantics with popover light-dismiss):

```html
<dialog popover="auto" id="hybrid-modal">
  <!-- dialog semantics + popover light-dismiss -->
</dialog>
```

### Invoker Commands (Experimental)

`command` and `commandfor` attributes let you invoke dialog/popover actions without JS:

```html
<button command="show-modal" commandfor="my-dialog">Open Dialog</button>
<button command="close" commandfor="my-dialog">Close</button>
<button command="show-popover" commandfor="my-popover">Show</button>
<button command="toggle-popover" commandfor="my-popover">Toggle</button>
```

### Overlay Decision Matrix

| Pattern | Element | Focus Trapped? | Backdrop? | Light-dismiss? |
|---------|---------|---------------|-----------|----------------|
| Modal dialog | `<dialog>` + `showModal()` | Yes | Yes | With `closedby="any"` |
| Non-modal dialog | `<dialog>` + `show()` | No | No | No |
| Dropdown/tooltip | `[popover="auto"]` | No | No | Yes |
| Hint/tooltip | `[popover="hint"]` | No | No | Yes |
| Toast/persistent | `[popover="manual"]` | No | No | No |
| Accordion | `<details>` | No | No | No |

## 5. Disclosures: Details and Summary

```html
<details name="faq-group">  <!-- name creates exclusive accordion group -->
  <summary>What is HTML?</summary>
  <p>HTML is the standard markup language for web documents.</p>
</details>
<details name="faq-group">
  <summary>What is CSS?</summary>
  <p>CSS is a stylesheet language for presentation.</p>
</details>
```

- `<summary>` must be the **first** child of `<details>`
- If a heading is needed inside `<details>`, wrap the heading around the summary: `<h3><summary>Title</summary></h3>`
- Style expanded state with `details[open]`
- Style contents with `details::details-content` (new CSS pseudo-element)
- **DON'T** nest links or buttons inside `<summary>` text — it acts as a button itself
- **DON'T** hide the disclosure triangle with `list-style: none` without providing directional cues via `::before`/`::after`

## 6. Images and Media

### Responsive Images

Every `<img>` gets `alt`, `width`, and `height` (prevents CLS):

```html
<img
  src="hero-800.jpg"
  srcset="
    hero-400.jpg 400w,
    hero-800.jpg 800w,
    hero-1200.jpg 1200w
  "
  sizes="(max-width: 720px) 100vw, 800px"
  width="800"
  height="450"
  alt="Descriptive text describing the image content"
  loading="lazy"   <!-- defer offscreen images -->
  decoding="async"
  fetchpriority="high"  <!-- only on LCP element -->
>
```

### `<picture>` for Art Direction and Format Switching

```html
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <source media="(max-width: 600px)" srcset="hero-mobile.jpg">
  <img src="hero.jpg" alt="Hero image" width="1200" height="600">
</picture>
```

Rules:
- **DO** use `fetchpriority="high"` on the LCP element (hero image)
- **DO** use `fetchpriority="low"` to demote non-critical items
- **DO** use `<link rel="preload" as="image" href="hero.jpg" fetchpriority="high">` for CSS background images that are LCP candidates
- **DON'T** apply `loading="lazy"` to above-the-fold or hero images (delays LCP)
- **DON'T** overuse `fetchpriority="high"` — prioritization is zero-sum

### Video and Audio

`loading="lazy"` now works on `<video>` and `<audio>` (HTML Living Standard, March 2026):

```html
<video
  controls
  width="640"
  height="360"
  poster="poster.jpg"
  loading="lazy"
  preload="none"
>
  <source src="video.mp4" type="video/mp4">
  <track src="captions.vtt" kind="captions" label="English" srclang="en">
</video>
```

- **DO** set `width` and `height` on `<video>` to prevent CLS
- **DO** provide a `poster` image fallback
- **DO** include captions with `<track kind="captions">`
- **DON'T** rely on JS for basic controls if the native `controls` attribute suffices
- Background videos: must be `muted`, omit `controls` (makes them non-focusable), and use `aria-hidden="true"` or `role="none"`

Semantic images: informative SVGs with text labels get `aria-hidden="true"` on the SVG when an adjacent text label exists. Pure decorative `<img>` gets `alt=""`. Never omit the `alt` attribute entirely.

## 7. Focus Boundaries and Visibility

### `inert` Attribute

Makes an element and all descendants non-focusable, non-interactive, and hidden from accessibility trees.

```html
<!-- Off-screen navigation panel -->
<aside inert>
  <!-- This panel is not focusable -->
</aside>

<!-- Modal-like overlay without dialog -->
<div class="overlay" inert>
  <!-- Background content while a custom modal is open -->
</div>
```

- Always pair `[inert]` with visual indication (e.g., `opacity: 0.5`)
- Native `<dialog>` with `showModal()` automatically applies `inert` to the rest of the document

### `tabindex` Rules

- **DON'T** use positive `tabindex` values (e.g., `tabindex="1"`, `tabindex="2"`)
- Use `tabindex="0"` to add a naturally non-focusable element (e.g., `<div>`) to the tab order
- Use `tabindex="-1"` to make an element programmatically focusable (via `.focus()`) but not in the tab order
- Rely on natural DOM order for sequential navigation
- **DON'T** alter visual focus order with CSS (`flex-direction: row-reverse`, `order`) without matching the DOM source order

### `autofocus`

Works on elements inside `<dialog>` and `[popover]` — the autofocus delegate is focused when the overlay opens:

```html
<dialog id="modal">
  <form method="dialog">
    <button autofocus>Confirm</button>
  </form>
</dialog>
```

### Focus Management Patterns

- Skip link as the first focusable element: `<a href="#main-content" class="skip-link">Skip to main content</a>`
- Style focus with `:focus-visible` so keyboard users see the ring but mouse users don't
- Use `node.focus({ preventScroll: true })` carefully — can hide the focused element off-screen

## 8. Web Components (Custom Elements)

### Autonomous Custom Elements (Preferred)

Customized built-in elements (`is=""`) don't work in Safari. Always use autonomous custom elements.

```javascript
class UserCard extends HTMLElement {
  static observedAttributes = ['name', 'role', 'avatar'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  render() {
    const name = this.getAttribute('name') || 'Unknown';
    const role = this.getAttribute('role') || '';
    const avatar = this.getAttribute('avatar') || '';

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font-family: system-ui; }
        .card { display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; }
        img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
      </style>
      <div class="card">
        <img src="${avatar}" alt="${name}" part="avatar">
        <div>
          <p class="name">${name}</p>
          <p class="role">${role}</p>
        </div>
      </div>
    `;
  }
}

customElements.define('user-card', UserCard);
```

```html
<user-card name="Jane Doe" role="Engineer" avatar="/photo.jpg"></user-card>
```

### Scoped Custom Element Registries

Prevent global name collisions (Safari 26.0+, Chromium 146+):

```javascript
const registry = new CustomElementRegistry();
const shadowRoot = element.attachShadow({ mode: 'open', customElementRegistry: registry });
registry.define('my-widget', MyWidget);
```

### Lifecycle Callbacks

| Callback | When |
|----------|------|
| `constructor()` | Element created. Set state, create shadow root. DON'T inspect attributes or children. |
| `connectedCallback()` | Added to document. Do setup here, not in constructor. |
| `connectedMoveCallback()` | Called instead of connected/disconnected when moved via `Element.moveBefore()`. Saves init/cleanup cycles. |
| `disconnectedCallback()` | Removed from document. Clean up. |
| `adoptedCallback()` | Moved to a new document. |
| `attributeChangedCallback(name, oldVal, newVal)` | Observed attribute changes. |

### Accessibility and Custom Elements

Use `ElementInternals` to set default ARIA semantics:

```javascript
class CustomButton extends HTMLElement {
  constructor() {
    super();
    this._internals = this.attachInternals();
    this._internals.role = 'button';
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(val) {
    if (val) {
      this.setAttribute('disabled', '');
      this._internals.ariaDisabled = 'true';
    } else {
      this.removeAttribute('disabled');
      this._internals.ariaDisabled = 'false';
    }
  }
}
```

Custom states exposed to CSS via `:state()`:

```javascript
class CollapsiblePanel extends HTMLElement {
  #collapsed = true;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  get collapsed() { return this.#collapsed; }
  set collapsed(val) {
    this.#collapsed = val;
    if (val) {
      this._internals.states.add('hidden');
    } else {
      this._internals.states.delete('hidden');
    }
  }
}
```

```css
collapsible-panel:state(hidden) { display: none; }
```

### Shadow DOM Boundaries

| Mechanism | Role |
|-----------|------|
| CSS custom properties | Inherit through boundary — prefer for theming |
| `:host` / `:host(...)` | Style the custom element itself |
| `::slotted(...)` | Style projected light DOM children |
| `::part(...)` + `exportparts` | Opt-in internal styling API |

- `:host-context(...)` is being dropped — use CSS custom properties on ancestors instead
- Put roles, names, and states on the host element when the host is the control
- Use `composed: true` on `CustomEvent` to let events escape shadow DOM

### Template and Slot

```html
<template id="my-template">
  <style>/* scoped styles */</style>
  <div part="container">
    <slot name="title">Default title</slot>
    <slot></slot>  <!-- default slot -->
  </div>
</template>
```

Declarative Shadow DOM (for SSR):

```html
<my-element>
  <template shadowrootmode="open">
    <style>/* scoped */</style>
    <slot></slot>
  </template>
  Light DOM children
</my-element>
```

**Important**: Shadow DOM breaks certain browser features that rely on cross-element DOM relationships (e.g., `<details name="...">` exclusive accordions). Prefer light DOM when those native features are needed.

## 9. Resource Prioritization and Performance

### `<head>` Loading

```html
<!-- Preload critical resources -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="hero.jpg" as="image" fetchpriority="high">

<!-- Preconnect to third-party origins -->
<link rel="preconnect" href="https://api.example.com">

<!-- Defer non-critical JS -->
<script src="app.js" defer></script>
<!-- or async for independent scripts -->
<script src="analytics.js" async></script>
```

| Attribute | Use When |
|-----------|----------|
| `defer` | Script needs DOM but not immediately; executes in order after HTML parsed |
| `async` | Standalone script (analytics, ads); executes as soon as downloaded |

### Performance Checklist

- **LCP**: Preload hero image, set `fetchpriority="high"`, don't lazy-load above-fold content
- **INP**: Keep JS off the main thread, break up long tasks
- **CLS**: Always set `width` and `height` on images and videos

## 10. Security and Link Hygiene

```html
<!-- External links: prevent tabnabbing and opener attacks -->
<a href="https://external-site.com" target="_blank" rel="noopener noreferrer">
  External Link
</a>

<!-- User-generated content links -->
<a href="https://user-content.com" rel="nofollow ugc">
  User Link
</a>

<!-- Sanitize untrusted HTML -->
<!-- Sanitizer API is now part of the HTML standard (May 2026) -->
```

- **DO** use `rel="noopener noreferrer"` on all `target="_blank"` links
- **DO** use `rel="nofollow ugc"` for user-generated link content
- **DO** use `sandbox` on iframes containing untrusted content
- **DON'T** use inline event handlers (`onclick="..."`) — use `addEventListener()` instead
- **DON'T** use `javascript:` URLs in `<a href>`
- **DON'T** use `target="_blank"` on same-origin navigations (unnecessary new tab)

## 11. Markup Quality Checklist

Every page should clear:

- [ ] `<!DOCTYPE html>` as first line
- [ ] `<html lang="...">` with correct language
- [ ] `<meta charset="utf-8">` as first `<head>` child
- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- [ ] Unique, descriptive `<title>`
- [ ] `<meta name="description">` present
- [ ] `<link rel="canonical">` present
- [ ] Single `<h1>` matching page topic
- [ ] Sequential, non-skipping heading hierarchy (h1 → h2 → h3)
- [ ] Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`)
- [ ] All `<img>` elements have `alt` and explicit `width`/`height`
- [ ] Decorative images use `alt=""`, not omitted alt
- [ ] All form controls have associated `<label>`
- [ ] `autocomplete` tokens set on appropriate inputs
- [ ] `loading="lazy"` on below-fold images and iframes
- [ ] `fetchpriority` set appropriately (high on LCP, low on trackers)
- [ ] External `target="_blank"` links have `rel="noopener noreferrer"`
- [ ] No positive `tabindex` values
- [ ] No boolean attributes with redundant values
- [ ] `<button>` for actions, `<a>` for navigation
- [ ] No inline event handlers
- [ ] Validated with W3C HTML validator

## Example: Complete Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product Landing Page | ExampleCo</title>
  <meta name="description" content="ExampleCo makes productivity tools for modern teams.">
  <link rel="canonical" href="https://example.com">

  <meta property="og:title" content="ExampleCo">
  <meta property="og:description" content="Productivity tools for modern teams.">
  <meta property="og:image" content="https://example.com/og-image.jpg">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preload" href="hero.webp" as="image" fetchpriority="high">

  <script src="app.js" defer></script>
</head>
<body>
  <header>
    <nav aria-label="Main">
      <a href="/" aria-label="Home"><svg aria-hidden="true">...</svg></a>
      <ul>
        <li><a href="/features">Features</a></li>
        <li><a href="/pricing">Pricing</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <h1>Productivity for Modern Teams</h1>

    <picture>
      <source srcset="hero.avif" type="image/avif">
      <source srcset="hero.webp" type="image/webp">
      <img src="hero.jpg" alt="Dashboard showing team collaboration" width="1200" height="600" fetchpriority="high">
    </picture>

    <section aria-labelledby="features-heading">
      <h2 id="features-heading">Features</h2>
      <ul>
        <li>Real-time collaboration</li>
        <li>Built-in analytics</li>
      </ul>
    </section>

    <section aria-labelledby="pricing-heading">
      <h2 id="pricing-heading">Pricing</h2>
      <!-- pricing cards -->
    </section>
  </main>

  <footer>
    <small>&copy; 2026 ExampleCo. All rights reserved.</small>
  </footer>
</body>
</html>
```
