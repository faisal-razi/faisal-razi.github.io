import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import 'lenis/dist/lenis.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

import { store } from './fx/store.js';
import { preloader } from './fx/preloader.js';
import { cursor } from './fx/cursor.js';
import { magnetic } from './fx/magnetic.js';
import { buildHead } from './fx/buildhead.js';
import { easterEggs } from './fx/eastereggs.js';
import { dither } from './fx/dither.js';
import { nav } from './sections/nav.js';
import { hero } from './sections/hero.js';
import { reveals } from './sections/reveals.js';
import { work } from './sections/work.js';
import { wall } from './sections/wall.js';
import { journey } from './sections/journey.js';
import { skills } from './sections/skills.js';
import { reviews } from './sections/reviews.js';
import { contact } from './sections/contact.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || store.get('motion') === 'off';
const motion = !reduced;
root.classList.toggle('motion', motion);
root.classList.toggle('no-motion', !motion);

let lenis = null;
if (motion) {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const ctx = { gsap, ScrollTrigger, SplitText, lenis, motion };

// Things that never depend on motion
nav(ctx);
easterEggs(ctx);
contact(ctx);
reviews(ctx);
wall(ctx);
journey(ctx);

const start = () => {
  hero(ctx);
  reveals(ctx);
  work(ctx);
  skills(ctx);
  if (motion) {
    cursor(ctx);
    magnetic(ctx);
    buildHead(ctx);
    dither(ctx);
    // grid parallax
    const grid = document.querySelector('.grid-bg');
    gsap.to(grid, { y: () => -window.innerHeight * 0.25, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
  }
  ScrollTrigger.refresh();
};

// fonts first so split lines measure correctly
const ready = document.fonts ? document.fonts.ready : Promise.resolve();
ready.then(() => preloader(ctx).then(start));

// motion toggle in footer
const mt = document.querySelector('.motion-toggle');
mt.setAttribute('aria-pressed', String(!motion));
mt.textContent = motion ? 'Reduce motion' : 'Enable motion';
mt.addEventListener('click', () => {
  store.set('motion', motion ? 'off' : 'on');
  location.reload();
});

document.querySelector('.year').textContent = new Date().getFullYear();

// Pause the RAF-heavy pieces when the tab is hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { gsap.ticker.sleep?.(); lenis?.stop(); } else { gsap.ticker.wake?.(); lenis?.start(); }
});

// hidden greeting
console.log(
  `%c
  ╔═╗╦═╗   Hey dev 👋 — like what you see?
  ╠╣ ╠╦╝   This sheet was drafted in Vite + GSAP + Three.js.
  ╚  ╩╚═   faisalrazi30@gmail.com
`,
  'color:#FF8F66;font-family:monospace;font-size:12px'
);
