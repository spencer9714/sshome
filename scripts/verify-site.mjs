import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { audit, defaultSite, paths } from './seo-audit.mjs';

const base = process.argv[2] || 'http://localhost:3100';
const canonicalSite = process.argv[3] || defaultSite;
const pages = new Map();
for (const path of [...paths, '/sitemap.xml', '/image-sitemap.xml', '/llms.txt', '/robots.txt']) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, path);
  pages.set(path, await response.text());
}

const imageSitemap = pages.get('/image-sitemap.xml');
assert.ok(imageSitemap.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'));
assert.ok(pages.get('/robots.txt').includes('/image-sitemap.xml'));
const imageUrls = [...imageSitemap.matchAll(/<image:loc>(.*?)<\/image:loc>/g)].map((match) => match[1].replace(/&amp;/g, '&'));
assert.ok(imageUrls.length > 0, 'Image sitemap contains actual listing photos');
assert.equal(new Set(imageUrls).size, imageUrls.length, 'Image URLs are unique');
for (const image of imageUrls) {
  const url = new URL(image);
  assert.equal(url.origin, new URL(canonicalSite).origin);
  assert.ok(url.pathname.startsWith('/stays/'));
  await access(new URL(`../public${url.pathname}`, import.meta.url));
}
for (const path of ['/', '/zh-tw']) {
  const schemas = [...pages.get(path).matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  const collection = schemas.find((schema) => schema['@type'] === 'CollectionPage');
  assert.equal(collection.mainEntity.numberOfItems, 2);
  assert.equal(collection.inLanguage, path === '/' ? 'en' : 'zh-Hant');
}

for (const path of paths) {
  const html = pages.get(path);
  assert.ok(html.includes(`<html lang="${path === '/zh-tw' || path.startsWith('/zh-tw/') ? 'zh-Hant' : 'en'}"`), `${path}: document language`);
  const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*>/)?.[0]?.match(/href="([^"]+)"/)?.[1];
  assert.equal(new URL(canonical).href, new URL(path, canonicalSite).href, `${path}: canonical`);
}

