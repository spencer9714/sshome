export type Photo = { src: string; alt: string };

export type Faq = { question: string; answer: string };

// Copied word for word from Airbnb. Names are reduced to an initial for guest privacy.
export type GuestReview = {
  initial: string;
  date: string;
  dateLabel: string;
  context: string;
  rating: number;
  text: string;
};

export type Stay = {
  slug: string;
  name: string;
  airbnbId: string;
  airbnbTitle: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  bestFor: string;
  lead: string;
  // Approximate map position published by Airbnb, rounded so it never pinpoints the home.
  geo: { latitude: number; longitude: number };
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  rating: { value: number; count: number; categories?: { label: string; score: number }[] } | null;
  reviewNote: string;
  reviews: GuestReview[];
  compare: { outdoor: string; indoor: string; work: string; parking: string };
  highlights: { title: string; body: string }[];
  sleeping: { room: string; beds: string }[];
  extraSleeping: string;
  amenities: { group: string; items: string[] }[];
  goodToKnow: string[];
  faqs: Faq[];
  photos: Photo[];
};

export const factsCheckedOn = '2026-11-01';

export const airbnbUrl = (stay: Stay) => `https://www.airbnb.com/rooms/${stay.airbnbId}`;

const photo = (folder: string) => (file: string, alt: string): Photo => ({
  src: `/stays/${folder}/${file}.jpg`,
  alt,
});

const desert = photo('desert-retreat');
const family = photo('luxury-family-home');

