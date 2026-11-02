import Link from 'next/link';
import { LanguageSwitch } from '@/components/language-switch';

const links = [
  { href: '/#homes', label: 'Homes', short: 'Homes', phone: 'block' },
  { href: '/#compare', label: 'Compare', short: 'Compare', phone: 'hidden min-[360px]:block' },
  { href: '/sequoia-kings-canyon-guide', label: 'Park guide', short: 'Guide', phone: 'block' },
  { href: '/about', label: 'About & contact', short: 'About', phone: 'block' },
];

export function SiteHeader({ language = 'en' }: { language?: 'en' | 'zh-Hant' }) {
  const zh = language === 'zh-Hant';
  const navigation = zh ? [
    { href: '/zh-tw#homes', label: '房源', short: '房源', phone: 'block' },
    { href: '/zh-tw/sequoia-guide', label: '自駕指南', short: '指南', phone: 'block' },
    { href: '/zh-tw#about', label: '關於我們', short: '關於', phone: 'hidden min-[400px]:block' },
  ] : links;
  return (
    <header lang={language} className="sticky top-0 z-40 border-b border-line bg-bone/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={zh ? '/zh-tw' : '/'} className="font-display text-xl tracking-[0.12em]">
          SSHOME
        </Link>
        <nav aria-label={zh ? '主要導覽' : 'Main'} className="flex items-center gap-2 text-sm sm:gap-7">
          {navigation.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`py-2 transition-colors hover:text-ember sm:block ${link.phone}`}
            >
              <span className="sm:hidden">{link.short}</span>
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          ))}
          <LanguageSwitch language={language} />
        </nav>
      </div>
    </header>
  );
}
