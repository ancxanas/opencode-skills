# WCAG 2.2 Quick Reference

## Conformance Levels
- **A** — Must support. Minimum.
- **AA** — Should support. Target level.
- **AAA** — May support. Not required for compliance.

## Perceivable

| SC | Level | Criteria | Key Technique |
|----|-------|----------|--------------|
| 1.1.1 | A | Non-text Content | `alt` on all images |
| 1.2.1 | A | Audio-only / Video-only | Transcript or audio description |
| 1.2.2 | A | Captions (Prerecorded) | Synchronized captions |
| 1.2.3 | A | Audio Description (Prerecorded) | Audio description or full text alternative |
| 1.2.4 | AA | Captions (Live) | Real-time captions |
| 1.2.5 | AA | Audio Description (Prerecorded) | Audio description track |
| 1.3.1 | A | Info and Relationships | Semantic HTML, ARIA landmarks |
| 1.3.2 | A | Meaningful Sequence | DOM order matches visual order |
| 1.3.3 | A | Sensory Characteristics | Don't rely only on shape/size/color |
| 1.3.4 | AA | Orientation | Don't lock orientation |
| 1.3.5 | AA | Identify Input Purpose | `autocomplete` attributes |
| 1.3.6 | AAA | Identify Purpose | ARIA `role` and landmarks |
| 1.4.1 | A | Use of Color | Don't use color alone to convey info |
| 1.4.2 | A | Audio Control | Pause/stop control for >3s audio |
| 1.4.3 | AA | Contrast (Minimum) | 4.5:1 normal, 3:1 large text |
| 1.4.4 | AA | Resize Text | 200% zoom without loss |
| 1.4.5 | AA | Images of Text | Use real text, not images of text |
| 1.4.10 | AA | Reflow | No horizontal scroll at 400% zoom |
| 1.4.11 | AA | Non-text Contrast | 3:1 for UI components, graphics |
| 1.4.12 | AA | Text Spacing | No loss when line-height 1.5, spacing 0.12em/0.16em |
| 1.4.13 | AA | Content on Hover/Focus | Dismissable, hoverable, persistent |

## Operable

| SC | Level | Criteria | Key Technique |
|----|-------|----------|--------------|
| 2.1.1 | A | Keyboard | All functionality via keyboard |
| 2.1.2 | A | No Keyboard Trap | Focus can be moved away |
| 2.1.4 | A | Character Key Shortcuts | Remap or turn off single-key shortcuts |
| 2.2.1 | A | Timing Adjustable | Turn off, adjust, or extend time limits |
| 2.2.2 | A | Pause, Stop, Hide | Moving/blinking content can be paused |
| 2.3.1 | A | Three Flashes or Below | No >3 flashes per second |
| 2.4.1 | A | Bypass Blocks | Skip links, landmark regions |
| 2.4.2 | A | Page Titled | Descriptive `<title>` |
| 2.4.3 | A | Focus Order | Logical tab order |
| 2.4.4 | A | Link Purpose (In Context) | Descriptive link text |
| 2.4.5 | AA | Multiple Ways | Site map, search, nav — 2+ methods |
| 2.4.6 | AA | Headings and Labels | Descriptive headings and labels |
| 2.4.7 | AA | Focus Visible | Visible focus indicator |
| 2.4.11 | AA | Focus Not Obscured (Minimum) | Focus not fully covered |
| 2.4.12 | AAA | Focus Not Obscured (Enhanced) | Focus not obscured at all |
| 2.4.13 | AA | Focus Appearance | Focus indicator ≥2px, contrast ≥3:1 |
| 2.5.2 | A | Pointer Cancellation | No down-event activation without abort |
| 2.5.3 | A | Label in Name | Accessible name matches visible label |
| 2.5.7 | AA | Dragging Movements | All drag functionality also available via single pointer |
| 2.5.8 | AA | Target Size (Minimum) | Target ≥24x24 CSS px |

## Understandable

| SC | Level | Criteria | Key Technique |
|----|-------|----------|--------------|
| 3.1.1 | A | Language of Page | `lang` attribute on `<html>` |
| 3.1.2 | AA | Language of Parts | `lang` on changed-language elements |
| 3.2.1 | A | On Focus | No unexpected context change on focus |
| 3.2.2 | A | On Input | No unexpected context change on input |
| 3.2.3 | AA | Consistent Navigation | Same nav order across pages |
| 3.2.4 | AA | Consistent Identification | Same icon = same action |
| 3.3.1 | A | Error Identification | Describe input errors in text |
| 3.3.2 | A | Labels or Instructions | Form fields have labels |
| 3.3.3 | AA | Error Suggestion | Provide correction suggestions |
| 3.3.4 | AA | Error Prevention (Legal/Financial) | Reversible, checked, or confirmed |
| 3.3.7 | A | Accessible Authentication | No cognitive function test (like CAPTCHA) unless alternative |
| 3.3.8 | AA | Accessible Authentication (No OutOfUGC) | No object recognition |

## Robust

| SC | Level | Criteria | Key Technique |
|----|-------|----------|--------------|
| 4.1.1 | A | Parsing (obsolete in 2.2) | Removed — covered by HTML spec |
| 4.1.2 | A | Name, Role, Value | ARIA attributes where native HTML insufficient |
| 4.1.3 | AA | Status Messages | `role="status"`, `aria-live` regions |

## ARIA Landmarks
- `banner` — `<header>` (site-level)
- `navigation` — `<nav>`
- `main` — `<main>`
- `complementary` — `<aside>`
- `contentinfo` — `<footer>` (site-level)
- `form` — `<form>` (only when form has accessible name)
- `search` — `search` role or `<form role="search">`
- `region` — Section with accessible name

## Color Contrast Calculators
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- APCA (Advanced Perceptual Contrast Algorithm): https://www.myndex.com/APCA/
- WCAG 3 draft uses APCA instead of simple ratio
