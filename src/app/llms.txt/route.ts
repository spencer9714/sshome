import { airbnbUrl, factsCheckedOn, siteFaqs, stays } from '@/data/stays';
import { stayPath } from '@/lib/schema';
import { absoluteUrl, parkFacts, site } from '@/lib/site';
import { zhStayPath } from '@/lib/locales';

export const dynamic = 'force-static';

export function GET() {
  const homes = stays.map((stay) =>
    [
      `## ${stay.name}`,
      '',
      stay.lead,
      '',
      `- Page: ${absoluteUrl(stayPath(stay))}`,
      `- Traditional Chinese listing: ${absoluteUrl(zhStayPath(stay.slug))}`,
      `- 繁中介紹: ${stay.summaryZh}`,
      `- Book on Airbnb: ${airbnbUrl(stay)}`,
      `- Type: entire home in Visalia, California`,
      `- Capacity: up to ${stay.guests} guests, ${stay.bedrooms} bedrooms, ${stay.beds} bedroom beds, ${stay.baths} baths`,
      `- Sleeping setup: ${stay.bedSummary}`,
      `- Extra sleeping: ${stay.extraSleeping}`,
      `- Airbnb reviews: ${stay.reviewNote}`,
      `- Best for: ${stay.bestFor}`,
      `- Sleeping: ${stay.sleeping.map((room) => `${room.room}: ${room.beds}`).join('; ')}`,
      ...stay.amenities.map((group) => `- ${group.group}: ${group.items.join(', ')}`),
      `- Check-in: ${stay.rules.checkIn}. Checkout: ${stay.rules.checkOut}.`,
      `- Pets: ${stay.rules.pets}`,
      `- House rules: ${stay.rules.items.join('; ')}`,
      `- Good to know: ${stay.goodToKnow.join(' ')}`,
      ...stay.faqs.map((faq) => `- ${faq.question} ${faq.answer}`),
      ...stay.reviews.map((review) => `- Guest review (${review.dateLabel}, ${review.rating}/5): "${review.text}"`),
    ].join('\n'),
  );

  const body = [
    `# ${site.name}`,
    `Traditional Chinese homepage: ${absoluteUrl('/zh-tw')}`,
    `Image sitemap: ${absoluteUrl('/image-sitemap.xml')}`,
    '',
    `> ${site.description}`,
    '',
    `Facts checked ${factsCheckedOn}. Pricing and availability are live on Airbnb only and are not listed here. Exact addresses are shared by Airbnb after booking.`,
    '',
    ...homes.flatMap((home) => [home, '']),
    '## Getting to the parks',
    '',
    ...parkFacts.drives.map(
      (drive) => `- ${drive.place}: ${drive.time.toLowerCase()} from Visalia Municipal Airport to the ${drive.entrance}`,
    ),
    `- Source: ${parkFacts.sourceUrl}`,
    `- Park guide: ${absoluteUrl('/sequoia-kings-canyon-guide')}`,
    `- Group lodging and sleeping plans for 8 to 14 guests: ${absoluteUrl('/sequoia-group-lodging')}`,
    `- Winter guide with tire chains, road access and snow play areas: ${absoluteUrl('/sequoia-winter-guide')}`,
    `- Housing for contractors and work crews, with a bed for each of 5 or 6 people, Airbnb booking only and stays up to 29 days: ${absoluteUrl('/visalia-crew-housing')}`,
    `- Visalia vs Three Rivers and suggested itineraries: ${absoluteUrl('/sequoia-kings-canyon-guide#where-to-stay')}`,
    `- Traditional Chinese travel guide: ${absoluteUrl('/zh-tw/sequoia-guide')}`,
    `- Traditional Chinese group lodging guide: ${absoluteUrl('/zh-tw/sequoia-group-lodging')}`,
    `- Traditional Chinese winter guide: ${absoluteUrl('/zh-tw/sequoia-winter-guide')}`,
    `- Traditional Chinese crew housing guide: ${absoluteUrl('/zh-tw/visalia-crew-housing')}`,
    `- About SSHOME and contacting the host on Airbnb: ${absoluteUrl('/about')}`,
    `- Privacy policy: ${absoluteUrl('/privacy')}`,
    '',
    '## FAQ',
    '',
    ...siteFaqs.flatMap((faq) => [`### ${faq.question}`, faq.answer, '']),
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
