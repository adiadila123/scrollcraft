import type { CSSProperties } from 'react';
import { Callout, CodeBlock, NextBar, Page, PageBody, PageHead, Row, Stick } from '@/components/ui';

export default function MotionPage() {
  return (
    <Page route="motion" hidden>
      <PageBody>
        <PageHead art="tunnel" eyebrow="Chapter 05"
          title="The nine scroll techniques."
          lede="Nearly every cinematic site is a mix of these nine. This page is the reference, and the site you are reading uses all of them, so you can feel each one." />
        <section className="hs" id="hs">
          <div className="hs-pin">
            <div className="sec-head" style={{ margin: "0" } as CSSProperties}>
              <div className="mono">The nine, at a glance</div>
              <h2 style={{ maxWidth: "20ch" } as CSSProperties}>Keep scrolling. The cards move sideways.</h2>
            </div>
            <div className="hs-track" id="hstrack">
              <div className="hcard">
                <span className="mono">1</span>
                <h3>Sticky positioning</h3>
                <p>Section labels lock under the top bar and hand over to the next one.</p>
                <span className="mono live">See it: Product, Skills, Build</span>
              </div>
              <div className="hcard">
                <span className="mono">2</span>
                <h3>Scroll snap</h3>
                <p>
                  The view settles on defined panels. Safe on a horizontal strip, risky on the whole page.
                </p>
                <span className="mono live">See it: Demo below</span>
              </div>
              <div className="hcard">
                <span className="mono">3</span>
                <h3>Scroll triggered</h3>
                <p>Elements fade and rise once when they enter the viewport.</p>
                <span className="mono live">See it: Every page</span>
              </div>
              <div className="hcard">
                <span className="mono">4</span>
                <h3>Infinite scroll</h3>
                <p>
                  More content loads as you approach the end. A sentinel element at the bottom asks for the next batch.
                </p>
                <span className="mono live">See it: Build, prompt library</span>
              </div>
              <div className="hcard">
                <span className="mono">5</span>
                <h3>Scroll driven</h3>
                <p>A value follows the exact scroll position. Words light up, bars fill.</p>
                <span className="mono live">See it: Home, statement and top bar</span>
              </div>
              <div className="hcard">
                <span className="mono">6</span>
                <h3>Zoom on scroll</h3>
                <p>An image scales up gradually while it crosses the screen.</p>
                <span className="mono live">See it: Home, particle head</span>
              </div>
              <div className="hcard">
                <span className="mono">7</span>
                <h3>Parallax</h3>
                <p>
                  Background layers move more slowly than the foreground, which gives depth.
                </p>
                <span className="mono live">See it: Home hero and the final band</span>
              </div>
              <div className="hcard">
                <span className="mono">8</span>
                <h3>Horizontal scroll</h3>
                <p>
                  Vertical scroll moves a row of cards sideways inside a pinned section.
                </p>
                <span className="mono live">See it: Below: the nine cards</span>
              </div>
              <div className="hcard">
                <span className="mono">9</span>
                <h3>Scrollytelling</h3>
                <p>A fixed scene stays put while text steps scroll past and change it.</p>
                <span className="mono live">See it: Build, the four-stage loop</span>
              </div>
            </div>
            <div className="hs-prog" aria-hidden="true">
              <i id="hsbar"></i>
            </div>
          </div>
        </section>
        <section className="sec">
          <Stick left="01 · Each technique, with code" right="9 techniques" />
          <div className="rows steps-list">
            <Row cls="rv sticky-k" num="1" title="Sticky positioning">
              <p>Section labels lock under the top bar and hand over to the next one.</p>
              <p className="tip">
                Use for chapter labels and long lists where context should stay visible.
              </p>
              <CodeBlock lang="CSS" code={".section-label {\n  position: sticky; top: 64px; z-index: 12;\n  background: rgba(0,0,0,.8);\n  backdrop-filter: blur(12px);\n}\n/* The label must sit inside its section: the section ends, the label leaves. */"} />
            </Row>
            <Row cls="rv sticky-k" num="2" title="Scroll snap">
              <p>
                The view settles on defined panels. Safe on a horizontal strip, risky on the whole page.
              </p>
              <p className="tip">
                Do not combine y-axis snap with smooth scrolling or pinned sections. They fight each other.
              </p>
              <CodeBlock lang="CSS" code={".strip { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; }\n.strip > * { flex: 0 0 80%; scroll-snap-align: start; }"} />
              <div className="snapdemo rv">
                <div className="strip" tabIndex={0} aria-label="Snap demo: scroll sideways">
                  <div>One</div>
                  <div>Two</div>
                  <div>Three</div>
                  <div>Four</div>
                </div>
              </div>
            </Row>
            <Row cls="rv sticky-k" num="3" title="Scroll triggered">
              <p>Elements fade and rise once when they enter the viewport.</p>
              <p className="tip">
                Hide only under a .js class. Never hide content again when scrolling back up.
              </p>
              <CodeBlock lang="JavaScript" code={"const io = new IntersectionObserver((entries) => {\n  entries.forEach((e) => {\n    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }\n  });\n}, { threshold: 0.12 });\ndocument.querySelectorAll('.reveal').forEach((el) => io.observe(el));"} />
            </Row>
            <Row cls="rv sticky-k" num="4" title="Infinite scroll">
              <p>
                More content loads as you approach the end. A sentinel element at the bottom asks for the next batch.
              </p>
              <p className="tip">
                Cap the total or give a way past it, or the footer becomes unreachable.
              </p>
              <CodeBlock lang="JavaScript" code={"const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) loadBatch(); },\n  { rootMargin: '0px 0px 320px 0px' });\nio.observe(document.querySelector('#sentinel'));\n// after each batch: io.unobserve(sentinel); io.observe(sentinel);"} />
            </Row>
            <Row cls="rv sticky-k" num="5" title="Scroll driven">
              <p>A value follows the exact scroll position. Words light up, bars fill.</p>
              <p className="tip">
                Use for progress and for text you want read at the pace of the scroll.
              </p>
              <CodeBlock lang="JavaScript" code={"const bar = document.querySelector('.progress');\naddEventListener('scroll', () => {\n  const max = document.documentElement.scrollHeight - innerHeight;\n  bar.style.transform = `scaleX(${scrollY / max})`;\n}, { passive: true });"} />
              <CodeBlock lang="CSS only (check browser support first)" code={".progress { transform-origin: 0 50%; animation: grow linear both; animation-timeline: scroll(root); }\n@keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }"} />
            </Row>
            <Row cls="rv sticky-k" num="6" title="Zoom on scroll">
              <p>An image scales up gradually while it crosses the screen.</p>
              <p className="tip">
                Animate transform only. Scaling width or height forces layout on every frame.
              </p>
              <CodeBlock lang="JavaScript" code={"const r = figure.getBoundingClientRect();\nconst p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));\nimg.style.transform = `scale(${1 + 0.6 * p})`;"} />
            </Row>
            <Row cls="rv sticky-k" num="7" title="Parallax">
              <p>
                Background layers move more slowly than the foreground, which gives depth.
              </p>
              <p className="tip">
                Keep speeds between 0.15 and 0.5. Reduce, do not remove, the effect on phones.
              </p>
              <CodeBlock lang="JavaScript" code={"layers.forEach((l) => {\n  l.style.transform = `translate3d(0, ${scrollY * (1 - l.dataset.speed)}px, 0)`;\n});"} />
            </Row>
            <Row cls="rv sticky-k" num="8" title="Horizontal scroll">
              <p>
                Vertical scroll moves a row of cards sideways inside a pinned section.
              </p>
              <p className="tip">Pin once per page. Set the wrapper height from the track width.</p>
              <CodeBlock lang="JavaScript" code={"const max = track.scrollWidth - pin.clientWidth;\nsection.style.height = (max + pin.offsetHeight) + 'px';\n// on scroll: translateX(-progress * max)"} />
            </Row>
            <Row cls="rv sticky-k" num="9" title="Scrollytelling">
              <p>A fixed scene stays put while text steps scroll past and change it.</p>
              <p className="tip">
                Stack the scene above the text on phones, and keep each step tall enough to read.
              </p>
              <CodeBlock lang="CSS" code={".scrolly-vis { position: sticky; top: 120px; }\n.step { min-height: 72vh; }"} />
            </Row>
          </div>
        </section>
        <section className="sec">
          <Stick left="02 · Choosing and combining" />
          <div className="tablewrap rv">
            <table>
              <thead>
                <tr>
                  <th>You want</th>
                  <th>Use</th>
                  <th>Avoid</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Depth in the first screen</td>
                  <td>Parallax</td>
                  <td>Speeds above 0.6</td>
                </tr>
                <tr>
                  <td>Content that arrives gracefully</td>
                  <td>Scroll triggered reveals</td>
                  <td>Re-hiding on scroll up</td>
                </tr>
                <tr>
                  <td>A guided explanation</td>
                  <td>Scrollytelling or scroll driven words</td>
                  <td>More than one pinned section per page</td>
                </tr>
                <tr>
                  <td>A feature gallery</td>
                  <td>Horizontal scroll</td>
                  <td>Fewer than four cards, it is not worth pinning</td>
                </tr>
                <tr>
                  <td>An endless list</td>
                  <td>Infinite scroll with a cap</td>
                  <td>An unreachable footer</td>
                </tr>
                <tr>
                  <td>Smooth, expensive-feeling movement</td>
                  <td>Lenis</td>
                  <td>Page-level scroll snap</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: "28px" } as CSSProperties} className="rv">
            <Callout>
              Reduced motion is part of the design. When
              {" "}
              <code className="i">prefers-reduced-motion</code>
              {" "}
              is set, switch off smooth scrolling, parallax and the reveal movement together. A fade can stay.
            </Callout>
          </div>
        </section>
        <NextBar label="Next chapter" href="#playground" text="Chapter 06: Playground" />
      </PageBody>
    </Page>
  );
}
