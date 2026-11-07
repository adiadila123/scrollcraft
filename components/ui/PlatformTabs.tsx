'use client';
import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { persistentStore } from '@/lib/store';
import { useLocale } from '@/lib/useLocale';

export type Platform = 'claude' | 'gemini' | 'chatgpt';
const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'claude', label: 'Claude' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'chatgpt', label: 'ChatGPT and Codex' },
];

function useLabel() {
  const t = useLocale().t.platform;
  return (p: Platform) => (p === 'chatgpt' ? t.chatgpt : PLATFORMS.find((x) => x.id === p)!.label);
}

/* The chosen platform is shared by every tab set on the site and remembered between visits. */
const platform = persistentStore<Platform>('sc-platform', 'claude');
const usePlatform = platform.use;
const set = platform.set;

/** Accessible tab list: arrow keys, Home and End move between platforms, and only the selected tab is in the tab order. */
export function PlatformTabs() {
  const value = usePlatform();
  const { t } = useLocale();
  const labelOf = useLabel();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = PLATFORMS.length;
    const to = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    set(PLATFORMS[to].id);
    refs.current[to]?.focus();
  };

  return (
    <div className="ptabs" role="tablist" aria-label={t.platform.label}>
      {PLATFORMS.map((p, i) => (
        <button
          key={p.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="tab"
          aria-selected={value === p.id}
          tabIndex={value === p.id ? 0 : -1}
          onClick={() => set(p.id)}
          onKeyDown={(e) => onKey(e, i)}
        >
          {labelOf(p.id)}
        </button>
      ))}
    </div>
  );
}

/** Content for one platform. It stays in the server-rendered HTML for search engines and is hidden when not selected. */
export function PlatformPanel({ p, children }: { p: Platform; children: ReactNode }) {
  const value = usePlatform();
  const label = useLabel()(p);
  return (
    <div className="ppanel" role="tabpanel" aria-label={label} hidden={value !== p}>
      {children}
    </div>
  );
}
