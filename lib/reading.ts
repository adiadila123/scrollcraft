import type { Locale } from './i18n';
import generated from './search-index.json';

/** Estimated minutes to read a chapter in a language, computed by scripts/build-search-index.mjs. */
export function readingMinutes(id: string, locale: Locale = 'en'): number | undefined {
  return (generated.reading as Record<Locale, Record<string, number>>)[locale][id];
}
