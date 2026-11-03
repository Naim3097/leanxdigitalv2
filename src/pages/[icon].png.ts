import type { APIRoute, GetStaticPaths } from 'astro';
import { iconPng } from '../lib/images';

const icons: Record<string, { size: number; rounded: boolean }> = {
  'apple-touch-icon': { size: 180, rounded: false },
  'icon-192': { size: 192, rounded: true },
  'icon-512': { size: 512, rounded: true },
};

export const getStaticPaths: GetStaticPaths = () =>
  Object.keys(icons).map((icon) => ({ params: { icon } }));

export const GET: APIRoute = async ({ params }) => {
  const { size, rounded } = icons[params.icon as string];
  const png = await iconPng(size, rounded);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
