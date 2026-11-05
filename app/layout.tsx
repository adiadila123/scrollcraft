import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import CommandPalette from '@/components/chrome/CommandPalette';
import Footer from '@/components/chrome/Footer';
import MobileNav from '@/components/chrome/MobileNav';
import Topbar from '@/components/chrome/Topbar';
import RouteEffects from '@/components/engine/RouteEffects';
import { SmoothScroll } from '@/components/engine/SmoothScroll';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/chapters';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: build a cinematic website with AI`, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: SITE_NAME, url: '/', locale: 'en_GB' },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#000000', colorScheme: 'dark' };

/*
 * Runs before first paint: turns on the reveal styles (content stays visible without JavaScript)
 * and skips the intro loader for the rest of the session once it has played.
 */
const BOOT = `document.documentElement.classList.add('js');try{if(sessionStorage.getItem('sc-loaded'))document.documentElement.classList.add('ld-skip')}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body>
        <SmoothScroll>
          <a className="skip" href="#content">
            Skip to content
          </a>
          <Topbar />
          <MobileNav />
          <RouteEffects />
          <main id="content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <CommandPalette />
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
