------
{% raw %}
---|---------|----------|-------|
| `<html>` | Root element | — | `lang` attribute required |
| `<head>` | Metadata container | — | |
| `<body>` | Content container | — | |

## Metadata

| Element | Purpose | Notes |
|---------|---------|-------|
| `<title>` | Page title (SEO + a11y critical) | Required. Unique per page. 50-60 chars |
| `<base>` | Base URL for relative links | One per document |
| `<link>` | External resources | `rel="stylesheet"`, `rel="icon"`, `rel="preload"`, `rel="canonical"` |
| `<meta>` | Metadata | charset, viewport, description, OG |
| `<style>` | Embedded CSS | Prefer external stylesheets |
| `<script>` | JavaScript | `defer` or `type="module"` for blocking avoidance |

## Sections

| Element | Implicit Role | Heading Required? | Notes |
|---------|---------------|-------------------|-------|
| `<body>` | `document` | No | |
| `<article>` | `article` | Yes | Self-contained composition |
| `<section>` | `region` | Yes | Thematic grouping |
| `<nav>` | `navigation` | Yes (can be hidden) | Site nav, table of contents |
| `<aside>` | `complementary` | Yes | Sidebar, related content |
| `<h1>`–`<h6>` | `heading` | N/A | Never skip levels. One `<h1>` per page (typically) |
| `<header>` | `banner` (if top-level) | No | Intro / nav container |
| `<footer>` | `contentinfo` (if top-level) | No | Author, copyright, links |
| `<main>` | `main` | No | One per page. Skip-link target |
| `<address>` | — | No | Contact info for the article |

## Grouping

| Element | Purpose | Notes |
|---------|---------|-------|
| `<p>` | Paragraph | |
| `<hr>` | Thematic break | Screen reader announces as break |
| `<pre>` | Preformatted text | Preserves whitespace |
| `<blockquote>` | Block quotation | `cite` attribute for source |
| `<ol>` | Ordered list | `type`, `start`, `reversed` |
| `<ul>` | Unordered list | |
| `<li>` | List item | |
| `<dl>` | Description list | |
| `<dt>` | Term in description list | |
| `<dd>` | Definition in description list | |
| `<figure>` | Self-contained content | `figcaption` as child |
| `<figcaption>` | Figure caption | |
| `<div>` | Generic container | **Last resort** — no semantic meaning |
| `<template>` | Declarative fragments | Not rendered; content cloned via JS |
| `<slot>` | Shadow DOM insertion point | |

## Text

| Element | Semantic Meaning | Visual | Use |
|---------|-----------------|--------|-----|
| `<a>` | Hyperlink | Underlined | Navigation |
| `<em>` | Stress emphasis | Italic | Changed meaning if read differently |
| `<strong>` | Importance | Bold | Serious importance |
| `<small>` | Side comments | Smaller | Legalese, disclaimers |
| `<s>` | No longer accurate | Strikethrough | |
| `<cite>` | Creative work title | Italic | |
| `<q>` | Inline quotation | Quotes | |
| `<dfn>` | Defining instance | Italic | |
| `<abbr>` | Abbreviation | Dotted underline | `title` for expansion |
| `<ruby>`, `<rt>`, `<rp>` | Ruby annotation | | CJK annotations |
| `<data>` | Machine-readable | None | `value` attribute |
| `<time>` | Date/time | None | `datetime` for machine |
| `<code>` | Code fragment | Monospace | |
| `<var>` | Variable | Italic | |
| `<samp>` | Sample output | Monospace | |
| `<kbd>` | Keyboard input | Monospace | |
| `<sub>` / `<sup>` | Subscript / superscript | Sub/superscript | |
| `<i>` | Alternative voice | Italic | Last resort for italic |
| `<b>` | Stylistic offset | Bold | Last resort for bold |
| `<u>` | Unarticulated annotation | Underline | Avoid — confusion with links |
| `<mark>` | Highlighted text | Yellow BG | Search results, relevance |
| `<span>` | Inline container | None | **Last resort** — no meaning |

## Embedded

| Element | Purpose | Notes |
|---------|---------|-------|
| `<picture>` | Responsive images | `<source>` children with media/type |
| `<source>` | Media source | For `picture`, `audio`, `video` |
| `<img>` | Image | `alt` required (can be empty for decorative) |
| `<iframe>` | Inline frame | `title` required |
| `<embed>` | External plugin | **Avoid** — use `<iframe>` or `<video>` |
| `<object>` | Generic external resource | |
| `<video>` | Video content | `controls`, `track` for captions |
| `<audio>` | Audio content | `controls`, `track` for captions |
| `<track>` | Text track (captions) | `kind="captions"`, `srclang` |
| `<map>` | Image map client-side | |
| `<area>` | Image map area | |

## Scripting

| Element | Purpose | Notes |
|---------|---------|-------|
| `<script>` | JavaScript | `defer`, `async`, `type="module"` |
| `<canvas>` | Drawing canvas | `width`, `height` |

## Table

| Element | Purpose | Notes |
|---------|---------|-------|
| `<table>` | Tabular data | Not for layout |
| `<caption>` | Table title | |
| `<colgroup>` | Column group | |
| `<col>` | Column properties | |
| `<thead>` | Header rows | |
| `<tbody>` | Body rows | |
| `<tfoot>` | Footer rows | |
| `<tr>` | Table row | |
| `<th>` | Header cell | `scope="col"` or `scope="row"` |
| `<td>` | Data cell | |

## Forms

| Element | Purpose | Notes |
|---------|---------|-------|
| `<form>` | Interactive form | `action`, `method` |
| `<label>` | Form field label | `for` matches `id` of input |
| `<input>` | Input field | 30+ types (text, email, tel, number, date, checkbox, radio, range, color, file, ...) |
| `<button>` | Button | `type="submit"` (default), `type="button"` |
| `<select>` | Dropdown list | |
| `<option>` | Option in select | |
| `<optgroup>` | Option group | |
| `<textarea>` | Multi-line text | |
| `<fieldset>` | Group related fields | |
| `<legend>` | Fieldset caption | |
| `<datalist>` | Autocomplete suggestions | |
| `<output>` | Calculation result | |
| `<progress>` | Task progress | |
| `<meter>` | Scalar gauge | |
| `<search>` | Search form | Landmark role=`search` |

## Interactive

| Element | Purpose | Notes |
|---------|---------|-------|
| `<details>` | Disclosure widget | |
| `<summary>` | Details summary | First child of `<details>` |
| `<dialog>` | Modal/non-modal dialog | `.showModal()`, `.close()` |
| `[popover]` | Popover element | New in HTML Living Standard |

## Element Selection Priority
```
1. Semantic element (nav, article, button, dialog)
2. ARIA-enhanced generic (role="tabpanel" on a div)
3. Bare div/span (zero semantics)
```
{% endraw %}
