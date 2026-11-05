import { chapters } from '@/lib/chapters';

export default function Topbar() {
  return (
    <header className="topbar" id="topbar">
      <a className="mark" href="#home">Scrollcraft</a>
      <nav className="menu" aria-label="Primary">
        {chapters.map((c) => (
          <a key={c.id} href={`#${c.id}`} data-nav={c.id}>{c.nav}</a>
        ))}
      </nav>
      <span className="mono tag">Free tutorial</span>
    </header>
  );
}
