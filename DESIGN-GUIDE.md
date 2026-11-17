# Design guide

How the site looks and moves, and how to change it. Written November 2026, when the design system was
built from the UI/UX reference study. Branding (colours, type, logo use) is the next phase: it should only
need the token block described below.

## The idea in one paragraph

Light, airy pages (grey `#f9fafa` / `#f3f4f6` backgrounds, white cards, near-black ink), one typeface in two
weights, pill-shaped controls, generous spacing (up to 180 px between sections), centred section intros, and
dark interludes. Small labels above headings are an outline icon and light text, never a pill. The homepage
opens on a looping background video under a soft wash of the page colour. Colour arrives through motion and panels: headings ink in with a colour wave as they scroll
into view, Nexova sits on a pastel mesh, and the services are full-width colour cards that stack. Navigation is
a floating pill at the bottom of the screen with the live scroll position and a menu.

## Change the brand here

All brand decisions live in the first `:root` block of `src/styles/global.css`, marked
"Brand tokens: placeholders for the branding phase". Change those values, not the components.

| Token | What it controls |
| --- | --- |
| `--ink`, `--paper`, `--page`, `--page-alt`, `--surface`, `--line` | Base colours: text, backgrounds, cards, rules |
| `--text`, `--text-2`, `--text-3`, `--text-subtle`, `--text-question`, `--on-dark*` | Text strengths (keep each at 4.5:1 or better on its background) |
| `--dark`, `--dark-line` | Dark sections and the footer bar |
| `--spectrum-1` to `--spectrum-4` | The heading colour wave, the page-head sweep, icons on gradients |
| `--mesh` | The pastel gradient behind Nexova and the call to action |
| `--card-1` to `--card-4b` | The four service card gradients (white text must stay at 4.5:1 on both stops) |
| `--select-bg`, `--select-ink`, `--accent-soft`, `--accent-ink` | Text selection and the hover accent on dark cards |
| `--font` | The typeface: Neue Montreal, self-hosted from `src/assets/fonts/`, then a metric-matched Arial (see Typography) |
| `--radius-*`, `--shadow-*` | Corner radii and shadows |

The spectrum is also written once in `src/scripts/site.ts` (`spectrum`), because the heading wave mixes the
colours per character. Change both together.

The logo is the supplied SVG ("leanx digital logo panjang svg"), kept path for path in `Wordmark.astro` and
`src/lib/logo.ts`. Its letters take the text colour (ink on light, white on dark) and the x stays `#ffce33`.
Size it by height only. The favicon, app icons and social images are drawn from the same shapes
(`public/favicon.svg`, `src/lib/images.ts`).

## Typography

One typeface, Neue Montreal (Pangram Pangram), self-hosted, in two weights: 400 for reading text and labels,
500 for headings, buttons, navigation, standalone links, captions and small capitals. The hierarchy follows the
reference study's proportions, adapted to this site: a short scale of large sizes with tight tracking for
headings, a calm 1.45 line height for reading text, untracked large text, and medium-weight captions.

- Files, in `src/assets/fonts/`: `neue-montreal-{300,400,400-italic,500,700}.woff2` for the pages (subset to
  Latin, 16 to 18 KB each) and `neue-montreal-{400,500}.otf` for the share images (satori, which draws them
  at build time in `src/lib/images.ts`, cannot read WOFF2).
- The `@font-face` rules are at the top of `global.css` (`font-display: swap`, Latin `unicode-range`). 400 and
  500 are preloaded in `src/layouts/Base.astro`. 300, 400 italic and 700 are declared but unused (a browser
  downloads only the faces a page uses); `b` and `strong` are set to 500, so nothing asks for 700.
- While the font loads, text is set in Arial adjusted to Neue Montreal's metrics (`'Neue Montreal Fallback'`,
  one face per weight: `size-adjust` from the average letter width, weighted by how often each letter occurs
  in English; ascent and descent from the font). Measured on the pages, fallback text runs within 0.6% of the
  real font's length, so lines keep their breaks and little moves when the font arrives.
- Sizes are fluid tokens (`--fs-*` in `global.css`). In the table, the first figure is at 375 px wide and the
  second at 1440 px, measured from the running pages. Letter spacing is in em, so it scales.

