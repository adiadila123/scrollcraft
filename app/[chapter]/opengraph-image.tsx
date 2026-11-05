import { chapters, getChapter } from '@/lib/chapters';
import { ogImage, OG_SIZE } from '@/lib/og';

export const alt = 'Scrollcraft chapter';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const generateStaticParams = () => chapters.map((c) => ({ chapter: c.id }));

export default async function Image({ params }: { params: Promise<{ chapter: string }> }) {
  const c = getChapter((await params).chapter)!;
  return ogImage({ kicker: `Chapter ${c.n} · ${c.desc}`, title: c.title, sub: c.summary });
}
