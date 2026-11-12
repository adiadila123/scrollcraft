import 'server-only';
import type { ComponentType } from 'react';
import type { Locale } from './i18n';
import * as en_architecture from '@/content/en/architecture.mdx';
import * as en_build from '@/content/en/build.mdx';
import * as en_design from '@/content/en/design.mdx';
import * as en_examples from '@/content/en/examples.mdx';
import * as en_gsap from '@/content/en/gsap.mdx';
import * as en_launch from '@/content/en/launch.mdx';
import * as en_motion from '@/content/en/motion.mdx';
import * as en_performance from '@/content/en/performance.mdx';
import * as en_playground from '@/content/en/playground.mdx';
import * as en_prompting from '@/content/en/prompting.mdx';
import * as en_reference from '@/content/en/reference.mdx';
import * as en_skills from '@/content/en/skills.mdx';
import * as en_start from '@/content/en/start.mdx';
import * as en_testing from '@/content/en/testing.mdx';
import * as en_webgl from '@/content/en/webgl.mdx';
import * as ro_architecture from '@/content/ro/architecture.mdx';
import * as ro_build from '@/content/ro/build.mdx';
import * as ro_design from '@/content/ro/design.mdx';
import * as ro_examples from '@/content/ro/examples.mdx';
import * as ro_gsap from '@/content/ro/gsap.mdx';
import * as ro_launch from '@/content/ro/launch.mdx';
import * as ro_motion from '@/content/ro/motion.mdx';
import * as ro_performance from '@/content/ro/performance.mdx';
import * as ro_playground from '@/content/ro/playground.mdx';
import * as ro_prompting from '@/content/ro/prompting.mdx';
import * as ro_reference from '@/content/ro/reference.mdx';
import * as ro_skills from '@/content/ro/skills.mdx';
import * as ro_start from '@/content/ro/start.mdx';
import * as ro_testing from '@/content/ro/testing.mdx';
import * as ro_webgl from '@/content/ro/webgl.mdx';

/** A chapter's text: the MDX body, plus the title and lede for its opening. */
export type ChapterContent = { default: ComponentType; meta: { title: string; lede: string } };

const content: Record<Locale, Record<string, ChapterContent>> = {
  en: {
    start: en_start,
    skills: en_skills,
    prompting: en_prompting,
    build: en_build,
    motion: en_motion,
    playground: en_playground,
    gsap: en_gsap,
    webgl: en_webgl,
    examples: en_examples,
    design: en_design,
    architecture: en_architecture,
    performance: en_performance,
    testing: en_testing,
    launch: en_launch,
    reference: en_reference,
  },
  ro: {
    start: ro_start,
    skills: ro_skills,
    prompting: ro_prompting,
    build: ro_build,
    motion: ro_motion,
    playground: ro_playground,
    gsap: ro_gsap,
    webgl: ro_webgl,
    examples: ro_examples,
    design: ro_design,
    architecture: ro_architecture,
    performance: ro_performance,
    testing: ro_testing,
    launch: ro_launch,
    reference: ro_reference,
  },
};

export function chapterContent(id: string, locale: Locale): ChapterContent | undefined {
  return content[locale][id];
}