**Licence: action needed before launch.** The supplied Neue Montreal files are marked "Demo / Trial" (they came
from befonts.com). Buy a commercial licence from Pangram Pangram (pangrampangram.com) that covers web use and
the build-time share images, then replace the files in `src/assets/fonts/` with the licensed ones (same names:
WOFF2 subset to the `unicode-range` in `global.css`, OTF for 400 and 500).

Text colours: ink `#010101` for headings; text = ink at 80%; text-2 = ink at 70% (ledes, intros, card text);
text-3 = ink at 60% (captions); on dark, white `#ffffff`, white at 70% and white at 60%. Two solid greys:
`--text-question` `#222222` (FAQ questions) and `--text-subtle` `#424242` (footer links). Every text colour for
light surfaces is at least 4.5:1 on `#f9fafa`, `#f3f4f6` and white (text-3, the lightest, is 5.5:1), and the
on-dark ones are at least 7:1 on `#010101` and `#111111`. H1s sweep through the spectrum once on load and H2s
ink in with the colour wave; both settle on ink.

| Style | Size (375 → 1440) | Line height | Weight | Letter spacing | Colour |
| --- | --- | --- | --- | --- | --- |
| Home hero H1 | 40 → 72 px (on wide screens also capped by the window height) | 1.04 | 500 | −0.035em | Ink |
| Nexova page H1 | 40 → 88 px | 1.04 | 500 | −0.035em | Ink |
| 404 H1 | 40 → 80 px | 1.04 | 500 | −0.035em | Ink |
| Inner page H1 (`.page-head h1`) | 40 → 64 px | 1.10 | 500 | −0.02em | Ink |
| Nexova name on the stage | 56 → 120 px | 1.00 | 500 | −0.03em | White |
| Large section H2 ("Two ways to grow", `--fs-h1`) | 34 → 64 px | 1.20 | 500 | −0.01em | Ink |
| Section H2, call-to-action H2 (`--fs-h2`) | 34 → 52 px | 1.20 | 500 | −0.01em | Ink (white on dark) |
| Footer tagline | 34 → 52 px | 1.10 | 500 | −0.02em | Ink |
| Service card title and number | 34 → 64 px (number 20 → 64) | 1.10 | 500 | −0.02em | White |
| Statements (`--fs-statement`): homepage, About, Nexova, audience panels | 24 → 44 px | 1.30 | 500 | −0.018em | Ink (white on colour panels) |
| Path panel titles (`--fs-display-s`; in the pinned scene also at most 5.6% of the window height) | 32 → 48 px | 1.10 | 500 | −0.03em | Ink (white on dark panels) |
| Large card titles: "Two ways to grow" cards, Nexova tab titles (`--fs-h3`) | 24 → 32 px | 1.24 | 500 | 0 | Ink (white on dark cards) |
| Card H3: "How we work with you", "What's included" (`--fs-lead`) | 20 → 24 px | 1.20–1.24 | 500 | 0 to −0.015em | Ink |
| Nexova cards under the stage | 20 → 24 px | 1.20 | 500 | −0.01em | Ink |
| Explainer H2 | 24 → 32 px | 1.20 | 500 | −0.01em | Ink |
| Team names | 24 → 32 px | 1.24 | 500 | −0.02em | Ink |
| Carousel card title | 24 → 32 px | 1.24 | 500 | −0.02em | Ink |
| Team figures | 24 → 31 px | 1.05 | 500 | −0.03em | Ink |
| Contact method titles (number, email, office) | 22 → 30 px | 1.20 | 500 | −0.02em | White on the WhatsApp card, ink on the others |
| Row list name (`--fs-lead`) | 20 → 24 px | 1.45 | 500 | −0.015em | Ink |
| FAQ question (`--fs-question`) | 18 → 22 px | 1.20 | 500 | 0 | `--text-question` `#222222` |
| Lede, section intro, explainer and feature text (`--fs-large`) | 17.2 → 20 px | 1.45 | 400 | 0 | Text-2 |
| Home hero intro on wide screens | 17 → 20 px with the window height, in balanced lines | 1.45 | 400 | 0 | Text-2 |
| Process step text | 17.2 → 20 px | 1.45 | 400 | 0 | Ink |
| Service card text | 17.2 → 20 px | 1.45 | 400 | −0.009em | White |
| Fact value (bento) | 17.2 → 20 px | 1.30 | 500 | −0.01em | Ink |
| Industry card | 17.2 → 20 px | 1.45 | 500 | −0.009em | White |
| Menu links | 18 → 20 px | 1.45 | 500 | −0.015em | Ink |
| Body text (`--fs-body`) | 16.1 → 18 px | 1.45 | 400 | −0.01em | Text |
| Card text, FAQ answer, row text, team bio, carousel card text | 16.1 → 18 px | 1.45 | 400 | −0.01em | Text-2 (white 70% on dark) |
| Label (icon + text) and hero messages | 15 → 16 px | 1.40 | 400 | −0.005em | Text-2, icon 18 px in ink |
| Glass pills | 15 → 16 px | 1.20 | 400 | −0.005em | Ink, icon 18 px in ink |
| Buttons (`.btn`, `--fs-body`) | 16.1 → 18 px | 1.20 | 500 | −0.01em | White on ink, or ink on white |
| Small buttons (`.btn-sm`: "Contact us" in the top bar, "Try it on nexova.my") | 15 → 16 px | 1.20 | 500 | −0.01em | White on ink, or ink on white |
| Tabs | 15 → 16 px | 1.45 | 500 | 0 | Ink (selected), text-2 |
| Footer links | 15 → 16 px | 1.45 | 500 | 0 | `--text-subtle` `#424242` |
| Footer contact (email, phone) | 15 → 16 px | 1.45 | 500 | −0.011em | Text |
| Nav pill (Menu, scroll %) | 14.4 px | 1.45 | 500 | −0.012em | White (ink when the pill turns white) |
| Captions: breadcrumbs, fact labels, menu title and labels, row numbers (`--fs-caption`) | 13 → 14 px | 1.25 | 500 | −0.01em | Text-3 |
| Menu contact links | 13 → 14 px | 1.45 | 500 | −0.012em | Ink |
| Footer bottom bar | 13 → 14 px | 1.25 | 500 | −0.01em | White 70% |
| Small numbers: explainer and step numbers | 13 → 14 px | 1.45 | 500 | −0.012em | Ink |
| Small capitals: eyebrows, footer headings, carousel tags, service categories, the Nexova stage title (`--fs-label`) | 12 px, uppercase | 1.20–1.45 | 500 | +0.06em | Text-3 (white or white 60% on dark) |

