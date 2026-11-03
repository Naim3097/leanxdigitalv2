import type { APIRoute } from 'astro';
import { site, fullAddress, absoluteUrl } from '../data/site';
import { products } from '../data/products';
import { services, people } from '../data/services';
import { countWord, listOf } from '../lib/text';
import { hasPublicFile } from '../lib/files';

// llms.txt (https://llmstxt.org): a plain-text summary for AI tools.
// Google does not use it; it is cheap to provide and built from the same data as the pages.
export const GET: APIRoute = () => {
  const names = listOf(products.map((p) => p.name));
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `- Website: ${absoluteUrl('/')}`,
    `- Tagline: ${site.tagline}`,
    ...(site.legalName ? [`- Registered name: ${site.legalName}`] : []),
    ...(site.registrationNumber ? [`- SSM registration: ${site.registrationNumber}`] : []),
    ...(site.foundingDate ? [`- Founded: ${site.foundingDate}`] : []),
    `- Office: ${fullAddress}`,
    `- Phone and WhatsApp: ${site.phoneDisplay}`,
    `- Email: ${site.email}`,
    '- Languages: English, Bahasa Malaysia',
    `- Instagram: ${site.social.instagram}`,
    `- Facebook: ${site.social.facebook}`,
    '',
    '## Product',
    '',
    ...products.flatMap((p) => [
      `- [${p.name}](${absoluteUrl(`/products/${p.slug}/`)}): ${p.definition}${
        p.website ? ` Website: ${p.website.url}` : ''
      }`,
      ...p.features.map(([k, v]) => `  - ${k}: ${v}`),
      ...p.facts.map(([k, v]) => `  - ${k}: ${v}`),
    ]),
    '',
    '## Services (done for you)',
    '',
    ...services.flatMap((s) => [
      `- [${s.name}](${absoluteUrl(`/services/${s.slug}/`)}): ${s.definition}`,
      ...s.facts.map(([k, v]) => `  - ${k}: ${v}`),
      ...(s.automated ? [`  - Automated in ${products[0].name}: ${s.automated.text}`] : []),
    ]),
    '',
    '## Team',
    '',
    ...people.map((m) => `- ${m.fullName}: ${m.role} (${m.focus.toLowerCase()})`),
    `- Our strategists also share how they work at ${listOf(
      people.flatMap((m) => (m.ownSite ? [`${m.ownSite.brand} (${m.ownSite.url})`] : [])),
    )}. ${people.flatMap((m) => (m.ownSite ? [m.ownSite.disclaimer] : [])).join(' ')}`,
    '',
    '## Pages',
    '',
    `- [${names}](${absoluteUrl(`/products/${products[0].slug}/`)}): the self-growing store website and what it does.`,
    `- [Services](${absoluteUrl('/services/')}): all ${countWord(services.length)} done-for-you services on one page.`,
    `- [About](${absoluteUrl('/about/')}): who we are, how Nexova and the services fit together, the team, industries and company details.`,
    `- [Contact](${absoluteUrl('/contact/')}): WhatsApp, phone, email, office address and a WhatsApp link for each service.`,
    '',
    '## Optional',
    '',
    `- [Sitemap](${absoluteUrl('/sitemap.xml')})`,
    ...(hasPublicFile(site.companyProfilePdf)
      ? [`- [Company profile (PDF)](${absoluteUrl(site.companyProfilePdf)})`]
      : []),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
