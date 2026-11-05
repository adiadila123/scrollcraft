import type { CSSProperties } from 'react';
import { Callout, Cell, CodeBlock, NextBar, Page, PageBody, PageHead, Row, Stick, PlatformPanel, PlatformTabs } from '@/components/ui';

export default function StartPage() {
  return (
    <Page route="start">
      <PageBody>
        <PageHead
          chapter="start"
          art="tree"
          eyebrow="Chapter 01"
          title="Choose your AI and set up your machine."
          lede="Everything in this tutorial works with Claude, Gemini or ChatGPT. The method is the same. Only the install commands and folder names change."
        />
        <section className="sec">
          <Stick left="01 · What you need" right="5 items" />
          <div className="cells rv">
            <Cell title="A terminal">
              <p>
                Terminal on macOS, PowerShell on Windows, or any Linux shell. If you have never opened one, a two-minute search for your operating system is
                enough.
              </p>
            </Cell>
            <Cell title="A code editor">
              <p>VS Code is a free choice. Any editor that can open a folder will do.</p>
            </Cell>
            <Cell title="Node.js">
              <p>Provides npm and npx, which install most skills and command-line tools. Download the LTS version from nodejs.org.</p>
            </Cell>
            <Cell title="A current browser">
              <p>Chrome, Safari or Firefox, to test the page on a desktop and a phone-sized window.</p>
            </Cell>
            <Cell title="One AI account">
              <p>Claude, Gemini or ChatGPT. Check each product page for which plan includes the tool you want, because plans change.</p>
            </Cell>
          </div>
        </section>
        <section className="sec">
          <Stick left="02 · Compare the three" right="Verified against official docs" />
          <div className="tablewrap rv" tabIndex={0} role="region" aria-label="Table. Scroll sideways to see every column.">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Claude</th>
                  <th>Gemini</th>
                  <th>ChatGPT and Codex</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Chat app</td>
                  <td>claude.ai (skills on Pro, Max, Team and Enterprise plans)</td>
                  <td>gemini.google.com</td>
                  <td>ChatGPT (skills are in beta and depend on your workspace)</td>
                </tr>
                <tr>
                  <td>Command-line tool</td>
                  <td>Claude Code</td>
                  <td>Gemini CLI</td>
                  <td>Codex CLI</td>
                </tr>
                <tr>
                  <td>Install</td>
                  <td>
                    <code className="i">curl -fsSL https://claude.ai/install.sh | bash</code>
                  </td>
                  <td>
                    <code className="i">npm install -g @google/gemini-cli</code>
                  </td>
                  <td>
                    <code className="i">npm install -g @openai/codex</code>
                  </td>
                </tr>
                <tr>
                  <td>Start it</td>
                  <td>
                    <code className="i">claude</code>
                  </td>
                  <td>
                    <code className="i">gemini</code>
                  </td>
                  <td>
                    <code className="i">codex</code>
                  </td>
                </tr>
                <tr>
                  <td>Personal skills folder</td>
                  <td>
                    <code className="i">~/.claude/skills/</code>
                  </td>
                  <td>
                    <code className="i">~/.gemini/skills/</code>
                  </td>
                  <td>
                    <code className="i">~/.agents/skills/</code>
                  </td>
                </tr>
                <tr>
                  <td>Project skills folder</td>
                  <td>
                    <code className="i">.claude/skills/</code>
                  </td>
                  <td>
                    <code className="i">.gemini/skills/</code>
                  </td>
                  <td>
                    <code className="i">.agents/skills/</code>
                  </td>
                </tr>
                <tr>
                  <td>Run a skill</td>
                  <td>
                    <code className="i">/skill-name</code> or just describe the task
                  </td>
                  <td>
                    Describe the task. List skills with <code className="i">/skills list</code>
                  </td>
                  <td>
                    <code className="i">$skill-name</code> or describe the task
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '28px' } as CSSProperties} className="rv">
            <Callout>
              Two things changed recently. Gemini CLI’s own page says unpaid-tier and Google One users moved to Antigravity CLI on 18 June 2026, so check which
              tool your account should use. ChatGPT skills are in beta, and workspace owners switch them on. Always confirm in the{' '}
              <a className="ext" href="https://geminicli.com/docs/get-started" target="_blank" rel="noopener">
                Gemini CLI docs
              </a>{' '}
              and the{' '}
              <a className="ext" href="https://learn.chatgpt.com/docs/build-skills" target="_blank" rel="noopener">
                OpenAI skills docs
              </a>
              .
            </Callout>
          </div>
        </section>
        <section className="sec">
          <Stick left="03 · Install your tool" right="Pick one" />
          <div className="rv" style={{ marginBottom: '8px' } as CSSProperties}>
            <PlatformTabs />
          </div>
          <PlatformPanel p="claude">
            <p className="muted" style={{ maxWidth: '60ch', marginTop: '20px' } as CSSProperties}>
              Claude Code is the command-line tool. It needs a Claude subscription or an Anthropic Console account. There is also a desktop app and a VS Code
              extension, both from the same page.
            </p>
            <CodeBlock lang="macOS, Linux, WSL" code={'curl -fsSL https://claude.ai/install.sh | bash'} />
            <CodeBlock lang="Windows PowerShell" code={'irm https://claude.ai/install.ps1 | iex'} />
            <CodeBlock lang="Homebrew or WinGet" code={'brew install --cask claude-code\nwinget install Anthropic.ClaudeCode'} />
            <p className="muted" style={{ maxWidth: '60ch' } as CSSProperties}>
              Open a new terminal, then check the install and start it inside a project folder. It asks you to log in the first time.
            </p>
            <CodeBlock lang="bash" code={'claude --version\ncd your-project\nclaude'} />
            <p className="muted">
              Source:{' '}
              <a className="ext" href="https://code.claude.com/docs/en/overview" target="_blank" rel="noopener">
                Claude Code overview
              </a>
            </p>
          </PlatformPanel>
          <PlatformPanel p="gemini">
            <p className="muted" style={{ maxWidth: '60ch', marginTop: '20px' } as CSSProperties}>
              Gemini CLI installs through npm, so Node.js must be installed first.
            </p>
            <CodeBlock lang="bash" code={'npm install -g @google/gemini-cli\ngemini'} />
            <p className="muted" style={{ maxWidth: '60ch' } as CSSProperties}>
              When it asks how you would like to authenticate, choose “Sign in with Google” and follow the browser prompt.
            </p>
            <p className="muted">
              Source:{' '}
              <a className="ext" href="https://geminicli.com/docs/get-started" target="_blank" rel="noopener">
                Get started with Gemini CLI
              </a>
            </p>
          </PlatformPanel>
          <PlatformPanel p="chatgpt">
            <p className="muted" style={{ maxWidth: '60ch', marginTop: '20px' } as CSSProperties}>
              Codex CLI is OpenAI’s command-line tool. Use one install method only, because a second copy can put an older version first on your PATH.
            </p>
            <CodeBlock lang="macOS, Linux" code={'curl -fsSL https://chatgpt.com/codex/install.sh | sh'} />
            <CodeBlock lang="Alternatives" code={'brew install --cask codex\nnpm install -g @openai/codex'} />
            <CodeBlock lang="Sign in and start" code={'codex login\ncodex --version\ncodex'} />
            <p className="muted" style={{ maxWidth: '60ch' } as CSSProperties}>
              If you only use the ChatGPT website, skills work differently: you ask ChatGPT to build one and click Install. Chapter 02 covers it.
            </p>
            <p className="muted">
              Sources:{' '}
              <a className="ext" href="https://learn.chatgpt.com/docs/build-skills" target="_blank" rel="noopener">
                OpenAI, Build skills
              </a>{' '}
              and a third-party install guide that quotes the same commands. Commands can change, so check the official page.
            </p>
          </PlatformPanel>
        </section>
        <section className="sec">
          <Stick left="04 · Make the project folder" right="2 minutes" />
          <div className="rows">
            <Row cls="rv" num="a" title="Create it">
              <p>Make an empty folder and three files. Plain HTML, CSS and JavaScript is enough. No framework or build step is needed.</p>
              <CodeBlock lang="macOS, Linux" code={'mkdir cinematic-site\ncd cinematic-site\ntouch index.html style.css app.js'} />
              <CodeBlock lang="Windows PowerShell" code={'mkdir cinematic-site\ncd cinematic-site\nni index.html, style.css, app.js'} />
            </Row>
            <Row cls="rv" num="b" title="Serve it">
              <p>
                Run a local web server and open the address it prints. Do not double-click the HTML file. Browsers treat a file:// page differently, and scroll
                libraries and fetch calls can misbehave there.
              </p>
              <CodeBlock lang="bash" code={'python3 -m http.server 8000\n# Windows: py -m http.server 8000\n# then open http://localhost:8000'} />
            </Row>
            <Row cls="rv" num="c" title="Start your AI inside it">
              <p>
                Run the AI tool from this folder so it can see and edit your files: <code className="i">claude</code>, <code className="i">gemini</code> or{' '}
                <code className="i">codex</code>. On the ChatGPT website, upload the three files instead.
              </p>
            </Row>
          </div>
        </section>
        <section className="sec">
          <Stick left="05 · Which one should you pick?" />
          <p className="lede rv" style={{ marginTop: '0' } as CSSProperties}>
            Use the one you already pay for or know. Skills are plain folders with a SKILL.md file, and the same format is read by Claude Code, Gemini CLI and
            Codex. What you learn in chapter 02 carries over. The models do differ in taste and in how carefully they check their own work, so look at every
            result yourself.
          </p>
        </section>
        <NextBar label="Next chapter" href="/skills" text="Chapter 02: Skills" />
      </PageBody>
    </Page>
  );
}
