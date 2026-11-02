export const zhHomePath = '/zh-tw';
export const zhStayPath = (slug: string) => `/zh-tw/stays/${slug}`;
export const languageAlternates = (en: string, zh: string) => ({ en, 'zh-Hant': zh, 'x-default': en });

export function alternatePath(path: string, language: 'en' | 'zh-Hant') {
  if (language === 'en') {
    if (path === '/sequoia-kings-canyon-guide') return '/zh-tw/sequoia-guide';
    if (path.startsWith('/stays/')) return `/zh-tw${path}`;
    return zhHomePath;
  }
  if (path === '/zh-tw/sequoia-guide') return '/sequoia-kings-canyon-guide';
  if (path.startsWith('/zh-tw/stays/')) return path.replace('/zh-tw', '');
  return '/';
}
