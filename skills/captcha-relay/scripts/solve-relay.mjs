import { connectCDP, detectCaptcha, startRelayServer, injectToken, verifySolved, sleep } from './captcha-utils.mjs';

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
  const token = args.token || null;
  const captchaType = args.captchaType || null;
  const url = args.url || null;

  try {
    const { browser, page, cdpSession } = await connectCDP(cdpPort, connectExisting);

    if (url) {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      await sleep(2000);
    }

    if (token && captchaType) {
      await injectToken(page, token, captchaType);
      await sleep(1000);

      const verified = await verifySolved(page);
      writeJson({
        status: 'solved',
        message: 'Token injected into page',
        verified: verified.solved,
        verificationMessage: verified.message,
      });
      await browser.close();
      return;
    }

    const detected = await detectCaptcha(page);

    if (detected.length === 0) {
      writeJson({
        status: 'error',
        message: 'No CAPTCHA detected on the current page',
      });
      await browser.close();
      return;
    }

    const primaryCaptcha = detected[0];
    const pageUrl = page.url();

    const relay = await startRelayServer({
      type: primaryCaptcha.type,
      sitekey: primaryCaptcha.sitekey,
      pageUrl,
    });

    if (relay.timedOut) {
      writeJson({
        status: 'error',
        message: 'Timed out waiting for CAPTCHA to be solved (5 minutes)',
        captchaType: primaryCaptcha.type,
        sitekey: primaryCaptcha.sitekey,
      });
      relay.close();
      await browser.close();
      return;
    }

    writeJson({
      status: 'awaiting_solve',
      relayUrl: relay.relayUrl,
      port: relay.port,
      captchaType: primaryCaptcha.type,
      captchaName: primaryCaptcha.name,
      sitekey: primaryCaptcha.sitekey,
      pageUrl,
      prompt: `A ${primaryCaptcha.name} was detected. Open ${relay.relayUrl} in your browser to solve the CAPTCHA. The token will be captured automatically.`,
    });

    const relayToken = await new Promise((resolve) => {
      const poll = setInterval(() => {
        if (relay.token) {
          clearInterval(poll);
          resolve(relay.token);
        }
      }, 200);
      relay.server.on('close', () => {
        clearInterval(poll);
        resolve(relay.token || null);
      });
    });

    if (relayToken) {
      await injectToken(page, relayToken, primaryCaptcha.type);
      await sleep(1000);
      const verified = await verifySolved(page);
      writeJson({
        status: 'solved',
        message: 'Token captured via relay and injected',
        verified: verified.solved,
        verificationMessage: verified.message,
      });
    } else {
      writeJson({
        status: 'cancelled',
        message: 'Relay closed without receiving a token',
      });
    }

    relay.close();
    await browser.close();
  } catch (err) {
    writeJson({ status: 'error', message: err.message });
    try { /* ignore close errors */ } catch {}
  }
}

main();
