import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import { campaignLinks } from './campaign-links.mjs';

const config = JSON.parse(await readFile(new URL('../src/data/tracking-config.json', import.meta.url), 'utf8'));
const compile = async (path) => ts.transpileModule(await readFile(new URL(path, import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;
const trackingCode = await compile('../src/lib/tracking.ts');
const tracking = {};
vm.runInNewContext(trackingCode, { exports: tracking, require: () => config, URL });
const analyticsCode = await compile('../src/components/analytics.tsx');

function mount(host = 'www.sshomedesigns.com', search = '', env = {}) {
  const listeners = {};
  const exports = {};
  class Element {
    constructor(attrs) { this.attrs = attrs; this.tagName = 'A'; }
    getAttribute(key) { return this.attrs[key] ?? null; }
    closest() { return this; }
  }
  class HTMLFormElement extends Element {
    constructor(attrs) { super(attrs); this.tagName = 'FORM'; }
  }
  const window = { location: { hostname: host, origin: `https://${host}`, pathname: '/stays/test', search } };
  vm.runInNewContext(analyticsCode, {
    exports, process: { env }, window, Element, HTMLFormElement, URL, URLSearchParams, Date,
    document: { addEventListener: (name, handler) => { listeners[name] = handler; }, removeEventListener: () => {} },
    require: (name) => name === 'react' ? { useState: () => [false, () => {}], useEffect: (fn) => fn() }
      : name === '@/data/tracking-config.json' ? config : name === '@/lib/tracking' ? tracking : { jsx: () => null },
  });
  exports.Analytics();
  return { listeners, window, Element, HTMLFormElement };
}

test('production initializes the correct property; local, previews and disabled properties do not', () => {
  const live = mount();
  assert.equal(live.window.dataLayer[1][1], 'G-FR9GRK5P0E');
  for (const host of ['localhost', 'sshome-preview.vercel.app']) assert.equal(mount(host).window.dataLayer, undefined);
  assert.equal(mount('www.sshomedesigns.com', '', { NEXT_PUBLIC_GA_MEASUREMENT_ID: '' }).window.dataLayer, undefined);
});

test('review clicks stay separate from date-search signals and omit destination queries', () => {
  const live = mount();
  live.listeners.click({ defaultPrevented: false, target: new live.Element({ href: `https://www.airbnb.com/rooms/${config.listings.family.id}?check_in=2026-12-01&guests=8`, 'data-airbnb-intent': 'reviews', 'data-booking-placement': 'review-card' }) });
  const event = live.window.dataLayer.at(-1);
  assert.equal(event[1], 'airbnb_click');
  assert.equal(event[2].listing_id, 'airbnb_1291019377672253246');
  assert.equal(event[2].intent, 'reviews');
  assert.ok(!JSON.stringify(event[2]).includes('2026-12-01'));
  assert.equal(live.window.dataLayer.filter((event) => event[1] === 'airbnb_date_search').length, 0);
});

test('date submission sends one click plus one distinct date-search event; prevented submits do not', () => {
  const live = mount();
  const target = new live.HTMLFormElement({ action: `https://www.airbnb.com/rooms/${config.listings.desert.id}`, 'data-booking-placement': 'date-form' });
  live.listeners.submit({ defaultPrevented: false, target });
  assert.equal(live.window.dataLayer.filter((event) => event[1] === 'airbnb_click').length, 1);
  assert.equal(live.window.dataLayer.filter((event) => event[1] === 'airbnb_date_search').length, 1);
  live.listeners.submit({ defaultPrevented: true, target });
  assert.equal(live.window.dataLayer.filter((event) => event[1] === 'airbnb_date_search').length, 1);
});

test('direct and short links share a stable ID; spoofed and unrelated destinations are ignored', () => {
  assert.equal(tracking.airbnbTrackingTarget('/go/family', config.siteUrl).listing_id,
    tracking.airbnbTrackingTarget(`https://www.airbnb.com/rooms/${config.listings.family.id}`, config.siteUrl).listing_id);
  for (const url of ['https://www.airbnb.com.evil.test/rooms/123', 'javascript:alert(1)', 'https://other.test/go/family', '/about']) assert.equal(tracking.airbnbTrackingTarget(url, config.siteUrl), null);
});

test('UTM links use each real landing page, with distinct languages and explicit test debug mode', () => {
  const links = campaignLinks({ source: 'chatgpt', medium: 'cpc', campaign: 'tracking_test', debug: true });
  assert.equal(links.length, 4);
  for (const link of links) {
    const url = new URL(link.url);
    assert.equal(url.origin, config.siteUrl);
    assert.ok(url.pathname.includes('/stays/'));
    assert.equal(url.searchParams.get('utm_source'), 'chatgpt');
    assert.equal(url.searchParams.get('utm_campaign'), 'tracking_test');
    assert.equal(url.searchParams.get('analytics_debug'), '1');
    assert.equal(mount('www.sshomedesigns.com', url.search).window.dataLayer[1][2].debug_mode, true);
  }
  assert.throws(() => campaignLinks({ source: 'Chat GPT', medium: 'cpc', campaign: 'launch' }));
});
