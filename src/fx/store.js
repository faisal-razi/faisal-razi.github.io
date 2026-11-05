// Browser storage can throw (private mode, blocked site data) — never let it break the page.
const wrap = (s) => ({
  get(k) { try { return s.getItem(k); } catch { return null; } },
  set(k, v) { try { s.setItem(k, v); } catch { /* ignore */ } },
});
export const store = wrap(globalThis.localStorage ?? { getItem() { return null; }, setItem() {} });
export const session = wrap(globalThis.sessionStorage ?? { getItem() { return null; }, setItem() {} });

export const toast = (msg) => {
  const t = document.querySelector('.toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('is-on');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('is-on'), 2200);
};
