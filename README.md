# Faisal Razi — Portfolio

**Live:** https://faisalrazi.runs-on.dev/

A single-page, animated portfolio built on one idea: **every section starts as a technical blueprint and "builds" into a finished interface as you scroll.** Static, no backend, deployed to GitHub Pages.

- **Hero:** a Three.js network of learners that morphs into a graduation cap, then dissolves into the grid
- **Work:** a pinned horizontal rail of wireframe cards that build themselves, with case-study sheets you can deep-link (`#work/ahmi`)
- **Client wall:** 15 institutions in ink-masked marquees that flip to full colour
- **Journey:** a metro map of the career, with a paper plane flying the Vehari → Sydney arc
- **Skills:** a draggable force-directed constellation
- **Reviews:** 47 Fiverr reviews pinned as sticky notes
- **Contact:** a spec-sheet form sent through Web3Forms
- **Easter eggs:** type `moodle`, or enter the Konami code

Built with Vite, GSAP (ScrollTrigger, SplitText), Lenis and Three.js, with self-hosted fonts (Space Grotesk, Inter, JetBrains Mono).

## Local development

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # outputs dist/
npm run preview   # serves dist/ locally
```

## Editing content (no code changes needed)

| What | File |
|---|---|
| Bio, stats, journey, skills, certifications, links | `src/data/profile.json` |
| Clients and case studies | `src/data/projects.json` |
| Fiverr reviews | `src/data/reviews.json` |
| Client logos | `public/img/logos/` (ink masks are in `public/img/logos/mask/`) |
| Résumé download | `public/FaisalRazi_Resume.pdf` |
| Portrait | `public/img/faisal.jpg` |

Data is rendered into static HTML at build time by `src/render/templates.js` (through a small plugin in `vite.config.js`), so the page reads fully without JavaScript.

- Any project field that starts with `"TODO"` is hidden automatically.
- `featured: true` puts a project in the case-study rail.
- When adding a logo, also create its mask with ImageMagick (use `-negate` for logos meant for light backgrounds, and leave it out for white logos):

```bash
magick logo.webp -resize "x160>" \( +clone -alpha extract \) \( -clone 0 -background white -alpha remove -alpha off -colorspace gray -negate \) -delete 0 -compose multiply -composite -background white -alpha shape mask/logo.webp
```

## Deploying

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds with Node 22 and publishes `dist/` to Pages.

Pages must use the Actions source: *Settings → Pages → Build and deployment → Source: GitHub Actions* (already set for this repo).

**Custom domain:** `faisalrazi.runs-on.dev` is set in `public/CNAME` and in the Pages settings. To change it, update both, plus the canonical/OG URLs in `index.html`, `sitemap.xml`, `robots.txt` and `profile.json`.

**Moving to a project repo:** build with `BASE=/repo-name/ npm run build`.

## Accessibility & performance

- `prefers-reduced-motion` is respected, and the footer has a **Reduce motion** toggle. With motion off, content shows in its built state.
- Three.js is lazy-loaded after first paint and pauses when off-screen.
- Keyboard support includes focus traps in the dialogs, `Esc` to close, and a skip link.
