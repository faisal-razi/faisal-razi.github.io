# Build Prompt: "Blueprint → Build" Portfolio for Faisal Abbas Razi

> Paste everything below the line into your AI builder (Claude Code, v0, Cursor, Lovable, …).
> Before pasting, fill in the **PROJECTS** block in section 6.

---

## 0. Role & Mission

You are a senior creative front-end developer and motion designer. Build a **single-page, highly animated, award-quality personal portfolio** for **Faisal Abbas Razi, Moodle Architect & PHP Lead**. It must deploy as a **static site on GitHub Pages** with no server, no database and no secrets.

The site should feel like a craftsman's studio, not a template. Every animation must tell part of the story, and nothing should move only for decoration. A recruiter should understand who Faisal is within 5 seconds, and a fellow developer should still be finding small details after 5 minutes.

---

## 1. The Creative Concept: "From Blueprint to Build"

Faisal is an **architect** of learning platforms. The whole site uses one metaphor: **each section starts as a technical blueprint and "compiles" into a finished, polished interface as the visitor scrolls.**

- **Blueprint state:** deep navy background (`#0B1D33`), cyan grid lines, dashed construction outlines, measurement annotations (`← 1200px →`, `z-index: 10`), handwritten-style margin notes, and monospace labels.
- **Built state:** the same section fills in with real colour, depth, glass panels, images and typography. Outlines "draw" themselves (SVG `stroke-dashoffset`), then colour floods in from the drawn edges.
- **Transition trigger:** scroll position, using GSAP ScrollTrigger. Each section has its own small "build moment".
- **Recurring motif:** a small animated cursor named the **"Build Head"**, like a 3D-printer nozzle or drafting pen. It travels between sections along an SVG path that connects them, and leaves a glowing trail. It is the site's mascot.

**Tone:** confident, warm, precise. Engineer meets teacher, since Faisal also lectured for years.

---

## 2. Tech Stack (GitHub Pages-safe)

| Concern | Choice |
|---|---|
| Build tool | **Vite** (vanilla JS or vanilla TS). No framework is needed, but **Astro (static output)** is also acceptable |
| Animation | **GSAP 3** + **ScrollTrigger** + **SplitText** + **DrawSVG** + **MotionPath** (all GSAP plugins are free, installed from npm) |
| Smooth scroll | **Lenis**, synced with ScrollTrigger |
| Hero visual | **Three.js** *or* a lightweight 2D canvas. Load it with dynamic `import()` after first paint |
| Icons | Inline SVG sprite. No icon-font CDN |
| Fonts | Self-hosted WOFF2: **Space Grotesk** (display), **Inter** (body), **JetBrains Mono** (blueprint labels) |
| Contact form | **Web3Forms** (static-friendly, free tier, no backend), with a `mailto:` fallback. Wiring in §5.9.1 |
| Analytics (optional) | GoatCounter or Plausible. No cookies, so no consent banner is needed |

### GitHub Pages requirements (mandatory)

1. The repo is **`faisal-razi/faisal-razi.github.io`** (a GitHub organization user site), so set `vite.config.js` → `base: '/'`. Keep `base` configurable in case the site is ever moved to a project repo. Every asset path must work under this base: use `import.meta.env.BASE_URL` and never hard-code `/assets/...`.
2. Add `.github/workflows/deploy.yml` using the official `actions/configure-pages`, `actions/upload-pages-artifact` and `actions/deploy-pages`. It should build on push to `main` with Node 22, then publish `dist/`.
3. Add an empty **`public/.nojekyll`** file.
4. Add **`public/404.html`**, a themed "Blueprint not found" page with a link home that respects the base path.
5. Use a **single page with hash anchors** (`#work`, `#journey`, …). Do not use client-side history routing, because Pages cannot rewrite URLs.
6. Do not use server code, environment secrets or API keys in the bundle. The contact form endpoint ID is public by design.
7. Add `public/CNAME` only if a custom domain is supplied: `<CUSTOM_DOMAIN or remove>`.
8. Include `README.md` with local dev steps (`npm i`, `npm run dev`), build steps and the steps to enable Pages: *Settings → Pages → Source: GitHub Actions*.

