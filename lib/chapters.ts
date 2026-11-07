import { stripLocale, withLocale, type Locale } from './i18n';

/** Single source of truth for the chapter list. Routes, navigation, metadata, the sitemap and search all read from here. */
/** art names the particle shape drawn behind the chapter title and in the band that leads into it. */
export type Chapter = { id: string; n: string; title: string; nav: string; desc: string; summary: string; art: string };

export const chapters: Chapter[] = [
  {
    id: 'start',
    n: '01',
    title: 'Start',
    nav: 'Start',
    desc: 'Tools and setup',
    summary: 'Choose Claude, Gemini or ChatGPT, install the tools, and set up a project folder.',
    art: 'tree',
  },
  {
    id: 'skills',
    n: '02',
    title: 'Skills',
    nav: 'Skills',
    desc: 'Find, install, write',
    summary: 'What a skill is, where to find good ones, how to install them on each platform, and how to write your own.',
    art: 'blocks',
  },
  {
    id: 'prompting',
    n: '03',
    title: 'Prompting',
    nav: 'Prompts',
    desc: 'Brief the AI',
    summary: 'A five-part brief, a worked before and after, a project rules file and six steering patterns.',
    art: 'text',
  },
  {
    id: 'build',
    n: '04',
    title: 'Build',
    nav: 'Build',
    desc: 'Steps and full example',
    summary: 'Ten steps with the exact prompt for each, 24 more prompts, and a complete three-file example that was run and checked.',
    art: 'scaffold',
  },
  {
    id: 'motion',
    n: '05',
    title: 'Motion',
    nav: 'Motion',
    desc: 'Techniques and recipes',
    summary: 'The nine scroll techniques that make a site feel cinematic, and five recipes from real sites, each running live beside its code.',
    art: 'tunnel',
  },
  {
    id: 'playground',
    n: '06',
    title: 'Playground',
    nav: 'Playground',
    desc: 'Live experiments',
    summary: 'Four live experiments: smoothing, parallax speed, stagger timing and easing curves.',
    art: 'field',
  },
  {
    id: 'advanced',
    n: '07',
    title: 'Advanced',
    nav: 'Advanced',
    desc: 'GSAP, Next.js, fixes',
    summary: 'GSAP with Lenis, CSS scroll timelines, a Next.js version, performance rules, a fault table and a glossary.',
    art: 'graph',
  },
  {
    id: 'examples',
    n: '08',
    title: 'Examples',
    nav: 'Examples',
    desc: 'Three complete sites',
    summary: 'A product launch, a studio portfolio and an editorial long-read, each running live with its prompts and full code.',
    art: 'lattice',
  },
  {
    id: 'launch',
    n: '09',
    title: 'Launch',
    nav: 'Launch',
    desc: 'Test and publish',
    summary: 'Test on three screen widths, fix what breaks, and publish the folder.',
    art: 'plume',
  },
];

/** Romanian titles and descriptions; ids, numbers and art stay the same in every language. */
const ro: Record<string, Pick<Chapter, 'title' | 'nav' | 'desc' | 'summary'>> = {
  start: {
    title: 'Început',
    nav: 'Început',
    desc: 'Unelte și instalare',
    summary: 'Alegi Claude, Gemini sau ChatGPT, instalezi uneltele și pregătești un folder de proiect.',
  },
  skills: {
    title: 'Skilluri',
    nav: 'Skilluri',
    desc: 'Găsești, instalezi, scrii',
    summary: 'Ce este un skill, unde găsești skilluri bune, cum le instalezi pe fiecare platformă și cum îți scrii propriul skill.',
  },
  prompting: {
    title: 'Prompturi',
    nav: 'Prompturi',
    desc: 'Brief pentru AI',
    summary: 'Un brief în cinci părți, un exemplu înainte și după, un fișier cu regulile proiectului și șase tipare de ghidare.',
  },
  build: {
    title: 'Construcție',
    nav: 'Construcție',
    desc: 'Pași și exemplu complet',
    summary: 'Zece pași cu promptul exact pentru fiecare, încă 24 de prompturi și un exemplu complet din trei fișiere, rulat și verificat.',
  },
  motion: {
    title: 'Mișcare',
    nav: 'Mișcare',
    desc: 'Tehnici și rețete',
    summary: 'Cele nouă tehnici de scroll care dau senzația de film și cinci rețete din site-uri reale, fiecare rulând live lângă codul ei.',
  },
  playground: {
    title: 'Laborator',
    nav: 'Laborator',
    desc: 'Experimente live',
    summary: 'Patru experimente live: netezirea scrollului, viteza parallax, decalajul apariției și curbele de easing.',
  },
  advanced: {
    title: 'Avansat',
    nav: 'Avansat',
    desc: 'GSAP, Next.js, reparații',
    summary: 'GSAP cu Lenis, timeline-uri de scroll în CSS, o versiune Next.js, reguli de performanță, un tabel de erori și un glosar.',
  },
  examples: {
    title: 'Exemple',
    nav: 'Exemple',
    desc: 'Trei site-uri complete',
    summary: 'O lansare de produs, un portofoliu de studio și un articol lung, fiecare rulând live, cu prompturile și codul complet.',
  },
  launch: {
    title: 'Lansare',
    nav: 'Lansare',
    desc: 'Testezi și publici',
    summary: 'Testezi pe trei lățimi de ecran, repari ce se strică și publici folderul.',
  },
};

const byLocale: Record<Locale, Chapter[]> = { en: chapters, ro: chapters.map((c) => ({ ...c, ...ro[c.id] })) };

/** The chapter list in a language. */
export const chaptersFor = (locale: Locale = 'en') => byLocale[locale];

export const SITE_NAME = 'Scrollcraft';
export const SITE_DESCRIPTION = 'A free tutorial on building a cinematic scroll website with Claude, Gemini or ChatGPT.';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export const chapterHref = (id: string, locale: Locale = 'en') => withLocale(locale, id === 'home' ? '/' : `/${id}`);
export const getChapter = (id: string, locale: Locale = 'en') => byLocale[locale].find((c) => c.id === id);

/** The chapter id for a pathname in any language, or 'home'. */
export function routeOf(pathname: string): string {
  const id = stripLocale(pathname).split('/')[1] || 'home';
  return getChapter(id) ? id : 'home';
}

export function neighbours(id: string, locale: Locale = 'en'): { prev?: Chapter; next?: Chapter } {
  const list = byLocale[locale];
  const i = list.findIndex((c) => c.id === id);
  if (i < 0) return { next: list[0] };
  return { prev: list[i - 1], next: list[i + 1] };
}
