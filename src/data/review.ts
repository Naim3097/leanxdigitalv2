// Reference notes for decisions the owner still has to make. They appear only inside draft notes
// (lib/drafts.ts), never on the live site.

// Competitors' own pricing pages, checked 4 November 2026 (strategy report, competitor notes).
export const priceReferences: Record<string, string> = {
  seo: 'Malaysian agencies that publish prices charge from RM 2,899 to over RM 12,000 a month for SEO.',
  'paid-advertising':
    'Agencies that publish prices charge from RM 2,800 to over RM 10,000 a month to manage ads, plus the ad spend.',
  'web-development':
    'Published website prices run from RM 3,000 to RM 6,500 at the low end, and from RM 9,997 to over RM 90,000 at specialist builders.',
};

// Draft pages, listed on /drafts/ in previews.
export const draftPages: { path: string; name: string; needs: string }[] = [
  {
    path: '/online-sellers/',
    name: 'Own store growth for online sellers',
    needs: 'Your positioning decision, prices, the payment provider’s name and one case study.',
  },
  { path: '/sales-leak-audit/', name: 'Sales leak audit', needs: 'The audit’s price, turnaround and scope.' },
  { path: '/pricing/', name: 'Prices', needs: 'Starting prices for each service, with the month they were set.' },
  {
    path: '/bandar-sri-damansara/',
    name: 'Bandar Sri Damansara office page',
    needs: 'Office hours, directions, a local client story and office photos.',
  },
  {
    path: '/guides/website-traffic-no-sales/',
    name: 'Guide: website traffic but no sales',
    needs: 'An author, a title checked against keyword data, and a decision on adding a calculator.',
  },
  { path: '/work/', name: 'Client work and two case studies', needs: 'Real clients, figures with dates and written permission.' },
  { path: '/about/izzad-iskandar/', name: 'Profile: Izzad Iskandar', needs: 'A headshot and a LinkedIn link.' },
  { path: '/about/muhammad-danisy/', name: 'Profile: Muhammad Danisy', needs: 'A headshot and a LinkedIn link.' },
];

// Draft sections on pages that are already live, marked with a dashed box on each page.
export const draftSections: { path: string; name: string; needs: string }[] = [
  { path: '/', name: 'Home: proposed hero copy and title', needs: 'Your positioning and title decision.' },
  { path: '/services/', name: 'Services: proposed new structure', needs: 'Your decision on renaming and splitting services.' },
  { path: '/products/', name: 'Products: merge proposal', needs: 'Your decision on keeping a separate products page.' },
  {
    path: '/products/nexova/',
    name: 'Nexova: screenshot and prices',
    needs: 'A real screenshot and confirmation of Nexova’s prices.',
  },
  {
    path: '/services/paid-advertising/',
    name: 'Every service page: prices and results',
    needs: 'Starting prices and real case studies.',
  },
  {
    path: '/about/',
    name: 'About: company details, headshots and group note',
    needs: 'Registered name, SSM number, founding year, LinkedIn, photos and one line on how the companies relate.',
  },
  { path: '/contact/', name: 'Contact: office hours', needs: 'Your office hours.' },
];

// Open questions about a product page, by product slug.
export const productNotes: Record<string, string> = {
  nexova:
    'Prices: this page says “Free to start”, but Nexova’s own pricing page was read on 4 November 2026 as listing Basic at RM 79 a month, Growth at RM 1,500 and Scale at RM 3,000. Confirm which is right. Once confirmed, the plans can be shown here and added to the structured data.',
};
