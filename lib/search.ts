import { chapters } from './chapters';
import { prompts } from './prompts';
import generated from './search-index.json';

export type SearchEntry = { kind: 'chapter' | 'section' | 'prompt'; chapter: string; href: string; title: string; text: string; n?: string };

/** Chapters first, then every section heading and prompt from scripts/build-search-index.mjs, then the prompt library. */
export const searchIndex: SearchEntry[] = [
  ...chapters.map((c) => ({ kind: 'chapter' as const, chapter: c.title, href: `/${c.id}`, title: c.title, text: c.summary, n: c.n })),
  ...(generated.entries as SearchEntry[]),
  ...prompts.map((p) => ({ kind: 'prompt' as const, chapter: 'Build', href: '/build#prompt-library', title: `${p.topic}: prompt`, text: p.text })),
];
