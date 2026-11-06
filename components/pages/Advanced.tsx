import type { CSSProperties } from 'react';
import { Callout, CodeBlock, NextBand, Page, PageBody, PageHead, Row, Stick } from '@/components/ui';

export default function AdvancedPage() {
  return (
    <Page route="advanced">
      <PageBody>
        <PageHead
          chapter="advanced"
          title="Advanced: GSAP, CSS timelines, Next.js, performance and fixes."
          lede="Once the plain version works, these are the next steps. Each section says when it is worth the extra weight."
        />
        <section className="sec">
          <Stick left="01 · Choosing a stack" right="Plain, GSAP, Next.js, Flask" />
          <p className="lede rv" style={{ marginTop: '0' } as CSSProperties}>
            For a scroll site the stack matters less than the discipline. Start plain. Add a library when a specific problem asks for it.
          </p>
          <div className="tablewrap rv" tabIndex={0} role="region" aria-label="Table. Scroll sideways to see every column.">
            <table>
              <thead>
                <tr>
                  <th>Option</th>
                  <th>Use it when</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Plain HTML, CSS, JS</td>
                  <td>One page or a few pages, a portfolio, a landing page, this tutorial’s project</td>
                  <td>You manage the file structure and repeated markup yourself</td>
                </tr>
                <tr>
                  <td>Vanilla plus GSAP</td>
                  <td>Many scrubbed or pinned timelines that must stay in sync</td>
                  <td>One more library to load and learn</td>
                </tr>
                <tr>
                  <td>Next.js with React</td>
                  <td>Many routes, shared components, a CMS, server rendering for search</td>
                  <td>A build step, a server or host that supports it, and effects that must clean up on unmount</td>
                </tr>
                <tr>
                  <td>Flask</td>
                  <td>You need a backend: a contact form, a database, an API</td>
                  <td>It does not animate anything. It serves the page and handles data</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="sec">
          <Stick left="02 · GSAP with Lenis" right="Scrubbed and pinned timelines" />
          <p className="lede rv" style={{ marginTop: '0' } as CSSProperties}>
            GSAP ScrollTrigger handles pinning, scrubbing and many timelines in sync. Its documentation covers the full API; this is the usual wiring with
            Lenis.
          </p>
          <div className="rv">
            <CodeBlock
              lang="html"
              code={
                "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js\"></script>\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js\"></script>\n<script src=\"https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js\"></script>\n<script>\n  gsap.registerPlugin(ScrollTrigger);\n\n  // Lenis and ScrollTrigger share one clock.\n  const lenis = new Lenis({ lerp: 0.1 });\n  lenis.on('scroll', ScrollTrigger.update);\n  gsap.ticker.add((time) => lenis.raf(time * 1000));\n  gsap.ticker.lagSmoothing(0);\n\n  // Pinned horizontal gallery, scrubbed by scroll.\n  const track = document.querySelector('.hs-track');\n  const distance = () => track.scrollWidth - window.innerWidth;\n  gsap.to(track, {\n    x: () => -distance(),\n    ease: 'none',\n    scrollTrigger: {\n      trigger: '.hs',\n      start: 'top top',\n      end: () => '+=' + distance(),\n      pin: true,\n      scrub: true,\n      invalidateOnRefresh: true\n    }\n  });\n</script>"
              }
            />
          </div>
          <div className="rv">
            <Callout>
              The two lines that matter are <code className="i">lenis.on(‘scroll’, ScrollTrigger.update)</code> and the shared ticker. Without them the two
              libraries run separate clocks and the pinned parts stutter.
            </Callout>
          </div>
        </section>
        <section className="sec">
          <Stick left="03 · CSS scroll timelines" right="Less JavaScript, check support" />
          <p className="lede rv" style={{ marginTop: '0' } as CSSProperties}>
            CSS can now tie an animation to scroll with <code className="i">animation-timeline</code>. The WebKit blog describes support in{' '}
            <a className="ext" href="https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/" target="_blank" rel="noopener">
              a Safari 26 beta
            </a>
            . Check the current table on caniuse.com for Chrome and Firefox, and keep a fallback.
          </p>
          <div className="rv">
            <CodeBlock
              lang="css"
              code={
                '@keyframes rise {\n  from { opacity: 0; transform: translateY(28px); }\n  to   { opacity: 1; transform: none; }\n}\n\n/* Only where the browser understands scroll timelines. */\n@supports (animation-timeline: view()) {\n  .reveal {\n    animation: rise linear both;\n    animation-timeline: view();\n    animation-range: entry 0% entry 60%;\n  }\n  .progress {\n    transform-origin: 0 50%;\n    animation: grow linear both;\n    animation-timeline: scroll(root);\n  }\n}\n@keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }'
              }
            />
          </div>
          <div className="rv">
            <CodeBlock
              lang="js"
              code={
                "const native = CSS.supports('animation-timeline: view()');\nif (!native) {\n  // fall back to IntersectionObserver reveals, as in the example site\n}"
              }
            />
          </div>
          <p className="muted rv" style={{ maxWidth: '62ch' } as CSSProperties}>
            One trade-off: a view timeline scrubs both ways, so content fades out again when you scroll back up. The IntersectionObserver version in the example
            keeps it visible. Pick the behaviour you want.
          </p>
        </section>
        <section className="sec">
          <Stick left="04 · Next.js and React" right="Same effects, with cleanup" />
          <p className="lede rv" style={{ marginTop: '0' } as CSSProperties}>
            In React the effects move into <code className="i">useEffect</code>, and everything you start has to be stopped on unmount. In the Next.js App
            Router the component needs <code className="i">‘use client’</code> because it touches the browser. This sketch was not run here; install{' '}
            <code className="i">lenis</code> and <code className="i">gsap</code> with npm and test it in your project.
          </p>
          <div className="rv">
            <CodeBlock
              lang="tsx"
              code={
                "// components/Cinematic.tsx\n'use client';\nimport { useEffect, useRef, type ReactNode } from 'react';\nimport Lenis from 'lenis';\nimport gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';\n\ngsap.registerPlugin(ScrollTrigger);\n\nexport default function Cinematic({ children }: { children: ReactNode }) {\n  const root = useRef<HTMLDivElement>(null);\n\n  useEffect(() => {\n    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;\n    if (reduced) return;\n\n    const lenis = new Lenis({ lerp: 0.1 });\n    const tick = (time: number) => lenis.raf(time * 1000);\n    lenis.on('scroll', ScrollTrigger.update);\n    gsap.ticker.add(tick);\n    gsap.ticker.lagSmoothing(0);\n\n    const ctx = gsap.context(() => {\n      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {\n        gsap.from(el, {\n          y: 28, opacity: 0, duration: 0.9, ease: 'power3.out',\n          scrollTrigger: { trigger: el, start: 'top 85%', once: true }\n        });\n      });\n    }, root);\n\n    return () => {\n      ctx.revert();\n      gsap.ticker.remove(tick);\n      lenis.destroy();\n    };\n  }, []);\n\n  return <div ref={root}>{children}</div>;\n}"
              }
            />
          </div>
        </section>
        <section className="sec">
          <Stick left="05 · Performance and access" right="Rules that hold on any stack" />
          <div className="rows">
            <Row cls="rv" num="Move" title="Animate transform and opacity">
              <p>These can be handled without recalculating layout. Animating width, height, top or left makes the browser redo layout on every frame.</p>
            </Row>
            <Row cls="rv" num="Batch" title="Read, then write">
              <p>Read all measurements first, then apply all styles. Mixing them in a loop forces repeated layout work.</p>
            </Row>
            <Row cls="rv" num="Hint" title="Use will-change sparingly">
              <p>Apply it to the few elements that move constantly, such as parallax layers. On every element it costs memory.</p>
            </Row>
            <Row cls="rv" num="Stop" title="Do nothing off screen">
              <p>Pause loops and skip updates for sections that are not visible. The example stops the parallax once the hero has left the screen.</p>
            </Row>
            <Row cls="rv" num="Reduce" title="Respect reduced motion">
              <p>
                Check <code className="i">prefers-reduced-motion</code> in CSS and in JavaScript. Provide a static layout that reads well on its own.
              </p>
            </Row>
            <Row cls="rv" num="Keys" title="Keep the keyboard working">
              <p>Tab order, visible focus and anchor links must behave the same as without effects. Pinned sections should not trap focus.</p>
            </Row>
          </div>
        </section>
        <section className="sec">
          <Stick left="06 · Troubleshooting" right="Symptom, cause, fix" />
          <div className="tablewrap rv" tabIndex={0} role="region" aria-label="Table. Scroll sideways to see every column.">
            <table>
              <thead>
                <tr>
                  <th>Symptom</th>
                  <th>Likely cause</th>
                  <th>Fix</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Smooth scroll does nothing</td>
                  <td>No doctype, so the browser is in quirks mode</td>
                  <td>
                    Start the file with{' '}
                    <code className="i">
                      {'<'}!doctype html{'>'}
                    </code>
                  </td>
                </tr>
                <tr>
                  <td>Two scrollbars or a jump</td>
                  <td>
                    <code className="i">overflow: hidden</code> on html or body
                  </td>
                  <td>
                    Use <code className="i">overflow-x: clip</code> on body
                  </td>
                </tr>
                <tr>
                  <td>Sticky section never sticks</td>
                  <td>An ancestor has overflow set</td>
                  <td>
                    Remove it, or use <code className="i">clip</code>
                  </td>
                </tr>
                <tr>
                  <td>Gallery ends early or late</td>
                  <td>Width measured before fonts loaded</td>
                  <td>
                    Measure again in <code className="i">document.fonts.ready</code> and on resize
                  </td>
                </tr>
                <tr>
                  <td>Content stays invisible</td>
                  <td>Class name mismatch, or threshold too high for a tall element</td>
                  <td>Check the class, lower the threshold</td>
                </tr>
                <tr>
                  <td>Anchor links jump</td>
                  <td>Native jump fights Lenis</td>
                  <td>
                    Call <code className="i">lenis.scrollTo(target)</code>
                  </td>
                </tr>
                <tr>
                  <td>Trigger positions are wrong</td>
                  <td>Images loaded after GSAP measured</td>
                  <td>
                    Call <code className="i">ScrollTrigger.refresh()</code> on load
                  </td>
                </tr>
                <tr>
                  <td>Choppy on a phone</td>
                  <td>Animating top, left or width</td>
                  <td>Animate transform and opacity only</td>
                </tr>
                <tr>
                  <td>Hero text pushed off screen</td>
                  <td>Parallax offset too large on small widths</td>
                  <td>Lower the speed or the layer inset on narrow screens</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="sec">
          <Stick left="07 · Glossary" right="Eight terms" />
          <dl className="glossary rv">
            <div className="gl">
              <dt className="mono">Lerp</dt>
              <dd>Linear interpolation. Each frame, move a fixed fraction of the remaining distance to the target.</dd>
            </div>
            <div className="gl">
              <dt className="mono">Easing</dt>
              <dd>The curve that sets how fast something moves at each point in its journey.</dd>
            </div>
            <div className="gl">
              <dt className="mono">Pinning</dt>
              <dd>Holding an element in place while the page scrolls past it. In CSS this is usually position: sticky.</dd>
            </div>
            <div className="gl">
              <dt className="mono">Scrub</dt>
              <dd>Tying an animation’s progress to scroll position instead of time.</dd>
            </div>
            <div className="gl">
              <dt className="mono">Parallax</dt>
              <dd>Layers moving at different speeds, which the eye reads as depth.</dd>
            </div>
            <div className="gl">
              <dt className="mono">Quirks mode</dt>
              <dd>A legacy rendering mode a browser uses when the doctype is missing.</dd>
            </div>
            <div className="gl">
              <dt className="mono">Layout thrash</dt>
              <dd>Reading layout values and writing styles in a loop, which forces repeated recalculation.</dd>
            </div>
            <div className="gl">
              <dt className="mono">Composited layer</dt>
              <dd>A layer the GPU can move without redoing layout or paint. Transform and opacity changes usually qualify.</dd>
            </div>
          </dl>
        </section>
        <NextBand from="advanced" />
      </PageBody>
    </Page>
  );
}
