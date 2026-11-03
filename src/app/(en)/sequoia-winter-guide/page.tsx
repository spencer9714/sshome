import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaqList } from '@/components/faq-list';
import { JsonLd } from '@/components/json-ld';
import { pageUpdates } from '@/data/page-updates';
import { stays, type Faq } from '@/data/stays';
import { breadcrumbSchema, faqSchema, stayPath } from '@/lib/schema';
import { languageAlternates } from '@/lib/locales';
import { absoluteUrl, parkFacts } from '@/lib/site';

const path = '/sequoia-winter-guide';
const title = 'Sequoia in Winter from Visalia: Snow, Chains and Road Access';
const description =
  'Plan a winter trip to Sequoia and Kings Canyon from Visalia, CA: tire chains, road closures, snow play areas and what to pack, based on NPS information.';
const image = '/park/sequoia-winter-snow.jpg';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path, languages: languageAlternates(path, '/zh-tw/sequoia-winter-guide') },
  openGraph: { title, description, url: path, type: 'article', images: [{ url: image }] },
};

const [desert, family] = stays;

const npsPages = {
  activities: 'https://www.nps.gov/seki/planyourvisit/winteractivities.htm',
  snowplay: 'https://www.nps.gov/seki/planyourvisit/snowplay.htm',
  holidays: 'https://www.nps.gov/seki/planyourvisit/winter-holidays-in-the-parks.htm',
  skiing: 'https://www.nps.gov/seki/planyourvisit/skiing.htm',
};

const checklist = [
  {
    title: 'Tire chains, even with 4WD or AWD',
    body: 'The National Park Service says chains may be required at any time in winter, and asks drivers to bring them even with four-wheel or all-wheel drive. You can buy or rent them near the entrances. If you are driving a rental car, check its terms on chains first.',
  },
  {
    title: 'A full tank or full charge',
    body: 'There are no gas stations or EV chargers inside the parks, so fill up or charge before you leave Visalia.',
  },
  {
    title: 'Warm layers, water and food',
    body: 'Pack for snow in the groves and rain in the foothills. Bring extra food and water, and be prepared for limited cell service beyond the entrance station.',
  },
  {
    title: 'Check the roads before you go',
    body: 'Check before you leave, because storms can close roads with little warning. In-park road conditions are available 24 hours a day at (559) 565-3341: press 1, then 1 again.',
  },
];

const access = [
  {
    place: 'Giant Forest and the General Sherman Tree',
    route: 'Highway 198',
    status: 'A popular winter destination, weather permitting. NPS winter guidance lists the main Sherman Tree parking lot as closed, with very limited parking at the accessible lot.',
  },
  {
    place: 'Grant Grove and the General Grant Tree',
    route: 'Highway 180',
    status: 'Winter destination in Kings Canyon, with snow play and marked winter trails. Storms can affect which entrance is the best option; check NPS updates before setting out.',
  },
  {
    place: 'Generals Highway between the parks',
    route: 'Quail Flat to Wuksachi Lodge',
    status: 'May close in snowy weather. When it is open, allow at least 2 to 3 hours between entrance stations.',
  },
  {
    place: 'Moro Rock and Crescent Meadow',
    route: 'Moro Rock/Crescent Meadow Road',
    status: 'Listed by NPS as closed in its winter guidance.',
  },
  {
    place: 'Cedar Grove',
    route: 'Highway 180 past Hume Lake Junction',
    status: 'Closed in winter. The road is typically open from May through early to mid-November.',
  },
  {
    place: 'Mineral King',
    route: 'Mineral King Road',
    status: 'Closed in winter. It usually reopens the Wednesday before Memorial Day.',
  },
];

const snowAreas = [
  {
    name: 'Wolverton, Sequoia National Park',
    body: 'At the end of Wolverton Road, about two miles north of the General Sherman Tree, at 7,250 feet. After a storm, the road can take hours to open because plows clear the main road first.',
  },
  {
    name: 'Big Stump, Kings Canyon National Park',
    body: 'Near the Big Stump Entrance Station on Highway 180, in the Grant Grove area at about 6,600 feet.',
  },
  {
    name: 'Columbine, Kings Canyon National Park',
    body: 'On the road to the General Grant Tree Trail in Grant Grove. You can usually buy snow play gear at the Grant Grove Market.',
  },
];

const faqs: Faq[] = [
  {
    question: 'Is Sequoia National Park open in winter?',
    answer: 'Yes, the park stays open, but access changes with the weather and some areas close for the season. Check the park’s road conditions on the day you go.',
  },
  {
    question: 'When are the parks busiest in winter?',
    answer: 'NPS names Thanksgiving week and Christmas week among the busiest times, with entrance waits of up to 2 to 3 hours. Weekdays are quieter, and arriving before 9 AM or after 3 PM helps you avoid long lines. Popular lots can fill as early as 10 AM.',
  },
  {
    question: 'Is there a shuttle in Giant Forest in winter?',
    answer: 'NPS runs a free Giant Forest shuttle during the Thanksgiving and winter holidays. Dates change each year, so check the park website. It does not serve Kings Canyon.',
  },
  {
    question: 'Can we bring a dog to the parks in winter?',
    answer: 'Pets are not allowed on any park trails, including winter trails. In developed areas they must be leashed, so plan ahead if your dog is coming along.',
  },
];

