/** Chapter MDX files export their opening title and lede as `meta`, beside the body component. */
declare module '*.mdx' {
  import type { ComponentType } from 'react';
  export const meta: { title: string; lede: string };
  const Content: ComponentType;
  export default Content;
}
