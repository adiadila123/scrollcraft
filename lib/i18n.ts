/** The site's languages. English lives at the root, Romanian under /ro. */
export type Locale = 'en' | 'ro';

export const OG_LOCALE: Record<Locale, string> = { en: 'en_GB', ro: 'ro_RO' };

export const localeOf = (pathname: string): Locale => (pathname === '/ro' || pathname.startsWith('/ro/') ? 'ro' : 'en');

/** The path without its language prefix: /ro/build becomes /build. */
export const stripLocale = (pathname: string) => (localeOf(pathname) === 'ro' ? pathname.slice(3) || '/' : pathname);

/** A site path in the given language: withLocale('ro', '/build') is /ro/build. */
export const withLocale = (locale: Locale, path: string) => (locale === 'en' ? path : path === '/' ? '/ro' : `/ro${path}`);
