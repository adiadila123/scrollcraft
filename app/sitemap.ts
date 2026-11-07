import type { MetadataRoute } from 'next';
import { chapters, SITE_URL } from '@/lib/chapters';
import { withLocale } from '@/lib/i18n';

/** Every page in both languages, each listing its counterpart. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', ...chapters.map((c) => `/${c.id}`)];
  return paths.flatMap((p) => {
    const languages = { en: `${SITE_URL}${p}`, ro: `${SITE_URL}${withLocale('ro', p)}` };
    const base = { changeFrequency: 'monthly' as const, priority: p === '/' ? 1 : 0.8, alternates: { languages } };
    return [
      { url: languages.en, ...base },
      { url: languages.ro, ...base },
    ];
  });
}
