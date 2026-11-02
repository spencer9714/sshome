import { readFile } from 'node:fs/promises';
import { audit, defaultSite, paths } from './seo-audit.mjs';

// This is a public proof-of-site file, not a private account credential.
const { key } = JSON.parse(await readFile(new URL('../indexnow.json', import.meta.url), 'utf8'));
const site = new URL(defaultSite);
const keyLocation = new URL(`/${key}.txt`, site).href;

try {
  if (!await audit(site.href)) throw new Error('Site audit failed; no URLs submitted. Fix deployment/DNS first.');
  const proof = await fetch(keyLocation, { signal: AbortSignal.timeout(15000) });
  if (proof.status !== 200 || (await proof.text()).trim() !== key) throw new Error('Public IndexNow key file is not deployed; no URLs submitted.');
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: site.hostname, key, keyLocation, urlList: paths.map((path) => new URL(path, site).href) }),
    signal: AbortSignal.timeout(30000),
  });
  if (![200, 202].includes(response.status)) throw new Error(`IndexNow rejected the request: HTTP ${response.status}`);
  console.log(response.status === 202 ? 'IndexNow HTTP 202: received; key validation pending. This does not confirm indexing.' : 'IndexNow HTTP 200: submission accepted. This does not confirm indexing.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
