# CAPTCHA Pattern Detection Guide

## reCAPTCHA v2 (Checkbox)

**DOM signature:**
- Container: `<div class="g-recaptcha" data-sitekey="...">`
- Iframe: `iframe[src*="www.google.com/recaptcha/api2/anchor"]`
- Challenge iframe: `iframe[src*="www.google.com/recaptcha/api2/bframe"]`
- Token field: `<textarea id="g-recaptcha-response" name="g-recaptcha-response">`

**Sitekey extraction:**
```
document.querySelector('.g-recaptcha').getAttribute('data-sitekey')
```

**Detect via HTML:**
```js
const hasRecaptcha = html.includes('g-recaptcha') || html.includes('recaptcha/api2');
```

## reCAPTCHA v2 (Invisible)

**DOM signature:**
- No visible checkbox widget
- Button has `data-sitekey` attribute
- Script loaded with explicit render parameters
- Token field same as v2: `#g-recaptcha-response`

**Detection:**
```js
const hasInvisible = document.querySelector('[data-sitekey]') &&
  !document.querySelector('.g-recaptcha');
```

## reCAPTCHA v3

**DOM signature:**
- Script tag: `<script src="https://www.google.com/recaptcha/api.js?render=<sitekey>">`
- No visible widget
- `grecaptcha.execute()` called programmatically on page load or form submit
- Returns score 0.0-1.0 (no user interaction)
- Token expires in 120 seconds

**Detection:**
```js
const match = html.match(/render=([0-9A-Za-z_-]+)/);
const hasV3 = typeof window.grecaptcha !== 'undefined';
```

## hCaptcha

**DOM signature:**
- Container: `<div class="h-captcha" data-sitekey="...">`
- Checkbox iframe: `iframe[src*="hcaptcha.com"][title*="Widget"]`
- Challenge iframe: `iframe[src*="newassets.hcaptcha.com"]` (nested, 2-3 levels)
- Token field: `<textarea name="h-captcha-response">`

**Sitekey format:** UUID (`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

**Detection:**
```js
const hasHcaptcha = await page.$('iframe[src*="hcaptcha.com"]');
```

**Note:** The checkbox iframe is identified by `title="Widget containing a challenge..."`. The challenge iframe is a separate nested frame.

## Cloudflare Turnstile

**DOM signature:**
- Container: `<div class="cf-turnstile" data-sitekey="...">`
- Iframe: `iframe[src*="challenges.cloudflare.com"]`
- Iframe title: `iframe[title="Widget containing a Cloudflare security challenge"]`
- Token field: `<input name="cf-turnstile-response">` (light DOM)

**Key behaviors:**
- Uses Shadow DOM internally — don't try to access inner elements
- Token TTL: ~300 seconds
- `cf_clearance` cookie set on success
- Auto-solves in most cases — wait 2-3 seconds before acting

**Detection:**
```js
const hasTurnstile = await page.$('.cf-turnstile, iframe[src*="challenges.cloudflare.com"]');
```

**Sandbox test keys:**
- Sitekey: `1x00000000000000000000AA`
- Secret: `1x0000000000000000000000000000000AA`

## FunCaptcha / Arkose Labs

**DOM signature:**
- Iframe: `iframe[src*="funcaptcha.com"]` or `iframe[src*="arkoselabs.com"]`
- Uses `data-pkey` attribute (NOT `data-sitekey`)
- Often has `surl` (service URL) parameter
- May have blob data in `data` attribute

**Detection:**
```js
const hasFuncaptcha = await page.$('iframe[src*="funcaptcha.com"], iframe[src*="arkoselabs.com"]');
const pkey = await page.evaluate(() => {
  const el = document.querySelector('[data-pkey]');
  return el ? el.getAttribute('data-pkey') : null;
});
```

**Used by:** LinkedIn, Discord, Binance, Epic Games, Airbnb

## Drag / Slider CAPTCHA

**Visual signature:**
- A slider track with a handle that must be dragged to a target position
- Often shows a puzzle piece that needs to align with a gap

**DOM signature:**
- `[class*="slider"]`, `[id*="slider"]`, `[class*="captcha-slider"]`
- `[class*="drag"]`, `[class*="puzzle"]`

**Detection:**
```js
const hasSlider = await page.$('[class*="slider"], [id*="slider"]');
```

**Solving:** Use CDP `Input.dispatchMouseEvent` with a single smooth drag motion. Never split into sub-drags.

## Rotation Puzzle CAPTCHA

**Visual signature:**
- An image that needs to be rotated upright
- Circular handle or dial to drag

**Detection:**
```js
const hasRotation = await page.$('[class*="rotate"], [id*="rotate"]');
```

**Solving:** Use vision to estimate the rotation angle, then one smooth circular drag motion.

## Text CAPTCHA

**Visual signature:**
- Distorted/warped text rendered as an image
- Text input field for the answer

**DOM signature:**
- `img[src*="captcha"]`, `img[alt*="captcha"]`
- Adjacent input: `input[name*="captcha"]`

## Page Content Indicators

When DOM selectors fail, check the page text:

| Keyword in Page | Likely CAPTCHA |
|-----------------|----------------|
| "I'm not a robot" | reCAPTCHA v2 |
| "Verify you are human" | reCAPTCHA, hCaptcha, Turnstile |
| "Security check" | Cloudflare Turnstile |
| "Please verify" | Generic |
| "Select all images" | reCAPTCHA v2 grid, hCaptcha |
| "traffic lights" | reCAPTCHA v2 |
| "crosswalks" | reCAPTCHA v2 |
| "buses" | reCAPTCHA v2 |
| "storefronts" | reCAPTCHA v2 |
| "Click the checkbox" | reCAPTCHA v2, hCaptcha |
| "challenge" | hCaptcha |
| "enable JavaScript" | Turnstile (JS disabled) |
| "Confirm you are human" | Generic |

## Quick Reference: When to use which mode

| Scenario | Mode |
|----------|------|
| Any CAPTCHA, quick solve, no setup | Screenshot relay |
| reCAPTCHA v2 known sitekey | Token relay |
| hCaptcha standard | Token relay |
| Cloudflare Turnstile | Wait 3s for auto-solve, then relay |
| FunCaptcha / LinkedIn | Screenshot relay (interactive puzzle) |
| Drag slider / rotation puzzle | Screenshot relay with vision |
| Text CAPTCHA | Screenshot relay |
| Unknown CAPTCHA type | Start with screenshot relay |
| Need maximum reliability | Token relay |
| No network access to host | Screenshot relay only |
