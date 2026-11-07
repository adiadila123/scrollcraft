'use client';
import { usePathname } from 'next/navigation';
import { dicts } from './dict';
import { localeOf } from './i18n';

/** The page's language, from its path, and the interface strings for it. */
export function useLocale() {
  const locale = localeOf(usePathname());
  return { locale, t: dicts[locale] };
}
