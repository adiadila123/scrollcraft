import { northlight } from '@/lib/northlight';

/**
 * Opens the Northlight example as a live, editable project on StackBlitz. Uses their documented POST endpoint,
 * so it is a plain form: no SDK and no JavaScript needed.
 */
export default function OpenInStackBlitz() {
  return (
    <form className="sb-form" action="https://stackblitz.com/run" method="post" target="_blank">
      <input type="hidden" name="project[title]" value="Northlight: a cinematic scroll example" />
      <input type="hidden" name="project[description]" value="The complete example from the Scrollcraft tutorial, chapter 04." />
      <input type="hidden" name="project[template]" value="html" />
      {Object.entries(northlight).map(([name, code]) => (
        <input key={name} type="hidden" name={`project[files][${name}]`} value={code} />
      ))}
      <button className="btn" type="submit" data-magnetic="">
        Open in StackBlitz <span aria-hidden="true">↗</span>
      </button>
      <span className="mono">Runs in a new tab. Edit and see it update.</span>
    </form>
  );
}