export const stays: Stay[] = [
  {
    slug: 'desert-retreat-pool-hot-tub-visalia',
    name: 'Desert Retreat',
    airbnbId: '1800164576342497106',
    airbnbTitle: 'Desert Retreat near Sequoia | Pool, hot tub & EV',
    tagline: 'A private pool, a fire pit, and five bedrooms for the whole group.',
    metaTitle: 'Desert Retreat: 5-Bedroom Visalia Home with Pool & Hot Tub near Sequoia',
    metaDescription:
      'Entire 5-bedroom home in Visalia, CA sleeping 14, with a private pool, hot tub, fire pit and EV charging, about 1 hour from Sequoia National Park. Book on Airbnb.',
    bestFor: 'Groups who want a pool and a backyard to come home to',
    lead: 'A desert-inspired home in Visalia with a private pool, a separate hot tub and a fire pit circle out back. Inside, there is a 98-inch TV for movie night, a kitchen with HexClad cookware, and a Smart TV in each of the five bedrooms.',
    geo: { latitude: 36.31, longitude: -119.28 },
    guests: 14,
    bedrooms: 5,
    beds: 6,
    baths: 3,
    rating: null,
    reviewNote: 'New on Airbnb',
    reviews: [],
    compare: {
      outdoor: 'Private pool, hot tub, fire pit, BBQ, covered patio, lawn games',
      indoor: '98-inch TV, Nex Playground motion games',
      work: 'Desk, chair, monitor and lamp in Bedroom 2',
      parking: '2 driveway spaces, street parking, EV charging for a fee',
    },
    highlights: [
      {
        title: 'Private pool with a lounging shelf',
        body: 'A shallow Baja shelf with in-water loungers, lit after dark. The pool is not heated.',
      },
      {
        title: 'Hot tub and fire pit',
        body: 'A heatable hot tub, plus Adirondack chairs around a fire pit for evenings under the stars.',
      },
      {
        title: 'A kitchen built for big meals',
        body: 'HexClad cookware, Instant Pot, blender, kettle, kid-friendly dinnerware, and a dual K-Cup and drip coffee maker.',
      },
      {
        title: 'Play and work, both covered',
        body: 'Nex Playground motion games for the family, and a dedicated workspace with a monitor in Bedroom 2.',
      },
    ],
    sleeping: [
      { room: 'Bedroom 1, 2nd floor', beds: '1 king bed' },
      { room: 'Bedroom 2, 1st floor', beds: '1 queen bed, workspace with monitor' },
      { room: 'Bedroom 3, 2nd floor', beds: '1 queen bed' },
      { room: 'Bedroom 4, 2nd floor', beds: '1 queen bed' },
      { room: 'Bedroom 5, 2nd floor', beds: '2 twin beds' },
    ],
    extraSleeping: '2 twin and 1 queen air mattresses are provided, within the 14-guest maximum.',
    amenities: [
      { group: 'Outdoors', items: ['Private pool (not heated)', 'Hot tub (can be heated)', 'BBQ grill', 'Fire pit with seating', 'Covered patio', 'Outdoor dining area', 'Turf area with cornhole'] },
      { group: 'Living', items: ['98-inch TV', 'Smart TV in every bedroom', 'Nex Playground', 'Dining table and kitchen island', 'Wifi'] },
      { group: 'Kitchen', items: ['HexClad cookware', 'Instant Pot', 'Blender', 'Electric kettle', 'Brita pitcher', 'K-Cup and drip coffee maker', 'Kid-friendly dinnerware'] },
      { group: 'Practical', items: ['Washer and dryer', 'Detergent and dryer sheets', 'Iron and drying rack', 'Self check-in with smart lock', 'Free driveway parking', 'EV charging (fee)'] },
    ],
    goodToKnow: [
      'The pool is not heated. The separate hot tub can be heated.',
      'First-night hot tub availability is not guaranteed. After a full water change, reheating can take about 20 to 30 hours in winter, so message the host before booking if it matters to you.',
      'The home is in a developing neighborhood, and nearby construction may cause daytime noise.',
      'Routine yard maintenance happens during the day, and staff may access outdoor areas.',
      'EV charging and BBQ propane cost extra. Early check-in and late checkout may be available for a fee.',
      'Please bring your own K-Cup pods.',
      'The neighborhood celebrates Halloween, so trick-or-treaters may knock on October 31.',
    ],
    faqs: [
      { question: 'How many people does the Desert Retreat sleep?', answer: 'Up to 14 guests, in 5 bedrooms with 6 beds. Three air mattresses are also provided within that maximum, and there are 3 bathrooms.' },
      { question: 'Is the pool at the Desert Retreat heated?', answer: 'No, the pool is not heated. The separate hot tub can be heated, but first-night availability is not guaranteed.' },
      { question: 'How far is the Desert Retreat from Sequoia National Park?', answer: 'The home is in Visalia, about a 1-hour drive from Sequoia National Park.' },
      { question: 'Does the Desert Retreat have EV charging?', answer: 'Yes, for an additional fee. Contact the host in advance for pricing and arrangements.' },
      { question: 'Can I work remotely from the Desert Retreat?', answer: 'Yes. Bedroom 2 has a desk, chair, monitor and lamp, and the home has Wifi. Nearby construction may cause daytime noise.' },
    ],
    photos: [
      desert('pool-1', 'Private pool glowing at sunset behind the two-story Desert Retreat home in Visalia'),
      desert('living-room-1', 'Living room with a green velvet sofa, gallery wall and 98-inch TV'),
      desert('pool-4', 'In-water loungers on the shallow Baja shelf of the private pool'),
      desert('backyard-3', 'Fire pit circled by Adirondack chairs in the desert-landscaped backyard'),
      desert('kitchen-1', 'Fully equipped kitchen at the Desert Retreat'),
      desert('pool-baja-shelf', 'Private outdoor pool with a Baja shelf and in-water loungers'),
      desert('pool-3', 'Private pool and backyard at the Desert Retreat'),
      desert('pool-5', 'Private pool and patio at the Desert Retreat'),
      desert('hot-tub-1', 'Private hot tub in the backyard'),
      desert('hot-tub-2', 'Hot tub and seating in the backyard'),
      desert('backyard-1', 'Backyard and outdoor living area'),
      desert('backyard-2', 'Backyard seating at the Desert Retreat'),
      desert('backyard-4', 'Backyard detail at the Desert Retreat'),
      desert('turf-cornhole', 'Artificial turf area with cornhole boards'),
      desert('living-room-2', 'Living room seating at the Desert Retreat'),
      desert('nex-playground', 'Nex Playground with interactive, motion-controlled games'),
      desert('kitchen-fire-pit-view', 'Kitchen window overlooking the backyard fire pit'),
      desert('dining', 'Dining area at the Desert Retreat'),
      desert('bedroom-1', 'Bedroom 1 with a king bed'),
      desert('bedroom-2', 'Bedroom 2 with a queen bed'),
      desert('bedroom-3', 'Bedroom 3 with a queen bed'),
      desert('bedroom-4', 'Bedroom 4 with a queen bed'),
      desert('bedroom-5', 'Bedroom 5 with two twin beds'),
      desert('bathroom-1', 'Full bathroom at the Desert Retreat'),
      desert('workspace', 'Dedicated workspace with desk and monitor'),
      desert('ev-charging', 'EV charger, available for an additional fee'),
    ],
  },
  {
    slug: 'luxury-family-home-hot-tub-game-room-visalia',
    name: 'Luxury Family Home',
    airbnbId: '1291019377672253246',
    airbnbTitle: 'Luxury family home | Hot Tub | EV | BBQ',
    tagline: 'A game room, a loft, and a hot tub under string lights.',
    metaTitle: 'Luxury Family Home: 4-Bedroom Visalia Rental with Hot Tub & Game Room',
    metaDescription:
      'Entire 4-bedroom Visalia, CA home sleeping 14, rated 4.91 from 103 Airbnb reviews. Hot tub, pool table, loft and EV charging, 35 miles from Sequoia National Park.',
    bestFor: 'Families and groups who want rainy-day space and proven reviews',
    lead: 'A warm, modern family home with a pool table in the game room, a second-floor loft stocked with board games, and a six-person hot tub out back. It is 35 miles from Sequoia National Park and 55 miles from Kings Canyon.',
    geo: { latitude: 36.36, longitude: -119.31 },
    guests: 14,
    bedrooms: 4,
    beds: 6,
    baths: 3,
    rating: {
      value: 4.91,
      count: 103,
      categories: [
        { label: 'Check-in', score: 5.0 },
        { label: 'Communication', score: 5.0 },
        { label: 'Accuracy', score: 4.9 },
        { label: 'Location', score: 4.9 },
        { label: 'Cleanliness', score: 4.8 },
        { label: 'Value', score: 4.8 },
      ],
    },
    reviewNote: '4.91 from 103 reviews',
    reviews: [
      {
        initial: 'N.',
        date: '2026-02',
        dateLabel: 'February 2026',
        context: 'Stayed with kids',
        rating: 5,
        text: 'We had the most incredible stay! The home is absolutely beautiful and perfectly kid-friendly, which allowed us to relax and truly enjoy our time. Our kids spent hours playing air hockey in the garage—it was such a hit! We had every amenity needed to cook a full family dinner, but we also loved that the home is located near some fantastic restaurants with stunning mountain views. The best amenity though was the hot tub and it’s always ready so it was perfect at night—the stargazing is spectacular! The host was incredibly easy to work with and made the whole process seamless. We truly had a great time connecting as a family and would love to come back and stay here again sometime!',
      },
      {
        initial: 'J.',
        date: '2026-06',
        dateLabel: 'June 2026',
        context: 'Stayed with a pet',
        rating: 5,
        text: 'Couldn’t have asked for a better arrangement and location for a group of us heading into Sequoia and King’s Canyon NP’s! Host was very communicative and helpful as needed.',
      },
      {
        initial: 'Z.',
        date: '2026-06',
        dateLabel: 'June 2026',
        context: 'Stayed one night',
        rating: 5,
        text: "We ended up booking after prior plans fell through. The hosts were very responsive from booking. We greatly enjoyed our stay. It was decorated very nicely and was quite spacious. While we got there late and had stopped in a bigger city prior to arriving, we were pleasantly surprised that we were a 5 minute drive from gas stations and restaurants that are open late like Raising Cane's and In-N-Out. Had we done more research, we would have driven straight there. It's close to city amenities while it's still in the suburbs where you're not surrounded by noise. Overall, we all had a great stay there and if we ever need to stay in the area, we'll definitely be booking again.",
      },
      {
        initial: 'J.',
        date: '2026-08',
        dateLabel: 'August 2026',
        context: 'Stayed one night',
        rating: 5,
        text: 'Great house super clean 100% recommend it. One of my favorite houses here in Visalia.',
      },
      {
        initial: 'M.',
        date: '2026-08',
        dateLabel: 'August 2026',
        context: 'Group trip',
        rating: 5,
        text: "The house was super clean and comfortable. The location was convenient and had lots of grocery stores and quick bite options nearby. Only thing that was a bit confusing was how the central Air conditioning worked, it took a while to cool the house down. But otherwise the host was great, very responsive and accommodating. I'd recommend this place for anyone traveling to the national parks nearby.",
      },
    ],
    compare: {
      outdoor: '6-person hot tub, BBQ, fenced yard with string lights, cactus garden',
      indoor: 'Pool table, 75-inch TV, loft with board games',
      work: 'None listed',
      parking: '2 driveway spaces, garage, street parking, EV charging for a fee',
    },
    highlights: [
      {
        title: 'Game room with a pool table',
        body: 'A dedicated room for family nights and friendly competition, whatever the weather.',
      },
      {
        title: 'Loft for extra breathing room',
        body: 'A second-floor loft with a Smart TV, sleeper sofa, board games, puzzles and Nintendo Switch games.',
      },
      {
        title: 'Backyard made for evenings',
        body: 'A six-person hot tub, BBQ grill, ambient lighting, and a succulent and cactus garden.',
      },
      {
        title: 'Thoughtful family details',
        body: "A kids' room, children's plates and utensils, plus Toto bidets in the bathrooms.",
      },
    ],
    sleeping: [
      { room: 'Bedroom 1, primary suite', beds: '1 king bed, 1 air mattress' },
      { room: 'Bedroom 2', beds: '1 queen bed' },
      { room: 'Bedroom 3, 1st floor', beds: '1 queen bed' },
      { room: 'Bedroom 4', beds: '2 single beds' },
      { room: 'Living room', beds: 'Sleeper sectional, 1 air mattress' },
      { room: 'Loft, 2nd floor', beds: '1 sofa bed, 1 air mattress' },
    ],
    extraSleeping: 'Air mattresses are available for larger groups, within the 14-guest maximum.',
    amenities: [
      { group: 'Outdoors', items: ['Private 6-person hot tub', 'BBQ grill', 'Fenced backyard', 'Outdoor seating', 'Cactus and succulent garden', 'Ring toss'] },
      { group: 'Living', items: ['75-inch TV', 'Pool table', 'Loft with Smart TV', 'Board games and puzzles', 'Nintendo Switch games', 'Wifi'] },
      { group: 'Kitchen', items: ['Stove, microwave and refrigerator', 'Dishwasher', 'Island with breakfast bar', 'Coffee maker', 'Rice cooker and blender', 'Spices and chopsticks', "Children's dinnerware"] },
      { group: 'Practical', items: ['Washer and dryer', 'Iron and drying rack', 'Toto bidets', 'Free driveway parking', 'Garage', 'EV charging (fee)', 'Pets allowed'] },
    ],
    goodToKnow: [
      'First-night hot tub availability is not guaranteed. After full servicing, reheating can take about 20 to 30 hours in winter, so message the host if it matters to you.',
      'EV charging and BBQ propane cost extra. Let the host know in advance if you need charging.',
      'Early check-in and late checkout may be available for a fee.',
      'Neighborhood dogs may bark from time to time.',
      'Yard maintenance happens regularly during the day.',
      'The neighborhood celebrates Halloween, so trick-or-treaters may knock on October 31.',
    ],
    faqs: [
      { question: 'How many people does the Luxury Family Home sleep?', answer: 'Up to 14 guests, in 4 bedrooms with 6 beds, plus air mattresses and sleeper sofas. There are 3 bathrooms.' },
      { question: 'What is the Luxury Family Home rated on Airbnb?', answer: `It is rated 4.91 out of 5 from 103 Airbnb reviews, as of ${factsCheckedOn}.` },
      { question: 'How far is the Luxury Family Home from the national parks?', answer: 'It is 35 miles to Sequoia National Park, 55 miles to Kings Canyon National Park, and about 3 hours to Yosemite National Park.' },
      { question: 'Are restaurants and grocery stores close to the Luxury Family Home?', answer: "Guests report grocery stores and quick-bite options nearby, plus gas stations and late-night restaurants such as Raising Cane's and In-N-Out about a 5-minute drive away." },
      { question: 'Does the Luxury Family Home have a hot tub?', answer: 'Yes, a private six-person hot tub. First-night availability is not guaranteed, because reheating after servicing can take about 20 to 30 hours in winter.' },
      { question: 'Does the Luxury Family Home allow pets?', answer: 'The Airbnb listing shows pets as allowed. Check the listing for the current pet policy and any fees before booking.' },
      { question: 'Does the Luxury Family Home have EV charging?', answer: 'Yes, in the garage, for an additional fee. Let the host know in advance so it can be activated.' },
    ],
    photos: [
      family('living-room-1', 'Sunlit living room with a tan leather sectional at the Luxury Family Home in Visalia'),
      family('backyard-1', 'Backyard at dusk with string lights, umbrella table and BBQ grill'),
      family('pool-table', 'Pool table in the game room'),
      family('primary-bedroom-1', 'Primary bedroom with a king bed and soft morning light'),
      family('kitchen-1', 'Kitchen with an island and breakfast bar'),
      family('backyard-2', 'Backyard oasis with seating and ambient lighting'),
      family('backyard-3', 'Covered hot tub on a wood deck beside a fence with string lights at dusk'),
      family('backyard-5', 'Umbrella picnic table on a gravel circle in the fenced backyard'),
      family('backyard-4', 'Fenced backyard with turf and an umbrella table'),
      family('cactus-garden', 'Cactus garden in the backyard'),
      family('bbq', 'BBQ grill in the backyard'),
      family('living-room-2', 'Modern living room at the Luxury Family Home'),
      family('living-room-3', 'Living room seating and TV'),
      family('game-room-1', 'Game room at the Luxury Family Home'),
      family('loft-1', 'Second-floor loft with soft, neutral tones'),
      family('loft-games', 'Loft with board games, puzzles, Nintendo Switch games and a Smart TV'),
      family('cookware', 'Premium cookware sets'),
      family('dining', 'Dining area'),
      family('primary-bedroom-2', 'Primary bedroom at the Luxury Family Home'),
      family('bedroom-2', 'Bedroom 2 with a queen bed'),
      family('bedroom-3', 'First-floor bedroom with warm, earthy tones'),
      family('bedroom-4', 'Bedroom 4 with two single beds'),
      family('primary-bath', 'Primary bathroom with double sinks and a Toto bidet'),
      family('bathroom-2', 'Second-floor bathroom with a bathtub'),
      family('entry', 'Entryway at the Luxury Family Home'),
    ],
  },
];

