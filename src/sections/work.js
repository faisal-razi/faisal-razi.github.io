// Selected work: pinned horizontal rail; each card is a wireframe until it reaches the
// centre, then "builds" (clip-path wipe). Cards tilt, and unroll into a case-study sheet.
export function work({ gsap, ScrollTrigger, motion, lenis }) {
  const section = document.querySelector('.work');
  const track = section.querySelector('.rail__track');
  const cards = [...section.querySelectorAll('.card')];
  const bar = section.querySelector('.rail__progress span');

  if (motion) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const dist = () => track.scrollWidth - innerWidth;
      const tween = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: section.querySelector('.work__pin'), start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.8,
          invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: (st) => (bar.style.width = st.progress * 100 + '%'),
        },
      });
      cards.forEach((c) => build(c, { containerAnimation: tween, start: 'left 78%' }));
    });
    mm.add('(max-width: 899px)', () => cards.forEach((c) => build(c, { start: 'top 75%' })));
  }

  function build(card, st) {
    const tl = gsap.timeline({ scrollTrigger: { trigger: card, ...st, toggleActions: 'play none none reverse' } });
    tl.fromTo(card.querySelector('.card__built'), { clipPath: 'inset(0% 0% 100% 0% round 14px)' }, { clipPath: 'inset(0% 0% 0% 0% round 14px)', duration: 1.1, ease: 'power4.inOut' })
      .to(card.querySelector('.card__wire'), { opacity: 0, duration: 0.5 }, 0.55)
      .from(card.querySelectorAll('.chips li'), { y: 12, opacity: 0, stagger: 0.04, duration: 0.5, ease: 'back.out(2)' }, 0.8);
  }

  // 3D tilt (max 8°)
  if (motion && matchMedia('(hover: hover)').matches) {
    cards.forEach((card) => {
      const frame = card.querySelector('.card__frame');
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        frame.style.transform = `rotateY(${px * 8}deg) rotateX(${-py * 8}deg)`;
      });
      card.addEventListener('pointerleave', () => (frame.style.transform = ''));
    });
  }

  /* ---------- case-study modal with hash deep-links (#work/<id>) ---------- */
  const modal = document.querySelector('.case');
  const sheet = modal.querySelector('.case__sheet');
  const content = modal.querySelector('.case__content');
  let lastFocus = null;

  const open = (id, push = true) => {
    const tpl = document.getElementById('case-' + id);
    if (!tpl) return;
    lastFocus = document.activeElement;
    content.replaceChildren(tpl.content.cloneNode(true));
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    lenis?.stop();
    if (push && location.hash !== '#work/' + id) history.pushState(null, '', '#work/' + id);
    if (motion) {
      gsap.fromTo(sheet, { yPercent: 100, scaleY: 0.4 }, { yPercent: 0, scaleY: 1, duration: 0.8, ease: 'expo.out' });
      gsap.from(content.querySelectorAll('.case__grid > section'), { y: 30, opacity: 0, stagger: 0.07, duration: 0.7, delay: 0.25, ease: 'expo.out' });
      const edges = content.querySelectorAll('.flow__edge, .flow__node');
      gsap.from(edges, { opacity: 0, scale: 0.8, transformOrigin: '50% 50%', stagger: 0.08, duration: 0.5, delay: 0.5 });
    }
    modal.querySelector('.case__close').focus();
  };
  const close = (push = true) => {
    if (modal.hidden) return;
    const done = () => { modal.hidden = true; document.body.style.overflow = ''; lenis?.start(); lastFocus?.focus?.(); };
    if (push && location.hash.startsWith('#work/')) history.pushState(null, '', '#work');
    motion ? gsap.to(sheet, { yPercent: 100, duration: 0.45, ease: 'power3.in', onComplete: done }) : done();
  };

  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a[href^="http"]')) return;
      e.preventDefault();
      open(card.dataset.id);
    });
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target === card) open(card.dataset.id); });
  });
  modal.querySelector('.case__close').addEventListener('click', () => close());
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { // focus trap
      const f = [...sheet.querySelectorAll('a, button')];
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
    }
  });
  const route = () => {
    const m = location.hash.match(/^#work\/([\w-]+)/);
    if (m) open(m[1], false); else close(false);
  };
  addEventListener('popstate', route);
  if (location.hash.startsWith('#work/')) setTimeout(route, 300);
}
