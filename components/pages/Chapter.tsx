import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { alternates } from '@/components/chrome/Shell';
import { NextBand, Page, PageBody, PageHead } from '@/components/ui';
import { chaptersFor, getChapter, SITE_NAME } from '@/lib/chapters';
import { chapterContent } from '@/lib/content';
import { OG_LOCALE, withLocale, type Locale } from '@/lib/i18n';
import { ogImage } from '@/lib/og';
import { dicts } from '@/lib/dict';

type Props = { params: Promise<{ chapter: string }> };

/** The pieces of a chapter route for one language; app/(en)/[chapter] and app/(ro)/ro/[chapter] export these. */
export function chapterRoute(locale: Locale) {
  const generateStaticParams = () => chaptersFor(locale).map((c) => ({ chapter: c.id }));

  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const c = getChapter((await params).chapter, locale);
    if (!c) return {};
    const title = `${c.n} ${c.title}: ${c.desc}`;
    const url = withLocale(locale, `/${c.id}`);
    return {
      title,
      description: c.summary,
      alternates: { canonical: url, languages: alternates(`/${c.id}`) },
      openGraph: { title: `${title} · ${SITE_NAME}`, description: c.summary, url, type: 'article', siteName: SITE_NAME, locale: OG_LOCALE[locale] },
    };
  }

  async function ChapterRoute({ params }: Props) {
    const id = (await params).chapter;
    const content = chapterContent(id, locale);
    if (!content) notFound();
    const { default: Body, meta } = content;
    return (
      <Page route={id} locale={locale}>
        <PageBody>
          <PageHead chapter={id} locale={locale} title={meta.title} lede={meta.lede} />
          <Body />
          <NextBand from={id} />
        </PageBody>
      </Page>
    );
  }

  async function Image({ params }: Props) {
    const c = getChapter((await params).chapter, locale)!;
    const t = dicts[locale].og;
    return ogImage({ tag: t.tag, kicker: t.chapter(c.n, c.desc), title: c.title, sub: c.summary });
  }

  return { generateStaticParams, generateMetadata, ChapterRoute, Image };
}