## Building blocks

| Piece | File | Notes |
| --- | --- | --- |
| Top bar, bottom nav pill, menu | `src/components/Header.astro` | The menu is a `<details>` element: it works without JavaScript |
| Logo | `Wordmark.astro` | The supplied SVG, unchanged; size by height |
| Label above a heading, hero messages | `Label.astro` | `icon` + text; pick an icon that says what the line is about |
| Glass pills (floating tags around a statement) | `.glass-pill` in `global.css`, with `Label.astro` | Translucent, blurred surface with a hairline edge; give the section a soft colour glow behind them so the glass reads. Homepage: five around the statement. About: from 1360 px wide (hidden below). Nexova page: in the corners below 1360 px, around the statement above |
| Homepage hero video | `src/pages/index.astro`, `src/scripts/hero.ts`, `src/assets/hero/` | Poster first; see "Hero video" below |
| The path to a sale (homepage) | `src/pages/index.astro` (`.path`) | Four full-height panels; see "The path to a sale" below |
| Footer | `src/components/Footer.astro` | |
| Call to action at the end of each page | `src/components/Cta.astro` | Contact turns it off (`cta={false}`) |
| Questions | `FaqBlock.astro` (section), `Faq.astro` (accordion) | Answers stay in the HTML; FAQPage JSON-LD matches |
| Facts | `Facts.astro` | `variant="bento"` for the card grid; same `<dl>` either way |
| Feature cards | `Features.astro` | Icons from `src/lib/icons.ts` |
| Numbered rows | `RowList.astro` | |
| Service cards that stack | `ServiceStack.astro` | `variant="home"` or `"full"` |
| Nexova stage with tabs | `NexovaStage.astro` | Real tabs; without JavaScript all panels show |
| Platform marks ("Works with" strip) | `src/lib/brands.ts`, `NexovaStage.astro` | White only; see "Platform marks" |
| Dark name grid | `DarkGrid.astro` | Industries |
| Interface sketches | `MockCard.astro` | Stand-ins for real screenshots; decorative only |
| Icons | `Icon.astro` | Drawn for this site, 20 px grid, one stroke weight |

