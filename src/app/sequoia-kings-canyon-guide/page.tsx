import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/json-ld';
import { factsCheckedOn, stays } from '@/data/stays';
import { breadcrumbSchema, stayPath } from '@/lib/schema';
import { absoluteUrl, parkFacts, site } from '@/lib/site';

const path = '/sequoia-kings-canyon-guide';
const title = 'Visiting Sequoia & Kings Canyon from Visalia: Drive Times and Tips';
const description =
  'Plan a Sequoia and Kings Canyon trip from Visalia, CA: park entrances, drive times, vehicle length limits, winter chains and seasonal road closures, based on National Park Service information.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: 'article', images: [{ url: site.ogImage }] },
};

const seasons = [
  {
    name: 'Late fall through spring',
    body: 'Tire chains may be required on park roads whenever it snows, and they can be required at any time on mountain roads. Chains can be bought or rented near the park entrances.',
  },
  {
    name: 'May to mid-November',
    body: 'The road into Cedar Grove in Kings Canyon is typically open during this window. Exact opening and closing dates shift with the weather.',
  },
  {
    name: 'Late May',
    body: 'Mineral King Road usually reopens the Wednesday before Memorial Day. Parts of it are unpaved, and RVs and trailers are not advised.',
  },
  {
    name: 'Busy days',
    body: 'Traffic delays are common on the Generals Highway around Giant Forest and the Sherman Tree area, so build in extra time.',
  },
];

