/** The square-bracket placeholders the prompts use, in every language, and the project field each one reads. Shared by server and client. */
export const SLOTS = {
  '[subject]': 'subject',
  '[audience]': 'audience',
  '[one action]': 'action',
  '[subiect]': 'subject',
  '[public]': 'audience',
  '[o acțiune]': 'action',
} as const satisfies Record<string, string>;

export const SLOT_RE = /(\[subject\]|\[audience\]|\[one action\]|\[subiect\]|\[public\]|\[o acțiune\])/;

export const hasSlots = (text: string) => SLOT_RE.test(text);
