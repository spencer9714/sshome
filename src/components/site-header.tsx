import Link from 'next/link';

const links = [
  { href: '/#homes', label: 'Homes', short: 'Homes', phone: 'block' },
  { href: '/#compare', label: 'Compare', short: 'Compare', phone: 'hidden min-[360px]:block' },
  { href: '/sequoia-kings-canyon-guide', label: 'Park guide', short: 'Guide', phone: 'block' },
  { href: '/about', label: 'About & contact', short: 'About', phone: 'block' },
];

export function SiteHeader() {
  return (
    <header lang="en" className="sticky top-0 z-40 border-b border-line bg-bone/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-xl tracking-[0.12em]">
          SSHOME
        </Link>
        <nav aria-label="Main" className="flex items-center gap-3 text-sm sm:gap-7">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`py-2 transition-colors hover:text-ember sm:block ${link.phone}`}
            >
              <span className="sm:hidden">{link.short}</span>
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
