/** Cadrul de lecție pentru fiecare capitol, în română. Aceeași formă ca en.mjs (vezi types.ts). */
export const ro = {
  start: {
    objectives: [
      'Alegi între Claude Code, Gemini CLI și Codex potrivit situației tale.',
      'Instalezi unealta și verifici că pornește din terminal.',
      'Creezi un folder de proiect și îl servești la o adresă locală.',
      'Pornești AI-ul în folder, ca să poată citi și edita fișierele.',
    ],
    ai: {
      intro: 'Prima sesiune. Lasă unealta să se uite în jur înainte să scrie ceva și pune-o să ceară voie înaintea fiecărei schimbări.',
      prompts: [
        {
          label: 'Orientează-te',
          text: 'Uită-te în acest folder și spune-mi ce conține. Nu crea și nu modifica încă niciun fișier. Apoi spune-mi comanda cu care l-ai servi local pe portul 8000 și așteaptă răspunsul meu.',
        },
        {
          label: 'Verifică structura',
          text: 'Verifică dacă există index.html, style.css și app.js și dacă sunt legate: index.html încarcă style.css în head și app.js cu defer. Dacă lipsește ceva, arată-mi schimbarea înainte să o faci.',
        },
      ],
    },
    exercises: [
      {
        title: 'Două terminale',
        task: 'Ține serverul local pornit într-un terminal și AI-ul în al doilea, amândouă în folderul proiectului. Închide-le pe amândouă, apoi deschide-le din nou de la zero.',
        hint: 'fiecare terminal are nevoie de propriul `cd` în folder.',
        solution:
          'Serverul trebuie să meargă tot timpul cât lucrezi; dacă îl oprești cu Ctrl C, http://localhost:8000 nu mai răspunde. AI-ul rulează în celălalt terminal, pornit din același folder.',
        code: {
          lang: 'bash',
          code: '# terminalul 1\ncd cinematic-site\npython3 -m http.server 8000\n\n# terminalul 2\ncd cinematic-site\nclaude    # sau gemini, sau codex',
        },
      },
      {
        title: 'De ce nu file://',
        task: 'Deschide index.html cu dublu clic, apoi prin http://localhost:8000. Compară bara de adresă în cele două cazuri.',
        hint: 'uită-te cum începe fiecare adresă.',
        solution:
          'Dublul clic deschide `file:///…`; prin server, adresa începe cu `http://localhost:8000`. Modulele ES, fetch și mai multe funcții ale browserului merg doar prin http, de aceea fiecare pas din curs folosește serverul.',
      },
      {
        title: 'Notează versiunile',
        task: 'Notează versiunea de Node.js și pe cea a uneltei AI. Îți vor trebui când ceva se poartă altfel decât în curs.',
        hint: 'fiecare unealtă are opțiunea `--version`.',
        solution:
          'Păstrează rezultatul într-un fișier de notițe din proiect. Când o comandă din curs nu merge, versiunea e primul lucru de comparat cu documentația oficială.',
        code: { lang: 'bash', code: 'node --version\nclaude --version    # sau: gemini --version, codex --version' },
      },
    ],
    project: {
      intro:
        'De-a lungul cursului construiești un singur site cinematic de o pagină pentru [subiect]. Fiecare capitol adaugă un pas. Acesta pregătește folderul.',
      steps: [
        'Creează folderul `cinematic-site` cu `index.html`, `style.css` și `app.js`.',
        'Copiază pagina de pornire de mai jos în `index.html` și schimbă titlul în [subiect].',
        'Servește folderul și deschide http://localhost:8000.',
        'Pornește AI-ul în folder și rulează promptul „Orientează-te”.',
      ],
      code: {
        lang: 'index.html',
        code: '<!doctype html>\n<html lang="ro">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>Site-ul meu cinematic</title>\n  <link rel="stylesheet" href="style.css">\n  <script src="app.js" defer></script>\n</head>\n<body>\n  <h1>Salut</h1>\n</body>\n</html>',
      },
    },
    testing: {
      checks: [
        'http://localhost:8000 arată titlul „Salut”.',
        'În DevTools, tab-ul Network arată `style.css` și `app.js` încărcate cu statusul 200.',
        'Consola e goală.',
        'AI-ul a răspuns la promptul de orientare cu cele trei nume de fișiere și n-a schimbat nimic.',
      ],
    },
    criteria: [
      'Unealta AI pornește din terminal și își arată versiunea.',
      'Folderul proiectului are index.html, style.css și app.js.',
      'Pagina e servită de la http://localhost, nu deschisă ca fișier.',
      'Pornesc AI-ul din interiorul folderului proiectului.',
    ],
  },

  skills: {
    objectives: [
      'Explici ce e un skill și cum descrierea lui decide când se încarcă.',
      'Găsești skilluri din surse de încredere și judeci unul înainte să-l instalezi.',
      'Instalezi un skill pentru unealta ta și verifici că se încarcă.',
      'Scrii un skill mic al tău, cu un fișier `SKILL.md`.',
    ],
    ai: {
      intro: 'Întreabă unealta ce știe deja, apoi las-o să-ți scrie primul skill, cât timp tu verifici fișierul.',
      prompts: [
        {
          label: 'Ce skilluri sunt încărcate',
          text: 'Listează skillurile pe care le poți folosi în această sesiune, cu un rând despre când se încarcă fiecare. Nu rula niciunul.',
        },
        {
          label: 'Scrie un skill',
          text: 'Creează un skill numit scroll-motion-rules în {skills}. SKILL.md are nevoie de un nume și de o descriere care spune că se aplică atunci când construiești sau verifici animații de scroll. Corpul listează regulile: animezi doar transform și opacity; fiecare efect are o variantă statică sub prefers-reduced-motion; ascunzi conținut doar sub o clasă .js; aparițiile urcă 24px în 0,6s cu cubic-bezier(.2,.7,.2,1), o singură dată. Arată-mi fișierul înainte să-l salvezi.',
        },
      ],
    },
    exercises: [
      {
        title: 'Rescrie o descriere',
        task: 'Deschide `SKILL.md` al unui skill instalat. Rescrie-i descrierea ca o singură propoziție care spune ce face și când trebuie să se încarce.',
        hint: 'modelul citește doar descrierea ca să decidă dacă deschide restul.',
        solution:
          'O descriere bună numește sarcina și cuvintele pe care le-ar folosi un om, de exemplu: „Construiește animații de scroll minimaliste. Folosește-l când adaugi apariții, parallax, secțiuni fixate sau scroll lin într-o pagină web.”',
      },
      {
        title: 'Fă-l să se încarce',
        task: 'Cere AI-ului o animație de apariție fără să-ți numești skillul. Verifică dacă a urmat regulile tale.',
        hint: 'dacă nu, descrierea probabil nu se potrivește cu felul în care ai cerut.',
        solution:
          'Întreabă „Ce skilluri ai folosit pentru asta?”. Dacă al tău lipsește, adaugă în descriere cuvintele pe care le-ai folosit de fapt (apariție, scroll, animație) și încearcă din nou într-o sesiune nouă.',
      },
      {
        title: 'Verifică înainte să instalezi',
        task: 'Alege un skill de la altcineva. Înainte să-l instalezi, citește fiecare fișier din folderul lui și notează orice n-ai vrea să facă.',
        hint: 'nu te opri la SKILL.md: contează și scripturile, și fișierele de referință.',
        solution:
          'Caută scripturi care rulează comenzi, cereri în rețea și instrucțiuni care n-au legătură cu descrierea. Un skill rulează cu permisiunile uneltei tale, așa că instalează doar ce ai citit și ai înțeles.',
      },
    ],
    project: {
      intro: 'Dă proiectului cursului propriile reguli de mișcare, ca fiecare pas de mai târziu să le urmeze fără să i le amintești.',
      steps: [
        'Instalează un skill de design din secțiunea 04 pentru unealta ta.',
        'Adaugă în proiect propriul skill `scroll-motion-rules`, cu fișierul de mai jos.',
        'Întreabă AI-ul ce skilluri ar folosi ca să construiască hero-ul pentru [subiect] și păstrează răspunsul în `notes.md`.',
      ],
      code: {
        lang: 'SKILL.md',
        code: '---\nname: scroll-motion-rules\ndescription: Reguli pentru animațiile de scroll din acest site. Folosește-l când adaugi sau verifici apariții, parallax, secțiuni fixate sau scroll lin.\n---\n\n# Reguli de mișcare la scroll\n\n- Animezi doar transform și opacity.\n- Fiecare efect are o variantă statică sub prefers-reduced-motion.\n- Ascunzi conținut doar sub o clasă .js, ca nimic să nu se piardă dacă un script pică.\n- Aparițiile urcă 24px în 0,6s cu cubic-bezier(.2, .7, .2, 1), o singură dată.',
      },
    },
    testing: {
      checks: [
        'Folderul skillului conține un `SKILL.md` cu nume și descriere în frontmatter.',
        'Întrebat ce skilluri poate folosi, AI-ul numește `scroll-motion-rules`.',
        'O apariție scrisă de el animă doar transform și opacity și are o regulă pentru mișcare redusă.',
      ],
    },
    criteria: [
      'Pot spune într-o propoziție când se încarcă un skill.',
      'Cel puțin un skill e instalat și recunoscut de unealta mea.',
      'Skillul meu are un SKILL.md valid și e folosit când trebuie.',
      'Am citit fiecare fișier al unui skill străin înainte să-l instalez.',
    ],
  },

  prompting: {
    objectives: [
      'Scrii un brief în cinci părți: rezultat, fapte, limite, format și dovezi.',
      'Transformi o cerere vagă într-una precisă.',
      'Păstrezi regulile care nu se schimbă într-un fișier de reguli al proiectului.',
      'Conduci o sesiune: un plan înainte de cod, o schimbare o dată și o cale de întoarcere.',
    ],
    ai: {
      intro:
        'Două prompturi pe care le vei folosi tot restul cursului: unul care pune AI-ul să planifice înainte să scrie cod și unul care îl pune să-și caute singur greșelile.',
      prompts: [
        {
          label: 'Plan înainte de cod',
          text: 'Citește {rules} și brief.md. Nu scrie încă cod. Dă-mi un plan numerotat pentru secțiunea hero a site-ului pentru [subiect]: fișierele pe care le schimbi, ce face fiecare schimbare și cum o pot verifica în browser. Așteaptă aprobarea mea.',
        },
        {
          label: 'Verifică sceptic',
          text: 'Verifică ultima ta schimbare ca un programator front-end senior și sceptic. Listează ce s-ar putea strica pe telefon, cu mișcare redusă și doar cu tastatura. Nu repara încă nimic.',
        },
      ],
    },
    exercises: [
      {
        title: 'Rescrie un brief vag',
        task: 'Rescrie „Fă-mi un site mișto cu animații.” ca un brief în cinci părți pentru [subiect].',
        hint: 'treci prin rezultat, fapte, limite, format și dovezi, în această ordine.',
        solution: 'Compară-l pe al tău cu acesta. Fiecare parte răspunde la o întrebare la care altfel AI-ul ar ghici.',
        code: {
          lang: 'Prompt',
          code: 'Rezultat: un site cinematic de o pagină pentru [subiect], pentru [public], care se încheie cu o singură acțiune: [o acțiune].\nFapte: cinci secțiuni în această ordine: hero, poveste, trei funcții, un moment de produs fixat, îndemnul final. Folosește doar textul pe care ți-l dau.\nLimite: HTML, CSS și JavaScript simplu, în trei fișiere. Animezi doar transform și opacity. Fiecare efect are o variantă statică sub prefers-reduced-motion. Fără cifre, citate sau logouri inventate.\nFormat: cele trei fișiere complete, apoi o listă cu ce s-a schimbat.\nDovezi: listează fiecare verificare pe care ai rulat-o, cu lățimea sau unealta, și fiecare verificare pe care n-ai putut-o rula.',
        },
      },
      {
        title: 'Găsește partea lipsă',
        task: 'Acest brief nu are limite: „Construiește un site de o pagină pentru [subiect], cu o secțiune de produs fixată și un link de contact. Răspunde cu cele trei fișiere.” Adaugă-le.',
        hint: 'limitele sunt ce nu are voie AI-ul să facă sau să folosească.',
        solution:
          'De exemplu: HTML, CSS și JavaScript simplu; nicio bibliotecă în afară de Lenis; animezi doar transform și opacity; respecți mișcarea redusă; nimic ascuns fără o clasă .js; fără cifre, citate sau logouri inventate.',
      },
      {
        title: 'Cere dovezi',
        task: 'Scrie propoziția care pune AI-ul să-și dovedească munca, în loc să spună „testat”.',
        hint: 'cere și ce a rulat, și ce n-a rulat.',
        solution:
          '„Listează fiecare verificare pe care ai rulat-o de fapt, cu lățimea sau unealta folosită, și fiecare verificare pe care n-ai putut-o rula și de ce.” Apoi deschide pagina și uită-te la verificările pe care nu le-a putut rula.',
      },
    ],
    project: {
      intro: 'Înainte de orice cod, scrie ce este site-ul și regulile care nu se schimbă.',
      steps: [
        'Scrie `brief.md` cu cele cinci părți pentru [subiect], după șablonul de mai jos.',
        'Creează fișierul de reguli în rădăcina proiectului (CLAUDE.md, GEMINI.md sau AGENTS.md), cu limitele din brief.',
        'Rulează „Plan înainte de cod” și salvează planul primit ca `plan.md`.',
        'Rulează `git init` și fă un commit, ca fiecare pas de mai târziu să aibă o cale de întoarcere.',
      ],
      code: {
        lang: 'brief.md',
        code: '# Brief: [subiect]\n\nRezultat: un site cinematic de o pagină pentru [subiect], pentru [public].\nPagina se încheie cu o singură acțiune: [o acțiune].\n\nFapte: nume, cifre reale, citate reale și secțiunile în ordine.\n\nLimite: HTML, CSS și JavaScript simplu, în trei fișiere. Animezi doar\ntransform și opacity. Fiecare efect are o variantă statică sub\nprefers-reduced-motion. Fără cifre, citate sau logouri inventate.\n\nFormat: cele trei fișiere complete, apoi o listă cu ce s-a schimbat.\n\nDovezi: fiecare verificare rulată, cu lățimea sau unealta, și fiecare\nverificare care n-a putut fi rulată.',
      },
    },
    testing: {
      checks: [
        '`brief.md` are toate cele cinci părți și niciuna nu spune „de completat”.',
        'Întrebat „Ce reguli se aplică în acest proiect?”, AI-ul citează fișierul tău de reguli.',
        'Planul numește fișierele și o verificare pentru fiecare pas, iar niciun fișier nu s-a schimbat înainte să-l aprobi.',
        '`git log` arată un prim commit.',
      ],
    },
    criteria: [
      'Brieful meu numește rezultatul, faptele, limitele, formatul și dovezile.',
      'Fișierul de reguli există, iar AI-ul îl urmează fără să i-l amintesc.',
      'Am cerut un plan înainte de cod și l-am aprobat înaintea oricărei schimbări.',
      'Pot anula ultima schimbare cu git.',
    ],
  },

  build: {
    objectives: [
      'Rulezi aceeași buclă la fiecare pas: brief, generare, inspectare, rafinare.',
      'Construiești pagina în zece pași mici, nu într-o singură cerere mare.',
      'Adaugi scroll lin, apariții, adâncime și un moment fixat, toate cu respect pentru mișcarea redusă.',
      'Verifici pagina terminată pe telefon și cu tastatura.',
    ],
    ai: {
      intro: 'Un prompt pentru fiecare pas ține fiecare schimbare destul de mică încât s-o poți verifica. Promptul de la final se uită la pagină ca întreg.',
      prompts: [
        {
          label: 'Un pas',
          text: 'Citește {rules}, brief.md și plan.md. Fă doar pasul [număr]: [pasul]. Schimbă cât mai puține rânduri, apoi spune-mi exact cum îl verific în browser și ce n-ai verificat.',
        },
        {
          label: 'Verificare de art director',
          text: 'Comportă-te ca un art director. Uită-te la pagină la 375 și la 1440 de pixeli lățime și listează cele cinci schimbări care ar face-o mai calmă și mai gândită, în ordinea impactului. Nu schimba încă nimic.',
        },
      ],
    },
    exercises: [
      {
        title: 'Împarte un pas',
        task: 'Împarte „Adaugă o secțiune de produs fixată, cu trei funcții” în schimbări destul de mici ca să le verifici pe rând.',
        hint: 'markup, layout, comportament, apoi variantele statică și de telefon.',
        solution:
          '1. Markup-ul secțiunii și al celor trei funcții. 2. Layout-ul sticky. 3. Scriptul care alege funcția activă. 4. Varianta pentru mișcare redusă, în care funcțiile stau una sub alta. 5. Layout-ul de telefon. Verifici și faci commit după fiecare.',
      },
      {
        title: 'Găsește sacadarea',
        task: 'În Chrome DevTools, înregistrează un profil Performance în timp ce derulezi hero-ul. Găsește ce rulează la fiecare cadru.',
        hint: 'blocurile lungi galbene sunt JavaScript, cele mov sunt layout.',
        solution:
          'Un parallax care schimbă `top` sau `margin` forțează layout la fiecare cadru. Mută-l cu `transform: translate3d()`, citește poziția scrollului o singură dată pe cadru și oprește calculul când hero-ul a ieșit din ecran.',
      },
      {
        title: 'Varianta statică',
        task: 'Pornește mișcarea redusă din setările sistemului și derulează toată pagina.',
        hint: 'macOS: Accesibilitate, Afișaj. Windows: Accesibilitate, Efecte vizuale, Efecte de animație oprite.',
        solution:
          'Scrollul lin se oprește, straturile parallax stau pe loc, aparițiile se arată fără să se miște, iar secțiunea fixată se citește ca o listă obișnuită. Tot ce încă se mișcă are nevoie de propria regulă `prefers-reduced-motion`.',
      },
    ],
    project: {
      intro: 'Acum proiectul cursului primește pagina. Parcurge cei zece pași din acest capitol pentru [subiect], câte un prompt pentru fiecare.',
      steps: [
        'Rulează cei zece pași cu promptul „Un pas” și verifică fiecare în browser înainte de următorul.',
        'Fă un commit după fiecare pas care trece verificarea.',
        'Încheie cu verificarea de art director și aplică primele două schimbări din clasament.',
      ],
      code: { lang: 'bash', code: 'git add -A\ngit commit -m "Pasul 4: apariție la scroll"' },
    },
    testing: {
      checks: [
        'Consola nu arată erori la 375, 768 și 1440 de pixeli lățime.',
        'Fiecare element cu clasa `reveal` e vizibil după ce ai trecut de el.',
        'Nimic nu se suprapune și nimic nu e tăiat la 375 de pixeli.',
        'Tab ajunge la fiecare link și buton, cu un contur de focus vizibil.',
        'Cu mișcarea redusă pornită, scrollul lin și parallaxul se opresc.',
      ],
      code: {
        lang: 'JavaScript',
        code: "// lipește în Consolă după ce ai derulat până jos:\n// listează fiecare apariție care nu s-a arătat (o listă goală înseamnă că trece)\n[...document.querySelectorAll('.reveal:not(.in)')].map((el) => el.textContent.trim().slice(0, 40));",
      },
    },
    criteria: [
      'Toți cei zece pași sunt în pagină, fiecare cu commitul lui.',
      'Nu sunt erori în consolă la 375, 768 și 1440 de pixeli.',
      'Totul se citește și merge cu mișcare redusă și doar cu tastatura.',
      'Am aplicat cel puțin două schimbări din verificarea de art director.',
    ],
  },
};
