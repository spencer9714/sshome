import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="text-lg font-semibold text-stone-900">
              SSHome<span className="font-light text-stone-400"> Staging</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-stone-500">
              Designing high-performing short-term rentals across California.
              Photo-ready, durable, guest-focused.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5">
              {[
                { href: '/portfolio', label: 'Portfolio' },
                { href: '/services', label: 'Services' },
                { href: '/about', label: 'About' },
                { href: '/quote', label: 'Get a Quote' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-600 transition-colors hover:text-stone-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Service Areas
            </h3>
            <ul className="mt-4 space-y-2.5">
              {[
                'Bay Area',
                'Central Valley',
                'Southern California',
                'Desert & Mountain',
                'Coastal Communities',
              ].map((area) => (
                <li key={area} className="text-sm text-stone-600">
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Connect
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="mailto:hello@sshomestaging.com"
                  className="text-sm text-stone-600 transition-colors hover:text-stone-900"
                >
                  hello@sshomestaging.com
                </a>
              </li>
              <li>
                <a
                  href="https://calendly.com/sshomestaging"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-stone-600 transition-colors hover:text-stone-900"
                >
                  Book a Call
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/sshomestaging"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-stone-600 transition-colors hover:text-stone-900"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-stone-100 pt-8">
          <p className="text-center text-xs text-stone-400">
            &copy; {new Date().getFullYear()} SSHome Staging. All rights reserved. California, USA.
          </p>
        </div>
      </div>
    </footer>
  )
}