---

## 3. Design System

**Palette** (define as CSS custom properties on `:root`):

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0B1D33` | Blueprint navy (matches the résumé sidebar) |
| `--ink-2` | `#12294A` | Raised panels |
| `--line` | `#2BB3C0` | Teal/cyan blueprint lines and accents (matches the résumé teal) |
| `--glow` | `#7CF5FF` | Hover glow, Build Head trail |
| `--paper` | `#F4F1EA` | Warm off-white for the "built" light sections |
| `--amber` | `#FFB547` | Rare highlight: CTAs and key numbers |
| `--muted` | `#8BA3BF` | Secondary text |

- **Dark-first** design. Also provide a light "paper" theme via a toggle that animates as a blueprint sheet being flipped over. Respect `prefers-color-scheme` and remember the choice in `localStorage` inside a try/catch.
- **Typography scale:** fluid with `clamp()`. Hero name ≈ `clamp(3rem, 9vw, 8.5rem)`, tight tracking.
- **Grid texture:** a CSS background grid (`linear-gradient` lines every 24px, major lines every 120px) that subtly parallaxes.
- **Corners:** 14px radius on built panels. Blueprint outlines stay sharp, which makes the contrast part of the story.
- **Easing:** a house curve, `cubic-bezier(0.22, 1, 0.36, 1)` (expo-out), and GSAP `"expo.out"` / `"power4.inOut"`.

---

## 4. Global Motion Language

1. **Preloader: "Compiling…"** (≤ 1.8s, skippable, shown only on first visit per session)
   - A terminal window types:
     ```
     $ moodle-architect --init faisal.razi
     ✓ loading 7+ years of experience
     ✓ mounting 1,000s of learners
     ✓ resolving dependencies: PHP · Laravel · Moodle
     ▸ building portfolio...
     ```
   - A progress bar made of `█` characters fills up. The terminal window then **folds into a single cyan line** that expands to become the hero's horizon line.
2. **Custom cursor:** a small crosshair with coordinate readout (`x: 412 y: 108`) in blueprint sections, which morphs into a soft glowing dot on built sections. It grows into a "VIEW →" pill over project cards. Disable it on touch devices.
3. **Magnetic buttons:** CTAs pull slightly toward the cursor (GSAP `quickTo`).
4. **Text reveals:** headings split by line with SplitText, masked slide-up, and a 0.04s stagger. Section eyebrow labels type out in monospace: `// 02 — JOURNEY`.
5. **Scroll progress:** a thin vertical "ruler" on the right edge with tick marks per section. The current section label slides along it.
6. **Section transitions:** the Build Head draws the connecting path to the next section (DrawSVG + MotionPath, scrubbed to scroll).
7. **Micro-interactions:** link underlines draw left-to-right; nav items show a blueprint dimension line on hover; copying the email triggers a "✓ copied to clipboard" toast that slides up like a terminal line.
8. **Easter eggs:**
   - Typing `moodle` anywhere triggers a confetti burst of tiny graduation caps 🎓.
   - The **Konami code** switches the whole site into a full "raw blueprint" wireframe mode.
   - A hidden `console.log` greeting in ASCII art: *"Hey dev 👋 — like what you see? faisalrazi30@gmail.com"*.

---

## 5. Sections (in order)

### 5.1 Navigation
- Fixed, minimal: a logo mark at left (monogram **"FR"** drawn as a blueprint stamp that rotates 90° on hover) and anchors at right: **Work · Journey · Skills · About · Contact**, plus a theme toggle.
- On scroll down it hides, and on scroll up it reappears with a glass blur.
- Mobile: a full-screen overlay menu in which links "unfold" like architectural drawers.

### 5.2 Hero: "I architect learning."
- **Headline (SplitText, letters build from dashed outline → solid):**
  `Faisal Abbas Razi`
- **Rotating role line** (typewriter cycling):
  `Moodle Architect` → `PHP & Laravel Lead` → `LMS Plugin Engineer` → `Remote Tech Lead` → `Former CS Lecturer`
