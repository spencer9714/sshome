import { airbnbUrl, stays, type Faq, type Stay } from '@/data/stays';
import { absoluteUrl, site, siteUrl } from '@/lib/site';
import { zhStayPath } from '@/lib/locales';
import { pageUpdates } from '@/data/page-updates';

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

export const collectionSchema = (language: 'en' | 'zh-Hant') => {
  const zh = language === 'zh-Hant';
  const path = zh ? '/zh-tw' : '/';
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl(path)}#page`,
    url: absoluteUrl(path),
    name: zh ? 'SSHOME Visalia 度假住宿' : 'SSHOME Visalia vacation homes',
    inLanguage: language,
    dateModified: pageUpdates[path],
    isPartOf: { '@id': `${siteUrl}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: stays.length,
      itemListElement: stays.map((stay, index) => ({
        '@type': 'ListItem', position: index + 1,
        name: stay.name,
        url: absoluteUrl(zh ? zhStayPath(stay.slug) : stayPath(stay)),
      })),
    },
  };
};

export const rentalPageSchema = (stay: Stay, language: 'en' | 'zh-Hant', title: string) => {
  const path = language === 'en' ? stayPath(stay) : zhStayPath(stay.slug);
  return {
    '@context': 'https://schema.org', '@type': 'WebPage',
    '@id': `${absoluteUrl(path)}#page`, url: absoluteUrl(path), name: title,
    inLanguage: language,
    dateModified: pageUpdates[path],
    isPartOf: { '@id': `${siteUrl}/#website` },
    mainEntity: { '@id': `${absoluteUrl(path)}#rental` },
  };
};

export const staySchema = (stay: Stay) => ({
  '@context': 'https://schema.org',
  '@type': 'VacationRental',
  '@id': `${absoluteUrl(stayPath(stay))}#rental`,
  additionalType: 'House',
  checkinTime: stay.rules.checkInTime,
  checkoutTime: stay.rules.checkOutTime,
  petsAllowed: true,
  smokingAllowed: false,
  identifier: stay.airbnbId,
  name: `${stay.name} by ${site.name}`,
  alternateName: stay.airbnbTitle,
  description: stay.metaDescription,
  url: absoluteUrl(stayPath(stay)),
  sameAs: airbnbUrl(stay),
  brand: { '@id': organizationId },
  image: stay.photos.map((photo) => absoluteUrl(photo.src)),
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Visalia',
    addressRegion: 'CA',
    addressCountry: 'US',
  },
  containsPlace: {
    '@type': 'Accommodation',
    additionalType: 'EntirePlace',
    occupancy: { '@type': 'QuantitativeValue', value: stay.guests },
    numberOfBedrooms: stay.bedrooms,
    numberOfBathroomsTotal: stay.baths,
    bed: { '@type': 'BedDetails', numberOfBeds: stay.beds },
    amenityFeature: stay.amenities
      .flatMap((group) => group.items)
      .map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
  },
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
