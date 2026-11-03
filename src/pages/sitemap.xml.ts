import type { APIRoute } from 'astro';
import { allPages, staticPages } from '../data/pages';
import { site, absoluteUrl } from '../data/site';
import { hasPublicFile } from '../lib/files';

// Hand-built so <lastmod> is the real date each page changed, not the build date.
// Google ignores priority and changefreq, so they are left out.
export const GET: APIRoute = () => {
  const entries = allPages.map((p) => ({ loc: absoluteUrl(p.path), lastmod: p.updated }));
  if (hasPublicFile(site.companyProfilePdf)) {
    entries.push({ loc: absoluteUrl(site.companyProfilePdf), lastmod: staticPages[0].updated });
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map((e) => `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n  </url>`)
  .join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
