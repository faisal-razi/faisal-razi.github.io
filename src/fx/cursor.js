// Crosshair with coordinate readout → glowing dot on "built" panels → VIEW pill on cards.
export function cursor({ gsap }) {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const el = document.querySelector('.cursor');
  const read = el.querySelector('.cursor__read');
  document.documentElement.classList.add('has-cursor');
  const x = gsap.quickTo(el, 'x', { duration: 0.18, ease: 'power3' });
  const y = gsap.quickTo(el, 'y', { duration: 0.18, ease: 'power3' });
  let raf = 0, lx = 0, ly = 0;

  addEventListener('pointermove', (e) => {
    x(e.clientX); y(e.clientY);
    lx = e.clientX; ly = e.clientY;
    if (!raf) raf = requestAnimationFrame(() => {
      raf = 0;
      read.textContent = `x: ${Math.round(lx)} y: ${Math.round(ly + scrollY)}`;
      const t = document.elementFromPoint(lx, ly);
      el.classList.toggle('is-view', !!t?.closest('[data-cursor="view"]'));
      el.classList.toggle('is-dot', !!t?.closest('a, button, input, textarea, select, .note, .tile, .card__built, .terminal'));
    });
  }, { passive: true });
  document.addEventListener('pointerleave', () => gsap.to(el, { opacity: 0, duration: 0.2 }));
  document.addEventListener('pointerenter', () => gsap.to(el, { opacity: 1, duration: 0.2 }));
}
