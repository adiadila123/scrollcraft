import type { MetadataRoute } from 'next';
import { chapters, SITE_URL } from '@/lib/chapters';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
    ...chapters.map((c) => ({ url: `${SITE_URL}/${c.id}`, changeFrequency: 'monthly' as const, priority: 0.8 })),
  ];
}
