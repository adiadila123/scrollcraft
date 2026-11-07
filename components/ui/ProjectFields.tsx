'use client';
import { project, type Project } from '@/lib/project';
import { useLocale } from '@/lib/useLocale';

const FIELDS: (keyof Project)[] = ['subject', 'audience', 'action'];

/** Three fields for the reader's project. Every prompt on the site fills them in, and they are remembered. */
export default function ProjectFields() {
  const p = project.use();
  const t = useLocale().t.project;
  const empty = !p.subject && !p.audience && !p.action;
  return (
    <form className="project" onSubmit={(e) => e.preventDefault()} aria-label={t.label}>
      <div className="project-grid">
        {FIELDS.map((f) => (
          <label key={f}>
            {t[f]}
            <input
              type="text"
              value={p[f]}
              placeholder={t.hints[f]}
              autoComplete="off"
              onChange={(e) => project.set({ ...project.get(), [f]: e.target.value })}
            />
          </label>
        ))}
      </div>
      <p className="project-note">
        {empty ? t.empty : t.filled}{' '}
        {empty ? null : (
          <button type="button" className="linkish" onClick={() => project.set({ subject: '', audience: '', action: '' })}>
            {t.clear}
          </button>
        )}
      </p>
    </form>
  );
}
