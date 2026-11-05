# Scrollcraft (Next.js)

The Scrollcraft tutorial site rebuilt with Next.js 14 (App Router, TypeScript) and reusable components.
It renders the same DOM and CSS as the published single-file version.

## Run it

    npm install
    npm run dev        # http://localhost:3000
    npm run build && npm start

Requires Node 18.18 or later.

## Structure

    app/
      layout.tsx        html shell, Geist fonts, metadata
      page.tsx          assembles the site
      globals.css       all styles (unchanged from the single-file site)
    components/
      ui/index.tsx      CodeBlock, Row, Cell, Callout, Stick, NextBar, PageHead, PageBody, Page, ParticleArt
      chrome/           Loader, Topbar, Tabbar, MoreSheet, Footer (read lib/chapters.ts)
      pages/            one component per chapter: Home, Start, Skills, Prompting, Build, Motion, Playground, Advanced, Launch
      Engine.tsx        starts the scroll engine after hydration
    lib/
      chapters.ts       the chapter list, used by the top bar, tab bar, sheet and footer
      legacy/           hero (three.js), site (router, Lenis, scroll effects, particle art), lab (playground, More sheet)
    public/face.jpg     source image for the particle head

## Adding a chapter

1. Add an entry to `lib/chapters.ts`.
2. Create `components/pages/YourChapter.tsx` from the ui components and add it to `app/page.tsx`.
3. Add its id to the `PAGES` list in `lib/legacy/site.js`.

## Notes

- Routing is hash based (`/#build`), as in the original, because the scroll engine shows and hides pages in place.
  Moving to one URL per chapter is possible but means rewriting the router part of `lib/legacy/site.js`.
- three.js 0.128.0 and Lenis 1.1.18 come from npm and are pinned. The engine modules are plain DOM code,
  marked `@ts-nocheck`, and are initialised once from `components/Engine.tsx`.
- Fonts load from Google Fonts at runtime.
