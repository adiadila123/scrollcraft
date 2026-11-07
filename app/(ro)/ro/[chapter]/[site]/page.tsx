import { exampleRoute } from '@/components/pages/ExampleViewer';

const route = exampleRoute('ro');

/** The example sites, each on its own screen. Any other path under a chapter renders this language's 404 page. */
export const dynamicParams = true;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.ExampleViewer;
