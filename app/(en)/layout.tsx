import type { ReactNode } from 'react';
import Shell, { siteMetadata } from '@/components/chrome/Shell';

export { viewport } from '@/components/chrome/Shell';
export const metadata = siteMetadata('en');

/** Root layout for the English pages: the shared Shell with <html lang="en">. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return <Shell locale="en">{children}</Shell>;
}
