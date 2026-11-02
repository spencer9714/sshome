import type { MetadataRoute } from 'next';
import { factsCheckedOn, stays } from '@/data/stays';
import { stayPath } from '@/lib/schema';
import { absoluteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', ...stays.map(stayPath), '/sequoia-kings-canyon-guide', '/zh-tw/sequoia-guide', '/about'];
  return paths.map((path) => ({ url: absoluteUrl(path), lastModified: factsCheckedOn }));
}
