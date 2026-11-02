# SSHOME

Marketing site for SSHOME's Airbnb homes in Visalia, California, near Sequoia and Kings Canyon National Parks. Built for search engines and AI agents as well as guests. Bookings happen on Airbnb.

## Develop

```bash
npm install
npm run dev
```

## Update content

Everything about a home lives in [src/data/stays.ts](src/data/stays.ts). Pages, the comparison table, structured data, the sitemap and `/llms.txt` are all generated from it. `beds` counts permanent bedroom beds only; sofa beds and air mattresses are described separately in `bedSummary`, `sleeping` and `extraSleeping`. The Chinese guide reads `summaryZh` from the same file. Family review labels and FAQ read the single `familyRating` snapshot.

English pages use the `(en)` route group; the Chinese guide uses `(zh)`. Both use `DocumentLayout`, with server-rendered document language `en` or `zh-Hant`. These internal folders do not change public URLs. The two guides publish reciprocal language alternates and self-canonicals.

Traditional Chinese SEO pages: `/zh-tw`, `/zh-tw/stays/<slug>` and `/zh-tw/sequoia-guide`. Homepage, listing and guide pairs have self-canonicals, reciprocal `en`/`zh-Hant`/`x-default` alternates, sitemap entries and language-switch links. Chinese listing copy lives in `src/data/stays-zh.ts`; factual sleeping summaries remain in `stays.ts`. Chinese listings have localized metadata, descriptive rental schema, booking controls, navigation, check-in/out details and house rules. Both languages use the complete interactive photo tour; Chinese room labels and controls are localized, while detailed original English photo captions are marked as English. Keep English and Chinese amenities and rules synchronized when facts change. Publishing these pages does not guarantee indexing or rankings.

After building, start a local production server (`npm run start -- --port 3100`) and run `npm run test:seo`. If the build intentionally uses a different `NEXT_PUBLIC_SITE_URL`, pass the serving origin and expected canonical origin explicitly, e.g. `npm run test:seo -- http://localhost:3100 http://localhost:3000`. The checks cover rendered routes, languages, canonicals, guide alternates, sleeping counts, descriptive schema, adult/child fields, click intent markers, 404s and canonical audit regression cases. They do not replace browser testing of date pickers, Airbnb's live UI, or GA4 event receipt.

To add a home:

1. Put its photos in `public/stays/<folder>/`.
   Each photo entry includes a `space` label (such as `Living room` or `Bedroom 1`); the photo tour groups by that label in first-appearance order. Keep each bedroom separate and use confirmed room descriptions.
2. Add an entry to the `stays` array, and only include facts confirmed on the live Airbnb listing.
3. Update `factsCheckedOn`, and the "Which SSHOME home is best" answer in `siteFaqs`, which names the homes.

Ratings and review counts are copied by hand, so re-check them periodically.

## Deploy

The production site is `https://www.sshomedesigns.com`, the default for canonical URLs, the sitemap and structured data. `NEXT_PUBLIC_SITE_URL` overrides it, so leave that variable unset in production.

## Machine-readable surfaces

- `/llms.txt`: plain-text summary for AI agents
- `/sitemap.xml` and `/robots.txt`
- `/image-sitemap.xml`: all original listing photos, associated with their listing pages; advertised in robots.txt. Submit it in Search Console after deployment. Image entries help discovery and do not guarantee image-search placement.
- JSON-LD on every page: `VacationRental`, `FAQPage`, `BreadcrumbList`, `Organization`, `Article`

The rental schema describes occupancy using `value` and deliberately omits approximate coordinates and copied Airbnb review/rating markup. Visible Airbnb reviews retain source links and snapshot dates. This is descriptive schema, not a claim of eligibility for Google's Vacation Rental/Hotel Center program. Do not manufacture precise coordinates or addresses to pass rich-result checks. FAQ content remains useful to guests; FAQ schema is not a promise of a Google rich result.

English and Chinese homepages expose a `CollectionPage` with a two-home `ItemList`; listing `WebPage` markup links to the corresponding rental entity. Page modification dates are maintained in `src/data/page-updates.ts`, separately from `factsCheckedOn` (Airbnb facts/review snapshot). Update only the pages actually edited, not every date on each build.

On 2026-11-02 the production HTTP/canonical/robots audit passed for all nine pages and the three crawler User-Agent probes. IndexNow returned HTTP 202: notification received, key validation pending. This is not confirmation of Bing, Google or ChatGPT indexing; use the verified owner dashboards for that.

## Search verification and crawl checks

Production audit on 2026-11-01 (America/Los_Angeles): `www.sshomedesigns.com` resolved through `ext-sq.squarespace.com`. The homepage, rental pages, guide and sitemap returned Squarespace HTTP 404 with title “Website Expired”. The live robots.txt returned `User-agent: *` with `Disallow: /`. Changing this repository does not change that Squarespace deployment or its DNS.

First point the domain at the approved Next.js deployment and verify its TLS certificate. Preserve mail-related DNS records. Use the actual hosting provider's required records; do not guess deployment targets.

