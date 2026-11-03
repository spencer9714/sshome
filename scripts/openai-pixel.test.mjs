import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const code = ts.transpileModule(await readFile('src/lib/openai-pixel.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const exports = {};
vm.runInNewContext(code, { exports });
function mount(hostname = 'www.sshomedesigns.com') {
  const listeners = {}, scripts = [];
  class Element {
    constructor(attrs) { this.attrs = attrs; }
    getAttribute(key) { return this.attrs[key] ?? null; }
    closest() { return this; }
  }
  class HTMLFormElement extends Element {}
  const window = { location: { hostname, origin: `https://${hostname}` } };
  const context = vm.createContext({ window, URL, Element, HTMLFormElement,
    document: { createElement: () => ({}), head: { appendChild: s => scripts.push(s) }, addEventListener: (n, fn) => { listeners[n] = fn; } } });
  const bootstrap = () => vm.runInContext(exports.openAIAdsBootstrap(exports.openAIAdsPixelId), context);
  bootstrap();
  return { window, scripts, listeners, Element, HTMLFormElement, bootstrap };
}
test('pixel initializes once on production, never on local or preview hosts', () => {
  const live = mount(); live.bootstrap();
  assert.equal(live.scripts.length, 1);
  assert.equal(live.window.oaiq.q[0][1].pixelId, 'LudhL2fb31yULUmELz6oZB');
  assert.equal(live.window.oaiq.q[0][1].debug, false);
  for (const host of ['localhost', 'preview.vercel.app']) assert.equal(mount(host).scripts.length, 0);
});
test('valid date submission sends custom intent events without purchase or travel details', () => {
  const live = mount();
  live.listeners.submit({ target: new live.HTMLFormElement({ action: 'https://www.airbnb.com/rooms/1800164576342497106?check_in=2026-12-01&guests=8' }) });
  const calls = live.window.oaiq.q.slice(1);
  assert.deepEqual(Array.from(calls, c => c[3].custom_event_name), ['airbnb_click', 'airbnb_date_search']);
  assert.ok(calls.every(c => c[1] === 'custom' && c[2].type === 'custom' && c[3].opt_out));
  assert.ok(!JSON.stringify(calls).includes('2026-12-01'));
});
test('reviews, prevented submits, unrelated links and spoofed URLs do not send conversions', () => {
  const live = mount();
  for (const href of ['https://www.airbnb.com.evil.test/rooms/1800164576342497106', '/about']) live.listeners.click({ target: new live.Element({ href }) });
  live.listeners.click({ target: new live.Element({ href: '/go/desert', 'data-airbnb-intent': 'reviews' }) });
  live.listeners.submit({ defaultPrevented: true, target: new live.HTMLFormElement({ action: '/go/desert' }) });
  assert.equal(live.window.oaiq.q.length, 1);
  live.listeners.click({ target: new live.Element({ href: '/go/family' }) });
  assert.equal(live.window.oaiq.q[1][3].custom_event_name, 'airbnb_click');
});
