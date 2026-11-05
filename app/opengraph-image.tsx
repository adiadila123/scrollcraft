import { ogImage, OG_SIZE } from '@/lib/og';

export const alt = 'Scrollcraft: build a cinematic website with AI';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogImage({
    kicker: 'A free tutorial',
    title: 'Build a cinematic website with AI.',
    sub: 'From an empty folder to a published site, with Claude, Gemini or ChatGPT.',
  });
}
