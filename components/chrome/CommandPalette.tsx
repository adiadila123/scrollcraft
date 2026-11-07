'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '@/lib/i18n';
import type { SearchEntry } from '@/lib/search';
import { useLocale } from '@/lib/useLocale';

const OPEN = 'sc:palette';
/** Opens the search palette from anywhere, for example the search button in the top bar. */
export const openPalette = () => window.dispatchEvent(new Event(OPEN));

function score(e: SearchEntry, terms: string[]): number {
  const title = e.title.toLowerCase();
  const hay = `${title} ${e.chapter.toLowerCase()} ${e.text.toLowerCase()}`;
  let s = 0;
  for (const t of terms) {
    if (!hay.includes(t)) return 0;
    s += title.startsWith(t) ? 6 : title.includes(t) ? 4 : 1;
  }
  return s + (e.kind === 'chapter' ? 2 : 0);
}

/** ⌘K / Ctrl+K search over chapters, sections and prompts. The index loads the first time it opens. */
export default function CommandPalette() {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const { locale, t: d } = useLocale();
  const t = d.palette;
  /* the index is built for one language; switching language loads a new document, so this never goes stale */
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const lang = useRef<Locale>(locale);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);

  useEffect(() => {
    const open = () => {
      const d = dialog.current;
      if (!d || d.open) return;
      setQ('');
      setSel(0);
      d.showModal();
      if (!index) import('@/lib/search').then((m) => setIndex(m.searchIndex(lang.current)));
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else open();
      }
    };
    window.addEventListener(OPEN, open);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener(OPEN, open);
      window.removeEventListener('keydown', onKey);
    };
  }, [index]);

  const results = useMemo(() => {
    if (!index) return [];
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return index.filter((e) => e.kind === 'chapter');
    return index
      .map((e) => [score(e, terms), e] as const)
      .filter(([s]) => s > 0)
      .sort((a, b) => b[0] - a[0])
      .slice(0, 40)
      .map(([, e]) => e);
  }, [index, q]);

  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  const go = (e?: SearchEntry) => {
    if (!e) return;
    dialog.current?.close();
    router.push(e.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[sel]);
    } else if (e.key === 'Escape') {
      /* a search input clears itself on the first Escape; close straight away instead */
      e.preventDefault();
      dialog.current?.close();
    }
  };

  return (
    <dialog
      className="palette"
      ref={dialog}
      aria-label={t.label}
      onClick={(e) => {
        if (e.target === dialog.current) dialog.current.close();
      }}
    >
      <div className="pal-in">
        <input
          type="search"
          placeholder={t.placeholder}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSel(0);
          }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded="true"
          aria-controls="pal-list"
          aria-activedescendant={results[sel] ? `pal-${sel}` : undefined}
          autoFocus
        />
        <ul id="pal-list" role="listbox" ref={list} data-lenis-prevent="">
          {!index && <li className="pal-empty mono">{t.loading}</li>}
          {index && !results.length && <li className="pal-empty mono">{t.empty}</li>}
          {results.map((e, i) => (
            <li key={`${e.href}-${i}`} id={`pal-${i}`} role="option" aria-selected={i === sel} onMouseMove={() => setSel(i)} onClick={() => go(e)}>
              <span className="mono">{e.kind === 'chapter' ? t.chapter(Number(e.n)) : e.kind === 'prompt' ? t.prompt : t.section}</span>
              <b>{e.title.replace(/: prompt$/, '')}</b>
              {e.kind === 'chapter' ? null : <em>{e.kind === 'prompt' ? `${e.chapter} · ${e.text}` : t.inChapter(e.chapter)}</em>}
            </li>
          ))}
        </ul>
        <div className="pal-foot mono" aria-hidden="true">
          {t.keys.map((k) => (
            <span key={k}>{k}</span>
          ))}
        </div>
      </div>
    </dialog>
  );
}
