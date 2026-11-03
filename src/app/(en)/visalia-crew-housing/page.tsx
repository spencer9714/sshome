import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaqList } from '@/components/faq-list';
import { JsonLd } from '@/components/json-ld';
import { pageUpdates } from '@/data/page-updates';
import { airbnbUrl, factsCheckedOn, stays, type Faq } from '@/data/stays';
import { languageAlternates } from '@/lib/locales';
import { breadcrumbSchema, faqSchema, stayPath } from '@/lib/schema';
import { absoluteUrl } from '@/lib/site';

const path = '/visalia-crew-housing';
const title = 'Visalia Crew Housing for Contractors & Work Teams | SSHOME';
const description =
  'Visalia homes for contractors and crews: a bed each for 5 or 6, full kitchen, laundry and off-street parking for 3 to 6 vehicles. Up to 29 days on Airbnb.';
const image = '/stays/desert-retreat/kitchen-1.jpg';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path, languages: languageAlternates(path, '/zh-tw/visalia-crew-housing') },
  openGraph: { title, description, url: path, type: 'article', images: [{ url: image }] },
};

const [desert, family] = stays;

const homes = [
  {
    stay: desert,
    rooms: '4 private bedrooms, plus a room with 2 twin beds',
    work: 'Has a desk, chair, monitor and lamp in Bedroom 2 for paperwork and calls.',
  },
  {
    stay: family,
    rooms: '3 private bedrooms, plus a room with 2 single beds',
    work: 'Has Wi-Fi but no dedicated workspace.',
  },
];

const tips = [
  {
    title: 'Trucks and parking',
    body: 'Each home above lists its garage, driveway and street spaces. Please avoid blocking neighbors’ driveways and follow posted signs.',
  },
  {
    title: 'Work boots and tools',
    body: 'Keep boots and tools clean, and store them in the garage, not inside the home. Message the host before you arrive to arrange garage use.',
  },
  {
    title: 'Early starts',
    body: `Quiet hours run from 9:00 PM to 8:00 AM, so please keep voices and engines down when leaving for an early shift.`,
  },
  {
    title: 'Arrival and checkout',
    body: `Check-in is at ${desert.rules.checkIn} and checkout is at ${desert.rules.checkOut}. If your crew needs different times, ask the host, since early check-in and late checkout may be available for a fee.`,
  },
];

const faqs: Faq[] = [
  {
    question: 'What is the longest stay a crew can book?',
    answer: 'The longest stay is 29 days. Airbnb shows the minimum stay, any discounts and the total price for your dates.',
  },
  {
    question: 'Can my company book directly and pay by invoice?',
    answer: 'No. All bookings and payments are made on Airbnb, and your trip receipt is available there.',
  },
  {
    question: 'Can someone book for a crew without staying at the home?',
    answer: 'Message the host on Airbnb before booking with your crew size and dates, and mention who will be staying, so you can confirm the arrangement first.',
  },
  {
    question: 'What if our crew has more than 6 people?',
    answer: `Each home allows up to 14 overnight guests, but anyone beyond ${desert.beds} people at ${desert.name} or ${family.beds} at ${family.name} would use a sofa bed, couch or air mattress. Booking both homes gives ${desert.beds + family.beds} bedroom beds if both are available. They are at different locations in Visalia, not next door to each other.`,
  },
  {
    question: 'Can we bring a trailer or a large work vehicle?',
    answer: 'Desert Retreat offers 3 driveway spaces and Luxury Family Home offers 2, with additional street parking nearby. Street spaces are not reserved. If you are bringing extra vehicles, a trailer or an oversized vehicle, message the host before booking.',
  },
  {
    question: 'How close are the homes to our job site?',
    answer: 'Airbnb shows each home’s approximate area before booking and shares the exact address afterward. Message the host with your job site’s location if the distance matters.',
  },
];

export default function CrewHousingPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description,
          url: absoluteUrl(path),
          image: absoluteUrl(image),
          dateModified: pageUpdates[path],
          author: { '@type': 'Organization', name: 'SSHOME' },
          publisher: { '@type': 'Organization', name: 'SSHOME' },
        }}
      />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Crew housing', path },
        ])}
      />

      <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-sm font-medium text-ember">Work stays</p>
        <h1 className="mt-3 text-4xl leading-tight sm:text-6xl">Housing for contractors and work crews in Visalia</h1>
        <p className="mt-6 text-xl leading-relaxed">
          Have a crew working in Visalia, Tulare or elsewhere in the Central Valley? SSHOME has two entire homes with a
          bed for each of 5 or 6 people, a full kitchen, a washer and dryer, Wi-Fi and off-street parking for 3 to 6 vehicles.
          Stay up to 29 days and book on Airbnb.
        </p>

        <div className="relative mt-10 aspect-[3/2] overflow-hidden rounded-lg">
          <Image
            src={image}
            alt="Kitchen with a gas range, large refrigerator and breakfast bar at Desert Retreat in Visalia"
            fill
            priority
            sizes="(min-width: 896px) 848px, 100vw"
            className="object-cover"
          />
        </div>

        <section className="mt-14">
          <h2 className="text-3xl">Which home suits your crew?</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {homes.map(({ stay, rooms, work }) => (
              <div key={stay.slug} className="rounded-lg border border-line bg-white p-6">
                <h3 className="text-2xl">
                  <Link href={stayPath(stay)} className="hover:text-ember">
                    {stay.name}
                  </Link>
                </h3>
                <p className="mt-2 text-sm font-medium">
                  {stay.beds} people, one bed each · {stay.baths} baths
                </p>
                <p className="mt-3 leading-relaxed text-stone">{rooms}. {work}</p>
                <p className="mt-3 text-sm leading-relaxed"><span className="font-medium">Parking:</span> {stay.compare.parking}</p>
                <a href={airbnbUrl(stay)} data-airbnb-intent="booking" data-booking-placement="crew-page" className="mt-4 inline-block py-1 text-sm font-medium underline hover:text-ember">
                  Check dates on Airbnb
                </a>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">Before your crew arrives</h2>
          <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {tips.map((tip) => (
              <div key={tip.title}>
                <h3 className="font-sans text-base font-semibold tracking-normal">{tip.title}</h3>
                <p className="mt-1.5 leading-relaxed text-stone">{tip.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">Crew stay questions</h2>
          <div className="mt-6">
            <FaqList faqs={faqs} />
          </div>
        </section>

        <p className="mt-10 text-xs text-stone">Listing details checked {factsCheckedOn}. Airbnb has the current rules, availability and pricing.</p>
      </article>
    </>
  );
}
