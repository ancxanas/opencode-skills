import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  connectCDP, captureScreenshot, overlayGrid, injectGridClicks,
  detectCaptcha, verifySolved, sleep
} from './captcha-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseArgs() {
  const args = {};
  const raw = process.argv.slice(2);
  for (let i = 0; i < raw.length; i++) {
    if (raw[i].startsWith('--')) {
      let key = raw[i].slice(2);
      key = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const val = (raw[i + 1] && !raw[i + 1].startsWith('--')) ? raw[i + 1] : true;
      args[key] = val;
      if (val !== true) i++;
    }
  }
  return args;
}

function writeJson(data) {
  process.stdout.write(JSON.stringify(data) + '\n');
}

async function main() {
  const args = parseArgs();
  const cdpPort = parseInt(args.cdpPort || '9222', 10);
  const connectExisting = args.connect === true || args.connect === 'true';
  const gridRows = parseInt(args.gridRows || '3', 10);
  const gridCols = parseInt(args.gridCols || '3', 10);
  const outputDir = args.outputDir || '/tmp/opencode-captcha';
  const url = args.url || null;
  const cells = args.cells
    ? args.cells.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n))
    : null;
  const gridInfoRaw = args.gridinfo || null;
  const gridInfo = gridInfoRaw ? JSON.parse(gridInfoRaw) : null;

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  try {
    const { browser, page, cdpSession } = await connectCDP(cdpPort, connectExisting);

    if (url) {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      await sleep(2000);
    }

    if (cells && gridInfo && cdpSession) {
      await injectGridClicks(cdpSession, cells, gridInfo);
      await sleep(1500);

      const verified = await verifySolved(page);
      writeJson({
        status: 'solved',
        message: `Clicked grid cells: ${cells.join(', ')}`,
        verified: verified.solved,
        verificationMessage: verified.message,
      });
      await browser.close();
      return;
    }

    if (!cdpSession) {
      writeJson({ status: 'error', message: 'CDP session unavailable — CAPTCHA interaction requires a real browser with CDP' });
      await browser.close();
      return;
    }

    const detected = await detectCaptcha(page);
    const screenshotBuffer = await captureScreenshot(page);
    const { buffer, gridInfo: info } = await overlayGrid(screenshotBuffer, gridRows, gridCols);

    const timestamp = Date.now();
    const imagePath = join(outputDir, `captcha-grid-${timestamp}.png`);
    writeFileSync(imagePath, buffer);

    let prompt = 'A CAPTCHA has been detected on the page. Reply with the grid cell numbers that should be clicked, separated by commas (e.g. "1,3,5,7").';
    if (detected.length > 0) {
      prompt = `CAPTCHA detected: ${detected.map((d) => d.name).join(', ')}. ` +
        `Reply with the grid cell numbers to click, separated by commas (e.g. "1,3,5,7").`;
    }

    writeJson({
      status: 'awaiting_input',
      imagePath,
      prompt,
      captchaType: detected.length > 0 ? detected[0].type : 'unknown',
      captchaName: detected.length > 0 ? detected[0].name : 'Unknown',
      sitekey: detected.length > 0 ? detected[0].sitekey : null,
      gridInfo: info,
      nextCommand: `bun run scripts/solve-screenshot.mjs --cdp-port ${cdpPort} --cells "CELLS" --grid-info '${JSON.stringify(info)}'`,
    });

    await browser.close();
  } catch (err) {
    writeJson({ status: 'error', message: err.message });
  }
}

main();
