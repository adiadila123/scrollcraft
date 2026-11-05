import { chapters } from '@/lib/chapters';

/** Bottom sheet listing every chapter. Opened by the More tab. */
export default function MoreSheet() {
  return (
    <div className="sheet" id="sheet" hidden>
      <div className="sheet-bg" data-close=""></div>
      <div className="sheet-card" role="dialog" aria-modal="true" aria-label="All chapters">
        <div className="sheet-grab" aria-hidden="true"></div>
        <div className="mono sheet-h">All chapters</div>
        {chapters.map((c) => (
          <a key={c.id} href={`#${c.id}`} data-sheet-link="">
            <span className="mono">{c.n}</span>
            <b>{c.title}</b>
            <em>{c.desc}</em>
          </a>
        ))}
      </div>
    </div>
  );
}
