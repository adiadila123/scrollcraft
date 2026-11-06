import type { MDXComponents } from 'mdx/types';
import OpenInStackBlitz from '@/components/build/OpenInStackBlitz';
import PromptFeed from '@/components/build/PromptFeed';
import Scrollytelling from '@/components/build/Scrollytelling';
import Checklist from '@/components/launch/Checklist';
import HorizontalScroll from '@/components/motion/HorizontalScroll';
import { EasingLab, LerpLab, ParallaxLab, StaggerLab } from '@/components/playground/Labs';
import { Callout, Cell, CodeBlock, PlatformPanel, PlatformTabs, Row, Stick } from '@/components/ui';
import ProjectFields from '@/components/ui/ProjectFields';

/** Everything a chapter's MDX can use without importing it. Chapter text lives in content/<locale>/<chapter>.mdx. */
const components: MDXComponents = {
  Callout,
  Cell,
  Checklist,
  CodeBlock,
  EasingLab,
  HorizontalScroll,
  LerpLab,
  OpenInStackBlitz,
  ParallaxLab,
  PlatformPanel,
  PlatformTabs,
  ProjectFields,
  PromptFeed,
  Row,
  Scrollytelling,
  StaggerLab,
  Stick,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
