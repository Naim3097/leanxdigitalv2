import { isPreview } from './deploy';

// Mock-ups waiting for the owner's review are marked as drafts. They render in `astro dev`, on Vercel
// preview deployments (the staging site included) and in any build run with SHOW_DRAFTS=1.
// Production builds leave them out completely: no page, no link, no sitemap or llms.txt entry.
export const showDrafts = import.meta.env.DEV || isPreview || process.env.SHOW_DRAFTS === '1';
