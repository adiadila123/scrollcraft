import { CodeBlock, Row, Stick } from '@/components/ui';
import { PlatformPanel, PlatformTabs, type Platform } from '@/components/ui/PlatformTabs';
import Slots from '@/components/ui/Slots';
import { dicts } from '@/lib/dict';
import type { Locale } from '@/lib/i18n';
import type { Lesson } from '@/lib/lessons/types';
import { hasSlots } from '@/lib/slots';
import Criteria from './Criteria';

/** The rules file and skills folder each tool reads; prompts name them through {rules} and {skills}. */
const TOOLS: Record<Platform, { rules: string; skills: string }> = {
  claude: { rules: 'CLAUDE.md', skills: '.claude/skills/' },
  gemini: { rules: 'GEMINI.md', skills: '.gemini/skills/' },
  chatgpt: { rules: 'AGENTS.md', skills: '.agents/skills/' },
};
const fill = (text: string, p: Platform) => text.replaceAll('{rules}', TOOLS[p].rules).replaceAll('{skills}', TOOLS[p].skills);

/** Lesson text: `backticks` become inline code, and project [slots] fill in as the reader types them. */
function Text({ children }: { children: string }) {
  return children.split(/`([^`]+)`/).map((part, i) =>
    i % 2 ? (
      <code key={i} className="i">
        {part}
      </code>
    ) : hasSlots(part) ? (
      <Slots key={i} text={part} />
    ) : (
      part
    ),
  );
}

/** Part 1 of a lesson, under the chapter title: what you will be able to do at the end. */
export function Objectives({ lesson, locale }: { lesson: Lesson; locale: Locale }) {
  const t = dicts[locale].lesson;
  return (
    <section className="sec">
      <Stick left={t.objectives} right={t.objectivesNote} />
      <ol className="goals rv">
        {lesson.objectives.map((o, i) => (
          <li key={i}>
            <span className="mono">{String(i + 1).padStart(2, '0')}</span>
            <span>
              <Text>{o}</Text>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Parts 5 to 9, after the chapter: work with your AI, exercises, the course project, testing and assessment. */
export function Practice({ id, lesson, locale }: { id: string; lesson: Lesson; locale: Locale }) {
  const t = dicts[locale].lesson;
  const label = (part: string) => `${t.practice} · ${part}`;
  return (
    <>
      {lesson.ai ? (
        <section className="sec">
          <Stick left={label(t.ai)} right={t.aiNote} />
          <p className="lede rv" style={{ marginTop: 0 }}>
            <Text>{lesson.ai.intro}</Text>
          </p>
          <div className="ai-tools rv">
            <PlatformTabs />
            {(Object.keys(TOOLS) as Platform[]).map((p) => (
              <PlatformPanel key={p} p={p}>
                <p className="ai-how">
                  <Text>{fill(t.how[p], p)}</Text>
                </p>
                {lesson.ai!.prompts.map((pr) => (
                  <div key={pr.label} className="ai-prompt">
                    <h3 className="ai-label mono">{pr.label}</h3>
                    <CodeBlock lang="Prompt" code={fill(pr.text, p)} />
                  </div>
                ))}
              </PlatformPanel>
            ))}
          </div>
        </section>
      ) : null}

      {lesson.exercises ? (
        <section className="sec">
          <Stick left={label(t.exercises)} right={t.exercisesNote} />
          <div className="rows">
            {lesson.exercises.map((ex, i) => (
              <Row key={ex.title} cls="rv" num={String(i + 1)} anchor={`exercise-${i + 1}`} title={ex.title}>
                <p>
                  <Text>{ex.task}</Text>
                </p>
                <p className="tip">
                  {t.hint}: <Text>{ex.hint}</Text>
                </p>
                <details className="solution">
                  <summary>{t.solution}</summary>
                  <p>
                    <Text>{ex.solution}</Text>
                  </p>
                  {ex.code ? <CodeBlock lang={ex.code.lang} code={ex.code.code} /> : null}
                </details>
              </Row>
            ))}
          </div>
        </section>
      ) : null}

      {lesson.project ? (
        <section className="sec">
          <Stick left={label(t.project)} right={t.projectNote} />
          <p className="lede rv" style={{ marginTop: 0 }}>
            <Text>{lesson.project.intro}</Text>
          </p>
          <ol className="lesson-steps rv">
            {lesson.project.steps.map((s, i) => (
              <li key={i}>
                <Text>{s}</Text>
              </li>
            ))}
          </ol>
          {lesson.project.code ? (
            <div className="rv">
              <CodeBlock lang={lesson.project.code.lang} code={lesson.project.code.code} />
            </div>
          ) : null}
        </section>
      ) : null}

      {lesson.testing ? (
        <section className="sec">
          <Stick left={label(t.testing)} right={t.testingNote} />
          <ul className="lesson-checks rv">
            {lesson.testing.checks.map((c, i) => (
              <li key={i}>
                <Text>{c}</Text>
              </li>
            ))}
          </ul>
          {lesson.testing.code ? (
            <div className="rv">
              <CodeBlock lang={lesson.testing.code.lang} code={lesson.testing.code.code} />
            </div>
          ) : null}
        </section>
      ) : null}

      {lesson.criteria ? (
        <section className="sec">
          <Stick left={label(t.assessment)} right={t.assessmentNote} />
          <Criteria chapter={id} items={lesson.criteria} />
        </section>
      ) : null}
    </>
  );
}
