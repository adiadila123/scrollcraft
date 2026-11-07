import createMDX from '@next/mdx';

/** Chapter text is MDX in content/<locale>/; see mdx-components.tsx for what it can use. */
/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  /* two root layouts, one per language, so addresses that match neither need a global 404 */
  experimental: { globalNotFound: true },
};

export default createMDX({})(config);