Global classes (layout, buttons, cards, page heads, process steps, contact cards) are documented at the top
of each section in `global.css`.

## Motion rules

- The page is complete without motion. Every animation sits inside
  `screen and (prefers-reduced-motion: no-preference)` (so printing gets the finished page too);
  scroll-linked ones also need `@supports (animation-timeline: view())`. Browsers without them get the
  finished static layout.
- Nothing in the first screen animates in, so the main text paints immediately (good LCP). Animations use
  `transform` and `opacity`, so nothing shifts while scrolling (CLS 0).
- `src/scripts/site.ts` (about 9 KB gzipped, most of it Lenis, loaded as a deferred module) adds: momentum
  scrolling (Lenis, off with reduced motion), the scroll percentage and colour change of the nav pill, menu
  behaviour (Escape, tap outside, focus kept inside), the heading colour wave, blocks rising in, the bracket
  cursor and magnetic buttons (mouse only), rolling link hovers, carousel dragging, tabs, count-ups and the
  footer's "Pause animations" button.
- Wherever text is split into letters for an effect, the letters are `aria-hidden` and a plain copy is kept
  for screen readers.
- Headings in pinned (sticky) stages, and on the first screen, reveal once in time (1.25 s) instead of with
  the scroll.
- Hooks in the markup: `data-split` (heading colour wave, on section `h2`s), `data-rise` (blocks rise into
  place once, as they come into view), `data-magnetic` (buttons follow the pointer slightly),
  `data-surface="dark"` (dark sections and dark cards, so the nav pill turns white over them) and
  `data-surface="light"` (light panels inside a dark section, which keep the pill dark). The pill follows
  the surface under its centre point,
  `data-carousel`, `data-tabs`, `data-count`.
- Anything that loops on its own must be listed in the `html.motion-paused` rule in `global.css`, so the
  footer's "Pause animations" button stops it (WCAG 2.2.2).
- Pinned scenes need room: the homepage statement with its five pills, like the path scene, runs only on
  windows at least 576 px tall. Shorter ones (landscape phones, a large zoom) get the static layout, where no
  pill can land on the words.
- Print: everything prints black on white (`@media print` in `global.css`), without the top bar, nav pill or
  pause buttons. The hero prints without its scene, the Nexova tabs print all four panels, the carousel prints
  every card in two columns, service cards print at their content's height and count-ups show their real
  values.

## Hero video

- Source: the supplied 4K clip, made into a 6.8 s loop (163 frames at 24 fps), no sound.
- Files in `src/assets/hero/`: `hero-1080` and `hero-720` (1920 × 1080 and 1280 × 720), each in AV1
  (`.av1.mp4`, about 480 and 300 KB), VP9 (`.webm`, about 430 and 265 KB) and H.264 (`.mp4`, about 645 and
  340 KB); posters `hero-poster-{720,1280,1920}` in AVIF, WebP and JPEG (the loop's first frame; the AVIF
  ones are 11, 25 and 43 KB). The poster is the first paint, served from a `srcset`, so phones never fetch
  the large one.
- Choosing a file (`src/scripts/hero.ts`, from the `data-sources` list in `index.astro`): 1080p when the
  video is drawn taller than about 820 device pixels (pixel ratio counted up to 2) and the connection is not
  3G, otherwise 720p. Then the first codec the browser decodes smoothly and power-efficiently (Media
  Capabilities), in the order AV1, VP9, H.264; browsers without that API use `canPlayType`.
