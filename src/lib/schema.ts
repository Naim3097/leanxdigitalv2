// JSON-LD builders. Structured data must describe what is visible on the page,
// so these read from the same data files the pages render.
import { site, absoluteUrl } from '../data/site';
import { products, type Product } from '../data/products';
import { services, whatsappUrl, type Service, type Person } from '../data/services';

type Node = Record<string, unknown>;

export const ORG_ID = absoluteUrl('/#organization');
export const WEBSITE_ID = absoluteUrl('/#website');

export function organization(): Node {
  return {
    // Google asks for the most specific LocalBusiness type, and schema.org deprecated
    // ProfessionalService in release 30.1 (September 2026).
    '@type': ['Organization', 'LocalBusiness'],
    '@id': ORG_ID,
    name: site.name,
    alternateName: site.alternateNames,
    ...(site.legalName && { legalName: site.legalName }),
    ...(site.foundingDate && { foundingDate: site.foundingDate }),
    ...(site.registrationNumber && {
      identifier: {
        '@type': 'PropertyValue',
        propertyID: 'SSM registration number',
        value: site.registrationNumber,
      },
    }),
    url: absoluteUrl('/'),
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/icon-512.png'),
      width: 512,
      height: 512,
    },
    image: absoluteUrl('/og/default.png'),
    description: site.description,
    slogan: site.tagline,
    email: site.email,
    telephone: site.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${site.address.street}, ${site.address.area}`,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.postcode,
      addressCountry: site.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    hasMap: site.mapUrl,
    ...(site.priceRange && { priceRange: site.priceRange }),
    ...(site.openingHours.length > 0 && {
      openingHoursSpecification: site.openingHours.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.days,
        opens: h.opens,
        closes: h.closes,
      })),
    }),
    areaServed: { '@type': 'Country', name: 'Malaysia' },
    knowsAbout: site.knowsAbout,
    sameAs: Object.values(site.social).filter(Boolean),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: site.phone,
      email: site.email,
      areaServed: 'MY',
      availableLanguage: site.languages,
    },
    makesOffer: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        '@id': serviceId(s),
        name: s.name,
        url: absoluteUrl(`/services/${s.slug}/`),
      },
    })),
    brand: [
      ...products.map((p) => ({
        '@type': 'Brand',
        name: p.name,
        url: p.website?.url ?? absoluteUrl(`/products/${p.slug}/`),
      })),
    ],
    ...(site.team.length && {
      employee: site.team.map((m) => ({
        '@type': 'Person',
        name: m.name,
        jobTitle: m.role,
        ...(m.url && { sameAs: [m.url] }),
      })),
    }),
  };
}

export function website(): Node {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: absoluteUrl('/'),
    name: site.name,
    alternateName: site.alternateNames,
    inLanguage: site.locale,
    publisher: { '@id': ORG_ID },
  };
}

export function webPage(opts: {
  path: string;
  title: string;
  description: string;
  updated: string;
  type?: string;
  hasBreadcrumb?: boolean;
  about?: string;
  /** The @id of the thing the page is mainly about, e.g. the person on a profile page. */
  mainEntity?: string;
  image?: string;
}): Node {
  const url = absoluteUrl(opts.path);
  return {
    '@type': opts.type ?? 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: opts.title,
    description: opts.description,
    inLanguage: site.locale,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': opts.about ?? ORG_ID },
    ...(opts.mainEntity && { mainEntity: { '@id': opts.mainEntity } }),
    publisher: { '@id': ORG_ID },
    dateModified: opts.updated,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: absoluteUrl(opts.image ?? '/og/default.png'),
    },
    ...(opts.hasBreadcrumb && { breadcrumb: { '@id': `${url}#breadcrumb` } }),
  };
}

export function breadcrumbs(path: string, items: [string, string][]): Node {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(path)}#breadcrumb`,
    itemListElement: items.map(([name, href], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: absoluteUrl(href),
    })),
  };
}

export const softwareId = (p: Product) => absoluteUrl(`/products/${p.slug}/#software`);

export function softwareApp(p: Product): Node[] {
  const page = absoluteUrl(`/products/${p.slug}/`);
  const app: Node = {
    '@type': 'SoftwareApplication',
    '@id': softwareId(p),
    name: p.name,
    description: p.definition,
    applicationCategory: p.appCategory,
    ...(p.operatingSystem && { operatingSystem: p.operatingSystem }),
    url: p.website?.url ?? page,
    mainEntityOfPage: page,
    ...(p.website && { sameAs: [p.website.url] }),
    publisher: { '@id': ORG_ID },
    creator: { '@id': ORG_ID },
    audience: { '@type': 'Audience', audienceType: p.audience },
  };
  if (!p.offer) return [app];
  // The published price belongs to the hardware kit, so it is described as its own Product.
  const kit: Node = {
    '@type': 'Product',
    '@id': `${page}#kit`,
    name: p.offer.name,
    brand: { '@type': 'Brand', name: p.name },
    isRelatedTo: { '@id': softwareId(p) },
    offers: {
      '@type': 'Offer',
      price: p.offer.price,
      priceCurrency: p.offer.currency,
      url: p.offer.url,
    },
  };
  return [app, kit];
}

export function faqPage(path: string, faqs: readonly (readonly [string, string])[]): Node {
  return {
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(path)}#faq`,
    mainEntity: faqs.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export const serviceId = (s: Service) => absoluteUrl(`/services/${s.slug}/#service`);
export const personId = (m: Person) => absoluteUrl(`/about/#${m.slug}`);

export function person(m: Person): Node {
  return {
    '@type': 'Person',
    '@id': personId(m),
    name: m.fullName,
    alternateName: m.name,
    jobTitle: m.role,
    description: m.bio,
    knowsAbout: m.knowsAbout,
    affiliation: { '@id': ORG_ID },
    ...(m.sameAs && { sameAs: m.sameAs }),
  };
}

export function serviceNodes(s: Service): Node[] {
  const page = absoluteUrl(`/services/${s.slug}/`);
  const service: Node = {
    '@type': 'Service',
    '@id': serviceId(s),
    name: s.name,
    serviceType: s.serviceType,
    description: s.definition,
    url: page,
    mainEntityOfPage: page,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Malaysia' },
    audience: { '@type': 'BusinessAudience', audienceType: s.audience },
    availableChannel: {
      '@type': 'ServiceChannel',
      name: 'WhatsApp',
      serviceUrl: whatsappUrl(s),
      servicePhone: {
        '@type': 'ContactPoint',
        telephone: site.phone,
        contactType: 'sales',
        availableLanguage: site.languages,
      },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: s.includesTitle,
      itemListElement: s.includes.map(([name, description]) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name, description },
      })),
    },
  };
  return [service];
}

export function serviceList(path: string): Node {
  return {
    '@type': 'ItemList',
    '@id': `${absoluteUrl(path)}#services`,
    name: `Services run by ${site.name}`,
    numberOfItems: services.length,
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(`/services/${s.slug}/`),
      name: s.name,
    })),
  };
}

export function productList(path: string): Node {
  return {
    '@type': 'ItemList',
    '@id': `${absoluteUrl(path)}#products`,
    name: `Products made by ${site.name}`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(`/products/${p.slug}/`),
      name: p.name,
    })),
  };
}