- **Sub-line:** *"I design, build and scale Learning Management Systems trusted by institutions across Australia, the UK and Pakistan."*
- **Hero visual:** an interactive **3D wireframe "learning network"**, a slowly rotating constellation of nodes. Each node is a learner, connected to course hubs. On mouse move it tilts with parallax. On scroll it **assembles** into a stylised graduation-cap shape, then dissolves into the grid. Use Three.js `Points` + `LineSegments`, capped at about 600 nodes, and pause it with an `IntersectionObserver` when it is off-screen.
- **CTAs:** `View my work ↓` (primary, amber) and `Download CV` (outline; link to `/public/FaisalRazi_Resume.pdf`).
- **Live badges** (small pills that float in with stagger): `● Available for remote work` (pulsing green dot), `📍 Islamabad, PK · UTC+5`, `7+ yrs`.
- **Scroll cue:** an animated drafting-pencil line that draws downward.

### 5.3 Stats Strip: "By the numbers"
Count-up numbers (GSAP `snap`) that trigger on enter, each shown inside a blueprint dimension frame:
- **7+** years building on the web
- **40%** faster support resolution (Theos Seminary)
- **60%** less manual admin via enrolment automation
- **99.5%+** LMS uptime maintained
- **150+** students mentored as Lab Engineer
- **4** live platforms security-hardened

### 5.4 Selected Work (filled from the PROJECTS block in section 6)
- **Layout:** a horizontally pinned scroll gallery on desktop (ScrollTrigger `pin` + `x` translate), which becomes a vertical stack on mobile.
- **Each card starts as a wireframe** (grey boxes, an `<img>` placeholder X, lorem lines) and **builds into the real screenshot** as it enters the centre of the viewport. A clip-path wipe reveals the image while the wireframe lines fade.
- Card content: project name, one-line hook, role, stack chips, an impact line, and links (`Live ↗`, `Case study`).
- **Hover:** 3D tilt (max 8°), a glare sweep, and stack chips that lift and scatter slightly.
- **Click → Case-study modal** (a full-screen sheet that unrolls from the card like a blueprint scroll):
  - Problem → Approach → Architecture (a small animated SVG diagram) → Result → Stack.
  - Image gallery with keyboard navigation. The modal updates `location.hash` (`#work/ahmi`) so it can be deep-linked and works with the back button.
- **Filter bar:** `All · Moodle/LMS · Laravel/PHP · Full-stack · AI/Modern`, with FLIP-animated reflow (GSAP Flip).
- Mark NDA or private projects with a 🔒 badge and a "Private — demo on request" label instead of a live link.

### 5.5 Journey: "The Route Map"
An animated **map-style timeline**. A dotted flight path draws itself across a stylised world map as the user scrolls, with stops pinned along it:

| When | Where | Role |
|---|---|---|
| 2015 | BZU Multan | B.Sc. Math & Physics |
| 2016–2018 | Superior College, Vehari | Visiting Lecturer — CS |
| 2017 | Univ. of Agriculture, Faisalabad | **M.S. Computer Science, CGPA 3.87/4.00** |
| 2018–2019 | ZpZen Technologies, Vehari | Senior Web Developer & Tech Lead (5-person team) |
| 2018–2020 | NASMAK Pty Ltd → **Sydney, Australia** (remote) | Technical Lead, Web & LMS |
| 2019–2021 | COMSATS University, Vehari | Lab Engineer |
| 2020–now | Fiverr | Freelance Moodle / PHP consultant |
| 2022–now | Theos Seminary (remote) | Technical Support Manager |
| 2022–now | SkillWare4u (remote) | Technical Consultant, LMS & PHP |

- The line between **Vehari 🇵🇰 and Sydney 🇦🇺** arcs dramatically, with a small paper plane flying along it (MotionPath).
- Each stop expands on hover or tap into a card listing 2–3 achievements (taken from section 7).
- Overlapping roles render as parallel "tracks", like a metro map.

