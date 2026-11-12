/**
 * The lesson frame for each chapter, in English (see types.ts for the shape). `backticks` mark inline code; [slots]
 * fill in from the reader's project; {rules} and {skills} become the chosen tool's rules file and skills folder.
 */
export const en = {
  start: {
    objectives: [
      'Choose between Claude Code, Gemini CLI and Codex for your situation.',
      'Install the tool and check that it runs from a terminal.',
      'Create a project folder and serve it on a local address.',
      'Start your AI inside the folder, so it can read and edit the files.',
    ],
    ai: {
      intro: 'Your first session. Let the tool look around before it writes anything, and make it ask before every change.',
      prompts: [
        {
          label: 'Get oriented',
          text: 'Look at this folder and tell me what is in it. Do not create or change any file yet. Then tell me the command you would use to serve it locally on port 8000, and wait for my answer.',
        },
        {
          label: 'Check the setup',
          text: 'Check that index.html, style.css and app.js exist and are linked: index.html loads style.css in the head and app.js with defer. If something is missing, show me the change before you make it.',
        },
      ],
    },
    exercises: [
      {
        title: 'Two terminals',
        task: 'Keep the local server running in one terminal and your AI in a second one, both inside the project folder. Close both, then open them again from scratch.',
        hint: 'each terminal needs its own `cd` into the folder.',
        solution:
          'The server has to keep running while you work; stopping it with Ctrl C makes http://localhost:8000 unreachable. Your AI runs in the other terminal, started from the same folder.',
        code: {
          lang: 'bash',
          code: '# terminal 1\ncd cinematic-site\npython3 -m http.server 8000\n\n# terminal 2\ncd cinematic-site\nclaude    # or gemini, or codex',
        },
      },
      {
        title: 'Why not file://',
        task: 'Open index.html by double-clicking it, then through http://localhost:8000. Compare the address bar in both cases.',
        hint: 'look at how each address starts.',
        solution:
          'A double click opens `file:///…`; through the server the address starts with `http://localhost:8000`. ES modules, fetch and several browser features only work over http, which is why every step in this course uses the server.',
      },
      {
        title: 'Know your versions',
        task: 'Write down the versions of Node.js and of your AI tool. You will need them when something behaves differently from the course.',
        hint: 'every tool has a `--version` flag.',
        solution:
          'Keep the output in a notes file in the project. When a command in the course fails, the version is the first thing to compare with the official documentation.',
        code: { lang: 'bash', code: 'node --version\nclaude --version    # or: gemini --version, codex --version' },
      },
    ],
    project: {
      intro: 'Across the course you build one cinematic one-page site for [subject]. Each chapter adds a step. This one sets up the folder.',
      steps: [
        'Create the folder `cinematic-site` with `index.html`, `style.css` and `app.js`.',
        'Paste the starting page below into `index.html` and change the title to [subject].',
        'Serve the folder and open http://localhost:8000.',
        'Start your AI in the folder and run the “Get oriented” prompt.',
      ],
      code: {
        lang: 'index.html',
        code: '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>My cinematic site</title>\n  <link rel="stylesheet" href="style.css">\n  <script src="app.js" defer></script>\n</head>\n<body>\n  <h1>Hello</h1>\n</body>\n</html>',
      },
    },
    testing: {
      checks: [
        'http://localhost:8000 shows the heading “Hello”.',
        'In DevTools, the Network tab shows `style.css` and `app.js` loaded with status 200.',
        'The Console is empty.',
        'Your AI answered the orientation prompt with the three file names and changed nothing.',
      ],
    },
    criteria: [
      'My AI tool runs from a terminal and reports its version.',
      'The project folder has index.html, style.css and app.js.',
      'The page is served from http://localhost, not opened as a file.',
      'I start my AI from inside the project folder.',
    ],
  },

  skills: {
    objectives: [
      'Explain what a skill is, and how its description decides when it loads.',
      'Find skills from trusted sources and judge one before you install it.',
      'Install a skill for your tool and check that it loads.',
      'Write a small skill of your own with a `SKILL.md` file.',
    ],
    ai: {
      intro: 'Ask the tool what it already knows, then let it write your first skill while you review the file.',
      prompts: [
        {
          label: 'Which skills are loaded',
          text: 'List the skills you can use in this session, with one line on when each one loads. Do not run any of them.',
        },
        {
          label: 'Write a skill',
          text: 'Create a skill named scroll-motion-rules in {skills}. Its SKILL.md needs a name and a description saying it applies when building or reviewing scroll animation. The body lists these rules: animate only transform and opacity; every effect has a still version under prefers-reduced-motion; hide content only under a .js class; reveals rise 24px over 0.6s with cubic-bezier(.2,.7,.2,1), once. Show me the file before you save it.',
        },
      ],
    },
    exercises: [
      {
        title: 'Rewrite a description',
        task: 'Open the `SKILL.md` of a skill you installed. Rewrite its description as one sentence that says what it does and when it should load.',
        hint: 'the model reads only the description to decide whether to open the rest.',
        solution:
          'A good description names the task and the trigger words a person would use, for example: “Builds minimalist scroll animation. Use when adding reveals, parallax, pinned sections or smooth scrolling to a web page.”',
      },
      {
        title: 'Make it load',
        task: 'Ask your AI for a reveal animation without naming your skill. Check whether it followed your rules.',
        hint: 'if it did not, the description probably does not match how you asked.',
        solution:
          'Ask “Which skills did you use for that?”. If yours is missing, add the words you actually used (reveal, scroll, animation) to its description and try again in a new session.',
      },
      {
        title: 'Audit before installing',
        task: 'Pick a third-party skill. Before installing it, read every file in its folder and write down anything you would not want it to do.',
        hint: 'look beyond SKILL.md: scripts and reference files count too.',
        solution:
          'Look for scripts that run shell commands, network requests, and instructions that have nothing to do with the description. A skill runs with your tool’s permissions, so install only what you have read and understood.',
      },
    ],
    project: {
      intro: 'Give the course project its own rules for motion, so every later step follows them without being reminded.',
      steps: [
        'Install one design skill from section 04 for your tool.',
        'Add your own `scroll-motion-rules` skill to the project, using the file below.',
        'Ask your AI which skills it would use to build the hero for [subject], and keep its answer in `notes.md`.',
      ],
      code: {
        lang: 'SKILL.md',
        code: '---\nname: scroll-motion-rules\ndescription: Rules for scroll animation on this site. Use when adding or reviewing reveals, parallax, pinned sections or smooth scrolling.\n---\n\n# Scroll motion rules\n\n- Animate only transform and opacity.\n- Every effect has a still version under prefers-reduced-motion.\n- Hide content only under a .js class, so nothing is lost if a script fails.\n- Reveals rise 24px over 0.6s with cubic-bezier(.2, .7, .2, 1), once.',
      },
    },
    testing: {
      checks: [
        'The skill folder holds a `SKILL.md` whose frontmatter has a name and a description.',
        'Asked which skills it can use, your AI names `scroll-motion-rules`.',
        'A reveal it writes animates only transform and opacity and has a reduced-motion rule.',
      ],
    },
    criteria: [
      'I can say in one sentence when a skill loads.',
      'At least one skill is installed and recognised by my tool.',
      'My own skill has a valid SKILL.md and is used when it should be.',
      'I read every file of a third-party skill before installing it.',
    ],
  },

  prompting: {
    objectives: [
      'Write a five-part brief: outcome, facts, limits, format and evidence.',
      'Turn a vague request into a specific one.',
      'Keep the rules that never change in a project rules file.',
      'Steer a session: a plan before code, one change at a time, and a way back.',
    ],
    ai: {
      intro: 'Two prompts you will use for the rest of the course: one that makes the AI plan before it codes, one that makes it look for its own mistakes.',
      prompts: [
        {
          label: 'Plan before code',
          text: 'Read {rules} and brief.md. Do not write code yet. Give me a numbered plan for the hero section of the site for [subject]: the files you will change, what each change does, and how I can check it in the browser. Wait for my approval.',
        },
        {
          label: 'Review as a sceptic',
          text: 'Review your last change as a sceptical senior front-end developer. List what could break on a phone, with reduced motion and with the keyboard only. Do not fix anything yet.',
        },
      ],
    },
    exercises: [
      {
        title: 'Rewrite a vague brief',
        task: 'Rewrite “Make me a cool website with animations.” as a five-part brief for [subject].',
        hint: 'go through outcome, facts, limits, format and evidence in that order.',
        solution: 'Compare yours with this one. Every part answers a question the AI would otherwise guess.',
        code: {
          lang: 'Prompt',
          code: 'Outcome: a one-page cinematic site for [subject], for [audience], ending with one action: [one action].\nFacts: five sections in this order: hero, story, three features, pinned product moment, call to action. Use only the text I give you.\nLimits: plain HTML, CSS and JavaScript in three files. Animate only transform and opacity. Every effect has a still version under prefers-reduced-motion. No invented numbers, quotes or logos.\nFormat: the three files in full, then a list of what changed.\nEvidence: list every check you ran, with the width or tool, and every check you could not run.',
        },
      },
      {
        title: 'Find the missing part',
        task: 'This brief has no limits: “Build a one-page site for [subject] with a pinned product section and a contact link. Reply with the three files.” Add them.',
        hint: 'limits are what the AI must not do or use.',
        solution:
          'For example: plain HTML, CSS and JavaScript; no library except Lenis; animate only transform and opacity; respect reduced motion; nothing hidden without a .js class; no invented numbers, quotes or logos.',
      },
      {
        title: 'Ask for evidence',
        task: 'Write the one sentence that makes the AI prove its work instead of saying “tested”.',
        hint: 'ask for what was run and for what was not.',
        solution:
          '“List every check you actually ran, with the width or tool you used, and every check you could not run and why.” Then open the page and look at the checks it could not run.',
      },
    ],
    project: {
      intro: 'Before any code, write down what the site is and the rules that never change.',
      steps: [
        'Write `brief.md` with the five parts for [subject], using the template below.',
        'Create your rules file in the project root (CLAUDE.md, GEMINI.md or AGENTS.md) with the limits from the brief.',
        'Run “Plan before code” and save the plan the AI gives you as `plan.md`.',
        'Run `git init` and commit, so every later step has a way back.',
      ],
      code: {
        lang: 'brief.md',
        code: '# Brief: [subject]\n\nOutcome: a one-page cinematic site for [subject], aimed at [audience].\nThe page ends with one action: [one action].\n\nFacts: names, real numbers, real quotes, and the sections in order.\n\nLimits: plain HTML, CSS and JavaScript in three files. Animate only\ntransform and opacity. Every effect has a still version under\nprefers-reduced-motion. No invented numbers, quotes or logos.\n\nFormat: the three files in full, then a list of what changed.\n\nEvidence: every check you ran, with the width or tool, and every\ncheck you could not run.',
      },
    },
    testing: {
      checks: [
        '`brief.md` has all five parts, and none of them says “TBD”.',
        'Asked “Which rules apply in this project?”, your AI quotes your rules file.',
        'The plan names files and a check for each step, and no file changed before you approved it.',
        '`git log` shows a first commit.',
      ],
    },
    criteria: [
      'My brief names the outcome, the facts, the limits, the format and the evidence.',
      'The rules file exists, and the AI follows it without being reminded.',
      'I asked for a plan before code and approved it before any change.',
      'I can undo the last change with git.',
    ],
  },

  build: {
    objectives: [
      'Run the same loop on every step: brief, generate, inspect, refine.',
      'Build the page in ten small steps instead of one large request.',
      'Add smooth scrolling, reveals, depth and a pinned moment that all respect reduced motion.',
      'Review the finished page on a phone and with the keyboard.',
    ],
    ai: {
      intro: 'One prompt per step keeps every change small enough to check. The review prompt at the end looks at the page as a whole.',
      prompts: [
        {
          label: 'One step',
          text: 'Read {rules}, brief.md and plan.md. Do step [number] only: [the step]. Change as few lines as possible, then tell me exactly how to check it in the browser, and what you did not check.',
        },
        {
          label: 'Art director review',
          text: 'Act as an art director. Look at the page at 375 and 1440 pixels wide and list the five changes that would make it feel calmer and more deliberate, ranked by impact. Do not change anything yet.',
        },
      ],
    },
    exercises: [
      {
        title: 'Break a step down',
        task: 'Split “Add a pinned product section with three features” into changes small enough to check one at a time.',
        hint: 'markup, layout, behaviour, then the still and phone versions.',
        solution:
          '1. Markup for the section and its three features. 2. The sticky layout. 3. The script that picks the active feature. 4. The reduced-motion version, where the features simply stack. 5. The phone layout. Check and commit after each.',
      },
      {
        title: 'Find the stutter',
        task: 'In Chrome DevTools, record a Performance profile while you scroll the hero. Find what runs on every frame.',
        hint: 'long yellow blocks are JavaScript, purple ones are layout.',
        solution:
          'A parallax that changes `top` or `margin` forces layout on every frame. Move it with `transform: translate3d()` instead, read the scroll position once per frame, and stop the work once the hero has left the screen.',
      },
      {
        title: 'The still version',
        task: 'Turn on reduced motion in your system settings and scroll the whole page.',
        hint: 'macOS: Accessibility, Display. Windows: Accessibility, Visual effects, Animation effects off.',
        solution:
          'Smooth scrolling stops, parallax layers stay put, reveals appear without moving, and the pinned section reads as a normal list. Anything that still moves needs its own `prefers-reduced-motion` rule.',
      },
    ],
    project: {
      intro: 'Now the course project gets its page. Work through the ten steps of this chapter for [subject], one prompt each.',
      steps: [
        'Run the ten steps with the “One step” prompt, checking each in the browser before the next.',
        'Commit after every step that passes its check.',
        'Finish with the art director review and apply the two changes it ranks highest.',
      ],
      code: { lang: 'bash', code: 'git add -A\ngit commit -m "Step 4: reveal on scroll"' },
    },
    testing: {
      checks: [
        'The Console shows no errors at 375, 768 and 1440 pixels wide.',
        'Every element with the `reveal` class is visible once you have scrolled past it.',
        'Nothing overlaps or is cut off at 375 pixels.',
        'Tab reaches every link and button, with a visible focus ring.',
        'With reduced motion on, smooth scrolling and parallax stop.',
      ],
      code: {
        lang: 'JavaScript',
        code: "// paste into the Console after scrolling to the bottom:\n// lists every reveal that never appeared (an empty list is a pass)\n[...document.querySelectorAll('.reveal:not(.in)')].map((el) => el.textContent.trim().slice(0, 40));",
      },
    },
    criteria: [
      'All ten steps are in the page, each committed separately.',
      'There are no console errors at 375, 768 and 1440 pixels.',
      'Everything reads and works with reduced motion and with the keyboard alone.',
      'I applied at least two changes from the art director review.',
    ],
  },
};
