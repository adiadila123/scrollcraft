import NotFound from '@/components/pages/NotFound';
import { dicts } from '@/lib/dict';

export const metadata = { title: dicts.ro.notFound.meta };

/** The Romanian 404, shown for unknown chapters and paths under this language. */
export default function NotFoundPage() {
  return <NotFound locale="ro" />;
}
