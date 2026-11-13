import createMDX from '@next/mdx';

/** Chapter text is MDX in content/<locale>/; see mdx-components.tsx for what it can use. */
/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  /* two root layouts, one per language, so addresses that match neither need a global 404 */
  experimental: { globalNotFound: true },
  /* the WebGL previews load three.js as an ES module from a sandboxed frame (a null origin), which needs CORS */
  /* the old Advanced chapter was split across Level 3; its address leads to Architecture, where it began */
  async redirects() {
    return [
      { source: '/advanced', destination: '/architecture', permanent: true },
      { source: '/ro/advanced', destination: '/ro/architecture', permanent: true },
    ];
  },
  async headers() {
    /* the preview frames are sandboxed, so their origin is null: module scripts and libraries they load need CORS */
    return [
      { source: '/vendor/:path*', headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }] },
      { source: '/live/:path*', headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }] },
    ];
  },
};

export default createMDX({})(config);
