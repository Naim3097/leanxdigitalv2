// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // The live domain. Vercel redirects leanxdigital.io to www, so www is the canonical host.
  site: 'https://www.leanxdigital.io',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Inline the CSS: no render-blocking request on a first visit. Measured Nov 2026 on a throttled
    // phone: main text painted at about 1.0 s inline versus 1.3 s with linked stylesheets.
    inlineStylesheets: 'always',
  },
  compressHTML: true,
  devToolbar: { enabled: false },
  vite: {
    build: {
      // Vite 8 targets Safari 16.4+ by default and rewrites `min-width` media queries as
      // `width >=`, which older browsers ignore. Keep the browser range the site had before.
      cssTarget: ['chrome87', 'edge88', 'firefox78', 'safari14', 'ios14'],
    },
  },
});
