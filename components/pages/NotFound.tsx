import Link from 'next/link';
import { chapterHref, chaptersFor } from '@/lib/chapters';
import { dicts } from '@/lib/dict';
import type { Locale } from '@/lib/i18n';

/** The 404 page: what happened, and every chapter to choose from. */
export default function NotFound({ locale }: { locale: Locale }) {
  const t = dicts[locale].notFound;
  return (
    <div className="page enter">
      <div className="wrap pg">
        <h1 className="pg-title">{t.title}</h1>
        <p className="lede">{t.lede}</p>
        <div className="rows">
          {chaptersFor(locale).map((c) => (
            <div className="row" key={c.id}>
              <div className="k">
                <span className="mono">{c.n}</span>
                <h3>
                  <Link href={chapterHref(c.id, locale)}>{c.title}</Link>
                </h3>
              </div>
              <div className="body">
                <p>{c.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
