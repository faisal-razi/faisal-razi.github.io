import { toast } from './store.js';

// type "moodle" → graduation-cap confetti · Konami code → raw blueprint (wireframe) mode
export function easterEggs({ gsap }) {
  let buf = '';
  const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let k = 0;
  addEventListener('keydown', (e) => {
    if (e.target.closest?.('input, textarea, select')) return;
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    k = key === konami[k] ? k + 1 : key === konami[0] ? 1 : 0;
    if (k === konami.length) {
      k = 0;
      const on = document.documentElement.classList.toggle('wireframe');
      toast(on ? '▸ raw blueprint mode — Konami again to build' : '✓ rebuilt');
    }
    if (e.key.length === 1) {
      buf = (buf + key).slice(-6);
      if (buf === 'moodle') { caps(gsap); toast('🎓 class dismissed!'); buf = ''; }
    }
  });
}

function caps(gsap) {
  const n = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 42;
  for (let i = 0; i < n; i++) {
    const c = document.createElement('span');
    c.className = 'cap';
    c.textContent = '🎓';
    document.body.append(c);
    const x0 = innerWidth / 2, y0 = innerHeight * 0.7;
    gsap.set(c, { x: x0, y: y0, scale: 0.6 + Math.random() * 0.9 });
    gsap.to(c, {
      x: x0 + (Math.random() - 0.5) * innerWidth * 0.9,
      y: y0 - 200 - Math.random() * innerHeight * 0.6,
      rotation: (Math.random() - 0.5) * 720,
      duration: 1 + Math.random() * 0.6,
      ease: 'power3.out',
    });
    gsap.to(c, { y: '+=' + innerHeight, opacity: 0, delay: 1.1, duration: 1.4, ease: 'power2.in', onComplete: () => c.remove() });
  }
}