export default function GuidePage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description,
          url: absoluteUrl(path),
          dateModified: factsCheckedOn,
          author: { '@type': 'Organization', name: site.name },
          publisher: { '@type': 'Organization', name: site.name },
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Park guide', path },
        ])}
      />

      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-sm font-medium text-ember">Park guide</p>
        <h1 className="mt-3 text-4xl leading-tight sm:text-6xl">Visiting Sequoia &amp; Kings Canyon from Visalia</h1>
        <p className="mt-6 text-xl leading-relaxed">
          Sequoia and Kings Canyon are neighboring national parks, joined by the Generals Highway. Highway 198 leads
          from the Visalia area up to Sequoia, and Highway 180 leads to Kings Canyon.
        </p>

        <section className="mt-14">
          <h2 className="text-3xl">Drive times and entrances</h2>
          <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-white">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="p-4 font-medium">Park</th>
                  <th scope="col" className="p-4 font-medium">Entrance</th>
                  <th scope="col" className="p-4 font-medium">From Visalia</th>
                </tr>
              </thead>
              <tbody>
                {parkFacts.drives.map((drive) => (
                  <tr key={drive.place} className="border-b border-line last:border-0">
                    <td className="p-4">{drive.place}</td>
                    <td className="p-4 text-stone">{drive.entrance}</td>
                    <td className="p-4 text-stone">{drive.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-stone">
            Times are measured from Visalia Municipal Airport to the entrance. The road is narrow and winding beyond the
            Ash Mountain Entrance, so the drive to Giant Forest takes longer.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">Bringing a large vehicle or a group</h2>
          <p className="mt-4 leading-relaxed text-stone">
            Vehicles over 22 feet are not advised between Potwisha Campground and the Giant Forest Museum on the
            Highway 198 side, and vehicles over 24 feet are not advised between the Foothills Visitor Center and
            Potwisha. The National Park Service names Highway 180 as the preferred route for longer vehicles.
          </p>
        </section>

        <section id="where-to-stay" className="mt-14">
          <h2 className="text-3xl">Visalia or Three Rivers: where should you stay?</h2>
          <p className="mt-4 leading-relaxed text-stone">Our recommendation: compare Visalia if you want a city base for groceries, meals and time together at the house. Compare Three Rivers if being closer to Sequoia’s Ash Mountain Entrance is your priority: Highway 198 enters the park at Three Rivers. Check the actual location and amenities of each home rather than assuming every rental in either town offers the same experience.</p>
          <p className="mt-4 leading-relaxed text-stone">SSHOME’s two Visalia homes offer full kitchens and space for up to 14, with additional sleeping arrangements. Three Rivers is closer to the entrance along this approach, but neither town is the same as staying in Giant Forest. For Kings Canyon, plan your route separately via Highway 180.</p>
          <a href={parkFacts.sourceUrl} className="mt-3 inline-block text-sm underline">Source: National Park Service entrance and route information</a>
        </section>

        <section id="itineraries" className="mt-14">
          <h2 className="text-3xl">Two days, one night: focus on Sequoia</h2>
          <ol className="mt-5 list-decimal space-y-4 pl-5 leading-relaxed text-stone">
            <li><strong className="font-medium text-ink">Day 1 — arrive and settle in.</strong> Pick up groceries in Visalia and plan your arrival around your confirmed check-in time. Leave room for a shared meal and downtime at the house.</li>
            <li><strong className="font-medium text-ink">Day 2 — one park day.</strong> Check out at the agreed time and head out early for Giant Forest and the General Sherman Tree, subject to road and trail access. Allow for mountain driving, parking and walking before your onward journey.</li>
          </ol>
          <h3 className="mt-8 text-2xl">Three days, two nights: a full day among the trees</h3>
          <ol className="mt-5 list-decimal space-y-4 pl-5 leading-relaxed text-stone">
            <li><strong className="font-medium text-ink">Day 1 — arrive in Visalia.</strong> Shop, check in and choose your sleeping spaces before dinner.</li>
            <li><strong className="font-medium text-ink">Day 2 — explore Sequoia.</strong> Reserve the day for Giant Forest and General Sherman, adding other stops only as access, daylight and your group’s energy allow. Return to your home for dinner.</li>
            <li><strong className="font-medium text-ink">Day 3 — choose your return route.</strong> If conditions and your onward route allow, consider Grant Grove in Kings Canyon via Highway 180 after checkout. Otherwise, enjoy an unhurried departure. Cedar Grove is a separate, longer canyon excursion with seasonal road access.</li>
          </ol>
          <p className="mt-5 text-sm leading-relaxed text-stone">These are suggested itineraries, not guided trips or guaranteed access. Entrance estimates above do not include the drive to the groves, entrance queues, parking or walks. Check current conditions and your Airbnb check-in and checkout times before finalizing plans.</p>
          <Link href="/zh-tw/sequoia-guide" lang="zh-Hant" className="mt-5 inline-block underline">繁體中文：紅杉國家公園自駕與住宿指南</Link>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">Seasonal road patterns</h2>
          <div className="mt-6 space-y-6">
            {seasons.map((season) => (
              <div key={season.name}>
                <h3 className="font-sans text-base font-semibold tracking-normal">{season.name}</h3>
                <p className="mt-1.5 leading-relaxed text-stone">{season.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">Top sights to plan around</h2>
          <ul className="mt-5 list-disc space-y-2 pl-5 leading-relaxed text-stone marker:text-ember">
            <li>
              <strong className="font-medium text-ink">General Sherman Tree, Giant Forest:</strong> the largest tree on
              Earth by volume, in Sequoia National Park.
            </li>
            <li>
              <strong className="font-medium text-ink">Moro Rock:</strong> a granite dome in Sequoia with a stairway to
              wide views.
            </li>
            <li>
              <strong className="font-medium text-ink">General Grant Tree, Grant Grove:</strong> the giant sequoia grove
              near the Big Stump Entrance in Kings Canyon.
            </li>
            <li>
              <strong className="font-medium text-ink">Cedar Grove:</strong> the deep canyon section of Kings Canyon,
              reachable only while its road is open.
            </li>
          </ul>
        </section>

        <section className="mt-14 rounded-lg bg-sand p-6 sm:p-8">
          <h2 className="text-2xl">Check conditions before you go</h2>
          <p className="mt-3 leading-relaxed text-stone">
            Closures change often. Use the official{' '}
            <a href={parkFacts.conditionsUrl} className="text-ink underline hover:text-ember">
              road conditions page
            </a>{' '}
            and{' '}
            <a href={parkFacts.sourceUrl} className="text-ink underline hover:text-ember">
              directions page
            </a>{' '}
            from the National Park Service. In-park road conditions are also available 24 hours a day at (559) 565-3341.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">Where to stay in Visalia</h2>
          <ul className="mt-5 space-y-4">
            {stays.map((stay) => (
              <li key={stay.slug}>
                <Link href={stayPath(stay)} className="font-medium underline hover:text-ember">
                  {stay.name}
                </Link>
                <p className="mt-1 text-stone">{stay.tagline}</p>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-14 text-xs text-stone">Road and drive information checked {factsCheckedOn}.</p>
      </article>
    </>
  );
}