- The loop is seamless in the file itself: its last 1.25 s dissolves into its first frame (see "Rebuilding
  the loop" below).
- Playback: starts after the page has loaded, two `<video>` elements take turns so the browser never seeks
  back to the start on screen, pauses when the hero is scrolled away or the tab is hidden, and never runs
  with reduced motion, Save-Data or a 2G connection (the poster shows instead).
- The round button in the hero pauses the video and the rotating messages; the choice is remembered. The
  footer's "Pause animations" sets the same choice, so the two never disagree.
- Wide screens (7:5, about 1.4:1, and wider, at least 480 px tall): the scene fills the hero and the text sits in
  the sky. Narrower screens: the scene fills the lower half, cropped to the middle and lifted clear of the nav
  pill. On phones 656 px tall and up whose hero is taller than the screen, `src/scripts/hero.ts` lifts it
  (`--frame-lift`) towards the bottom of the first screen, as far as it can while the people stay 12 px clear
  of the buttons (a little smaller up to 700 px tall), so the nav pill doesn't cover them. Landscape phones (wide
  but under 480 px tall) use the stacked layout with a compact text block (under 360 px tall: a one-line
  heading and no rotating badge); the people rise into view on the first scroll. Short wide windows (481 to
  576 px tall) keep the wide layout, set tighter.
- The pause button sits in the sky beside the scene. On phones up to 820 px tall, and on landscape phones,
  there is no free spot there, so it sits top right, centred in the gap under the top bar (36 px to look at,
  a 44 px tap area); the top bar's empty area lets taps through (`pointer-events`). It comes first in the
  hero's markup, so keyboard users reach it before the hero's links, and Shift+Tab back to it scrolls it into
  view.
