// Shared scroll reveals: eyebrow labels type out, headings rise line by line,
// count-ups, the ruler, stamps, the plugin stack and the marquee ticker.
export function reveals({ gsap, SplitText, ScrollTrigger, motion }) {
  // ruler + active nav are useful even without motion
  const sections = [...document.querySelectorAll('main > section')];
  const label = document.querySelector('.ruler__label');
  const fill = document.querySelector('.ruler__fill');
  const links = [...document.querySelectorAll('.nav__links a')];
  sections.forEach((s) => {
    ScrollTrigger.create({
      trigger: s, start: 'top 55%', end: 'bottom 55%',
      onToggle: (st) => {
        if (!st.isActive) return;
        label.textContent = s.dataset.section;
        links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + s.id));
      },
    });
  });
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (st) => { fill.style.height = st.progress * 100 + '%'; label.style.top = st.progress * 100 + '%'; },
  });

  // count-ups
  document.querySelectorAll('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count), dec = +el.dataset.decimals;
    if (!motion) return;
    const o = { v: 0 };
    el.textContent = (0).toFixed(dec);
    gsap.to(o, {
      v: end, duration: 1.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: () => (el.textContent = o.v.toFixed(dec)),
    });
  });

  // ticker marquee (CSS-free so it can pause/resume cleanly)
  const tick = document.querySelector('.ticker__track');
  if (motion && tick) {
    const tw = gsap.to(tick, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
    const t = tick.parentElement;
    t.addEventListener('pointerenter', () => tw.pause());
    t.addEventListener('pointerleave', () => tw.play());
  }

  if (!motion) return;

  // eyebrow typing
  document.querySelectorAll('[data-type]').forEach((el) => {
    if (el.closest('.hero')) return;
    const full = el.textContent;
    el.textContent = '';
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => {
        let i = 0;
        const step = () => { el.textContent = full.slice(0, ++i); if (i < full.length) setTimeout(step, 18); };
        step();
      },
    });
  });

  // headings: masked line rise
  document.querySelectorAll('[data-split]').forEach((el) => {
    const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'line' });
    gsap.from(split.lines, { yPercent: 105, duration: 1.1, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: el, start: 'top 85%' } });
  });

  gsap.utils.toArray('.lede, .about__copy > p, .terminal, .langs').forEach((el) =>
    gsap.from(el, { y: 30, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } })
  );

  // stats: dimension lines draw out
  gsap.from('.stat .dim i', { scaleX: 0, duration: 1, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: '.stats', start: 'top 80%' } });
  gsap.from('.stat', { opacity: 0, y: 30, duration: 0.9, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: '.stats', start: 'top 80%' } });

  // ink stamps thump down
  gsap.utils.toArray('.stamp__ring').forEach((s, i) => {
    gsap.fromTo(s, { scale: 2.2, opacity: 0, rotation: '+=25' }, {
      scale: 1, opacity: 1, rotation: s.style.getPropertyValue('--r') || 0, duration: 0.45, ease: 'power4.in', delay: (i % 5) * 0.08,
      scrollTrigger: { trigger: s, start: 'top 90%' },
      onComplete: () => gsap.fromTo(s, { x: -2 }, { x: 0, duration: 0.25, ease: 'elastic.out(3, 0.3)' }),
    });
  });

  // plugin stack: bricks drop in and settle
  gsap.from('.plugin__stack li', { y: -60, opacity: 0, rotateX: 70, duration: 0.8, ease: 'back.out(1.8)', stagger: 0.09, scrollTrigger: { trigger: '.plugin__stack', start: 'top 80%' } });

  // contact headline: outline → fill on the second line
  gsap.fromTo('.contact__title span', { '-webkit-text-stroke-color': 'var(--amber)', color: 'transparent' }, {
    color: 'var(--amber)', duration: 1.2, ease: 'power2.inOut', scrollTrigger: { trigger: '.contact__title', start: 'top 60%' },
  });
}
