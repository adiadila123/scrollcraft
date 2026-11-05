import type { CSSProperties } from 'react';
import { Callout, CodeBlock, NextBar, Page, PageBody, PageHead, Row, Stick } from '@/components/ui';

export default function BuildPage() {
  return (
    <Page route="build" hidden>
      <PageBody>
        <PageHead art="scaffold" eyebrow="Chapter 04"
          title="Build it, step by step."
          lede="Ten steps from an empty folder to a finished page. Each has the prompt to paste and, where it matters, the code you should expect back." />
        <section className="sec">
          <Stick left="01 · The loop" right={<>
            <span id="stepnow">Brief</span>
          </>} />
          <div className="sec-head">
            <h2 style={{ maxWidth: "18ch" } as CSSProperties}>Every step runs the same four-part loop.</h2>
          </div>
          <div className="scrolly" id="scrolly">
            <div className="scrolly-vis" aria-hidden="true">
              <div className="vpanel">
                <div className="vlabel mono">Stage 01 · Brief</div>
                <canvas data-pc="wave"></canvas>
              </div>
              <div className="vpanel" hidden>
                <div className="vlabel mono">Stage 02 · Generate</div>
                <canvas data-pc="net"></canvas>
              </div>
              <div className="vpanel" hidden>
                <div className="vlabel mono">Stage 03 · Inspect</div>
                <canvas data-pc="stream"></canvas>
                <div className="typed">
                  <div>{">"} Screenshot at 375 px.</div>
                  <div>{">"} Hero copy overlaps the button.</div>
                  <div>{">"} Fix it, then look again.</div>
                </div>
              </div>
              <div className="vpanel" hidden>
                <div className="vlabel mono">Stage 04 · Refine</div>
                <canvas data-pc="rings"></canvas>
              </div>
            </div>
            <div className="steps">
              <article className="step on" data-name="Brief">
                <span className="mono">01</span>
                <h3>Brief</h3>
                <p>
                  Say what you want, who it is for and what the visitor should do. Name constraints: colours, fonts, no frameworks.
                </p>
              </article>
              <article className="step" data-name="Generate">
                <span className="mono">02</span>
                <h3>Generate</h3>
                <p>
                  Let the AI write one piece at a time. Small pieces are easy to check and easy to undo.
                </p>
              </article>
              <article className="step" data-name="Inspect">
                <span className="mono">03</span>
                <h3>Inspect</h3>
                <p>
                  Open the page. Scroll it, shrink it, tab through it. Ask the AI to say what it did not test, and look at that part yourself.
                </p>
              </article>
              <article className="step" data-name="Refine">
                <span className="mono">04</span>
                <h3>Refine</h3>
                <p>
                  Describe the problem you saw, not the fix you imagine. Then inspect again.
                </p>
              </article>
            </div>
          </div>
        </section>
        <section className="sec">
          <Stick left="02 · Ten steps" right="Empty folder to finished page" />
          <div className="rows steps-list">
            <Row cls="rv sticky-k" num="01" title="Brief the AI">
              <p>
                A good brief names the subject, the audience and the one thing a visitor should do at the end. Ask for the section list first, and approve it before any code exists. Changing a list costs seconds. Changing finished code costs a lot more.
              </p>
              <CodeBlock lang="Prompt" code={"I want a minimalist cinematic scroll site about [subject] for [audience]. The visitor should finish by [one action]. Propose the sections, one line each, and wait for my approval before writing any code."} />
              <p>You should see: a short list, no code yet.</p>
            </Row>
            <Row cls="rv sticky-k" num="02" title="Generate the skeleton">
              <p>
                Ask for three files and name the constraints. Constraints are what stop the result looking like every other template.
              </p>
              <CodeBlock lang="Prompt" code={"Create index.html, style.css and app.js using plain HTML, CSS and JavaScript, no framework. Black background, one accent colour, one pair of Google Fonts. Define all colours as CSS custom properties. Include a hero, three content sections, one call to action and a short footer."} />
              <p>
                Refresh your local server page. You should see an unanimated but complete page.
              </p>
            </Row>
            <Row cls="rv sticky-k" num="03" title="Add smooth scrolling">
              <p>
                Lenis gives the page inertia, so the wheel eases instead of stepping. It needs a doctype: without
                {" "}
                <code className="i">{"<"}!doctype html{">"}</code>
                {" "}
                the browser enters quirks mode and Lenis silently does nothing, which happened during this site’s own testing.
              </p>
              <CodeBlock lang="Prompt" code={"Add Lenis smooth scrolling from the jsDelivr CDN, pinned to lenis@1.1.18 and driven by requestAnimationFrame. Do not start it when prefers-reduced-motion is set."} />
              <CodeBlock lang="HTML" code={"<script src=\"https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js\"></script>"} />
              <CodeBlock lang="app.js" code={"const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;\nif (!reduced && typeof Lenis !== 'undefined') {\n  const lenis = new Lenis({ duration: 1.2, smoothWheel: true });\n  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };\n  requestAnimationFrame(raf);\n}"} />
              <CodeBlock lang="style.css" code={"html.lenis, html.lenis body { height: auto; }\n.lenis.lenis-smooth { scroll-behavior: auto !important; }"} />
            </Row>
            <Row cls="rv sticky-k" num="04" title="Reveal on scroll">
              <p>
                Sections should arrive when you reach them, not all on page load. Hide elements only when JavaScript is present, so nothing stays invisible if the script fails.
              </p>
              <CodeBlock lang="Prompt" code={"Reveal every .reveal element once when it enters the viewport: opacity and a 24 px rise, staggered by 80 ms among siblings. Add the hidden state only under a .js class on the html element."} />
              <CodeBlock lang="app.js" code={"document.documentElement.classList.add('js');\nconst io = new IntersectionObserver((entries) => {\n  entries.forEach((e) => {\n    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }\n  });\n}, { threshold: 0.12 });\ndocument.querySelectorAll('.reveal').forEach((el) => io.observe(el));"} />
              <CodeBlock lang="style.css" code={".js .reveal { opacity: 0; transform: translateY(24px);\n  transition: opacity 1s, transform 1s cubic-bezier(.2,.7,.2,1); }\n.js .reveal.in { opacity: 1; transform: none; }"} />
            </Row>
            <Row cls="rv sticky-k" num="05" title="Give the hero depth">
              <p>
                Parallax means background layers move more slowly than the foreground. Speeds between 0.15 and 0.5 read as depth. Past about 0.6 it looks like a bug.
              </p>
              <CodeBlock lang="Prompt" code={"Give the hero three background layers with data-speed 0.2, 0.35 and 0.5, moved with translate3d on scroll. Stop updating after 1.3 viewport heights. Reduce the offsets under 768 px instead of removing them."} />
              <CodeBlock lang="app.js" code={"const layers = [...document.querySelectorAll('[data-speed]')];\naddEventListener('scroll', () => {\n  const y = scrollY;\n  if (y > innerHeight * 1.3) return;\n  layers.forEach((l) => {\n    l.style.transform = `translate3d(0, ${y * (1 - l.dataset.speed)}px, 0)`;\n  });\n}, { passive: true });"} />
            </Row>
            <Row cls="rv sticky-k" num="06" title="Add one pinned moment">
              <p>
                Pin at most once per page. A horizontal scroll gallery is the classic choice: vertical scroll moves a row of cards sideways while the section stays in place. The wrapper’s height is the track overflow plus one screen.
              </p>
              <CodeBlock lang="Prompt" code={"Turn the six feature cards into one pinned horizontal scroll section. Set the wrapper height from the track width after fonts load and on resize, so scroll distance equals the overflow."} />
              <CodeBlock lang="app.js" code={"const hs = document.querySelector('.hs'), pin = hs.querySelector('.hs-pin'), track = hs.querySelector('.hs-track');\nlet max = 0;\nconst measure = () => {\n  max = Math.max(0, track.scrollWidth - pin.clientWidth);\n  hs.style.height = (max + pin.offsetHeight) + 'px';\n};\naddEventListener('resize', measure); measure();\naddEventListener('scroll', () => {\n  const p = Math.min(1, Math.max(0, (64 - hs.getBoundingClientRect().top) / max));\n  track.style.transform = `translate3d(${-p * max}px, 0, 0)`;\n}, { passive: true });"} />
              <CodeBlock lang="style.css" code={".hs-pin { position: sticky; top: 64px; height: calc(100vh - 64px); overflow: hidden; }\n.hs-track { display: flex; width: max-content; }"} />
            </Row>
            <Row cls="rv sticky-k" num="07" title="Tell a story with scrollytelling">
              <p>
                The visual stays fixed while text steps scroll past it, and the visual changes with the active step. This site’s scrollytelling is the four-stage loop at the top of this chapter.
              </p>
              <CodeBlock lang="Prompt" code={"Build a scrollytelling section: a sticky visual on the left that changes with the active step, and four text steps on the right. On screens under 900 px, stack them with the visual sticky at the top."} />
              <CodeBlock lang="style.css" code={".scrolly { display: grid; grid-template-columns: 1.1fr .9fr; gap: 56px; align-items: start; }\n.scrolly-vis { position: sticky; top: 120px; height: 60vh; }\n.step { min-height: 72vh; opacity: .3; transition: opacity .5s; }\n.step.on { opacity: 1; }"} />
              <CodeBlock lang="app.js" code={"const steps = [...document.querySelectorAll('.step')];\naddEventListener('scroll', () => {\n  let best = 0, bd = Infinity;\n  steps.forEach((s, i) => {\n    const r = s.getBoundingClientRect();\n    const d = Math.abs(r.top + r.height / 2 - innerHeight / 2);\n    if (d < bd) { bd = d; best = i; }\n  });\n  steps.forEach((s, i) => s.classList.toggle('on', i === best));\n  showVisual(best);\n}, { passive: true });"} />
            </Row>
            <Row cls="rv sticky-k" num="08" title="Add a particle or 3D hero">
              <p>
                Optional, and heavier than everything above. It costs download size and battery on phones. Ask for the cost before agreeing. Cap the pixel ratio, pause when off screen, and reduce the particle count on small screens.
              </p>
              <CodeBlock lang="Prompt" code={"Add a Three.js particle hero using the cdnjs build pinned to an exact version. Sample the points from an image drawn to a canvas. Cap pixel ratio at 2, halve the count under 768 px, and pause rendering when the hero is off screen. Tell me what you could not test."} />
            </Row>
            <Row cls="rv sticky-k" num="09" title="Phone and accessibility pass">
              <p>
                Check three widths: 375, 768 and 1440 px. Then turn on reduced motion. It has to switch off smooth scrolling, parallax and the reveal movement, not only one of them.
              </p>
              <CodeBlock lang="Prompt" code={"Check the page at 375, 768 and 1440 px and list anything overlapping, clipped or unreadable. Make prefers-reduced-motion disable smooth scroll, parallax and reveal movement. Add a skip link, visible focus styles and aria-current on the active menu item."} />
            </Row>
            <Row cls="rv sticky-k" num="10" title="Review like an art director">
              <p>
                Ask for a harsh review, then fix the three worst problems, then review again. Two rounds beat one long prompt.
              </p>
              <CodeBlock lang="Prompt" code={"Act as a strict art director. Score the page 1 to 10 for hierarchy, pacing and mobile readability. List the three worst problems with where they are, fix them, and score again. Say which checks you could not run."} />
            </Row>
          </div>
        </section>
        <section className="sec">
          <Stick left="03 · Prompt library" right={<>
            <span id="feedcount">0 loaded</span>
          </>} />
          <div className="sec-head">
            <h2 style={{ maxWidth: "20ch" } as CSSProperties}>Twenty-four prompts to copy.</h2>
            <p className="muted" style={{ maxWidth: "46ch" } as CSSProperties}>Replace anything in square brackets. More load as you scroll.</p>
          </div>
          <ol className="feed" id="feed"></ol>
          <div className="feed-end mono busy" id="feedend">
            <span className="spin"></span>
            <span id="feedmsg">Loading more</span>
          </div>
        </section>
        <section className="sec">
          <Stick left="04 · Complete example" right="Northlight, three files" />
          <p className="lede rv" style={{ marginTop: "0" } as CSSProperties}>
            This is a finished, working site you can run now. It was opened in a headless Chromium window and scrolled from top to bottom: the smooth scroll class was applied, the parallax layers moved, all twenty words lit up, all six reveals fired, the gallery translated by its full width, and the console stayed empty. Save the three files in one folder and serve it with
            {" "}
            <code className="i">python3 -m http.server 8000</code>
            .
          </p>
          <div className="rows">
            <Row cls="rv" num="index.html" title="Structure">
              <p>
                Six sections in normal flow. Only the word section and the gallery are pinned.
              </p>
              <CodeBlock lang="index.html" code={"<!doctype html>\n<html lang=\"en-GB\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>Northlight</title>\n<link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n<div class=\"progress\" id=\"progress\"></div>\n\n<header class=\"bar\">\n  <a class=\"logo\" href=\"#top\">Northlight</a>\n  <nav><a href=\"#features\">Features</a><a href=\"#gallery\">Gallery</a><a href=\"#contact\">Contact</a></nav>\n</header>\n\n<main id=\"top\">\n  <section class=\"hero\">\n    <div class=\"layer far\" data-speed=\"0.2\"></div>\n    <div class=\"layer mid\" data-speed=\"0.4\"></div>\n    <div class=\"hero-copy\">\n      <p class=\"eyebrow\">A sample site</p>\n      <h1>Light that follows the long winter.</h1>\n      <p class=\"lede\">A small demonstration of smooth scroll, parallax, word-by-word text and a pinned horizontal gallery.</p>\n      <a class=\"btn\" href=\"#features\">Scroll on</a>\n    </div>\n  </section>\n\n  <section class=\"words\">\n    <div class=\"words-pin\">\n      <p id=\"statement\">Every section on this page moves with your scroll position, so the pace of the story is yours to set.</p>\n    </div>\n  </section>\n\n  <section class=\"features\" id=\"features\">\n    <h2 class=\"reveal\">Three things this page does</h2>\n    <div class=\"cards\">\n      <article class=\"card reveal\" style=\"--d:0\"><h3>Smooth scroll</h3><p>Lenis adds inertia and keeps native scrolling, focus and anchors working.</p></article>\n      <article class=\"card reveal\" style=\"--d:1\"><h3>Depth</h3><p>Background layers move more slowly than the page, which separates them from the text.</p></article>\n      <article class=\"card reveal\" style=\"--d:2\"><h3>Pacing</h3><p>Content arrives as it enters the viewport and stays visible when you scroll back.</p></article>\n    </div>\n  </section>\n\n  <section class=\"hs\" id=\"gallery\">\n    <div class=\"hs-pin\">\n      <h2>Gallery</h2>\n      <div class=\"hs-track\">\n        <figure><span>01</span><figcaption>Dawn</figcaption></figure>\n        <figure><span>02</span><figcaption>Ridge</figcaption></figure>\n        <figure><span>03</span><figcaption>Harbour</figcaption></figure>\n        <figure><span>04</span><figcaption>Aurora</figcaption></figure>\n        <figure><span>05</span><figcaption>Dusk</figcaption></figure>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"cta\" id=\"contact\">\n    <h2 class=\"reveal\">Start with an empty folder.</h2>\n    <a class=\"btn reveal\" href=\"#top\">Back to the top</a>\n  </section>\n</main>\n\n<footer><span>Northlight</span><span>A tutorial example, not a real business.</span></footer>\n\n<script src=\"https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js\"></script>\n<script src=\"app.js\"></script>\n</body>\n</html>"} />
            </Row>
            <Row cls="rv" num="style.css" title="Look and layout">
              <p>
                Colour tokens at the top. The pinned sections use
                {" "}
                <code className="i">position: sticky</code>
                {" "}
                inside a taller parent, so the browser does the pinning.
              </p>
              <CodeBlock lang="style.css" code={":root {\n  --bg: #0b0d10; --fg: #eef2f5; --muted: #98a3ad; --line: #232a31; --accent: #7cc4ff;\n  --pad: clamp(20px, 5vw, 64px);\n  --bar: 64px;\n}\n* { box-sizing: border-box; }\nhtml { background: var(--bg); }\nbody { margin: 0; background: var(--bg); color: var(--fg); font: 400 17px/1.6 system-ui, sans-serif; overflow-x: clip; }\nhtml.lenis, html.lenis body { height: auto; }\n.lenis.lenis-smooth { scroll-behavior: auto !important; }\na { color: inherit; }\nh1, h2, h3 { font-weight: 500; line-height: 1.08; margin: 0; text-wrap: balance; }\nh1 { font-size: clamp(40px, 8vw, 112px); letter-spacing: -0.03em; }\nh2 { font-size: clamp(30px, 5vw, 64px); letter-spacing: -0.02em; }\n.progress { position: fixed; inset: 0 0 auto 0; height: 2px; background: var(--accent); transform-origin: 0 50%; transform: scaleX(0); z-index: 30; }\n.bar { position: fixed; inset: 0 0 auto 0; height: var(--bar); display: flex; justify-content: space-between; align-items: center; padding: 0 var(--pad); z-index: 20; mix-blend-mode: difference; }\n.bar nav { display: flex; gap: 24px; }\n.bar a { text-decoration: none; font-size: 14px; }\n.logo { font-weight: 500; letter-spacing: .02em; }\n.btn { display: inline-block; margin-top: 28px; padding: 14px 22px; border: 1px solid var(--line); text-decoration: none; transition: border-color .2s; }\n.btn:hover, .btn:focus-visible { border-color: var(--accent); }\n\n.hero { position: relative; min-height: 100svh; display: grid; align-items: end; padding: var(--pad); overflow: hidden; }\n.layer { position: absolute; inset: -20% 0; background-repeat: repeat; will-change: transform; }\n.layer.far { background-image: radial-gradient(circle, rgba(124,196,255,.35) 1px, transparent 1.5px); background-size: 90px 90px; }\n.layer.mid { background-image: radial-gradient(circle, rgba(238,242,245,.5) 1.5px, transparent 2px); background-size: 170px 170px; }\n.hero-copy { position: relative; max-width: 960px; padding-bottom: 8vh; }\n.eyebrow { color: var(--accent); font: 500 12px/1 ui-monospace, monospace; letter-spacing: .14em; text-transform: uppercase; }\n.lede { color: var(--muted); max-width: 52ch; }\n\n.words { height: 220vh; position: relative; }\n.words-pin { position: sticky; top: 0; height: 100svh; display: grid; place-items: center; padding: var(--pad); }\n#statement { font-size: clamp(26px, 4.4vw, 60px); line-height: 1.2; max-width: 22em; margin: 0; }\n#statement .w { opacity: .16; transition: opacity .15s linear; }\n\n.features { padding: 20vh var(--pad); }\n.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-top: 48px; }\n.card { border: 1px solid var(--line); padding: 28px; }\n.card p { color: var(--muted); margin: 12px 0 0; }\n\n.js .reveal { opacity: 0; transform: translateY(28px); transition: opacity .9s cubic-bezier(.2,.7,.2,1), transform .9s cubic-bezier(.2,.7,.2,1); transition-delay: calc(var(--d, 0) * 100ms); }\n.js .reveal.in { opacity: 1; transform: none; }\n\n.hs { position: relative; }\n.hs-pin { position: sticky; top: 0; height: 100svh; display: flex; flex-direction: column; justify-content: center; gap: 32px; overflow: hidden; padding-left: var(--pad); }\n.hs-track { display: flex; gap: 16px; width: max-content; will-change: transform; }\n.hs figure { margin: 0; width: min(70vw, 520px); aspect-ratio: 4 / 5; border: 1px solid var(--line); display: flex; flex-direction: column; justify-content: space-between; padding: 20px; background: linear-gradient(160deg, #141a20, #0b0d10); }\n.hs figure span { font: 500 12px/1 ui-monospace, monospace; color: var(--accent); }\n.hs figcaption { font-size: 28px; }\n\n.cta { min-height: 80svh; display: grid; place-content: center; justify-items: start; padding: var(--pad); }\nfooter { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding: 32px var(--pad); border-top: 1px solid var(--line); color: var(--muted); font-size: 14px; }\n\n@media (prefers-reduced-motion: reduce) {\n  .js .reveal { opacity: 1; transform: none; transition: none; }\n  #statement .w { opacity: 1; }\n  .layer { transform: none !important; }\n}"} />
            </Row>
            <Row cls="rv" num="app.js" title="Behaviour">
              <p>
                Smooth scroll, reveals, scroll-driven words, parallax and the gallery, in about seventy lines. One scroll handler does the maths.
              </p>
              <CodeBlock lang="app.js" code={"(function () {\n  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;\n  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };\n  document.documentElement.classList.add('js');\n\n  /* 1. Smooth scroll */\n  var lenis = null;\n  if (!reduced && window.Lenis) {\n    lenis = new Lenis({ lerp: 0.1 });\n    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());\n  }\n  document.addEventListener('click', function (e) {\n    var a = e.target.closest('a[href^=\"#\"]');\n    if (!a) return;\n    var target = document.querySelector(a.getAttribute('href'));\n    if (!target) return;\n    e.preventDefault();\n    if (lenis) lenis.scrollTo(target, { offset: -64 }); else target.scrollIntoView();\n  });\n\n  /* 2. Reveal on scroll */\n  var io = new IntersectionObserver(function (list) {\n    list.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });\n  }, { threshold: 0.15 });\n  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });\n\n  /* 3. Scroll-driven words */\n  var statement = document.getElementById('statement');\n  var words = statement.textContent.trim().split(/\\s+/);\n  statement.innerHTML = words.map(function (w) { return '<span class=\"w\">' + w + '</span>'; }).join(' ');\n  var wEls = statement.querySelectorAll('.w');\n  var wrap = document.querySelector('.words');\n\n  /* 4. Parallax and horizontal pin */\n  var layers = document.querySelectorAll('.layer');\n  var hs = document.querySelector('.hs'), track = document.querySelector('.hs-track'), pin = document.querySelector('.hs-pin');\n  var maxX = 0;\n  function measure() {\n    maxX = Math.max(0, track.scrollWidth - (pin.clientWidth - parseFloat(getComputedStyle(pin).paddingLeft)));\n    hs.style.height = (maxX + pin.clientHeight) + 'px';\n  }\n\n  var bar = document.getElementById('progress');\n  function frame() {\n    var y = window.scrollY, vh = window.innerHeight;\n    bar.style.transform = 'scaleX(' + clamp(y / (document.documentElement.scrollHeight - vh), 0, 1) + ')';\n    if (reduced) return;\n    if (y < vh * 1.3) layers.forEach(function (l) { l.style.transform = 'translate3d(0,' + (y * (1 - parseFloat(l.dataset.speed))) + 'px,0)'; });\n    var r = wrap.getBoundingClientRect();\n    var p = clamp(-r.top / (r.height - vh), 0, 1);\n    wEls.forEach(function (w, i) {\n      w.style.opacity = (0.16 + 0.84 * clamp((p - 0.1 - (i / wEls.length) * 0.7) / 0.06, 0, 1)).toFixed(3);\n    });\n    var h = hs.getBoundingClientRect();\n    var hp = clamp(-h.top / (hs.offsetHeight - vh), 0, 1);\n    track.style.transform = 'translate3d(' + (-hp * maxX) + 'px,0,0)';\n  }\n  addEventListener('scroll', frame, { passive: true });\n  addEventListener('resize', function () { measure(); frame(); });\n  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); frame(); });\n  measure(); frame();\n})();"} />
            </Row>
          </div>
          <div className="rv">
            <Callout>
              Not tested: Safari and Firefox, real touch devices, and screen readers. Test those yourself before publishing.
            </Callout>
          </div>
        </section>
        <NextBar label="Next chapter" href="#motion" text="Chapter 05: Motion" />
      </PageBody>
    </Page>
  );
}
