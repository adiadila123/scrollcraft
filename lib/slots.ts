/** The square-bracket placeholders the prompts use, and the project field each one reads. Shared by server and client. */
export const SLOTS = { '[subject]': 'subject', '[audience]': 'audience', '[one action]': 'action' } as const satisfies Record<string, string>;

export const SLOT_RE = /(\[subject\]|\[audience\]|\[one action\])/;

export const hasSlots = (text: string) => SLOT_RE.test(text);
