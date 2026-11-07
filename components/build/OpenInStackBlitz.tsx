import { dicts } from '@/lib/dict';
import type { Locale } from '@/lib/i18n';
import { northlight } from '@/lib/northlight';

/**
 * Opens the Northlight example as a live, editable project on StackBlitz. Uses their documented POST endpoint,
 * so it is a plain form: no SDK and no JavaScript needed.
 */
export default function OpenInStackBlitz({ locale = 'en' }: { locale?: Locale }) {
  const t = dicts[locale].stackblitz;
  return (
    <form className="sb-form" action="https://stackblitz.com/run" method="post" target="_blank">
      <input type="hidden" name="project[title]" value={t.title} />
      <input type="hidden" name="project[description]" value={t.description} />
      <input type="hidden" name="project[template]" value="html" />
      {Object.entries(northlight).map(([name, code]) => (
        <input key={name} type="hidden" name={`project[files][${name}]`} value={code} />
      ))}
      <button className="btn" type="submit" data-magnetic="">
        {t.open} <span aria-hidden="true">↗</span>
      </button>
      <span className="mono">{t.note}</span>
    </form>
  );
}
