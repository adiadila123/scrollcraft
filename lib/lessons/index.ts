import type { Locale } from '../i18n';
import { en } from './en.mjs';
import { ro } from './ro.mjs';
import type { Lesson } from './types';

/* the data is plain .mjs so the search index script can read it in Node; this line checks it against Lesson */
const lessons: Record<Locale, Record<string, Lesson>> = { en, ro };

/** The lesson frame for a chapter, or undefined while a chapter has none yet. */
export const lessonFor = (id: string, locale: Locale): Lesson | undefined => lessons[locale][id];
