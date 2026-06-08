---
title: i18n-engineer

name: i18n-engineer
description: Internationalize and localize web and mobile applications. Use when adding multi-language support, translating UI strings, implementing RTL layouts, managing locale files, configuring ICU message formatting, or setting up i18n frameworks like react-i18next, FormatJS, vue-i18n, next-intl, or Lingui.
license: MIT
compatibility: opencode
metadata:
  author: opencode
  version: "1.0.0"
  domain: frontend
  triggers: i18n, l10n, internationalization, localization, translation, RTL, ICU messages, locale, multi-language, react-i18next, FormatJS, vue-i18n, next-intl, Lingui, gettext, i18next, pluralization, language switcher, i18n routing
  role: specialist
  scope: implementation
  output-format: code
  related-skills: frontend-design, nextjs-developer, react-expert, vue-expert, swift-expert, flutter-expert
parent: Frontend
nav_order: 9
render_with_liquid: false
---
{% raw %}


# i18n Engineer

Senior internationalization engineer with deep expertise in multi-language web and mobile application architecture.

## When to Use

- Adding multi-language support to a web or mobile app
- Configuring i18n frameworks (react-i18next, next-intl, vue-i18n, FormatJS, Lingui)
- Implementing locale detection, switching, and persistence
- Formatting dates, numbers, currencies, and plurals with ICU messages
- Building RTL layout support alongside existing LTR styles
- Managing translation files, namespacing, and translation workflows
- Setting up SEO for multi-language sites (hreflang, localized sitemaps)

## When NOT to Use

- Simple single-language text formatting — use native APIs
- Building a brand-new i18n framework from scratch
- Machine translation workflow design (separate from implementation)

## Framework Selection

| Framework | Best for | Notes |
|-----------|----------|-------|
| **react-i18next** | React / Next.js | Mature, extensible, large ecosystem |
| **next-intl** | Next.js App Router | Built for RSC, server components, and App Router |
| **vue-i18n** | Vue 3 / Nuxt | Official Vue solution, Composition API support |
| **FormatJS** | React, generic JS | Lower-level, Intel project, ICU message syntax |
| **Lingui** | React / generic JS | Compile-time extraction, smaller bundle |
| **gettext** | Python, PHP, legacy | Traditional .po/.mo workflow |

## Locale File Management

### File Structure

```
locales/
  en/
    common.json
    settings.json
    checkout.json
  es/
    common.json
    settings.json
    checkout.json
  fr/
    common.json
    settings.json
    checkout.json
```

### Namespacing Strategy

- `common` — shared UI (buttons, labels, nav, errors)
- `routes/[page]` — page-specific strings
- `validation` — form validation messages
- `email` — transactional email templates

Keep namespaces coarse enough to avoid file sprawl but fine enough to avoid merge conflicts.

## ICU Message Syntax

### Simple

```
Hello {name}
```

### Plural

```
{count, plural, one {# item} other {# items}}
```

### Select

```
{gender, select, male {He} female {She} other {They}} invited you.
```

### Number / Date

```
{price, number, ::currency/USD}
{createdAt, date, ::yyyyMMdd}
```

### Nesting

```
{count, plural, one {{brand} has # new message} other {{brand} has # new messages}}
```

## RTL Layout Strategy

### CSS Logical Properties (preferred)

```css
/* Instead of: */
margin-left: 8px;
padding-right: 16px;
border-left: 1px solid;

/* Use: */
margin-inline-start: 8px;
padding-inline-end: 16px;
border-inline-start: 1px solid;
```

### dir Attribute

Set `dir` on `<html>` element — never use CSS-based RTL detection alone.

```javascript
document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
```

### Framework RTL

- **Tailwind**: `ltr:` and `rtl:` prefixes, `ps-*` / `pe-*` logical padding
- **Bootstrap**: Built-in RTL via `$enable-rtl`
- **Material UI**: `createTheme({ direction: 'rtl' })` + jss-rtl plugin

## Locale Detection & Persistence

### Priority Order

1. User preference saved in account settings (server-side)
2. URL path prefix (`/es/products`, `/fr/products`)
3. Subdomain (`es.example.com`)
4. Cookie from previous session
5. `Accept-Language` header
6. Browser default

### Routed Locale (Next.js example)

```typescript
// middleware.ts
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

const locales = ['en', 'es', 'fr', 'ar'];
const defaultLocale = 'en';

function getLocale(request: Request): string {
  const headers = { 'accept-language': request.headers.get('accept-language') || '' };
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}
```

## Lazy Loading

Load locale files on demand — never bundle all translations:

```typescript
// react-i18next
i18next.loadNamespaces(['checkout'], (err, t) => {
  // namespace loaded
});
```

## Translation Workflow

- Extract: Scan code for i18n keys → generate template file
- Translate: Send template to translators (POEditor, Lokalise, Crowdin)
- Import: Convert translated files back to JSON
- Validate: Check for missing keys, mismatched placeholders

```bash
# Extract keys with Lingui
lingui extract

# Compile to runtime messages
lingui compile
```

## SEO

### hreflang Tags

```html
<link rel="alternate" hreflang="en" href="https://example.com/en/products" />
<link rel="alternate" hreflang="es" href="https://example.com/es/products" />
<link rel="alternate" hreflang="x-default" href="https://example.com/products" />
```

### Localized Sitemaps

```xml
<urlset>
  <url>
    <loc>https://example.com/en/products</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/products" />
    <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/products" />
  </url>
</urlset>
```

### Canonical URLs

Always self-referencing canonical pointing to the localized URL:

```html
<link rel="canonical" href="https://example.com/es/products" />
```

## Testing i18n

- Set locale to each supported language and verify layout
- Test with pseudolocale (e.g. `en-XA`) to catch hardcoded strings
- Verify RTL rendering with long Arabic strings
- Check truncated text at maximum string expansion (German can be 30%+ longer than English)
- Validate number/date formatting per locale (`new Intl.DateTimeFormat('de-DE')`)

{% endraw %}
