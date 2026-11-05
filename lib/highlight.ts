import 'server-only';
import { createHighlighter, type BundledLanguage, type ThemedToken } from 'shiki';

/** Code block labels are written for readers ("app.js", "macOS, Linux"), so map them to a grammar here. */
const LANGS: [RegExp, BundledLanguage][] = [
  [/^(css|style\.css|css only)/i, 'css'],
  [/^(javascript|js|app\.js|code)$/i, 'javascript'],
  [/^(html|index\.html)$/i, 'html'],
  [/^tsx$/i, 'tsx'],
  [/powershell/i, 'powershell'],
  [/^(bash|macos|homebrew|alternatives|sign in)/i, 'bash'],
  [/\.md$|^template$/i, 'markdown'],
];

export function grammarFor(label: string): BundledLanguage | null {
  return LANGS.find(([re]) => re.test(label))?.[1] ?? null;
}

let highlighter: ReturnType<typeof createHighlighter> | null = null;
const getHighlighter = () => (highlighter ??= createHighlighter({ themes: ['vitesse-black'], langs: [...new Set(LANGS.map(([, l]) => l))] }));

/** Tokenises at build time. Returns null for prompts and plain text, which stay unstyled. */
export async function highlight(code: string, label: string): Promise<ThemedToken[][] | null> {
  const lang = grammarFor(label);
  if (!lang) return null;
  const h = await getHighlighter();
  return h.codeToTokensBase(code, { lang, theme: 'vitesse-black' });
}
