import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChapterPage from '@/components/pages/Chapter';
import { chapters, getChapter, SITE_NAME } from '@/lib/chapters';
import { chapterContent } from '@/lib/content';

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
  const id = (await params).chapter;
  const content = chapterContent(id);
  if (!content) notFound();
  return <ChapterPage id={id} content={content} />;
}
