import generated from './search-index.json';

/** Estimated minutes to read a chapter, computed by scripts/build-search-index.mjs. */
export function readingMinutes(id: string): number | undefined {
  return (generated.reading as Record<string, number>)[id];
}
