'use client';
import { project, type Project } from '@/lib/project';

const FIELDS: { key: keyof Project; label: string; hint: string }[] = [
  { key: 'subject', label: 'Subject', hint: 'a night train across Norway' },
  { key: 'audience', label: 'Audience', hint: 'people planning a winter trip' },
  { key: 'action', label: 'The one action', hint: 'booking a seat' },
];

/** Three fields for the reader's project. Every prompt on the site fills them in, and they are remembered. */
export default function ProjectFields() {
  const p = project.use();
  const empty = !p.subject && !p.audience && !p.action;
  return (
    <form className="project" onSubmit={(e) => e.preventDefault()} aria-label="Your project">
      <div className="project-grid">
        {FIELDS.map((f) => (
          <label key={f.key}>
            {f.label}
            <input
              type="text"
              value={p[f.key]}
              placeholder={f.hint}
              autoComplete="off"
              onChange={(e) => project.set({ ...project.get(), [f.key]: e.target.value })}
            />
          </label>
        ))}
      </div>
      <p className="project-note">
        {empty ? 'Fill these in and every prompt in the tutorial uses them.' : 'Every prompt in the tutorial now uses these. They stay in this browser.'}{' '}
        {empty ? null : (
          <button type="button" className="linkish" onClick={() => project.set({ subject: '', audience: '', action: '' })}>
            Clear
          </button>
        )}
      </p>
    </form>
  );
}
