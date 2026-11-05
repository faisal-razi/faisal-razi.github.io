// Fiverr reviews: stars fill one by one, sticky notes pin themselves to the board,
// the board scrolls by drag, and "All reviews" opens a filterable masonry sheet.
export function reviews({ gsap, ScrollTrigger, motion, lenis }) {
  const board = document.querySelector('.board');
  if (!board) return;

  // drag-to-scroll with momentum
  let down = false, sx = 0, sl = 0, v = 0, lx = 0, raf = 0, moved = false;
  board.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    down = true; moved = false; sx = lx = e.clientX; sl = board.scrollLeft; v = 0;
    board.classList.add('is-drag'); cancelAnimationFrame(raf);
  });
  addEventListener('pointermove', (e) => {
    if (!down) return;
    board.scrollLeft = sl - (e.clientX - sx);
    v = e.clientX - lx; lx = e.clientX;
    if (Math.abs(e.clientX - sx) > 4) moved = true;
  });
  addEventListener('pointerup', () => {
    if (!down) return;
    down = false; board.classList.remove('is-drag');
    const glide = () => { board.scrollLeft -= v; v *= 0.94; if (Math.abs(v) > 0.4) raf = requestAnimationFrame(glide); };
    glide();
  });
  board.addEventListener('click', (e) => moved && e.preventDefault(), true);
  board.addEventListener('wheel', (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.stopPropagation(); }, { passive: true });
  board.setAttribute('data-lenis-prevent-horizontal', '');

  if (motion) {
    gsap.from('.bigstars__row i', { scale: 0, rotation: -90, opacity: 0, duration: 0.6, ease: 'back.out(3)', stagger: 0.12, scrollTrigger: { trigger: '.reviews__head', start: 'top 75%' } });
    gsap.from('.bigstars__num', { y: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.reviews__head', start: 'top 75%' } });
    gsap.from('.reviews__countries li', { opacity: 0, y: 10, duration: 0.5, stagger: 0.03, scrollTrigger: { trigger: '.reviews__countries', start: 'top 85%' } });
    gsap.from('.note', { y: -80, opacity: 0, rotation: () => gsap.utils.random(-12, 12), duration: 0.9, ease: 'bounce.out', stagger: 0.08, clearProps: 'transform', scrollTrigger: { trigger: '.board', start: 'top 80%' } });
    // slow autoplay drift; pauses on hover/focus/drag
    let paused = false;
    const drift = () => { if (!paused && !down && ScrollTrigger.isInViewport(board)) { board.scrollLeft += 0.35; if (board.scrollLeft >= board.scrollWidth - board.clientWidth - 1) board.scrollLeft = 0; } };
    gsap.ticker.add(drift);
    ['pointerenter', 'focusin', 'touchstart'].forEach((ev) => board.addEventListener(ev, () => (paused = true), { passive: true }));
    ['pointerleave', 'focusout'].forEach((ev) => board.addEventListener(ev, () => (paused = false)));
  }

  /* ---------- All reviews overlay ---------- */
  const data = JSON.parse(document.getElementById('review-data').textContent);
  const ov = document.querySelector('.allrev');
  const grid = ov.querySelector('.allrev__grid');
  const sel = ov.querySelector('.allrev__filter');
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  [...new Set(data.map((r) => r.c))].sort().forEach((c) => sel.insertAdjacentHTML('beforeend', `<option value="${esc(c)}">${esc(c)} (${data.filter((r) => r.c === c).length})</option>`));
  const render = () => {
    const f = sel.value;
    grid.innerHTML = data.filter((r) => !f || r.c === f).map((r) => `<li><p class="st" aria-label="5 stars">★★★★★</p><p>“${esc(r.t)}”</p><small><span class="cc">${esc(r.cc)}</span>${esc(r.n)} · ${esc(r.c)} · ${r.y}</small></li>`).join('');
    if (motion) gsap.from(grid.children, { opacity: 0, y: 14, duration: 0.4, stagger: 0.015 });
  };
  let opener;
  const open = () => { opener = document.activeElement; render(); ov.hidden = false; document.body.style.overflow = 'hidden'; lenis?.stop(); ov.querySelector('.allrev__close').focus(); };
  const close = () => { ov.hidden = true; document.body.style.overflow = ''; lenis?.start(); opener?.focus(); };
  document.querySelector('.js-all-reviews').addEventListener('click', open);
  ov.querySelector('.allrev__close').addEventListener('click', close);
  ov.addEventListener('click', (e) => e.target === ov && close());
  sel.addEventListener('change', render);
  addEventListener('keydown', (e) => !ov.hidden && e.key === 'Escape' && close());
}
