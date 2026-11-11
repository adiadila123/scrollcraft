import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import CommandPalette from '@/components/chrome/CommandPalette';
import Footer from '@/components/chrome/Footer';
import MobileNav from '@/components/chrome/MobileNav';
import MotionNotice from '@/components/chrome/MotionNotice';
import Topbar from '@/components/chrome/Topbar';
import RouteEffects from '@/components/engine/RouteEffects';
import { SmoothScroll } from '@/components/engine/SmoothScroll';
import { SITE_NAME, SITE_URL } from '@/lib/chapters';
import { dicts } from '@/lib/dict';
import { OG_LOCALE, withLocale, type Locale } from '@/lib/i18n';
import '@/app/globals.css';

/** Site-wide metadata for one language; each page adds its own title, canonical and language alternates. */
export function siteMetadata(locale: Locale): Metadata {
  const t = dicts[locale].site;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${SITE_NAME}: ${t.title.charAt(0).toLowerCase()}${t.title.slice(1)}`, template: `%s · ${SITE_NAME}` },
    description: t.description,
    applicationName: SITE_NAME,
    alternates: { canonical: withLocale(locale, '/'), languages: alternates('/') },
    openGraph: { type: 'website', siteName: SITE_NAME, url: withLocale(locale, '/'), locale: OG_LOCALE[locale] },
    twitter: { card: 'summary_large_image' },
  };
}

/** hreflang links for a path in every language, with English as the default. */
export const alternates = (path: string) => ({ en: path, ro: withLocale('ro', path), 'x-default': path });

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#000000', colorScheme: 'dark' };

/*
 * Runs before first paint: turns on the reveal styles (content stays visible without JavaScript),
 * skips the intro loader for the rest of the session once it has played, and marks pages where the reader turned
 * animations on although their device asks for less motion (the reduced-motion CSS skips html.motion-on).
 */
const BOOT = `document.documentElement.classList.add('js');try{if(sessionStorage.getItem('sc-loaded'))document.documentElement.classList.add('ld-skip');if(localStorage.getItem('sc-motion')==='on')document.documentElement.classList.add('motion-on')}catch(e){}`;

/** The document for one language: fonts, chrome, smooth scrolling. Each language group's root layout renders it. */
export default function Shell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-head-element -- the root layout's document, rendered from a shared component */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body>
        <SmoothScroll>
          <a className="skip" href="#content">
            {dicts[locale].site.skip}
          </a>
          <Topbar />
          <MobileNav />
          <RouteEffects />
          <main id="content" tabIndex={-1}>
            {children}
          </main>
          <Footer locale={locale} />
          <CommandPalette />
          <MotionNotice />
        </SmoothScroll>
        {/* the analytics endpoints only exist on Vercel, so other hosts skip the scripts instead of logging 404s */}
        {process.env.VERCEL ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
