import AxeBuilder from '@axe-core/playwright';
import { CHAPTERS, expect, test } from './fixtures';

test.describe('routes', () => {
  for (const path of ['/', ...CHAPTERS.map((c) => `/${c}`)]) {
    test(`${path} renders with its own title and passes axe`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1').first()).toBeVisible();
      if (path !== '/') await expect(page).toHaveTitle(new RegExp(`${path.slice(1)}`, 'i'));
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', path === '/' ? /^https?:\/\/[^/]+\/?$/ : new RegExp(`${path}$`));
      const axe = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();
      const serious = axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(serious.map((v) => `${v.id}: ${v.nodes.length} × ${v.help}`)).toEqual([]);
    });
  }

  test('unknown paths get the 404 page', async ({ page, consoleErrors }) => {
    const res = await page.goto('/nope');
    expect(res?.status()).toBe(404);
    await expect(page.locator('h1')).toHaveText(/not part of the tutorial/);
    /* the browser logs the 404 response itself; that one is expected */
    consoleErrors.splice(0, consoleErrors.length, ...consoleErrors.filter((e) => !e.includes('status of 404')));
  });

  test('links from the old single-page site redirect', async ({ page }) => {
    await page.goto('/#build');
    await expect(page).toHaveURL(/\/build$/);
    await expect(page.locator('h1')).toHaveText(/Build it, step by step/);
  });

  test('sitemap lists every chapter in both languages and social images render', async ({ page, request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    for (const c of CHAPTERS) {
      expect(xml).toContain(`/${c}</loc>`);
      expect(xml).toContain(`/ro/${c}</loc>`);
    }
    for (const path of ['/build', '/ro/build']) {
      await page.goto(path);
      const src = await page.locator('meta[property="og:image"]').first().getAttribute('content');
      const og = await request.get(new URL(src!).pathname);
      expect(og.headers()['content-type']).toBe('image/png');
    }
  });
});

