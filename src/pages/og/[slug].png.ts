import type { APIRoute, GetStaticPaths } from 'astro';
import { site } from '../../data/site';
import { products } from '../../data/products';
import { services } from '../../data/services';
import { listOf } from '../../lib/text';
import { ogImage } from '../../lib/images';

// One 1200x630 share image per product and service, plus /og/default.png for every other page.
export const getStaticPaths: GetStaticPaths = () => [
  { params: { slug: 'default' } },
  ...products.map((p) => ({ params: { slug: p.slug } })),
  ...services.map((s) => ({ params: { slug: s.slug } })),
];

export const GET: APIRoute = async ({ params }) => {
  const p = products.find((x) => x.slug === params.slug);
  const s = services.find((x) => x.slug === params.slug);
  const png = p
    ? await ogImage({
        eyebrow: p.category,
        headline: p.name,
        sub: p.summary,
        footLeft: `A ${site.name} product`,
        footRight: p.website?.label ?? 'leanxdigital.io',
      })
    : s
      ? await ogImage({
          eyebrow: s.category,
          headline: s.name,
          sub: s.summary,
          footLeft: `A ${site.name} service`,
          footRight: 'leanxdigital.io',
        })
      : await ogImage({
          eyebrow: 'Digital solutions · Kuala Lumpur',
          headline: site.tagline,
          sub: `${listOf(products.map((x) => x.name))}, the store website that grows itself. And a team for creative, ads, SEO and development.`,
          footLeft: 'leanxdigital.io',
          footRight: 'Kuala Lumpur, Malaysia',
        });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
