// Portrait starts as a cyan halftone "blueprint print" and resolves into the photo on scroll.
export function dither({ gsap }) {
  const fig = document.querySelector('.portrait');
  const img = fig?.querySelector('img');
  const cv = fig?.querySelector('.portrait__dither');
  if (!img || !cv) return;

  const draw = () => {
    const w = 112, h = 154; // half-res grid → chunky dots
    cv.width = w * 4; cv.height = h * 4;
    const tmp = document.createElement('canvas');
    tmp.width = w; tmp.height = h;
    const t = tmp.getContext('2d', { willReadFrequently: true });
    t.drawImage(img, 0, 0, w, h);
    const px = t.getImageData(0, 0, w, h).data;
    const g = cv.getContext('2d');
    g.fillStyle = '#0b1d33';
    g.fillRect(0, 0, cv.width, cv.height);
    g.fillStyle = '#7cf5ff';
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const lum = (px[i] * 0.3 + px[i + 1] * 0.59 + px[i + 2] * 0.11) / 255;
      const r = Math.pow(lum, 0.9) * 2.1;
      if (r > 0.15) { g.beginPath(); g.arc(x * 4 + 2, y * 4 + 2, r, 0, Math.PI * 2); g.fill(); }
    }
  };
  const go = () => {
    try { draw(); } catch { cv.remove(); return; }
    gsap.fromTo(cv, { clipPath: 'inset(0% 0% 0% 0%)' }, {
      clipPath: 'inset(0% 0% 100% 0%)', ease: 'none',
      scrollTrigger: { trigger: fig, start: 'top 70%', end: 'center 40%', scrub: true },
    });
  };
  img.loading = 'eager';
  if (img.complete && img.naturalWidth) go(); else img.addEventListener('load', go, { once: true });
}
