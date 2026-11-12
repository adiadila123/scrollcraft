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
        code: '<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>My cinematic site</title>\n  <link rel="stylesheet" href="style.css">\n  <script src="app.js" defer></script>\n</head>\n<body>\n  <main>\n    <h1>Hello</h1>\n  </main>\n</body>\n</html>',
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
          text: 'Create a skill named scroll-motion-rules in {skills}. Its SKILL.md needs a name and a description saying it applies when building or reviewing scroll animation. The body lists these rules: animate only transform and opacity; every effect has a still version under prefers-reduced-motion; hide content only under a .js class; reveals rise 24px over 0.9s with cubic-bezier(.2,.7,.2,1), once. Show me the file before you save it.',
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
        code: '---\nname: scroll-motion-rules\ndescription: Rules for scroll animation on this site. Use when adding or reviewing reveals, parallax, pinned sections or smooth scrolling.\n---\n\n# Scroll motion rules\n\n- Animate only transform and opacity.\n- Every effect has a still version under prefers-reduced-motion.\n- Hide content only under a .js class, so nothing is lost if a script fails.\n- Reveals rise 24px over 0.9s with cubic-bezier(.2, .7, .2, 1), once.',
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

  motion: {
    objectives: [
      'Name the nine scroll techniques and say what each one is for.',
      'Choose a technique by the job it does in the story, not by how impressive it looks.',
      'Build each one with CSS and a little JavaScript, with a still version under reduced motion.',
      'Combine two or three techniques on one page without them competing.',
    ],
    ai: {
      intro: 'Ask for one technique at a time, by name, with its limits. Then make the AI explain the code, so you can change it yourself next time.',
      prompts: [
        {
          label: 'Add one technique',
          text: 'Read {rules}. Add a sticky product tour to the site for [subject]: the device stays pinned while three features scroll past, and the active feature is the last one whose heading has passed 55% of the screen height. Plain CSS and JavaScript, one scroll listener, transform and opacity only. Under prefers-reduced-motion the features simply stack. Show me the plan first.',
        },
        {
          label: 'Explain it back',
          text: 'Explain the code you just wrote line by line, as if I will maintain it alone: what runs on every frame, what runs once, and what I would change to make the effect slower or calmer.',
        },
      ],
    },
    exercises: [
      {
        title: 'Match technique to job',
        task: 'For each job, pick a technique: keep a label visible while its section is read; show a long timeline; reveal a quote once; tell a product story in three beats.',
        hint: 'four of the nine techniques answer these exactly.',
        solution:
          'Sticky positioning for the label; horizontal scroll for the timeline; scroll triggered for the quote; scrollytelling (or a sticky product tour) for the three beats.',
      },
      {
        title: 'Remove the JavaScript',
        task: 'The sticky positioning demo uses no JavaScript. Which other technique in this chapter can also be built in CSS alone in current browsers?',
        hint: 'look at the scroll driven demo and at scroll snap.',
        solution:
          'Scroll snap is pure CSS. Scroll driven progress can be CSS too, with `animation-timeline: scroll()`; keep a JavaScript fallback for browsers that do not support it yet.',
        code: {
          lang: 'CSS',
          code: '.progress {\n  transform-origin: 0 50%;\n  animation: grow linear both;\n  animation-timeline: scroll(root);\n}\n@keyframes grow { from { transform: scaleX(0); } }',
        },
      },
      {
        title: 'One too many',
        task: 'A hero has parallax layers, a zoom on scroll, a split headline and a scroll-speed marquee. Remove the effects that compete and keep the page cinematic.',
        hint: 'one effect should lead each screen.',
        solution:
          'Keep the split headline as the first impression and one supporting depth effect, parallax or zoom, not both. Move the marquee further down the page, where it has the screen to itself.',
      },
    ],
    project: {
      intro: 'Give the site for [subject] its signature moments. Pick two recipes from section 02 that fit your story, and build them one at a time.',
      steps: [
        'Choose two recipes and write in `notes.md` why each one serves the story.',
        'Add the first with the “Add one technique” prompt, check it, commit.',
        'Add the second, check that the two do not compete on the same screen, commit.',
        'Run “Explain it back” for both and keep the answers next to the code as comments.',
      ],
    },
    testing: {
      checks: [
        'Each new effect runs at a steady frame rate while you scroll: no long tasks in the Performance panel.',
        'With reduced motion on, each effect has a still version that still tells the story.',
        'At 375 pixels wide, nothing overlaps and pinned sections fit the screen.',
        'Keyboard scrolling (Space, Page Down, arrows) moves through every section.',
      ],
    },
    criteria: [
      'I can name the nine techniques and the job of each.',
      'My site has two techniques chosen for its story, each committed separately.',
      'Every effect has a still version under reduced motion.',
      'I can explain what my effect code does on every frame.',
    ],
  },

  playground: {
    objectives: [
      'Feel how smoothing, parallax speed, stagger and easing change the mood of a page.',
      'Choose values on purpose and write them down as design decisions.',
      'Copy the exact line of code each setting produces.',
      'Keep motion values consistent across the whole site.',
    ],
    ai: {
      intro: 'The playground gives you numbers. These prompts turn them into one place in the code, so the whole site moves with the same character.',
      prompts: [
        {
          label: 'Apply the values',
          text: 'Read {rules}. Collect every motion value in the site for [subject] into one place: the Lenis lerp, the parallax speed, the reveal stagger and the easing curve, as CSS custom properties and one JavaScript object. Use these values: lerp [value], parallax speed [value], stagger [value] ms, easing [cubic-bezier]. Replace the hard-coded numbers and list every line you changed.',
        },
        {
          label: 'Find stray values',
          text: 'Search the CSS and JavaScript for durations, delays, easing curves and speeds that do not come from the shared motion values. List each one with its file and line. Do not change them yet.',
        },
      ],
    },
    exercises: [
      {
        title: 'Calm versus lively',
        task: 'Find a smoothing value that feels calm and one that feels lively. Write both down with one word for each feeling.',
        hint: 'a lower lerp follows the wheel more slowly.',
        solution:
          'Around 0.06 to 0.08 feels calm and heavy; around 0.12 to 0.15 feels responsive and light. Very low values make the page feel late, which reads as lag rather than calm.',
      },
      {
        title: 'Depth without nausea',
        task: 'Set the parallax speed so the layers feel deep but the text never drifts far from where the reader expects it.',
        hint: 'move the background, not the words.',
        solution:
          'Keep text layers at speed 1 (moving with the page) and move only the background, at roughly 0.6 to 0.8. Large speed differences on text make reading harder and can cause discomfort.',
      },
      {
        title: 'One curve',
        task: 'Pick a single easing curve for every reveal on your site and explain why it fits [subject].',
        hint: 'an ease-out starts fast and settles.',
        solution:
          'A strong ease-out such as `cubic-bezier(.2, .7, .2, 1)` arrives quickly and settles gently, which reads as confident and calm. Use it for every reveal; keep linear timing for scrubbed scenes, where the scroll is the easing.',
      },
    ],
    project: {
      intro: 'Turn your choices into the motion settings of the site for [subject], so every effect shares them.',
      steps: [
        'Try each of the four experiments and note the values you like.',
        'Add the values to `style.css` and `app.js` as below, then run “Apply the values”.',
        'Run “Find stray values” and fix what it lists.',
      ],
      code: {
        lang: 'style.css',
        code: ':root {\n  /* motion: chosen in the playground */\n  --reveal-duration: .9s;\n  --reveal-stagger: 80ms;\n  --ease-out: cubic-bezier(.2, .7, .2, 1);\n}\n\n/* app.js */\n/* const MOTION = { lerp: 0.09, parallax: 0.7, stagger: 80 }; */',
      },
    },
    testing: {
      checks: [
        'Every duration, delay, easing and speed in the code comes from the shared values.',
        'Changing `--reveal-duration` in one place changes every reveal on the page.',
        'Scrolling with a mouse wheel and with a trackpad both feel smooth, neither late nor jumpy.',
      ],
    },
    criteria: [
      'I chose values for smoothing, parallax, stagger and easing, and can say why.',
      'They live in one place in the code.',
      'No motion value in my site is hard-coded outside that place.',
    ],
  },

  gsap: {
    objectives: [
      'Sequence several movements with a GSAP timeline and its position parameter.',
      'Tie a timeline to the scroll with ScrollTrigger: scrub, pin and start and end points.',
      'Draw SVG lines and reveal split text with the free GSAP plugins.',
      'Clean up in React with `useGSAP`, and respect reduced motion with `gsap.matchMedia()`.',
    ],
    ai: {
      intro: 'GSAP code goes wrong in predictable ways: missing plugin registration, triggers measured too early, no cleanup. Name those in the prompt.',
      prompts: [
        {
          label: 'A pinned scene',
          text: 'Read {rules}. Add a pinned scene to the site for [subject] with GSAP 3.15.1 and ScrollTrigger from jsDelivr: the section stays pinned for 200% of the screen height while three steps hand over one after another, with a progress line. Register the plugin, build it inside gsap.matchMedia so nothing animates under prefers-reduced-motion (the steps stack instead), and call ScrollTrigger.refresh() after images load. Show me the plan first.',
        },
        {
          label: 'Check the triggers',
          text: 'Turn on ScrollTrigger markers temporarily and tell me where each trigger starts and ends at 375 and 1440 pixels wide. Then remove the markers. Do not change anything else.',
        },
      ],
    },
    exercises: [
      {
        title: 'Read the position parameter',
        task: 'In `tl.to(a, {…}).to(b, {…}, "-=0.4").to(c, {…}, "<")`, when does each tween start?',
        hint: '“<” refers to the start of the previous tween.',
        solution: '`a` starts at 0. `b` starts 0.4 seconds before `a` ends. `c` starts at the same moment as `b`.',
      },
      {
        title: 'Scrub or play',
        task: 'For a headline that appears once, and for a product that rotates as you scroll, choose between `scrub` and `toggleActions`.',
        hint: 'does the animation follow the scroll both ways?',
        solution:
          'The headline plays once with `toggleActions: "play none none none"` (or `once: true`). The rotating product uses `scrub`, so it moves forward and back exactly with the scroll.',
      },
      {
        title: 'Clean up in React',
        task: 'A component creates a ScrollTrigger in `useEffect` without cleanup. What happens after navigating away and back three times?',
        hint: 'nothing removes the old triggers.',
        solution:
          'Four sets of triggers exist, three attached to elements that are gone, so positions are wrong and work is wasted. Use `useGSAP` with a `scope`, which reverts everything on unmount.',
        code: {
          lang: 'tsx',
          code: "useGSAP(() => {\n  gsap.from('.reveal', { y: 28, opacity: 0, scrollTrigger: { trigger: root.current, start: 'top 80%' } });\n}, { scope: root });",
        },
      },
    ],
    project: {
      intro: 'Give the site for [subject] one scene that only GSAP makes easy: a pinned sequence that tells part of the story.',
      steps: [
        'Choose the part of the story that has three beats, and write them in `notes.md`.',
        'Run “A pinned scene” and check it at three widths.',
        'Run “Check the triggers” and adjust start and end if a step arrives too early or too late.',
        'Commit, with the GSAP version pinned in the script URL.',
      ],
    },
    testing: {
      checks: [
        'The section pins and unpins without a jump or a gap at 375, 768 and 1440 pixels.',
        'Scrolling back up plays the scene backwards exactly.',
        'With reduced motion on, nothing is pinned and the three steps read as a list.',
        'The Console shows no warnings about missing plugins or targets.',
      ],
    },
    criteria: [
      'I can read a GSAP timeline and say when each tween starts.',
      'My site has one pinned scene built with ScrollTrigger inside gsap.matchMedia.',
      'The scene is correct at three widths and when scrolling backwards.',
      'GSAP is loaded from a pinned version.',
    ],
  },

  webgl: {
    objectives: [
      'Set up a three.js scene with a renderer, a camera, lights and one object.',
      'Drive a scene from the scroll position, drawing only when something changes.',
      'Move work to the graphics card with shaders and buffer attributes.',
      'Keep WebGL fast and safe: a pixel ratio cap, cleanup, reduced motion and a fallback.',
    ],
    ai: {
      intro: 'WebGL prompts need limits more than any other: the AI will happily add post-processing and shadows a phone cannot afford.',
      prompts: [
        {
          label: 'A hero scene',
          text: 'Read {rules}. Add a three.js 0.187.0 scene behind the hero of the site for [subject], loaded as an ES module through an import map from jsDelivr. One object, two lights, no shadows, no post-processing. The scroll position rotates the object and moves the camera; draw only when the scroll changes. Cap the pixel ratio at 2, create the renderer inside try and show a still image when WebGL is missing, and keep the scene still under prefers-reduced-motion.',
        },
        {
          label: 'Performance pass',
          text: 'Measure the hero scene: frame time while scrolling, draw calls, and texture memory. Tell me the single change that would help a mid-range phone most. Do not change anything yet.',
        },
      ],
    },
    exercises: [
      {
        title: 'Render on demand',
        task: 'The scene draws 60 times a second even when the page is still. Change it to draw only when the scroll changes.',
        hint: 'request one frame from the scroll listener.',
        solution: 'Remove the continuous loop and queue a single frame when the scroll moves, so the graphics card rests while the reader reads.',
        code: {
          lang: 'JavaScript',
          code: "let queued = false;\nfunction render() {\n  queued = false;\n  mesh.rotation.y = scrollY * 0.002;\n  renderer.render(scene, camera);\n}\naddEventListener('scroll', () => {\n  if (!queued) { queued = true; requestAnimationFrame(render); }\n}, { passive: true });\nrender();",
        },
      },
      {
        title: 'The fallback',
        task: 'Make the page readable on a computer without WebGL.',
        hint: 'the renderer constructor throws when WebGL is unavailable.',
        solution:
          'Create the renderer inside `try`; in `catch`, add a class to the html element that hides the canvas and shows a still image or nothing at all. The text must never depend on the scene.',
      },
      {
        title: 'Where the cost goes',
        task: 'A particle hero is smooth on a laptop and stutters on a phone. List three changes, cheapest first.',
        hint: 'pixels, then points, then effects.',
        solution:
          '1. Cap the pixel ratio lower (1.5 or 1). 2. Use fewer points on small screens. 3. Remove extra passes such as bloom. Measure after each change.',
      },
    ],
    project: {
      intro: 'If a 3D moment serves the story of [subject], add one. If it does not, skip this step: restraint is a design decision too.',
      steps: [
        'Decide whether the hero gains anything from depth. Write the reason in `notes.md`.',
        'If yes, run “A hero scene”, then “Performance pass”.',
        'Turn off WebGL in the browser (or test on an old device) and check the fallback.',
        'Commit, with the three.js version pinned in the import map.',
      ],
    },
    testing: {
      checks: [
        'The scene draws only while you scroll: the Performance panel is quiet when the page is still.',
        'With WebGL disabled, the page reads in full with no errors.',
        'With reduced motion on, the scene does not move.',
        'On a real phone, scrolling past the hero does not stutter or heat the device.',
      ],
    },
    criteria: [
      'I can set up a three.js scene and explain each part.',
      'My scene renders on demand and caps the pixel ratio.',
      'There is a fallback without WebGL and a still version under reduced motion.',
      'I decided on purpose whether my site needs WebGL at all.',
    ],
  },

  examples: {
    objectives: [
      'Read a complete site and recognise the techniques it combines.',
      'Explain why each example feels cinematic: pacing, restraint and one loop.',
      'Rebuild an example for your own subject with the prompts given.',
      'Replace placeholder media with real images, frames or a route.',
    ],
    ai: {
      intro: 'Use the examples as references, not templates: ask the AI to explain a technique from one of them, then adapt it to your own structure.',
      prompts: [
        {
          label: 'Learn from an example',
          text: 'Here are the three files of the Field Studio example. List the techniques it uses, where each one lives in the code, and the shared loop that drives them. Then tell me which one would fit the site for [subject] and why.',
        },
        {
          label: 'Adapt, do not copy',
          text: 'Read {rules}. Add the clip-path reveal from the Field Studio example to the image sections of my site, using my existing scroll loop and motion values instead of copying its code. Keep my markup and class names. Show me the plan first.',
        },
      ],
    },
    exercises: [
      {
        title: 'Spot the techniques',
        task: 'Scroll the product launch example and list every technique you notice before reading its breakdown.',
        hint: 'watch the headline, the device, the words and the progress line.',
        solution:
          'Line-by-line headline reveal, a frame-sequence scrub with captions, words lit by the scroll, a sticky product tour, and a scroll progress line. Compare with “Techniques used”.',
      },
      {
        title: 'The shared loop',
        task: 'Open `app.js` of the portfolio example. Find the function that runs on scroll and list what it updates.',
        hint: 'look for requestAnimationFrame.',
        solution:
          '`update()` runs at most once per frame and updates the clip reveals and the horizontal gallery; the marquee has its own drift loop that stops under reduced motion.',
      },
      {
        title: 'Remove one thing',
        task: 'Pick one example and decide which single effect you would remove to make it calmer. Explain what the page gains.',
        hint: 'restraint is one of the four things all three share.',
        solution: 'There is no single right answer. A good one names the effect, the screen it competes on, and what the reader can now notice instead.',
      },
    ],
    project: {
      intro: 'Compare the site for [subject] with the example closest to it, and borrow one idea properly.',
      steps: [
        'Pick the example closest to your site and run “Learn from an example” with its files.',
        'Run “Adapt, do not copy” for one technique.',
        'Replace every placeholder image or frame in your site with real media, compressed.',
        'Check your site against the four things all three examples share.',
      ],
    },
    testing: {
      checks: [
        'The borrowed technique uses your loop and motion values, not a second loop.',
        'Your site has no placeholder images or invented text left.',
        'Every image has a width, a height and alt text, and those below the fold load lazily.',
        'Side by side with the example, your site is as calm at 375 pixels wide.',
      ],
    },
    criteria: [
      'I can list the techniques in each example and where they live in the code.',
      'I adapted one technique to my site without duplicating its loop.',
      'My site uses real media, sized and compressed.',
      'My site has the four shared qualities: one loop, readable without effects, restraint, mobile first.',
    ],
  },

  design: {
    objectives: [
      'Turn colour, type, space and motion into a short list of named tokens.',
      'Build components that read tokens and never hold raw values.',
      'Make a theme or a reduced-motion version by changing tokens, not rules.',
      'Write a `DESIGN.md` that keeps the AI consistent from the first section to the last.',
    ],
    ai: {
      intro: 'The AI is good at extracting tokens from existing CSS and bad at keeping to them unless told. Do both in that order.',
      prompts: [
        {
          label: 'Extract tokens',
          text: 'Read {rules} and style.css. Propose a token set for the site for [subject]: colours named by role, a type scale of four or five clamp() steps, a spacing scale from one unit, and motion tokens (durations, easing, distance). Show me the :root block and a table of which raw values each token replaces. Do not edit the CSS yet.',
        },
        {
          label: 'Write DESIGN.md',
          text: 'Write DESIGN.md for the site for [subject] from the tokens we agreed: mood in one line, the token rules, type, colour, motion and a short list of things not to do. Under 60 lines. Then add one line to {rules} telling you to read DESIGN.md before any visual change.',
        },
      ],
    },
    exercises: [
      {
        title: 'Name by role',
        task: 'Rename these tokens by role: `--blue`, `--grey-400`, `--white`, `--dark`.',
        hint: 'ask what each colour does on the page.',
        solution:
          'For example `--accent`, `--muted`, `--fg` and `--bg` (or `--surface`). Names by role survive a change of palette; names by hue become lies the day the accent turns orange.',
      },
      {
        title: 'Reduced motion by token',
        task: 'Make every transition on the page stop under reduced motion with one rule.',
        hint: 'every transition already reads a duration token.',
        solution: 'Set the duration tokens to zero inside the media query. Every rule that uses them follows.',
        code: { lang: 'CSS', code: '@media (prefers-reduced-motion: reduce) {\n  :root { --dur-fast: 0s; --dur-base: 0s; --dur-slow: 0s; }\n}' },
      },
      {
        title: 'Spot the drift',
        task: 'Find three raw values in your CSS that should be tokens.',
        hint: 'search for `#`, `px` and `s` outside `:root`.',
        solution:
          'Typical finds: a hex colour in a hover state, a one-off `margin: 37px`, a `transition: .3s` that should be `--dur-fast`. Replace each with the nearest token, or add a token if none fits.',
      },
    ],
    project: {
      intro: 'Give the site for [subject] a design system it can grow with.',
      steps: [
        'Run “Extract tokens” and agree the set with the AI.',
        'Move every value into `:root` and replace the raw values, one group at a time, checking the page after each.',
        'Run “Write DESIGN.md” and commit both files.',
        'Change `--accent` once to check that the whole site follows.',
      ],
    },
    testing: {
      checks: [
        'Outside `:root`, the CSS has no hex colours and no raw durations.',
        'Changing one token visibly changes every place that uses it.',
        'With reduced motion on, nothing transitions.',
        'Asked “Which file sets the design rules?”, the AI names DESIGN.md.',
      ],
    },
    criteria: [
      'My site has colour, type, space and motion tokens in one :root block.',
      'Components use only tokens.',
      'Reduced motion is handled by setting the motion tokens.',
      'DESIGN.md exists and the rules file points to it.',
    ],
  },

  architecture: {
    objectives: [
      'Choose a stack by the problem: plain files, GSAP, Next.js or a backend.',
      'Organise files so content, sections, motion and the loop each live in one place.',
      'Run every effect from one animation loop that stops when the tab is hidden.',
      'Make the page work in full without JavaScript, and clean up every effect in React.',
    ],
    ai: {
      intro: 'Refactoring is where the AI saves the most time and does the most damage. Ask for a plan, keep behaviour identical, and check after each move.',
      prompts: [
        {
          label: 'One loop',
          text: 'Read {rules} and app.js. Refactor every scroll and animation effect in the site for [subject] to run from one requestAnimationFrame loop in ticker.js, with an onFrame(fn) function that returns a stop function and pauses while the tab is hidden. Behaviour must stay identical. Give me the plan first, then move one effect at a time.',
        },
        {
          label: 'Without JavaScript',
          text: 'List everything on the page that is hidden, positioned or created by JavaScript. For each, tell me what a visitor sees with JavaScript turned off, and the smallest change that makes it readable.',
        },
      ],
    },
    exercises: [
      {
        title: 'Pick the stack',
        task: 'Choose a stack for each: a one-page launch site; a studio site with forty projects and a CMS; a landing page with a contact form that stores messages.',
        hint: 'the table in section 01 has a row for each.',
        solution:
          'Plain HTML, CSS and JS for the launch; Next.js for forty projects and a CMS; plain files plus a small backend (Flask or a form service) for the contact form.',
      },
      {
        title: 'Count the loops',
        task: "Search your `app.js` for `requestAnimationFrame` and `addEventListener('scroll'`. How many separate loops and listeners do you have?",
        hint: 'each effect written separately usually adds one of each.',
        solution:
          'More than one of either means effects read the scroll at different moments in the frame. Move them to one loop: read the scroll once, then update every effect.',
      },
      {
        title: 'Turn JavaScript off',
        task: 'In Chrome DevTools, open the command menu, run “Disable JavaScript” and reload your page.',
        hint: 'the command menu opens with Cmd+Shift+P or Ctrl+Shift+P.',
        solution:
          'Everything should still be readable: hidden states only apply under the `.js` class, and pinned or horizontal sections fall back to normal flow. Anything missing reveals a rule that hides content without that class.',
      },
    ],
    project: {
      intro: 'Make the site for [subject] easy to change: one loop, clear files, and content that survives without scripts.',
      steps: [
        'Run “One loop” and move the effects one at a time, checking the page after each.',
        'Split `app.js` into the loop and one function per effect, as in section 02.',
        'Run “Without JavaScript” and fix what it finds.',
        'Commit each step separately.',
      ],
    },
    testing: {
      checks: [
        '`requestAnimationFrame` appears in one place only: the loop.',
        'Switching to another tab and back pauses and resumes the effects.',
        'With JavaScript disabled, every section is readable.',
        'The page looks and behaves exactly as before the refactor.',
      ],
    },
    criteria: [
      'I can justify my stack in one sentence.',
      'All effects run from one loop that pauses in a hidden tab.',
      'The page reads in full without JavaScript.',
      'The refactor changed no visible behaviour.',
    ],
  },

  performance: {
    objectives: [
      'Explain LCP, INP and CLS and the good threshold for each.',
      'Set and follow a budget for images, video, fonts and scripts.',
      'Keep scrolling smooth: transform and opacity, batched reads, nothing off screen.',
      'Measure with Lighthouse, the Performance panel and a real phone, and fix the biggest item first.',
    ],
    ai: {
      intro: 'Ask the AI to measure before it optimises. Optimising without numbers usually moves work around without removing any.',
      prompts: [
        {
          label: 'Baseline',
          text: 'Run Lighthouse in mobile mode on the site for [subject] and give me LCP, CLS and Total Blocking Time, plus the three biggest opportunities with the file and line each one comes from. Do not change anything yet.',
        },
        {
          label: 'Fix one thing',
          text: 'Read {rules}. Fix only the first opportunity from the baseline. Then run Lighthouse again with the same settings and show me the before and after numbers side by side.',
        },
      ],
    },
    exercises: [
      {
        title: 'Find the LCP element',
        task: 'In the Lighthouse report or the Performance panel, find which element is your Largest Contentful Paint.',
        hint: 'it is usually the hero image or the hero heading.',
        solution:
          'If it is an image: serve AVIF or WebP at the right size, add width and height, and `fetchpriority="high"`. If it is text: preload the font it uses and keep `font-display: swap`.',
      },
      {
        title: 'Stop the layout shift',
        task: 'Your CLS is 0.25. Find what moves while the page loads.',
        hint: 'images without dimensions and fonts that swap are the usual causes.',
        solution:
          'Give every image and video `width` and `height` (or an `aspect-ratio`), reserve space for embeds, and use a fallback font with similar metrics. Measure again: good is 0.1 or less.',
      },
      {
        title: 'Pause off screen',
        task: 'Make one looping effect in your site stop when it is not visible.',
        hint: 'the preview in section 03 does exactly this.',
        solution: 'Watch the element with an IntersectionObserver; start the loop when it enters and cancel the frame when it leaves.',
        code: {
          lang: 'JavaScript',
          code: 'new IntersectionObserver(([e]) => {\n  if (e.isIntersecting && !raf) raf = requestAnimationFrame(loop);\n  if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; }\n}).observe(el);',
        },
      },
    ],
    project: {
      intro: 'Make the site for [subject] fast on a mid-range phone, with numbers to prove it.',
      steps: [
        'Run “Baseline” and save the numbers in `notes.md`.',
        'Go through the budget table: images, video, fonts, scripts.',
        'Run “Fix one thing” three times, for the three biggest opportunities.',
        'Pause every off-screen loop, then record the final numbers.',
      ],
    },
    testing: {
      checks: [
        'Lighthouse mobile: LCP 2.5 s or less and CLS 0.1 or less.',
        'Every image has width and height; those below the first screen load lazily.',
        'The Performance panel shows no long tasks while scrolling, with the CPU slowed four times.',
        'On a real phone, the whole page scrolls without stutter.',
      ],
    },
    criteria: [
      'I recorded numbers before and after my changes.',
      'My site meets the good thresholds for LCP and CLS on mobile.',
      'Nothing animates off screen.',
      'I checked it on a real phone.',
    ],
  },

  testing: {
    objectives: [
      'Run a release checklist by hand before every launch.',
      'Write browser tests with Playwright for load, reveals and reduced motion.',
      'Add an automated accessibility audit with axe, and check the keyboard by hand.',
      'Catch visual changes with screenshot comparisons, and test on real devices.',
    ],
    ai: {
      intro: 'AI writes tests quickly, including tests that always pass. Ask it to show you each test failing before it passes.',
      prompts: [
        {
          label: 'Set up Playwright',
          text: 'Read {rules}. Set up Playwright for the site for [subject] with a desktop and a Pixel 7 project and a webServer that serves the folder on port 3000. Add three tests: no console errors on load; every .reveal element gets the in class once scrolled to; with reduced motion, reveals have no transform. Run them and show me the output.',
        },
        {
          label: 'Prove the test can fail',
          text: 'For each test you wrote, break the page on purpose so that test fails, run it, show me the failure, then undo the break. If a test cannot fail, rewrite it.',
        },
      ],
    },
    exercises: [
      {
        title: 'A test that cannot fail',
        task: "What is wrong with `expect(await page.locator('.reveal').count()).toBeGreaterThanOrEqual(0)`?",
        hint: 'can a count ever be negative?',
        solution: 'It always passes, so it proves nothing. Test the behaviour instead: scroll each reveal into view and expect it to have the `in` class.',
      },
      {
        title: 'What axe cannot see',
        task: 'Name two accessibility problems that an automated audit will not find on a scroll site.',
        hint: 'think about order and movement.',
        solution:
          'For example: a pinned section that traps keyboard focus, a focus order that jumps around the page, motion that is too fast or too large, and text that reads in the wrong order to a screen reader. They need a keyboard and a screen reader.',
      },
      {
        title: 'Stable screenshots',
        task: 'Your screenshot test fails on every run although nothing changed. Why?',
        hint: 'what on the page moves by itself?',
        solution:
          "Animations, a marquee, a particle canvas or a date. Use `animations: 'disabled'`, hide or mask moving parts with the `mask` option, and wait for fonts before taking the picture.",
      },
    ],
    project: {
      intro: 'Make the site for [subject] check itself, so later changes cannot quietly break it.',
      steps: [
        'Go through the release checklist at the top of this chapter.',
        'Run “Set up Playwright”, then “Prove the test can fail”.',
        'Add the axe test, and a screenshot test of the hero with animations disabled.',
        'Test on an iPhone and an Android phone, with the keyboard and with reduced motion.',
      ],
    },
    testing: {
      checks: [
        '`npx playwright test` passes on desktop and phone.',
        'Each test fails when the behaviour it checks is broken on purpose.',
        'The axe test reports no violations.',
        'The screenshot test passes twice in a row without changes.',
      ],
    },
    criteria: [
      'The release checklist is complete.',
      'My site has Playwright tests for load, reveals and reduced motion, and I have seen each one fail.',
      'It passes an axe audit and a keyboard check by hand.',
      'I tested it on two real phones.',
    ],
  },

  launch: {
    objectives: [
      'Publish a static site or a Next.js app, with preview deployments for every branch.',
      'Connect a domain and add the metadata for search results and shared links.',
      'Run lint, the build and the tests automatically on every push.',
      'Look after the site once it is live: errors, updates and repeat checks.',
    ],
    ai: {
      intro: 'Let the AI write configuration, but publish and connect domains yourself: those steps touch accounts and cost money.',
      prompts: [
        {
          label: 'Metadata',
          text: 'Read {rules}. Add the head metadata for the site for [subject]: title, description, canonical URL, Open Graph title, description and image, and the Twitter card. Use only text from brief.md. Also add a sitemap.xml and a robots.txt that points to it. Show me the changes.',
        },
        {
          label: 'CI workflow',
          text: 'Write .github/workflows/ci.yml that runs on every push and pull request: install with npm ci, lint, build, install Playwright with Chromium and run the tests. Pin the action versions. Explain each step in one line.',
        },
      ],
    },
    exercises: [
      {
        title: 'Preview before production',
        task: 'Push a branch with a visible change. Find its preview address and check it before you merge.',
        hint: 'the host comments the preview link on the pull request, or lists it in the dashboard.',
        solution:
          'Every branch gets its own address, so you can check a change on a real phone before it reaches visitors. Merge only after the preview passes the checklist.',
      },
      {
        title: 'Check the shared card',
        task: 'Paste your site’s address into a messaging app or a social post draft. Does the card show the right title, text and image?',
        hint: 'the card reads the Open Graph tags.',
        solution:
          'If the image is missing, the `og:image` URL is probably relative or the image is too small. Use an absolute URL and an image of about 1200 by 630 pixels.',
      },
      {
        title: 'Break the build on purpose',
        task: 'Push a commit with a lint error to a branch. What does CI do?',
        hint: 'look at the checks on the pull request.',
        solution:
          'The workflow fails at the lint step and the pull request shows a red check, so the change cannot be merged unnoticed. Fix it and push again.',
      },
    ],
    project: {
      intro: 'Put the site for [subject] online, and set it up to stay healthy.',
      steps: [
        'Publish the folder on a static host, or the app on Vercel, from a Git repository.',
        'Run “Metadata”, deploy, and check the shared card.',
        'Run “CI workflow”, push, and confirm the checks pass.',
        'Connect a domain if you have one, and write a monthly maintenance note in `notes.md`.',
      ],
    },
    testing: {
      checks: [
        'The live address loads over HTTPS with no console errors.',
        'A shared link shows the right title, text and image.',
        '`/sitemap.xml` and `/robots.txt` load.',
        'A push runs CI, and a failing change shows a red check.',
      ],
    },
    criteria: [
      'My site is live at a public HTTPS address.',
      'It has complete metadata, a sitemap and a robots file.',
      'CI runs lint, the build and the tests on every push.',
      'I have a written plan for updates and checks after launch.',
    ],
  },

  reference: {
    objectives: [
      'Find the likely cause of a common scroll fault from its symptom.',
      'Apply the fix, then confirm it with the same check that showed the fault.',
      'Look up the terms used across the course.',
    ],
  },
};
