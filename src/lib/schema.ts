import { airbnbUrl, type Faq, type Stay } from '@/data/stays';
import { absoluteUrl, site, siteUrl } from '@/lib/site';

const organizationId = `${siteUrl}/#organization`;

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: site.name,
      url: siteUrl,
      description: site.description,
      areaServed: ['Visalia, California', 'Sequoia National Park', 'Kings Canyon National Park'],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name: site.name,
      url: siteUrl,
      publisher: { '@id': organizationId },
    },
  ],
});

export const stayPath = (stay: Stay) => `/stays/${stay.slug}`;

export const staySchema = (stay: Stay) => ({
  '@context': 'https://schema.org',
  '@type': 'VacationRental',
  '@id': `${absoluteUrl(stayPath(stay))}#rental`,
  additionalType: 'House',
  identifier: stay.airbnbId,
  name: `${stay.name} by ${site.name}`,
  alternateName: stay.airbnbTitle,
  description: stay.metaDescription,
  url: absoluteUrl(stayPath(stay)),
  sameAs: airbnbUrl(stay),
  brand: { '@id': organizationId },
  image: stay.photos.map((photo) => absoluteUrl(photo.src)),
  latitude: stay.geo.latitude,
  longitude: stay.geo.longitude,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Visalia',
    addressRegion: 'CA',
    addressCountry: 'US',
  },
  containsPlace: {
    '@type': 'Accommodation',
    additionalType: 'EntirePlace',
    occupancy: { '@type': 'QuantitativeValue', maxValue: stay.guests },
    numberOfBedrooms: stay.bedrooms,
    numberOfBathroomsTotal: stay.baths,
    bed: { '@type': 'BedDetails', numberOfBeds: stay.beds },
    amenityFeature: stay.amenities
      .flatMap((group) => group.items)
      .map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
  },
  ...(stay.rating && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: stay.rating.value,
      reviewCount: stay.rating.count,
      bestRating: 5,
    },
  }),
  potentialAction: {
    '@type': 'ReserveAction',
    name: 'Check availability on Airbnb',
    target: airbnbUrl(stay),
  },
});

export const faqSchema = (faqs: Faq[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
});

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});
