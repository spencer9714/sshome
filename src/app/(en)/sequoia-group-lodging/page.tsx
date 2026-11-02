import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaqList } from '@/components/faq-list';
import { JsonLd } from '@/components/json-ld';
import { airbnbUrl, factsCheckedOn, stays, type Faq } from '@/data/stays';
import { breadcrumbSchema, faqSchema, stayPath } from '@/lib/schema';
import { absoluteUrl } from '@/lib/site';
import { pageUpdates } from '@/data/page-updates';

const path = '/sequoia-group-lodging';
const title = 'Group Lodging near Sequoia: Visalia Homes for 10 to 14 Guests';
const description =
  'Two entire Visalia homes for groups of 10 to 14 near Sequoia National Park. Compare the homes and see how each group size sleeps, then book on Airbnb.';
const image = '/stays/desert-retreat/dining.jpg';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: 'article', images: [{ url: image }] },
};

const [desert, family] = stays;

const sleepingPlans = [
  {
    guests: 8,
    desert: 'King and 3 queen bedrooms',
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
    title: 'Cars',
    body: 'Each home has free driveway parking for 2 cars, plus street parking. Please avoid blocking neighbors’ driveways.',
  },
  {
    title: 'Grandparents and stairs',
    body: 'Both homes have stairs. Give anyone who prefers one level the first-floor bedroom: Bedroom 2 at Desert Retreat or Bedroom 3 at Luxury Family Home, which also has a first-floor bathroom.',
  },
  {
    title: 'Meals',
    body: 'Check-in is at 4:00 PM, so one car can shop in Visalia on the way in. Cooking at the house is often the easiest way to feed a big group after a park day.',
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
    question: 'Can a larger group book both SSHOME homes?',
    answer: 'You can book each home separately on Airbnb if both are available. They are separate homes at different locations in Visalia, not next door to each other, so plan on driving between them.',
  },
  {
    question: 'Can we host a family reunion party or event?',
    answer: 'Parties and events are not allowed at either home. A family staying together is welcome, but message the host on Airbnb before inviting anyone who is not staying overnight.',
  },
  {
    question: 'Does every guest get a real bed at 14 people?',
    answer: 'No. Both homes reach 14 using additional sleeping spaces, as shown in the table above. Most groups of 14 should plan on some guests using air mattresses.',
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
          Traveling with two families or a group of 10 to 14? SSHOME has two entire homes in Visalia, so everyone can
          stay under one roof instead of splitting across hotel rooms. Choose a home, then use the table below to see
          how your group would sleep.
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
              { stay: desert, reason: 'Choose it for more bedrooms and a private pool, with a fire pit for evenings.' },
              { stay: family, reason: 'Choose it for a game room and loft, so kids and adults have their own spaces.' },
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
          <h2 className="text-3xl">How each group size sleeps</h2>
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
              <caption className="sr-only">Example sleeping plans by group size at each SSHOME home</caption>
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
          <h2 className="text-3xl">Planning a stay for a big group</h2>
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
            </Link>
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">Group stay questions</h2>
          <div className="mt-6">
            <FaqList faqs={faqs} />
          </div>
        </section>

        <p className="mt-10 text-xs text-stone">Listing details checked {factsCheckedOn}. Airbnb has the current rules, availability and pricing.</p>
      </article>
    </>
  );
}
