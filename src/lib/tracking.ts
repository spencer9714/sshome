import config from '@/data/tracking-config.json';

// Prefix numeric IDs: GA4 may otherwise interpret dimension values as numbers.
// Short routes and direct listing links resolve to the same reporting value.
export function airbnbTrackingTarget(raw: string, origin: string) {
  let url: URL;
  try { url = new URL(raw, origin); } catch { return null; }
  const room = url.hostname === 'www.airbnb.com' && url.protocol === 'https:'
    ? url.pathname.match(/^\/rooms\/(\d+)\/?$/)?.[1] : undefined;
  const shortKey = url.origin === origin ? url.pathname.match(/^\/go\/(desert|family|sand)\/?$/)?.[1] : undefined;
  const shortListing = shortKey ? config.listings[shortKey as keyof typeof config.listings] : undefined;
  const id = room || shortListing?.id;
  if (!id) return null;
  return { listing_id: `airbnb_${id}` };
}

export function airbnbClickParameters(raw: string, origin: string, pagePath: string, placement: string | null, intent: string | null, method: string) {
  const target = airbnbTrackingTarget(raw, origin);
  if (!target) return null;
  return {
    ...target,
    placement: placement || method,
    intent: intent === 'booking' ? 'availability' : intent || (method === 'date-form' ? 'availability' : 'listing'),
    page_path: pagePath,
    transport_type: 'beacon',
  };
}