1. In Google Search Console add the URL-prefix property `https://www.sshomedesigns.com/`, choose HTML tag verification, and put only the `content` value in the host environment variable `GOOGLE_SITE_VERIFICATION`. Alternatively use DNS verification for a Domain property. Redeploy, then finish verification in the owner's account.
2. In Bing Webmaster Tools add the same site, choose the meta-tag option and set `BING_SITE_VERIFICATION` to the `msvalidate.01` content value. Redeploy and finish verification, or import an already verified Google property using Bing's supported flow.
3. Submit `https://www.sshomedesigns.com/sitemap.xml` in both accounts. Inspect the homepage, both `/stays/*` pages, `/sequoia-kings-canyon-guide`, `/zh-tw/sequoia-guide` and `/about`. Review index status and crawl errors in the dashboards; HTTP success is not proof of indexing.
4. Run `npm run seo:audit` against production. It checks HTTP responses, sitemap entries, canonical tags, obvious noindex rules and homepage responses to Googlebot, bingbot and OAI-SearchBot User-Agent probes. This is a conservative preflight, not a complete robots parser or real crawler IP test. Review CDN/WAF configuration and verified crawler logs before claiming actual bot access is confirmed.
5. IndexNow proof is stored in `indexnow.json` and the matching public root `.txt` file. This key is intentionally public and is not an account password. Once deployed, run `npm run indexnow:submit` after meaningful content updates. The script refuses submission if the production audit fails or the published proof file does not match. It notifies participating engines; it does not submit to Google Search Console or guarantee indexing. Check Bing's dashboard for receipt.

Commands require network access. Do not submit the expired Squarespace pages. No Google/Bing verification or sitemap submission has been completed merely by adding these source settings.

Official references: [Google sitemap submission](https://developers.google.com/webmaster-tools/v1/sitemaps/submit), [Bing IndexNow setup](https://www.bing.com/indexnow/getstarted), [OpenAI crawler access](https://developers.openai.com/api/docs/bots).

## Airbnb links and measurement

- `/go/desert` and `/go/family` are temporary redirects to the corresponding clean Airbnb URLs. Use them for QR codes or social posts; home pages remain available for comparison. Next.js forwards incoming query parameters, so do not add fixed travel dates to evergreen campaign links.
- Optional GA4: set `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX` in the hosting environment and rebuild. Without a valid ID, the site loads no analytics script and sends no analytics events.
- Once configured, GA4 receives `airbnb_click` for Airbnb links and valid date-form submissions, with `listing_id`, `placement`, and `page_path`. These include review/contact links as well as booking links: they measure outbound interest, not confirmed bookings. Travel dates and guest counts are not included in the custom event.
- `intent` distinguishes `availability`, `reviews`, `amenities`, `contact` and general `listing` visits. Report availability separately from review and contact clicks. The booking form sends separate `adults` (13+) and `children` (2–12), plus their combined `guests` count; combined guests cannot exceed the home's limit. Infants are added on Airbnb.
- Tag links **into the website** with campaign parameters, e.g. `/?utm_source=instagram&utm_medium=social&utm_campaign=desert_pool#homes`. GA4 handles source attribution and page views. Link to the home page or an individual home page when website engagement matters: a direct visit to `/go/*` redirects before the analytics script runs, so it is not measured by this client-side integration.
- Compare traffic source and `airbnb_click` by listing/placement in GA4. Confirm event receipt in DebugView/Realtime after configuring the real property; then separately compare Airbnb reservations. Analytics integration is not a cross-domain booking attribution system.

## Launch and promotion

1. Verify the deployed homepage, new guide pages, `/robots.txt`, `/sitemap.xml`, and both short redirects. Ensure the host/CDN allows OAI-SearchBot requests and its official IP ranges. Application robots rules alone cannot verify the firewall.
2. Submit the sitemap in Google Search Console and Bing Webmaster Tools using the owner's accounts. Monitor indexing and queries; crawling and structured data do not guarantee search or ChatGPT recommendations.
3. Start with two campaign themes: Desert Retreat — park days followed by poolside downtime (pool is unheated); Luxury Family Home — shared meals, pool-table evenings and room for two families. Use real photos and separate landing pages. Never advertise ping pong or air hockey.
4. Example Desert caption: “Giant trees by day. Your own poolside retreat by evening. Five bedrooms in Visalia for your Sequoia getaway. Check dates on Airbnb.”
5. Example Family caption: “Bring the whole crew. A four-bedroom Visalia home with a pool table, loft and private hot tub. Explore sleeping arrangements and check dates on Airbnb.” Do not promise first-night hot tub readiness.
6. Link Traditional Chinese travel posts to `/zh-tw/sequoia-guide`. Follow each community's promotional rules. Start paid campaigns only after the real measurement property is verified; judge campaigns using qualified traffic and Airbnb outcomes, not clicks alone.

Guest-facing contact stays on Airbnb. Add personal host bios, portraits, email or social handles only once the owners provide approved details. Recheck amenities, fees, reviews and road information before changing `factsCheckedOn`.
