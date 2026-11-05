/** Single source of truth for the chapter list. The top bar, tab bar, sheet and footer all read from here. */
export type Chapter = { id: string; n: string; title: string; nav: string; desc: string };

export const chapters: Chapter[] = [
  { id: 'start', n: '01', title: 'Start', nav: 'Start', desc: 'Tools and setup' },
  { id: 'skills', n: '02', title: 'Skills', nav: 'Skills', desc: 'Find, install, write' },
  { id: 'prompting', n: '03', title: 'Prompting', nav: 'Prompts', desc: 'Brief the AI' },
  { id: 'build', n: '04', title: 'Build', nav: 'Build', desc: 'Steps and full example' },
  { id: 'motion', n: '05', title: 'Motion', nav: 'Motion', desc: 'Nine techniques' },
  { id: 'playground', n: '06', title: 'Playground', nav: 'Playground', desc: 'Live experiments' },
  { id: 'advanced', n: '07', title: 'Advanced', nav: 'Advanced', desc: 'GSAP, Next.js, fixes' },
  { id: 'launch', n: '08', title: 'Launch', nav: 'Launch', desc: 'Test and publish' },
];

/** The four chapters shown as tabs on a phone. The rest sit behind More. */
export const tabIds = ['start', 'skills', 'build', 'motion'];