### 5.6 Skills: "The Toolbox Constellation"
- Do **not** use skill-percentage bars. Instead, build an interactive **force-directed constellation**: categories are large nodes (**Moodle · PHP Frameworks · Data · APIs · Front-end · Cloud & DevOps**) and tools orbit them.
- Hovering a tool highlights every project in the Work section that used it (cross-linking).
- **Moodle Expertise sub-panel:** an isometric "plugin stack" where each layer slides in, stacked like LEGO bricks: Plugin & Block Development · Theme Customization · SCORM · H5P · USI API Integration · LMS Performance Tuning · Multi-Tenant Deployments · Enrolment & Roles.
- A marquee ticker loops below it (and pauses on hover): `PHP · Laravel · Yii2 · CodeIgniter · WordPress · MySQL · PostgreSQL · REST · OAuth 2.0 · JavaScript · jQuery · Angular · Git · Google Cloud · AWS · FastAPI · …`. Adjust the list to the confirmed skills only.

### 5.7 About: "The Teacher Who Builds"
- Split layout: a portrait on one side (from `public/img/faisal.jpg`), rendered first as a **halftone/line-art blueprint** that resolves into the real photo on scroll via a canvas dither or CSS mask.
- Story copy (3 short paragraphs, first person, warm):
  1. Started as a lecturer, teaching programming to classrooms of 40–60. Learned that the best systems, like the best lessons, are clear.
  2. Moved into building: led teams, shipped platforms for Australian training organisations, and wrote the USI compliance plugin that verifies every student at enrolment.
  3. Now architects LMS ecosystems remotely, still mentors, and is curious about **Data Mining, Machine Learning and NLP**.
- **"Currently"** card, styled as a live terminal: `> building: …`, `> learning: …`, `> reading: …` (editable in the data file).
- Languages: English (Professional), Urdu (Native), shown as two small animated waveform bars.

### 5.8 Certifications: "Stamped & Verified"
A grid of certificates styled as **ink stamps** that thump onto the page with scale, rotation and a small shake as they enter:
Google Analytics IQ (2019) · Google Cloud Seekho S2 (2020) · Google Cloud Essentials · Machine Learning, Coursera/UW · Digital Marketing, DigiSkills (2018) · WordPress Development, DigiSkills (2019) · E-Commerce Management, DigiSkills (2019) · Facebook SMBS (2018) · E-Rozgaar Technical Programme (2018).

### 5.9 Contact: "Let's draft something."
- A huge headline: **"Have a platform in mind? Let's draft it."** Each word draws in outline, then fills.
- A two-column layout:
  - **Left:** the email (click to copy), LinkedIn, Fiverr and GitHub links, each with a magnetic hover. A WhatsApp button is optional (see the privacy note).
  - **Right:** a form styled as a **blueprint spec sheet**. Fields are labelled like drawing annotations (`FIELD A — Your name`). Submitting animates a paper plane folding up and flying off-screen, then shows `✓ Message delivered`.
- Show local time in Pakistan, live (`It's 3:42 PM in Islamabad`), with a sun or moon icon.

#### 5.9.1 Contact form wiring (Web3Forms)

- **Endpoint:** `POST https://api.web3forms.com/submit` (JSON).
- **Access key:** read it from `profile.json` → `"contact": { "web3formsKey": "a9764922-3766-4dd5-bd13-e7828327cd4d" }`. This key is **public by design**: it only allows sending mail *to* the owner's inbox. Commit it in plain text; it is not a secret, and no GitHub secret is needed.
- **Markup** (the form must also work without JS through a normal POST):
  ```html
  <form id="contact-form" action="https://api.web3forms.com/submit" method="POST">
    <input type="hidden" name="access_key" value="a9764922-3766-4dd5-bd13-e7828327cd4d">
    <input type="hidden" name="subject" value="New message from your portfolio">
    <input type="hidden" name="from_name" value="Portfolio — faisalrazi">
    <input type="checkbox" name="botcheck" class="visually-hidden" tabindex="-1" autocomplete="off">
    <input name="name" required autocomplete="name">
    <input name="email" type="email" required autocomplete="email">
    <select name="project_type"> <!-- Moodle/LMS · Laravel/PHP · Consulting · Other --> </select>
    <textarea name="message" required minlength="20"></textarea>
    <button type="submit">Send spec →</button>
    <p id="form-status" aria-live="polite"></p>
  </form>
  ```
  `botcheck` is the Web3Forms honeypot. Hide it from people with CSS, not with `type="hidden"`, so that bots fill it in.
