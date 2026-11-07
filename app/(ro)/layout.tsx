import type { ReactNode } from 'react';
import Shell, { siteMetadata } from '@/components/chrome/Shell';

export { viewport } from '@/components/chrome/Shell';
export const metadata = siteMetadata('ro');

/** Root layout for the Romanian pages: the shared Shell with <html lang="ro">. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return <Shell locale="ro">{children}</Shell>;
}
