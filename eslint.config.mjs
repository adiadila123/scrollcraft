import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

/** Next.js recommended rules (Core Web Vitals and TypeScript), minus generated folders. */
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'node_modules/**', 'next-env.d.ts', 'playwright-report/**', 'test-results/**']),
]);
