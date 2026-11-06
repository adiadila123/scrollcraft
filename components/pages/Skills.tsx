import type { CSSProperties } from 'react';
import { Callout, Cell, CodeBlock, NextBand, Page, PageBody, PageHead, Row, Stick, PlatformPanel, PlatformTabs } from '@/components/ui';

export default function SkillsPage() {
  return (
    <Page route="skills">
      <PageBody>
        <PageHead
          chapter="skills"
          title="Skills: what they are, where to find them, how to install them."
          lede="A skill is a folder of instructions that your AI loads only when a task matches. It is the difference between asking for a nice website and getting your rules followed every time."
        />
        <section className="sec">
          <Stick left="01 · What a skill is" />
          <div className="rows">
            <Row cls="rv" num="a" title="A folder with one required file">
              <p>
                A skill is a folder named after the skill. The only required file is <code className="i">SKILL.md</code>. Optional folders hold references,
                templates and scripts.
              </p>
              <CodeBlock
                lang="text"
                code={
                  'cinematic-scroll/\n├── SKILL.md          required: name, description, instructions\n├── references/       optional: longer notes, read only when needed\n├── assets/           optional: templates and files to copy\n└── scripts/          optional: code the AI can run'
                }
              />
            </Row>
            <Row cls="rv" num="b" title="The description decides when it loads">
              <p>
                The AI reads each skill’s name and description first, and loads the full instructions only when your request matches. A vague description means
                the skill never fires. Say what it does and when to use it, with the words you would actually type.
              </p>
            </Row>
            <Row cls="rv" num="c" title="It is an open format">
              <p>
                Skills follow the{' '}
                <a className="ext" href="https://agentskills.io/specification" target="_blank" rel="noopener">
                  Agent Skills specification
                </a>
                . The name uses lowercase letters, numbers and hyphens (up to 64 characters) and must match the folder name. The description can run to 1,024
                characters. Claude, Gemini CLI and Codex all read this layout.
              </p>
            </Row>
          </div>
        </section>
        <section className="sec">
          <Stick left="02 · Where to find skills" right="Read before you install" />
          <div className="cells rv">
            <Cell title="Anthropic’s repository">
              <p>
                Working examples you can read and copy, including brand-guidelines, internal-comms, pdf and skill-creator.{' '}
                <a className="ext" href="https://github.com/anthropics/skills" target="_blank" rel="noopener">
                  github.com/anthropics/skills
                </a>
              </p>
            </Cell>
            <Cell title="The Claude plugin marketplace">
              <p>Inside Claude Code, add the official marketplace and install from it. Commands are in the install section below.</p>
            </Cell>
            <Cell title="skills.sh">
              <p>
                A directory by Vercel with a leaderboard, topics, supported agents and an audits section. It also provides the npx skills installer.{' '}
                <a className="ext" href="https://www.skills.sh" target="_blank" rel="noopener">
                  skills.sh
                </a>
              </p>
            </Cell>
            <Cell title="Library authors">
              <p>
                GSAP publishes its own skills for animation plugins.{' '}
                <a className="ext" href="https://github.com/greensock/gsap-skills" target="_blank" rel="noopener">
                  github.com/greensock/gsap-skills
                </a>
              </p>
            </Cell>
            <Cell title="Your own">
              <p>The most reliable skill is the one that holds your rules. The last section of this chapter gives you a full one to copy.</p>
            </Cell>
          </div>
          <div style={{ marginTop: '28px' } as CSSProperties} className="rv">
            <Callout>
              A skill can include scripts that your AI runs on your machine. Open the SKILL.md and any file in <code className="i">scripts/</code> before you
              install a skill from someone you do not know. Prefer official repositories and authors with a track record, and treat a high install count as
              popularity, not as proof of safety.
            </Callout>
          </div>
        </section>
        <section className="sec">
          <Stick left="03 · Install a skill" right="Per platform" />
          <div className="rv" style={{ marginBottom: '8px' } as CSSProperties}>
            <PlatformTabs />
          </div>
          <PlatformPanel p="claude">
            <div className="rows" style={{ marginTop: '20px' } as CSSProperties}>
              <Row cls="rv" num="A" title="Claude Code: copy a folder">
                <p>
                  Put the skill folder in your personal skills folder to use it in every project, or in the project to share it with a team. Claude Code watches
                  these folders, so no restart is needed.
                </p>
                <CodeBlock
                  lang="bash"
                  code={
                    '# personal\ncp -r cinematic-scroll ~/.claude/skills/\n# project only\nmkdir -p .claude/skills && cp -r cinematic-scroll .claude/skills/'
                  }
                />
                <p>
                  Run it with <code className="i">/cinematic-scroll</code>, or describe a task that matches its description.
                </p>
              </Row>
              <Row cls="rv" num="B" title="Claude Code: from the marketplace">
                <p>Plugins carry skills. Add a marketplace once, install what you want, then reload.</p>
                <CodeBlock
                  lang="inside Claude Code"
                  code={'/plugin marketplace add anthropics/claude-plugins-official\n/plugin install skill-creator@claude-plugins-official\n/reload-plugins'}
                />
              </Row>
              <Row cls="rv" num="C" title="claude.ai: upload a zip">
                <p>
                  Turn on code execution and file creation, open the Skills section of your settings (the current docs call it Customize, then Skills), choose
                  Upload skill and pick a zip. The zip must contain the skill folder itself at the top level, and the folder name must match the skill name.
                  Available on Pro, Max, Team and Enterprise plans.
                </p>
                <CodeBlock
                  lang="bash"
                  code={'zip -r cinematic-scroll.zip cinematic-scroll/\nunzip -l cinematic-scroll.zip   # every line should start with cinematic-scroll/'}
                />
              </Row>
            </div>
            <p className="muted">
              Sources:{' '}
              <a className="ext" href="https://code.claude.com/docs/en/skills" target="_blank" rel="noopener">
                Claude Code skills
              </a>
              ,{' '}
              <a className="ext" href="https://support.claude.com/en/articles/12512180-using-skills-in-claude" target="_blank" rel="noopener">
                Using skills in Claude
              </a>
              ,{' '}
              <a className="ext" href="https://claude.com/docs/skills/how-to" target="_blank" rel="noopener">
                Create custom skills
              </a>
            </p>
          </PlatformPanel>
          <PlatformPanel p="gemini">
            <div className="rows" style={{ marginTop: '20px' } as CSSProperties}>
              <Row cls="rv" num="A" title="Copy a folder">
                <p>
                  Gemini CLI reads skills from your personal folder or from the project. The alias <code className="i">.agents/skills/</code> works too and wins
                  over <code className="i">.gemini/skills/</code> inside the same scope.
                </p>
                <CodeBlock
                  lang="bash"
                  code={
                    '# personal\ncp -r cinematic-scroll ~/.gemini/skills/\n# project only\nmkdir -p .gemini/skills && cp -r cinematic-scroll .gemini/skills/'
                  }
                />
              </Row>
              <Row cls="rv" num="B" title="Install from Git">
                <p>Install a skill straight from a repository, then check that Gemini sees it.</p>
                <CodeBlock lang="bash" code={'gemini skills install <git-url> --consent'} />
                <CodeBlock lang="inside Gemini CLI" code={'/skills list\n/skills reload\n/skills disable <name>'} />
                <p>The first time a matching task runs, Gemini asks you to confirm before it loads the skill.</p>
              </Row>
            </div>
            <p className="muted">
              Source: a third-party guide,{' '}
              <a className="ext" href="https://dev.to/skillgild/how-to-add-skills-to-gemini-cli-12o0" target="_blank" rel="noopener">
                How to add skills to Gemini CLI
              </a>
              . Commands can change, so run <code className="i">/skills list</code> to confirm.
            </p>
          </PlatformPanel>
          <PlatformPanel p="chatgpt">
            <div className="rows" style={{ marginTop: '20px' } as CSSProperties}>
              <Row cls="rv" num="A" title="Codex CLI: copy a folder">
                <p>Codex scans the project, the repository root and your home folder. Start a new session after installing.</p>
                <CodeBlock
                  lang="bash"
                  code={
                    '# personal\nmkdir -p ~/.agents/skills && cp -r cinematic-scroll ~/.agents/skills/\n# project only\nmkdir -p .agents/skills && cp -r cinematic-scroll .agents/skills/'
                  }
                />
                <p>
                  Run it with <code className="i">$cinematic-scroll</code> or describe the task. Codex also ships <code className="i">$skill-creator</code> and{' '}
                  <code className="i">$skill-installer</code>.
                </p>
              </Row>
              <Row cls="rv" num="B" title="ChatGPT website: ask it to build one">
                <p>
                  Start a chat with “Build me a skill that…” and describe the task, inputs, steps, output format and quality checks. ChatGPT drafts the skill in
                  a panel, you refine it and click Install. Use it later by letting ChatGPT pick it or by @-mentioning it. In the beta, workspace owners switch
                  skills on in workspace settings.
                </p>
              </Row>
            </div>
            <p className="muted">
              Sources:{' '}
              <a className="ext" href="https://learn.chatgpt.com/docs/build-skills" target="_blank" rel="noopener">
                OpenAI, Build skills
              </a>
              ,{' '}
              <a className="ext" href="https://academy.openai.com/public/resources/skills" target="_blank" rel="noopener">
                OpenAI Academy, Skills
              </a>
              .
            </p>
          </PlatformPanel>
          <div className="rows" style={{ marginTop: '36px' } as CSSProperties}>
            <Row cls="rv" num="Any" title="One installer for many agents">
              <p>
                The npx skills tool downloads a skill and links it into the right folder for the agent you choose. It names Claude Code, Gemini CLI, Codex,
                GitHub Copilot and Cursor among 27 or more supported agents.
              </p>
              <CodeBlock
                lang="bash"
                code={
                  '# every skill in a repository\nnpx skills add vercel-labs/agent-skills\n# one skill\nnpx skills add vercel-labs/agent-skills --skill frontend-design\n# for one agent\nnpx skills add vercel-labs/agent-skills -a codex\nnpx skills list'
                }
              />
              <p>Source: a third-party write-up of the Vercel skills CLI. Check the project’s own docs for the current flags.</p>
            </Row>
          </div>
        </section>
        <section className="sec">
          <Stick left="04 · The skills for a cinematic site" right="What to look for" />
          <div className="tablewrap rv" tabIndex={0} role="region" aria-label="Table. Scroll sideways to see every column.">
            <table>
              <thead>
                <tr>
                  <th>Job</th>
                  <th>What to search for</th>
                  <th>Why it helps</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Design direction</td>
                  <td>frontend design, UI design</td>
                  <td>Pushes typography, colour and layout away from template defaults.</td>
                </tr>
                <tr>
                  <td>Scroll recipe</td>
                  <td>cinematic scroll, scrollytelling, parallax</td>
                  <td>Encodes smooth scroll, reveals and parallax rules, and what to avoid.</td>
                </tr>
                <tr>
                  <td>Animation library</td>
                  <td>GSAP, ScrollTrigger</td>
                  <td>Correct plugin usage. GSAP and its plugins are free to use since 2025, see the licence page.</td>
                </tr>
                <tr>
                  <td>3D or particles</td>
                  <td>three.js, shaders, WebGL</td>
                  <td>Scene setup, points, shaders, interaction and performance.</td>
                </tr>
                <tr>
                  <td>Quality</td>
                  <td>accessibility review, skill creator</td>
                  <td>Checks contrast and keyboard use, and tests that your own skill actually triggers.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="muted rv" style={{ marginTop: '20px', maxWidth: '62ch' } as CSSProperties}>
            This very site was built with three skills from the author’s own setup: an artifact-design skill for layout and theming rules, a motion-design skill
            for easing and spring principles, and a cinematic-scroll-website skill for the Lenis, reveal and parallax rules. Those names may not exist in your
            catalogue. Search skills.sh with the keywords in the table instead.
          </p>
        </section>
        <section className="sec">
          <Stick left="05 · Write your own" right="Copy this file" />
          <p className="lede rv" style={{ marginTop: '0' } as CSSProperties}>
            If you cannot find a skill you trust, write one. This is a complete cinematic-scroll skill. Save it as{' '}
            <code className="i">cinematic-scroll/SKILL.md</code>, then install the folder with any method above.
          </p>
          <div className="rv">
            <CodeBlock
              lang="SKILL.md"
              code={
                '---\nname: cinematic-scroll\ndescription: Build or review a modern minimalist website with cinematic scrolling: smooth inertial scroll, parallax hero, scroll reveals and one pinned moment. Use when the user asks for a cinematic, scrollytelling, parallax or smooth-scroll site.\n---\n\n# Cinematic scroll\n\n## Rules\n1. Use Lenis for smooth scrolling and drive it from requestAnimationFrame.\n2. The hero has two or three background layers with data-speed between 0.15 and 0.5.\n3. Every section after the hero sits in normal document flow.\n4. Reveal content once, with opacity and a small translateY, when it enters the viewport.\n5. At most one pinned section per page: horizontal scroll or scrollytelling.\n6. Never use scroll-snap-type: y mandatory or fullscreen slides.\n7. Honour prefers-reduced-motion: no smooth scroll, no parallax, no reveal movement.\n8. Never invent statistics, testimonials or customer logos.\n\n## Process\n1. Ask for the subject, the audience and the one action the visitor should take.\n2. Propose the section list and wait for approval before writing code.\n3. Build with plain HTML, CSS and JavaScript in three files unless told otherwise.\n4. Serve over HTTP, then check 375, 768 and 1440 px widths.\n5. Report what was tested and what was not.'
              }
            />
          </div>
          <div className="rows" style={{ marginTop: '28px' } as CSSProperties}>
            <Row cls="rv" num="Test" title="Check that it loads">
              <p>
                Ask your AI “Which skills do you have?” or use <code className="i">/skills list</code> in Gemini CLI. Then send a request that should trigger
                it, such as “Build a smooth-scroll site with a parallax hero”. If it does not fire, rewrite the description with the words you used.
              </p>
            </Row>
          </div>
        </section>
        <NextBand from="skills" />
      </PageBody>
    </Page>
  );
}
