// Build-time image rendering. Satori turns text into vector paths using the site's own
// typeface, Neue Montreal, read from src/assets/fonts/, so images look the same on any build
// machine (no system fonts needed). Satori cannot read WOFF2, so it gets the OTF copies of
// the two weights the site uses: 400 for text, 500 for everything heavier.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { LOGO_SHAPES, LOGO_VIEWBOX, LOGO_X, LOGO_YELLOW } from './logo';

const INK = '#0b0b0b';
const PAPER = '#ffffff';
const GREY = '#5c5c5c';

const font = (weight: 400 | 500) => ({
  name: 'Neue Montreal',
  weight,
  style: 'normal' as const,
  data: readFileSync(join(process.cwd(), `src/assets/fonts/neue-montreal-${weight}.otf`)),
});

let fonts: ReturnType<typeof font>[] | undefined;

type El = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (El | string)[]): El => ({
  type,
  props: { style, children: children.length === 1 ? children[0] : children },
});

// The official logo at a given height, its proportions unchanged: letters in ink, the x and accent yellow.
const [, , logoW, logoH] = LOGO_VIEWBOX;
const wordmark = (height: number, letters = INK): El => ({
  type: 'svg',
  props: {
    width: Math.round((height * logoW) / logoH),
    height,
    viewBox: LOGO_VIEWBOX.join(' '),
    children: LOGO_SHAPES.map((s) => ({
      type: s.tag,
      props: { ...s.attrs, fill: s.accent ? LOGO_YELLOW : letters },
    })),
  },
});

export async function ogImage(opts: {
  eyebrow: string;
  headline: string;
  sub: string;
  footLeft: string;
  footRight: string;
}): Promise<Buffer> {
  fonts ??= [font(400), font(500)];
  const len = opts.headline.length;
  const big = len <= 12 ? 112 : len <= 20 ? 96 : 76;

  const tree = h(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '64px 72px',
      background: PAPER,
      color: INK,
      fontFamily: 'Neue Montreal',
    },
    h(
      'div',
      { display: 'flex', alignItems: 'center' },
      wordmark(46),
    ),
    h(
      'div',
      { display: 'flex', flexDirection: 'column' },
      h(
        'div',
        { fontSize: 22, fontWeight: 500, letterSpacing: 22 * 0.06, textTransform: 'uppercase', color: GREY },
        opts.eyebrow,
      ),
      h(
        'div',
        {
          fontSize: big,
          fontWeight: 500,
          letterSpacing: big * -0.02,
          lineHeight: 1,
          marginTop: 20,
          maxWidth: 1056,
        },
        opts.headline,
      ),
      h(
        'div',
        { fontSize: 32, fontWeight: 400, color: GREY, marginTop: 28, maxWidth: 940, lineHeight: 1.35 },
        opts.sub,
      ),
    ),
    h(
      'div',
      {
        display: 'flex',
        justifyContent: 'space-between',
        borderTop: `2px solid ${INK}`,
        paddingTop: 22,
        fontSize: 24,
        fontWeight: 500,
      },
      h('div', {}, opts.footLeft),
      h('div', {}, opts.footRight),
    ),
  );

  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

/** The logo's yellow x, centred on a black square, as an SVG string (favicon.svg uses the same drawing). */
export function iconSvg(size: number, rounded = true): string {
  // The x's own bounds inside the logo: 970.54 to 1214.24 across, 116.5 to 364.17 down.
  const [x0, x1, y0, y1] = [970.54, 1214.24, 116.5, 364.17];
  const scale = (0.56 * 512) / (y1 - y0);
  const tx = 256 - ((x0 + x1) / 2) * scale;
  const ty = 256 - ((y0 + y1) / 2) * scale;
  const rx = rounded ? 112 : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${rx}" fill="${INK}"/>
  <polygon transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(5)})" points="${LOGO_X.attrs.points}" fill="${LOGO_YELLOW}"/>
</svg>`;
}

/** Square icon: the logo's yellow x on a black tile. `rounded` adds corner radius (off for apple-touch-icon). */
export function iconPng(size: number, rounded = true): Promise<Buffer> {
  return sharp(Buffer.from(iconSvg(size, rounded))).png({ compressionLevel: 9 }).toBuffer();
}

/** Wraps a PNG in a single-image .ico container. */
export function pngToIco(png: Buffer, size: number): Buffer {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(size >= 256 ? 0 : size, 6);
  header.writeUInt8(size >= 256 ? 0 : size, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  return Buffer.concat([header, png]);
}
