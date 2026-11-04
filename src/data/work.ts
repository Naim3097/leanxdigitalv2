// Case studies: real client work, published with each client's written permission.
// Every entry marked `draft` is a mock-up that renders only in previews (lib/drafts.ts).
// Replace each bracketed placeholder with a real, checkable fact, get the client's permission,
// then set `draft: false`. Never publish estimated or rounded-up numbers.
import { showDrafts } from '../lib/drafts';

export interface CaseStudy {
  slug: string;
  /** Mock-up with placeholders. Shown only in previews. */
  draft: boolean;
  client: string;
  industry: string;
  /** Services involved, by slug, so the case study shows on those service pages. */
  services: string[];
  /** Built on Nexova, so it shows on the Nexova page too. */
  nexova?: boolean;
  /** The result in one line, for lists and the page description. */
  summary: string;
  problem: string;
  /** What we did, one step each. */
  work: string[];
  /** Each result with its period, e.g. ['Cost per enquiry', 'RM 38 to RM 21, March to May 2026']. */
  results: [string, string][];
  quote?: { text: string; name: string; role: string };
  /** For drafts: what the owner still has to supply. */
  todo?: string[];
  /** ISO date this page's content last changed. */
  updated: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'online-seller-own-store',
    draft: true,
    client: '[Client name]',
    industry: 'E-commerce',
    services: ['paid-advertising', 'web-development'],
    nexova: true,
    summary:
      '[A Shopee or TikTok Shop seller] built their own store website and made [RM amount] there in [period], with Meta ads sending buyers to it.',
    problem:
      '[What was wrong before, in the client’s own words. For example: rising marketplace fees, no list of their own customers, and ads that only boosted their marketplace listing.]',
    work: [
      '[Built the store on Nexova from their Shopee shop link, with stock kept in sync across Shopee, TikTok Shop and the website.]',
      '[Set up FPX, DuitNow and e-wallet checkout through a registered payment provider. Name the provider here.]',
      '[Moved part of the Meta ads budget from the marketplace listing to the store website.]',
      '[Set up tracking so each sale on the website is tied to the ad that brought the buyer.]',
    ],
    results: [
      ['Sales on the own store', '[RM amount], [month to month, year]'],
      ['Return on ad spend', '[ratio], [period]'],
      ['Repeat buyers', '[number or share], [period]'],
    ],
    quote: {
      text: '[One or two sentences from the client, in their own words, about what changed.]',
      name: '[Name]',
      role: '[Role, company]',
    },
    todo: [
      'A real client who sells on Shopee or TikTok Shop and now uses Nexova, with written permission to name them.',
      'Real figures with their dates, taken from Nexova, the payment provider or Meta Ads Manager.',
      'A short quote, approved by the client.',
      'One screenshot: the store, an ad or a results dashboard.',
    ],
    updated: '2026-11-04',
  },
  {
    slug: 'google-ads-enquiries',
    draft: true,
    client: '[Client name]',
    industry: 'Professional services',
    services: ['paid-advertising', 'seo'],
    summary:
      '[A professional services firm] cut its cost per enquiry from [RM amount] to [RM amount] in [period].',
    problem:
      '[What was wrong before. For example: paying for clicks from searches that never became enquiries, with no way to see which keywords brought clients.]',
    work: [
      '[Rebuilt the Google Ads account around the searches that bring paying clients.]',
      '[Added conversion tracking for WhatsApp chats, calls and forms.]',
      '[Wrote a landing page for each main service and tested it against the old one.]',
      '[Fixed the website’s basic SEO so the firm also shows up without paying per click.]',
    ],
    results: [
      ['Cost per enquiry', '[RM amount] to [RM amount], [period]'],
      ['Enquiries a month', '[number] to [number], [period]'],
      ['Enquiries that became clients', '[number or share], [period]'],
    ],
    todo: [
      'A real client, with written permission to name them, or to describe them without a name if they prefer.',
      'Before and after figures with dates, from Google Ads and the client’s own records.',
      'A short quote, approved by the client.',
    ],
    updated: '2026-11-04',
  },
];

export const visibleCaseStudies = caseStudies.filter((c) => !c.draft || showDrafts);
export const liveCaseStudies = caseStudies.filter((c) => !c.draft);
