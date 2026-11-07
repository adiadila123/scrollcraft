import Link from 'next/link';
import type { CSSProperties } from 'react';
import Hero from '@/components/home/Hero';
import Loader from '@/components/home/Loader';
import { ParallaxBand, Resume, Statement, ZoomFigure } from '@/components/home/ScrollFx';
import { Cell, Page, Row } from '@/components/ui';
import { chapterHref, chaptersFor } from '@/lib/chapters';
import { dicts } from '@/lib/dict';
import type { Locale } from '@/lib/i18n';

export default function HomePage({ locale }: { locale: Locale }) {
  const t = dicts[locale].home;
  const start = chapterHref('start', locale);
  return (
    <Page route="home" locale={locale}>
      <Loader />
      <Hero
        copy={
          <>
            <h1>
              <span>{t.titleA}</span>
              <span>{t.titleB}</span>
            </h1>
            <p className="lede">{t.lede}</p>
            <div className="ctas">
              <Link className="btn" href={start} data-magnetic="">
                {t.start} <span aria-hidden="true">→</span>
              </Link>{' '}
              <Link className="ghost" href={chapterHref('motion', locale)}>
                {t.techniques}
              </Link>
            </div>
            <Resume />
          </>
        }
        foot={
          <>
            {t.foot.map((f) => (
              <div key={f}>{f}</div>
            ))}
          </>
        }
      />
      <Statement text={t.statement} dim={t.statementDim} />
      <ZoomFigure />
      <section className="wrap sec rows-sec">
        <div className="sec-head rv">
          <h2 style={{ maxWidth: '18ch' } as CSSProperties}>{t.eight}</h2>
        </div>
        <div className="rows">
          {chaptersFor(locale).map((c) => (
            <Row key={c.id} cls="rv" num={c.n} title={<Link href={chapterHref(c.id, locale)}>{c.title}</Link>}>
              <p>{c.summary}</p>
            </Row>
          ))}
        </div>
      </section>
      <section className="wrap sec rv">
        <div className="sec-head">
          <h2 style={{ maxWidth: '20ch' } as CSSProperties}>{t.four}</h2>
        </div>
        <div className="cells">
          {t.cells.map(([title, text], i) => (
            <Cell key={title} mono={String(i + 1).padStart(2, '0')} title={title}>
              <p>{text}</p>
            </Cell>
          ))}
        </div>
      </section>
      <ParallaxBand>
        <div className="wrap band rv">
          <h2 style={{ maxWidth: '16ch' } as CSSProperties}>{t.closing}</h2>
          <Link className="btn" href={start} data-magnetic="">
            {t.start} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </ParallaxBand>
    </Page>
  );
}
