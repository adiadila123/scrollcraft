import createMDX from '@next/mdx';

/** Chapter text is MDX in content/<locale>/; see mdx-components.tsx for what it can use. */
/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  /* two root layouts, one per language, so addresses that match neither need a global 404 */
  experimental: { globalNotFound: true },
  /* the WebGL previews load three.js as an ES module from a sandboxed frame (a null origin), which needs CORS */
  async headers() {
    return [{ source: '/vendor/:path*', headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }] }];
  },
};

export default createMDX({})(config);
