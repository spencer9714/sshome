export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sshomedesigns.com').replace(/\/$/, '');

export const site = {
  name: 'SSHOME',
  title: 'SSHOME | Visalia Vacation Homes near Sequoia & Kings Canyon',
  description:
    'Explore two private vacation homes in Visalia, each accommodating up to 14 guests. Choose a private pool or a game room for your Sequoia and Kings Canyon trip.',
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
