declare module '*.mdx' {
  import type { ComponentType } from 'react';
  export const meta: { title: string; lede: string };
  const Content: ComponentType;
  export default Content;
}
