import Link from 'next/link';
import { chapterHref, chaptersFor } from '@/lib/chapters';
import { dicts } from '@/lib/dict';
import { withLocale, type Locale } from '@/lib/i18n';
import BackToTop from './BackToTop';
import { MotionSwitch } from './MotionNotice';

/** The footer: every chapter, the official docs the tutorial relies on, the language switch and back to top. */
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
        <a key={l.href} href={l.href} target="_blank" rel="noopener">
          {l.label}
        </a>
      ))}
    </div>
  );
}

export default function Footer({ locale }: { locale: Locale }) {
  const t = dicts[locale].footer;
  return (
    <footer>
      <div className="wrap">
        <div className="f-top">
          <div>
            <Link className="mark" href={chapterHref('home', locale)}>
              Scrollcraft
            </Link>
            <p>{t.blurb}</p>
            <a
              className="f-lang"
              href={withLocale(locale === 'en' ? 'ro' : 'en', '/')}
              hrefLang={locale === 'en' ? 'ro' : 'en'}
              lang={locale === 'en' ? 'ro' : 'en'}
            >
              {dicts[locale].lang.switchTo}
            </a>
            <MotionSwitch />
          </div>
          <div className="f-col">
            <div className="mono">{t.chapters}</div>
            {chaptersFor(locale).map((c) => (
              <Link key={c.id} href={chapterHref(c.id, locale)}>
                {c.n} {c.title}
              </Link>
            ))}
          </div>
          <Column title={t.docs} links={docs} />
          <Column title={t.finds} links={finds} />
        </div>
        {/* drawn from a data attribute, so the decorative wordmark is not text that contrast rules apply to */}
        <div className="bigmark" aria-hidden="true" data-mark="Scrollcraft" />
        <div className="f-bot">
          <span>{t.rights}</span>
          <BackToTop label={t.top} />
        </div>
      </div>
    </footer>
  );
}
