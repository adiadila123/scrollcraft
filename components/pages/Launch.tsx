import type { CSSProperties } from 'react';
import Checklist from '@/components/launch/Checklist';
import { Cell, CodeBlock, NextBand, Page, PageBody, PageHead, Row, Stick } from '@/components/ui';

export default function LaunchPage() {
  return (
    <Page route="launch">
      <PageBody>
        <PageHead
          chapter="launch"
          title="Test it, fix it, publish it."
          lede="The last ten per cent is where a site stops feeling like a demo. Work through the checklist, then put the folder online."
        />
        <section className="sec">
          <Checklist
            items={[
              'The site runs from a local server, not from file://',
              'The browser console shows no errors',
              'I checked it at 375, 768 and 1440 px wide',
              'Nothing overlaps or is clipped on a phone-sized window',
              'Every reveal element becomes visible once I scroll to it',
              'Reduced motion turns off smooth scroll, parallax and reveal movement',
              'Everything works with the keyboard alone, with visible focus',
              'Body text has a contrast ratio of at least 4.5 to 1',
              'Images are compressed and I use at most two font families',
              'There are no invented statistics, quotes or customer logos',
              'Every external library is pinned to an exact version',
              'I ran Lighthouse in Chrome DevTools and noted the scores',
            ]}
          />
          <p className="muted" style={{ marginTop: '20px', maxWidth: '56ch' } as CSSProperties}>
            Ticks are saved in this browser only, so they may reset in a private window.
          </p>
        </section>
        <section className="sec">
          <Stick left="02 · Ask for evidence" />
          <div className="rows">
            <Row cls="rv" num="a" title="Do not accept “tested”">
              <p>
                AI tools sometimes report checks they did not run. Ask what was run, on which widths, and what was skipped. Then open the page and look
                yourself.
              </p>
              <CodeBlock
                lang="Prompt"
                code={'List every check you actually ran, with the width or tool you used. List every check you could not run and why.'}
              />
            </Row>
            <Row cls="rv" num="b" title="Measure, then fix">
              <p>
                In Chrome DevTools, the Lighthouse tab gives performance and accessibility scores. Fix the biggest item first and run it again. The Performance
                tab shows what blocks the main thread while you scroll.
              </p>
            </Row>
            <Row cls="rv" num="c" title="Common mistakes">
              <p>
                Opening the file directly instead of through a server. Missing doctype, which breaks Lenis. Page-level scroll snap together with smooth scroll.
                Parallax offsets that push hero text off a phone screen. <code className="i">will-change</code> on every element. Content hidden by CSS that no
                script ever reveals. <code className="i">overflow: hidden</code> on the html or body element, which can leave two scroll contexts.
              </p>
            </Row>
          </div>
        </section>
        <section className="sec">
          <Stick left="03 · Publish the folder" right="Any static host" />
          <p className="lede rv" style={{ marginTop: '0' } as CSSProperties}>
            The result is three static files, so any static host will serve it. Check each host’s page for current limits and prices.
          </p>
          <div className="cells rv" style={{ marginTop: '28px' } as CSSProperties}>
            <Cell title="Netlify">
              <p>Drag the folder onto the Netlify Drop page, or deploy from the command line.</p>
            </Cell>
            <Cell title="Vercel">
              <p>Run the command below inside the folder and follow the prompts.</p>
            </Cell>
            <Cell title="GitHub Pages">
              <p>Push the folder to a repository, then turn on Pages in the repository settings.</p>
            </Cell>
            <Cell title="Cloudflare Pages">
              <p>Upload the folder from the dashboard, or connect a repository.</p>
            </Cell>
          </div>
          <div className="rv">
            <CodeBlock lang="bash" code={'npx vercel'} />
          </div>
        </section>
        <section className="sec">
          <Stick left="04 · Keep going" right="Official docs" />
          <div className="rows">
            <Row cls="rv" num="Docs" title="Where each piece is documented">
              <p>
                <a className="ext" href="https://code.claude.com/docs/en/skills" target="_blank" rel="noopener">
                  Claude Code skills
                </a>
                ,{' '}
                <a className="ext" href="https://claude.com/docs/skills/how-to" target="_blank" rel="noopener">
                  create custom skills
                </a>
                ,{' '}
                <a className="ext" href="https://geminicli.com/docs/get-started" target="_blank" rel="noopener">
                  Gemini CLI
                </a>
                ,{' '}
                <a className="ext" href="https://learn.chatgpt.com/docs/build-skills" target="_blank" rel="noopener">
                  OpenAI skills
                </a>
                ,{' '}
                <a className="ext" href="https://agentskills.io/specification" target="_blank" rel="noopener">
                  Agent Skills specification
                </a>
                .
              </p>
            </Row>
            <Row cls="rv" num="Code" title="Libraries used here">
              <p>
                <a className="ext" href="https://github.com/darkroomengineering/lenis" target="_blank" rel="noopener">
                  Lenis
                </a>{' '}
                for smooth scrolling,{' '}
                <a className="ext" href="https://gsap.com/docs/v3/Plugins/ScrollTrigger/" target="_blank" rel="noopener">
                  GSAP ScrollTrigger
                </a>{' '}
                for scrubbed and pinned animation, and{' '}
                <a className="ext" href="https://threejs.org" target="_blank" rel="noopener">
                  three.js
                </a>{' '}
                for the particle head. GSAP became free for commercial use in 2025, per{' '}
                <a className="ext" href="https://webflow.com/blog/gsap-becomes-free" target="_blank" rel="noopener">
                  Webflow’s announcement
                </a>
                .
              </p>
            </Row>
          </div>
        </section>
        <NextBand from="launch" />
      </PageBody>
    </Page>
  );
}
