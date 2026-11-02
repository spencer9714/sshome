import { airbnbUrl, factsCheckedOn, siteFaqs, stays } from '@/data/stays';
import { stayPath } from '@/lib/schema';
import { absoluteUrl, parkFacts, site } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const homes = stays.map((stay) =>
    [
      `## ${stay.name}`,
      '',
      stay.lead,
      '',
      `- Page: ${absoluteUrl(stayPath(stay))}`,
      `- Book on Airbnb: ${airbnbUrl(stay)}`,
      `- Type: entire home in Visalia, California`,
      `- Capacity: up to ${stay.guests} guests, ${stay.bedrooms} bedrooms, ${stay.beds} beds, ${stay.baths} baths`,
      `- Airbnb reviews: ${stay.reviewNote}`,
      `- Best for: ${stay.bestFor}`,
      `- Sleeping: ${stay.sleeping.map((room) => `${room.room}: ${room.beds}`).join('; ')}`,
      ...stay.amenities.map((group) => `- ${group.group}: ${group.items.join(', ')}`),
      `- Good to know: ${stay.goodToKnow.join(' ')}`,
    ].join('\n'),
  );

  const body = [
    `# ${site.name}`,
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
    '',
    '## FAQ',
    '',
    ...siteFaqs.flatMap((faq) => [`### ${faq.question}`, faq.answer, '']),
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
