import AxeBuilder from '@axe-core/playwright';
import { test as base, expect, type Page } from '@playwright/test';

/** Every test fails on a console error or an uncaught exception, and skips the intro loader unless it opts in. */
export const test = base.extend<{ consoleErrors: string[]; showLoader: boolean }>({
  showLoader: [false, { option: true }],
  consoleErrors: [
    async ({ page, showLoader }, use) => {
      const errors: string[] = [];
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(m.text());
      });
      page.on('pageerror', (e) => errors.push(e.message));
      if (!showLoader)
        await page.addInitScript(() => {
          /* also runs inside the sandboxed preview frames, which have no storage */
          try {
            sessionStorage.setItem('sc-loaded', '1');
          } catch {}
        });
      await use(errors);
      expect(errors, 'console errors').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/**
 * An axe audit, contrast included. Running transitions are finished first (endless loops cannot be), so contrast is
 * measured on what the reader settles on rather than halfway through a fade. The footer's large wordmark is drawn
 * with CSS generated content, so it is decoration rather than text and needs no exclusion.
 */
export async function audit(page: Page) {
  await page.evaluate(() =>
    document
      .getAnimations()
      .filter((a) => a.effect?.getComputedTiming().endTime !== Infinity)
      .forEach((a) => a.finish()),
  );
  return new AxeBuilder({ page }).analyze();
}

export const CHAPTERS = [
  'start',
  'skills',
  'prompting',
  'build',
  'motion',
  'playground',
  'gsap',
  'webgl',
  'examples',
  'design',
  'architecture',
  'performance',
  'testing',
  'launch',
  'reference',
];
