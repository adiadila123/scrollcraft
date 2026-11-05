/** Single source of truth for the chapter list. Routes, navigation, metadata, the sitemap and search all read from here. */
export type Chapter = { id: string; n: string; title: string; nav: string; desc: string; summary: string };

export const chapters: Chapter[] = [
  {
    id: 'start',
    n: '01',
    title: 'Start',
    nav: 'Start',
    desc: 'Tools and setup',
    summary: 'Choose Claude, Gemini or ChatGPT, install the tools, and set up a project folder.',
  },
  {
    id: 'skills',
    n: '02',
    title: 'Skills',
    nav: 'Skills',
    desc: 'Find, install, write',
    summary: 'What a skill is, where to find good ones, how to install them on each platform, and how to write your own.',
  },
  {
    id: 'prompting',
    n: '03',
    title: 'Prompting',
    nav: 'Prompts',
    desc: 'Brief the AI',
    summary: 'A five-part brief, a worked before and after, a project rules file and six steering patterns.',
  },
  {
    id: 'build',
    n: '04',
    title: 'Build',
    nav: 'Build',
    desc: 'Steps and full example',
    summary: 'Ten steps with the exact prompt for each, 24 more prompts, and a complete three-file example that was run and checked.',
  },
  {
    id: 'motion',
    n: '05',
    title: 'Motion',
    nav: 'Motion',
    desc: 'Nine techniques',
    summary: 'The nine scroll techniques that make a site feel cinematic, each with code you can paste.',
  },
  {
    id: 'playground',
    n: '06',
    title: 'Playground',
    nav: 'Playground',
    desc: 'Live experiments',
    summary: 'Four live experiments: smoothing, parallax speed, stagger timing and easing curves.',
  },
  {
    id: 'advanced',
    n: '07',
    title: 'Advanced',
    nav: 'Advanced',
    desc: 'GSAP, Next.js, fixes',
    summary: 'GSAP with Lenis, CSS scroll timelines, a Next.js version, performance rules, a fault table and a glossary.',
  },
  {
    id: 'launch',
    n: '08',
    title: 'Launch',
    nav: 'Launch',
    desc: 'Test and publish',
    summary: 'Test on three screen widths, fix what breaks, and publish the folder.',
  },
];

/** The four chapters shown as tabs on a phone. The rest sit behind More. */
export const tabIds = ['start', 'skills', 'build', 'motion'];

export const SITE_NAME = 'Scrollcraft';
export const SITE_DESCRIPTION = 'A free tutorial on building a cinematic scroll website with Claude, Gemini or ChatGPT.';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export const chapterHref = (id: string) => (id === 'home' ? '/' : `/${id}`);
export const getChapter = (id: string) => chapters.find((c) => c.id === id);

/** The chapter id for a pathname, or 'home'. */
export function routeOf(pathname: string): string {
  const id = pathname.split('/')[1] || 'home';
  return getChapter(id) ? id : 'home';
}

export function neighbours(id: string): { prev?: Chapter; next?: Chapter } {
  const i = chapters.findIndex((c) => c.id === id);
  if (i < 0) return { next: chapters[0] };
  return { prev: chapters[i - 1], next: chapters[i + 1] };
}
