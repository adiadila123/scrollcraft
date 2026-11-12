# Scrollcraft

A free, bilingual (English and Romanian) tutorial on building minimalist, cinematic scroll websites with Claude,
Gemini or ChatGPT. Every technique runs live beside its code, and five portfolio projects are taken apart line by
line, each one responsive and still under reduced motion, checked by the test suite.

Built with Next.js 16 (App Router), React 19, TypeScript, MDX, three.js, GSAP and Lenis.

## What is inside

Fifteen chapters in three levels, each at `/<chapter>` in English and `/ro/<chapter>` in Romanian:

| #                         | Chapter               | What it covers                                                                                 |
| ------------------------- | --------------------- | ---------------------------------------------------------------------------------------------- |
| **Level 1 · Foundations** |                       |                                                                                                |
| 01                        | Start                 | Choosing an AI tool, installing it, setting up a project folder                                |
| 02                        | Skills                | What skills are, where to find them, how to install and write them                             |
| 03                        | Prompting             | A five-part brief, a project rules file, steering patterns                                     |
| 04                        | Build                 | Ten steps with the exact prompt for each, and a complete example on StackBlitz                 |
| **Level 2 · Motion**      |                       |                                                                                                |
| 05                        | Motion                | Nine scroll techniques and five real-world recipes, each running live beside its code          |
| 06                        | Playground            | Live experiments with smoothing, parallax speed, stagger and easing                            |
| 07                        | GSAP                  | Timelines, scrub, pinning, SVG drawing and split text, live; useGSAP; CSS scroll timelines     |
| 08                        | WebGL                 | Four three.js scenes driven by scroll: a model, particles, a shader, an image transition       |
| 09                        | Examples              | Five portfolio projects with briefs and checklists: launch, portfolio, long-read, GSAP, WebGL  |
| **Level 3 · Production**  |                       |                                                                                                |
| 10                        | Design systems        | Colour, type, space and motion tokens, components that read them, a DESIGN.md for the AI       |
| 11                        | Architecture          | Choosing a stack, folder structure, one animation loop, React cleanup, progressive enhancement |
| 12                        | Performance           | Core Web Vitals, an asset budget, smooth-scrolling rules, measuring                            |
| 13                        | Testing and QA        | Release checklist, Playwright tests, axe, screenshot comparisons, real devices                 |
| 14                        | Production and launch | Publishing static or Next.js, domain and metadata, CI, looking after the site                  |
| **Appendix**              |                       |                                                                                                |
| 15                        | Reference             | A fault table and a glossary                                                                   |

The old `/advanced` address redirects to Architecture.

Interface features: a topbar grouped by level, where each level opens a panel with its chapters and your reading
progress, a search palette (⌘K or Ctrl K), `[` and `]` to step through chapters, Back and Next at the end
of every chapter, a course bar on phones, reading progress that resumes where you left off, and project fields that
fill your own subject into every prompt. Smooth scrolling, parallax and reveals all switch off under
`prefers-reduced-motion`.

## Run it

    npm install
    npm run dev        # http://localhost:3000
    npm run build && npm start

Requires Node 20.9 or later. Set `NEXT_PUBLIC_SITE_URL` to the production origin so canonical URLs, the sitemap
and social cards point at the right domain.

## Checks

    npm run lint           # ESLint (Next.js core web vitals + TypeScript rules)
    npm run typecheck
    npm run format:check   # Prettier
    npm test               # Playwright against the production build: run `npm run build` first
    npm run check:links    # every external link in the source
    npm run verify         # lint, types, build and tests in one go

The Playwright suite runs on a desktop and a phone viewport. It covers every route in both languages, an axe
accessibility audit per page, hreflang and the sitemap, search, keyboard shortcuts, copy buttons, platform tabs, the
project fields, the checklist, progress tracking and resume, the live previews and their phone switch, the example
viewer, Back and Next, the loader cap, reduced motion, the phone course bar and the 404 pages. Any console error fails a test. CI (`.github/workflows/ci.yml`) runs all of it on every
push and pull request, and a weekly workflow checks the external links.

