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
    ['/sequoia-group-lodging', '/zh-tw/sequoia-group-lodging'],
    ['/sequoia-winter-guide', '/zh-tw/sequoia-winter-guide'],
    ['/about', '/zh-tw/about'],
  ];
  return [
    ...pairs.flatMap(([en, zh]) => [en, zh].map((path) => ({
      url: absoluteUrl(path), lastModified: pageUpdates[path],
      alternates: { languages: Object.fromEntries(Object.entries(languageAlternates(en, zh)).map(([locale, path]) => [locale, absoluteUrl(path)])) },
    }))),
  ];
}
