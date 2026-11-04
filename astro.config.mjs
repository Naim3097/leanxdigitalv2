// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // The live domain. Vercel redirects leanxdigital.io to www, so www is the canonical host.
  site: 'https://www.leanxdigital.io',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // CSS is small, so inline it and skip a render-blocking request.
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
