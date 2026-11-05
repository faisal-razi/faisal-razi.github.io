import { store } from '../fx/store.js';

// Nav hides on scroll-down, returns with glass on scroll-up; theme toggle flips the sheet;
// mobile drawer links unfold like architectural drawers.
export function nav({ gsap, motion, lenis }) {
  const bar = document.querySelector('.nav');
  document.querySelectorAll('.nav__links a').forEach((a) => a.insertAdjacentHTML('beforeend', '<span class="dimline" aria-hidden="true"></span>'));

  let last = 0;
  const onScroll = () => {
    const y = scrollY;
    bar.classList.toggle('is-scrolled', y > 40);
    bar.classList.toggle('is-hidden', y > last && y > 300 && !document.body.classList.contains('drawer-open'));
    last = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // smooth anchor jumps through Lenis
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').startsWith('#work/')) return;
    const id = a.getAttribute('href');
    const el = id === '#top' || id === '#main' ? document.body : document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    closeDrawer();
    if (lenis) lenis.scrollTo(el === document.body ? 0 : el, { duration: 1.4 });
    else (el === document.body ? scrollTo(0, 0) : el.scrollIntoView());
    history.replaceState(null, '', id === '#top' ? location.pathname : id);
  });

  /* theme */
  const root = document.documentElement;
  const sheet = document.querySelector('.theme-toggle .sheet');
  document.querySelector('.theme-toggle').addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    const apply = () => { root.dataset.theme = next; store.set('theme', next); document.querySelector('meta[name=theme-color]').content = next === 'light' ? '#F4F1EA' : '#0B1D33'; };
    if (!motion) return apply();
    gsap.timeline()
      .fromTo(sheet, { yPercent: 100, skewY: -12 }, { yPercent: 0, skewY: 0, duration: 0.35, ease: 'power3.in' })
      .add(apply)
      .to(sheet, { yPercent: -100, skewY: 12, duration: 0.45, ease: 'power3.out' });
  });

  /* drawer */
  const toggle = document.querySelector('.menu-toggle');
  const drawer = document.getElementById('drawer');
  function openDrawer() {
    drawer.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('drawer-open');
    lenis?.stop();
    if (motion) gsap.from(drawer.querySelectorAll('a'), { rotateX: -90, opacity: 0, duration: 0.6, ease: 'expo.out', stagger: 0.06 });
    drawer.querySelector('a').focus();
  }
  function closeDrawer() {
    if (drawer.hidden) return;
    drawer.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('drawer-open');
    lenis?.start();
  }
  toggle.addEventListener('click', () => (drawer.hidden ? openDrawer() : closeDrawer()));
  addEventListener('keydown', (e) => e.key === 'Escape' && closeDrawer());
}
