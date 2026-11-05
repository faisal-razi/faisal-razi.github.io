import { session, toast } from '../fx/store.js';

// Spec-sheet contact form → Web3Forms (JSON). Works without JS as a normal POST.
export function contact({ gsap, motion }) {
  const form = document.getElementById('contact-form');
  const status = form.querySelector('.spec__status');
  const btn = form.querySelector('.spec__send');
  const msg = form.querySelector('textarea');
  const count = form.querySelector('.count');
  const plane = form.querySelector('.plane-fly');
  const no = form.querySelector('.spec__no');
  no.textContent = String(Math.floor(Math.random() * 900) + 100);

  msg.addEventListener('input', () => (count.textContent = `${msg.value.length} / 5000`));

  const rules = {
    name: (v) => (v.trim().length < 2 ? 'need a name for the title block' : ''),
    email: (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "that email won't route" : ''),
    message: (v) => (v.trim().length < 20 ? `a little more detail — ${20 - v.trim().length} chars to go` : ''),
  };
  const check = (el) => {
    const err = rules[el.name]?.(el.value) || '';
    const box = el.parentElement.querySelector('.err');
    if (box) box.textContent = err ? '✎ ' + err : '';
    el.setAttribute('aria-invalid', err ? 'true' : 'false');
    return !err;
  };
  form.querySelectorAll('input[name=name], input[name=email], textarea').forEach((el) => el.addEventListener('blur', () => check(el)));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fields = [...form.querySelectorAll('input[name=name], input[name=email], textarea')];
    const ok = fields.map(check).every(Boolean);
    if (!ok) { fields.find((f) => f.getAttribute('aria-invalid') === 'true')?.focus(); return; }
    const last = +session.get('sent') || 0;
    if (Date.now() - last < 30000) { status.className = 'spec__status bad'; status.textContent = '✗ just sent one — give it 30 seconds'; return; }

    btn.disabled = true;
    status.className = 'spec__status';
    status.textContent = '▸ plotting…';
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'failed');
      session.set('sent', String(Date.now()));
      if (motion) {
        gsap.timeline()
          .set(plane, { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1 })
          .to(plane, { x: () => innerWidth * 0.5, y: -innerHeight * 0.6, rotation: -18, scale: 0.4, duration: 1.3, ease: 'power2.in' })
          .set(plane, { opacity: 0 });
      }
      status.className = 'spec__status ok';
      status.textContent = "✓ Message delivered — I'll reply within 24h";
      toast('✓ spec received');
      form.reset();
      count.textContent = '0 / 5000';
    } catch {
      const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
      status.className = 'spec__status bad';
      status.innerHTML = `✗ Couldn't send — <a href="mailto:faisalrazi30@gmail.com?subject=${encodeURIComponent('Project enquiry: ' + data.project_type)}&body=${body}">email me directly</a>`;
    } finally {
      btn.disabled = false;
    }
  });

  // copy email
  const copy = document.querySelector('.copy-email');
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(copy.dataset.email); toast('✓ copied to clipboard'); }
    catch { location.href = 'mailto:' + copy.dataset.email; }
  });

  // live Islamabad clock
  const clock = document.querySelector('.clock');
  const txt = clock.querySelector('.clock__text');
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Karachi', hour: 'numeric', minute: '2-digit', hour12: true });
  const hr = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Karachi', hour: 'numeric', hour12: false });
  const tick = () => {
    const now = new Date();
    const h = +hr.format(now);
    txt.textContent = `It's ${fmt.format(now).toUpperCase()} in Islamabad`;
    clock.classList.toggle('is-night', h < 6 || h >= 19);
  };
  tick();
  setInterval(tick, 30000);
}
