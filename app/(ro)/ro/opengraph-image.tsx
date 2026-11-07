import { dicts } from '@/lib/dict';
import { ogImage, OG_SIZE } from '@/lib/og';

const t = dicts.ro.og;

export const alt = `Scrollcraft: ${t.title}`;
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogImage({ tag: t.tag, kicker: t.kicker, title: t.title, sub: t.sub });
}
