import { products } from './products';
import { services } from './services';

// Every indexable page and the date its content last changed.
// The sitemap's <lastmod> comes from here, so only bump a date when the page really changed.
export const staticPages = [
  { path: '/', updated: '2026-11-03' },
  { path: '/products/', updated: '2026-11-03' },
  { path: '/services/', updated: '2026-11-03' },
  { path: '/about/', updated: '2026-11-03' },
  { path: '/contact/', updated: '2026-11-03' },
];

export const allPages = [
  ...staticPages,
  ...products.map((p) => ({ path: `/products/${p.slug}/`, updated: p.updated })),
  ...services.map((s) => ({ path: `/services/${s.slug}/`, updated: s.updated })),
];

export const updatedFor = (path: string) =>
  allPages.find((p) => p.path === path)?.updated ?? staticPages[0].updated;
