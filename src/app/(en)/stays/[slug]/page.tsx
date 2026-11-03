import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PhotoTour } from '@/components/photo-tour';
import { BookingForm } from '@/components/booking-form';
import { MobileStayBooking, StayOverview } from '@/components/stay-overview';
import { NeighborhoodMap } from '@/components/neighborhood-map';
import { ParkTravel } from '@/components/park-travel';
import { FaqList } from '@/components/faq-list';
import { JsonLd } from '@/components/json-ld';
import { ReviewCard } from '@/components/review-card';
import { airbnbUrl, factsCheckedOn, getHeroPhoto, getStay, stays } from '@/data/stays';
import { breadcrumbSchema, faqSchema, rentalPageSchema, staySchema, stayPath } from '@/lib/schema';
import { languageAlternates, zhStayPath } from '@/lib/locales';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return stays.map((stay) => ({ slug: stay.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const stay = getStay(slug);
  if (!stay) return {};
  return {
    title: { absolute: stay.metaTitle },
    description: stay.metaDescription,
    alternates: { canonical: stayPath(stay), languages: languageAlternates(stayPath(stay), zhStayPath(stay.slug)) },
    openGraph: {
      title: stay.metaTitle,
      description: stay.metaDescription,
      url: stayPath(stay),
      images: [{ url: getHeroPhoto(stay).src, alt: getHeroPhoto(stay).alt }],
    },
  };
}

export default async function StayPage({ params }: Props) {
  const { slug } = await params;
  const stay = getStay(slug);
  if (!stay) notFound();

  const others = stays.filter((other) => other.slug !== stay.slug);
  const lead = getHeroPhoto(stay);
  const supporting = stay.photos.filter((photo) => photo.src !== lead.src);
  const wideHero = Boolean(stay.heroPhoto);

  return (
    <>
      <JsonLd data={staySchema(stay)} />
      <JsonLd data={rentalPageSchema(stay, 'en', stay.metaTitle)} />
      <JsonLd data={faqSchema(stay.faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: stay.name, path: stayPath(stay) },
        ])}
      />

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-20">
        <nav aria-label="Breadcrumb" className="text-sm text-stone">
          <Link href="/#homes" className="hover:text-ember">
            Homes
          </Link>{' '}
          / <span className="text-ink">{stay.name}</span>
        </nav>

        <h1 className="mt-4 text-4xl leading-tight sm:text-6xl">{stay.name}</h1>
        <p className="mt-2 text-lg text-stone">Entire home in Visalia, California</p>

        <div className={`mt-8 grid gap-2 overflow-hidden rounded-lg md:grid-rows-2 ${wideHero ? 'md:grid-cols-6' : 'md:grid-cols-4'}`}>
          <div className={`relative aspect-[3/2] md:row-span-2 md:aspect-auto md:min-h-[30rem] ${wideHero ? 'md:col-span-4' : 'md:col-span-2'}`}>
            <Image src={lead.src} alt={lead.alt} fill priority sizes={wideHero ? '(min-width: 1280px) 800px, (min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 50vw, 100vw'} className="object-cover object-[50%_55%]" />
          </div>
          {supporting.slice(0, 4).map((photo) => (
            <div key={photo.src} className="relative hidden md:block">
              <Image src={photo.src} alt={photo.alt} fill sizes="25vw" className="object-cover" />
            </div>
          ))}
        </div>

        <a href="#photo-tour" className="mt-4 inline-block rounded-md border border-ink px-4 py-2 text-sm font-medium hover:bg-sand">View all {stay.photos.length} photos by room</a>

        <StayOverview stay={stay} />
        <MobileStayBooking stay={stay} />

        <div className="mt-12 grid gap-14 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <dl className="flex flex-wrap gap-x-8 gap-y-3 border-b border-line pb-6">
              {[
                ['Guests', stay.guests],
                ['Bedrooms', stay.bedrooms],
                ['Bedroom beds', stay.beds],
                ['Baths', stay.baths],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col-reverse">
                  <dt className="text-sm text-stone">{label}</dt>
                  <dd className="font-display text-3xl">{value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 text-xl leading-relaxed">{stay.lead}</p>

            <section className="mt-14">
              <h2 className="text-3xl">A few things to look forward to</h2>
              <div className="mt-6 grid gap-x-8 gap-y-7 sm:grid-cols-2">
                {stay.highlights.map((highlight) => (
                  <div key={highlight.title}>
                    <h3 className="font-sans text-base font-semibold tracking-normal">{highlight.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-stone">{highlight.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {stay.rating?.categories && (
              <section className="mt-14 rounded-lg bg-sand p-6 sm:p-8">
                <h2 className="text-3xl">
                  {stay.rating.value} out of 5 from {stay.rating.count} Airbnb reviews
                </h2>
                <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
                  {stay.rating.categories.map((category) => (
                    <div key={category.label} className="flex items-baseline justify-between border-b border-line pb-2">
                      <dt className="text-sm text-stone">{category.label}</dt>
                      <dd className="font-medium">{category.score.toFixed(1)}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs text-stone">As shown on Airbnb, checked {factsCheckedOn}.</p>
              </section>
            )}

            {stay.reviews.length > 0 && (
              <section className="mt-14">
                <h2 className="text-3xl">What guests say</h2>
                <div className="mt-6 grid items-start gap-4 sm:grid-cols-2">
                  {stay.reviews.map((review) => (
                    <ReviewCard key={review.text} review={review} />
                  ))}
                </div>
                <p className="mt-4 text-xs text-stone">
                  Selected Airbnb reviews, shared in the guests’ own words. Names are abbreviated for privacy.{' '}
                  <a href={airbnbUrl(stay)} data-airbnb-intent="reviews" data-booking-placement="stay-reviews" className="underline hover:text-ember">
                    Read all reviews on Airbnb.
                  </a>
                </p>
              </section>
            )}

            <section className="mt-14">
              <h2 id="sleeping" className="scroll-mt-24 text-3xl">Where everyone sleeps</h2>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {stay.sleeping.map((room) => (
                  <li key={room.room} className="flex flex-col gap-1 py-3.5 sm:flex-row sm:justify-between sm:gap-6">
                    <span className="font-medium">{room.room}</span>
                    <span className="text-stone sm:text-right">{room.beds}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-stone">{stay.slug.startsWith('desert-') ? 'Need the extra sleeping space? We provide 1 queen and 2 twin air mattresses, bringing the total capacity to 14 guests.' : stay.extraSleeping}</p>
              <Link href="/sequoia-group-lodging#sleeping-plans" className="mt-3 inline-block py-1 text-sm underline hover:text-ember">Plan the sleeping arrangements for 8 to 14 guests</Link>
            </section>

            <section className="mt-14">
              <h2 id="amenities" className="scroll-mt-24 text-3xl">Amenities</h2>
              <div className="mt-6 grid gap-8 sm:grid-cols-2">
                {stay.amenities.map((group) => (
                  <div key={group.group}>
                    <h3 className="font-sans text-base font-semibold tracking-normal">{group.group}</h3>
                    <ul className="mt-2 space-y-1.5 text-stone">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <a href={airbnbUrl(stay)} data-airbnb-intent="amenities" data-booking-placement="stay-amenities" className="mt-6 inline-block text-sm underline hover:text-ember">
                See the full amenity list on Airbnb
              </a>
            </section>

            <section className="mt-14">
              <h2 id="location" className="scroll-mt-24 text-3xl">The neighborhood &amp; getting around</h2>
              <NeighborhoodMap slug={stay.slug} />
              <h3 className="mt-8 text-2xl">Getting to the parks</h3>
              <ParkTravel />
              <p className="mt-4 leading-relaxed text-stone">
                <Link href="/sequoia-kings-canyon-guide" className="text-ink underline hover:text-ember">
                  Plan your days with our park guide.
                </Link>
              </p>
            </section>

            <section className="mt-14">
              <h2 id="house-rules" className="scroll-mt-24 text-3xl">Check-in and house rules</h2>
              <dl className="mt-5 grid grid-cols-2 gap-4 border-b border-line pb-5">
                <div>
                  <dt className="text-sm text-stone">Check-in</dt>
                  <dd className="font-display text-2xl">{stay.rules.checkIn}</dd>
                </div>
                <div>
                  <dt className="text-sm text-stone">Checkout</dt>
                  <dd className="font-display text-2xl">{stay.rules.checkOut}</dd>
                </div>
              </dl>
              <ul className="mt-5 list-disc space-y-2 pl-5 leading-relaxed text-stone marker:text-ember">
                <li>{stay.rules.pets}</li>
                {stay.rules.items.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-stone">Check the cancellation policy for your dates on Airbnb before booking.</p>

              <h2 className="mt-14 text-3xl">A few things to know before you book</h2>
              <ul className="mt-5 list-disc space-y-2 pl-5 leading-relaxed text-stone marker:text-ember">
                {stay.goodToKnow.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="hidden lg:col-span-4 lg:block">
            <div id="book-desktop" className="sticky top-24 scroll-mt-24 rounded-lg border border-line bg-white p-6 shadow-sm">
              <p className="font-display text-2xl">Check your dates</p>
              {stay.rating && <p className="mb-5 mt-1 text-sm text-stone">★ {stay.rating.value} · {stay.rating.count} Airbnb reviews</p>}
              <BookingForm stay={stay} />
            </div>
          </aside>
        </div>

        <PhotoTour photos={stay.photos} />

        <section className="mt-16 max-w-4xl">
          <h2 className="text-3xl">Frequently asked questions</h2>
          <div className="mt-6">
            <FaqList faqs={stay.faqs} />
          </div>
        </section>

        {others.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl">Explore our other Visalia home</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {others.map((other) => (
                <Link key={other.slug} href={stayPath(other)} className="group block">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
                    <Image
                      src={getHeroPhoto(other).src}
                      alt={getHeroPhoto(other).alt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-3 font-display text-2xl group-hover:text-ember">{other.name}</p>
                  <p className="text-stone">{other.tagline}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-line bg-bone px-4 py-3 lg:hidden">
        <p className="min-w-0 truncate text-sm font-medium">{stay.name}</p>
        <a href="#book" className="shrink-0 rounded-md bg-ember px-4 py-2.5 text-sm font-medium text-white">
          Check dates on Airbnb
        </a>
      </div>
    </>
  );
}