test.describe('romanian', () => {
  for (const path of ['/ro', ...CHAPTERS.map((c) => `/ro/${c}`)]) {
    test(`${path} is in Romanian and passes axe`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', 'ro');
      await expect(page.locator('h1').first()).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${path}$`));
      const en = path.replace(/^\/ro/, '');
      await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', en ? new RegExp(`${en}$`) : /^https?:\/\/[^/]+\/?$/);
      const axe = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();
      const serious = axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(serious.map((v) => `${v.id}: ${v.nodes.length} × ${v.help}`)).toEqual([]);
    });
  }

  test('the language switch opens the same page in the other language', async ({ page, isMobile }) => {
    await page.goto('/build');
    await page.getByRole('link', { name: 'Citește în română' }).first().click();
    await expect(page).toHaveURL(/\/ro\/build$/);
    await expect(page.locator('h1')).toHaveText('Construiește-l, pas cu pas.');
    if (!isMobile) await expect(page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Construcție' })).toHaveAttribute('aria-current', 'page');
    await page.getByRole('link', { name: 'Read in English' }).first().click();
    await expect(page).toHaveURL(/\/build$/);
  });

  test('unknown Romanian chapters get the Romanian 404', async ({ page, consoleErrors }) => {
    const res = await page.goto('/ro/nimic');
    expect(res?.status()).toBe(404);
    await expect(page.locator('h1')).toHaveText(/nu face parte din tutorial/);
    consoleErrors.splice(0, consoleErrors.length, ...consoleErrors.filter((e) => !e.includes('status of 404')));
  });

  test('Romanian prompts fill in the project and search finds Romanian sections', async ({ page }) => {
    await page.goto('/ro/build');
    await page.getByLabel('Subiect').fill('un tren de noapte');
    await expect(page.locator('.code pre').filter({ hasText: 'Vreau un site minimalist' }).first()).toContainText('despre un tren de noapte pentru [public]');
    await page.keyboard.press('ControlOrMeta+k');
    await page.getByRole('combobox').fill('glosar');
    await expect(page.getByRole('option').first()).toContainText('Glosar');
  });
});

test.describe('navigation', () => {
  test('client-side navigation moves focus to the new heading', async ({ page, isMobile }) => {
    test.skip(isMobile, 'the desktop menu is hidden on phones');
    await page.goto('/start');
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Motion' }).click();
    await expect(page).toHaveURL(/\/motion$/);
    await expect(page.locator('h1')).toBeFocused();
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Motion' })).toHaveAttribute('aria-current', 'page');
  });

  test('leaving the Motion page straight away does not throw', async ({ page }) => {
    await page.goto('/skills', { waitUntil: 'networkidle' });
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press(']');
      await page.keyboard.press(']');
      await page.keyboard.press(']');
      await page.keyboard.press('[');
      await page.keyboard.press('[');
      await page.keyboard.press('[');
    }
    await page.waitForTimeout(500);
  });

  test('[ and ] step through the chapters', async ({ page }) => {
    await page.goto('/skills', { waitUntil: 'networkidle' });
    await page.keyboard.press(']');
    await expect(page).toHaveURL(/\/prompting$/);
    await expect(page.locator('h1')).toHaveText(/Prompting/);
    await page.keyboard.press('[');
    await expect(page).toHaveURL(/\/skills$/);
    await expect(page.locator('h1')).toHaveText(/Skills/);
    await page.keyboard.press('[');
    await expect(page).toHaveURL(/\/start$/);
  });

  test('search palette finds a prompt and opens its chapter', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('ControlOrMeta+k');
    const input = page.getByRole('combobox');
    await expect(input).toBeFocused();
    await input.fill('art director');
    await expect(page.getByRole('option').first()).toBeVisible();
    await page.keyboard.press('Enter');
    /* Build is the heaviest page; under a full parallel run its navigation can take longer than the default wait */
    await expect(page).toHaveURL(/\/(build|prompting)/, { timeout: 15_000 });
    await expect(page.getByRole('dialog', { name: 'Search the tutorial' })).toBeHidden();
  });

  test('one Escape closes the palette even with text typed', async ({ page }) => {
    await page.goto('/start', { waitUntil: 'networkidle' });
    await page.keyboard.press('ControlOrMeta+k');
    await page.getByRole('combobox').fill('gsap');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Search the tutorial' })).toBeHidden();
  });

  test('section anchors from search land on the section', async ({ page }) => {
    await page.goto('/prompting#show-the-evidence');
    await expect(page.locator('#show-the-evidence')).toBeInViewport();
  });
});

test.describe('features', () => {
  test('copy buttons copy the code', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard permissions are Chromium only');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/start');
    const block = page.locator('.code').filter({ visible: true }).first();
    await block.getByRole('button', { name: 'Copy' }).click();
    await expect(block.getByRole('button')).toHaveText('Copied');
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toBe(await block.locator('pre').textContent());
  });

  test('code is syntax highlighted at build time', async ({ page }) => {
    await page.goto('/motion');
    await expect(page.locator('.code pre span[style*="color"]').first()).toBeAttached();
  });

  test('platform tabs work with the keyboard and are remembered across chapters', async ({ page }) => {
    await page.goto('/start');
    const claude = page.getByRole('tab', { name: 'Claude' });
    await claude.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: 'Gemini' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tab', { name: 'Gemini' })).toBeFocused();
    await expect(page.getByRole('tabpanel', { name: 'Gemini' })).toBeVisible();
    await page.goto('/skills');
    await expect(page.getByRole('tab', { name: 'Gemini' })).toHaveAttribute('aria-selected', 'true');
  });

  test('the launch checklist survives a reload', async ({ page }) => {
    await page.goto('/launch');
    await page.getByRole('checkbox').first().check();
    await expect(page.getByText('1 of 12 done')).toBeVisible();
    await page.reload();
    await expect(page.getByRole('checkbox').first()).toBeChecked();
    await expect(page.getByText('1 of 12 done')).toBeVisible();
  });

  test('the prompt library loads all 24 prompts as you scroll', async ({ page }) => {
    await page.goto('/build#prompt-library');
    const items = page.locator('.feed .fi');
    for (let i = 0; i < 6 && (await items.count()) < 24; i++) {
      await page.locator('.feed-end').scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
    }
    await expect(items).toHaveCount(24);
    await expect(page.getByText('End of the sample list')).toBeVisible();
  });

  test('reaching the end of a chapter records progress shown on the home page', async ({ page }) => {
    await page.goto('/start');
    await page.locator('.next-band').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.goto('/');
    await expect(page.getByText('1 of 9 chapters read')).toBeVisible();
    await expect(page.getByRole('link', { name: /Next: 02 Skills/ })).toHaveAttribute('href', '/skills');
  });

  test('the home page resumes at the section being read', async ({ page }) => {
    await page.goto('/build');
    await page.evaluate(() => scrollTo(0, document.getElementById('prompt-library')!.getBoundingClientRect().top + scrollY - 100));
    /* wait until the rail has recorded the section, rather than for a fixed time */
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('sc-progress') ?? '{}').at?.id)).toBe('prompt-library');
    await page.goto('/');
    const resume = page.getByRole('link', { name: /Resume: 04 Build · Prompt library/ });
    await expect(resume).toHaveAttribute('href', '/build#prompt-library');
    await resume.click();
    await expect(page).toHaveURL(/\/build#prompt-library$/);
    await expect(page.locator('#prompt-library')).toBeInViewport();
  });

  test('the project fields fill every prompt and survive a reload', async ({ page }) => {
    await page.goto('/build');
    await page.getByLabel('Subject').fill('a night train');
    await page.getByLabel('Audience').fill('winter travellers');
    const brief = page.locator('.code pre').filter({ hasText: 'I want a minimalist' }).first();
    await expect(brief).toContainText('about a night train for winter travellers. The visitor should finish by [one action].');
    await page.reload();
    await expect(page.getByLabel('Subject')).toHaveValue('a night train');
    await page.locator('#prompt-library').scrollIntoViewIfNeeded();
    await page.locator('.feed-end').scrollIntoViewIfNeeded();
    await expect(page.locator('.feed .slot', { hasText: 'a night train' }).first()).toBeAttached();
  });

  test('live previews run beside their code, with a preview and code switch on phones', async ({ page, isMobile }) => {
    await page.goto('/motion');
    const demo = page.locator('.dm').first();
    await demo.scrollIntoViewIfNeeded();
    await expect(page.frameLocator('.dm iframe').first().locator('.label').first()).toHaveText('01 · Brief');
    const stage = demo.locator('.dm-stage');
    const code = demo.locator('.dm-code');
    if (isMobile) {
      await expect(demo.getByRole('button', { name: 'Preview' })).toHaveAttribute('aria-pressed', 'true');
      await expect(code).toBeHidden();
      await demo.getByRole('button', { name: 'CSS' }).click();
      await expect(stage).toBeHidden();
      await expect(code).toContainText('position: sticky');
      await demo.getByRole('button', { name: 'Preview' }).click();
      await expect(stage).toBeVisible();
    } else {
      await expect(stage).toBeVisible();
      await expect(code).toContainText('<section>');
      await demo.getByRole('button', { name: 'CSS' }).click();
      await expect(stage).toBeVisible();
      await expect(code).toContainText('position: sticky');
    }
  });

  test('each example site runs, shows its full code and opens on StackBlitz', async ({ page }) => {
    await page.goto('/examples');
    const sites = page.locator('.dm-site');
    await expect(sites).toHaveCount(3);
    const first = sites.first();
    await first.scrollIntoViewIfNeeded();
    await expect(page.frameLocator('.dm-site iframe').first().locator('h1')).toContainText('Sound that');
    await expect(first.getByRole('link', { name: /Full screen/ })).toHaveAttribute('href', '/examples/launch/index.html');
    for (const f of ['index.html', 'style.css', 'app.js']) await expect(first.getByRole('button', { name: f })).toBeAttached();
    await expect(page.locator('.sb-form').first().locator('input[name="project[files][app.js]"]')).toHaveAttribute('value', /requestAnimationFrame/);
  });

  test('playground sliders rewrite the code', async ({ page }) => {
    await page.goto('/playground');
    await page.locator('input[type="range"]').first().fill('0.3');
    await expect(page.locator('.code pre').first()).toHaveText('new Lenis({ lerp: 0.3 })');
  });
});

test.describe('loader', () => {
  test.use({ showLoader: true });
  test('plays once per session and leaves within its time cap', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.loader')).toBeVisible();
    /* JavaScript closes it within 2.5 s of hydrating; the CSS safety net guarantees 4 s from first paint */
    await expect(page.locator('.loader')).toBeHidden({ timeout: 7000 });
    await expect(page.locator('html')).toHaveClass(/ld-skip/);
    await page.goto('/start');
    await page.goto('/');
    await expect(page.locator('.loader')).toBeHidden();
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('content is visible without movement and smooth scrolling is off', async ({ page }) => {
    await page.goto('/motion');
    await expect(page.locator('.rv').first()).toHaveCSS('opacity', '1');
    await expect(page.locator('html')).not.toHaveClass(/lenis/);
  });
});

test.describe('phone', () => {
  test('course bar steps between chapters and opens every chapter', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'phones only');
    await page.goto('/advanced');
    const bar = page.getByRole('navigation', { name: 'Course' });
    await expect(bar.getByRole('link', { name: 'Previous: Playground' })).toHaveAttribute('href', '/playground');
    await expect(bar.getByRole('link', { name: 'Next: Examples' })).toHaveAttribute('href', '/examples');
    const all = bar.getByRole('button', { name: /Show all chapters/ });
    await all.click();
    const sheet = page.getByRole('dialog', { name: 'All chapters' });
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole('link', { name: /Advanced/ })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(sheet).toBeHidden();
    await expect(all).toBeFocused();
    await all.click();
    await sheet.getByRole('link', { name: /Launch/ }).click();
    await expect(page).toHaveURL(/\/launch$/);
    await expect(sheet).toBeHidden();
  });
});
