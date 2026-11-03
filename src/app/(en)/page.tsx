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
import { parkFacts, site } from '@/lib/site';

export const metadata: Metadata = { alternates: { canonical: '/', languages: languageAlternates('/', '/zh-tw') } };

export default function HomePage() {
  const hero = stays[0].photos[0];
  const homeFaqs = siteFaqs.filter((faq) => !['Which SSHOME home has a swimming pool?', 'How should two families or 10 to 14 guests choose a home?', 'How far is Visalia from Sequoia and Kings Canyon National Parks?'].includes(faq.question));
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
            Visalia vacation homes for up to {maxGuests} guests
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90">
            Your base for Sequoia &amp; Kings Canyon, with full kitchens and a choice of poolside days or game-room nights.
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
        <h2 className="max-w-2xl text-3xl sm:text-5xl">Find your home base</h2>
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
            From Airbnb reviews, shown word for word. Names are shortened for privacy. Details checked {factsCheckedOn}.
          </p>
        </section>
      )}

      <section id="compare" className="bg-sand">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl">Compare the homes</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone">
            Choose Desert Retreat for a private, unheated pool and five bedrooms. Choose Luxury Family Home for a pool table, loft and four bedrooms. Both have a hot tub; only Desert Retreat has a swimming pool.
          </p>
          <p className="mt-4 text-sm text-stone">Guest capacity includes additional sleeping arrangements. Check each room layout before booking.</p>
          <div className="mt-10">
            <CompareTable />
          </div>
        </div>
      </section>

      <section className="bg-dusk text-bone">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <h2 className="text-3xl sm:text-5xl">Your base for two national parks</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-bone/80">
              Visalia sits in the valley below the Sierra Nevada, with Highway 198 running up through Three Rivers to
              Sequoia&apos;s Ash Mountain Entrance.
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

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><p className="text-sm font-medium text-ember">Plan before you book</p><h2 className="mt-3 text-3xl">A better trip starts with the right base</h2><div className="mt-6 flex flex-wrap gap-5"><Link href="/sequoia-group-lodging" className="underline">Group lodging for 10 to 14 guests</Link><Link href="/sequoia-winter-guide" className="underline">Visiting Sequoia in winter</Link><Link href="/visalia-crew-housing" className="underline">Housing for work crews</Link><Link href="/sequoia-kings-canyon-guide#where-to-stay" className="underline">Visalia or Three Rivers?</Link><Link href="/sequoia-kings-canyon-guide#itineraries" className="underline">One- and two-night trip ideas</Link><Link href="/zh-tw/sequoia-guide" lang="zh-Hant" className="underline">繁體中文旅遊指南</Link><Link href="/about" className="underline">About SSHOME &amp; contact</Link></div></section>

      <section id="faq" className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <h2 className="text-3xl sm:text-5xl">Questions about staying with {site.name}</h2>
        <div className="mt-10">
          <FaqList faqs={homeFaqs} />
        </div>
      </section>
    </>
  );
}
