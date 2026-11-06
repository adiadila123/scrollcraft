import type { CSSProperties } from 'react';
import { EasingLab, LerpLab, ParallaxLab, StaggerLab } from '@/components/playground/Labs';
import { NextBand, Page, PageBody, PageHead, Stick } from '@/components/ui';

export default function PlaygroundPage() {
  return (
    <Page route="playground">
      <PageBody>
        <PageHead
          chapter="playground"
          title="Playground: change the numbers and watch what happens."
          lede="Four small experiments. Each one shows how a single setting changes the feel of a scroll site, and prints the line of code to copy."
        />
        <section className="sec">
          <Stick left="01 · Smoothing" right="Lenis lerp" />
          <p className="lede rv" style={{ marginTop: '0' } as CSSProperties}>
            Lenis moves the page a fraction of the way to where you scrolled on every frame. That fraction is <code className="i">lerp</code>. Click or drag on
            the bar to set a target.
          </p>
          <LerpLab />
        </section>
        <section className="sec">
          <Stick left="02 · Parallax" right="Layer speed" />
          <p className="lede rv" style={{ marginTop: '0' } as CSSProperties}>
            Scroll inside the box. The dots follow the formula from the example: <code className="i">translateY = scroll × (1 − speed)</code>.
          </p>
          <ParallaxLab />
        </section>
        <section className="sec">
          <Stick left="03 · Stagger" right="Reveal timing" />
          <StaggerLab />
        </section>
        <section className="sec">
          <Stick left="04 · Easing" right="Cubic Bezier" />
          <EasingLab />
        </section>
        <NextBand from="playground" />
      </PageBody>
    </Page>
  );
}
