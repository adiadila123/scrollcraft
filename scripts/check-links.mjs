/**
 * Checks every external link in the source. The footer promises the docs were checked, so this keeps that true.
 * Exit code 1 on a dead link (404, 410, DNS failure). Bot walls (401, 403, 429) are reported but do not fail.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOTS = ['components', 'lib', 'app'];
const SKIP = [/^https:\/\/stackblitz\.com\/run/, /localhost/];

async function* files(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* files(p);
    else if (/\.(tsx?|mjs)$/.test(e.name)) yield p;
  }
}

const links = new Map();
for (const root of ROOTS) {
  for await (const f of files(root)) {
    const src = await readFile(f, 'utf8');
    for (const [, url] of src.matchAll(/href[=:]\s*["'](https?:\/\/[^"']+)["']/g)) {
      if (!SKIP.some((re) => re.test(url))) links.set(url, [...(links.get(url) || []), f]);
    }
  }
}

async function check(url) {
  const opts = { redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'Mozilla/5.0 (link check; scrollcraft)' } };
  try {
    let res = await fetch(url, { ...opts, method: 'HEAD' });
    if (res.status === 405 || res.status === 404 || res.status === 403) res = await fetch(url, { ...opts, method: 'GET' });
    return res.status;
  } catch (e) {
    return e.cause?.code || e.name;
  }
}

const results = [];
const queue = [...links.keys()];
await Promise.all(
  Array.from({ length: 8 }, async () => {
    for (let url; (url = queue.shift());) results.push([url, await check(url)]);
  }),
);

let dead = 0;
for (const [url, status] of results.sort()) {
  const ok = typeof status === 'number' && status < 400;
  const soft = [401, 403, 429].includes(status);
  if (!ok && !soft) dead++;
  if (!ok) console.log(`${soft ? 'blocked' : 'DEAD   '} ${status}  ${url}\n        in ${[...new Set(links.get(url))].join(', ')}`);
}
console.log(`\n${results.length} links checked, ${dead} dead.`);
process.exit(dead ? 1 : 0);
