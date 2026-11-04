# leanxdigital.io

The Lean X Digital website. Astro, static output, no client-side JavaScript.

## Commands

```bash
npm install
npm run dev        # local dev server at http://localhost:4321
npm run build      # production build into dist/
npm run preview    # serve dist/ locally
npm run check      # type-check
npm run indexnow   # after a deploy: tell Bing/IndexNow engines the pages changed
```

Needs Node 22.23.4 or newer (Astro 7's minimum). On Vercel, `engines.node` in package.json overrides
the Node.js version in Project Settings.

The `overrides` block in package.json pins `fflate` to 0.7.5. satori pins 0.7.3, which has a security
advisory (GHSA-px8p-9vwx-vf98). Remove the override once satori ships a fixed version and `npm audit`
stays clean without it.

## Editing content

All copy and facts live in `src/data/`. See [CONTENT-GUIDE.md](CONTENT-GUIDE.md) before writing anything.

- `site.ts`: company facts, services, socials. Optional fields (legal name, SSM number, founding year,
  team) appear on the site once filled in.
- `products.ts`: one entry per product. Adding an entry creates its page, share image, sitemap and
  llms.txt entries.
- `services.ts`: one entry per done-for-you service (creative agency, paid advertising, SEO,
  websites/CRM/apps), plus the team shown on the About page. Works the same way.
- `pages.ts`: last-updated dates for the home, products, services, about and contact pages.

## What gets generated

| URL | Source |
| --- | --- |
| `/sitemap.xml` | `src/pages/sitemap.xml.ts`, real `lastmod` dates from the data files |
| `/robots.txt` | `src/pages/robots.txt.ts`, allows all search and AI crawlers |
| `/llms.txt` | `src/pages/llms.txt.ts`, plain-text summary for AI tools |
| `/og/*.png` | `src/pages/og/[slug].png.ts`, 1200×630 share images rendered at build time |
| `/favicon.ico`, `/icon-*.png`, `/apple-touch-icon.png` | `src/pages/` image endpoints |
| JSON-LD on every page | `src/lib/schema.ts` |

## Deploy

Vercel builds this with `npm run build` and serves `dist/` (see `vercel.json`).
The canonical host is `https://www.leanxdigital.io`, and the bare domain redirects to it.

The company profile PDF is linked only if `public/LEANX-DIGITAL-Company-Profile.pdf` exists. Copy the
file there to keep the old download link working.
