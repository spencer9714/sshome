'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { alternatePath } from '@/lib/locales';

export function LanguageSwitch({ language }: { language: 'en' | 'zh-Hant' }) {
  const path = usePathname();
  return <Link href={alternatePath(path, language)} hrefLang={language === 'en' ? 'zh-Hant' : 'en'} lang={language === 'en' ? 'zh-Hant' : 'en'} className="shrink-0 rounded-md border border-line px-2 py-1.5 text-xs hover:text-ember">{language === 'en' ? '中文' : 'English'}</Link>;
}
