// Tells IndexNow engines (Bing, Yandex, Seznam, Naver and others) that pages changed.
// Bing also grounds Copilot answers. Google does not use IndexNow; use Search Console for Google.
//
// Run after a deploy has gone live:  npm run build && npm run indexnow
// Submits every URL in dist/sitemap.xml. To submit only some: npm run indexnow -- /about/ /products/nexova/
import { readFileSync, readdirSync } from 'node:fs';

const HOST = 'www.leanxdigital.io';
const keyFile = readdirSync('public').find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) throw new Error('No IndexNow key file (32 hex chars + .txt) found in /public.');
const key = keyFile.replace('.txt', '');

const args = process.argv.slice(2);
const urlList = args.length
  ? args.map((p) => new URL(p, `https://${HOST}`).href)
  : [...readFileSync('dist/sitemap.xml', 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${keyFile}`, urlList }),
});

console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URL(s)`);
if (!res.ok) console.log(await res.text());
