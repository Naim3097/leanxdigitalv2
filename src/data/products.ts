// Product facts. Everything here is shown on the site and repeated in JSON-LD
// and llms.txt, so keep it true and specific. Sources are noted per product.
// When a fact changes, edit it here and bump `updated` to the date of the change.

export interface Product {
  slug: string;
  name: string;
  category: string;
  /** One line for lists. */
  summary: string;
  /** First paragraph of the product page. Starts with "<Name> is ...". */
  definition: string;
  audience: string;
  seoTitle: string;
  metaDescription: string;
  /** Pre-filled WhatsApp text. Follows "Hi Lean X Digital! ". */
  whatsappAsk: string;
  /** The product's own website, if it has one. */
  website?: { url: string; label: string };
  /** Where to buy or sign up, when that is not the product website. */
  buy?: { url: string; label: string };
  /** schema.org SoftwareApplication category. */
  appCategory: string;
  operatingSystem?: string;
  /** Only set when the price is published. Never estimate. */
  offer?: { name: string; price: string; currency: 'MYR'; url: string };
  /** What the product does, one line each. Shown as a grid on the product pages. */
  features: [string, string][];
  facts: [string, string][];
  stepsTitle: string;
  steps: string[];
  sections: { title: string; body: string[] }[];
  faqs: [string, string][];
  /** ISO date this page's content last changed. */
  updated: string;
}

export const products: Product[] = [
  // Sources: nexova.my homepage (checked 2026-11-03), "no-code" and "free to start" as published
  // by the co-founders, and the owner (2026-11-03): auto content, auto Meta ads, auto SEO and
  // Shopee / TikTok Shop stock sync are all live.
  {
    slug: 'nexova',
    name: 'Nexova',
    category: 'Self-growing store website',
    summary:
      'A store website that grows itself: it creates its own content, runs its own Meta ads and works on its SEO.',
    definition:
      'Nexova is a self-growing store website for Malaysian online sellers. It creates its own ad content, runs its own Facebook and Instagram ads and handles its own SEO, while smart inventory keeps your stock in sync with Shopee and TikTok Shop.',
    audience:
      'Online sellers, including those on Shopee or TikTok Shop, who want a store website of their own that brings in customers without them doing the marketing.',
    seoTitle: 'Nexova: the self-growing store website for Malaysian sellers',
    metaDescription:
      'Nexova is a store website that grows itself: auto content, auto Meta ads and auto SEO, with stock synced to Shopee and TikTok Shop. Free to start.',
    whatsappAsk: 'I have a question about Nexova. Here’s my shop: ',
    website: { url: 'https://www.nexova.my/', label: 'nexova.my' },
    appCategory: 'BusinessApplication',
    operatingSystem: 'Web browser',
    features: [
      ['Auto content', 'Creates posters, videos and social media posts for your products.'],
      ['Auto Meta ads', 'Runs Facebook and Instagram ads for your store.'],
      ['Auto SEO', 'Checks how visible your store is on Google and works on its SEO.'],
      [
        'Smart inventory',
        'Keeps your stock in sync with Shopee and TikTok Shop, so an order on one updates the others.',
      ],
      ['E-commerce CMS', 'Build and edit your store, products and pages without code.'],
      ['Start from a link', 'Paste a TikTok Shop or Shopee link, or start from your website or from scratch.'],
    ],
    facts: [
      ['Type', 'Self-growing store website (e-commerce CMS)'],
      ['Built for', 'Malaysian online sellers'],
      ['Grows itself with', 'Auto content, auto Meta ads, auto SEO'],
      ['Stock', 'Synced with Shopee and TikTok Shop'],
      ['Start from', 'A TikTok Shop or Shopee link, your website, or scratch'],
      ['AI', 'Built on Claude, by Anthropic'],
      ['Coding', 'None needed'],
      ['Price', 'Free to start'],
      ['Help', 'WhatsApp +60 10-764 8227'],
      ['Website', 'nexova.my'],
    ],
    stepsTitle: 'How to start with Nexova: paste a link, press Build',
    steps: [
      'Go to nexova.my.',
      'Paste a TikTok Shop product link or your Shopee shop link and press Build. No marketplace store? Start from your website or from scratch.',
      'Your store builds on screen while you watch.',
      'Sign in with a Nexova account to keep it, then switch on auto content, auto Meta ads and auto SEO.',
    ],
    sections: [
      {
        title: 'What “self-growing” means',
        body: [
          'A store website only sells if people find it. Usually that takes three kinds of work: making content, running ads and doing SEO. Nexova does all three on its own.',
          'Auto content makes posters, videos and social posts for your products. Auto Meta ads runs them as Facebook and Instagram ads. Auto SEO checks how visible the store is on Google and works on it. You decide when to switch these three features on.',
        ],
      },
      {
        title: 'Built from our team’s own workflows',
        body: [
          'Nexova is built by the same Lean X Digital team that runs creative work, Meta ads, Google Ads and SEO for clients. The auto features follow the workflows we use with those clients. They’re built on Claude, Anthropic’s AI model.',
          'If you’d rather have people do the work, the same team does it for you.',
        ],
      },
      {
        title: 'Why sellers want their own website',
        body: [
          'A marketplace store sits inside someone else’s platform. Shoppers reach you through the marketplace search, with competing sellers listed next to you, under rules and fees the platform sets.',
          'A website gives you an address that belongs to you. You can print it on packaging, use it in ads and send it in WhatsApp chats. On your website, nobody else’s products sit next to yours. If you also sell on a marketplace, you keep that store too.',
        ],
      },
    ],
    faqs: [
      [
        'What is Nexova?',
        'Nexova is a self-growing store website for Malaysian online sellers. It creates its own content, runs its own Meta ads and handles its own SEO. It also keeps your stock in sync with Shopee and TikTok Shop.',
      ],
      [
        'What does “self-growing” mean?',
        '“Self-growing” means Nexova does the work that brings customers to a store. Auto content makes posts and videos, auto Meta ads runs Facebook and Instagram ads, and auto SEO works on your Google visibility.',
      ],
      [
        'Does Nexova sync stock with Shopee and TikTok Shop?',
        'Yes. Smart inventory keeps your stock in sync with Shopee and TikTok Shop, so an order on one updates the others.',
      ],
      [
        'Do I need a Shopee or TikTok Shop store to use Nexova?',
        'No. You can build from a TikTok Shop or Shopee link, from your existing website, or from scratch.',
      ],
      ['Do I need design or coding skills?', 'No. Nexova is a no-code platform: you build and edit your store without writing code.'],
      ['How much does Nexova cost?', 'Nexova is free to start.'],
      [
        'What AI does Nexova use?',
        'Nexova’s auto content, auto Meta ads and auto SEO are built on Claude, an AI model made by Anthropic.',
      ],
      ['How do I get help with Nexova?', 'Message the Nexova team on WhatsApp at +60 10-764 8227.'],
    ],
    updated: '2026-11-17',
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
