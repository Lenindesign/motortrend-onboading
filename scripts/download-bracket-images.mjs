// Downloads each F-Series generation photo listed in the bracket mock data
// into public/images/brackets/f-series/gen-<n>.<ext>.
// Run from the repo root: node scripts/download-bracket-images.mjs
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const dataPath = 'src/data/brackets/f-series-generations.mock.json';
const outDir = 'public/images/brackets/f-series';
const extByType = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

const data = JSON.parse(await readFile(dataPath, 'utf8'));
await mkdir(outDir, { recursive: true });

for (const g of data.generations) {
  if (!g.image) { console.log(`gen-${g.generation}: no image URL, skipped`); continue; }
  const url = g.image.replace('format=webp', 'format=jpg');
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'MotorTrendPrototype/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = (res.headers.get('content-type') || '').split(';')[0];
    const ext = extByType[type] || 'jpg';
    const file = path.join(outDir, `gen-${g.generation}.${ext}`);
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
    console.log(`gen-${g.generation}: saved ${file}`);
  } catch (err) {
    console.log(`gen-${g.generation}: failed (${err.message})`);
  }
}