- **JS enhancement:** intercept submit, then `fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json', Accept:'application/json'}, body: JSON.stringify(Object.fromEntries(new FormData(form))) })`. Check `json.success`.
  - **Sending:** disable the button and show a blueprint "plotting…" loader.
  - **Success:** play the paper-plane animation, show `✓ Message delivered — I'll reply within 24h`, and reset the form.
  - **Error or offline:** show `✗ Couldn't send — email me directly` with a `mailto:faisalrazi30@gmail.com` link prefilled with the subject and body (URL-encoded).
- **Validation:** validate on the client with friendly inline messages, styled as red-pencil annotations next to each field. Enforce a 5,000-character limit on the message.
- **Rate limiting:** after a successful send, block another submission for 30 seconds (`sessionStorage`, wrapped in try/catch).
- Do not add a third-party CAPTCHA unless spam becomes a problem.

### 5.10 Footer
- `Designed & built by Faisal Razi · <year>` · `View source on GitHub ↗` · a back-to-top button where the Build Head flies back up the page.
- A tiny "Built with: Vite · GSAP · Three.js · ☕" line.

---

## 6. PROJECTS (fill this block in)

Keep all project data in **`src/data/projects.json`** so it can be edited without touching code. Use this schema:

```json
[
  {
    "id": "ahmi",
    "title": "Australian Health & Management Institute — Moodle LMS",
    "hook": "Government-compliant LMS that verifies every learner at enrolment.",
    "category": ["Moodle/LMS"],
    "role": "Technical Lead",
    "year": "2019",
    "stack": ["Moodle", "PHP", "USI API", "MySQL"],
    "problem": "…",
    "approach": "…",
    "result": "…",
    "metrics": ["Hundreds of enrolled professional learners"],
    "links": { "live": "http://lms.ahmi.edu.au/", "repo": null },
    "private": false,
    "featured": true,
    "cover": "img/projects/ahmi-cover.webp",
    "gallery": ["img/projects/ahmi-1.webp"]
  }
]
```

**My projects to list:**

```
<<< PASTE YOUR PROJECT LIST HERE >>>
(for each: name, 1–2 line description, your role, stack, year, live link / private, any numbers)
```

*Candidates already known from the résumé and past work. Keep, edit or delete them:*
- Australian Health & Management Institute — Moodle LMS + USI API integration
- Informa Connect Australia — enterprise multi-cohort Moodle with SCORM and automated CPD certificates
- ACPD — online learning and payment portal (Moodle + Laravel + Stripe)
- SoleMole — mobile merchant hub (Yii2 REST/OAuth 2.0 API for iOS, Android and Windows clients; stolen-IMEI system)
- Bizhere — on-demand service marketplace (WordPress + REST API)
- Theos Seminary — self-service support block plugin (−40% ticket resolution time)
- Moodle Stripe subscription / fixed-payment-plan plugin (Moodle 3.11 port)
- Sehatti — corporate wellbeing platform (FastAPI, AWS, React Native, multilingual AI translation)
- Doctor Portal — HealthTech practice platform (Vercel + Neon)
- Restaurant POS extensions — Quick Bill, daily closing, costing and stock ledger
- Sabzi Mandi — wholesale produce accounting app (migrated from MS Access/VB6 to PHP/MySQL)

---

## 7. Content Source of Truth (achievements to use in copy)

- Reduced student support ticket resolution time by **40%** with a custom Moodle block plugin.
- Cut manual admin effort by **60%** through API-driven enrolment automation.
- Maintained **>99.5% uptime** through monitoring, core upgrades and security patching.
- Architected a **USI API integration** for Australian Government compliance (automated student-identifier verification).
- Led a **cross-functional remote team** delivering Moodle platforms for multiple Australian RTOs.
- Audited applications and fixed critical vulnerabilities across **4 live platforms**.
- Led a **5-person team** shipping findcut.com, solemole.com, vosshop.uk and move2canada.info.
- Taught **150+** undergraduates in labs; cohorts of **40–60** as lecturer.
- **M.S. Computer Science, CGPA 3.87/4.00.**
- Freelancing on Fiverr since **2020** for international clients.

