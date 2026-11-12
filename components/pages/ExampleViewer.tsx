import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { alternates } from '@/components/chrome/Shell';
import ExampleFrame from '@/components/pages/ExampleFrame';
import { chapterHref } from '@/lib/chapters';
import { dicts } from '@/lib/dict';
import { exampleSites, getExampleSite } from '@/lib/examples';
import { withLocale, type Locale } from '@/lib/i18n';

type Props = { params: Promise<{ chapter: string; site: string }> };

/**
 * One example site on its own screen, inside the tutorial: a slim bar with the way back to the chapter and the
 * previous and next examples, and the site filling the rest. Lives at /examples/<site> in each language.
 */
export function exampleRoute(locale: Locale) {
  const generateStaticParams = () => exampleSites.map((s) => ({ chapter: 'examples', site: s.id }));

  async function lookup(params: Props['params']) {
    const { chapter, site } = await params;
    return chapter === 'examples' ? getExampleSite(site) : undefined;
  }

  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const s = await lookup(params);
    if (!s) return {};
    const path = `/examples/${s.id}`;
    return {
      title: `${s.name}: ${s.kind[locale]}`,
      description: dicts[locale].examples.description,
      alternates: { canonical: withLocale(locale, path), languages: alternates(path) },
    };
  }

  async function ExampleViewer({ params }: Props) {
    const s = await lookup(params);
    if (!s) notFound();
    const t = dicts[locale].examples;
    const i = exampleSites.indexOf(s);
    const prev = exampleSites[i - 1];
    const next = exampleSites[i + 1];
    const href = (id: string) => withLocale(locale, `/examples/${id}`);
    return (
      <div className="viewer" data-route="examples">
        <header className="vw-bar">
          <Link className="vw-back" href={`${chapterHref('examples', locale)}#site-${s.id}`} aria-label={t.back}>
            <span aria-hidden="true">←</span> <span className="vw-back-label">{t.back}</span>
          </Link>
          <h1 className="vw-title" tabIndex={-1}>
            <span className="mono">{t.of(i + 1, exampleSites.length)}</span>
            <span className="vw-name">{s.name}</span>
          </h1>
          <nav className="vw-steps" aria-label={t.of(i + 1, exampleSites.length)}>
            {prev ? (
              <Link className="vw-step" href={href(prev.id)} aria-label={t.prev(prev.name)}>
                ‹
              </Link>
            ) : (
              <span className="vw-step" aria-hidden="true" />
            )}
            {next ? (
              <Link className="vw-step" href={href(next.id)} aria-label={t.next(next.name)}>
                ›
              </Link>
            ) : (
              <span className="vw-step" aria-hidden="true" />
            )}
          </nav>
        </header>
        <ExampleFrame key={s.id} src={`/live/${s.id}/index.html`} title={dicts[locale].demo.title(s.name)} />
      </div>
    );
  }

  return { generateStaticParams, generateMetadata, ExampleViewer };
}