- Only the hero fades into the next section (text drifts up and fades, the scene eases in and fades, the
  next section's top edge is a soft veil). No other section uses this transition. The faded text and pause
  button stay focusable (opacity only, never `visibility: hidden`): Shift+Tab from the page below reaches them
  and scrolls the hero back. While faded they ignore clicks (`.is-faded`).

Rebuilding the loop from a new clip (ffmpeg). 30 frames is 1.25 s at 24 fps. The loop is the clip minus its
first 30 frames, and 133 is that length minus 30 more (the current clip has 193 frames: a 163-frame loop, so
133); use your clip's own numbers. Make the 1080p master, scale it down for 720p, then encode each size three
times (shown for 1080; repeat with 720):

```bash
ffmpeg -i clip.mp4 -filter_complex "[0:v]scale=1920:1080:flags=lanczos,split=2[x][y];[x]trim=start_frame=30,setpts=PTS-STARTPTS[main];[y]trim=end_frame=30,setpts=PTS-STARTPTS,format=yuva420p,fade=t=in:st=0:d=1.25:alpha=1,setpts=PTS+(133/24)/TB[head];[main][head]overlay=eof_action=pass,format=yuv420p[out]" -map "[out]" -an -c:v ffv1 seamless-1080.mkv
ffmpeg -i seamless-1080.mkv -vf scale=1280:720:flags=lanczos -c:v ffv1 -level 3 seamless-720.mkv
ffmpeg -i seamless-1080.mkv -c:v libsvtav1 -preset 4 -crf 42 -g 48 -pix_fmt yuv420p -svtav1-params tune=0 -movflags +faststart -an hero-1080.av1.mp4
ffmpeg -i seamless-1080.mkv -c:v libvpx-vp9 -crf 37 -b:v 0 -row-mt 1 -deadline good -cpu-used 1 -g 48 -pix_fmt yuv420p -an hero-1080.webm
ffmpeg -i seamless-1080.mkv -c:v libx264 -preset veryslow -crf 26 -profile:v high -level:v 4.0 -pix_fmt yuv420p -g 48 -keyint_min 48 -sc_threshold 0 -movflags +faststart -an hero-1080.mp4
```

If a new file changes the codec profile or level, update its `type` string in `heroSources` in `index.astro`
(for example `av01.0.08M.08` for 1080p AV1, `vp09.00.40.08` for 1080p VP9, `avc1.640028` for H.264 High 4.0).

## The path to a sale

The homepage's four steps are full-height panels, light and dark in turn, after the reference's "Your creative
partner" section. Light panels have four small round notches in their side edges, like a ticket.

- Pinned scene (motion allowed, `animation-timeline` supported, window at least 576 px tall): the section
  holds while the panels slide in from the right, driven by the scroll.
  - Laptops and desktops (1024 px wide and up, any height): two panels side by side, so each step reads as
    a card. The heading first moves into
    the left half as panel 1 takes the right half, then leaves with it; the panels then step along one at a
    time. Words on top; on the dark panels the sketch is on top and the words below.
  - Tablets on their side (768 to 1023 px wide): one panel at a time, words and sketch side by side.
  - Phones and portrait tablets: one panel at a time, words and sketch stacked.
  - The sketch area is a size container: the sketches step down (zoom 1.15, 1, 0.8, 0.7) to fit the room a
    panel has, and leave only when there is too little. Panels keep their words at least 1 rem clear of the
    nav pill.
  - Keyboard: when focus moves to a link inside, the scene becomes a sideways-scrolling row, so the focused
    link is in view.
  - Phones: the stage is as tall as the screen with the browser toolbar retracted (`100lvh`), and the panels
    add the toolbar's height (`--bar`, `100lvh - 100svh`) to their bottom padding, so no strip of the black
    section shows when the toolbar hides and the words stay clear of the nav pill when it shows.
- Everywhere else (reduced motion, older browsers, very short windows): the panels are stacked full-width bands,
  words and sketch side by side from 1024 px.

## Platform marks

The Nexova opening ends with a "Works with" strip of six marks: Shopee, TikTok (standing for TikTok Shop),
Facebook, Instagram, Google and Claude (for "Built on Claude, by Anthropic"). The shapes are simple-icons
paths in `src/lib/brands.ts`. The names stay in the page as a visually hidden list after the "Works with"
label; the moving band is `aria-hidden`.

- White only (`--on-dark`): no brand colours, no grey, no outlines or effects. Meta allows its logos in
  their own colour or white, and Google does not allow its G to be recoloured.
- A mark's 24-unit box is 24 px on phones and 28 px on desktop. Each mark has an optical `scale` and
  `nudge` in the `works` list in `NexovaStage.astro`, so the six look equally heavy on one centre line. A
  new or replaced mark needs its own values: set them by eye against the others, then look at the row
  blurred (equal brightness means equal weight).
- No names beside the marks (Meta does not allow words attached to its logos), no links, no hover colour.
  Hovering with a mouse only holds the drift.
- Still (reduced motion, print): one centred row. Moving: two sets of the six marks twice, 40 s per set,
  faded edges, stopped by "Pause animations" in the footer.
- Before launch, swap the simple-icons shapes for each brand's official files and settle the open brand
  questions (Google's G, Instagram beside TikTok).

## Rules that keep it working

- Write content in `src/data/`, following CONTENT-GUIDE.md. The design never needs invented numbers, logos
  or testimonials; sections that need proof appear only when real data exists (case studies, for example).
- Decorative visuals are `aria-hidden`. Text stays real text: no text in images.
- No decorative arrows on buttons and links. An icon goes in a button only when it says something (chat,
  mail, phone, download). Controls keep their working icons: carousel chevrons, the FAQ plus, the menu
  burger, the hero pause button. A card or row that is one big link shows it on hover (the title underlines).
- Dark sections carry `data-surface="dark"`; a light panel inside a dark section carries `data-surface="light"`.
- To clip a container that holds a `data-split` heading, use `clip-path: inset(0)` (with `round <radius>` for
  rounded panels), not `overflow: hidden`. Overflow creates a scroll container, and the heading's scroll timeline
  would stop following the page (the script then leaves that heading unanimated). Do not pair
  `overflow: hidden` with `overflow: clip` either: the build minifier keeps only `clip`, which Safari 14
  and 15 ignore. `overflow: clip` on its own is fine inside `@supports (animation-timeline: view())` (those
  browsers never reach it); the path scene uses it to keep its sliding panels out of the page width.
- Name every CSS animation in its `animation` shorthand (`animation: name linear both`). A shorthand
  without a name is collapsed to `animation: none` by the build.
- Keep phone numbers in `<span class="nowrap">` and let emails break only after the @ (`<wbr>`).
- Keep one `h1` per page and the heading order.