Do not invent clients, testimonials or numbers. If a section would need data that is not provided (such as testimonials), leave it out.

---

## 8. Performance, Accessibility & Quality Bar

- **Lighthouse ≥ 95** for Performance, Accessibility, Best Practices and SEO on mobile.
- **`prefers-reduced-motion`:** disable the preloader, Lenis, pinning, the 3D scene and parallax. Show content in its "built" state with simple fades. Also add a visible **"Reduce motion"** toggle in the footer.
- The **first contentful paint must not wait for animation libraries.** Content is visible in the HTML, and JS only enhances it. If JS fails, the site still reads perfectly.
- Lazy-load Three.js, project images (`loading="lazy"`, `decoding="async"`) and the modal gallery. Use WebP/AVIF with `srcset`. Hero JS budget is about 150 KB gzip, not counting Three.js, which is loaded later.
- Semantic HTML landmarks, a single `h1`, logical heading order, a skip link, visible focus rings styled as blueprint dashed outlines, full keyboard support for the modal (focus trap, `Esc` closes), and `aria-live` for the form status.
- Colour contrast at WCAG AA in both themes.
- Mobile-first layout: at least 16px side gutters, no horizontal overflow, touch targets of 44px or more. Horizontal-scroll sections become vertical below 900px.
- Pause all `requestAnimationFrame` loops when the tab is hidden (`visibilitychange`).

---

## 9. SEO & Sharing

- `<title>Faisal Abbas Razi — Moodle Architect & PHP Lead</title>`
- Meta description: *"Moodle architect and PHP lead with 7+ years building and scaling LMS platforms for institutions in Australia, the UK and Pakistan."*
- Open Graph and Twitter cards with a **custom 1200×630 OG image** in the blueprint style (generated and committed to `public/og.png`).
- JSON-LD `Person` schema (name, jobTitle, url, sameAs: LinkedIn, Fiverr, GitHub; alumniOf; knowsAbout).
- `sitemap.xml`, `robots.txt`, a canonical URL, and a favicon set (an SVG "FR" stamp plus a PNG fallback).

---

## 10. Project Structure

```
/
├─ index.html
├─ vite.config.js            # base: '/'
├─ public/
│  ├─ .nojekyll
│  ├─ 404.html
│  ├─ og.png  favicon.svg  robots.txt  sitemap.xml
│  ├─ FaisalRazi_Resume.pdf
│  └─ img/ (faisal.jpg, projects/*.webp)
├─ src/
│  ├─ main.js                # boot, Lenis, ScrollTrigger setup, reduced-motion gate
│  ├─ data/projects.json  data/profile.json
│  ├─ sections/ hero.js work.js journey.js skills.js about.js contact.js
│  ├─ fx/ preloader.js cursor.js buildhead.js network3d.js magnetic.js eastereggs.js
│  └─ styles/ tokens.css base.css sections/*.css
├─ .github/workflows/deploy.yml
└─ README.md
```

All personal text (bio, stats, timeline, certifications, links) lives in `profile.json`, so updating the portfolio never requires editing code.

---

## 11. Deliverables & Definition of Done

1. Complete source code following the structure above.
2. `npm run build` succeeds, and `npm run preview` works with the base path set.
3. The GitHub Actions workflow deploys to `https://faisal-razi.github.io/` with no broken asset paths, including on the 404 page.
4. Tested at 375px, 768px, 1280px and 1920px, in Chrome, Firefox and Safari, and with reduced motion on.
5. README covers setup, how to add or edit a project, how to swap the résumé PDF, and how to connect a custom domain.

---

### Placeholders to replace
`<CUSTOM_DOMAIN>` (or remove) · GitHub profile URL (personal account: https://github.com/faisalrazi30) · portrait photo · project screenshots

> **Privacy note:** the résumé includes a phone number. On a public site, prefer email, LinkedIn and the contact form. Add a WhatsApp link only if you are comfortable with it being scraped.
