import NotFound from '@/components/pages/NotFound';
import { dicts } from '@/lib/dict';

export const metadata = { title: dicts.en.notFound.meta };

/** The English 404, shown for unknown chapters and paths under this language. */
export default function NotFoundPage() {
  return <NotFound locale="en" />;
}
