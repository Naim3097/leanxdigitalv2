import type { APIRoute } from 'astro';
import { absoluteUrl } from '../data/site';

const body = `# robots.txt for ${absoluteUrl('/')}
# Search engines and AI answer engines are all welcome.
#
# AI crawlers allowed by the rule below, for reference:
#   Search and answers: Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, Claude-SearchBot,
#                       Claude-User, PerplexityBot, Perplexity-User, Applebot, Meta-WebIndexer
#   Model training:     GPTBot, ClaudeBot, Google-Extended, Applebot-Extended,
#                       Meta-ExternalAgent, CCBot
#
# To stay in AI answers but opt out of model training, add a group such as:
#   User-agent: GPTBot
#   Disallow: /
# A named group replaces the * group for that bot, so only add groups you mean.
# Blocking Google-Extended also removes the site from answers in the Gemini apps.

User-agent: *
Allow: /

Sitemap: ${absoluteUrl('/sitemap.xml')}
`;

export const GET: APIRoute = () =>
  new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
