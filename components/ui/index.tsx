import Link from 'next/link';
import type { ReactNode } from 'react';
import ParticleCanvas from '@/components/particles/ParticleCanvas';
import { getChapter } from '@/lib/chapters';
import { highlight } from '@/lib/highlight';
import { readingMinutes } from '@/lib/reading';
import { slugify } from '@/lib/slug.mjs';
import ChapterDone from './ChapterDone';
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
      <span className="mono">{left}</span>
      <span className="mono">{right}</span>
    </div>
  );
}

/** Link to the next chapter at the end of a page. Reaching it marks the current chapter as read. */
export function NextBar({ label, href, text }: { label: string; href: string; text: string }) {
  return (
    <div className="nextbar rv">
      <ChapterDone />
      <span className="mono">{label}</span>
      <Link className="btn" href={href} data-magnetic="">
        {text} <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

/** Particle canvas that decorates a chapter header. */
export function ParticleArt({ kind }: { kind: string }) {
  return <ParticleCanvas kind={kind} className="pg-art" />;
}

/** Canvas, eyebrow, title and lede at the top of a chapter. */
export function PageHead({ chapter, art, eyebrow, title, lede }: { chapter?: string; art: string; eyebrow: string; title: ReactNode; lede: ReactNode }) {
  const mins = chapter ? readingMinutes(chapter) : undefined;
  return (
    <>
      <ParticleArt kind={art} />
      <div className="eyebrow">
        <i></i>
        <span>{eyebrow}</span>
        {mins ? <span className="eyebrow-meta">· {mins} min read</span> : null}
      </div>
      <h1 className="pg-title">{title}</h1>
      <p className="lede">{lede}</p>
    </>
  );
}

export function PageBody({ children }: { children: ReactNode }) {
  return <div className="wrap pg">{children}</div>;
}

/** One chapter view. The enter animation runs on mount, so it plays on every client-side navigation. */
export function Page({ route, children }: { route: string; children: ReactNode }) {
  const c = getChapter(route);
  return (
    <div className="page enter" data-route={route} aria-label={c ? `Chapter ${c.n}: ${c.title}` : undefined}>
      {children}
    </div>
  );
}
