// Mock-ups waiting for the owner's review are marked as drafts. They render in `astro dev`, and in a
// build only when SHOW_DRAFTS=1 is set (for a preview deploy). Production builds leave them out
// completely: no page, no link, no sitemap or llms.txt entry.
export const showDrafts = import.meta.env.DEV || process.env.SHOW_DRAFTS === '1';
