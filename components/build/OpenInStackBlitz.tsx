import { dicts } from '@/lib/dict';
import type { Locale } from '@/lib/i18n';
import { northlight } from '@/lib/northlight';

/**
 * Opens an example as a live, editable project on StackBlitz: Northlight unless other files are given. Uses their
 * documented POST endpoint, so it is a plain form: no SDK and no JavaScript needed.
 */
export default function OpenInStackBlitz({
  locale = 'en',
  files = northlight,
  title,
  description,
  quiet = false,
}: {
  locale?: Locale;
  files?: Record<string, string>;
  title?: string;
  description?: string;
  /** a secondary button, when it sits beside a primary one */
  quiet?: boolean;
}) {
  const t = dicts[locale].stackblitz;
  return (
    <form className="sb-form" action="https://stackblitz.com/run" method="post" target="_blank">
      <input type="hidden" name="project[title]" value={title ?? t.title} />
      <input type="hidden" name="project[description]" value={description ?? t.description} />
      <input type="hidden" name="project[template]" value="html" />
      {Object.entries(files).map(([name, code]) => (
        <input key={name} type="hidden" name={`project[files][${name}]`} value={code} />
      ))}
      <button className={quiet ? 'btn btn-ghost' : 'btn'} type="submit" data-magnetic="">
        {t.open} <span aria-hidden="true">↗</span>
      </button>
      <span className="mono">{t.note}</span>
    </form>
  );
}
