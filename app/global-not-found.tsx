import Shell from '@/components/chrome/Shell';
import NotFound from '@/components/pages/NotFound';
import { dicts } from '@/lib/dict';

export const metadata = { title: `${dicts.en.notFound.meta} · Scrollcraft` };

/** Addresses that match no route in either language. With two root layouts, this is the only shared 404. */
export default function GlobalNotFound() {
  return (
    <Shell locale="en">
      <NotFound locale="en" />
    </Shell>
  );
}