export default function WinterGuidePage() {
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
          { name: 'Winter guide', path },
        ])}
      />

      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-sm font-medium text-ember">Winter guide</p>
        <h1 className="mt-3 text-4xl leading-tight sm:text-6xl">Visiting Sequoia in winter from Visalia</h1>
        <p className="mt-6 text-xl leading-relaxed">
          Snow around the giant sequoias can make a familiar trail feel like a different world. Getting there takes
          a little preparation: carry tire chains, check road conditions that morning, and keep your plans flexible.
          Stay in Visalia down in the valley, head up when conditions allow, and enjoy the house when they do not.
        </p>

        <figure className="mt-10">
          <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
            <Image
              src={image}
              alt="Giant sequoia with fresh snow around its base beside a wooden fence in Sequoia and Kings Canyon National Parks"
              fill
              priority
              sizes="(min-width: 768px) 720px, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-2 text-xs leading-relaxed text-stone">
            Photo (cropped):{' '}
            <a href={npsPages.holidays} className="underline">NPS / Alison Taggart Barone</a>. No protection is claimed in
            original U.S. Government works.
          </figcaption>
        </figure>

        <section className="mt-14">
          <h2 className="text-3xl">Before you leave Visalia</h2>
          <div className="mt-6 space-y-6">
            {checklist.map((item) => (
              <div key={item.title}>
                <h3 className="font-sans text-base font-semibold tracking-normal">{item.title}</h3>
                <p className="mt-1.5 leading-relaxed text-stone">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">Winter destinations and road access</h2>
          <p className="mt-4 leading-relaxed text-stone">
            This is a seasonal overview. Check current conditions before traveling, as storms can change road access.
          </p>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {access.map((item) => (
              <div key={item.place} className="py-4">
                <h3 className="font-sans text-base font-semibold tracking-normal">{item.place}</h3>
                <p className="mt-0.5 text-sm text-stone">{item.route}</p>
                <p className="mt-1.5 leading-relaxed text-stone">{item.status}</p>
              </div>
            ))}
          </div>
          <a href={parkFacts.conditionsUrl} className="mt-4 inline-block py-1 text-sm underline hover:text-ember">
            Check current road conditions on the NPS website
          </a>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">Where kids can sled</h2>
          <p className="mt-4 leading-relaxed text-stone">
            Sledding and tubing are for designated areas only, and are not allowed on Sherman Tree Road or around the
            Grant Tree Trail.
          </p>
          <div className="mt-6 space-y-5">
            {snowAreas.map((area) => (
              <div key={area.name}>
                <h3 className="font-sans text-base font-semibold tracking-normal">{area.name}</h3>
                <p className="mt-1.5 leading-relaxed text-stone">{area.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 leading-relaxed text-stone">
            NPS safety advice: slide feet first, consider a helmet, keep clear of rocks and trees, and never slide
            toward roads or parking lots. Skip sledding when snow conditions or visibility are poor. Watch for children getting
            wet or cold.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">Snowshoeing and winter walks</h2>
          <p className="mt-4 leading-relaxed text-stone">
            Giant Forest and Grant Grove both have winter trails, but they can be icy, so traction devices are
            recommended. You can rent snowshoes at Grant Grove Market or bring your own.
          </p>
          <p className="mt-4 leading-relaxed text-stone">
            When there is enough snow, NPS has offered free ranger-led snowshoe walks from around mid-January. They have
            required a reservation, waterproof shoes and a minimum age of 10, so call the park to confirm this season’s
            schedule.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">A simple winter day from Visalia</h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 leading-relaxed text-stone marker:text-ember">
            <li>
              <strong className="font-medium text-ink">Morning:</strong> check the road status, then take Highway 198 to
              the Ash Mountain Entrance. From the Foothills Visitor Center, NPS allows about one hour to reach Giant
              Forest.
            </li>
            <li>
              <strong className="font-medium text-ink">Midday:</strong> see the General Sherman Tree, then head to
              Wolverton if you have sleds.
            </li>
            <li>
              <strong className="font-medium text-ink">If the upper road is closed:</strong> stay lower and stop at
              Hospital Rock for its picnic area and exhibits.
            </li>
            <li>
              <strong className="font-medium text-ink">Afternoon:</strong> leave with plenty of daylight, since winter
              mountain driving is slower.
            </li>
          </ol>
          <p className="mt-5 leading-relaxed text-stone">
            For entrance drive times and vehicle length limits, see our{' '}
            <Link href="/sequoia-kings-canyon-guide" className="text-ink underline hover:text-ember">
              park guide
            </Link>
            .
          </p>
        </section>

        <section className="mt-14 rounded-lg bg-sand p-6 sm:p-8">
          <h2 className="text-2xl">Staying in Visalia this winter</h2>
          <div className="mt-4 space-y-3 leading-relaxed text-stone">
            <p>
              <Link href={stayPath(family)} className="font-medium text-ink underline hover:text-ember">
                {family.name}
              </Link>{' '}
              offers indoor entertainment for stormy days, including a pool table and board games in the loft.
            </p>
            <p>
              <Link href={stayPath(desert)} className="font-medium text-ink underline hover:text-ember">
                {desert.name}
              </Link>{' '}
              has a fire pit and Nex Playground motion-controlled games. Its pool is not heated, so don’t plan on a winter swim.
            </p>
            <p>
              Hoping to use a hot tub after a cold day? Message the host before booking, since reheating after servicing
              can take longer in winter.
            </p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">Winter trip questions</h2>
          <div className="mt-6">
            <FaqList faqs={faqs} />
          </div>
        </section>

        <p className="mt-10 text-xs leading-relaxed text-stone">
          Based on National Park Service pages on{' '}
          <a href={npsPages.activities} className="underline">winter activities</a>,{' '}
          <a href={npsPages.snowplay} className="underline">snow play</a>,{' '}
          <a href={npsPages.holidays} className="underline">winter holidays</a> and{' '}
          <a href={npsPages.skiing} className="underline">skiing and snowshoeing</a>. Some were last updated in earlier
          seasons, so confirm details with the park. Checked {pageUpdates[path]}.
        </p>
      </article>
    </>
  );
}
