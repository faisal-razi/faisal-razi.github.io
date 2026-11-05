// Client wall: two opposite marquees of ink-recoloured logos; tiles flip to full colour
// on hover/focus and open a blueprint spec-card popover on click.
export function wall({ gsap, motion }) {
  const rows = document.querySelectorAll('.marquee');
  const tweens = [];
  if (motion) {
    rows.forEach((row) => {
      const track = row.querySelector('.marquee__track');
      const dir = +row.dataset.dir;
      const tw = gsap.fromTo(track, { xPercent: dir > 0 ? 0 : -50 }, { xPercent: dir > 0 ? -50 : 0, duration: 46, ease: 'none', repeat: -1 });
      tweens.push(tw);
      row.addEventListener('pointerenter', () => gsap.to(tw, { timeScale: 0, duration: 0.6 }));
      row.addEventListener('pointerleave', () => gsap.to(tw, { timeScale: 1, duration: 0.6 }));
      row.addEventListener('focusin', () => tw.pause());
      row.addEventListener('focusout', () => tw.play());
    });
  }

  const data = JSON.parse(document.getElementById('client-data').textContent);
  const byId = Object.fromEntries(data.map((d) => [d.id, d]));
  const pop = document.querySelector('.pop');
  const $ = (s) => pop.querySelector(s);
  let opener = null, y0 = 0;

  const place = (btn) => {
    const r = btn.getBoundingClientRect();
    const w = pop.offsetWidth, h = pop.offsetHeight;
    let x = r.left + r.width / 2 - w / 2;
    x = Math.max(16, Math.min(innerWidth - w - 16, x));
    let y = r.bottom + 14;
    if (y + h > innerHeight - 16) y = r.top - h - 14;
    pop.style.left = x + 'px';
    pop.style.top = Math.max(16, y) + 'px';
  };

  const show = (btn) => {
    const d = byId[btn.dataset.client];
    if (!d) return;
    opener = btn;
    y0 = scrollY;
    $('.pop__sector').textContent = [d.cc, d.sector].filter(Boolean).join(' · ');
    $('.pop__title').textContent = d.title;
    $('.pop__about').textContent = d.about;
    $('.pop__role').textContent = d.role;
    $('.pop__role').hidden = !d.role;
    $('.pop__stack').innerHTML = d.stack.map((s) => `<li>${s.replace(/</g, '&lt;')}</li>`).join('');
    $('.pop__visit').href = d.url;
    pop.hidden = false;
    place(btn);
    tweens.forEach((t) => t.pause());
    if (motion) gsap.fromTo(pop, { clipPath: 'inset(0 0 100% 0)', y: -8 }, { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 0.45, ease: 'expo.out' });
    $('.pop__close').focus({ preventScroll: true });
  };
  const hide = () => {
    if (pop.hidden) return;
    pop.hidden = true;
    tweens.forEach((t) => t.play());
    opener?.focus({ preventScroll: true });
  };

  document.querySelectorAll('.tile__btn').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); show(b); }));
  $('.pop__close').addEventListener('click', hide);
  pop.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('click', hide);
  addEventListener('keydown', (e) => e.key === 'Escape' && hide());
  addEventListener('scroll', () => !pop.hidden && Math.abs(scrollY - y0) > 60 && hide(), { passive: true });
}
