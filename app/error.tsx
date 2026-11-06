'use client';
import Link from 'next/link';
import { useEffect } from 'react';

/** Catches a crash inside a chapter so the top bar, tab bar and footer keep working. */
export default function ChapterError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <div className="page">
      <div className="wrap pg">
        <h1 className="pg-title">This chapter failed to load.</h1>
        <p className="lede">It is a fault in the site, not in anything you did. Try again, or go back to the start.</p>
        <div className="ctas">
          <button className="btn" type="button" onClick={reset}>
            Try again
          </button>{' '}
          <Link className="ghost" href="/">
            Back to the start
          </Link>
        </div>
      </div>
    </div>
  );
}
