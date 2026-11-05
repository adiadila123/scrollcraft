import type { CSSProperties } from 'react';
import { CodeBlock, NextBar, Page, PageBody, PageHead, Stick } from '@/components/ui';

export default function PlaygroundPage() {
  return (
    <Page route="playground" hidden>
      <PageBody>
        <PageHead art="field" eyebrow="Chapter 06"
          title="Playground: change the numbers and watch what happens."
          lede="Four small experiments. Each one shows how a single setting changes the feel of a scroll site, and prints the line of code to copy." />
        <section className="sec">
          <Stick left="01 · Smoothing" right="Lenis lerp" />
          <p className="lede rv" style={{ marginTop: "0" } as CSSProperties}>
            Lenis moves the page a fraction of the way to where you scrolled on every frame. That fraction is
            {" "}
            <code className="i">lerp</code>
            . Click or drag on the bar to set a target.
          </p>
          <div className="lab rv">
            <div className="lerp-bar" id="lerpbar">
              <i className="t" id="lerpT"></i>
              <i className="v" id="lerpV"></i>
            </div>
            <label className="ctl">
              <span className="mono">
                lerp
                {" "}
                <b id="lerpOut">0.10</b>
              </span>
              <input type="range" id="lerpIn" min="0.02" max="0.5" step="0.01" defaultValue="0.1" />
            </label>
            <CodeBlock lang="Code" code={"new Lenis({ lerp: 0.1 })"} codeId="lerpCode" />
            <p className="muted">
              Low values feel heavy and slow. High values feel close to normal scrolling. The documented default is 0.1.
            </p>
          </div>
        </section>
        <section className="sec">
          <Stick left="02 · Parallax" right="Layer speed" />
          <p className="lede rv" style={{ marginTop: "0" } as CSSProperties}>
            Scroll inside the box. The dots follow the formula from the example:
            {" "}
            <code className="i">translateY = scroll × (1 − speed)</code>
            .
          </p>
          <div className="lab rv">
            <div className="plx-box" id="plxbox">
              <div className="plx-inner">
                <div className="plx-dots" id="plxdots"></div>
                <div className="plx-text">Scroll this box</div>
              </div>
            </div>
            <label className="ctl">
              <span className="mono">
                speed
                {" "}
                <b id="plxOut">0.40</b>
              </span>
              <input type="range" id="plxIn" min="0" max="1" step="0.05" defaultValue="0.4" />
            </label>
            <CodeBlock lang="Code" code={"layer.style.transform = 'translate3d(0,' + (y * (1 - 0.4)) + 'px,0)'"} codeId="plxCode" />
            <p className="muted">
              Speed 1 moves with the page and shows no depth. Speed 0 stays pinned to the page. Values between 0.15 and 0.5 read as depth. Past about 0.6 it tends to look like a fault.
            </p>
          </div>
        </section>
        <section className="sec">
          <Stick left="03 · Stagger" right="Reveal timing" />
          <div className="lab rv">
            <div className="stag" id="stag">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>
            <div className="ctl-row">
              <label className="ctl">
                <span className="mono">
                  delay per item
                  {" "}
                  <b id="stOut">100</b>
                  {" "}
                  ms
                </span>
                <input type="range" id="stIn" min="0" max="300" step="10" defaultValue="100" />
              </label>
              {" "}
              <button className="btn" type="button" id="stPlay">Replay</button>
            </div>
            <CodeBlock lang="CSS" code={".reveal { transition-delay: calc(var(--d) * 100ms); }"} codeId="stCode" />
            <p className="muted">
              Short delays read as one movement. Long delays read as a list being counted out. Keep the whole sequence under about a second.
            </p>
          </div>
        </section>
        <section className="sec">
          <Stick left="04 · Easing" right="Cubic Bezier" />
          <div className="lab rv">
            <canvas id="ezc" width="320" height="320" aria-label="Easing curve"></canvas>
            <div className="ez-track">
              <i id="ezdot"></i>
            </div>
            <div className="ctl-row">
              <label className="ctl">
                <span className="mono">
                  x1
                  {" "}
                  <b id="e1o">0.20</b>
                </span>
                <input type="range" id="e1" min="0" max="1" step="0.01" defaultValue="0.2" />
              </label>
              {" "}
              <label className="ctl">
                <span className="mono">
                  y1
                  {" "}
                  <b id="e2o">0.70</b>
                </span>
                <input type="range" id="e2" min="-0.5" max="1.5" step="0.01" defaultValue="0.7" />
              </label>
              {" "}
              <label className="ctl">
                <span className="mono">
                  x2
                  {" "}
                  <b id="e3o">0.20</b>
                </span>
                <input type="range" id="e3" min="0" max="1" step="0.01" defaultValue="0.2" />
              </label>
              {" "}
              <label className="ctl">
                <span className="mono">
                  y2
                  {" "}
                  <b id="e4o">1.00</b>
                </span>
                <input type="range" id="e4" min="-0.5" max="1.5" step="0.01" defaultValue="1" />
              </label>
            </div>
            <div className="ctl-row">
              <button className="btn" type="button" id="ezPlay">Play</button>
              <button className="ghost" type="button" data-ez="0.2,0.7,0.2,1">Reveal curve</button>
              <button className="ghost" type="button" data-ez="0.4,0,0.2,1">Standard</button>
              <button className="ghost" type="button" data-ez="0,0,1,1">Linear</button>
            </div>
            <CodeBlock lang="CSS" code={"transition: transform .9s cubic-bezier(0.2, 0.7, 0.2, 1);"} codeId="ezCode" />
            <p className="muted">
              The reveal curve starts fast and settles gently, which is why the example site uses it. Linear motion looks mechanical on interface elements.
            </p>
          </div>
        </section>
        <NextBar label="Next chapter" href="#advanced" text="Chapter 07: Advanced" />
      </PageBody>
    </Page>
  );
}
