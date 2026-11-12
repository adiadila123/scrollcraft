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

  motion: {
    objectives: [
      'Numești cele nouă tehnici de scroll și spui la ce folosește fiecare.',
      'Alegi o tehnică după rolul ei în poveste, nu după cât de spectaculoasă pare.',
      'Construiești fiecare tehnică cu CSS și puțin JavaScript, cu o variantă statică sub mișcare redusă.',
      'Combini două-trei tehnici pe o pagină fără să se bată între ele.',
    ],
    ai: {
      intro: 'Cere o singură tehnică o dată, pe nume, cu limitele ei. Apoi pune AI-ul să explice codul, ca data viitoare să-l poți schimba singur.',
      prompts: [
        {
          label: 'Adaugă o tehnică',
          text: 'Citește {rules}. Adaugă un tur de produs sticky în site-ul pentru [subiect]: dispozitivul rămâne fixat cât trei funcții trec prin dreptul lui, iar funcția activă e ultima al cărei titlu a trecut de 55% din înălțimea ecranului. CSS și JavaScript simplu, un singur listener de scroll, doar transform și opacity. Sub prefers-reduced-motion, funcțiile stau una sub alta. Arată-mi întâi planul.',
        },
        {
          label: 'Explică-mi înapoi',
          text: 'Explică-mi rând cu rând codul pe care tocmai l-ai scris, ca și cum îl voi întreține singur: ce rulează la fiecare cadru, ce rulează o singură dată și ce aș schimba ca efectul să fie mai lent sau mai calm.',
        },
      ],
    },
    exercises: [
      {
        title: 'Potrivește tehnica cu rolul',
        task: 'Alege câte o tehnică pentru fiecare rol: o etichetă rămâne vizibilă cât îi citești secțiunea; arăți o cronologie lungă; un citat apare o singură dată; spui povestea unui produs în trei momente.',
        hint: 'patru dintre cele nouă tehnici răspund exact.',
        solution:
          'Sticky pentru etichetă; scroll orizontal pentru cronologie; apariție la scroll pentru citat; scrollytelling (sau un tur de produs sticky) pentru cele trei momente.',
      },
      {
        title: 'Fără JavaScript',
        task: 'Demo-ul cu poziționare sticky nu folosește JavaScript. Ce altă tehnică din capitol se poate construi doar cu CSS în browserele actuale?',
        hint: 'uită-te la demo-ul scroll driven și la scroll snap.',
        solution:
          'Scroll snap e doar CSS. Și progresul condus de scroll poate fi CSS, cu `animation-timeline: scroll()`; păstrează o variantă în JavaScript pentru browserele care încă nu-l suportă.',
        code: {
          lang: 'CSS',
          code: '.progress {\n  transform-origin: 0 50%;\n  animation: grow linear both;\n  animation-timeline: scroll(root);\n}\n@keyframes grow { from { transform: scaleX(0); } }',
        },
      },
      {
        title: 'Unul în plus',
        task: 'Un hero are straturi parallax, zoom la scroll, un titlu împărțit pe rânduri și un marquee după viteza scrollului. Scoate efectele care se bat între ele și păstrează pagina cinematică.',
        hint: 'fiecare ecran ar trebui condus de un singur efect.',
        solution:
          'Păstrează titlul împărțit ca primă impresie și un singur efect de adâncime, parallax sau zoom, nu amândouă. Mută marquee-ul mai jos în pagină, unde are ecranul doar pentru el.',
      },
    ],
    project: {
      intro:
        'Dă site-ului pentru [subiect] momentele lui de semnătură. Alege două rețete din secțiunea 02 care se potrivesc poveștii și construiește-le pe rând.',
      steps: [
        'Alege două rețete și scrie în `notes.md` de ce servește fiecare povestea.',
        'Adaugă-o pe prima cu promptul „Adaugă o tehnică”, verific-o, fă commit.',
        'Adaug-o pe a doua, verifică să nu se bată cu prima pe același ecran, fă commit.',
        'Rulează „Explică-mi înapoi” pentru amândouă și păstrează răspunsurile lângă cod, ca comentarii.',
      ],
    },
    testing: {
      checks: [
        'Fiecare efect nou rulează cu cadre constante cât derulezi: fără sarcini lungi în panoul Performance.',
        'Cu mișcarea redusă pornită, fiecare efect are o variantă statică care tot spune povestea.',
        'La 375 de pixeli lățime nimic nu se suprapune, iar secțiunile fixate încap în ecran.',
        'Derularea cu tastatura (Space, Page Down, săgeți) trece prin fiecare secțiune.',
      ],
    },
    criteria: [
      'Pot numi cele nouă tehnici și rolul fiecăreia.',
      'Site-ul meu are două tehnici alese pentru povestea lui, fiecare cu commitul ei.',
      'Fiecare efect are o variantă statică sub mișcare redusă.',
      'Pot explica ce face codul efectelor mele la fiecare cadru.',
    ],
  },

  playground: {
    objectives: [
      'Simți cum schimbă netezirea, viteza parallax, decalajul și easing-ul atmosfera unei pagini.',
      'Alegi valorile intenționat și le notezi ca decizii de design.',
      'Copiezi rândul exact de cod pe care îl produce fiecare setare.',
      'Păstrezi valorile de mișcare consecvente în tot site-ul.',
    ],
    ai: {
      intro: 'Laboratorul îți dă numere. Prompturile acestea le adună într-un singur loc în cod, ca tot site-ul să se miște cu același caracter.',
      prompts: [
        {
          label: 'Aplică valorile',
          text: 'Citește {rules}. Adună fiecare valoare de mișcare din site-ul pentru [subiect] într-un singur loc: lerp-ul Lenis, viteza parallax, decalajul aparițiilor și curba de easing, ca proprietăți CSS și un singur obiect JavaScript. Folosește valorile: lerp [valoare], viteză parallax [valoare], decalaj [valoare] ms, easing [cubic-bezier]. Înlocuiește numerele scrise direct și listează fiecare rând schimbat.',
        },
        {
          label: 'Găsește valorile rătăcite',
          text: 'Caută în CSS și JavaScript durate, întârzieri, curbe de easing și viteze care nu vin din valorile de mișcare comune. Listează-le pe fiecare, cu fișierul și rândul. Nu le schimba încă.',
        },
      ],
    },
    exercises: [
      {
        title: 'Calm sau viu',
        task: 'Găsește o valoare de netezire care se simte calmă și una care se simte vie. Notează-le pe amândouă, cu câte un cuvânt pentru senzație.',
        hint: 'un lerp mai mic urmărește rotița mai încet.',
        solution:
          'În jur de 0,06–0,08 se simte calm și greu; în jur de 0,12–0,15 se simte rapid și ușor. Valorile foarte mici fac pagina să pară că întârzie, iar asta se citește ca lag, nu ca liniște.',
      },
      {
        title: 'Adâncime fără amețeală',
        task: 'Setează viteza parallax astfel încât straturile să pară adânci, dar textul să nu plece niciodată departe de unde îl așteaptă cititorul.',
        hint: 'mișcă fundalul, nu cuvintele.',
        solution:
          'Ține straturile de text la viteza 1 (se mișcă odată cu pagina) și mișcă doar fundalul, cam la 0,6–0,8. Diferențele mari de viteză pe text îngreunează cititul și pot crea disconfort.',
      },
      {
        title: 'O singură curbă',
        task: 'Alege o singură curbă de easing pentru toate aparițiile din site și explică de ce se potrivește cu [subiect].',
        hint: 'un ease-out pornește repede și se așază.',
        solution:
          'Un ease-out puternic, precum `cubic-bezier(.2, .7, .2, 1)`, ajunge repede și se așază lin, ceea ce se citește ca sigur și calm. Folosește-l la toate aparițiile; păstrează timpul liniar pentru scenele derulate, unde scrollul e easing-ul.',
      },
    ],
    project: {
      intro: 'Transformă alegerile tale în setările de mișcare ale site-ului pentru [subiect], ca toate efectele să le împartă.',
      steps: [
        'Încearcă fiecare dintre cele patru experimente și notează valorile care îți plac.',
        'Adaugă valorile în `style.css` și `app.js` ca mai jos, apoi rulează „Aplică valorile”.',
        'Rulează „Găsește valorile rătăcite” și repară ce listează.',
      ],
      code: {
        lang: 'style.css',
        code: ':root {\n  /* mișcare: aleasă în laborator */\n  --reveal-duration: .9s;\n  --reveal-stagger: 80ms;\n  --ease-out: cubic-bezier(.2, .7, .2, 1);\n}\n\n/* app.js */\n/* const MOTION = { lerp: 0.09, parallax: 0.7, stagger: 80 }; */',
      },
    },
    testing: {
      checks: [
        'Fiecare durată, întârziere, easing și viteză din cod vine din valorile comune.',
        'Dacă schimbi `--reveal-duration` într-un singur loc, se schimbă fiecare apariție din pagină.',
        'Derularea cu rotița mouse-ului și cu trackpadul se simte lină în ambele cazuri, nici întârziată, nici sacadată.',
      ],
    },
    criteria: [
      'Am ales valori pentru netezire, parallax, decalaj și easing și pot spune de ce.',
      'Stau într-un singur loc în cod.',
      'Nicio valoare de mișcare din site nu e scrisă direct în afara acelui loc.',
    ],
  },

  gsap: {
    objectives: [
      'Pui în ordine mai multe mișcări cu un timeline GSAP și parametrul lui de poziție.',
      'Legi un timeline de scroll cu ScrollTrigger: scrub, fixare, puncte de început și de sfârșit.',
      'Desenezi linii SVG și dezvălui text împărțit pe rânduri cu pluginurile gratuite GSAP.',
      'Cureți în React cu `useGSAP` și respecți mișcarea redusă cu `gsap.matchMedia()`.',
    ],
    ai: {
      intro: 'Codul GSAP greșește în feluri previzibile: plugin neînregistrat, triggere măsurate prea devreme, nicio curățenie. Numește-le în prompt.',
      prompts: [
        {
          label: 'O scenă fixată',
          text: 'Citește {rules}. Adaugă o scenă fixată în site-ul pentru [subiect] cu GSAP 3.15.1 și ScrollTrigger de pe jsDelivr: secțiunea rămâne fixată pe 200% din înălțimea ecranului, cât trei pași își predau locul unul după altul, cu o linie de progres. Înregistrează pluginul, construiește totul în gsap.matchMedia ca nimic să nu se animeze sub prefers-reduced-motion (pașii stau unul sub altul) și apelează ScrollTrigger.refresh() după ce se încarcă imaginile. Arată-mi întâi planul.',
        },
        {
          label: 'Verifică triggerele',
          text: 'Pornește temporar markerele ScrollTrigger și spune-mi unde începe și unde se termină fiecare trigger la 375 și la 1440 de pixeli lățime. Apoi scoate markerele. Nu schimba nimic altceva.',
        },
      ],
    },
    exercises: [
      {
        title: 'Citește parametrul de poziție',
        task: 'În `tl.to(a, {…}).to(b, {…}, "-=0.4").to(c, {…}, "<")`, când pornește fiecare tween?',
        hint: '„<” se referă la începutul tween-ului anterior.',
        solution: '`a` pornește la 0. `b` pornește cu 0,4 secunde înainte să se termine `a`. `c` pornește în același moment cu `b`.',
      },
      {
        title: 'Scrub sau redare',
        task: 'Pentru un titlu care apare o singură dată și pentru un produs care se rotește cât derulezi, alege între `scrub` și `toggleActions`.',
        hint: 'animația urmează scrollul în ambele sensuri?',
        solution:
          'Titlul se redă o dată, cu `toggleActions: "play none none none"` (sau `once: true`). Produsul care se rotește folosește `scrub`, ca să meargă înainte și înapoi exact cu scrollul.',
      },
      {
        title: 'Curăță în React',
        task: 'O componentă creează un ScrollTrigger în `useEffect`, fără curățenie. Ce se întâmplă după ce pleci de pe pagină și revii de trei ori?',
        hint: 'nimic nu elimină triggerele vechi.',
        solution:
          'Există patru seturi de triggere, trei legate de elemente care nu mai există, așa că pozițiile sunt greșite și se muncește degeaba. Folosește `useGSAP` cu un `scope`, care anulează totul la demontare.',
        code: {
          lang: 'tsx',
          code: "useGSAP(() => {\n  gsap.from('.reveal', { y: 28, opacity: 0, scrollTrigger: { trigger: root.current, start: 'top 80%' } });\n}, { scope: root });",
        },
      },
    ],
    project: {
      intro: 'Dă site-ului pentru [subiect] o scenă pe care doar GSAP o face ușoară: o secvență fixată care spune o parte din poveste.',
      steps: [
        'Alege partea poveștii care are trei momente și scrie-le în `notes.md`.',
        'Rulează „O scenă fixată” și verific-o la trei lățimi.',
        'Rulează „Verifică triggerele” și ajustează începutul și sfârșitul dacă un pas apare prea devreme sau prea târziu.',
        'Fă commit, cu versiunea GSAP fixată în adresa scriptului.',
      ],
    },
    testing: {
      checks: [
        'Secțiunea se fixează și se eliberează fără salt sau gol la 375, 768 și 1440 de pixeli.',
        'Când derulezi înapoi, scena se redă exact invers.',
        'Cu mișcarea redusă pornită, nimic nu e fixat, iar cei trei pași se citesc ca o listă.',
        'Consola nu arată avertismente despre pluginuri sau ținte lipsă.',
      ],
    },
    criteria: [
      'Pot citi un timeline GSAP și pot spune când pornește fiecare tween.',
      'Site-ul meu are o scenă fixată construită cu ScrollTrigger în gsap.matchMedia.',
      'Scena e corectă la trei lățimi și la derularea înapoi.',
      'GSAP e încărcat dintr-o versiune fixă.',
    ],
  },

  webgl: {
    objectives: [
      'Pregătești o scenă three.js cu renderer, cameră, lumini și un obiect.',
      'Conduci o scenă cu poziția scrollului și desenezi doar când se schimbă ceva.',
      'Muți munca pe placa video cu shadere și atribute de buffer.',
      'Păstrezi WebGL rapid și sigur: limită de densitate, curățenie, mișcare redusă și variantă de rezervă.',
    ],
    ai: {
      intro:
        'Prompturile pentru WebGL au nevoie de limite mai mult decât oricare altele: AI-ul adaugă bucuros post-procesare și umbre pe care un telefon nu și le permite.',
      prompts: [
        {
          label: 'O scenă pentru hero',
          text: 'Citește {rules}. Adaugă o scenă three.js 0.187.0 în spatele hero-ului din site-ul pentru [subiect], încărcată ca modul ES printr-un import map de pe jsDelivr. Un obiect, două lumini, fără umbre, fără post-procesare. Poziția scrollului rotește obiectul și mută camera; desenează doar când se schimbă scrollul. Limitează densitatea la 2, creează rendererul într-un try și arată o imagine statică dacă lipsește WebGL, iar sub prefers-reduced-motion scena stă pe loc.',
        },
        {
          label: 'Verificare de performanță',
          text: 'Măsoară scena din hero: timpul pe cadru cât derulezi, numărul de desenări și memoria texturilor. Spune-mi singura schimbare care ar ajuta cel mai mult un telefon de gamă medie. Nu schimba încă nimic.',
        },
      ],
    },
    exercises: [
      {
        title: 'Desenează la nevoie',
        task: 'Scena desenează de 60 de ori pe secundă chiar și când pagina stă. Schimb-o să deseneze doar când se schimbă scrollul.',
        hint: 'cere un singur cadru din listenerul de scroll.',
        solution: 'Scoate bucla continuă și cere un singur cadru când se mișcă scrollul, ca placa video să stea cât cititorul citește.',
        code: {
          lang: 'JavaScript',
          code: "let queued = false;\nfunction render() {\n  queued = false;\n  mesh.rotation.y = scrollY * 0.002;\n  renderer.render(scene, camera);\n}\naddEventListener('scroll', () => {\n  if (!queued) { queued = true; requestAnimationFrame(render); }\n}, { passive: true });\nrender();",
        },
      },
      {
        title: 'Varianta de rezervă',
        task: 'Fă pagina lizibilă pe un calculator fără WebGL.',
        hint: 'constructorul rendererului aruncă o eroare când WebGL lipsește.',
        solution:
          'Creează rendererul într-un `try`; în `catch`, adaugă o clasă pe elementul html care ascunde canvasul și arată o imagine statică sau nimic. Textul nu trebuie să depindă niciodată de scenă.',
      },
      {
        title: 'Unde se duce costul',
        task: 'Un hero cu particule merge lin pe laptop și sacadează pe telefon. Listează trei schimbări, de la cea mai ieftină.',
        hint: 'pixeli, apoi puncte, apoi efecte.',
        solution:
          '1. Limitează densitatea mai jos (1,5 sau 1). 2. Folosește mai puține puncte pe ecrane mici. 3. Scoate trecerile în plus, precum bloom. Măsoară după fiecare schimbare.',
      },
    ],
    project: {
      intro: 'Dacă un moment 3D servește povestea pentru [subiect], adaugă unul. Dacă nu, sari peste pas: și reținerea e o decizie de design.',
      steps: [
        'Decide dacă hero-ul câștigă ceva din adâncime. Scrie motivul în `notes.md`.',
        'Dacă da, rulează „O scenă pentru hero”, apoi „Verificare de performanță”.',
        'Oprește WebGL în browser (sau testează pe un dispozitiv vechi) și verifică varianta de rezervă.',
        'Fă commit, cu versiunea three.js fixată în import map.',
      ],
    },
    testing: {
      checks: [
        'Scena desenează doar cât derulezi: panoul Performance e liniștit când pagina stă.',
        'Cu WebGL oprit, pagina se citește întreagă, fără erori.',
        'Cu mișcarea redusă pornită, scena nu se mișcă.',
        'Pe un telefon real, derularea peste hero nu sacadează și nu încălzește dispozitivul.',
      ],
    },
    criteria: [
      'Pot pregăti o scenă three.js și pot explica fiecare parte.',
      'Scena mea desenează la nevoie și limitează densitatea.',
      'Există o variantă fără WebGL și una statică sub mișcare redusă.',
      'Am decis intenționat dacă site-ul meu are nevoie de WebGL.',
    ],
  },

  examples: {
    objectives: [
      'Citești un site complet și recunoști tehnicile pe care le combină.',
      'Explici de ce fiecare exemplu pare cinematic: ritm, reținere și o singură buclă.',
      'Reconstruiești un exemplu pentru subiectul tău cu prompturile date.',
      'Înlocuiești materialele provizorii cu imagini, cadre sau un traseu reale.',
    ],
    ai: {
      intro: 'Folosește exemplele ca referințe, nu ca șabloane: cere AI-ului să-ți explice o tehnică dintr-unul, apoi adapteaz-o la structura ta.',
      prompts: [
        {
          label: 'Învață dintr-un exemplu',
          text: 'Iată cele trei fișiere ale exemplului Field Studio. Listează tehnicile pe care le folosește, unde stă fiecare în cod și bucla comună care le conduce. Apoi spune-mi care s-ar potrivi în site-ul pentru [subiect] și de ce.',
        },
        {
          label: 'Adaptează, nu copia',
          text: 'Citește {rules}. Adaugă dezvăluirea cu clip-path din exemplul Field Studio în secțiunile cu imagini din site-ul meu, folosind bucla de scroll și valorile de mișcare pe care le am deja, în loc să-i copiezi codul. Păstrează-mi markup-ul și numele claselor. Arată-mi întâi planul.',
        },
      ],
    },
    exercises: [
      {
        title: 'Găsește tehnicile',
        task: 'Derulează exemplul de lansare de produs și listează fiecare tehnică pe care o observi, înainte să-i citești analiza.',
        hint: 'urmărește titlul, dispozitivul, cuvintele și linia de progres.',
        solution:
          'Titlu dezvăluit rând cu rând, o secvență de cadre derulată cu subtitrări, cuvinte aprinse de scroll, un tur de produs sticky și o linie de progres. Compară cu „Tehnici folosite”.',
      },
      {
        title: 'Bucla comună',
        task: 'Deschide `app.js` din exemplul de portofoliu. Găsește funcția care rulează la scroll și listează ce actualizează.',
        hint: 'caută requestAnimationFrame.',
        solution:
          '`update()` rulează cel mult o dată pe cadru și actualizează dezvăluirile cu clip-path și galeria orizontală; marquee-ul are propria buclă, care se oprește sub mișcare redusă.',
      },
      {
        title: 'Scoate un lucru',
        task: 'Alege un exemplu și decide ce singur efect ai scoate ca să fie mai calm. Explică ce câștigă pagina.',
        hint: 'reținerea e unul dintre cele patru lucruri comune tuturor exemplelor.',
        solution:
          'Nu există un singur răspuns corect. Unul bun numește efectul, ecranul pe care se bate cu altceva și ce poate observa acum cititorul în schimb.',
      },
    ],
    project: {
      intro: 'Compară site-ul pentru [subiect] cu exemplul cel mai apropiat și împrumută corect o idee.',
      steps: [
        'Alege exemplul cel mai apropiat de site-ul tău și rulează „Învață dintr-un exemplu” cu fișierele lui.',
        'Rulează „Adaptează, nu copia” pentru o tehnică.',
        'Înlocuiește fiecare imagine sau cadru provizoriu din site cu materiale reale, comprimate.',
        'Verifică site-ul după cele patru lucruri comune tuturor exemplelor.',
      ],
    },
    testing: {
      checks: [
        'Tehnica împrumutată folosește bucla și valorile tale de mișcare, nu o a doua buclă.',
        'În site nu mai sunt imagini provizorii sau text inventat.',
        'Fiecare imagine are lățime, înălțime și text alternativ, iar cele de sub primul ecran se încarcă leneș.',
        'Pus lângă exemplu, site-ul tău e la fel de calm la 375 de pixeli lățime.',
      ],
    },
    criteria: [
      'Pot lista tehnicile din fiecare exemplu și unde stau în cod.',
      'Am adaptat o tehnică în site-ul meu fără să-i dublez bucla.',
      'Site-ul meu folosește materiale reale, dimensionate și comprimate.',
      'Site-ul meu are cele patru calități comune: o buclă, lizibil fără efecte, reținere, mobile first.',
    ],
  },
};
