# Content guide

How to write and publish on leanxdigital.io so search engines and AI answer engines trust it.
Checked against the official sources listed at the end, October 2026.

## The rule that matters

Google does not penalise text for being written with AI. It penalises **pages with little value,
produced at scale**, and anything **made up**. Its 2026 guidance on AI features in Search says there are
no special steps for AI Overviews or AI Mode beyond normal good SEO. Write for a customer who is about to
spend money, and check every fact.

## Before you publish a page

- [ ] Every fact, price, number and claim is true today, and someone at Lean X Digital can confirm it.
- [ ] The first sentence says plainly what the thing is: "Discova is a website audit tool that …".
- [ ] The page answers something a customer would actually ask. If it only exists to rank for a keyword, drop it.
- [ ] Prices are in RM and carry a date ("RM 65, October 2026").
- [ ] Numbers come with their source, or are our own data and say so.
- [ ] Headings are in sentence case and say what the section contains.
- [ ] You read the page aloud once. Anything you wouldn't say to a client, rewrite.
- [ ] The `updated` date in `src/data/` changed **only** if the content really changed.

## Never do these

These break Google's spam policies or Bing's guidelines, or destroy trust when someone notices.

- **Fake proof.** No invented reviews, star ratings, testimonials, client logos, awards, case-study
  numbers or "trusted by 500+ businesses". Google calls AI-generated headshots, invented names and false
  credentials "a form of deception".
- **Self-awarded stars.** Don't add review or rating markup to our own company or product pages.
- **Mass pages.** No near-identical pages per city ("SEO agency Shah Alam", "SEO agency Klang", …).
  These are doorway pages and scaled content abuse.
- **Keyword stuffing.** No lists of keywords or place names. The meta keywords tag is ignored by Google; don't add it.
- **Hidden text**, including text hidden from people but meant for AI crawlers. Bing now treats hidden
  prompts aimed at AI as manipulation.
- **Fake freshness.** Don't change dates when the content didn't change.
- **Padding.** Don't write to a word count. A short page that answers the question beats a long one that doesn't.
- **Renting the domain.** Don't publish sponsored or third-party content to borrow our site's reputation.

## How to write

Readers, reviewers and AI tools all recognise these patterns, and they make a page sound unchecked.
No search engine penalises a particular word. Avoiding them is about trust.

**Words to avoid:** delve, tapestry, testament, pivotal, crucial, robust, seamless, vibrant, showcase,
underscore, foster, meticulous, intricate, landscape, boasts, nestled, "in the heart of", leverage,
unlock, elevate, empower, cutting-edge, innovative, game-changer, revolutionise, harness, streamline,
tailored, holistic, synergy, supercharge, world-class, effortless, comprehensive, journey, realm,
additionally, furthermore, moreover.

**Patterns to avoid:**
- "It's not just X, it's Y" and "not only X but also Y"
- Everything grouped in threes
- Em dashes (—) used as all-purpose punctuation. On this site we don't use them at all.
- "Serves as" or "stands as" where "is" works
- Sentences ending in "…, highlighting our commitment to …"
- "Experts say" or "studies show" with no named source
- Openers like "In today's fast-paced digital world" and closers that predict the future
- Title Case Headings, bold scattered through paragraphs, emoji as bullets

**Do instead:**
- Short sentences. One idea each.
- Specifics: product names, RM prices, Shopee, TikTok Shop, WhatsApp, real timings ("about two minutes").
- Say "we" for Lean X Digital and "you" for the reader.
- Malaysian English spelling (organise, colour, labelled).

## What helps AI answers (GEO)

AI answer engines (ChatGPT search, Perplexity, Google AI Overviews and AI Mode, Copilot, Claude) can
only cite a page they can find, so normal SEO comes first. Once they find the page, these help:

