/** The prompt library on the Build page. Also indexed by search. */
export type Prompt = { topic: string; text: string };

export const prompts: Prompt[] = [
  {
    topic: 'Brief',
    text: 'I want a minimalist cinematic scroll site about [subject] for [audience]. The visitor should finish by [one action]. List the sections you propose, one line each, and wait for my approval before writing code.',
  },
  { topic: 'Brief', text: 'Ask me up to five questions that would change the design. Skip anything you can decide sensibly yourself.' },
  {
    topic: 'Structure',
    text: 'Create index.html, style.css and app.js using plain HTML, CSS and JavaScript, no framework. Include a hero, three content sections, one call to action and a short footer.',
  },
  { topic: 'Structure', text: 'Use a black background, one accent colour and one pair of Google Fonts. Define every colour as a CSS custom property.' },
  {
    topic: 'Smooth scroll',
    text: 'Add Lenis smooth scrolling from the jsDelivr CDN, driven by requestAnimationFrame. Do not start it when prefers-reduced-motion is set.',
  },
  { topic: 'Smooth scroll', text: 'The page feels heavy under the mouse wheel. Reduce the Lenis duration and tell me which values you changed.' },
  {
    topic: 'Reveals',
    text: 'Reveal each section once when it enters the viewport: opacity and a 24 px rise, staggered by 80 ms among siblings. Never hide content again on scroll up.',
  },
  { topic: 'Reveals', text: 'Some elements stay invisible. Find every .reveal that never receives the visible class and explain why.' },
  { topic: 'Parallax', text: 'Give the hero three background layers with data-speed values 0.2, 0.35 and 0.5. Stop updating after 1.3 viewport heights.' },
  {
    topic: 'Parallax',
    text: 'On a 375 px wide screen the parallax pushes the hero copy off screen. Reduce the offset under 768 px instead of removing the effect.',
  },
  {
    topic: 'Pinned section',
    text: 'Turn the six feature cards into one pinned horizontal scroll section. Set the wrapper height from the track width, after fonts load and on resize.',
  },
  {
    topic: 'Scrollytelling',
    text: 'Build a scrollytelling section with a sticky visual on the left that changes with the active step, and four text steps on the right. Stack them under 900 px with the visual sticky at the top.',
  },
  { topic: 'Scroll driven', text: 'Light up the words of the headline one by one as the section scrolls, using a pinned section 240vh tall.' },
  { topic: 'Zoom', text: 'Scale the image from 1 to 1.5 while it crosses the viewport. Use transform only.' },
  {
    topic: '3D',
    text: 'Add a Three.js particle hero from the cdnjs build pinned to an exact version. Sample the points from an image drawn to a canvas. Pause rendering when the hero is off screen.',
  },
  {
    topic: '3D',
    text: 'Cap the pixel ratio at 2 and halve the particle count under 768 px. Report the frame rate you measured, or say you could not measure it.',
  },
  { topic: 'Mobile', text: 'Add an iOS-style bottom tab bar under 760 px with safe-area padding and a sliding highlight. Hide the top menu there.' },
  {
    topic: 'Accessibility',
    text: 'Add a skip link, visible focus styles and aria-current on the active menu item. Check that every control works with the keyboard.',
  },
  { topic: 'Accessibility', text: 'Make prefers-reduced-motion switch off parallax, reveal movement and smooth scrolling together, not just one of them.' },
  {
    topic: 'Performance',
    text: 'List the three heaviest things on the page by transfer size and by main-thread time. Fix the heaviest one and measure again.',
  },
  {
    topic: 'Review',
    text: 'Act as a strict art director. Score the page 1 to 10 for hierarchy, pacing and mobile readability, list the three worst problems, fix them, and score again.',
  },
  { topic: 'Review', text: 'Take screenshots at 375, 768 and 1440 px and describe anything overlapping, clipped or unreadable.' },
  {
    topic: 'Content',
    text: 'Replace placeholder copy with concrete sentences. Do not invent statistics, customers or quotes. Mark anything illustrative as an example.',
  },
  { topic: 'Publish', text: 'Check that every asset path is relative, then give me the exact steps to publish this folder as a static site.' },
];
