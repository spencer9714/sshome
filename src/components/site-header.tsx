import Link from 'next/link';

const links = [
  { href: '/#homes', label: 'Homes' },
  { href: '/#compare', label: 'Compare' },
  { href: '/sequoia-kings-canyon-guide', label: 'Park guide' },
  { href: '/about', label: 'About & contact' },
];

export function SiteHeader() {
  return (
    <header lang="en" className="sticky top-0 z-40 border-b border-line bg-bone/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-xl tracking-[0.12em]">
          SSHOME
        </Link>
        <nav aria-label="Main" className="flex items-center gap-4 text-sm sm:gap-7">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-ember ${link.label === 'Homes' ? '' : 'hidden sm:block'}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/sequoia-kings-canyon-guide"
            className="transition-colors hover:text-ember sm:hidden"
          >
            Guide
          </Link>
        </nav>
      </div>
    </header>
  );
}
