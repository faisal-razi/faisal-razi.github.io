// The Build Head: a little drafting nozzle that travels a dashed "spine" down the left
// margin of the whole document, inking the line behind it as you scroll.
export function buildHead({ gsap, ScrollTrigger }) {
  if (innerWidth < 900) return;
  const svg = document.querySelector('.spine');
  const ghost = svg.querySelector('.spine__ghost');
  const ink = svg.querySelector('.spine__ink');
  const head = document.querySelector('.buildhead');
  let samples = [], len = 0;

  const layout = () => {
    const H = document.documentElement.scrollHeight;
    const W = document.documentElement.clientWidth;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.style.height = H + 'px';
    const xL = Math.max(18, Math.min(34, W * 0.018));
    const sections = [...document.querySelectorAll('main > section')];
    let d = `M${xL} ${innerHeight * 0.6}`;
    let y = innerHeight * 0.6;
    sections.slice(1).forEach((s, i) => {
      const top = s.offsetTop + 70;
      const mid = (y + top) / 2;
      const bump = i % 2 ? 26 : 14;
      // a soft S-curve between sections, then a "station" notch at each section head
      d += ` C ${xL + bump} ${mid - 80}, ${xL - 6} ${mid + 80}, ${xL} ${top - 30}`;
      d += ` L ${xL} ${top - 6} l 10 6 l -10 6`;
      y = top + 6;
    });
    d += ` L ${xL} ${H - 120}`;
    ghost.setAttribute('d', d);
    ink.setAttribute('d', d);
    len = ink.getTotalLength();
    ink.style.strokeDasharray = `${len}`;
    samples = [];
    for (let l = 0; l <= len; l += 6) { const p = ink.getPointAtLength(l); samples.push([l, p.x, p.y]); }
    update();
  };

  const update = () => {
    if (!samples.length) return;
    const target = scrollY + innerHeight * 0.55;
    let lo = 0, hi = samples.length - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (samples[m][2] < target) lo = m + 1; else hi = m; }
    const [l, x, y] = samples[lo];
    ink.style.strokeDashoffset = `${len - l}`;
    gsap.set(head, { x: x - 13, y: y - 34 });
  };

  layout();
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update });
  ScrollTrigger.addEventListener('refresh', layout);
  new ResizeObserver(() => ScrollTrigger.refresh()).observe(document.querySelector('main'));
}
