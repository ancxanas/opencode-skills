import sharp from 'sharp';
import { chromium } from 'playwright';
import http from 'http';
import { randomInt, randomFloat } from './helpers.mjs';

const CAPTCHA_PATTERNS = [
  {
    type: 'recaptcha-v2',
    name: 'reCAPTCHA v2 (Checkbox/Invisible)',
    selectors: [
      '.g-recaptcha',
      'iframe[src*="recaptcha/api2/anchor"]',
      'iframe[src*="www.google.com/recaptcha/api2"]',
      'iframe[src*="www.recaptcha.net/recaptcha/api2"]',
      'iframe[src*="www.google.com/recaptcha/enterprise"]',
    ],
    sitekeySelectors: ['[data-sitekey]', '.g-recaptcha'],
    sitekeyAttribute: 'data-sitekey',
    tokenSelector: '#g-recaptcha-response, [name="g-recaptcha-response"]',
    challengeIframe: 'iframe[src*="recaptcha/api2/bframe"]',
  },
  {
    type: 'recaptcha-v3',
    name: 'reCAPTCHA v3 (Invisible)',
    selectors: ['script[src*="recaptcha/api.js"][src*="render="]'],
    sitekeyExtract: (html) => {
      const match = html.match(/render=([0-9A-Za-z_-]+)/);
      return match ? match[1] : null;
    },
    tokenSelector: '#g-recaptcha-response, [name="g-recaptcha-response"]',
  },
  {
    type: 'hcaptcha',
    name: 'hCaptcha',
    selectors: [
      '.h-captcha',
      'iframe[src*="hcaptcha.com"][title*="Widget"]',
      'iframe[src*="newassets.hcaptcha.com"]',
    ],
    sitekeySelectors: ['.h-captcha', '[data-sitekey]'],
    sitekeyAttribute: 'data-sitekey',
    tokenSelector: '[name="h-captcha-response"]',
  },
  {
    type: 'turnstile',
    name: 'Cloudflare Turnstile',
    selectors: [
      '.cf-turnstile',
      'iframe[src*="challenges.cloudflare.com"]',
      'iframe[title*="Cloudflare security"]',
    ],
    sitekeySelectors: ['.cf-turnstile', '[data-sitekey]'],
    sitekeyAttribute: 'data-sitekey',
    tokenSelector: '[name="cf-turnstile-response"]',
  },
  {
    type: 'funcaptcha',
    name: 'FunCaptcha / Arkose Labs',
    selectors: [
      'iframe[src*="funcaptcha.com"]',
      'iframe[src*="arkoselabs.com"]',
    ],
    sitekeySelectors: ['[data-pkey]'],
    sitekeyAttribute: 'data-pkey',
    tokenSelector: '[name="fc-token"]',
  },
  {
    type: 'drag-slider',
    name: 'Drag Slider / Puzzle',
    selectors: [
      '[class*="slider"]',
      '[id*="slider"]',
      '[class*="captcha-slider"]',
      '[class*="drag"]',
    ],
    sitekeySelectors: [],
    sitekeyAttribute: null,
    tokenSelector: null,
  },
  {
    type: 'text-captcha',
    name: 'Text CAPTCHA',
    selectors: ['img[src*="captcha"]', 'img[alt*="captcha"]'],
    sitekeySelectors: [],
    sitekeyAttribute: null,
    tokenSelector: 'input[name*="captcha"]',
  },
];

export async function connectCDP(port = 9222, connectToExisting = false) {
  let browser;
  let usingExternal = connectToExisting;

  if (connectToExisting) {
    try {
      browser = await Promise.race([
        chromium.connectOverCDP(`http://localhost:${port}`),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('CDP connection timeout')), 3000)
        ),
      ]);
    } catch {
      throw new Error(`Could not connect to Chrome on port ${port}. Make sure Chrome is running with --remote-debugging-port=${port}`);
    }
  } else {
    browser = await chromium.launch({ headless: true });
  }

  const context = usingExternal
    ? (browser.contexts()[0] || await browser.newContext())
    : await browser.newContext();

  const page = await context.newPage();

  let cdpSession;
  try {
    cdpSession = await context.newCDPSession(page);
  } catch {
    cdpSession = null;
  }

  return { browser, context, page, cdpSession };
}

