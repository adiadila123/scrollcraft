# Scrollcraft

A free, bilingual (English and Romanian) tutorial on building minimalist, cinematic scroll websites with Claude,
Gemini or ChatGPT. Every technique runs live beside its code, and three complete example sites are taken apart
line by line.

Built with Next.js 16 (App Router), React 19, TypeScript, MDX, three.js and Lenis.

## What is inside

Nine chapters, each at `/<chapter>` in English and `/ro/<chapter>` in Romanian:

| #   | Chapter    | What it covers                                                                           |
| --- | ---------- | ---------------------------------------------------------------------------------------- |
| 01  | Start      | Choosing an AI tool, installing it, setting up a project folder                          |
| 02  | Skills     | What skills are, where to find them, how to install and write them                       |
| 03  | Prompting  | A five-part brief, a project rules file, steering patterns                               |
| 04  | Build      | Ten steps with the exact prompt for each, and a complete example on StackBlitz           |
| 05  | Motion     | Nine scroll techniques and five real-world recipes, each running live beside its code    |
| 06  | Playground | Live experiments with smoothing, parallax speed, stagger and easing                      |
| 07  | Advanced   | GSAP with Lenis, CSS scroll timelines, a Next.js version, performance, fixes             |
| 08  | Examples   | Three complete sites (product launch, studio portfolio, long-read), viewable full screen |
| 09  | Launch     | Testing on three widths and publishing                                                   |

Interface features: a search palette (⌘K or Ctrl K), `[` and `]` to step through chapters, Back and Next at the end
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
      demos.ts              the small runnable pages behind every <Demo> in Motion
      examples.ts           the example sites, in order, for the full-screen viewer
      ticker.ts             the single requestAnimationFrame loop; pauses while the tab is hidden
      hero/                 the three.js particle head and its shaders (loaded on the home page only)
      particles/            the 2D particle shapes and the manager that draws them
      store.ts progress.ts  localStorage-backed state (platform, checklist, reading progress)
      search-index.json     generated by scripts/build-search-index.mjs before dev and build
    public/examples/        the three complete sites in the Examples chapter (index.html, style.css, app.js each);
                            /examples/<site> shows each one full screen with Back and previous/next (lib/examples.ts)
    scripts/                search index generator, link checker (source and chapter MDX)
    tests/                  Playwright

## Adding a chapter

1. Add an entry to `lib/chapters.ts`.
2. Write `content/en/your-chapter.mdx`: `export const meta = { title, lede }`, then the sections, using the components in `mdx-components.tsx`. Keep text that wraps inside a component on one line, or MDX wraps it in an extra paragraph. Prettier skips these files for the same reason.
3. Write the Romanian version as `content/ro/your-chapter.mdx`, add its titles to `lib/chapters.ts`, and import both in `lib/content.ts`.

Interface text (navigation, buttons, labels) lives in `lib/dict.ts`; the Romanian object must have every key the English one has, so TypeScript catches a missing translation.

The route, navigation, sitemap, social card, reading time and search entries follow automatically.

For a live preview, add the demo to `lib/demos.ts` and write `<Demo id="…" name="…" />`. For a complete site, put its three files in `public/examples/<id>/` and write `<Example id="<id>" name="…" />`: the frame, the code tabs and the StackBlitz button all read those files.

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
