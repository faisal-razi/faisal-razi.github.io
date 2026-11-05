// Hero build moment: outlined letters flood with colour, role line types, badges float in.
export function hero({ gsap, motion, ScrollTrigger }) {
  const typed = document.querySelector('.typed');
  const roles = typed.dataset.roles.split('|');

  if (!motion) return;

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.hero__line > span', { yPercent: 110, duration: 1.1, stagger: 0.12 })
    .to('.outline-text', { '--fill': '0%', duration: 1.4, ease: 'power3.inOut', stagger: 0.18 }, '-=0.6')
    .from('.hero .eyebrow, .hero__role, .hero__sub', { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.35)
    .from('.hero__cta > *', { y: 20, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.6)
    .from('.badges li', { y: 16, opacity: 0, duration: 0.7, stagger: 0.07 }, 0.75)
    .from('.hero__annot .anno', { opacity: 0, duration: 1, stagger: 0.1 }, 0.4);

  // typewriter
  let r = 0;
  const type = (word, i = 0) => {
    typed.textContent = word.slice(0, i);
    if (i < word.length) return setTimeout(() => type(word, i + 1), 55);
    setTimeout(() => erase(word, word.length), 1900);
  };
  const erase = (word, i) => {
    typed.textContent = word.slice(0, i);
    if (i > 0) return setTimeout(() => erase(word, i - 1), 28);
    r = (r + 1) % roles.length;
    type(roles[r]);
  };
  setTimeout(() => erase(roles[0], roles[0].length), 2600);

  // hero copy drifts up as the network morphs
  gsap.to('.hero__inner', { yPercent: -18, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // Three.js after first paint
  const canvas = document.querySelector('.hero__net');
  const load = () => import('../fx/network3d.js').then((m) => m.network3d(canvas, { gsap, ScrollTrigger })).catch(() => canvas.remove());
  ('requestIdleCallback' in window ? requestIdleCallback : (f) => setTimeout(f, 200))(load);
}
