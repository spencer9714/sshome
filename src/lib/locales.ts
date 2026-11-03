export const zhHomePath = '/zh-tw';
export const zhStayPath = (slug: string) => `/zh-tw/stays/${slug}`;
export const languageAlternates = (en: string, zh: string) => ({ en, 'zh-Hant': zh, 'x-default': en });

// English pages that keep the same path under /zh-tw.
const translatedPaths = ['/sequoia-group-lodging', '/sequoia-winter-guide', '/visalia-crew-housing', '/about', '/privacy'];

export function alternatePath(path: string, language: 'en' | 'zh-Hant') {
  if (language === 'en') {
    if (path === '/sequoia-kings-canyon-guide') return '/zh-tw/sequoia-guide';
    if (translatedPaths.includes(path)) return `/zh-tw${path}`;
    if (path.startsWith('/stays/')) return `/zh-tw${path}`;
    return zhHomePath;
  }
  if (path === '/zh-tw/sequoia-guide') return '/sequoia-kings-canyon-guide';
  if (path.startsWith('/zh-tw/stays/') || translatedPaths.includes(path.replace('/zh-tw', ''))) return path.replace('/zh-tw', '');
  return '/';
}
