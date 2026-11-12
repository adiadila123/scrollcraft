import { stripLocale, withLocale, type Locale } from './i18n';

/** Single source of truth for the chapter list. Routes, navigation, metadata, the sitemap and search all read from here. */
/** art names the particle shape drawn behind the chapter title and in the band that leads into it. */
/** level groups the course: 1 foundations, 2 motion, 3 production, 4 the reference appendix. */
export type Chapter = { id: string; n: string; level: 1 | 2 | 3 | 4; title: string; nav: string; desc: string; summary: string; art: string };

export const chapters: Chapter[] = [
  {
    id: 'start',
    n: '01',
    level: 1,
    title: 'Start',
    nav: 'Start',
    desc: 'Tools and setup',
    summary: 'Choose Claude, Gemini or ChatGPT, install the tools, and set up a project folder.',
    art: 'tree',
  },
  {
    id: 'skills',
    n: '02',
    level: 1,
    title: 'Skills',
    nav: 'Skills',
    desc: 'Find, install, write',
    summary: 'What a skill is, where to find good ones, how to install them on each platform, and how to write your own.',
    art: 'blocks',
  },
  {
    id: 'prompting',
    n: '03',
    level: 1,
    title: 'Prompting',
    nav: 'Prompts',
    desc: 'Brief the AI',
    summary: 'A five-part brief, a worked before and after, a project rules file and six steering patterns.',
    art: 'text',
  },
  {
    id: 'build',
    n: '04',
    level: 1,
    title: 'Build',
    nav: 'Build',
    desc: 'Steps and full example',
    summary: 'Ten steps with the exact prompt for each, 24 more prompts, and a complete three-file example that was run and checked.',
    art: 'scaffold',
  },
  {
    id: 'motion',
    n: '05',
    level: 2,
    title: 'Motion',
    nav: 'Motion',
    desc: 'Techniques and recipes',
    summary: 'The nine scroll techniques that make a site feel cinematic, and five recipes from real sites, each running live beside its code.',
    art: 'tunnel',
  },
  {
    id: 'playground',
    n: '06',
    level: 2,
    title: 'Playground',
    nav: 'Playground',
    desc: 'Live experiments',
    summary: 'Four live experiments: smoothing, parallax speed, stagger timing and easing curves.',
    art: 'field',
  },
  {
    id: 'gsap',
    n: '07',
    level: 2,
    title: 'GSAP',
    nav: 'GSAP',
    desc: 'Timelines and ScrollTrigger',
    summary: 'Timelines, scrubbed and pinned scenes, SVG drawing and split-line text with GSAP, each running live beside its code.',
    art: 'wave',
  },
  {
    id: 'webgl',
    n: '08',
    level: 2,
    title: 'WebGL',
    nav: 'WebGL',
    desc: 'Three.js and shaders',
    summary: 'A three.js scene driven by scroll, particles moved on the GPU, a full-screen shader and a dissolve between two scenes.',
    art: 'torus',
  },
  {
    id: 'examples',
    n: '09',
    level: 2,
    title: 'Examples',
    nav: 'Examples',
    desc: 'Five portfolio projects',
    summary:
      'Five portfolio projects: a product launch, a studio portfolio, a long-read, an agency case study in GSAP and a product in WebGL. Each runs live, responsive and calm under reduced motion, with a brief, prompts and full code.',
    art: 'lattice',
  },
  {
    id: 'design',
    n: '10',
    level: 3,
    title: 'Design systems',
    nav: 'Design',
    desc: 'Tokens and rules',
    summary: 'Colour, type, spacing and motion as tokens, components that only read them, and a design file the AI follows.',
    art: 'rings',
  },
  {
    id: 'architecture',
    n: '11',
    level: 3,
    title: 'Architecture',
    nav: 'Architecture',
    desc: 'Stack, structure, cleanup',
    summary: 'Choosing a stack, a folder structure that scales, one animation loop for the whole site, and effects that clean up after themselves.',
    art: 'net',
  },
  {
    id: 'performance',
    n: '12',
    level: 3,
    title: 'Performance',
    nav: 'Performance',
    desc: 'Fast on a real phone',
    summary: 'Core Web Vitals, a budget for images, video and fonts, the rules that keep scrolling smooth, and how to measure.',
    art: 'stream',
  },
  {
    id: 'testing',
    n: '13',
    level: 3,
    title: 'Testing and QA',
    nav: 'Testing',
    desc: 'Check before you ship',
    summary: 'A release checklist, browser tests with Playwright, an accessibility audit, screenshot comparisons and real devices.',
    art: 'terrain',
  },
  {
    id: 'launch',
    n: '14',
    level: 3,
    title: 'Production and launch',
    nav: 'Launch',
    desc: 'Publish and maintain',
    summary: 'Publish a static folder or a Next.js app, connect a domain, add metadata, automate checks, and keep the site healthy.',
    art: 'plume',
  },
  {
    id: 'reference',
    n: '15',
    level: 4,
    title: 'Reference',
    nav: 'Reference',
    desc: 'Fixes and terms',
    summary: 'A table of common faults with their causes and fixes, and a glossary of the terms used in the course.',
    art: 'graph',
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
  gsap: {
    title: 'GSAP',
    nav: 'GSAP',
    desc: 'Timeline-uri și ScrollTrigger',
    summary: 'Timeline-uri, scene derulate și fixate, desen SVG și text împărțit pe rânduri cu GSAP, fiecare rulând live lângă codul lui.',
  },
  webgl: {
    title: 'WebGL',
    nav: 'WebGL',
    desc: 'Three.js și shadere',
    summary: 'O scenă three.js condusă de scroll, particule mutate pe placa video, un shader pe tot ecranul și o tranziție între două scene.',
  },
  examples: {
    title: 'Exemple',
    nav: 'Exemple',
    desc: 'Cinci proiecte de portofoliu',
    summary:
      'Cinci proiecte de portofoliu: o lansare de produs, un portofoliu de studio, un articol lung, un studiu de caz în GSAP și un produs în WebGL. Fiecare rulează live, responsive și liniștit cu mișcare redusă, cu brief, prompturi și cod complet.',
  },
  design: {
    title: 'Design systems',
    nav: 'Design',
    desc: 'Tokenuri și reguli',
    summary: 'Culoare, tipografie, spațiere și mișcare ca tokenuri, componente care doar le citesc și un fișier de design pe care AI-ul îl urmează.',
  },
  architecture: {
    title: 'Arhitectură',
    nav: 'Arhitectură',
    desc: 'Tehnologii, structură, curățenie',
    summary: 'Cum alegi tehnologiile, o structură de foldere care crește, o singură buclă de animație pentru tot site-ul și efecte care se curăță singure.',
  },
  performance: {
    title: 'Performanță',
    nav: 'Performanță',
    desc: 'Rapid pe un telefon real',
    summary: 'Core Web Vitals, un buget pentru imagini, video și fonturi, regulile care păstrează scrollul fluid și cum măsori.',
  },
  testing: {
    title: 'Testare și QA',
    nav: 'Testare',
    desc: 'Verifici înainte să publici',
    summary: 'O listă de verificare pentru lansare, teste în browser cu Playwright, un audit de accesibilitate, comparații de capturi și dispozitive reale.',
  },
  launch: {
    title: 'Producție și lansare',
    nav: 'Lansare',
    desc: 'Publici și întreții',
    summary: 'Publici un folder static sau o aplicație Next.js, legi un domeniu, adaugi metadate, automatizezi verificările și ții site-ul sănătos.',
  },
  reference: {
    title: 'Referință',
    nav: 'Referință',
    desc: 'Reparații și termeni',
    summary: 'Un tabel cu problemele frecvente, cauzele și reparațiile lor, și un glosar al termenilor folosiți în curs.',
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
