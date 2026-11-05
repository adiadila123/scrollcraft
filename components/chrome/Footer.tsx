import { chapters } from '@/lib/chapters';

type Ext = { href: string; label: string };
const docs: Ext[] = [
  { href: 'https://code.claude.com/docs/en/skills', label: 'Claude Code skills' },
  { href: 'https://geminicli.com/docs/get-started', label: 'Gemini CLI' },
  { href: 'https://learn.chatgpt.com/docs/build-skills', label: 'OpenAI skills' },
  { href: 'https://agentskills.io/specification', label: 'Agent Skills spec' },
];
const finds: Ext[] = [
  { href: 'https://github.com/anthropics/skills', label: 'Anthropic skills' },
  { href: 'https://www.skills.sh', label: 'skills.sh' },
  { href: 'https://github.com/greensock/gsap-skills', label: 'GSAP skills' },
];

function Column({ title, links }: { title: string; links: Ext[] }) {
  return (
    <div className="f-col">
      <div className="mono">{title}</div>
      {links.map((l) => (
        <a key={l.href} href={l.href} target="_blank" rel="noopener">{l.label}</a>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="f-top">
          <div>
            <a className="mark" href="#home">Scrollcraft</a>
            <p>A free tutorial on building a cinematic scroll website with Claude, Gemini or ChatGPT. Commands were checked against official documentation in November 2026. Check the linked pages before you rely on them.</p>
          </div>
          <div className="f-col">
            <div className="mono">Chapters</div>
            {chapters.map((c) => (
              <a key={c.id} href={`#${c.id}`}>{c.n} {c.title}</a>
            ))}
          </div>
          <Column title="Official docs" links={docs} />
          <Column title="Find skills" links={finds} />
        </div>
        <div className="bigmark" aria-hidden="true">Scrollcraft</div>
        <div className="f-bot">
          <span>© 2026 Scrollcraft. A free tutorial.</span>
          <button type="button" id="totop">Back to top</button>
        </div>
      </div>
    </footer>
  );
}
