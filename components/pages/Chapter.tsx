import { NextBand, Page, PageBody, PageHead } from '@/components/ui';
import type { ChapterContent } from '@/lib/content';

/** Every chapter: the cinematic opening, the chapter's MDX, and the band that leads to the next one. */
export default function ChapterPage({ id, content }: { id: string; content: ChapterContent }) {
  const { default: Body, meta } = content;
  return (
    <Page route={id}>
      <PageBody>
        <PageHead chapter={id} title={meta.title} lede={meta.lede} />
        <Body />
        <NextBand from={id} />
      </PageBody>
    </Page>
  );
}
