export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sshomedesigns.com').replace(/\/$/, '');

export const site = {
  name: 'SSHOME',
  title: 'SSHOME | Visalia Vacation Homes near Sequoia & Kings Canyon',
  description:
    'Private, design-led vacation homes in Visalia, California for groups of up to 14, near Sequoia and Kings Canyon National Parks. Pool, hot tub, EV charging and full kitchens. Book on Airbnb.',
  ogImage: '/stays/desert-retreat/pool-1.jpg',
};

export const absoluteUrl = (path: string) => `${siteUrl}${path}`;

export const parkFacts = {
  sourceUrl: 'https://www.nps.gov/seki/planyourvisit/directions.htm',
  conditionsUrl: 'https://www.nps.gov/seki/planyourvisit/conditions.htm',
  drives: [
    { place: 'Sequoia National Park', entrance: 'Ash Mountain Entrance, Highway 198', time: 'About 1 hour' },
    { place: 'Kings Canyon National Park', entrance: 'Big Stump Entrance, Highway 180', time: 'About 1.5 hours' },
  ],
};
