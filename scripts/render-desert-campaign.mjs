import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { campaignLinks } from './campaign-links.mjs';

const out = resolve('marketing/desert-ready');
await mkdir(out, { recursive: true });
const slides = [
  ['covered-patio.jpg', 'STAY A LITTLE LONGER', '把住宿，也排進旅程', 'Make room\nfor the stay.', 'Sequoia 探索之旅，從 Visalia 出發', 'Your Visalia base for Sequoia adventures'],
  ['pool-baja-shelf.jpg', 'YOUR OWN OUTDOOR RETREAT', '留一個下午給自己', 'An afternoon\nwith no itinerary.', '私人泳池・泳池不加熱，依天氣安排使用', 'Private, unheated pool · Enjoy as weather allows'],
  ['turf-cornhole.jpg', 'TIME TOGETHER', '一起玩，慢慢享受', 'A little play.\nA little pause.', '在住宿也能創造旅行回憶', 'Make memories right at the house'],
  ['kitchen-1.jpg', 'COOK. SHARE. UNWIND.', '買好食材，一起煮一餐', 'Dinner is\npart of the trip.', '完整廚房，讓相聚更自在', 'A full kitchen for shared meals'],
  ['bedroom-1.jpg', 'FIVE BEDROOMS IN VISALIA', '五間臥室，好好休息', 'Room to\nsettle in.', '最多 14 人，包含額外睡眠安排；完整床位見房源', 'Up to 14 with additional sleeping arrangements; see listing'],
  ['workspace.jpg', 'DESERT RETREAT BY SSHOME', '下一趟，住這裡', 'Your next\nVisalia stay.', 'Wi-Fi 與專屬工作區｜看完整照片，Airbnb 查日期', 'Wi-Fi + dedicated workspace · Explore & check dates on Airbnb'],
];
const edge = process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const browser = spawn(edge, ['--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=9337', `--user-data-dir=${resolve('marketing/.edge-desert-profile')}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
let ws;
try {
  let tabs;
  for (let i = 0; i < 100; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9337/json')).json(); if (tabs.length) break; } catch {}
    await new Promise(r => setTimeout(r, 200));
  }
  if (!tabs?.length) throw new Error('Edge did not start');
  ws = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = ({ data }) => { const m = JSON.parse(data); if (m.id) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(m.error) : p.resolve(m.result); } };
  const call = (method, params = {}) => new Promise((resolve, reject) => { const n = ++id; pending.set(n, { resolve, reject }); ws.send(JSON.stringify({ id: n, method, params })); });
  await call('Page.enable');
  await call('Emulation.setDeviceMetricsOverride', { width: 1080, height: 1350, deviceScaleFactor: 1, mobile: false });
  for (const lang of ['zh', 'en']) {
    for (const [i, s] of slides.entries()) {
      const photo = (await readFile(`public/stays/desert-retreat/${s[0]}`)).toString('base64');
      const title = s[lang === 'zh' ? 2 : 3].replaceAll('\n', '<br>');
      const html = `<!doctype html><html lang="${lang === 'zh' ? 'zh-Hant' : 'en'}"><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;width:1080px;height:1350px;background:#f5f0e8;color:#28362e;font-family:Arial,"Microsoft JhengHei",sans-serif}.top{height:112px;padding:38px 64px;display:flex;justify-content:space-between;font-size:25px;letter-spacing:4px}.brand{font-weight:700}.photo{margin:0 40px;width:1000px;height:760px;object-fit:cover;display:block;border-radius:4px}.copy{padding:38px 64px 0}.eyebrow{font-size:18px;letter-spacing:3px;color:#687364}h1{font-size:${lang === 'zh' ? 64 : 68}px;line-height:1.12;letter-spacing:${lang === 'zh' ? '1px' : '-2px'};margin:18px 0 20px;font-weight:600}.detail{font-size:${lang === 'zh' ? 25 : 24}px;line-height:1.5;max-width:920px}.footer{position:absolute;bottom:28px;left:64px;right:64px;display:flex;justify-content:space-between;font-size:19px;letter-spacing:1px}</style><body><div class="top"><span class="brand">SSHOME</span><span>VISALIA, CALIFORNIA</span></div><img class="photo" src="data:image/jpeg;base64,${photo}"><div class="copy"><div class="eyebrow">${s[1]}</div><h1>${title}</h1><div class="detail">${s[lang === 'zh' ? 4 : 5]}</div></div><div class="footer"><span>DESERT RETREAT</span><span>${String(i + 1).padStart(2, '0')} / 06</span></div></body></html>`;
      const stem = `${lang}-${String(i + 1).padStart(2, '0')}`;
      await writeFile(`${out}/${stem}.html`, html);
      await call('Page.navigate', { url: pathToFileURL(`${out}/${stem}.html`).href });
      for (let n = 0; n < 100; n++) {
        const result = await call('Runtime.evaluate', { expression: 'document.readyState === "complete" && document.images.length === 1 && document.images[0].naturalWidth > 0' });
        if (result.result.value) break;
        await new Promise(r => setTimeout(r, 50));
      }
      await call('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
      const check = await call('Runtime.evaluate', { expression: 'document.querySelector(".detail").getBoundingClientRect().bottom < document.querySelector(".footer").getBoundingClientRect().top' });
      if (!check.result.value) throw new Error(`Text overlaps footer: ${stem}`);
      const shot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      await writeFile(`${out}/${stem}.png`, Buffer.from(shot.data, 'base64'));
      console.log(`Rendered ${stem}.png (1080 x 1350)`);
    }
  }
  const links = campaignLinks({ source: 'instagram', medium: 'social', campaign: 'sshome_desert_launch', content: 'bio_zh_v1' });
  console.log('Chinese bio:', links.find(x => x.listing === 'Desert Retreat' && x.language === 'zh-Hant').url);
  await call('Browser.close').catch(() => {});
} finally { ws?.close(); browser.kill(); }
