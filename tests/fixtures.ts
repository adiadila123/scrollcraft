import { test as base, expect } from '@playwright/test';

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

export const CHAPTERS = ['start', 'skills', 'prompting', 'build', 'motion', 'playground', 'gsap', 'webgl', 'examples', 'advanced', 'launch'];
