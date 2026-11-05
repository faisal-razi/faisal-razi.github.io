import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import * as T from './src/render/templates.js';

// Custom domain (faisalrazi.runs-on.dev) → '/'. Set BASE=/repo-name/ to move it to a project repo.
const base = process.env.BASE || '/';

const load = (f) => JSON.parse(readFileSync(new URL(`./src/data/${f}`, import.meta.url), 'utf8'));

function renderData() {
  return {
    name: 'render-portfolio-data',
    transformIndexHtml(html) {
      const profile = load('profile.json');
      const projects = load('projects.json');
      const reviews = load('reviews.json');
      const sum = T.reviewSummary(reviews);
      const slots = {
        stats: T.stats(profile),
        work: T.work(projects, base),
        cases: T.cases(projects, base),
        wall: T.wall(projects, base),
        wallCounter: T.wallCounter(projects),
        clientData: T.clientData(projects),
        journey: T.journey(profile),
        skillsList: T.skillsList(profile),
        moodleStack: T.moodleStack(profile),
        ticker: T.ticker(profile),
        certs: T.certs(profile),
        reviewCards: T.reviewCards(reviews),
        reviewCountries: T.reviewCountries(reviews),
        reviewData: T.reviewData(reviews),
        reviewCount: String(sum.count),
        reviewRating: sum.rating ? sum.rating.toFixed(1) : '',
        reviewCountryCount: String(sum.countries.length),
        memberSince: reviews.memberSince || '',
        jsonLd: T.jsonLd(profile, reviews),
        formKey: profile.contact.web3formsKey,
        base,
      };
      return html.replace(/<!--@(\w+)-->|%%(\w+)%%/g, (m, a, b) => {
        const k = a || b;
        if (!(k in slots)) throw new Error(`Unknown slot ${k}`);
        return slots[k];
      });
    },
  };
}

export default defineConfig({
  base,
  plugins: [renderData()],
  build: { target: 'es2020', assetsInlineLimit: 0, chunkSizeWarningLimit: 600 },
  server: { watch: { ignored: ['**/dist/**'] } },
});
