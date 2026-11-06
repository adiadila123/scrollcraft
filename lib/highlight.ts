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

/* Code blocks sit on --surface (#06090c). Theme colours that fall under 4.5:1 there (comments, punctuation) are
   lightened towards the foreground until they pass, so every token stays readable. */
const SURFACE = [6, 9, 12];
const FG = [234, 240, 244];
const lum = (c: number[]) => {
  const [r, g, b] = c.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (c: number[]) => (lum(c) + 0.05) / (lum(SURFACE) + 0.05);
const readable = new Map<string, string>();
function readableColor(hex?: string): string | undefined {
  if (!hex || !/^#[0-9a-f]{6}/i.test(hex)) return hex;
  const key = hex.slice(0, 7).toLowerCase();
  if (!readable.has(key)) {
    let c = [1, 3, 5].map((i) => parseInt(key.slice(i, i + 2), 16));
    for (let t = 0; contrast(c) < 4.6 && t < 20; t++) c = c.map((v, i) => Math.round(v + (FG[i] - v) * 0.1));
    readable.set(key, `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`);
  }
  return readable.get(key);
}

/** Tokenises at build time. Returns null for prompts and plain text, which stay unstyled. */
export async function highlight(code: string, label: string): Promise<ThemedToken[][] | null> {
  const lang = grammarFor(label);
  if (!lang) return null;
  const h = await getHighlighter();
  return h.codeToTokensBase(code, { lang, theme: 'vitesse-black' }).map((line) => line.map((t) => ({ ...t, color: readableColor(t.color) })));
}
