// Toolbox constellation: a small force-directed graph on canvas. Disciplines are hubs,
// tools orbit them on springs. Drag anything; hover a tool to see where it was used.
export function skills({ gsap, motion }) {
  const box = document.querySelector('.constellation');
  const cv = box?.querySelector('canvas');
  if (!cv) return;
  const tip = box.querySelector('.constellation__tip');
  const lists = [...box.querySelectorAll('.skills__list li')];
  const clients = JSON.parse(document.getElementById('client-data').textContent);
  const usedIn = (tool) => clients.filter((c) => c.stack.some((s) => s.toLowerCase().includes(tool.toLowerCase().split(' ')[0]))).map((c) => c.title.split(' (')[0]);

  const nodes = [], links = [];
  lists.forEach((li, ci) => {
    const name = li.querySelector('h3').textContent;
    const hub = { label: name, hub: true, r: 9, x: 0, y: 0, vx: 0, vy: 0, c: ci };
    nodes.push(hub);
    li.querySelector('p').textContent.split(' · ').forEach((t) => {
      const n = { label: t, hub: false, r: 3.5, x: 0, y: 0, vx: 0, vy: 0, c: ci, used: usedIn(t) };
      nodes.push(n);
      links.push([hub, n]);
    });
  });
  const hubs = nodes.filter((n) => n.hub);
  for (let i = 0; i < hubs.length; i++) links.push([hubs[i], hubs[(i + 1) % hubs.length], true]);

  const ctx = cv.getContext('2d');
  let W = 0, H = 0, dpr = 1;
  const size = () => {
    const r = cv.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio, 2);
    W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();
  nodes.forEach((n, i) => {
    const a = (n.c / hubs.length) * Math.PI * 2;
    const rr = n.hub ? Math.min(W, H) * 0.28 : Math.min(W, H) * 0.36;
    n.x = W / 2 + Math.cos(a) * rr + (n.hub ? 0 : Math.cos(i) * 30);
    n.y = H / 2 + Math.sin(a) * rr + (n.hub ? 0 : Math.sin(i) * 30);
  });
  box.classList.add('is-live');
  new ResizeObserver(size).observe(cv);

  const palette = ['#7CF5FF', '#FFB547', '#34D399', '#A78BFA', '#FF8A7A', '#60A5FA'];
  let css = getComputedStyle(document.documentElement);
  new MutationObserver(() => (css = getComputedStyle(document.documentElement))).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  let hover = null, drag = null, visible = false;
  const step = () => {
    const k = Math.min(W, H);
    // repulsion
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      let dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy + 0.01;
      const f = (a.hub && b.hub ? 3200 : a.hub || b.hub ? 700 : 900) / d2;
      const d = Math.sqrt(d2); dx /= d; dy /= d;
      a.vx -= dx * f; a.vy -= dy * f; b.vx += dx * f; b.vy += dy * f;
    }
    // springs
    links.forEach(([a, b, ring]) => {
      const rest = ring ? k * 0.36 : k * 0.15;
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
      const f = (d - rest) * (ring ? 0.002 : 0.012);
      a.vx += (dx / d) * f; a.vy += (dy / d) * f; b.vx -= (dx / d) * f; b.vy -= (dy / d) * f;
    });
    nodes.forEach((n) => {
      n.vx += (W / 2 - n.x) * 0.0009; n.vy += (H / 2 - n.y) * 0.0009;
      if (n === drag) return;
      n.vx *= 0.86; n.vy *= 0.86;
      n.x = Math.max(20, Math.min(W - 20, n.x + n.vx)); n.y = Math.max(20, Math.min(H - 20, n.y + n.vy));
    });
  };
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const fg = css.getPropertyValue('--fg').trim(), muted = css.getPropertyValue('--muted').trim(), rule = css.getPropertyValue('--rule-strong').trim();
    links.forEach(([a, b, ring]) => {
      const hot = hover && (a === hover || b === hover || (hover.hub && a === hover));
      ctx.strokeStyle = hot ? palette[a.c] : rule;
      ctx.lineWidth = ring ? 0.6 : hot ? 1.4 : 0.8;
      ctx.setLineDash(ring ? [3, 5] : []);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    });
    ctx.setLineDash([]);
    nodes.forEach((n) => {
      const hot = n === hover || (hover && hover.hub && n.c === hover.c);
      ctx.fillStyle = palette[n.c];
      ctx.shadowColor = palette[n.c]; ctx.shadowBlur = hot ? 18 : n.hub ? 10 : 0;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r * (hot ? 1.5 : 1), 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = n.hub ? fg : hot ? fg : muted;
      ctx.font = n.hub ? `600 ${W < 500 ? 12 : 14}px "Space Grotesk Variable", sans-serif` : `500 ${W < 500 ? 9 : 11}px "JetBrains Mono Variable", monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(n.label, n.x, n.y + (n.hub ? -16 : 15));
    });
  };
  const loop = () => { if (!visible) return; step(); draw(); };
  if (motion) gsap.ticker.add(loop);
  else { for (let i = 0; i < 300; i++) step(); }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (!motion && visible) draw(); }).observe(cv);

  const at = (e) => {
    const r = cv.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    return nodes.find((n) => Math.hypot(n.x - x, n.y - y) < Math.max(12, n.r + 8));
  };
  cv.addEventListener('pointerdown', (e) => { drag = at(e); if (drag) cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', (e) => {
    const r = cv.getBoundingClientRect();
    if (drag) { drag.x = e.clientX - r.left; drag.y = e.clientY - r.top; drag.vx = drag.vy = 0; }
    const h = at(e);
    if (h !== hover) {
      hover = h;
      tip.textContent = !h ? '' : h.hub ? `▸ ${h.label}` : `▸ ${h.label}${h.used.length ? ' — used at ' + h.used.slice(0, 3).join(', ') : ''}`;
      if (!motion) draw();
    }
  });
  cv.addEventListener('pointerup', () => (drag = null));
  cv.addEventListener('pointerleave', () => { drag = null; hover = null; tip.textContent = ''; });
}
