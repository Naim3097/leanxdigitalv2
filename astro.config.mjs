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
});
