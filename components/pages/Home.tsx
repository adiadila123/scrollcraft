import type { CSSProperties } from 'react';
import { Cell, Page, Row } from '@/components/ui';

export default function HomePage() {
  return (
    <Page route="home" id="main">
      <section className="hero">
        <canvas id="stage" aria-label="A head made of glowing white particles with blue eyes, assembling from particles behind it and reacting to the cursor"></canvas>
        <div className="scrim"></div>
        <div className="inner">
          <div className="copy" id="copy">
            <div className="eyebrow">
              <i></i>
              <span>A free tutorial</span>
            </div>
            <h1>
              <span>Build a cinematic</span>
              <span>website with AI.</span>
            </h1>
            <p className="lede">
              From an empty folder to a published site, with Claude, Gemini or ChatGPT. Which skills to use, where to find them, how to install them, and the prompts and code for every step.
            </p>
            <div className="ctas">
              <a className="btn" href="#start" data-magnetic="">
                Start the tutorial
                {" "}
                <span aria-hidden="true">→</span>
              </a>
              {" "}
              <a className="ghost" href="#motion">See the nine scroll techniques</a>
            </div>
          </div>
          <div className="foot-row">
            <div>Claude, Gemini, ChatGPT</div>
            <div>Skills explained</div>
            <div>Prompts and code</div>
            <div className="state" id="state">Assembling 000%</div>
          </div>
        </div>
        <div id="fallback" hidden>WebGL is not available in this browser, so the animation cannot run.</div>
      </section>
      <section className="pin" id="words">
        <div className="wrap pin-in">
          <div className="mono">The idea</div>
          <p className="statement" id="stmt">
            A cinematic site is not a bigger budget. It is pacing. The scroll becomes the camera and the page becomes the set.
            {" "}
            <span className="dim">You direct. The AI builds, and you check every frame.</span>
          </p>
        </div>
      </section>
      <section className="wrap sec zoomsec">
        <figure className="zoom" id="zoom">
          <canvas data-pc="face" role="img" aria-label="A head made of white particles with blue eyes, shown close up"></canvas>
          <figcaption>
            <span className="mono">Every image on this site is particles</span>
            <span className="mono">Scroll to zoom</span>
          </figcaption>
        </figure>
      </section>
      <section className="wrap sec rows-sec">
        <div className="sec-head rv">
          <div className="mono">The path</div>
          <h2 style={{ maxWidth: "18ch" } as CSSProperties}>Eight chapters, in order.</h2>
        </div>
        <div className="rows">
          <Row cls="rv" num="01" title={<>
            <a href="#start">Start</a>
          </>}>
            <p>
              Choose Claude, Gemini or ChatGPT, install the tools, and set up a project folder.
            </p>
          </Row>
          <Row cls="rv" num="02" title={<>
            <a href="#skills">Skills</a>
          </>}>
            <p>
              What a skill is, where to find good ones, how to install them on each platform, and how to write your own.
            </p>
          </Row>
          <Row cls="rv" num="03" title={<>
            <a href="#prompting">Prompting</a>
          </>}>
            <p>
              A five-part brief, a worked before and after, a project rules file and six steering patterns.
            </p>
          </Row>
          <Row cls="rv" num="04" title={<>
            <a href="#build">Build</a>
          </>}>
            <p>
              Ten steps with the exact prompt for each, 24 more prompts, and a complete three-file example that was run and checked.
            </p>
          </Row>
          <Row cls="rv" num="05" title={<>
            <a href="#motion">Motion</a>
          </>}>
            <p>
              The nine scroll techniques that make a site feel cinematic, each with code you can paste.
            </p>
          </Row>
          <Row cls="rv" num="06" title={<>
            <a href="#playground">Playground</a>
          </>}>
            <p>
              Four live experiments: smoothing, parallax speed, stagger timing and easing curves.
            </p>
          </Row>
          <Row cls="rv" num="07" title={<>
            <a href="#advanced">Advanced</a>
          </>}>
            <p>
              GSAP with Lenis, CSS scroll timelines, a Next.js version, performance rules, a fault table and a glossary.
            </p>
          </Row>
          <Row cls="rv" num="08" title={<>
            <a href="#launch">Launch</a>
          </>}>
            <p>Test on three screen widths, fix what breaks, and publish the folder.</p>
          </Row>
        </div>
      </section>
      <section className="wrap sec rv">
        <div className="sec-head">
          <div className="mono">What you will have</div>
          <h2 style={{ maxWidth: "20ch" } as CSSProperties}>Four things at the end.</h2>
        </div>
        <div className="cells">
          <Cell mono="01" title="A working site">
            <p>
              Smooth inertial scrolling, a parallax hero, reveals, one pinned moment and a mobile layout.
            </p>
          </Cell>
          <Cell mono="02" title="Your own skill">
            <p>
              A reusable cinematic-scroll skill you can install in Claude, Gemini or Codex.
            </p>
          </Cell>
          <Cell mono="03" title="A prompt library">
            <p>Twenty-four prompts for briefing, building, fixing and reviewing.</p>
          </Cell>
          <Cell mono="04" title="A launch checklist">
            <p>Twelve checks to run before anyone else sees the page.</p>
          </Cell>
        </div>
      </section>
      <section className="plx snap" id="plx">
        <div className="plx-l plx-a" data-px="0.8" aria-hidden="true"></div>
        <div className="plx-l plx-c" data-px="0.55" aria-hidden="true"></div>
        <div className="plx-l plx-b" data-px="0.3" aria-hidden="true"></div>
        <div className="wrap band rv">
          <div className="mono">Chapter one</div>
          <h2 style={{ maxWidth: "16ch" } as CSSProperties}>Open an empty folder.</h2>
          <a className="btn" href="#start" data-magnetic="">
            Start the tutorial
            {" "}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </Page>
  );
}
