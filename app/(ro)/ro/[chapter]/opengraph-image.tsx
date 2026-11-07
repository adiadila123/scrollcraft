import { chapterRoute } from '@/components/pages/Chapter';
import { OG_SIZE } from '@/lib/og';

export const alt = 'Scrollcraft';
export const size = OG_SIZE;
export const contentType = 'image/png';
export const generateStaticParams = chapterRoute('ro').generateStaticParams;
export default chapterRoute('ro').Image;
