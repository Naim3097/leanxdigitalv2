import type { APIRoute } from 'astro';
import { iconPng, pngToIco } from '../lib/images';

// 48x48: Google Search shows favicons that are a multiple of 48px.
export const GET: APIRoute = async () => {
  const ico = pngToIco(await iconPng(48), 48);
  return new Response(new Uint8Array(ico), { headers: { 'Content-Type': 'image/x-icon' } });
};
