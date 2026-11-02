'use client';

import Script from 'next/script';
import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// No destination query strings, travel dates or guest counts are sent.
export function Analytics() {
  useEffect(() => {
    if (!measurementId || !/^G-[A-Z0-9]+$/.test(measurementId)) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);

    function track(element: Element | null, method: string) {
      if (!element) return;
      const raw = element.getAttribute(element.tagName === 'FORM' ? 'action' : 'href');
      if (!raw) return;
      const url = new URL(raw, window.location.origin);
      const room = url.hostname === 'www.airbnb.com' ? url.pathname.match(/^\/rooms\/(\d+)/)?.[1] : undefined;
      const shortLink = url.origin === window.location.origin && /^\/go\/(desert|family)$/.test(url.pathname);
      if (!room && !shortLink) return;
      window.gtag?.('event', 'airbnb_click', {
        listing_id: room || url.pathname.split('/').pop(),
        placement: element.getAttribute('data-booking-placement') || method,
        intent: element.getAttribute('data-airbnb-intent') || (method === 'date-form' ? 'availability' : 'listing'),
        page_path: window.location.pathname,
        transport_type: 'beacon',
      });
    }
    const click = (event: MouseEvent) => {
      if (!event.defaultPrevented && event.target instanceof Element) track(event.target.closest('a'), 'link');
    };
    const submit = (event: SubmitEvent) => {
      if (!event.defaultPrevented && event.target instanceof HTMLFormElement) track(event.target, 'date-form');
    };
    document.addEventListener('click', click);
    document.addEventListener('submit', submit);
    return () => {
      document.removeEventListener('click', click);
      document.removeEventListener('submit', submit);
    };
  }, []);

  if (!measurementId || !/^G-[A-Z0-9]+$/.test(measurementId)) return null;
  return <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />;
}
