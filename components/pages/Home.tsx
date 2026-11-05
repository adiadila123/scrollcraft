import Link from 'next/link';
import type { CSSProperties } from 'react';
import Hero from '@/components/home/Hero';
import Loader from '@/components/home/Loader';
import { ParallaxBand, Resume, Statement, ZoomFigure } from '@/components/home/ScrollFx';
import { Cell, Page, Row } from '@/components/ui';
import { chapters } from '@/lib/chapters';

export default function HomePage() {
  return (
    <Page route="home">
      <Loader />
      <Hero
        copy={
          <>
            <div className="eyebrow">
              <i></i>
              <span>A free tutorial</span>
            </div>
            <h1>
              <span>Build a cinematic</span>
              <span>website with AI.</span>
            </h1>
            <p className="lede">
              From an empty folder to a published site, with Claude, Gemini or ChatGPT. Which skills to use, where to find them, how to install them, and the
              prompts and code for every step.
            </p>
            <div className="ctas">
              <Link className="btn" href="/start" data-magnetic="">
                Start the tutorial <span aria-hidden="true">→</span>
              </Link>{' '}
              <Link className="ghost" href="/motion">
                See the nine scroll techniques
              </Link>
            </div>
            <Resume />
          </>
        }
        foot={
          <>
            <div>Claude, Gemini, ChatGPT</div>
            <div>Skills explained</div>
            <div>Prompts and code</div>
          </>
        }
      />
      <Statement
        text="A cinematic site is not a bigger budget. It is pacing. The scroll becomes the camera and the page becomes the set."
        dim="You direct. The AI builds, and you check every frame."
      />
      <ZoomFigure />
      <section className="wrap sec rows-sec">
        <div className="sec-head rv">
          <div className="mono">The path</div>
          <h2 style={{ maxWidth: '18ch' } as CSSProperties}>Eight chapters, in order.</h2>
        </div>
        <div className="rows">
          {chapters.map((c) => (
            <Row key={c.id} cls="rv" num={c.n} title={<Link href={`/${c.id}`}>{c.title}</Link>}>
              <p>{c.summary}</p>
            </Row>
          ))}
        </div>
      </section>
      <section className="wrap sec rv">
        <div className="sec-head">
          <div className="mono">What you will have</div>
          <h2 style={{ maxWidth: '20ch' } as CSSProperties}>Four things at the end.</h2>
        </div>
        <div className="cells">
          <Cell mono="01" title="A working site">
            <p>Smooth inertial scrolling, a parallax hero, reveals, one pinned moment and a mobile layout.</p>
          </Cell>
          <Cell mono="02" title="Your own skill">
            <p>A reusable cinematic-scroll skill you can install in Claude, Gemini or Codex.</p>
          </Cell>
          <Cell mono="03" title="A prompt library">
            <p>Twenty-four prompts for briefing, building, fixing and reviewing.</p>
          </Cell>
          <Cell mono="04" title="A launch checklist">
            <p>Twelve checks to run before anyone else sees the page.</p>
          </Cell>
        </div>
      </section>
      <ParallaxBand>
        <div className="wrap band rv">
          <div className="mono">Chapter one</div>
          <h2 style={{ maxWidth: '16ch' } as CSSProperties}>Open an empty folder.</h2>
          <Link className="btn" href="/start" data-magnetic="">
            Start the tutorial <span aria-hidden="true">→</span>
          </Link>
        </div>
      </ParallaxBand>
    </Page>
  );
}
