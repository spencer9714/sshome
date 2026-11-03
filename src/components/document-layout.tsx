/* Shared App Router root layout for both languages; beforeInteractive belongs
 * here. These Pages Router lint rules do not recognize the shared root wrapper. */
/* eslint-disable @next/next/no-head-element, @next/next/no-before-interactive-script-outside-document */
import type { Metadata } from 'next';
import { Fraunces, Instrument_Sans } from 'next/font/google';
import { JsonLd } from '@/components/json-ld';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { organizationSchema } from '@/lib/schema';
import { site, siteUrl } from '@/lib/site';
import '@/app/globals.css';
import { Analytics } from '@/components/analytics';
import Script from 'next/script';
import { openAIAdsBootstrap, openAIAdsPixelId } from '@/lib/openai-pixel';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' });
const instrument = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument', display: 'swap' });

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } : {},
  },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: '/',
    images: [{ url: site.ogImage, width: 1440, height: 960 }],
  },
  twitter: { card: 'summary_large_image' },
};

export function DocumentLayout({ children, language }: { children: React.ReactNode; language: 'en' | 'zh-Hant' }) {
  return (
    <html lang={language} className={`${fraunces.variable} ${instrument.variable}`}>
      <head>
        <Script id="openai-ads-pixel" strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: openAIAdsBootstrap(openAIAdsPixelId) }} />
      </head>
      <body>
        <Analytics />
        <JsonLd data={organizationSchema()} />
        <SiteHeader language={language} />
        <main>{children}</main>
        <SiteFooter language={language} />
      </body>
    </html>
  );
}
