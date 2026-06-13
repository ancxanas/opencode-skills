---
name: captcha-relay
description: "Human-in-the-loop CAPTCHA solving for opencode browser automation. Use when browser automation encounters CAPTCHAs, security challenges, 'I'm not a robot' prompts, or bot detection during job applications, form submissions, or web scraping. Supports screenshot relay (zero infrastructure, works for any CAPTCHA type) and token relay (more reliable for reCAPTCHA/hCaptcha/Turnstile). Invoke when the user says their automation hit a CAPTCHA, security check, or human verification page. Trigger terms: CAPTCHA, captcha, reCAPTCHA, hCaptcha, Turnstile, FunCaptcha, bot detection, security challenge, verify human, human verification, 'I'm not a robot', grid challenge, drag puzzle, rotation puzzle, slider captcha, automation blocked, job application blocked."
license: MIT
compatibility: opencode
metadata:
  author: https://github.com/anomalyco/opencode
  version: "1.0.0"
  domain: automation
  triggers: captcha, reCAPTCHA, hCaptcha, Turnstile, security check, human verification, bot detection, grid challenge
  role: specialist
  scope: automation
  output-format: instruction
  related-skills: playwright-expert, composio
  last-reviewed: 2026-06-14
---
# CAPTCHA Relay

CAPTCHA solving specialist for browser automation. When automation hits a CAPTCHA, this skill relays the challenge to the user so they can solve it without leaving the automation flow.

## When to use this skill

- reCAPTCHA v2/v2 Invisible/v3 detected on the page
- hCaptcha widget rendered
- Cloudflare Turnstile challenge appeared
- FunCaptcha / Arkose Labs puzzle visible
- Text/image/grid/drag/rotation CAPTCHA present
- "I'm not a robot" checkbox blocking form submission
- Job application flow interrupted by verification (LinkedIn, Indeed, Workday, Greenhouse)
- Browser automation paused on a security challenge page
- User says "it's asking me to verify I'm human" or "CAPTCHA blocked me"

## When NOT to use

- Phone/SMS/email verification — not a CAPTCHA, needs different handling
- API rate limiting — use proxy rotation instead
- Basic login form without CAPTCHA
- Multi-factor authentication (MFA/2FA)
- Browser fingerprinting blocks without CAPTCHA widget

## How it works: Two modes

### Mode 1: Screenshot Relay (default — zero infrastructure)

1. Connect to the running Chrome via CDP
2. Detect CAPTCHA type and extract sitekey
3. Capture a screenshot of the page
4. Overlay a numbered grid onto the screenshot using `sharp`
5. Present the image path and prompt to the user
6. User replies with grid cell numbers to click (e.g. "1,3,5,7")
7. Click those cells via CDP with humanized mouse trajectories (Bezier curves, variable timing)
8. Verify the CAPTCHA is solved
9. Resume automation

Works for **any** CAPTCHA type — reCAPTCHA grids, hCaptcha, sliders, text, etc. No setup needed beyond Chrome running with `--remote-debugging-port`.

### Mode 2: Token Relay (more reliable for reCAPTCHA/hCaptcha/Turnstile)

1. Connect to the running Chrome via CDP
2. Detect CAPTCHA type and extract sitekey
3. Start a local HTTP relay server serving the real CAPTCHA widget
4. Present the relay URL to the user
5. User opens the URL in their browser and solves the CAPTCHA natively
6. The token is captured by the relay server
7. Inject the token into the original page via CDP (`Runtime.evaluate`)
8. Verify the CAPTCHA is solved
9. Resume automation

More reliable for known CAPTCHA types because the user interacts with the real widget. Requires the user to have network access to the machine (localhost works if same machine, otherwise cloudflared/Tailscale).

## CAPTCHA Detection Reference

| Type | Selectors | Sitekey Source | Token Field |
|------|-----------|---------------|-------------|
| reCAPTCHA v2 | `.g-recaptcha`, `iframe[src*="recaptcha/api2"]` | `data-sitekey` attribute | `#g-recaptcha-response` |
| reCAPTCHA v3 | `script[src*="render="]` | URL param `render=` | `#g-recaptcha-response` |
| hCaptcha | `.h-captcha`, `iframe[src*="hcaptcha.com"]` | `data-sitekey` attribute | `[name="h-captcha-response"]` |
| Turnstile | `.cf-turnstile`, `iframe[src*="challenges.cloudflare.com"]` | `data-sitekey` attribute | `[name="cf-turnstile-response"]` |
| FunCaptcha | `iframe[src*="funcaptcha.com"]` | `data-pkey` attribute | arkose token |
| Drag/Slider | `[class*="slider"]`, `[id*="slider"]` | N/A | N/A |
| Text CAPTCHA | `img[src*="captcha"]` | N/A | `input[name*="captcha"]` |

## Script Reference

| Script | Purpose | Load When |
|--------|---------|-----------|
| `scripts/captcha-utils.mjs` | Shared library: CDP connect, detection, grid overlay, click injection, token relay, token injection | Always needed |
| `scripts/solve-screenshot.mjs` | Screenshot relay mode CLI | User needs to solve a CAPTCHA via screenshot |
| `scripts/solve-relay.mjs` | Token relay mode CLI | User needs to solve reCAPTCHA/hCaptcha/Turnstile via relay |
| `references/captcha-patterns.md` | Visual guide to CAPTCHA detection patterns | Need help identifying a CAPTCHA type |

## Workflow

### Screenshot mode

