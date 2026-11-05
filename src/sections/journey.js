// Route map: metro lines draw themselves on scroll, a paper plane flies the long-haul
// Vehari → Sydney arc, and stations light up their matching stop card.
export function journey({ gsap, ScrollTrigger, motion }) {
  const svg = document.querySelector('.metro');
  if (!svg) return;
  const stations = [...svg.querySelectorAll('.station')];
  const stops = [...document.querySelectorAll('.stop')];

  const light = (i, on) => {
    stations[i]?.classList.toggle('is-on', on);
    stops[i]?.classList.toggle('is-on', on);
  };
  stations.forEach((s, i) => {
    s.addEventListener('pointerenter', () => light(i, true));
    s.addEventListener('pointerleave', () => light(i, false));
    s.addEventListener('focus', () => light(i, true));
    s.addEventListener('blur', () => light(i, false));
    s.addEventListener('click', () => stops[i]?.scrollIntoView({ behavior: motion ? 'smooth' : 'auto', block: 'center' }));
    s.addEventListener('keydown', (e) => e.key === 'Enter' && s.dispatchEvent(new Event('click')));
  });
  stops.forEach((c, i) => {
    c.addEventListener('pointerenter', () => light(i, true));
    c.addEventListener('pointerleave', () => light(i, false));
  });

  const haul = svg.querySelector('#haul');
  const plane = svg.querySelector('.plane');
  const L = haul.getTotalLength();
  const placePlane = (p) => {
    const a = haul.getPointAtLength(p * L), b = haul.getPointAtLength(Math.min(L, p * L + 1));
    const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    plane.setAttribute('transform', `translate(${a.x},${a.y}) rotate(${ang})`);
  };

  if (!motion) { placePlane(1); return; }

  const segs = svg.querySelectorAll('.metro__seg');
  segs.forEach((s) => { const l = s.getTotalLength(); s.style.strokeDasharray = l; s.style.strokeDashoffset = l; });
  haul.style.strokeDasharray = `${L}`; haul.style.strokeDashoffset = L;

  const tl = gsap.timeline({ scrollTrigger: { trigger: '.metro__scroller', start: 'top 75%', end: 'bottom 35%', scrub: 0.8 } });
  tl.to(segs, { strokeDashoffset: 0, ease: 'none', stagger: 0.12, duration: 1 })
    .from(stations, { scale: 0, transformOrigin: 'center', stagger: 0.06, duration: 0.3 }, 0)
    .to(haul, { strokeDashoffset: 0, ease: 'none', duration: 1.2, onUpdate() { placePlane(this.progress()); } }, 0.5)
    .fromTo(haul, { strokeDasharray: `${L}` }, { strokeDasharray: '6 7', duration: 0.01 });
  gsap.set(plane, { opacity: 0 });
  ScrollTrigger.create({ trigger: '.metro__scroller', start: 'top 60%', once: true, onEnter: () => gsap.to(plane, { opacity: 1 }) });
  placePlane(0);

  gsap.from(stops, { y: 30, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: '.stops', start: 'top 85%' } });
}
