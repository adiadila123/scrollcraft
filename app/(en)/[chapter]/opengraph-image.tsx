/* Social card for each English chapter, rendered at build time from its title and summary. */
import { chapterRoute } from '@/components/pages/Chapter';
import { OG_SIZE } from '@/lib/og';

export const alt = 'Scrollcraft';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const generateStaticParams = chapterRoute('en').generateStaticParams;
export default chapterRoute('en').Image;
