import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

// The input contains only public businesses and rounded neighborhood centers.
const source = await readFile('src/data/neighborhoods.ts', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const data = {};
vm.runInNewContext(code, { exports: data, Math, encodeURIComponent });
await mkdir('public/maps/visalia', { recursive: true });
const tiles = new Set();
for (const { bounds } of Object.values(data.neighborhoods)) {
  const a = data.mapPoint(bounds.north, bounds.west);
  const b = data.mapPoint(bounds.south, bounds.east);
  for (let x = Math.floor(a.x / 256); x <= Math.floor(b.x / 256); x++) {
    for (let y = Math.floor(a.y / 256); y <= Math.floor(b.y / 256); y++) tiles.add(`${data.mapZoom}/${x}/${y}`);
  }
}
for (const tile of tiles) {
  const path = `public/maps/visalia/${tile.replaceAll('/', '-')}.png`;
  try { await access(path); continue; } catch {}
  const response = await fetch(`https://tile.openstreetmap.org/${tile}.png`, {
    headers: { 'User-Agent': 'SSHOME-Neighborhood-Map/1.0 (https://www.sshomedesigns.com/about)' },
  });
  if (!response.ok || !response.headers.get('content-type')?.includes('image/png')) throw new Error(`Map tile failed: ${response.status}`);
  await writeFile(path, Buffer.from(await response.arrayBuffer()));
}
console.log(`Ready: ${tiles.size} neighborhood map tiles. Attribution is displayed in the map component.`);
