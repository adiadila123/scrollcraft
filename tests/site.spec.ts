import { audit, CHAPTERS, expect, test } from './fixtures';

test.describe('routes', () => {
  for (const path of ['/', ...CHAPTERS.map((c) => `/${c}`)]) {
    test(`${path} renders with its own title and passes axe`, async ({ page }) => {
      /* the home page builds the three.js hero, which makes the axe scan slow on a busy machine */
      if (path === '/') test.slow();
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1').first()).toBeVisible();
      if (path !== '/') await expect(page).toHaveTitle(new RegExp(`${path.slice(1)}`, 'i'));
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', path === '/' ? /^https?:\/\/[^/]+\/?$/ : new RegExp(`${path}$`));
      const axe = await audit(page);
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
      /* the home page builds the three.js hero, which makes the axe scan slow on a busy machine */
      if (path === '/ro') test.slow();
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', 'ro');
      await expect(page.locator('h1').first()).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${path}$`));
      const en = path.replace(/^\/ro/, '');
      await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', en ? new RegExp(`${en}$`) : /^https?:\/\/[^/]+\/?$/);
      const axe = await audit(page);
      const serious = axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(serious.map((v) => `${v.id}: ${v.nodes.length} × ${v.help}`)).toEqual([]);
    });
  }

  test('the language switch opens the same page in the other language', async ({ page, isMobile }) => {
    await page.goto('/build');
    await page.getByRole('link', { name: 'Citește în română' }).first().click();
    await expect(page).toHaveURL(/\/ro\/build$/);
    await expect(page.locator('h1')).toHaveText('Construiește-l, pas cu pas.');
    if (!isMobile)
      await expect(page.getByRole('navigation', { name: 'Principal' }).getByRole('button', { name: /^Fundamente/ })).toHaveAttribute('data-here', '');
    await page.getByRole('link', { name: 'Read in English' }).first().click();
    await expect(page).toHaveURL(/\/build$/);
  });

  test('Romanian example viewer is in Romanian', async ({ page }) => {
    await page.goto('/ro/examples/longread');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ro');
    await expect(page.getByRole('link', { name: 'Înapoi la capitol' })).toHaveAttribute('href', '/ro/examples#site-longread');
    await expect(page.getByRole('link', { name: 'Exemplul anterior: Field Studio' })).toHaveAttribute('href', '/ro/examples/portfolio');
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
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await nav.getByRole('button', { name: /^Motion/ }).click();
    await nav.getByRole('link', { name: /^05 Motion/ }).click();
    await expect(page).toHaveURL(/\/motion$/);
    await expect(page.locator('h1')).toBeFocused();
    await expect(nav.getByRole('button', { name: /^Motion/ })).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#tb-level-2 a[aria-current="page"]')).toHaveAttribute('href', '/motion');
  });

  test('the topbar opens a level with its chapters, marks where you are and closes with Escape', async ({ page, isMobile }) => {
    test.skip(isMobile, 'the desktop menu is hidden on phones');
    await page.goto('/gsap');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    const level = nav.getByRole('button', { name: /^Motion/ });
    await expect(level).toHaveAttribute('data-here', '');
    await expect(page.locator('.tb-where')).toContainText('07 / 15');
    await level.click();
    const panel = page.locator('#tb-level-2');
    await expect(panel.getByRole('link')).toHaveCount(5);
    await expect(panel.locator('a[aria-current="page"]')).toHaveAttribute('href', '/gsap');
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(level).toBeFocused();
    await expect(nav.getByRole('link', { name: 'Reference' })).toHaveAttribute('href', '/reference');
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
    /* the shortcut is handled by script, so wait until the page has loaded it (the home page is the heaviest) */
    await page.goto('/', { waitUntil: 'networkidle' });
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
    const claude = page.getByRole('tab', { name: 'Claude' }).first();
    await claude.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: 'Gemini' }).first()).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tab', { name: 'Gemini' }).first()).toBeFocused();
    await expect(page.getByRole('tabpanel', { name: 'Gemini' }).first()).toBeVisible();
    /* every tab set follows the one choice: the lesson prompts below switch too */
    await expect(page.getByRole('tab', { name: 'Gemini' }).last()).toHaveAttribute('aria-selected', 'true');
    await page.goto('/skills');
    await expect(page.getByRole('tab', { name: 'Gemini' }).first()).toHaveAttribute('aria-selected', 'true');
  });

  test('the release checklist survives a reload', async ({ page }) => {
    await page.goto('/testing');
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
    await expect(page.getByText('1 of 15 chapters read')).toBeVisible();
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

  test('the GSAP and WebGL previews load their libraries from this site, not a CDN', async ({ page }) => {
    const cdn: string[] = [];
    page.on('request', (r) => {
      if (r.url().includes('cdn.jsdelivr.net')) cdn.push(r.url());
    });
    for (const [chapter, check] of [
      ['gsap', 'typeof gsap === "object"'],
      ['webgl', 'import("three").then((m) => typeof m.WebGLRenderer === "function")'],
    ] as const) {
      await page.goto(`/${chapter}`);
      const frames = page.locator('.dm iframe');
      const count = await page.locator('.dm').count();
      expect(count).toBeGreaterThanOrEqual(4);
      for (let i = 0; i < count; i++) {
        await page.locator('.dm').nth(i).scrollIntoViewIfNeeded();
        const frame = await frames.nth(i).contentFrame();
        await expect(frame.locator('body')).not.toBeEmpty();
        const el = await frames.nth(i).elementHandle();
        await expect.poll(async () => (await el!.contentFrame())!.evaluate(check)).toBe(true);
      }
    }
    expect(cdn, 'requests to the CDN').toEqual([]);
  });

  test('the old Advanced address leads to Architecture, in both languages', async ({ page }) => {
    await page.goto('/advanced');
    await expect(page).toHaveURL(/\/architecture$/);
    await page.goto('/ro/advanced');
    await expect(page).toHaveURL(/\/ro\/architecture$/);
  });

  test('the performance preview stops its loop once it is off screen', async ({ page }) => {
    await page.goto('/performance');
    const demo = page.locator('.dm').first();
    await demo.scrollIntoViewIfNeeded();
    const frame = demo.locator('iframe').contentFrame();
    await expect(frame.locator('.meter span')).toHaveText('running');
    await frame.locator('body').evaluate(() => scrollTo(0, document.body.scrollHeight));
    await expect(frame.locator('.meter span')).toHaveText('paused');
    const drawn = await frame.locator('.meter b').textContent();
    await page.waitForTimeout(400);
    await expect(frame.locator('.meter b')).toHaveText(drawn!);
  });

  test('each example site runs, shows its full code and opens on StackBlitz', async ({ page }) => {
    await page.goto('/examples');
    const sites = page.locator('.dm-site');
    await expect(sites).toHaveCount(3);
    const first = sites.first();
    await first.scrollIntoViewIfNeeded();
    await expect(page.frameLocator('.dm-site iframe').first().locator('h1')).toContainText('Sound that');
    await expect(first.getByRole('link', { name: /View full screen/ })).toHaveAttribute('href', '/examples/launch');
    for (const f of ['index.html', 'style.css', 'app.js']) await expect(first.getByRole('button', { name: f })).toBeAttached();
    await expect(page.locator('.sb-form').first().locator('input[name="project[files][app.js]"]')).toHaveAttribute('value', /requestAnimationFrame/);
  });

  test('an example opens on its own screen, steps to the next one and goes back', async ({ page }) => {
    await page.goto('/examples');
    await page
      .locator('.ex-ctas')
      .first()
      .getByRole('link', { name: /View full screen/ })
      .click();
    await expect(page).toHaveURL(/\/examples\/launch$/);
    await expect(page.locator('h1')).toContainText('Orbit One');
    await expect(page.frameLocator('.vw-frame').locator('h1')).toContainText('Sound that');
    await page.getByRole('link', { name: 'Next example: Field Studio' }).click();
    await expect(page).toHaveURL(/\/examples\/portfolio$/);
    await expect(page.frameLocator('.vw-frame').locator('h1')).toContainText('We design');
    await page.getByRole('link', { name: 'Back to the chapter' }).click();
    await expect(page).toHaveURL(/\/examples#site-portfolio$/);
    await expect(page.locator('#site-portfolio')).toBeInViewport();
  });

  test('every chapter ends with a way back and a way forward', async ({ page }) => {
    await page.goto('/motion');
    const band = page.locator('.next-band');
    await expect(band.getByRole('link', { name: 'Previous 04 Build', exact: true })).toHaveAttribute('href', '/build');
    await expect(band.getByRole('link', { name: 'Next 06 Playground', exact: true })).toHaveAttribute('href', '/playground');
    await page.goto('/start');
    await expect(page.locator('.next-band').getByRole('link', { name: /^Previous/ })).toHaveCount(0);
    await expect(page.locator('.nb-key')).toHaveText(/\] next chapter/);
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

  test('a notice offers to turn animations on, and the footer can turn them off again', async ({ page }) => {
    await page.goto('/motion');
    const notice = page.getByRole('complementary', { name: 'Animations' });
    await expect(notice).toContainText('this device asks for less motion');
    const axe = await audit(page);
    expect(axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => v.id)).toEqual([]);

    await notice.getByRole('button', { name: 'Turn them on' }).click();
    await expect(page.locator('html')).toHaveClass(/lenis/);
    await expect(page.locator('html')).toHaveClass(/motion-on/);
    await expect(notice).toBeHidden();
    /* the live previews get the choice too: their reduced-motion query can no longer match */
    const demo = page.locator('#scroll-triggered + .dm');
    await demo.scrollIntoViewIfNeeded();
    await expect(demo.locator('iframe')).toHaveAttribute('srcdoc', /\(prefers-reduced-motion: reduce\) and \(scripting: none\)/);

    const sw = page.locator('.motion-switch');
    await expect(sw).toContainText('Animations: on');
    await sw.getByRole('button', { name: 'Turn off' }).click();
    await expect(page.locator('html')).not.toHaveClass(/lenis/);
    await expect(page.locator('.motion-switch')).toContainText('Animations: off');
    await expect(notice).toBeHidden();
  });

  test('keeping animations off hides the notice for good', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Keep them off' }).click();
    await expect(page.getByRole('complementary', { name: 'Animations' })).toBeHidden();
    await page.reload();
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.getByRole('complementary', { name: 'Animations' })).toBeHidden();
  });
});

test('devices that allow motion never see the animations notice or switch', async ({ page }) => {
  await page.goto('/motion');
  await expect(page.locator('html')).toHaveClass(/lenis/);
  await expect(page.locator('.motion-notice')).toHaveCount(0);
  await expect(page.locator('.motion-switch')).toHaveCount(0);
});

test.describe('lessons', () => {
  test('a lesson has objectives, prompts for the chosen tool, hidden solutions and criteria that complete it', async ({ page }) => {
    await page.goto('/prompting');
    await expect(page.locator('#what-you-will-learn + .goals li')).toHaveCount(4);

    /* the prompt names the rules file of the tool picked in the tabs */
    const ai = page.locator('#practice-work-with-ai').locator('..');
    await ai.getByRole('tab', { name: 'Gemini' }).click();
    await expect(ai.getByRole('tabpanel', { name: 'Gemini' })).toContainText('Read GEMINI.md and brief.md');
    await ai.getByRole('tab', { name: 'Claude' }).click();
    await expect(ai.getByRole('tabpanel', { name: 'Claude' })).toContainText('Read CLAUDE.md and brief.md');

    const exercise = page.locator('#exercise-2');
    await expect(exercise.getByText('no library except Lenis')).toBeHidden();
    await exercise.getByText('Show the solution').click();
    await expect(exercise.getByText(/no library except Lenis/)).toBeVisible();

    const boxes = page.locator('#practice-assessment').locator('..').getByRole('checkbox');
    await expect(boxes).toHaveCount(4);
    for (let i = 0; i < 4; i++) await boxes.nth(i).check();
    await expect(page.getByText('All criteria met. This chapter is marked as complete.')).toBeVisible();
    const done = await page.evaluate(() => JSON.parse(localStorage.getItem('sc-progress') || '{}').done);
    expect(done).toContain('prompting');
    await page.reload();
    await expect(boxes.first()).toBeChecked();
  });

  for (const id of CHAPTERS.filter((c) => c !== 'reference'))
    test(`/${id} has the full lesson frame`, async ({ page, isMobile }) => {
      test.skip(isMobile, 'one viewport is enough for the structure');
      await page.goto(`/${id}`);
      for (const part of [
        'what-you-will-learn',
        'practice-work-with-ai',
        'practice-exercises',
        'practice-course-project',
        'practice-test-it',
        'practice-assessment',
      ])
        await expect(page.locator(`#${part}`), part).toBeAttached();
    });

  test('the Reference appendix has objectives but no practice', async ({ page }) => {
    await page.goto('/reference');
    await expect(page.locator('#what-you-will-learn + .goals li')).toHaveCount(3);
    await expect(page.locator('#practice-work-with-ai')).toHaveCount(0);
  });

  test('Romanian lessons are in Romanian', async ({ page }) => {
    await page.goto('/ro/start');
    await expect(page.locator('#ce-vei-invata + .goals li').first()).toContainText('Alegi între Claude Code');
    await expect(page.locator('#practica-evaluare')).toBeAttached();
  });
});

test.describe('phone', () => {
  test('course bar steps between chapters and opens every chapter', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'phones only');
    await page.goto('/architecture');
    const bar = page.getByRole('navigation', { name: 'Course' });
    await expect(bar.getByRole('link', { name: 'Previous: Design systems' })).toHaveAttribute('href', '/design');
    await expect(bar.getByRole('link', { name: 'Next: Performance' })).toHaveAttribute('href', '/performance');
    const all = bar.getByRole('button', { name: /Show all chapters/ });
    await all.click();
    const sheet = page.getByRole('dialog', { name: 'All chapters' });
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole('link', { name: /Architecture/ })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(sheet).toBeHidden();
    await expect(all).toBeFocused();
    await all.click();
    await expect(sheet.getByText('Level 3 · Production')).toBeVisible();
    await sheet.getByRole('link', { name: /Reference/ }).click();
    await expect(page).toHaveURL(/\/reference$/);
    await expect(sheet).toBeHidden();
  });
});