export async function detectCaptcha(page) {
  const html = await page.content();
  const results = [];

  for (const pattern of CAPTCHA_PATTERNS) {
    for (const selector of pattern.selectors) {
      try {
        const el = await page.$(selector);
        if (el) {
          let sitekey = null;
          if (pattern.sitekeyAttribute && pattern.sitekeySelectors) {
            for (const skSel of pattern.sitekeySelectors) {
              try {
                const skEl = await page.$(skSel);
                if (skEl) {
                  sitekey = await skEl.getAttribute(pattern.sitekeyAttribute);
                  if (sitekey) break;
                }
              } catch {}
            }
          }
          if (!sitekey && pattern.sitekeyExtract) {
            sitekey = pattern.sitekeyExtract(html);
          }

          results.push({
            type: pattern.type,
            name: pattern.name,
            selector,
            sitekey,
            tokenSelector: pattern.tokenSelector,
            challengeIframe: pattern.challengeIframe || null,
            confidence: 'high',
          });
          break;
        }
      } catch {}
    }
  }

  if (results.length === 0) {
    const text = html.toLowerCase();
    const keywordHits = [];
    if (text.includes('recaptcha') || text.includes('g-recaptcha')) keywordHits.push('recaptcha');
    if (text.includes('hcaptcha')) keywordHits.push('hcaptcha');
    if (text.includes('turnstile') || text.includes('challenges.cloudflare')) keywordHits.push('turnstile');
    if (text.includes('funcaptcha') || text.includes('arkoselabs')) keywordHits.push('funcaptcha');
    if (text.includes('captcha')) keywordHits.push('captcha');
    if (keywordHits.length > 0) {
      results.push({
        type: keywordHits[0],
        name: keywordHits[0],
        selector: null,
        sitekey: null,
        tokenSelector: null,
        challengeIframe: null,
        confidence: 'low',
        keywords: keywordHits,
      });
    }
  }

  return results;
}

export async function captureScreenshot(page) {
  return await page.screenshot({ type: 'png', fullPage: false });
}

