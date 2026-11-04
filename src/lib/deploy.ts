// Vercel sets VERCEL_ENV to 'production' for the live site and to 'preview' for every other branch,
// staging included. Preview builds show the drafts and keep themselves out of search engines.
export const isPreview = process.env.VERCEL_ENV === 'preview';
