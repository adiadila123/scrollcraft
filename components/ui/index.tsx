import type { ReactNode } from 'react';

/** A copyable code block. The copy button is wired by the scroll engine through data-copy-code. */
export function CodeBlock({ lang, code, codeId }: { lang: string; code: string; codeId?: string }) {
  return (
    <div className="code">
      <div className="code-bar">
        <span className="mono">{lang}</span>
        <button className="cpy" type="button" data-copy-code="">Copy</button>
      </div>
      <pre>
        <code id={codeId}>{code}</code>
      </pre>
    </div>
  );
}

/** A ruled row with a label on the left and content on the right. */
export function Row({ num, title, cls, children }: { num: ReactNode; title: ReactNode; cls?: string; children?: ReactNode }) {
  return (
    <div className={cls ? `row ${cls}` : 'row'}>
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
export function Stick({ left, right }: { left: ReactNode; right?: ReactNode }) {
  return (
    <div className="stick">
      <span className="mono">{left}</span>
      <span className="mono">{right}</span>
    </div>
  );
}

/** Link to the next chapter at the end of a page. */
export function NextBar({ label, href, text }: { label: string; href: string; text: string }) {
  return (
    <div className="nextbar rv">
      <span className="mono">{label}</span>
      <a className="btn" href={href} data-magnetic="">
        {text} <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}

/** Particle canvas that decorates a chapter header. The shape is drawn by the engine. */
export function ParticleArt({ kind }: { kind: string }) {
  return <canvas className="pg-art" data-pc={kind} aria-hidden="true" />;
}

/** Canvas, eyebrow, title and lede at the top of a chapter. */
export function PageHead({ art, eyebrow, title, lede }: { art: string; eyebrow: string; title: ReactNode; lede: ReactNode }) {
  return (
    <>
      <ParticleArt kind={art} />
      <div className="eyebrow">
        <i></i>
        <span>{eyebrow}</span>
      </div>
      <h1 className="pg-title">{title}</h1>
      <p className="lede">{lede}</p>
    </>
  );
}

export function PageBody({ children }: { children: ReactNode }) {
  return <div className="wrap pg">{children}</div>;
}

/** One routed view. The engine shows and hides pages by toggling the hidden attribute. */
export function Page({ route, hidden, id, children }: { route: string; hidden?: boolean; id?: string; children: ReactNode }) {
  return (
    <main className="page" data-route={route} hidden={hidden} id={id}>
      {children}
    </main>
  );
}
