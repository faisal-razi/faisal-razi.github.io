// Build-time renderer: turns the JSON data into static HTML so the page reads
// perfectly without JavaScript. JS only enhances what is already there.

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const isTodo = (v) => v == null || (typeof v === 'string' && /^TODO/i.test(v));
const clean = (arr = []) => arr.filter((v) => !isTodo(v));

export const CC = {
  'United Kingdom': 'GB', 'United States': 'US', Ireland: 'IE', Canada: 'CA', Spain: 'ES', Cyprus: 'CY',
  'South Africa': 'ZA', Pakistan: 'PK', 'Sri Lanka': 'LK', Ghana: 'GH', Germany: 'DE', Australia: 'AU',
  India: 'IN', Qatar: 'QA', Philippines: 'PH', Netherlands: 'NL', France: 'FR', UAE: 'AE', USA: 'US',
  International: 'INTL', 'International (London HQ)': 'GB',
};

const initials = (t) => t.replace(/\(.*?\)/g, '').split(/\s+/).filter((w) => /^[A-Z]/.test(w)).slice(0, 3).map((w) => w[0]).join('');

const logoImg = (p, base, cls = '') =>
  p.logo
    ? `<img class="${cls}" src="${base}${p.logo}" alt="${esc(p.title)} logo" loading="lazy" decoding="async">`
    : `<span class="monogram ${cls}" aria-label="${esc(p.title)}">${esc(initials(p.title))}</span>`;

/* ---------------- STATS ---------------- */
export function stats(profile) {
  return profile.stats
    .map(
      (s, i) => `
    <li class="stat" data-reveal>
      <span class="dim dim--top" aria-hidden="true"><i></i><b>S${String(i + 1).padStart(2, '0')}</b><i></i></span>
      <strong class="stat__num"><span data-count="${s.value}" data-decimals="${s.decimals || 0}">${s.value}</span><em>${esc(s.suffix)}</em></strong>
      <span class="stat__label">${esc(s.label)}</span>
    </li>`
    )
    .join('');
}

