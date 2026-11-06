import 'server-only';
import type { ComponentType } from 'react';
import * as advanced from '@/content/en/advanced.mdx';
import * as build from '@/content/en/build.mdx';
import * as launch from '@/content/en/launch.mdx';
import * as motion from '@/content/en/motion.mdx';
import * as playground from '@/content/en/playground.mdx';
import * as prompting from '@/content/en/prompting.mdx';
import * as skills from '@/content/en/skills.mdx';
import * as start from '@/content/en/start.mdx';

/** A chapter's text: the MDX body, plus the title and lede for its opening. */
export type ChapterContent = { default: ComponentType; meta: { title: string; lede: string } };

const en: Record<string, ChapterContent> = { start, skills, prompting, build, motion, playground, advanced, launch };

export function chapterContent(id: string): ChapterContent | undefined {
  return en[id];
}
