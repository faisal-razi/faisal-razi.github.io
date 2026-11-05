import { session } from './store.js';

const LINES = [
  ['cmd', '$ moodle-architect --init faisal.razi'],
  ['ok', '✓ loading 7+ years of experience'],
  ['ok', '✓ mounting 1,000s of learners'],
  ['ok', '✓ resolving dependencies: PHP · Laravel · Moodle'],
  ['', '▸ building portfolio...'],
];

// "Compiling…" boot sequence. ≤1.8s, skippable, once per session, never with reduced motion.
export function preloader({ gsap, motion, lenis }) {
  if (!motion || session.get('booted')) return Promise.resolve();
  session.set('booted', '1');

  return new Promise((resolve) => {
    const boot = document.createElement('div');
    boot.className = 'boot';
    boot.setAttribute('aria-hidden', 'true');
    boot.innerHTML = `<div class="boot__term"><p class="boot__bar"><i></i><i></i><i></i><span>zsh — sheet A-01</span></p><pre class="boot__out"></pre></div><span class="boot__horizon"></span><button class="boot__skip" type="button">SKIP ⏎</button>`;
    document.body.append(boot);
    lenis?.stop();
    const out = boot.querySelector('.boot__out');
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      const tl = gsap.timeline({ onComplete: () => { boot.remove(); lenis?.start(); } });
      tl.to('.boot__term', { scaleY: 0.004, duration: 0.35, ease: 'power4.in' })
        .set('.boot__term', { opacity: 0 })
        .to('.boot__horizon', { width: '100vw', x: '-50vw', duration: 0.45, ease: 'expo.out' }, '<')
        .to(boot, { opacity: 0, duration: 0.4 }, '+=0.05')
        .add(resolve, '-=0.35');
    };

    const html = [];
    let li = 0;
    const tick = () => {
      if (done) return;
      if (li < LINES.length) {
        const [cls, text] = LINES[li++];
        html.push(`<span class="${cls}">${text}</span>`);
        out.innerHTML = html.join('\n');
        setTimeout(tick, li === 1 ? 260 : 170);
      } else {
        let n = 0;
        const bar = () => {
          if (done) return;
          n += 2;
          out.innerHTML = html.join('\n') + `\n<span class="prog">${'█'.repeat(n)}${'░'.repeat(Math.max(0, 24 - n))} ${Math.round((n / 24) * 100)}%</span>`;
          if (n < 24) setTimeout(bar, 22); else setTimeout(finish, 120);
        };
        bar();
      }
    };
    tick();

    boot.querySelector('.boot__skip').addEventListener('click', finish);
    const key = (e) => { if (e.key === 'Enter' || e.key === 'Escape') { finish(); removeEventListener('keydown', key); } };
    addEventListener('keydown', key);
    setTimeout(finish, 2400); // hard cap
  });
}
