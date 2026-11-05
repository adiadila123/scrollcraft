import type { CSSProperties, ReactNode } from 'react';
import { chapters, tabIds } from '@/lib/chapters';

const icons: Record<string, ReactNode> = {
  start: (<><circle cx="12" cy="12" r="9" /><path d="M10 8.5v7l6-3.5z" /></>),
  skills: <path d="M12 3l2.2 5.3L20 9l-4.3 3.8L17 18.5 12 15.6 7 18.5l1.3-5.7L4 9l5.8-.7z" />,
  build: <path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14" />,
  motion: <path d="M3 12c3-6 6-6 9 0s6 6 9 0" />,
};

/** iOS-style floating tab bar, shown on phones. */
export default function Tabbar() {
  return (
    <nav className="tabbar" id="tabbar" aria-label="Chapters">
      <span className="tab-ind" id="tabind" style={{ '--i': 0 } as CSSProperties}></span>
      {tabIds.map((id) => {
        const c = chapters.find((x) => x.id === id)!;
        return (
          <a key={id} className="tab" href={`#${id}`} data-tab={id}>
            <svg viewBox="0 0 24 24" aria-hidden="true">{icons[id]}</svg>
            {c.title}
          </a>
        );
      })}
      <button className="tab" type="button" id="moretab" data-tab="more" aria-haspopup="dialog" aria-expanded="false">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="5.5" cy="12" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="18.5" cy="12" r="1.4" />
        </svg>
        More
      </button>
    </nav>
  );
}
