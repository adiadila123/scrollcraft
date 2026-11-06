import createMDX from '@next/mdx';

/** Chapter text is MDX in content/<locale>/; see mdx-components.tsx for what it can use. */
/** @type {import('next').NextConfig} */
const config = { reactStrictMode: true, pageExtensions: ['ts', 'tsx', 'md', 'mdx'] };

export default createMDX({})(config);
