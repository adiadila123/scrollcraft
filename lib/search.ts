import { chaptersFor } from './chapters';
import type { Locale } from './i18n';
import { withLocale } from './i18n';
import { prompts } from './prompts';
import generated from './search-index.json';

export type SearchEntry = { kind: 'chapter' | 'section' | 'prompt'; chapter: string; href: string; title: string; text: string; n?: string };

/** Chapters first, then every section heading and prompt from scripts/build-search-index.mjs, then the prompt library. */
export function searchIndex(locale: Locale): SearchEntry[] {
  const chapters = chaptersFor(locale);
  const build = chapters.find((c) => c.id === 'build')!;
  return [
    ...chapters.map((c) => ({ kind: 'chapter' as const, chapter: c.title, href: withLocale(locale, `/${c.id}`), title: c.title, text: c.summary, n: c.n })),
    ...((generated.entries as Record<Locale, SearchEntry[]>)[locale] ?? []),
    ...prompts[locale].map((p) => ({ kind: 'prompt' as const, chapter: build.title, href: withLocale(locale, '/build#prompt-library'), title: `${p.topic}: prompt`, text: p.text })),
  ];
}
