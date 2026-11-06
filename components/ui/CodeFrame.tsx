import type { ReactNode } from 'react';
import CopyButton from './CopyButton';
import { hasSlots } from '@/lib/slots';
import Slots from './Slots';

/** The frame around a code block. Plain text, so client components can render and update it live. */
export default function CodeFrame({ lang, code, codeId, children }: { lang: string; code?: string; codeId?: string; children?: ReactNode }) {
  return (
    <div className="code">
      <div className="code-bar">
        <span className="mono">{lang}</span>
        <CopyButton />
      </div>
      <pre tabIndex={0}>
        <code id={codeId}>{children ?? (code && hasSlots(code) ? <Slots text={code} /> : code)}</code>
      </pre>
    </div>
  );
}
