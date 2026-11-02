import { stays } from '@/data/stays';
import { stayPath } from '@/lib/schema';
import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';

const xml = (value: string) => value.replace(/[<>&"']/g, (character) => ({
  '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
})[character]!);

export function GET() {
  const entries = stays.map((stay) => {
    const photos = Array.from(new Set(stay.photos.map((photo) => absoluteUrl(photo.src))));
    return `<url><loc>${xml(absoluteUrl(stayPath(stay)))}</loc>${photos.map((photo) => `<image:image><image:loc>${xml(photo)}</image:loc></image:image>`).join('')}</url>`;
  });
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${entries.join('')}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
