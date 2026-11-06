import Link from 'next/link';
import { chapters } from '@/lib/chapters';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <div className="page enter">
      <div className="wrap pg">
        <h1 className="pg-title">This page is not part of the tutorial.</h1>
        <p className="lede">The address may be from the old single-page version, where chapters lived after a # sign. Pick a chapter instead.</p>
        <div className="rows">
          {chapters.map((c) => (
            <div className="row" key={c.id}>
              <div className="k">
                <span className="mono">{c.n}</span>
                <h3>
                  <Link href={`/${c.id}`}>{c.title}</Link>
                </h3>
              </div>
              <div className="body">
                <p>{c.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
