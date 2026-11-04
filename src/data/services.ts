// Done-for-you services, run by the Lean X Digital team. The site speaks as the company:
// services carry no personal names. The team is introduced once, on the About page.
// Everything here appears on the site and in JSON-LD and llms.txt, so keep it true and current.
// When a fact changes, edit it here and bump `updated` to the date of the change.
import { site, whatsappLink } from './site';
import { showDrafts } from '../lib/drafts';

export interface Person {
  /** Used in URLs and JSON-LD ids. */
  slug: string;
  name: string;
  fullName: string;
  role: string;
  /** What they handle at Lean X Digital, in a few words. */
  focus: string;
  bio: string;
  knowsAbout: string[];
  sameAs?: string[];
  /** A real headshot in /public, e.g. '/team/izzad-iskandar.jpg'. Square, at least 800 px. */
  photo?: string;
  /** Their own site, mentioned once on the About page. Keep these mentions to a minimum. */
  ownSite?: { brand: string; url: string; disclaimer: string };
}

export interface Service {
  slug: string;
  name: string;
  /** For running text and lists, where commas in the name would confuse. */
  short: string;
  category: string;
  serviceType: string;
  /** One line for lists. */
  summary: string;
  /** First paragraph of the service page. Starts with "<Name> is ...". */
  definition: string;
  audience: string;
  seoTitle: string;
  metaDescription: string;
  /** Pre-filled WhatsApp text. Follows "Hi Lean X Digital! ". */
  whatsappAsk: string;
  /** The Nexova feature that does this work automatically, if there is one. */
  automated?: { feature: string; text: string };
  facts: [string, string][];
  includesTitle: string;
  includes: [string, string][];
  stepsTitle: string;
  steps: string[];
  sections: { title: string; body: string[] }[];
  faqs: [string, string][];
  /** Starting price, only once decided. Never estimate. e.g. { from: 'RM 2,500', per: 'month', asOf: 'November 2026' } */
  pricing?: { from: string; per: string; asOf: string };
  /** ISO date this page's content last changed. */
  updated: string;
}

// The team, shown on the About page only. Numbers in the bios are as the two have
// published them (checked 2026-11-03). Keep them the same everywhere.
export const people: Person[] = [
  {
    slug: 'izzad-iskandar',
    name: 'Izzad Iskandar',
    fullName: 'Izzad Iskandar Hidzir',
    role: 'Meta creative ads strategist, co-founder of Nexova',
    focus: 'Creative and Meta ads',
    bio: 'Trained in architecture, with more than six years in brand identity, UI/UX, editorial design and video. Has co-led over RM 2.5 million in sales and directed creative for up to 30 client accounts at once.',
    knowsAbout: [
      'Meta ads',
      'Facebook advertising',
      'Instagram advertising',
      'Ad creative',
      'Brand identity',
      'Short-form video',
      'UI/UX design',
      'Art direction',
    ],
    sameAs: ['https://www.instagram.com/byizzadiskandar/'],
    ownSite: {
      brand: 'FacebookAds.my',
      url: 'https://facebookads.my/',
      disclaimer: 'FacebookAds.my is not affiliated with Meta Platforms, Inc.',
    },
  },
  {
    slug: 'muhammad-danisy',
    name: 'Muhammad Danisy',
    fullName: 'Muhammad Danisy Bin Amaludin',
    role: 'Google Ads and performance marketing strategist, co-founder of Nexova',
    focus: 'Google Ads, SEO and development',
    bio: 'More than five years in performance marketing across Malaysia and Singapore. Has managed over RM 300,000 in ad spend and handled up to 30 client accounts at a time.',
    knowsAbout: [
      'Google Ads',
      'Keyword research',
      'Search engine optimisation',
      'Google Analytics 4',
      'Google Tag Manager',
      'Landing pages',
      'Conversion rate optimisation',
      'Lead generation',
    ],
    ownSite: {
      brand: 'GoogleAdsAgency.my',
      url: 'https://www.googleadsagency.com.my/',
      disclaimer: 'GoogleAdsAgency.my is not affiliated with Google LLC.',
    },
  },
];

/** A strategist's own profile page needs a real photo and a LinkedIn link before it goes live. */
export const profileReady = (m: Person) =>
  Boolean(m.photo && m.sameAs?.some((u) => u.includes('linkedin.com')));

