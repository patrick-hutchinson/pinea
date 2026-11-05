const args = process.argv.slice(2);
const orderId = args[0];
const urlIndex = args.indexOf('--url');
const base = urlIndex >= 0 ? args[urlIndex + 1] : process.env.GIFT_RETRY_BASE_URL;
const secret = process.env.GIFT_RETRY_SECRET;
if (!orderId || !/^(?:gid:\/\/shopify\/Order\/)?[1-9]\d*$/.test(orderId) || !base) {
  console.error('Usage: npm run gifts:retry -- ORDER_ID --url https://preview.pinea-periodical.com [--send]');
  process.exit(1);
}
if (!secret || secret.length < 32) {
  console.error('Set GIFT_RETRY_SECRET (at least 32 characters) locally and on the target deployment.');
  process.exit(1);
}
const url = new URL('/api/gifts/retry', base);
if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) {
  throw new Error('Retry URL must use HTTPS (except localhost).');
}
if (url.username || url.password) throw new Error('Credentials are not allowed in the retry URL.');
const send = args.includes('--send');
console.log(`${send ? 'PROCESS' : 'DRY RUN'} order ${orderId} on ${url.host}`);
try {
  const response = await fetch(url, {method: 'POST', redirect: 'error',
    headers: {'Content-Type': 'application/json', Authorization: `Bearer ${secret}`},
    body: JSON.stringify({orderId, send}), signal: AbortSignal.timeout(310_000)});
  const body = await response.text();
  try { console.log(JSON.stringify(JSON.parse(body), null, 2)); }
  catch { console.error(`Non-JSON response (HTTP ${response.status}); check deployment protection and the target URL.`); }
  if (!response.ok) process.exitCode = 1;
} catch {
  console.error('Request failed or timed out. Check runtime logs before retrying; processing may still be running.');
  process.exitCode = 1;
}

export {};
