import { chapterRoute } from '@/components/pages/Chapter';

const route = chapterRoute('ro');

/** Every chapter is prerendered at build time. Any other slug renders this language's 404 page. */
export const dynamicParams = true;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.ChapterRoute;
