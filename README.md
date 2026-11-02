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