/* ---------------- FEATURED WORK ---------------- */
export function work(projects, base) {
  const featured = projects.filter((p) => p.featured);
  return featured
    .map((p, i) => {
      const metrics = clean(p.metrics);
      const stack = clean(p.stack);
      return `
    <article class="card" id="work-${p.id}" data-id="${p.id}" data-cursor="view" data-cats="${esc(clean(p.category).join('|'))}" tabindex="0" aria-label="${esc(p.title)} case study">
      <div class="card__frame">
        <div class="card__wire" aria-hidden="true">
          <span class="wire-box wire-box--img"><svg viewBox="0 0 100 60" preserveAspectRatio="none"><path d="M0 0L100 60M100 0L0 60"/></svg></span>
          <span class="wire-line" style="width:72%"></span><span class="wire-line" style="width:54%"></span><span class="wire-line" style="width:63%"></span>
          <span class="wire-anno">← ${420 + i * 12}px →</span>
        </div>
        <div class="card__built">
          <div class="card__cover" data-bg="${p.logoBg}">
            <span class="card__index">${String(i + 1).padStart(2, '0')}</span>
            ${logoImg(p, base, 'card__logo')}
            <span class="card__sector">${esc(p.sector)}</span>
          </div>
          <div class="card__body">
            <p class="card__meta"><span>${esc(isTodo(p.year) ? '' : p.year)}</span><span>${esc(isTodo(p.role) ? '' : p.role)}</span></p>
            <h3 class="card__title">${esc(p.title)}</h3>
            <p class="card__hook">${esc(p.about)}</p>
            ${metrics.length ? `<ul class="card__metrics">${metrics.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>` : ''}
            <ul class="chips">${stack.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
            <p class="card__links"><a href="${esc(p.url)}" target="_blank" rel="noopener">Live ↗</a><a href="#work/${p.id}" class="js-case">Case study →</a></p>
          </div>
          <span class="card__glare" aria-hidden="true"></span>
        </div>
      </div>
    </article>`;
    })
    .join('');
}

/* ---------------- CASE STUDY TEMPLATES (hidden, cloned into the modal) ---------------- */
export function cases(projects, base) {
  return projects
    .filter((p) => p.featured)
    .map((p) => {
      const flow = p.flow || [];
      const w = 160;
      const svg = `<svg class="flow" viewBox="0 0 ${flow.length * w} 120" role="img" aria-label="Architecture: ${esc(flow.join(' to '))}">
        ${flow
          .map(
            (n, i) => `<g transform="translate(${i * w + 10},30)"><rect class="flow__node" width="${w - 40}" height="56" rx="10"/><text x="${(w - 40) / 2}" y="33" text-anchor="middle">${esc(n)}</text></g>${
              i < flow.length - 1 ? `<path class="flow__edge" d="M${i * w + w - 30} 58 H${i * w + w + 10}" marker-end="url(#arrow)"/>` : ''
            }`
          )
          .join('')}
        <defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>
      </svg>`;
      const roleLine = [isTodo(p.role) ? '' : p.role, isTodo(p.year) ? '' : p.year].filter(Boolean).join(' · ');
      return `
    <template id="case-${p.id}">
      <header class="case__head">
        <div class="case__logo" data-bg="${p.logoBg}">${logoImg(p, base)}</div>
        <div><p class="eyebrow">// CASE STUDY — ${esc(p.short)}</p><h2 class="case__title">${esc(p.title)}</h2>${roleLine ? `<p class="case__role">${esc(roleLine)}</p>` : ''}</div>
      </header>
      <div class="case__grid">
        <section><h3><span>01</span>Context</h3><p>${esc(p.about)} <span class="muted">${esc(p.sector)} · ${esc(isTodo(p.country) ? '' : p.country)}</span></p></section>
        <section><h3><span>02</span>What I built</h3><ul>${clean(p.work).map((x) => `<li>${esc(x)}</li>`).join('')}</ul></section>
        <section class="case__wide"><h3><span>03</span>Architecture</h3>${svg}</section>
        ${clean(p.metrics).length ? `<section><h3><span>04</span>Result</h3><ul class="case__metrics">${clean(p.metrics).map((m) => `<li>${esc(m)}</li>`).join('')}</ul></section>` : ''}
        <section><h3><span>05</span>Stack</h3><ul class="chips">${clean(p.stack).map((s) => `<li>${esc(s)}</li>`).join('')}</ul></section>
      </div>
      <p class="case__cta"><a class="btn btn--amber" href="${esc(p.url)}" target="_blank" rel="noopener">Visit ${esc(p.short)} ↗</a></p>
    </template>`;
    })
    .join('');
}

/* ---------------- CLIENT WALL ---------------- */
function tile(p, base, dup = false) {
  const mask = p.logo ? `style="--logo:url('${base}${p.logo.replace('logos/', 'logos/mask/').replace(/\.(png|svg|webp)$/, '.webp')}')"` : '';
  return `<li class="tile${p.logo ? '' : ' tile--mono'}" ${dup ? 'aria-hidden="true"' : ''}>
    <button class="tile__btn" type="button" data-client="${p.id}" ${dup ? 'tabindex="-1"' : ''} aria-label="${esc(p.title)} — details">
      <span class="tile__inner">
        <span class="tile__face tile__face--ink" ${mask}>${p.logo ? '' : `<span class="monogram">${esc(initials(p.title))}</span>`}</span>
        <span class="tile__face tile__face--color" data-bg="${p.logoBg}">${logoImg(p, base)}</span>
      </span>
    </button>
  </li>`;
}

export function wall(projects, base) {
  const a = projects.slice(0, 8);
  const b = projects.slice(8);
  const row = (list, dir) =>
    `<div class="marquee" data-dir="${dir}"><ul class="marquee__track">${list.map((p) => tile(p, base)).join('')}${list
      .map((p) => tile(p, base, true))
      .join('')}</ul></div>`;
  return row(a, 1) + row(b, -1);
}

export function clientData(projects) {
  // compact data for the popover
  return JSON.stringify(
    projects.map((p) => ({
      id: p.id, title: p.title, url: p.url, sector: p.sector, about: p.about,
      country: isTodo(p.country) ? '' : p.country, cc: CC[p.country] || '',
      role: isTodo(p.role) ? '' : p.role, stack: clean(p.stack), cats: clean(p.category),
    }))
  ).replace(/</g, '\\u003c');
}

export function wallCounter(projects) {
  const countries = [...new Set(projects.map((p) => p.country).filter((c) => !isTodo(c) && !/International/.test(c)))];
  return `<span><b>${projects.length}</b> institutions</span><span><b>${countries.length}</b> countries</span>${countries
    .map((c) => `<span class="cc">${esc(CC[c] || c)}</span>`)
    .join('')}`;
}

/* ---------------- JOURNEY (metro map) ---------------- */
export function journey(profile) {
  const tracks = { teach: 'Teaching line', learn: 'Study line', build: 'Engineering line', lms: 'LMS line' };
  const ys = { learn: 70, teach: 150, build: 230, lms: 310 };
  const x0 = 190, x1 = 1520, y0 = 2015, y1 = 2026;
  const X = (y) => x0 + ((y - y0) / (y1 - y0)) * (x1 - x0);
  const years = [];
  for (let y = y0; y <= y1; y++) years.push(y);
  const lines = Object.keys(tracks)
    .map((t) => {
      const items = profile.journey.filter((j) => j.track === t);
      const segs = items
        .map((j) => `<path class="metro__seg metro__seg--${t}" d="M${X(j.from)} ${ys[t]} H${Math.max(X(j.to), X(j.from) + 26)}"/>`)
        .join('');
      return `<g class="metro__track"><text class="metro__label" x="12" y="${ys[t] + 4}">${tracks[t]}</text><path class="metro__rail" d="M${x0} ${ys[t]} H${x1}"/>${segs}</g>`;
    })
    .join('');
  const stations = profile.journey
    .map((j, i) => {
      const x = X(j.from), y = ys[j.track];
      return `<g class="station" data-i="${i}" transform="translate(${x},${y})" tabindex="0" role="button" aria-label="${esc(j.from)}: ${esc(j.role)} at ${esc(j.org)}"><circle r="11" class="station__ring"/><circle r="4.5" class="station__dot"/></g>`;
    })
    .join('');
  // the long-haul arc: Vehari (build line 2018) to Sydney (lms line 2018)
  const ax = X(2018), ex = X(2020), arc = `M${ax} ${ys.build} C ${ax + 30} ${ys.build - 230}, ${ex - 40} ${ys.build - 260}, ${ex} ${ys.lms}`;
  const yearTicks = years.map((y) => `<g transform="translate(${X(y)},372)"><path d="M0 -6V0" class="metro__tick"/><text y="20" text-anchor="middle">${y === 2026 ? 'now' : y}</text></g>`).join('');
  const cards = profile.journey
    .map(
      (j, i) => `<li class="stop" data-i="${i}" data-track="${j.track}">
      <p class="stop__when">${j.from}${j.to !== j.from ? `–${j.to === 2026 ? 'now' : j.to}` : ''} · ${esc(j.city)}${j.remote ? ' · remote' : ''}</p>
      <h3 class="stop__org">${esc(j.org)}</h3><p class="stop__role">${esc(j.role)}</p>
      <ul>${j.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></li>`
    )
    .join('');
  return `
  <div class="metro__scroller"><svg class="metro" viewBox="0 0 1560 400" role="img" aria-label="Career timeline from 2015 to now drawn as a metro map">
    <defs><pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" class="metro__dotgrid"/></pattern></defs>
    <rect width="1560" height="400" fill="url(#dots)" opacity=".5"/>
    ${lines}
    <path id="haul" class="metro__haul" d="${arc}"/>
    <text class="metro__haul-label" x="${ex + 24}" y="${ys.build - 150}">Vehari 🡒 Sydney · 11,000 km, remote</text>
    <g class="plane" aria-hidden="true"><path d="M-12 -8 L14 0 L-12 8 L-6 0 Z"/></g>
    ${stations}${yearTicks}
  </svg></div>
  <ol class="stops">${cards}</ol>`;
}

/* ---------------- SKILLS ---------------- */
export function skillsList(profile) {
  return Object.entries(profile.skills)
    .map(([cat, tools]) => `<li><h3>${esc(cat)}</h3><p>${tools.map(esc).join(' · ')}</p></li>`)
    .join('');
}
export function moodleStack(profile) {
  return profile.moodleStack.map((s, i) => `<li style="--i:${i}"><span>${String(i + 1).padStart(2, '0')}</span>${esc(s)}</li>`).join('');
}
export function ticker(profile) {
  const all = [...new Set(Object.values(profile.skills).flat())];
  const items = all.map((t) => `<li>${esc(t)}</li>`).join('<li class="sep" aria-hidden="true">✦</li>');
  return `<ul class="ticker__track">${items}<li class="sep" aria-hidden="true">✦</li>${items.replace(/<li>/g, '<li aria-hidden="true">')}</ul>`;
}

/* ---------------- CERTS ---------------- */
export function certs(profile) {
  return profile.certifications
    .map(
      (c, i) => `<li class="stamp" style="--r:${[-6, 4, -2, 7, -5, 3, -8, 5, -3][i % 9]}deg"><span class="stamp__ring"><b>${esc(c.name)}</b><em>${esc(c.by)}</em>${
        c.year ? `<i>${esc(c.year)}</i>` : '<i>✓ VERIFIED</i>'
      }</span></li>`
    )
    .join('');
}

/* ---------------- REVIEWS ---------------- */
export function reviewCards(reviews) {
  const list = reviews.reviews.filter((r) => !r._example && r.featured);
  return list
    .map(
      (r, i) => `<li class="note" style="--rot:${[-2, 1.5, -1, 2, -1.5, 1][i % 6]}deg">
      <span class="note__pin" aria-hidden="true"></span>
      <p class="note__stars" aria-label="${r.rating} out of 5 stars">${'★'.repeat(r.rating)}</p>
      <blockquote>“${esc(r.text)}”</blockquote>
      <p class="note__who"><span class="cc">${esc(CC[r.country] || '')}</span><b>${esc(r.name)}</b><span>${esc(r.country)} · ${r.year}${r.service ? ` · ${esc(r.service)}` : ''}</span></p>
      <span class="note__via">via Fiverr</span>
    </li>`
    )
    .join('');
}
export function reviewSummary(reviews) {
  const list = reviews.reviews.filter((r) => !r._example);
  const countries = [...new Set(list.map((r) => r.country))];
  return { count: reviews.reviewCount ?? list.length, rating: reviews.rating, countries, list };
}
export function reviewCountries(reviews) {
  const { list, countries } = reviewSummary(reviews);
  return countries
    .map((c) => `<li><span class="cc">${esc(CC[c] || c)}</span>${esc(c)} <b>${list.filter((r) => r.country === c).length}</b></li>`)
    .join('');
}
export function reviewData(reviews) {
  return JSON.stringify(reviewSummary(reviews).list.map((r) => ({ n: r.name, c: r.country, cc: CC[r.country] || '', y: r.year, t: r.text, s: r.service })))
    .replace(/</g, '\\u003c');
}

export function jsonLd(profile, reviews) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    url: profile.links.site,
    email: `mailto:${profile.links.email}`,
    image: profile.links.site + profile.portrait,
    sameAs: [profile.links.linkedin, profile.links.fiverr, profile.links.github],
    alumniOf: [{ '@type': 'CollegeOrUniversity', name: 'University of Agriculture, Faisalabad' }, { '@type': 'CollegeOrUniversity', name: 'Bahauddin Zakariya University' }],
    knowsAbout: ['Moodle', 'PHP', 'Laravel', 'Yii2', 'LMS architecture', 'REST APIs', 'SCORM', 'H5P'],
    address: { '@type': 'PostalAddress', addressLocality: 'Islamabad', addressCountry: 'PK' },
  };
  // No aggregateRating: Google treats ratings a person publishes about themselves as
  // self-serving review markup, so the Fiverr rating stays visible text only.
  return JSON.stringify(ld);
}

export { esc };
