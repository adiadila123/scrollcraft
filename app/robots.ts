import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/chapters';

/** Allows every crawler and points it at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: `${SITE_URL}/sitemap.xml` };
}
