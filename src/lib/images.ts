// Build-time image rendering. Satori turns text into vector paths using the
// bundled Geist font, so images look the same on any build machine (no system fonts needed).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

const INK = '#0b0b0b';
const PAPER = '#ffffff';
const GREY = '#5c5c5c';

const font = (weight: 400 | 500 | 600 | 700) => ({
  name: 'Geist',
  weight,
  style: 'normal' as const,
  data: readFileSync(
    join(process.cwd(), `node_modules/@fontsource/geist/files/geist-latin-${weight}-normal.woff`),
  ),
});

let fonts: ReturnType<typeof font>[] | undefined;

type El = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (El | string)[]): El => ({
  type,
  props: { style, children: children.length === 1 ? children[0] : children },
});

const mark = (size: number, fg = PAPER, bg = INK): El => ({
  type: 'svg',
  props: {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    children: [
      { type: 'rect', props: { width: 24, height: 24, rx: 5, fill: bg } },
      {
        type: 'path',
        props: {
          d: 'M8 8l8 8M16 8l-8 8',
          stroke: fg,
          'stroke-width': 2.4,
          'stroke-linecap': 'round',
        },
      },
    ],
  },
});

export async function ogImage(opts: {
  eyebrow: string;
  headline: string;
  sub: string;
  footLeft: string;
  footRight: string;
}): Promise<Buffer> {
  fonts ??= [font(400), font(500), font(600), font(700)];
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
      fontFamily: 'Geist',
    },
    h(
      'div',
      { display: 'flex', alignItems: 'center', gap: 16 },
      mark(44),
      h('div', { fontSize: 30, fontWeight: 700, letterSpacing: -1 }, 'lean.x digital'),
    ),
    h(
      'div',
      { display: 'flex', flexDirection: 'column' },
      h(
        'div',
        { fontSize: 22, fontWeight: 500, letterSpacing: 3, textTransform: 'uppercase', color: GREY },
        opts.eyebrow,
      ),
      h(
        'div',
        {
          fontSize: big,
          fontWeight: 600,
          letterSpacing: big * -0.045,
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

/** Square icon: black tile, white x. `rounded` adds corner radius (off for apple-touch-icon). */
export function iconPng(size: number, rounded = true): Promise<Buffer> {
  const rx = rounded ? 5 : 0;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
  <rect width="24" height="24" rx="${rx}" fill="${INK}"/>
  <path d="M8 8l8 8M16 8l-8 8" stroke="${PAPER}" stroke-width="2.4" stroke-linecap="round" fill="none"/>
</svg>`;
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
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
