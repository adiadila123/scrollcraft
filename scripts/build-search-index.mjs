/**
 * Reads the chapters' MDX (content/<locale>) and writes lib/search-index.json: every section heading and prompt with a link
 * to its anchor, plus an estimated reading time per chapter. Runs before dev and build.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { slugify } from '../lib/slug.mjs';

const root = new URL('..', import.meta.url);
const ids = ['start', 'skills', 'prompting', 'build', 'motion', 'playground', 'advanced', 'launch'];
const locales = { en: '', ro: '/ro' };
const WPM = 230;

/* a JavaScript string literal from the MDX source, single or double quoted */
const literal = (s) => Function(`return ${s}`)();
const STR = String.raw`'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"`;

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
const squash = (s) => decode(s).replace(/\s+/g, ' ').trim();

/* chapter titles per locale, read from lib/chapters.ts so search results name the chapter in the reader's language */
const chaptersSrc = await readFile(new URL('lib/chapters.ts', root), 'utf8');
const titles = { en: {}, ro: {} };
for (const m of chaptersSrc.matchAll(/id: '([a-z]+)',\s*n: '\d+',\s*title: '([^']+)'/g)) titles.en[m[1]] = m[2];
for (const m of chaptersSrc.matchAll(/^  ([a-z]+): \{\s*title: '([^']+)'/gm)) titles.ro[m[1]] = m[2];

const entries = { en: [], ro: [] };
const reading = { en: {}, ro: {} };
for (const [locale, prefix] of Object.entries(locales)) {
  const names = titles[locale];
  const out = entries[locale];
  for (const id of ids) {
    const src = await readFile(new URL(`content/${locale}/${id}.mdx`, root), 'utf8');
    const tokens = new RegExp(String.raw`<Stick left="([^"]+)"|<Row\b([^>]*?\btitle="[^"]+"[^>]*)>|<CodeBlock\s+lang="Prompt"\s+code=\{\s*(${STR})\s*\}`, 'g');
    let anchor = '';
    let section = '';
    const seen = new Set();
    for (const m of src.matchAll(tokens)) {
      const heading = m[1] || m[2]?.match(/\btitle="([^"]+)"/)[1];
      if (heading) {
        section = squash(heading.replace(/^\s*\d+\s*·\s*/, ''));
        anchor = m[2]?.match(/\banchor="([^"]+)"/)?.[1] || slugify(heading);
        if (seen.has(anchor)) console.warn(`search index: duplicate id #${anchor} in content/${locale}/${id}.mdx`);
        seen.add(anchor);
        out.push({ kind: 'section', chapter: names[id], href: `${prefix}/${id}#${anchor}`, title: section, text: '' });
      } else {
        const text = literal(m[3]);
        out.push({ kind: 'prompt', chapter: names[id], href: `${prefix}/${id}${anchor ? `#${anchor}` : ''}`, title: section ? `${section}: prompt` : 'Prompt', text });
      }
    }
    const prose = src
      .replace(/^export const meta[\s\S]*?\n\};/m, ' ')
      .replace(/<CodeBlock[\s\S]*?\/>/g, ' ')
      .replace(/\{"[^"]*"\}/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/[{}()=;]/g, ' ');
    const count = (s) => s.split(/\s+/).filter((w) => /[a-z]{2,}/i.test(w)).length;
    /* code and prompts are skimmed rather than read, so they count for half */
    const code = [...src.matchAll(new RegExp(String.raw`code=\{\s*(${STR})\s*\}`, 'g'))].map((c) => literal(c[1])).join(' ');
    reading[locale][id] = Math.max(1, Math.round((count(prose) + count(code) / 2) / WPM));
  }
}

await writeFile(new URL('lib/search-index.json', root), JSON.stringify({ reading, entries }, null, 1) + '\n');
console.log(`search index: ${entries.en.length} + ${entries.ro.length} entries, reading times ${JSON.stringify(reading)}`);
