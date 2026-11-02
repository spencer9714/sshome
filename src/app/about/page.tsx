import type { Metadata } from 'next';
import Link from 'next/link';
import { airbnbUrl, stays } from '@/data/stays';
import { stayPath } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'About SSHOME & Contact',
  description: 'Meet SSHOME: two design-led vacation homes in Visalia for family and group trips. Compare homes and contact the host through Airbnb.',
  alternates: { canonical: '/about' },
  openGraph: { title: 'About SSHOME & Contact', url: '/about' },
};

export default function AboutPage() {
  return <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
    <p className="text-sm font-medium text-ember">About SSHOME</p>
    <h1 className="mt-3 text-4xl sm:text-6xl">Space to travel together</h1>
    <p className="mt-6 text-xl leading-relaxed">SSHOME brings together two design-led vacation homes in Visalia, California. Our focus is simple: space for families and groups to cook, unwind and spend time together between adventures.</p>
    <p className="mt-5 leading-relaxed text-stone">Choose a five-bedroom home with a private pool and fire pit, or a four-bedroom family home with a pool table and loft. Each home has a full kitchen and hot tub, with room for up to 14 guests using the listed sleeping arrangements.</p>
    <section className="mt-12"><h2 className="text-3xl">Questions before booking?</h2><p className="mt-4 leading-relaxed text-stone">Open the home on Airbnb and select “Contact host” or “Message host” to ask about sleeping arrangements, hot tub readiness, EV charging or current fees. Check availability, house rules and cancellation terms there before booking.</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">{stays.map((stay) => <div key={stay.slug} className="rounded-lg border border-line bg-white p-6"><h3 className="text-2xl">{stay.name}</h3><Link href={stayPath(stay)} className="mt-4 block text-sm underline">Explore the home</Link><a href={airbnbUrl(stay)} data-booking-placement="about-contact" className="mt-4 inline-block rounded-md bg-ember px-4 py-3 text-sm font-medium text-white">View on Airbnb &amp; contact host</a></div>)}</div>
    </section>
    <section className="mt-12"><h2 className="text-3xl">Plan your park days</h2><p className="mt-4 text-stone">Our homes are in Visalia, outside the parks. Entrance drive times are different from travel times to the giant sequoia groves.</p><Link href="/sequoia-kings-canyon-guide" className="mt-4 inline-block underline">Read the park guide</Link></section>
  </article>;
}