for (const [slug, beds] of [['desert-retreat-pool-hot-tub-visalia', 6], ['luxury-family-home-hot-tub-game-room-visalia', 5]]) {
  const html = pages.get(`/stays/${slug}`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  const rental = schemas.find((item) => item['@type'] === 'VacationRental');
  assert.equal(rental.containsPlace.occupancy.value, 14);
  assert.equal(rental.containsPlace.bed.numberOfBeds, beds);
  assert.ok(!('latitude' in rental) && !('longitude' in rental), 'No fabricated precise location');
  assert.ok(!('review' in rental) && !('aggregateRating' in rental), 'No copied rating rich-result markup');
  assert.ok(html.includes('name="adults"') && html.includes('name="children"') && html.includes('name="guests"'), 'Separate adult/child booking fields');
  assert.ok(!/35 miles|55 miles|about a 1-hour drive from Sequoia/.test(html), 'No ambiguous distance claims');
  assert.ok(html.includes('data-airbnb-intent="reviews"') && html.includes('data-airbnb-intent="amenities"'), 'Distinct outbound intents');
}

for (const path of paths) {
  const html = pages.get(path);
  const en = path === '/zh-tw' ? '/' : path === '/zh-tw/sequoia-guide' ? '/sequoia-kings-canyon-guide' : path.replace(/^\/zh-tw(?=\/(?:stays\/|sequoia-group-lodging$|sequoia-winter-guide$|visalia-crew-housing$|about$|privacy$))/, '');
  const zh = en === '/' ? '/zh-tw' : en === '/sequoia-kings-canyon-guide' ? '/zh-tw/sequoia-guide' : `/zh-tw${en}`;
  if (!pages.has(zh)) continue; // Single-language pages must not invent translated counterparts.
  const alternateTags = html.match(/<link\b[^>]*>/g) || [];
  for (const [language, expected] of [['en', en], ['zh-Hant', zh], ['x-default', en]]) {
    const tag = alternateTags.find((tag) => tag.includes(`hrefLang="${language}"`));
    const href = tag?.match(/\bhref="([^"]+)"/)?.[1];
    assert.equal(new URL(href).href, new URL(expected, canonicalSite).href, `${path}: correct ${language} alternate destination`);
  }
}
// Every rendered internal page/fragment link must resolve within the audited site.
for (const path of paths) {
  for (const match of pages.get(path).matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const url = new URL(match[1].replace(/&amp;/g, '&'), new URL(path, canonicalSite));
    if (url.origin !== new URL(canonicalSite).origin) continue;
    assert.ok(pages.has(url.pathname), `${path}: unknown internal destination ${url.pathname}`);
    if (url.hash) assert.ok(pages.get(url.pathname).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${path}: missing fragment ${url.pathname}${url.hash}`);
  }
}
assert.ok(pages.get('/zh-tw/sequoia-guide').includes('五張臥室床'));
assert.ok(pages.get('/llms.txt').includes('5 bedroom beds'));
assert.ok(pages.get('/about').includes('data-airbnb-intent="contact"'));
for (const slug of ['desert-retreat-pool-hot-tub-visalia', 'luxury-family-home-hot-tub-game-room-visalia']) {
  const path = `/zh-tw/stays/${slug}`;
  const html = pages.get(path);
  assert.ok(html.includes('入住日期') && html.includes('成人（13歲以上）') && html.includes('name="children"'), 'Chinese booking form is rendered');
  const rental = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1])).find((item) => item['@type'] === 'VacationRental');
  assert.ok(rental.name.includes('度假屋'));
  assert.equal(rental.containsPlace.occupancy.value, 14);
  assert.equal(new URL(rental.url).pathname, path, 'Chinese rental schema uses Chinese page URL');
  assert.ok(pages.get('/sitemap.xml').includes(path), 'Chinese listing is in sitemap');
  assert.ok(html.includes('id="photo-tour"') && html.includes('相簿空間分類'), 'Chinese listing has an interactive localized gallery');
  assert.ok(html.includes('入住時間與房屋規則') && html.includes('16:00') && html.includes('10:00'), 'Chinese check-in/out details');
}
assert.ok(pages.get('/zh-tw').includes('zh-home-card'));
assert.ok(pages.get('/zh-tw').includes('"@type":"FAQPage"'), 'Chinese home has FAQ markup');
for (const slug of ['desert-retreat-pool-hot-tub-visalia', 'luxury-family-home-hot-tub-game-room-visalia']) {
  const html = pages.get(`/zh-tw/stays/${slug}`);
  assert.ok(html.includes('"@type":"FAQPage"') && html.includes('房客怎麼說') && html.includes('查看 Airbnb 英文原文'), 'Chinese stay has FAQs and labelled review translations');
}
assert.equal((await fetch(new URL('/this-page-does-not-exist', base))).status, 404);

// Regression: an origin-only canonical is equivalent to a root URL ending in /.
const originalFetch = globalThis.fetch;
const originalLog = console.log;
try {
  console.log = () => {};
  globalThis.fetch = async (input) => {
    const url = new URL(input);
    const body = url.pathname === '/robots.txt' ? `User-agent: *\nAllow: /\nSitemap: ${defaultSite}/sitemap.xml` : url.pathname === '/sitemap.xml' ? `<urlset>${paths.map((path) => `<url><loc>${new URL(path, defaultSite).href}</loc></url>`).join('')}</urlset>` : `<link rel="canonical" href="${url.pathname === '/' ? defaultSite : url.href}"><h1>Home</h1>`;
    return { status: 200, url: url.href, headers: new Headers(), text: async () => body };
  };
  assert.equal(await audit(), true, 'Root canonical without trailing slash passes');
  globalThis.fetch = async (input) => ({ status: 404, url: String(input), headers: new Headers(), text: async () => '<h1>Expired</h1>' });
  assert.equal(await audit(), false, 'Expired deployment is rejected');
} finally {
  globalThis.fetch = originalFetch;
  console.log = originalLog;
}
console.log('PASS: rendered routes, document languages, canonicals, reciprocal alternates, bedroom counts, schema, booking fields, click intents, 404 response and audit regressions.');
