'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import config from '@/data/tracking-config.json';
import { airbnbClickParameters } from '@/lib/tracking';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// GA measurement IDs are public identifiers. Hosting configuration can override
// this default; an empty override disables tracking.
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? config.measurementId;

// No destination query strings, travel dates or guest counts are sent.
export function Analytics() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (!measurementId || !/^G-[A-Z0-9]+$/.test(measurementId)) return;
    // Keep local development and Vercel previews out of the production reports.
    if (!['www.sshomedesigns.com', 'sshomedesigns.com'].includes(window.location.hostname)) return;
    setEnabled(true);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    const debug = new URLSearchParams(window.location.search).get('analytics_debug') === '1';
    window.gtag('config', measurementId, debug ? { debug_mode: true } : {});

    function track(element: Element | null, method: string) {
      if (!element) return;
      const raw = element.getAttribute(element.tagName === 'FORM' ? 'action' : 'href');
      if (!raw) return;
      const params = airbnbClickParameters(raw, window.location.origin, window.location.pathname,
        element.getAttribute('data-booking-placement'), element.getAttribute('data-airbnb-intent'), method);
      if (!params) return;
      window.gtag?.('event', 'airbnb_click', params);
      // A date-form submission is a stronger intent signal, never a purchase.
      if (method === 'date-form') window.gtag?.('event', 'airbnb_date_search', params);
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

  if (!enabled) return null;
  return <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />;
}
