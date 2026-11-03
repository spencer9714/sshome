import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaqList } from '@/components/faq-list';
import { JsonLd } from '@/components/json-ld';
import { airbnbUrl, factsCheckedOn, stays, type Faq } from '@/data/stays';
import { breadcrumbSchema, faqSchema, stayPath } from '@/lib/schema';
import { languageAlternates } from '@/lib/locales';
import { absoluteUrl } from '@/lib/site';
import { pageUpdates } from '@/data/page-updates';

const path = '/sequoia-group-lodging';
const title = 'Group Lodging near Sequoia: Visalia Homes for 10 to 14 Guests';
const description =
  'Compare two private Visalia homes for groups of 10 to 14 visiting Sequoia National Park. Review sleeping arrangements and check dates on Airbnb.';
const image = '/stays/desert-retreat/dining.jpg';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path, languages: languageAlternates(path, '/zh-tw/sequoia-group-lodging') },
  openGraph: { title, description, url: path, type: 'article', images: [{ url: image }] },
};

const [desert, family] = stays;

const sleepingPlans = [
  {
    guests: 8,
    desert: '1 king bed and 3 queen beds across 4 bedrooms',
    family: 'All 4 bedrooms: king, 2 queens and 2 singles',
  },
  {
    guests: 10,
    desert: 'All 5 bedrooms: king, 3 queens and 2 twins',
    family: 'All 4 bedrooms, plus the loft sofa bed',
  },
  {
    guests: 12,
    desert: 'All 5 bedrooms, plus the queen air mattress',
    family: 'All 4 bedrooms, the sofa bed and air mattresses',
  },
  {
    guests: 14,
    desert: 'All 5 bedrooms, plus the queen and 2 twin air mattresses',
    family: 'All 4 bedrooms, the sofa bed, the couch and 3 air mattresses',
  },
];

const tips = [
  {
    title: 'Parking',
    body: 'Desert Retreat offers 3 driveway spaces and Luxury Family Home offers 2, with additional street parking nearby. Luxury Family Home also has 1 garage parking space; part of its garage is a game room. Confirm arrangements for extra vehicles with the host and avoid blocking neighbors’ driveways.',
  },
  {
    title: 'Bedrooms and stairs',
    body: 'Both homes have stairs, but each has a first-floor bedroom: Bedroom 2 at Desert Retreat and Bedroom 3 at Luxury Family Home. Family Home also has a first-floor bathroom. Ask the host about the layout if stairs are a concern.',
  },
  {
    title: 'Meals',
    body: 'Pick up groceries before the 4:00 PM check-in, then let dinner be the easy part of the day. Both homes have full kitchens, so there is no need to find a restaurant table for the whole group.',
  },
  {
    title: 'Laundry',
    body: 'Each home has its own second-floor laundry room with a washer and dryer, which helps on longer stays or after dusty trail days.',
  },
];

const faqs: Faq[] = [
  {
    question: 'Can more than 14 people stay at one home?',
    answer: 'No. Each listing allows up to 14 overnight guests.',
  },
  {
    question: 'Can a larger group book both homes?',
    answer: 'You can book each home separately on Airbnb if both are available. They are separate homes at different locations in Visalia, not next door to each other, so plan on driving between them.',
  },
  {
    question: 'Can we host a family reunion party or event?',
    answer: 'Parties and events are not allowed at either home. A family staying together is welcome, but message the host on Airbnb before inviting anyone who is not staying overnight.',
  },
  {
    question: 'Will all 14 guests have a bedroom bed?',
    answer: 'No. Both homes use extra sleeping spaces to accommodate 14 guests, including air mattresses. Check the room-by-room arrangements with your group before booking.',
  },
];

