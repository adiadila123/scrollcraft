import type { Metadata } from 'next';
import { alternates } from '@/components/chrome/Shell';
import HomePage from '@/components/pages/Home';
import { withLocale } from '@/lib/i18n';

export const metadata: Metadata = { alternates: { canonical: withLocale('ro', '/'), languages: alternates('/') } };

export default function Home() {
  return <HomePage locale="ro" />;
}