```
1. Run: bun run scripts/solve-screenshot.mjs --url <page-url>
   (omit --url if already on page, add --connect to connect to an existing Chrome via --cdp-port)
2. Read JSON output:
   - status: "awaiting_input"
   - imagePath: path to grid-overlaid screenshot
   - prompt: what to ask the user
   - gridInfo: grid dimensions for click injection
3. Show the user the image path and prompt text
4. Ask the user which grid cells to click (e.g. "1,3,5,7")
5. Run: bun run scripts/solve-screenshot.mjs --cells "1,3,5,7" --grid-info '<json>'
   (add --connect --cdp-port 9222 if using external Chrome)
6. Read JSON output: status "solved" on success
```

### Token relay mode

```
1. Run: bun run scripts/solve-relay.mjs --url <page-url>
   (add --connect to connect to existing Chrome via --cdp-port)
2. Read JSON output:
   - status: "awaiting_solve"
   - relayUrl: URL for the user to open
   - captchaType/sitekey: detected CAPTCHA info
3. Tell the user to open the relay URL and solve the CAPTCHA
4. The relay server captures the token automatically
5. Run: bun run scripts/solve-relay.mjs --token "<token>" --captcha-type "recaptcha-v2"
   (add --connect --cdp-port 9222 if using external Chrome)
6. Read JSON output: status "solved" on success
```

### CLI flags

| Flag | Default | Description |
|------|---------|-------------|
| `--cdp-port` | 9222 | Chrome DevTools Protocol port |
| `--connect` | false | Connect to an existing Chrome instead of launching new one |
| `--url` | — | URL to navigate to before detecting/solving |
| `--cells` | — | Grid cell numbers to click (screenshot mode) |
| `--grid-info` | — | Grid dimensions JSON from step 1 (screenshot mode) |
| `--token` | — | CAPTCHA token to inject (relay mode) |
| `--captcha-type` | — | CAPTCHA type for token injection (relay mode) |
| `--output-dir` | /tmp/opencode-captcha | Screenshot output directory |
| `--grid-rows` | 3 | Number of grid rows |
| `--grid-cols` | 3 | Number of grid columns |

## Per-CAPTCHA-type guidance

### reCAPTCHA v2 (image grid)
- The challenge appears inside a `bframe` iframe after clicking the checkbox
- Grid tiles are inside `.rc-imageselect-tile`
- When the user tells you which cells contain the target object, **batch all clicks in one sequence** — don't click one tile, verify, repeat. reCAPTCHA scores click cadence. A human does all selections then clicks Verify.

### Drag puzzles (slider)
- Use CDP `Input.dispatchMouseEvent` for the drag
- **One motion only** — never split into sub-drags. The drop velocity is the main bot signal.
- Use `humanizedMove` for the path with slight vertical oscillation

### Cloudflare Turnstile
- Turnstile often auto-solves without user interaction — wait a few seconds before activating relay
- The hidden `cf-turnstile-response` input is in the light DOM, accessible directly
- If using screenshot mode, the grid is usually just a checkbox — ask user to click it

### hCaptcha Enterprise
- Harder than standard hCaptcha — uses behavioral scoring
- Token relay mode is strongly preferred over screenshot mode
- If screenshot mode fails, switch to token relay

### FunCaptcha (Arkose Labs)
- Used by LinkedIn and other major platforms
- Requires `data-pkey` (not `data-sitekey`) and often `surl` (service URL)
- Interactive puzzles (rotate images, 3D puzzles) — screenshot relay works best

## Constraints

### MUST DO
- Verify the CAPTCHA is solved after injecting clicks or token — run `detectCaptcha` again and check for success indicators
- Use CDP `Input.dispatchMouseEvent` for all clicks — it produces `isTrusted: true` events indistinguishable from real hardware
- Add small random jitter (±3px) to all click coordinates
- Batch grid cell clicks with natural delays (150-400ms between clicks)
- Use the `sharp` library for grid overlay rendering — never use a browser for image processing
- Always check Chrome is running with `--remote-debugging-port` before attempting CDP connection
- Prefer screenshot relay mode when the CAPTCHA type is unknown or hard to detect

### MUST NOT DO
- Never click grid cells one-by-one with separate verify steps — batch the sequence
- Never loop blindly on failed attempts — a second-and-third automated attempt looks more bot-like than a single failure
- Never use `page.click()` for CAPTCHA interaction — use CDP `Input.dispatchMouseEvent` for trusted events
- Never inject a token without verifying the page still needs it (token may have auto-solved)
- Never hard-code a CDP port — use `--cdp-port` argument (default 9222)

## Failure handling

1. If the first attempt fails: run detection again to check page state, then retry once
2. If the second attempt fails: capture a fresh screenshot, summarize what was tried, and ask the user for guidance
3. If the user's grid cell selection fails: report the error and ask them to try different cells
4. If CDP connection fails: remind the user to start Chrome with `--remote-debugging-port=9222`
5. If token injection fails: try fallback — set the hidden input value directly and dispatch events

## Dependencies

- **bun** (runtime for scripts)
- **Playwright** (`bun install playwright`) — for CDP browser connection
- **sharp** — image processing for grid overlay (installed via `bun install` in skill dir)
- **express** — relay server (installed via `bun install`)
- **Chrome/Chromium** with `--remote-debugging-port=9222`
- **cloudflared** (optional) — for tunnel in token relay mode when not on same machine

## Installation

The skill is already installed at `~/.config/opencode/skills/captcha-relay/`. Ensure dependencies are installed:

```bash
cd ~/.config/opencode/skills/captcha-relay && bun install
```

Add it to `opencode.jsonc` if not auto-discovered:
```json
{
  "plugin": ["captcha-relay"]
}
```
