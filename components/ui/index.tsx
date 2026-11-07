import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { ReactNode } from 'react';
import Link from 'next/link';
import OpenInStackBlitz from '@/components/build/OpenInStackBlitz';
import ChapterHead from '@/components/chapter/ChapterHead';
import ChapterRail from '@/components/chapter/ChapterRail';
import { chapters, getChapter } from '@/lib/chapters';
import { dicts } from '@/lib/dict';
import { withLocale, type Locale } from '@/lib/i18n';
import { highlight } from '@/lib/highlight';
import { readingMinutes } from '@/lib/reading';
import { slugify } from '@/lib/slug.mjs';
import { demoDocument, demos } from '@/lib/demos';
import CodeFrame from './CodeFrame';
import DemoView from './DemoView';

export { PlatformPanel, PlatformTabs } from './PlatformTabs';

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

/** A live preview of one demo from lib/demos.ts beside its highlighted HTML, CSS and JavaScript. */
export function Demo({ id, name, locale = 'en' }: { id: string; name: string; locale?: Locale }) {
  const d = demos[id];
  if (!d) throw new Error(`Unknown demo "${id}"`);
  const files = [
    { label: 'HTML', node: <CodeBlock lang="HTML" code={d.html} /> },
    { label: 'CSS', node: <CodeBlock lang="CSS" code={d.css} /> },
    ...(d.js ? [{ label: 'JS', node: <CodeBlock lang="JavaScript" code={d.js} /> }] : []),
  ];
  return <DemoView name={name} doc={demoDocument(d, dicts[locale].demo.hint)} files={files} />;
}

const SITE_FILES = ['index.html', 'style.css', 'app.js'];

/** A complete example site from public/examples/<id>: running in a frame, every file readable, and editable on StackBlitz. */
export async function Example({ id, name, locale = 'en' }: { id: string; name: string; locale?: Locale }) {
  const dir = path.join(process.cwd(), 'public', 'examples', id);
  const code = Object.fromEntries(await Promise.all(SITE_FILES.map(async (f) => [f, await readFile(path.join(dir, f), 'utf8')] as const)));
  const t = dicts[locale].examples;
  return (
    <>
      <DemoView
        id={`site-${id}`}
        name={name}
        src={`/examples/${id}/index.html`}
        full={t.full}
        fullHref={withLocale(locale, `/examples/${id}`)}
        files={SITE_FILES.map((f) => ({ label: f, node: <CodeBlock lang={f} code={code[f]} /> }))}
      />
      <div className="ex-ctas">
        <Link className="btn" href={withLocale(locale, `/examples/${id}`)} data-magnetic="">
          {t.full} <span aria-hidden="true">→</span>
        </Link>
        <OpenInStackBlitz locale={locale} files={code} title={name} description={t.description} quiet />
      </div>
    </>
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