export async function overlayGrid(screenshotBuffer, rows = 3, cols = 3) {
  const metadata = await sharp(screenshotBuffer).metadata();
  const { width, height } = metadata;
  const cellW = Math.floor(width / cols);
  const cellH = Math.floor(height / rows);

  const lines = [];
  const labels = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cellNum = r * cols + c + 1;
      const cx = c * cellW + cellW / 2;
      const cy = r * cellH + cellH / 2;
      labels.push(
        `<rect x="${c * cellW}" y="${r * cellH}" width="${cellW}" height="${cellH}" fill="none" stroke="rgba(255,50,50,0.7)" stroke-width="2"/>`
      );
      labels.push(
        `<circle cx="${cx}" cy="${cy}" r="14" fill="rgba(255,50,50,0.85)" stroke="white" stroke-width="2"/>`
      );
      labels.push(
        `<text x="${cx}" y="${cy + 5}" fill="white" font-size="16" font-weight="bold" text-anchor="middle" font-family="monospace">${cellNum}</text>`
      );
    }
  }

  const svgOverlay = Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${lines.join('')}${labels.join('')}</svg>`
  );

  const result = await sharp(screenshotBuffer)
    .composite([{ input: svgOverlay, top: 0, left: 0 }])
    .png()
    .toBuffer();

  return {
    buffer: result,
    gridInfo: { rows, cols, cellW, cellH, imageWidth: width, imageHeight: height },
  };
}

export function cellToCoordinate(cellNumber, gridInfo) {
  const { cols, cellW, cellH } = gridInfo;
  const idx = cellNumber - 1;
  const col = idx % cols;
  const row = Math.floor(idx / cols);
  return {
    x: Math.round(col * cellW + cellW / 2 + randomFloat(-3, 3)),
    y: Math.round(row * cellH + cellH / 2 + randomFloat(-3, 3)),
    cellW,
    cellH,
  };
}

function bezierPoint(t, p0, p1, p2, p3) {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
}

function generateBezierPath(fromX, fromY, toX, toY, steps = 30 + randomInt(0, 20)) {
  const dist = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2);
  const controlOffset = dist * (0.2 + randomFloat(0, 0.3));
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const perpAngle = angle + (Math.random() > 0.5 ? 1 : -1) * (Math.PI / 2 + randomFloat(-0.3, 0.3));

  const cp1 = {
    x: fromX + Math.cos(angle) * controlOffset * 0.3 + Math.cos(perpAngle) * controlOffset,
    y: fromY + Math.sin(angle) * controlOffset * 0.3 + Math.sin(perpAngle) * controlOffset,
  };
  const cp2 = {
    x: toX - Math.cos(angle) * controlOffset * 0.3 + Math.cos(perpAngle) * controlOffset * 0.7,
    y: toY - Math.sin(angle) * controlOffset * 0.3 + Math.sin(perpAngle) * controlOffset * 0.7,
  };

  const p0 = { x: fromX, y: fromY };
  const p3 = { x: toX, y: toY };
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    points.push(bezierPoint(t, p0, cp1, cp2, p3));
  }
  return points;
}

export async function humanizedMove(cdpSession, fromX, fromY, toX, toY) {
  const path = generateBezierPath(fromX, fromY, toX, toY);
  for (const point of path) {
    await cdpSession.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: Math.round(point.x),
      y: Math.round(point.y),
      button: 'left',
      buttons: 0,
      clickCount: 0,
      modifiers: 0,
    });
    await sleep(randomInt(5, 15));
  }
}

export async function humanizedClickAt(cdpSession, x, y) {
  const startX = Math.max(0, x + randomInt(-50, 50));
  const startY = Math.max(0, y + randomInt(-50, 50));

  await humanizedMove(cdpSession, startX, startY, x, y);

  await sleep(randomInt(20, 60));

  await cdpSession.send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x, y,
    button: 'left',
    buttons: 1,
    clickCount: 1,
    modifiers: 0,
  });

  await sleep(randomInt(40, 120));

  await cdpSession.send('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x: x + randomInt(-1, 1),
    y: y + randomInt(-1, 1),
    button: 'left',
    buttons: 0,
    clickCount: 1,
    modifiers: 0,
  });
}

export async function injectGridClicks(cdpSession, cells, gridInfo) {
  const coordinates = cells.map((cell) => cellToCoordinate(cell, gridInfo));
  for (const coord of coordinates) {
    await humanizedClickAt(cdpSession, coord.x, coord.y);
    await sleep(randomInt(150, 400));
  }
}

export async function injectToken(page, token, captchaType) {
  const type = captchaType || 'recaptcha-v2';
  const selectorMap = {
    'recaptcha-v2': '#g-recaptcha-response',
    'recaptcha-v3': '#g-recaptcha-response',
    'hcaptcha': '[name="h-captcha-response"]',
    'turnstile': '[name="cf-turnstile-response"]',
    'funcaptcha': '[name="fc-token"]',
  };

  const selector = selectorMap[type] || '#g-recaptcha-response';

  await page.evaluate(
    ({ sel, tok, typ }) => {
      const field = document.querySelector(sel);
      if (field) {
        const nativeSetter = Object.getOwnPropertyDescriptor(
          HTMLTextAreaElement.prototype, 'value'
        ) || Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype, 'value'
        );
        if (nativeSetter && nativeSetter.set) {
          nativeSetter.set.call(field, tok);
        } else {
          field.value = tok;
        }
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
      }

      if (typ === 'recaptcha-v2' || typ === 'recaptcha-v3') {
        if (typeof ___grecaptcha_cfg !== 'undefined') {
          try {
            Object.keys(___grecaptcha_cfg.clients).forEach((key) => {
              const client = ___grecaptcha_cfg.clients[key];
              if (client && client.aa && client.aa.l) {
                client.aa.l.callback(tok);
              }
            });
          } catch {}
        }
        const callbackEl = document.querySelector('[data-callback]');
        if (callbackEl) {
          const cbName = callbackEl.getAttribute('data-callback');
          if (cbName && typeof window[cbName] === 'function') {
            window[cbName](tok);
          }
        }
      }

      if (typ === 'hcaptcha') {
        const el = document.querySelector('[data-callback]');
        if (el) {
          const cbName = el.getAttribute('data-callback');
          if (cbName && typeof window[cbName] === 'function') {
            window[cbName](tok);
          }
        }
        window.dispatchEvent(new CustomEvent('hcaptchaSolved', { detail: { token: tok } }));
      }
    },
    { sel: selector, tok: token, typ: type }
  );

  await sleep(500);
}

export async function verifySolved(page) {
  const captchaResults = await detectCaptcha(page);
  if (captchaResults.length === 0) return { solved: true, message: 'No CAPTCHA detected on page' };

  const text = (await page.content()).toLowerCase();
  const successIndicators = [
    'captcha passed',
    'verification successful',
    'thank you',
    'form submitted',
    'application submitted',
    'success',
  ];
  for (const indicator of successIndicators) {
    if (text.includes(indicator)) {
      return { solved: true, message: `Found success indicator: ${indicator}` };
    }
  }

  return {
    solved: false,
    message: `CAPTCHA still present: ${captchaResults.map((r) => r.name).join(', ')}`,
    remaining: captchaResults,
  };
}

export async function startRelayServer(captchaInfo) {
  const { type, sitekey, pageUrl } = captchaInfo;
  const html = generateCaptchaWidget(type, sitekey, pageUrl);

  const relay = {
    server: null,
    port: null,
    relayUrl: null,
    token: null,
    timedOut: false,
  };

  relay.close = () => {
    if (relay.server) relay.server.close();
  };

  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, `http://localhost:${0}`);

      if (url.pathname === '/solve' || url.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
      }

      if (url.pathname === '/token') {
        const tokenParam = url.searchParams.get('token');
        if (tokenParam) {
          relay.token = tokenParam;
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'received', token: tokenParam }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'error', message: 'Missing token parameter' }));
        }
        return;
      }

      res.writeHead(404);
      res.end('Not found');
    });

    relay.server = server;

    server.listen(0, '0.0.0.0', () => {
      relay.port = server.address().port;
      relay.relayUrl = `http://localhost:${relay.port}/solve${sitekey ? `?type=${type}&sitekey=${sitekey}` : ''}`;
      resolve(relay);
    });

    server.on('error', reject);

    const timeout = setTimeout(() => {
      relay.timedOut = true;
      relay.close();
    }, 300_000);

    server.on('close', () => clearTimeout(timeout));
  });
}