1. **Definition first.** Open with "<Name> is a <type> that <does what> for <whom>."
2. **Facts in a table.** Every product page has a "Key facts" list. Keep it accurate.
3. **Visible questions and answers.** Write them as customers ask them. Google stopped showing FAQ rich
   results in 2026, but the questions still help people and AI tools.
4. **Statistics, quotations and cited sources.** In the Princeton/IIT GEO study (KDD 2024), these
   raised visibility in AI answers by 30–41%. Keyword stuffing did not help. Only use real numbers.
5. **One consistent identity.** Same name, address, phone and email everywhere: this site, Google
   Business Profile, Facebook, Instagram, directories.
6. **Original material.** Real projects, screenshots, our own data, named clients (with permission).
   This is the strongest signal we can add, and only we can produce it.

## Where things live in the code

| What | File |
| --- | --- |
| Company facts (address, phone, services, socials, legal name) | `src/data/site.ts` |
| Product pages (copy, facts, steps, FAQs, `updated` date) | `src/data/products.ts` |
| Service pages (copy, facts, steps, FAQs, `updated` date) and the team on the About page | `src/data/services.ts` |
| Dates for non-product pages | `src/data/pages.ts` |
| Page layouts | `src/pages/` |

The sitemap, llms.txt, JSON-LD and share images all come from these data files. Edit the data and every
output stays in sync.

**To add a product:** add an entry to `products` in `src/data/products.ts`. Its page, share image,
sitemap entry, llms.txt entry and links from the other pages are created automatically.

**To add a service:** same, in `src/data/services.ts`.

**Positioning rules for this site:**
- The site speaks as the company. Service pages say "our team" and use the company WhatsApp number.
  The strategists are named once, in the Team section on the About page. Real people with real
  experience are a strong trust signal, so keep that section.
- Keep the team's numbers (years, ad spend managed, client accounts) the same as they publish elsewhere,
  and update both together.
- FacebookAds.my and GoogleAdsAgency.my are mentioned once, on the About page, with the "not affiliated
  with Meta Platforms, Inc. / Google LLC" line. Keep both the single mention and the disclaimer.
- Don't promise free audits or free work unless the company is actually offering them.

## After every launch or big change

1. `npm run build`, then deploy.
2. `npm run indexnow` notifies Bing (which also feeds Copilot), Yandex and other IndexNow engines.
3. Google: open Search Console → URL Inspection → Request indexing for any changed page.

## One-time setup after the first launch

- [ ] **Google Search Console:** verify `www.leanxdigital.io` and submit `https://www.leanxdigital.io/sitemap.xml`.
      The Generative AI performance report shows clicks from AI Overviews and AI Mode.
- [ ] **Bing Webmaster Tools:** import from Search Console. The AI Performance report shows Copilot citations.
- [ ] **Google Business Profile:** make sure the name, address, phone and website match this site exactly.
- [ ] **Vercel → Firewall:** check that no "block AI bots" rule is on. It would undo the robots.txt.
- [ ] In analytics, watch for `utm_source=chatgpt.com` and referrals from perplexity.ai, copilot.microsoft.com and gemini.google.com.

## Sources

- Google, Using generative AI content: https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- Google, Creating helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google, Spam policies: https://developers.google.com/search/docs/essentials/spam-policies
- Google, AI features and your website: https://developers.google.com/search/docs/appearance/ai-features
- Google, Sitemaps (lastmod): https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google, Organization structured data: https://developers.google.com/search/docs/appearance/structured-data/organization
- Bing, AI Performance in Webmaster Tools: https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview
- IndexNow: https://www.indexnow.org/documentation
- OpenAI crawlers: https://developers.openai.com/api/docs/bots
- Anthropic crawlers: https://support.claude.com/en/articles/8896518
- Perplexity crawlers: https://docs.perplexity.ai/guides/bots
- GEO: Generative Engine Optimization (Aggarwal et al., KDD 2024): https://arxiv.org/abs/2311.09735
- Wikipedia, Signs of AI writing: https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
