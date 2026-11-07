import type { Locale } from './i18n';

/** The prompt library on the Build page, per language. Also indexed by search. */
export type Prompt = { topic: string; text: string };

const en: Prompt[] = [
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

const ro: Prompt[] = [
  {
    topic: 'Brief',
    text: 'Vreau un site minimalist cu scroll cinematic despre [subiect] pentru [public]. Vizitatorul ar trebui să termine prin [o acțiune]. Listează secțiunile pe care le propui, câte un rând fiecare, și așteaptă aprobarea mea înainte să scrii cod.',
  },
  { topic: 'Brief', text: 'Pune-mi până la cinci întrebări care ar schimba designul. Sari peste orice poți decide singur în mod rezonabil.' },
  {
    topic: 'Structură',
    text: 'Creează index.html, style.css și app.js cu HTML, CSS și JavaScript simple, fără framework. Include un hero, trei secțiuni de conținut, un îndemn la acțiune și un footer scurt.',
  },
  { topic: 'Structură', text: 'Folosește fundal negru, o singură culoare de accent și o pereche de fonturi Google. Definește fiecare culoare ca proprietate CSS personalizată.' },
  {
    topic: 'Scroll lin',
    text: 'Adaugă scroll lin cu Lenis de pe CDN-ul jsDelivr, condus de requestAnimationFrame. Nu îl porni când este setat prefers-reduced-motion.',
  },
  { topic: 'Scroll lin', text: 'Pagina pare grea la rotița mouse-ului. Redu durata Lenis și spune-mi ce valori ai schimbat.' },
  {
    topic: 'Apariții',
    text: 'Fă fiecare secțiune să apară o singură dată când intră în ecran: opacitate și o ridicare de 24 px, decalate cu 80 ms între elementele vecine. Nu ascunde niciodată conținutul la loc când derulezi în sus.',
  },
  { topic: 'Apariții', text: 'Unele elemente rămân invizibile. Găsește fiecare .reveal care nu primește niciodată clasa visible și explică de ce.' },
  { topic: 'Parallax', text: 'Dă hero-ului trei straturi de fundal cu valori data-speed de 0.2, 0.35 și 0.5. Oprește actualizarea după 1,3 înălțimi de ecran.' },
  {
    topic: 'Parallax',
    text: 'Pe un ecran lat de 375 px, parallaxul împinge textul hero-ului în afara ecranului. Redu deplasarea sub 768 px în loc să elimini efectul.',
  },
  {
    topic: 'Secțiune fixată',
    text: 'Transformă cele șase carduri cu funcții într-o singură secțiune fixată cu scroll orizontal. Setează înălțimea containerului din lățimea pistei, după încărcarea fonturilor și la redimensionare.',
  },
  {
    topic: 'Scrollytelling',
    text: 'Construiește o secțiune de scrollytelling cu o imagine fixă în stânga care se schimbă după pasul activ și patru pași de text în dreapta. Sub 900 px pune-le una sub alta, cu imaginea fixă sus.',
  },
  { topic: 'Condus de scroll', text: 'Aprinde cuvintele titlului unul câte unul pe măsură ce secțiunea derulează, folosind o secțiune fixată înaltă de 240vh.' },
  { topic: 'Zoom', text: 'Scalează imaginea de la 1 la 1,5 cât timp traversează ecranul. Folosește doar transform.' },
  {
    topic: '3D',
    text: 'Adaugă un hero cu particule Three.js din buildul cdnjs fixat pe o versiune exactă. Ia punctele dintr-o imagine desenată pe un canvas. Oprește randarea când hero-ul nu e pe ecran.',
  },
  {
    topic: '3D',
    text: 'Limitează pixel ratio la 2 și înjumătățește numărul de particule sub 768 px. Raportează frame rate-ul măsurat sau spune că nu l-ai putut măsura.',
  },
  { topic: 'Mobil', text: 'Adaugă sub 760 px o bară de taburi jos în stil iOS, cu spațiere pentru safe area și un indicator care alunecă. Ascunde acolo meniul de sus.' },
  {
    topic: 'Accesibilitate',
    text: 'Adaugă un link de salt la conținut, stiluri de focus vizibile și aria-current pe elementul de meniu activ. Verifică că fiecare control merge de la tastatură.',
  },
  { topic: 'Accesibilitate', text: 'Fă ca prefers-reduced-motion să oprească împreună parallaxul, mișcarea aparițiilor și scrollul lin, nu doar unul dintre ele.' },
  {
    topic: 'Performanță',
    text: 'Listează cele mai grele trei lucruri din pagină după dimensiunea transferată și după timpul pe firul principal. Repară-l pe cel mai greu și măsoară din nou.',
  },
  {
    topic: 'Verificare',
    text: 'Fii un director artistic exigent. Notează pagina de la 1 la 10 pentru ierarhie, ritm și lizibilitate pe mobil, listează cele mai grave trei probleme, repară-le și notează din nou.',
  },
  { topic: 'Verificare', text: 'Fă capturi de ecran la 375, 768 și 1440 px și descrie orice se suprapune, e tăiat sau nu se poate citi.' },
  {
    topic: 'Conținut',
    text: 'Înlocuiește textul provizoriu cu propoziții concrete. Nu inventa statistici, clienți sau citate. Marchează orice text ilustrativ ca exemplu.',
  },
  { topic: 'Publicare', text: 'Verifică dacă fiecare cale către fișiere este relativă, apoi dă-mi pașii exacți ca să public acest folder ca site static.' },
];

export const prompts: Record<Locale, Prompt[]> = { en, ro };
