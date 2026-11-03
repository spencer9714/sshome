import type { Metadata } from 'next';
import Link from 'next/link';
import { airbnbUrl, stays } from '@/data/stays';
import { stayPath } from '@/lib/schema';
import { languageAlternates } from '@/lib/locales';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About SSHOME & Contact',
  description: 'Explore two thoughtfully designed vacation homes in Visalia for families and groups. Compare the homes and contact your host on Airbnb.',
  alternates: { canonical: '/about', languages: languageAlternates('/about', '/zh-tw/about') },
  openGraph: { title: 'About SSHOME & Contact', url: '/about', images: [{ url: site.ogImage }] },
};

export default function AboutPage() {
  return <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
    <p className="text-sm font-medium text-ember">About SSHOME</p>
    <h1 className="mt-3 text-4xl sm:text-6xl">The best part? Everyone is here.</h1>
    <p className="mt-6 text-xl leading-relaxed">Some of the best vacation moments happen between the big plans: coffee before anyone else is up, a meal that turns into a long conversation, one more game before bed. Our two Visalia homes give you space for all of it, with Sequoia and Kings Canyon on the itinerary.</p>
    <section className="mt-10 rounded-lg bg-sand p-6 sm:p-8">
      <h2 className="text-3xl">A stay that fits your plans</h2>
      <p className="mt-4 leading-relaxed">Have a question about the rooms, the hot tub, or bringing everyone along? Send us a message through Airbnb.</p>
      <p className="mt-4 leading-relaxed text-stone">Both homes have Wi-Fi. Desert Retreat also has a dedicated workspace with a desk and monitor in Bedroom 2; Luxury Family Home does not have a dedicated workspace.</p>
    </section>
    <p className="mt-5 leading-relaxed text-stone">Pick the five-bedroom Desert Retreat for poolside afternoons and the fire pit, or the four-bedroom Luxury Family Home for a game of pool and time in the loft. Both have full kitchens and hot tubs, and each welcomes up to 14 guests with the listed extra sleeping arrangements.</p>
    <section className="mt-12"><h2 className="text-3xl">Questions before booking?</h2><p className="mt-4 leading-relaxed text-stone">Open the home on Airbnb and select “Contact host” or “Message host” to ask about sleeping arrangements, hot tub availability, EV charging, or additional fees. Check availability, house rules and cancellation terms there before booking.</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">{stays.map((stay) => <div key={stay.slug} className="rounded-lg border border-line bg-white p-6"><h3 className="text-2xl">{stay.name}</h3><Link href={stayPath(stay)} className="mt-4 block text-sm underline">Explore the home</Link><a href={airbnbUrl(stay)} data-booking-placement="about-contact" data-airbnb-intent="contact" className="mt-4 inline-block rounded-md bg-ember px-4 py-3 text-sm font-medium text-white">View listing &amp; contact host</a></div>)}</div>
    </section>
    <section className="mt-12"><h2 className="text-3xl">Plan your park days</h2><p className="mt-4 text-stone">Our homes are in Visalia, outside the parks. Allow extra time beyond the park entrances to reach the giant sequoia groves.</p><Link href="/sequoia-kings-canyon-guide" className="mt-4 inline-block underline">Read the park guide</Link></section>
  </article>;
}