## Structure

    app/
      (en)/ (ro)/ro/        one root layout per language (its own <html lang>); home, [chapter] and
                            [chapter]/[site] (the example viewer) in each
      global-not-found.tsx  the 404 for addresses that match neither language
      */opengraph-image.tsx social cards, generated at build time
      sitemap.ts robots.ts manifest.ts icon.svg not-found.tsx error.tsx
    content/en/ content/ro/ the text of each chapter, one MDX file per language; mdx-components.tsx lists what MDX can use
    components/
      pages/                Home, Chapter (opening + MDX body + Back/Next band), ExampleViewer, NotFound
      ui/                   CodeBlock (Shiki, build time), Demo and Example (live preview beside code), Row, Stick, PageHead…
      chapter/              ChapterHead (opening and particle backdrop), ChapterRail, NextBand (Back and Next)
      chrome/               Topbar, MobileNav (course bar and chapters sheet), CommandPalette (⌘K), Footer
      engine/               SmoothScroll (Lenis), RouteEffects (focus, reveals, progress bar, [ ] shortcuts)
      home/ build/ motion/ playground/ launch/   the interactive parts of each page
      particles/            ParticleCanvas
    lib/
      chapters.ts           the chapter list: routes, navigation, metadata, sitemap and search all read it
      dict.ts i18n.ts       interface text in both languages, and the locale helpers
      content.ts            maps each chapter id and language to its MDX file
      lessons/              the lesson frame per chapter: objectives, AI prompts, exercises, project, tests, criteria
      demos.ts              the small runnable pages behind every <Demo>; demos-gsap.ts, demos-webgl.ts and
                            demos-pro.ts hold the GSAP, WebGL and level 3 chapters' previews
      examples.ts           the example sites, in order, for the full-screen viewer
      ticker.ts             the single requestAnimationFrame loop; pauses while the tab is hidden
      hero/                 the three.js particle head and its shaders (loaded on the home page only)
      particles/            the 2D particle shapes and the manager that draws them
      store.ts progress.ts  localStorage-backed state (platform, checklist, reading progress)
      search-index.json     generated by scripts/build-search-index.mjs before dev and build
    public/examples/        the five portfolio projects in the Examples chapter (index.html, style.css, app.js each);
                            /examples/<site> shows each one full screen with Back and previous/next (lib/examples.ts)
    public/live/            the same sites with library URLs pointed at /vendor, generated by copy-vendor.mjs (not
                            committed); the frames load these, the code tabs and StackBlitz keep the CDN URLs
    public/vendor/          GSAP and three.js copied from node_modules by scripts/copy-vendor.mjs (not committed);
                            previews load these instead of the CDN, so they work on networks that block CDNs
    scripts/                search index generator, vendor copier, link checker (source and chapter MDX)
    tests/                  Playwright

## Adding a chapter

1. Add an entry to `lib/chapters.ts`, with its `level` (1 to 3, or 4 for the appendix).
2. Write `content/en/your-chapter.mdx`: `export const meta = { title, lede }`, then the sections, using the components in `mdx-components.tsx`. Keep text that wraps inside a component on one line, or MDX wraps it in an extra paragraph. Prettier skips these files for the same reason.
3. Write the Romanian version as `content/ro/your-chapter.mdx`, add its titles to `lib/chapters.ts`, and import both in `lib/content.ts`.

4. Add its lesson frame to `lib/lessons/en.mjs` and `ro.mjs` (every chapter has one; the appendix has objectives only): objectives (shown under the title), then a session with
   the AI, exercises with hidden solutions, the course project step, how to test it, and acceptance criteria (shown
   after the chapter). Prompts can use `{rules}` and `{skills}`, which become the rules file and skills folder of the
   tool the reader picked. Ticking every criterion marks the chapter complete. The files are plain `.mjs` so the
   search index script can read them; `lib/lessons/index.ts` checks them against the `Lesson` type.

Interface text (navigation, buttons, labels) lives in `lib/dict.ts`; the Romanian object must have every key the English one has, so TypeScript catches a missing translation.

The route, navigation, sitemap, social card, reading time and search entries follow automatically.

For a live preview, add the demo to `lib/demos.ts` (or the GSAP and WebGL files beside it) and write `<Demo id="…" name="…" />`. For a complete site, put its three files in `public/examples/<id>/` and write `<Example id="<id>" name="…" />`: the frame, the code tabs and the StackBlitz button all read those files.

## Deploying

Every page and social card is prerendered at build time, so the site deploys to Vercel with no configuration:
import the repository, or run `vercel --prod` from the project folder. Set `NEXT_PUBLIC_SITE_URL` in the project's
environment variables to the production URL.

## Writing conventions

- Examples and demos are written mobile first: phone layout as the base, wider screens added with `min-width` queries.
- Every effect has a still version under `prefers-reduced-motion`, and content is hidden only under a `.js` class, so
  nothing is lost if a script fails.
- Example products, studios and stories are fictional and labelled as such. Nothing quotes invented figures.

## Notes

- Old links such as `/#build` redirect to `/build`.
- Reading progress, the chosen platform and the checklist live in `localStorage`. Nothing leaves the browser.
- Vercel Analytics and Speed Insights load only when deployed on Vercel.
- `prefers-reduced-motion` turns off smooth scrolling, parallax, reveals and the hero formation together.
- On devices that ask for less motion (common on lab and remote-desktop machines), a notice offers to turn the
  animations back on. The choice is stored in `localStorage` (`sc-motion`), marks the page with `html.motion-on`
  (the reduced-motion CSS skips it) and is passed into the live previews and example sites. A footer switch,
  shown only on those devices, changes it back. Elsewhere neither appears.
