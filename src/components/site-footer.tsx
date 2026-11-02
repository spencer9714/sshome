import Link from 'next/link';
import { factsCheckedOn, stays } from '@/data/stays';
import { stayPath } from '@/lib/schema';

export function SiteFooter() {
  return (
    <footer className="bg-dusk text-bone">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-2xl tracking-[0.12em]">SSHOME</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-bone/75">
            Vacation homes in Visalia, California, near Sequoia and Kings Canyon National Parks.
          </p>
        </div>
        <nav aria-label="Homes" className="text-sm">
          <p className="font-medium">Homes</p>
          <ul className="mt-3 space-y-2 text-bone/75">
            {stays.map((stay) => (
              <li key={stay.slug}>
                <Link href={stayPath(stay)} className="hover:text-glow">
                  {stay.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Plan your trip" className="text-sm">
          <p className="font-medium">Plan your trip</p>
          <ul className="mt-3 space-y-2 text-bone/75">
            <li>
              <Link href="/sequoia-kings-canyon-guide" className="hover:text-glow">
                Sequoia and Kings Canyon guide
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-glow">
                FAQ
              </Link>
            </li>
            <li>
              <a href="/llms.txt" className="hover:text-glow">
                Summary for AI agents
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-bone/15">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs leading-relaxed text-bone/65 sm:px-6 lg:px-8">
          Bookings are made on Airbnb. SSHOME is not affiliated with Airbnb or the National Park Service. Listing
          details checked {factsCheckedOn}; Airbnb has the current information.
        </p>
      </div>
    </footer>
  );
}
