// Public browser identifier, supplied by the owner in Ads Manager.
export const openAIAdsPixelId = 'LudhL2fb31yULUmELz6oZB';

export function openAIAdsBootstrap(pixelId: string) {
  return `(${function (id: string) {
    if (!['www.sshomedesigns.com', 'sshomedesigns.com'].includes(window.location.hostname)) return;
    if (window.oaiq) return;
    const queue = function (...args: unknown[]) { queue.q.push(args); };
    queue.q = [] as unknown[][];
    window.oaiq = queue;
    const sdk = document.createElement('script');
    sdk.async = true;
    sdk.src = 'https://bzrcdn.openai.com/sdk/oaiq.min.js';
    document.head.appendChild(sdk);
    window.oaiq('init', { pixelId: id, debug: false });

    function track(element: Element | null, dateSearch: boolean) {
      if (!element) return;
      const raw = element.getAttribute(dateSearch ? 'action' : 'href');
      if (!raw) return;
      let url: URL;
      try { url = new URL(raw, window.location.origin); } catch { return; }
      const direct = url.protocol === 'https:' && url.hostname === 'www.airbnb.com' && /^\/rooms\/(1800164576342497106|1291019377672253246)\/?$/.test(url.pathname);
      const short = url.origin === window.location.origin && /^\/go\/(desert|family)\/?$/.test(url.pathname);
      if (!direct && !short) return;
      // Review browsing is not an availability or booking-intent conversion.
      if (element.getAttribute('data-airbnb-intent') === 'reviews') return;
      window.oaiq?.('measure', 'custom', { type: 'custom' }, { custom_event_name: 'airbnb_click', opt_out: true });
      if (dateSearch) window.oaiq?.('measure', 'custom', { type: 'custom' }, { custom_event_name: 'airbnb_date_search', opt_out: true });
    }
    document.addEventListener('click', (event) => {
      if (!event.defaultPrevented && event.target instanceof Element) track(event.target.closest('a'), false);
    });
    document.addEventListener('submit', (event) => {
      if (!event.defaultPrevented && event.target instanceof HTMLFormElement) track(event.target, true);
    });
  }.toString()})(${JSON.stringify(pixelId)});`;
}

declare global {
  interface Window {
    oaiq?: ((...args: unknown[]) => void) & { q?: unknown[][] };
  }
}
