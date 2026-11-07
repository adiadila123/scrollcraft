import NotFound from '@/components/pages/NotFound';
import { dicts } from '@/lib/dict';

export const metadata = { title: dicts.ro.notFound.meta };

export default function NotFoundPage() {
  return <NotFound locale="ro" />;
}
