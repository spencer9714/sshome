import type { MetadataRoute } from 'next';
import { stays } from '@/data/stays';
import { pageUpdates } from '@/data/page-updates';
import { stayPath } from '@/lib/schema';
import { absoluteUrl } from '@/lib/site';
import { languageAlternates, zhStayPath } from '@/lib/locales';

export default function sitemap(): MetadataRoute.Sitemap {
  const pairs = [
    ['/', '/zh-tw'],
    ...stays.map((stay) => [stayPath(stay), zhStayPath(stay.slug)]),
    ['/sequoia-kings-canyon-guide', '/zh-tw/sequoia-guide'],
  ];
  return [
    ...pairs.flatMap(([en, zh]) => [en, zh].map((path) => ({
      url: absoluteUrl(path), lastModified: pageUpdates[path],
      alternates: { languages: Object.fromEntries(Object.entries(languageAlternates(en, zh)).map(([locale, path]) => [locale, absoluteUrl(path)])) },
    }))),
    { url: absoluteUrl('/sequoia-group-lodging'), lastModified: pageUpdates['/sequoia-group-lodging'] },
    { url: absoluteUrl('/sequoia-winter-guide'), lastModified: pageUpdates['/sequoia-winter-guide'] },
    { url: absoluteUrl('/about'), lastModified: pageUpdates['/about'] },
  ];
}
