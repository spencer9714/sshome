export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sshomedesigns.com').replace(/\/$/, '');

export const site = {
  name: 'SSHOME',
  title: 'SSHOME | Visalia Vacation Homes near Sequoia & Kings Canyon',
  description:
    'Private Visalia vacation homes for up to 14 guests, a base for Sequoia and Kings Canyon. Choose a pool home or a family home with a game room. Both offer hot tubs, Wi-Fi and full kitchens. Book on Airbnb.',
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
