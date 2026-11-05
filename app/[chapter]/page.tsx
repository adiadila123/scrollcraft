import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ComponentType } from 'react';
import AdvancedPage from '@/components/pages/Advanced';
import BuildPage from '@/components/pages/Build';
import LaunchPage from '@/components/pages/Launch';
import MotionPage from '@/components/pages/Motion';
import PlaygroundPage from '@/components/pages/Playground';
import PromptingPage from '@/components/pages/Prompting';
import SkillsPage from '@/components/pages/Skills';
import StartPage from '@/components/pages/Start';
import { chapters, getChapter, SITE_NAME } from '@/lib/chapters';

const PAGES: Record<string, ComponentType> = {
  start: StartPage,
  skills: SkillsPage,
  prompting: PromptingPage,
  build: BuildPage,
  motion: MotionPage,
  playground: PlaygroundPage,
  advanced: AdvancedPage,
  launch: LaunchPage,
};

type Props = { params: Promise<{ chapter: string }> };

/** Every chapter is prerendered at build time. Any other path is a 404. */
export const dynamicParams = false;
export const generateStaticParams = () => chapters.map((c) => ({ chapter: c.id }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getChapter((await params).chapter);
  if (!c) return {};
  const title = `${c.n} ${c.title}: ${c.desc}`;
  return {
    title,
    description: c.summary,
    alternates: { canonical: `/${c.id}` },
    openGraph: { title: `${title} · ${SITE_NAME}`, description: c.summary, url: `/${c.id}`, type: 'article', siteName: SITE_NAME, locale: 'en_GB' },
  };
}

export default async function ChapterRoute({ params }: Props) {
  const Page = PAGES[(await params).chapter];
  if (!Page) notFound();
  return <Page />;
}