/** Profile pages are built in previews as drafts, and in production once ready. */
export const hasProfilePage = (m: Person) => showDrafts || profileReady(m);

/** WhatsApp link to the company number, pre-filled for this service. */
export const whatsappUrl = (s: Service) => whatsappLink(`Hi Lean X Digital! ${s.whatsappAsk}`);

export const services: Service[] = [
  {
    slug: 'creative-agency',
    name: 'Creative agency',
    short: 'creative work',
    category: 'Ad creative and brand',
    serviceType: 'Ad creative, social media content, brand identity and video',
    summary: 'Ad posters, short videos, social content and brand identity, made for Malaysian audiences.',
    definition:
      'Lean X Digital’s creative agency makes ad posters, short videos, social media content and brand identity for Malaysian businesses.',
    audience:
      'Businesses that need ads and social posts people stop scrolling for, or a brand that looks the same everywhere it appears.',
    seoTitle: 'Creative agency Malaysia: ad posters, video and brand identity',
    metaDescription:
      'Lean X Digital’s creative agency makes ad posters, Reels, social media content and brand identity for Malaysian businesses, in English and Bahasa Malaysia.',
    whatsappAsk: 'I’m interested in your creative services. Here’s my business: ',
    automated: {
      feature: 'auto content',
      text: 'Nexova’s auto content creates posters, videos and social posts for your products, following the same workflow our creative team uses.',
    },
    facts: [
      ['Service', 'Ad creative, social content, video and brand identity'],
      ['Formats', 'Posters, Reels, carousels, stories, brand kits'],
      ['Languages', 'English and Bahasa Malaysia'],
      ['WhatsApp', site.phoneDisplay],
      ['Automated version', 'Nexova auto content'],
    ],
    includesTitle: 'What we make',
    includes: [
      ['Ad posters', 'Static ads for Facebook and Instagram, sized for each placement.'],
      ['Short-form video', 'Reels and short videos for ads and organic posts.'],
      ['Social media content', 'Carousels, stories and posts that match your brand.'],
      ['Brand identity', 'Logo, colours, type and the rules for using them.'],
      ['Landing pages', 'UI/UX design for the page an ad sends people to.'],
      ['Photography and retouching', 'Product and lifestyle photos, edited for ads.'],
    ],
    stepsTitle: 'How it works',
    steps: [
      'Message us on WhatsApp with your business and a link to your page or website.',
      'Our creative team looks at your brand and your current content, and suggests what to make.',
      'We agree the work and the price with you before we start.',
      'We make the content and hand it over, ready to post or run as ads.',
    ],
    sections: [],
    faqs: [
      [
        'What does the creative agency make?',
        'Ad posters, short videos and Reels, social media posts, brand identity, landing page designs and product photography.',
      ],
      [
        'How much does creative work cost?',
        'It depends on what you need. We agree the scope and price with you before any work starts.',
      ],
      [
        'Can I make content myself instead?',
        'Yes. Nexova’s auto content creates posters, videos and social posts for your products automatically.',
      ],
    ],
    updated: '2026-11-03',
  },

  {
    slug: 'paid-advertising',
    name: 'Paid advertising',
    short: 'paid advertising',
    category: 'Google Ads and Meta ads',
    serviceType: 'Google Ads and Facebook and Instagram (Meta) ads management',
    summary: 'Google Ads and Facebook and Instagram ads, planned, run and measured for you.',
    definition:
      'Lean X Digital’s paid advertising service plans, runs and fixes Google Ads and Facebook and Instagram ads for Malaysian businesses. Each platform has its own specialist on our team.',
    audience:
      'Malaysian businesses that already run ads, are about to start, or are spending on ads without knowing what comes back.',
    seoTitle: 'Paid ads Malaysia: Google Ads and Facebook and Instagram ads',
    metaDescription:
      'Lean X Digital plans and runs Google Ads and Facebook and Instagram ads for Malaysian businesses, with a specialist for each platform.',
    whatsappAsk: 'I’d like help with my ads. Here’s my business: ',
    automated: {
      feature: 'auto Meta ads',
      text: 'Nexova’s auto Meta ads runs Facebook and Instagram ads for your store automatically, following the same workflow our team uses.',
    },
    facts: [
      ['Service', 'Google Ads and Meta ads management'],
      ['Platforms', 'Google, Facebook and Instagram'],
      ['Specialists', 'One for Google Ads, one for Meta ads'],
      ['Languages', 'English and Bahasa Malaysia'],
      ['WhatsApp', site.phoneDisplay],
      ['Automated version', 'Nexova auto Meta ads'],
    ],
    includesTitle: 'What we look after',
    includes: [
      ['Campaign setup', 'Account structure, settings and launch checklists.'],
      ['Keyword research', 'Google search terms worth paying for in the Malaysian market.'],
      ['Targeting', 'Who sees your Meta ads, by location, age, interests and behaviour.'],
      ['Ad copy and creative', 'Headlines, posters and videos that earn the click.'],
      ['Bidding and budget', 'Where the money goes, and the bidding strategy that fits your goal.'],
      ['Landing pages and funnel', 'Why visitors do or don’t become leads and sales.'],
      ['Analytics and tracking', 'Whether conversions are measured correctly.'],
    ],
    stepsTitle: 'How it works',
    steps: [
      'Message us with your website and the platform you want: Facebook and Instagram, Google, or both.',
      'Our specialist for that platform looks at your current ads or website.',
      'We agree the plan, your ad budget and our fee before anything runs.',
      'We set up and run the campaigns, and show you what each one brings in.',
    ],
    sections: [
      {
        title: 'Google Ads or Meta ads?',
        body: [
          'Google Ads reach people who are already searching for what you sell. Meta ads reach people on Facebook and Instagram by who they are and what they are interested in, before they search.',
          'Many businesses run both. If you are not sure where to start, ask us and we will tell you which fits.',
        ],
      },
      {
        title: 'What is Google Ads?',
        body: [
          'Google Ads is Google’s advertising platform. Search ads appear when someone searches for the terms you bid on, and for most search campaigns you pay only when someone clicks. The same account can also run ads on YouTube, Google Maps, Gmail and Google’s partner websites.',
        ],
      },
      {
        title: 'What are Meta ads?',
        body: [
          'Meta ads are paid ads on Facebook, Instagram, Messenger and Meta’s Audience Network, all run from Meta Ads Manager. An ad can send people to your website, to a form, or straight into a WhatsApp chat.',
        ],
      },
    ],
    faqs: [
      [
        'Do you run both Google Ads and Facebook ads?',
        'Yes. Our team has a specialist for each platform.',
      ],
      [
        'Do I need to be running ads already?',
        'No. Send us your website or page even if you are only thinking about ads.',
      ],
      [
        'How much does it cost?',
        'There are two parts: your ad budget, which goes to the ad platform, and our fee. We agree both with you before anything runs.',
      ],
    ],
    updated: '2026-11-03',
  },

  {
    slug: 'seo',
    name: 'Search engine optimisation',
    short: 'SEO',
    category: 'Organic search',
    serviceType: 'Search engine optimisation (SEO) audit, strategy and tracking',
    summary: 'SEO so customers find you on Google without paying per click.',
    definition:
      'Lean X Digital’s search engine optimisation (SEO) service works on getting your website found in Google’s unpaid results for the searches your customers make.',
    audience:
      'Businesses whose website gets little traffic from Google, or that rely on ads and want customers who arrive without a cost per click.',
    seoTitle: 'SEO Malaysia: rankings, keywords and strategy',
    metaDescription:
      'Lean X Digital’s SEO service gets Malaysian business websites found on Google: rankings, on-page issues, keyword research, traffic and tracking.',
    whatsappAsk: 'I’d like help with my SEO. Here’s my website: ',
    automated: {
      feature: 'auto SEO',
      text: 'Nexova’s auto SEO checks how visible your store is on Google and handles its SEO automatically, following the same workflow our team uses.',
    },
    facts: [
      ['Service', 'SEO audits, strategy and tracking'],
      ['Tools', 'Google Search Console and GA4'],
      ['Languages', 'English and Bahasa Malaysia'],
      ['WhatsApp', site.phoneDisplay],
      ['Automated version', 'Nexova auto SEO'],
    ],
    includesTitle: 'What we look after',
    includes: [
      ['Rankings', 'Where your pages appear on Google today, and for which searches.'],
      ['On-page issues', 'Titles, headings, content and links that hold a page back.'],
      ['Keyword research', 'The searches your customers in Malaysia actually type.'],
      ['Traffic', 'Where your visitors come from and where they leave.'],
      ['Search Console and GA4', 'Setup and tracking so you can see what is working.'],
      ['SEO strategy', 'What to fix first, and which pages to build next.'],
    ],
    stepsTitle: 'How it works',
    steps: [
      'Send us your website link on WhatsApp.',
      'We check your rankings, pages and traffic.',
      'We agree what to fix first, and the price, before we start.',
      'We do the work and track the results in Search Console and GA4.',
    ],
    sections: [
      {
        title: 'What is SEO?',
        body: [
          'Search engine optimisation is the work of getting a website to show up in Google’s unpaid results. You don’t pay per click, but results take longer to build than ads, so many businesses run Google Ads while their SEO catches up.',
        ],
      },
    ],
    faqs: [
      [
        'How long does SEO take to work?',
        'Longer than ads. Ads can bring visitors the day they go live, while SEO builds over months. We tell you what to fix first so the early work counts.',
      ],
      [
        'How much does SEO cost?',
        'It depends on the size of the site and what it needs. We agree the scope and price with you before any work starts.',
      ],
      [
        'What do you need from me?',
        'A link to your website. Access to Google Search Console or GA4 helps if you have it.',
      ],
    ],
    updated: '2026-11-03',
  },

  {
    slug: 'web-development',
    name: 'Websites, CRM and apps',
    short: 'development',
    category: 'Development',
    serviceType: 'Website, landing page, CRM and app development',
    summary: 'Websites, landing pages, CRM systems and apps, built around how you sell.',
    definition:
      'Lean X Digital’s development service builds websites, landing pages, CRM systems and apps for Malaysian businesses. It is run by the same team that builds Nexova.',
    audience:
      'Businesses whose website doesn’t turn visitors into enquiries, or who track leads and customers in spreadsheets and chat threads.',
    seoTitle: 'Website, CRM and app development in Malaysia',
    metaDescription:
      'Lean X Digital builds websites, landing pages, CRM systems and apps for Malaysian businesses, from the same team that builds Nexova.',
    whatsappAsk: 'I’d like to talk about a website / CRM / app. Here’s my business: ',
    facts: [
      ['Service', 'Websites, landing pages, CRM systems and apps'],
      ['Tracking', 'GA4 and Google Tag Manager'],
      ['Languages', 'English and Bahasa Malaysia'],
      ['WhatsApp', site.phoneDisplay],
      ['Ready-made option', 'Nexova, for online stores'],
    ],
    includesTitle: 'What we build',
    includes: [
      ['Websites', 'Company websites and online stores.'],
      ['Landing pages', 'Pages built for one ad campaign, made to turn visitors into leads.'],
      ['CRM systems', 'One place to track leads, customers and follow-ups.'],
      ['Apps', 'Apps for your staff or your customers, built around how your business works.'],
      ['Booking and lead capture', 'Forms, booking systems and WhatsApp hand-offs.'],
      ['Tracking', 'GA4 and Google Tag Manager set up from the start.'],
    ],
    stepsTitle: 'How it works',
    steps: [
      'Tell us on WhatsApp what you need, with a link to your current website if you have one.',
      'We agree the scope and price with you before we start.',
      'We build it and set up tracking.',
      'We hand it over and show you how to run it.',
    ],
    sections: [
      {
        title: 'Selling online? Start with Nexova',
        body: [
          'If what you need is an online store, Nexova may already do it: a store website that creates its own content, runs its own Meta ads and handles its own SEO. We build to order for anything Nexova doesn’t cover.',
        ],
      },
    ],
    faqs: [
      [
        'How much does a website or app cost?',
        'It depends on what it needs to do. We agree the scope and price with you before any work starts.',
      ],
      [
        'Do you build online stores?',
        'Yes. For most online sellers we suggest Nexova, our own self-growing store website. For anything Nexova doesn’t cover, we build to order.',
      ],
    ],
    updated: '2026-11-03',
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
