import Image from 'next/image';
import type { Metadata } from 'next';
import { languageAlternates } from '@/lib/locales';
import Link from 'next/link';
import { CompareTable } from '@/components/compare-table';
import { FaqList } from '@/components/faq-list';
import { JsonLd } from '@/components/json-ld';
import { ReviewCard } from '@/components/review-card';
import { airbnbUrl, factsCheckedOn, getHeroPhoto, maxGuests, siteFaqs, stays } from '@/data/stays';
import { collectionSchema, faqSchema, stayPath } from '@/lib/schema';
import { parkFacts } from '@/lib/site';

export const metadata: Metadata = { alternates: { canonical: '/', languages: languageAlternates('/', '/zh-tw') } };

export default function HomePage() {
  const hero = stays[0].photos[0];
  const homeFaqs = siteFaqs.filter((faq) => !['Which home has a swimming pool?', 'How should two families or 10 to 14 guests choose a home?', 'How far is Visalia from Sequoia and Kings Canyon National Parks?'].includes(faq.question));
  const featuredReviews = stays
    .flatMap((stay) => stay.reviews.map((review) => ({ review, stayName: stay.name })))
    .slice(0, 3);

  return (
    <>
      <JsonLd data={faqSchema(homeFaqs)} />
      <JsonLd data={collectionSchema('en')} />

      <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-dusk text-white">
        <Image src={hero.src} alt={hero.alt} fill priority sizes="(max-aspect-ratio: 3/2) 135vh, 100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/55 to-black/10 sm:from-black/75 sm:via-black/25" />
        <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-32 sm:px-6 sm:pb-16 lg:px-8">
          <p className="text-sm font-medium tracking-wide">Visalia, California</p>
          <h1 className="mt-3 max-w-4xl text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
            Big park days. A place to call your own.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90">
            Spend the day among the giant sequoias. Come back for dinner together, a game of pool, or a quiet evening outside. Two private Visalia homes, each welcoming up to {maxGuests} guests.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
            <Link
              href="#homes"
              className="rounded-md bg-ember px-6 py-3.5 font-medium transition-colors hover:bg-ember-dark"
            >
              Find your home
            </Link>
            <Link href="#compare" className="border-b border-white pb-1">
              Compare the two homes
            </Link>
          </div>
        </div>
      </section>

      <section id="homes" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <h2 className="max-w-2xl text-3xl sm:text-5xl">Pool days or game nights?</h2>
        <div className="mt-12 space-y-16 lg:mt-16 lg:space-y-24">
          {stays.map((stay, index) => (
            <article key={stay.slug} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
              <Link
                href={stayPath(stay)}
                className={`group relative block aspect-[3/2] overflow-hidden rounded-lg lg:col-span-7 ${index % 2 ? 'lg:order-2' : ''}`}
              >
                <Image
                  src={getHeroPhoto(stay).src}
                  alt={getHeroPhoto(stay).alt}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </Link>
              <div className="lg:col-span-5">
                <p className="text-sm font-medium text-ember">{stay.reviewNote}</p>
                <h3 className="mt-2 text-3xl sm:text-4xl">
                  <Link href={stayPath(stay)} className="hover:text-ember">
                    {stay.name}
                  </Link>
                </h3>
                <p className="mt-3 text-lg leading-relaxed">{stay.tagline}</p>
                <p className="mt-4 text-sm text-stone">
                  {stay.guests} guests · {stay.bedrooms} bedrooms · {stay.beds} bedroom beds · {stay.baths} baths
                </p>
                <Link
                  href={stayPath(stay)}
                  className="mt-6 inline-block border-b border-ink pb-0.5 font-medium transition-colors hover:border-ember hover:text-ember"
                >
                  View {stay.name}
                </Link>
                <a href={airbnbUrl(stay)} data-booking-placement="home-card" data-airbnb-intent="availability" className="mt-5 block w-fit rounded-md bg-ember px-5 py-3 font-medium text-white hover:bg-ember-dark">Check dates &amp; prices on Airbnb</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {featuredReviews.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <h2 className="text-3xl sm:text-5xl">What guests say</h2>
          <div className="mt-10 grid items-start gap-4 lg:grid-cols-3">
            {featuredReviews.map(({ review, stayName }) => (
              <ReviewCard key={review.text} review={review} stayName={stayName} />
            ))}
          </div>
          <p className="mt-4 text-xs text-stone">
            Reviews from Airbnb, shared in the guests’ own words. Names are abbreviated for privacy. Listing details checked {factsCheckedOn}.
          </p>
        </section>
      )}

      <section id="compare" className="bg-sand">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl">Compare the homes</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone">
            Five bedrooms and a private pool, or four bedrooms with a pool table and loft? Both homes have a hot tub and a full kitchen. The swimming pool is exclusive to Desert Retreat and is not heated.
          </p>
          <p className="mt-4 text-sm text-stone">The 14-guest capacity includes extra sleeping spaces. Review the bed arrangements before booking.</p>
          <div className="mt-10">
            <CompareTable />
          </div>
        </div>
      </section>

      <section className="bg-dusk text-bone">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <h2 className="text-3xl sm:text-5xl">Giant trees. Wide-open days.</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-bone/80">
              Stay in Visalia, down in the valley below the Sierra Nevada. Take Highway 198 to Sequoia&apos;s Ash Mountain
              Entrance or Highway 180 to Kings Canyon, then leave time for the mountain roads beyond.
            </p>
            <Link
              href="/sequoia-kings-canyon-guide"
              className="mt-7 inline-block border-b border-glow pb-0.5 font-medium text-glow"
            >
              Read the park guide
            </Link>
          </div>
          <div>
            <dl className="divide-y divide-bone/20 border-y border-bone/20">
              {parkFacts.drives.map((drive) => (
                <div key={drive.place} className="flex items-baseline justify-between gap-6 py-5">
                  <dt>
                    <span className="font-display text-xl">{drive.place}</span>
                    <span className="mt-1 block text-sm text-bone/70">{drive.entrance}</span>
                  </dt>
                  <dd className="shrink-0 text-glow">{drive.time}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-bone/65">
              Times from Visalia Municipal Airport to each park entrance, per the{' '}
              <a href={parkFacts.sourceUrl} className="underline">
                National Park Service
              </a>
              . Allow extra time for winding park roads.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="trip-planning-title" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-ember">Make the most of your stay</p>
          <h2 id="trip-planning-title" className="mt-3 text-3xl sm:text-4xl">A little planning goes a long way.</h2>
          <p className="mt-4 leading-relaxed text-stone">Work out the beds, pick a park day, and leave a little time to enjoy the house.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            { href: '/sequoia-group-lodging', title: 'Bringing the whole group?', description: 'See the sleeping arrangements for 8 to 14 guests.', action: 'Find room for everyone' },
            { href: '/sequoia-kings-canyon-guide#itineraries', title: 'A park day, at your pace', description: 'Ideas for one or two nights, with time for the house, too.', action: 'Explore trip ideas' },
            { href: '/sequoia-winter-guide', title: 'Heading up in winter?', description: 'What to know about snow, tire chains, and seasonal road access.', action: 'Read the winter guide' },
            { href: '/sequoia-kings-canyon-guide#where-to-stay', title: 'Why stay in Visalia?', description: 'Easy grocery runs, meals out, and a home to come back to.', action: 'Get to know the area' },
          ].map((guide) => (
            <Link key={guide.href} href={guide.href} className="group flex flex-col rounded-lg border border-line bg-white p-6 transition-colors hover:border-ember focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember sm:p-7">
              <h3 className="text-2xl group-hover:text-ember">{guide.title}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-stone">{guide.description}</p>
              <span className="mt-6 flex items-center justify-between gap-4 text-sm font-medium">
                {guide.action}<span aria-hidden="true" className="text-lg text-ember">→</span>
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <Link href="/visalia-crew-housing" className="w-fit py-1 text-sm underline underline-offset-4 hover:text-ember">Traveling for work? Explore crew stays</Link>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <Link href="/zh-tw/sequoia-guide" lang="zh-Hant" className="py-1 underline underline-offset-4 hover:text-ember">繁體中文指南</Link>
            <Link href="/about" className="py-1 underline underline-offset-4 hover:text-ember">Questions? Get in touch</Link>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <h2 className="text-3xl sm:text-5xl">Frequently asked questions</h2>
        <div className="mt-10">
          <FaqList faqs={homeFaqs} />
        </div>
      </section>
    </>
  );
}
