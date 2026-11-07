'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { chapterHref } from '@/lib/chapters';
import { useLocale } from '@/lib/useLocale';

/** Catches a crash inside a chapter so the top bar, tab bar and footer keep working. */
export default function ChapterError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  const { locale, t: d } = useLocale();
  const t = d.error;
  return (
    <div className="page">
      <div className="wrap pg">
        <h1 className="pg-title">{t.title}</h1>
        <p className="lede">{t.lede}</p>
        <div className="ctas">
          <button className="btn" type="button" onClick={reset}>
            {t.retry}
          </button>{' '}
          <Link className="ghost" href={chapterHref('home', locale)}>
            {t.back}
          </Link>
        </div>
      </div>
    </div>
  );
}
