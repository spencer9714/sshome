# SSHOME

Marketing site for SSHOME's Airbnb homes in Visalia, California, near Sequoia and Kings Canyon National Parks. Built for search engines and AI agents as well as guests. Bookings happen on Airbnb.

## Develop

```bash
npm install
npm run dev
```

## Update content

Everything about a home lives in [src/data/stays.ts](src/data/stays.ts). Pages, the comparison table, structured data, the sitemap and `/llms.txt` are all generated from it.

To add a home:

1. Put its photos in `public/stays/<folder>/`.
2. Add an entry to the `stays` array, and only include facts confirmed on the live Airbnb listing.
3. Update `factsCheckedOn`, and the "Which SSHOME home is best" answer in `siteFaqs`, which names the homes.

Ratings and review counts are copied by hand, so re-check them periodically.

## Deploy

The production site is `https://www.sshomedesigns.com`, the default for canonical URLs, the sitemap and structured data. `NEXT_PUBLIC_SITE_URL` overrides it, so leave that variable unset in production.

## Machine-readable surfaces

- `/llms.txt`: plain-text summary for AI agents
- `/sitemap.xml` and `/robots.txt`
- JSON-LD on every page: `VacationRental`, `FAQPage`, `BreadcrumbList`, `Organization`, `Article`

## Airbnb links and measurement

- `/go/desert` and `/go/family` are temporary redirects to the corresponding clean Airbnb URLs. Use them for QR codes or social posts; home pages remain available for comparison. Next.js forwards incoming query parameters, so do not add fixed travel dates to evergreen campaign links.
- Optional GA4: set `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX` in the hosting environment and rebuild. Without a valid ID, the site loads no analytics script and sends no analytics events.
- Once configured, GA4 receives `airbnb_click` for Airbnb links and valid date-form submissions, with `listing_id`, `placement`, and `page_path`. These include review/contact links as well as booking links: they measure outbound interest, not confirmed bookings. Travel dates and guest counts are not included in the custom event.
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
