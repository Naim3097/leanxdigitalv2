// Single source of truth for company facts. Every page, the JSON-LD,
// llms.txt and the sitemap read from here, so a change here updates all of them.
// Optional fields render only when filled in. Leave them empty rather than guessing.

export const site = {
  name: 'Lean X Digital',
  alternateNames: ['lean.x digital', 'LeanX Digital'],
  // Registered company name, e.g. 'Lean X Digital Sdn. Bhd.'
  legalName: '' as string,
  // SSM registration number, e.g. '202301012345 (1234567-X)'
  registrationNumber: '' as string,
  // Year the company started, e.g. '2023'
  foundingDate: '' as string,

  url: 'https://www.leanxdigital.io',
  locale: 'en-MY',
  ogLocale: 'en_MY',
  tagline: 'We turn traffic into sales.',
  description:
    'Lean X Digital is a digital solutions company in Kuala Lumpur, Malaysia. It makes Nexova, a self-growing store website, and its team offers creative work, paid advertising, SEO, and website, CRM and app development to Malaysian businesses.',

  email: 'sales@nexovadigital.com',
  phone: '+601133095095',
  phoneDisplay: '+60 11-3309 5095',
  whatsapp:
    'https://wa.me/601133095095?text=Hi%2C%20I%27m%20interested%20to%20work%20with%20Lean%20X%20Digital',

  address: {
    street: '8trium, M1-13A-08, Tower 1, Jalan Cempaka SD 12/5',
    area: 'Bandar Sri Damansara',
    postcode: '52200',
    city: 'Kuala Lumpur',
    region: 'Wilayah Persekutuan Kuala Lumpur',
    country: 'MY',
    countryName: 'Malaysia',
  },
  geo: { lat: 3.1985, lng: 101.5882 },
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=8trium+Tower+1+Bandar+Sri+Damansara+Kuala+Lumpur',
  languages: ['English', 'Malay'],

  // Public profiles of this company only. Do not list sister companies here.
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61553581582150',
    instagram: 'https://www.instagram.com/leanxdigitalmy/',
  },

  // Put the PDF in /public with this exact name to keep the old link working.
  companyProfilePdf: '/LEANX-DIGITAL-Company-Profile.pdf',

  // Real people only, with their real roles. Shown on the About page when filled in.
  // e.g. { name: 'Aisyah Rahman', role: 'Founder', url: 'https://www.linkedin.com/in/...' }
  team: [] as { name: string; role: string; url?: string }[],

  industries: [
    'Automotive',
    'Education',
    'Property',
    'Technology',
    'Food and beverage',
    'Professional services',
    'Healthcare',
    'Manufacturing',
    'Retail',
    'Finance',
  ],

  knowsAbout: [
    'Digital marketing',
    'Ad creative',
    'Social media content',
    'Brand identity',
    'Google Ads',
    'Pay-per-click advertising',
    'Meta ads',
    'Facebook advertising',
    'Instagram advertising',
    'Search engine optimisation',
    'Website development',
    'Landing pages',
    'CRM development',
    'App development',
    'E-commerce',
    'Inventory management',
  ],
} as const;

export const fullAddress = [
  site.address.street,
  site.address.area,
  `${site.address.postcode} ${site.address.city}`,
  site.address.countryName,
].join(', ');

export const absoluteUrl = (path: string) => new URL(path, site.url).href;

export const formatDate = (iso: string) =>
  new Date(iso + 'T00:00:00+08:00').toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kuala_Lumpur',
  });