export default function GroupLodgingPage() {
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
          { name: 'Group lodging', path },
        ])}
      />

      <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-sm font-medium text-ember">Group stays</p>
        <h1 className="mt-3 text-4xl leading-tight sm:text-6xl">Group lodging near Sequoia National Park</h1>
        <p className="mt-6 text-xl leading-relaxed">
          Two families, a few generations, or the friends you never get enough time with? Choose a Visalia home where
          everyone can share meals and spend time together. Each sleeps up to 14 with extra sleeping arrangements;
          the guide below helps you work out who sleeps where.
        </p>

        <div className="relative mt-10 aspect-[3/2] overflow-hidden rounded-lg">
          <Image
            src={image}
            alt="Long dining table with seating for a group at Desert Retreat in Visalia"
            fill
            priority
            sizes="(min-width: 896px) 848px, 100vw"
            className="object-cover"
          />
        </div>

        <section className="mt-14">
          <h2 className="text-3xl">Which home suits your group?</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { stay: desert, reason: 'Five bedrooms, a private unheated pool, and a fire pit for catching up after dinner.' },
              { stay: family, reason: 'Four bedrooms, a pool table, and an upstairs loft for games or a quiet break.' },
            ].map(({ stay, reason }) => (
              <div key={stay.slug} className="rounded-lg border border-line bg-white p-6">
                <h3 className="text-2xl">
                  <Link href={stayPath(stay)} className="hover:text-ember">
                    {stay.name}
                  </Link>
                </h3>
                <p className="mt-2 text-sm font-medium">
                  {stay.bedrooms} bedrooms · {stay.baths} baths
                </p>
                <p className="mt-3 leading-relaxed text-stone">{reason}</p>
                <a href={airbnbUrl(stay)} data-airbnb-intent="booking" data-booking-placement="group-page" className="mt-4 inline-block py-1 text-sm font-medium underline hover:text-ember">
                  Check dates on Airbnb
                </a>
              </div>
            ))}
          </div>
        </section>

        <section id="sleeping-plans" className="mt-14">
          <h2 className="text-3xl">Sleeping arrangements by group size</h2>
          <p className="mt-4 leading-relaxed text-stone">
            These are examples, assuming two people share each king, queen, sofa bed and queen air mattress, and one
            person uses each twin or single bed.
          </p>

          <div className="mt-6 space-y-4 md:hidden">
            {sleepingPlans.map((plan) => (
              <div key={plan.guests} className="rounded-lg border border-line bg-white p-5">
                <h3 className="text-2xl">{plan.guests} guests</h3>
                <dl className="mt-3 space-y-3 text-sm">
                  <div>
                    <dt className="font-medium">{desert.name}</dt>
                    <dd className="mt-1 leading-relaxed text-stone">{plan.desert}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">{family.name}</dt>
                    <dd className="mt-1 leading-relaxed text-stone">{plan.family}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          <div className="mt-6 hidden overflow-hidden rounded-lg border border-line bg-white md:block">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">Example sleeping plans by group size at each home</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="p-4 font-medium">Guests</th>
                  <th scope="col" className="p-4 font-medium">{desert.name}</th>
                  <th scope="col" className="p-4 font-medium">{family.name}</th>
                </tr>
              </thead>
              <tbody>
                {sleepingPlans.map((plan) => (
                  <tr key={plan.guests} className="border-b border-line last:border-0">
                    <th scope="row" className="p-4 align-top font-display text-xl font-normal">{plan.guests}</th>
                    <td className="p-4 align-top leading-relaxed text-stone">{plan.desert}</td>
                    <td className="p-4 align-top leading-relaxed text-stone">{plan.family}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-stone">
            Air mattress sizes at {family.name} are not listed, so confirm its setup with the host for 12 or more
            guests. Room-by-room details are on each home’s page.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">More people. A little more planning.</h2>
          <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {tips.map((tip) => (
              <div key={tip.title}>
                <h3 className="font-sans text-base font-semibold tracking-normal">{tip.title}</h3>
                <p className="mt-1.5 leading-relaxed text-stone">{tip.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 leading-relaxed text-stone">
            Bringing a van, RV or trailer, or planning your park days?{' '}
            <Link href="/sequoia-kings-canyon-guide" className="text-ink underline hover:text-ember">
              See vehicle limits, drive times and trip ideas in our park guide.
            </Link>{' '}
            Traveling for work?{' '}
            <Link href="/visalia-crew-housing" className="text-ink underline hover:text-ember">
              See housing for contractors and work crews.
            </Link>
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">Questions about group stays</h2>
          <div className="mt-6">
            <FaqList faqs={faqs} />
          </div>
        </section>

        <p className="mt-10 text-xs text-stone">Listing details checked {factsCheckedOn}. Airbnb has the current rules, availability and pricing.</p>
      </article>
    </>
  );
}
