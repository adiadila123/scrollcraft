import type { ReactNode } from 'react';
import ChapterHead from '@/components/chapter/ChapterHead';
import ChapterRail from '@/components/chapter/ChapterRail';
import { chapters, getChapter } from '@/lib/chapters';
import { dicts } from '@/lib/dict';
import type { Locale } from '@/lib/i18n';
import { highlight } from '@/lib/highlight';
import { readingMinutes } from '@/lib/reading';
import { slugify } from '@/lib/slug.mjs';
import CodeFrame from './CodeFrame';

export { PlatformPanel, PlatformTabs } from './PlatformTabs';
export { CodeFrame };

/** A copyable code block, syntax highlighted at build time. Prompts and plain text stay unstyled. */
export async function CodeBlock({ lang, code, codeId }: { lang: string; code: string; codeId?: string }) {
  const lines = await highlight(code, lang);
  if (!lines) return <CodeFrame lang={lang} code={code} codeId={codeId} />;
  return (
    <CodeFrame lang={lang} codeId={codeId}>
      {lines.map((line, i) => (
        <span key={i}>
          {line.map((t, j) => (
            <span key={j} style={{ color: t.color }}>
              {t.content}
            </span>
          ))}
          {i < lines.length - 1 ? '\n' : null}
        </span>
      ))}
    </CodeFrame>
  );
}

/** A ruled row with a label on the left and content on the right. String titles get an id so search can link to them. */
export function Row({ num, title, cls, anchor, children }: { num: ReactNode; title: ReactNode; cls?: string; anchor?: string; children?: ReactNode }) {
  const id = anchor ?? (typeof title === 'string' ? slugify(title) : undefined);
  return (
    <div className={cls ? `row ${cls}` : 'row'} id={id}>
      <div className="k">
        <span className="mono">{num}</span>
        <h3>{title}</h3>
      </div>
      <div className="body">{children}</div>
    </div>
  );
}

/** A grid cell with an optional mono label, a heading and a paragraph. */
export function Cell({ mono, title, children }: { mono?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div>
      {mono ? <span className="mono">{mono}</span> : null}
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return <div className="callout">{children}</div>;
}

/** Sticky section label with an optional right-hand note. */
export function Stick({ left, right }: { left: string; right?: ReactNode }) {
  return (
    <div className="stick" id={slugify(left)}>
      <h2 className="mono stick-h" tabIndex={-1}>
        {left}
      </h2>
      {right ? <span className="mono">{right}</span> : null}
    </div>
  );
}

/** The end of a chapter: a band that leads into the next one. */
export { default as NextBand } from '@/components/chapter/NextBand';

/** The opening screen of a chapter. Number, particle art and reading time come from lib/chapters.ts. */
export function PageHead({ chapter, locale = 'en', title, lede }: { chapter: string; locale?: Locale; title: ReactNode; lede: ReactNode }) {
  const c = getChapter(chapter, locale)!;
  return <ChapterHead id={c.id} n={c.n} total={chapters.length} art={c.art} mins={readingMinutes(c.id, locale)} title={title} lede={lede} />;
}

export function PageBody({ children }: { children: ReactNode }) {
  return <div className="wrap pg">{children}</div>;
}

/** One chapter view, with its section rail. The enter animation runs on mount, so it plays on every client-side navigation. */
export function Page({ route, locale = 'en', children }: { route: string; locale?: Locale; children: ReactNode }) {
  const c = getChapter(route, locale);
  return (
    <div className="page enter" data-route={route} aria-label={c ? dicts[locale].chapter.link(Number(c.n), c.title) : undefined}>
      {c ? <ChapterRail /> : null}
      {children}
    </div>
  );
}
