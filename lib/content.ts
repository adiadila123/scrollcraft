import 'server-only';
import type { ComponentType } from 'react';
import type { Locale } from './i18n';
import * as en_advanced from '@/content/en/advanced.mdx';
import * as en_build from '@/content/en/build.mdx';
import * as en_launch from '@/content/en/launch.mdx';
import * as en_motion from '@/content/en/motion.mdx';
import * as en_playground from '@/content/en/playground.mdx';
import * as en_prompting from '@/content/en/prompting.mdx';
import * as en_skills from '@/content/en/skills.mdx';
import * as en_start from '@/content/en/start.mdx';
import * as ro_advanced from '@/content/ro/advanced.mdx';
import * as ro_build from '@/content/ro/build.mdx';
import * as ro_launch from '@/content/ro/launch.mdx';
import * as ro_motion from '@/content/ro/motion.mdx';
import * as ro_playground from '@/content/ro/playground.mdx';
import * as ro_prompting from '@/content/ro/prompting.mdx';
import * as ro_skills from '@/content/ro/skills.mdx';
import * as ro_start from '@/content/ro/start.mdx';

/** A chapter's text: the MDX body, plus the title and lede for its opening. */
export type ChapterContent = { default: ComponentType; meta: { title: string; lede: string } };

const content: Record<Locale, Record<string, ChapterContent>> = {
  en: { start: en_start, skills: en_skills, prompting: en_prompting, build: en_build, motion: en_motion, playground: en_playground, advanced: en_advanced, launch: en_launch },
  ro: { start: ro_start, skills: ro_skills, prompting: ro_prompting, build: ro_build, motion: ro_motion, playground: ro_playground, advanced: ro_advanced, launch: ro_launch },
};

export function chapterContent(id: string, locale: Locale): ChapterContent | undefined {
  return content[locale][id];
}
