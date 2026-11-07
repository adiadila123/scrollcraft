import type { Locale } from './i18n';

/** The complete sites in the Examples chapter, in reading order. Their files live in public/examples/<id>/. */
export type ExampleSite = { id: string; name: string; kind: Record<Locale, string> };

export const exampleSites: ExampleSite[] = [
  { id: 'launch', name: 'Orbit One', kind: { en: 'Product launch', ro: 'Lansare de produs' } },
  { id: 'portfolio', name: 'Field Studio', kind: { en: 'Studio portfolio', ro: 'Portofoliu de studio' } },
  { id: 'longread', name: 'The Long Way North', kind: { en: 'Editorial long-read', ro: 'Articol lung' } },
];

export const getExampleSite = (id: string) => exampleSites.find((s) => s.id === id);