function generateCaptchaWidget(type, sitekey, pageUrl) {
  const sitekeyAttr = sitekey ? `data-sitekey="${sitekey}"` : 'data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"';
  const pageUrlScript = pageUrl ? `const PAGE_URL = '${pageUrl}';` : '';

  if (type === 'hcaptcha') {
    return `<!DOCTYPE html>
<html><head><title>CAPTCHA Relay - hCaptcha</title>
<script src="https://js.hcaptcha.com/1/api.js" async defer></script>
<style>
body{font-family:sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#f5f5f5}
.container{background:white;padding:40px;border-radius:12px;box-shadow:0 2px 20px rgba(0,0,0,0.1);text-align:center}
h2{color:#333;margin-bottom:20px}
p{color:#666;margin-bottom:24px;font-size:14px}
#status{margin-top:20px;padding:12px;border-radius:8px;display:none}
#status.success{display:block;background:#d4edda;color:#155724;border:1px solid #c3e6cb}
#status.error{display:block;background:#f8d7da;color:#721c24;border:1px solid #f5c6cb}
</style></head><body>
<div class="container">
<h2>Solve hCaptcha</h2>
<p>Complete the CAPTCHA below. The token will be sent back automatically.</p>
<div class="h-captcha" ${sitekeyAttr} data-callback="onCaptchaSolved"></div>
<div id="status"></div>
</div>
<script>
${pageUrlScript}
function onCaptchaSolved(token) {
  document.getElementById('status').className = 'success';
  document.getElementById('status').textContent = 'CAPTCHA solved! Token captured. You can close this page.';
  fetch('/token?token=' + encodeURIComponent(token))
    .then(r => r.json())
    .then(d => console.log('Token sent:', d))
    .catch(e => console.error('Send failed:', e));
}
</script></body></html>`;
  }

  if (type === 'turnstile') {
    return `<!DOCTYPE html>
<html><head><title>CAPTCHA Relay - Turnstile</title>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
<style>
body{font-family:sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#f5f5f5}
.container{background:white;padding:40px;border-radius:12px;box-shadow:0 2px 20px rgba(0,0,0,0.1);text-align:center}
h2{color:#333;margin-bottom:20px}
p{color:#666;margin-bottom:24px;font-size:14px}
#status{margin-top:20px;padding:12px;border-radius:8px;display:none}
#status.success{display:block;background:#d4edda;color:#155724;border:1px solid #c3e6cb}
</style></head><body>
<div class="container">
<h2>Solve Cloudflare Turnstile</h2>
<p>Complete the verification below.</p>
<div class="cf-turnstile" ${sitekeyAttr} data-callback="onCaptchaSolved"></div>
<div id="status"></div>
</div>
<script>
${pageUrlScript}
function onCaptchaSolved(token) {
  document.getElementById('status').className = 'success';
  document.getElementById('status').textContent = 'Verified! Token captured. You can close this page.';
  fetch('/token?token=' + encodeURIComponent(token))
    .then(r => r.json())
    .then(d => console.log('Token sent:', d))
    .catch(e => console.error('Send failed:', e));
}
window.addEventListener('load', function() {
  setTimeout(function() {
    const el = document.querySelector('[name="cf-turnstile-response"]');
    if (el && el.value) {
      onCaptchaSolved(el.value);
    }
  }, 1000);
});
</script></body></html>`;
  }

  return `<!DOCTYPE html>
<html><head><title>CAPTCHA Relay - reCAPTCHA</title>
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
<style>
body{font-family:sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#f5f5f5}
.container{background:white;padding:40px;border-radius:12px;box-shadow:0 2px 20px rgba(0,0,0,0.1);text-align:center}
h2{color:#333;margin-bottom:20px}
p{color:#666;margin-bottom:24px;font-size:14px}
#status{margin-top:20px;padding:12px;border-radius:8px;display:none}
#status.success{display:block;background:#d4edda;color:#155724;border:1px solid #c3e6cb}
</style></head><body>
<div class="container">
<h2>Solve reCAPTCHA</h2>
<p>Complete the CAPTCHA below. The token will be sent back automatically.</p>
<div class="g-recaptcha" ${sitekeyAttr} data-callback="onCaptchaSolved"></div>
<div id="status"></div>
</div>
<script>
${pageUrlScript}
function onCaptchaSolved(token) {
  document.getElementById('status').className = 'success';
  document.getElementById('status').textContent = 'CAPTCHA solved! Token captured. You can close this page.';
  fetch('/token?token=' + encodeURIComponent(token))
    .then(r => r.json())
    .then(d => console.log('Token sent:', d))
    .catch(e => console.error('Send failed:', e));
}
</script></body></html>`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { sleep };
