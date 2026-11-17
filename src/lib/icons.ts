import type { IconName } from '../components/Icon.astro';

// Line icons for product features and services, matched by feature title or service slug.
// A feature or service without an entry simply shows no icon.
export const featureIcons: Record<string, IconName> = {
  'Auto content': 'content',
  'Auto Meta ads': 'megaphone',
  'Auto SEO': 'search',
  'Smart inventory': 'sync',
  'E-commerce CMS': 'layout',
  'Start from a link': 'link',
};

export const serviceIcons: Record<string, IconName> = {
  'creative-agency': 'pen',
  'paid-advertising': 'target',
  seo: 'search',
  'web-development': 'code',
};