export const getStay = (slug: string) => stays.find((stay) => stay.slug === slug);

export const maxGuests = Math.max(...stays.map((stay) => stay.guests));

export const siteFaqs: Faq[] = [
  {
    question: 'Where are SSHOME vacation homes located?',
    answer: 'All SSHOME homes are in Visalia, California, in Tulare County. The exact address is shared by Airbnb after booking.',
  },
  {
    question: 'How far is Visalia from Sequoia and Kings Canyon National Parks?',
    answer: 'The National Park Service lists about 1 hour from Visalia Municipal Airport to the Sequoia entrance on Highway 198, and about 1.5 hours to the Kings Canyon entrance. Roads beyond the entrances are narrow and winding, so allow extra time.',
  },
  {
    question: 'Which SSHOME home is best for a large group?',
    answer: `Both homes sleep up to ${maxGuests}. Choose the Desert Retreat for a private pool, fire pit and five bedrooms. Choose the Luxury Family Home for a game room, loft and 4.91-rated reviews.`,
  },
  {
    question: 'How do I book an SSHOME stay?',
    answer: 'All bookings are made on Airbnb, where you can see live availability, pricing, house rules and cancellation terms. Each home page links to its Airbnb listing.',
  },
  {
    question: 'Do SSHOME homes have EV charging?',
    answer: 'Yes, both homes offer EV charging for an additional fee. Contact the host in advance to arrange it.',
  },
];
