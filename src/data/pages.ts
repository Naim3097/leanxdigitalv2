import { products } from './products';
import { services, people, profileReady } from './services';
import { liveCaseStudies } from './work';

// Every indexable page and the date its content last changed.
// The sitemap's <lastmod> comes from here, so only bump a date when the page really changed.
export const staticPages = [
  { path: '/', updated: '2026-11-03' },
  { path: '/products/', updated: '2026-11-03' },
  { path: '/services/', updated: '2026-11-03' },
  { path: '/about/', updated: '2026-11-03' },
  { path: '/contact/', updated: '2026-11-03' },
];

const aboutUpdated = staticPages.find((p) => p.path === '/about/')?.updated ?? staticPages[0].updated;

export const allPages = [
  ...staticPages,
  ...products.map((p) => ({ path: `/products/${p.slug}/`, updated: p.updated })),
  ...services.map((s) => ({ path: `/services/${s.slug}/`, updated: s.updated })),
  // Case studies and profile pages join only once they are live, never as drafts.
  ...(liveCaseStudies.length > 0
    ? [{ path: '/work/', updated: liveCaseStudies.map((c) => c.updated).sort().at(-1) ?? aboutUpdated }]
    : []),
  ...liveCaseStudies.map((c) => ({ path: `/work/${c.slug}/`, updated: c.updated })),
  ...people.filter(profileReady).map((m) => ({ path: `/about/${m.slug}/`, updated: aboutUpdated })),
];

export const updatedFor = (path: string) =>
  allPages.find((p) => p.path === path)?.updated ?? staticPages[0].updated;
