export type Photo = { src: string; alt: string; space: string };

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
  guests: number;
  bedrooms: number;
  beds: number; // Permanent bedroom beds; excludes sofa beds and air mattresses.
  bedSummary: string;
  summaryZh: string;
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

const photo = (folder: string) => (file: string, alt: string, space: string): Photo => ({
  src: `/stays/${folder}/${file}.jpg`,
  alt,
  space,
});

const desert = photo('desert-retreat');
const family = photo('luxury-family-home');

const familyRating = {
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
    };

export const stays: Stay[] = [
  {
    slug: 'desert-retreat-pool-hot-tub-visalia',
    name: 'Desert Retreat',
    airbnbId: '1800164576342497106',
    airbnbTitle: 'Desert Retreat near Sequoia | Pool, hot tub & EV',
    tagline: 'A private pool, a fire pit, and five bedrooms for the whole group.',
    metaTitle: '5-Bedroom Visalia Rental for 14 with Pool | SSHOME',
    metaDescription:
      'Entire 5-bedroom home in Visalia, CA sleeping 14, with a private pool, hot tub, fire pit and EV charging, a Visalia base for Sequoia National Park. Book on Airbnb.',
    bestFor: 'Groups who want a pool and a backyard to come home to',
    lead: 'A desert-inspired home in Visalia with a private pool, a separate hot tub and a fire pit circle out back. Inside, there is a 98-inch TV for movie night, a kitchen with HexClad cookware, and a Smart TV in each of the five bedrooms.',
    guests: 14,
    bedrooms: 5,
    beds: 6,
    bedSummary: '6 bedroom beds + 1 queen and 2 twin air mattresses',
    summaryZh: '五房、六張臥室床、三間衛浴，附私人不加熱泳池、熱水池與火坑。臥室有一張 King、三張 Queen 及兩張 Twin，可睡 10 人；另有一張 Queen 氣墊床和兩張 Twin 氣墊床，可再睡 4 人，合計 14 人。',
    baths: 3,
    rating: null,
    reviewNote: 'New on Airbnb',
    reviews: [
      {
        initial: 'Y.',
        date: '2026-10',
        dateLabel: 'October 2026',
        context: 'Group trip',
        rating: 5,
        text: "We couldn't have asked for a better setup for our group trip to Sequoia and Kings Canyon National Parks. Great location: the drive to both park entrances is straightforward, and the property delivers true boutique luxury. Everything is brand-new and thoughtfully curated, having Washlets in every bathroom made mornings with a full crew seamless, and the kitchen had every tool we needed, even spices. The backyard is a dream: we spent our evening grilling on the BBQ, dining outside, and lounging by the huge pool after a full day exploring the giant sequoias. An exceptional host with impeccable taste. This is one of the most beautiful homes we've ever stayed in!",
      },
      {
        initial: 'A.',
        date: '2026-10',
        dateLabel: 'October 2026',
        context: 'Group trip',
        rating: 5,
        text: 'We absolutely loved our stay! The location is perfect for visiting Sequoia National Park, and we stayed here for one night before heading to the park. The house is brand new, beautiful, and feels like a five star resort! The nearly 30 foot pool is stunning, especially at night with the lights on. The in pool loungers and hot tub made it even better. Soaking in the water with my friends while enjoying a few beers was such a treat! The backyard also has cornhole, a fire pit, and a gas grill, perfect for spending a fun evening together. Inside, the modern design is gorgeous, and the playground and TV games were great for the kids. Honestly, none of us wanted to leave, including the adults! This home has everything you need for a relaxing and memorable getaway. We would absolutely love to come back and highly recommend it!',
      },
    ],
    compare: {
      outdoor: 'Private pool, hot tub, fire pit, BBQ, covered patio, lawn games',
      indoor: '98-inch TV, Nex Playground motion games',
      work: 'Desk, chair, monitor and lamp in Bedroom 2',
      parking: '2 driveway spaces, street parking, EV charging for a fee',
    },
    highlights: [
      {
        title: 'Private pool with a lounging shelf',
        body: 'About 15 by 33 feet, with a shallow Baja shelf and in-water loungers, lit after dark. The pool is not heated.',
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
    extraSleeping: 'Sleeps 14: 1 king, 3 queens and 2 twin beds in five bedrooms sleep 10; 1 queen air mattress and 2 twin air mattresses sleep 4 more.',
    amenities: [
      { group: 'Outdoors', items: ['Private pool, about 15 x 33 ft (not heated)', 'Hot tub (can be heated)', 'BBQ grill', 'Fire pit with seating', 'Covered patio', 'Outdoor dining area', 'Turf area with cornhole'] },
      { group: 'Living', items: ['98-inch TV', 'Smart TV in every bedroom', 'Nex Playground', 'Dining table and kitchen island', 'Wifi'] },
      { group: 'Kitchen', items: ['HexClad cookware', 'Instant Pot', 'Blender', 'Electric kettle', 'Brita pitcher', 'K-Cup and drip coffee maker', 'Kid-friendly dinnerware'] },
      { group: 'Practical', items: ['Washer and dryer', 'Detergent and dryer sheets', 'Iron and drying rack', 'Toto bidet in every bathroom', 'Self check-in with smart lock', 'Free driveway parking', 'EV charging (fee)'] },
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
      { question: 'How many people does the Desert Retreat sleep?', answer: 'Up to 14 guests: five bedrooms have 1 king bed, 3 queen beds and a kids’ room with 2 twin beds, sleeping 10. One queen air mattress sleeps 2 and two twin air mattresses sleep 1 each. There are 3 bathrooms.' },
      { question: 'How big is the pool at the Desert Retreat?', answer: 'The private pool is about 15 by 33 feet, with a shallow Baja shelf and in-water loungers.' },
      { question: 'Is the pool at the Desert Retreat heated?', answer: 'No, the pool is not heated. The separate hot tub can be heated, but first-night availability is not guaranteed.' },
      { question: 'How far is the Desert Retreat from Sequoia National Park?', answer: 'The home is in Visalia. NPS estimates about 1 hour from Visalia Municipal Airport to Sequoia’s Ash Mountain Entrance, not from this home to the giant sequoia groves. Allow extra time for park roads, traffic, parking and walking.' },
      { question: 'Does the Desert Retreat have EV charging?', answer: 'Yes, for an additional fee. Contact the host in advance for pricing and arrangements.' },
      { question: 'Can I work remotely from the Desert Retreat?', answer: 'Yes. Bedroom 2 has a desk, chair, monitor and lamp, and the home has Wifi. Nearby construction may cause daytime noise.' },
    ],
    photos: [
      desert('pool-1', 'Private pool glowing at sunset behind the two-story Desert Retreat home in Visalia', 'Pool'),
      desert('living-room-1', 'Living room with a green velvet sofa, gallery wall and 98-inch TV', 'Living room'),
      desert('pool-4', 'In-water loungers on the shallow Baja shelf of the private pool', 'Pool'),
      desert('backyard-3', 'Fire pit circled by Adirondack chairs in the desert-landscaped backyard', 'Backyard & patio'),
      desert('kitchen-1', 'Fully equipped kitchen at the Desert Retreat', 'Kitchen'),
      desert('pool-baja-shelf', 'Private outdoor pool with a Baja shelf and in-water loungers', 'Pool'),
      desert('pool-3', 'Private pool and backyard at the Desert Retreat', 'Pool'),
      desert('pool-5', 'Private pool and patio at the Desert Retreat', 'Pool'),
      desert('hot-tub-1', 'Private hot tub in the backyard', 'Hot tub'),
      desert('hot-tub-2', 'Hot tub and seating in the backyard', 'Hot tub'),
      desert('backyard-1', 'Backyard and outdoor living area', 'Backyard & patio'),
      desert('backyard-2', 'Backyard seating at the Desert Retreat', 'Backyard & patio'),
      desert('backyard-4', 'Backyard detail at the Desert Retreat', 'Backyard & patio'),
      desert('turf-cornhole', 'Artificial turf area with cornhole boards', 'Backyard & patio'),
      desert('living-room-2', 'Living room seating at the Desert Retreat', 'Living room'),
      desert('nex-playground', 'Nex Playground with interactive, motion-controlled games', 'Living room'),
      desert('kitchen-fire-pit-view', 'Kitchen window overlooking the backyard fire pit', 'Kitchen'),
      desert('dining', 'Dining area at the Desert Retreat', 'Dining area'),
      desert('bedroom-1', 'Bedroom 1 with a king bed', 'Bedroom 1'),
      desert('bedroom-2', 'Bedroom 2 with a queen bed', 'Bedroom 2'),
      desert('bedroom-3', 'Bedroom 3 with a queen bed', 'Bedroom 3'),
      desert('bedroom-4', 'Bedroom 4 with a queen bed', 'Bedroom 4'),
      desert('bedroom-5', 'Bedroom 5 with two twin beds', 'Bedroom 5'),
      desert('bathroom-1', 'Full bathroom at the Desert Retreat', 'Bathroom 1'),
      desert('workspace', 'Dedicated workspace with desk and monitor', 'Workspace'),
      desert('ev-charging', 'EV charger, available for an additional fee', 'EV charging'),
    ],
  },
  {
    slug: 'luxury-family-home-hot-tub-game-room-visalia',
    name: 'Luxury Family Home',
    airbnbId: '1291019377672253246',
    airbnbTitle: 'Luxury family home | Hot Tub | EV | BBQ',
    tagline: 'A game room, a loft, and a hot tub under string lights.',
    metaTitle: 'Visalia Family Rental for 14 near Sequoia | SSHOME',
    metaDescription:
      'Four-bedroom Visalia vacation home for up to 14 with a hot tub, pool table, loft, Wi-Fi and EV charging. Explore Sequoia and book on Airbnb.',
    bestFor: 'Families and groups who want rainy-day space and proven reviews',
    lead: 'A warm, modern family home with a pool table in the game room, a second-floor loft stocked with board games, and a six-person hot tub out back. Use Visalia as your base for Sequoia and Kings Canyon; allow additional driving time beyond the park entrances.',
    guests: 14,
    bedrooms: 4,
    beds: 5,
    bedSummary: '5 bedroom beds + 1 double sofa bed + 2 queen air mattresses',
    summaryZh: '四房、五張臥室床、三間衛浴，附撞球桌、閣樓與熱水池；沒有泳池。臥室有一張 King、兩張 Queen 及兩張 Twin，可睡 8 人；另有一張雙人沙發床和兩張 Queen 氣墊床，可再睡 6 人，合計 14 人。車道可停兩台車，部分車庫已改為遊戲室。',
    baths: 3,
    rating: familyRating,
    reviewNote: `${familyRating.value} from ${familyRating.count} Airbnb reviews`,
    reviews: [
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
      work: 'Wi-Fi; no dedicated workspace',
      parking: '2 driveway spaces, street parking, EV charging for a fee',
    },
    highlights: [
      {
        title: 'Game room with a pool table',
        body: 'Part of the two-car garage has been converted into a game room with a pool table for family nights and friendly competition.',
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
      {
        title: 'Easy everyday shopping',
        body: 'Target is less than a five-minute drive away, according to the owners’ local driving estimate. Actual travel time varies with traffic.',
      },
    ],
    sleeping: [
      { room: 'Bedroom 1, primary suite', beds: '1 king bed (sleeps 2)' },
      { room: 'Bedroom 2', beds: '1 queen bed' },
      { room: 'Bedroom 3, 1st floor', beds: '1 queen bed' },
      { room: 'Bedroom 4', beds: '2 single beds' },
      { room: 'Additional sleeping', beds: '1 sofa bed (sleeps 2), 2 queen air mattresses (sleep 2 each)' },
    ],
    extraSleeping: 'Sleeps 14: 1 king, 2 queens and 2 twin beds in four bedrooms sleep 8; 1 sofa bed sleeps 2 and 2 queen air mattresses sleep 4 more.',
    amenities: [
      { group: 'Outdoors', items: ['Private 6-person hot tub', 'BBQ grill', 'Fenced backyard', 'Outdoor seating', 'Cactus and succulent garden', 'Ring toss'] },
      { group: 'Living', items: ['75-inch TV', 'Pool table', 'Loft with Smart TV', 'Board games and puzzles', 'Nintendo Switch games', 'Wifi'] },
      { group: 'Kitchen', items: ['Stove, microwave and refrigerator', 'Dishwasher', 'Island with breakfast bar', 'Coffee maker', 'Rice cooker and blender', 'Spices and chopsticks', "Children's dinnerware"] },
      { group: 'Practical', items: ['Washer and dryer', 'Iron and drying rack', 'Toto bidet in every bathroom', 'Free driveway parking for 2 cars', 'EV charging (fee)', 'Pets allowed'] },
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
      { question: 'What are the Luxury Family Home sleeping arrangements?', answer: 'Up to 14 guests: four bedrooms have 1 king bed, 2 queen beds and 2 twin beds, sleeping 8. One sofa bed sleeps 2 and two queen air mattresses sleep 2 each, for 14 sleeping places in total. There are 3 bathrooms.' },
      { question: 'What is the Luxury Family Home rated on Airbnb?', answer: `It is rated ${familyRating.value} out of 5 from ${familyRating.count} Airbnb reviews, as of ${factsCheckedOn}.` },
      { question: 'How far is the Luxury Family Home from the national parks?', answer: 'NPS estimates about 1 hour from Visalia Municipal Airport to Sequoia’s Ash Mountain Entrance and about 1.5 hours to Kings Canyon’s Big Stump Entrance. These are airport-to-entrance references, not measured drives from the home or times to the main sights.' },
      { question: 'Are restaurants and grocery stores close to the Luxury Family Home?', answer: "Guests report grocery stores and quick-bite options nearby, plus gas stations and late-night restaurants such as Raising Cane's and In-N-Out about a 5-minute drive away." },
      { question: 'Does the Luxury Family Home have a hot tub?', answer: 'Yes, a private six-person hot tub. First-night availability is not guaranteed, because reheating after servicing can take about 20 to 30 hours in winter.' },
      { question: 'Does the Luxury Family Home allow pets?', answer: 'The Airbnb listing shows pets as allowed. Check the listing for the current pet policy and any fees before booking.' },
      { question: 'Does the Luxury Family Home have EV charging?', answer: 'Yes, in the garage, for an additional fee. Let the host know in advance so it can be activated.' },
    ],
    photos: [
      family('living-room-1', 'Sunlit living room with a tan leather sectional at the Luxury Family Home in Visalia', 'Living room'),
      family('backyard-1', 'Backyard at dusk with string lights, umbrella table and BBQ grill', 'Backyard & patio'),
      family('pool-table', 'Pool table in the game room', 'Game room'),
      family('primary-bedroom-1', 'Primary bedroom with a king bed and soft morning light', 'Bedroom 1'),
      family('kitchen-1', 'Kitchen with an island and breakfast bar', 'Kitchen'),
      family('backyard-2', 'Backyard oasis with seating and ambient lighting', 'Backyard & patio'),
      family('backyard-3', 'Covered hot tub on a wood deck beside a fence with string lights at dusk', 'Hot tub'),
      family('backyard-5', 'Umbrella picnic table on a gravel circle in the fenced backyard', 'Backyard & patio'),
      family('backyard-4', 'Fenced backyard with turf and an umbrella table', 'Backyard & patio'),
      family('cactus-garden', 'Cactus garden in the backyard', 'Backyard & patio'),
      family('bbq', 'BBQ grill in the backyard', 'Backyard & patio'),
      family('living-room-2', 'Modern living room at the Luxury Family Home', 'Living room'),
      family('living-room-3', 'Living room seating and TV', 'Living room'),
      family('game-room-1', 'Game room at the Luxury Family Home', 'Game room'),
      family('loft-1', 'Second-floor loft with soft, neutral tones', 'Loft'),
      family('loft-games', 'Loft with board games, puzzles, Nintendo Switch games and a Smart TV', 'Loft'),
      family('cookware', 'Premium cookware sets', 'Kitchen'),
      family('dining', 'Dining area', 'Dining area'),
      family('primary-bedroom-2', 'Primary bedroom at the Luxury Family Home', 'Bedroom 1'),
      family('bedroom-2', 'Bedroom 2 with a queen bed', 'Bedroom 2'),
      family('bedroom-3', 'First-floor bedroom with warm, earthy tones', 'Bedroom 3'),
      family('bedroom-4', 'Bedroom 4 with two single beds', 'Bedroom 4'),
      family('primary-bath', 'Primary bathroom with double sinks and a Toto bidet', 'Bathroom 1'),
      family('bathroom-2', 'Second-floor bathroom with a bathtub', 'Bathroom 2'),
      family('entry', 'Entryway at the Luxury Family Home', 'Entrance'),
    ],
  },
];

export const getStay = (slug: string) => stays.find((stay) => stay.slug === slug);

export const maxGuests = Math.max(...stays.map((stay) => stay.guests));

export const siteFaqs: Faq[] = [
  {
    question: 'Who owns and manages SSHOME?',
    answer: 'SSHOME is owned by Spencer and Sylvia. The management team includes Janson and Miyu. Contact the team through the relevant Airbnb listing.',
  },
  {
    question: 'Do both SSHOME homes have Wi-Fi and a workspace?',
    answer: 'Both homes have Wi-Fi. Only Desert Retreat has a dedicated workspace, with a desk, chair, monitor and lamp in Bedroom 2. Luxury Family Home does not have a dedicated workspace.',
  },
  {
    question: 'Which SSHOME home has a swimming pool?',
    answer: 'Only Desert Retreat has a private swimming pool, which is not heated. Both Desert Retreat and Luxury Family Home have a hot tub. First-night hot tub availability is not guaranteed; contact the host before booking if it is essential.',
  },
  {
    question: 'How should two families or 10 to 14 guests choose a home?',
    answer: 'Both homes sleep up to 14 and have three bathrooms. Desert Retreat has five bedrooms with 1 king, 3 queens and 2 twin beds sleeping 10, plus 1 queen and 2 twin air mattresses sleeping 4. Luxury Family Home has four bedrooms with 1 king, 2 queens and 2 twin beds sleeping 8, plus 1 sofa bed sleeping 2 and 2 queen air mattresses sleeping 4. Review every sleeping space before booking; the maximum includes additional sleeping arrangements.',
  },
  {
    question: 'Are EV charging and BBQ propane included?',
    answer: 'EV charging and BBQ propane cost extra at both homes. Ask the host on Airbnb for current fees and arrangements. Live nightly prices, availability and cancellation terms are on Airbnb.',
  },
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
    answer: `Both homes sleep up to ${maxGuests}. Choose the Desert Retreat for a private pool, fire pit and five bedrooms. Choose the Luxury Family Home for a pool table, loft and hot tub.`,
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
