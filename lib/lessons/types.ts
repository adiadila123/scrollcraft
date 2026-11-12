/**
 * The teaching frame around a chapter, beside its MDX: what you will learn (shown under the title), then after the
 * chapter a session with your AI, exercises, the course project step, how to test it, and acceptance criteria.
 *
 * Text may use `backticks` for inline code and the project [slots]. AI prompts may also use {rules} and {skills},
 * which become the rules file and skills folder of the tool the reader picked (CLAUDE.md, GEMINI.md or AGENTS.md).
 */
export type Code = { lang: string; code: string };

export type Lesson = {
  objectives: string[];
  /** optional parts, so the appendix can have objectives only */
  ai?: { intro: string; prompts: { label: string; text: string }[] };
  exercises?: { title: string; task: string; hint: string; solution: string; code?: Code }[];
  project?: { intro: string; steps: string[]; code?: Code };
  testing?: { checks: string[]; code?: Code };
  criteria?: string[];
};
