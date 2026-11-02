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
  rules: { checkIn: string; checkOut: string; checkInTime: string; checkOutTime: string; pets: string; items: string[] };
  amenities: { group: string; items: string[] }[];
  goodToKnow: string[];
  faqs: Faq[];
  heroPhoto?: string;
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
    heroPhoto: '/stays/desert-retreat/pool-baja-shelf.jpg',
    name: 'Desert Retreat',
    airbnbId: '1800164576342497106',
    airbnbTitle: 'Desert Retreat near Sequoia | Pool, hot tub & EV',
    tagline: 'A private pool, a fire pit, and five bedrooms for the whole group.',
    metaTitle: '5-Bedroom Visalia Rental for 14 with Pool | SSHOME',
    metaDescription:
      'Entire 5-bedroom Visalia, CA home sleeping 14, with a private pool, hot tub, fire pit and EV charging. A base for Sequoia National Park. Book on Airbnb.',
    bestFor: 'Groups who want a pool and a backyard to come home to',
    lead: 'Make room for shared meals, time by the pool and evenings outside. This five-bedroom Visalia home is designed for groups who want to spend time together between park days.',
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
      outdoor: 'Private fenced pool, hot tub, fire pit, BBQ, covered patio, lawn games',
      indoor: '98-inch TV, Nex Playground motion games',
      work: 'Desk, chair, monitor and lamp in Bedroom 2',
      parking: '2 driveway spaces, street parking, EV charging for a fee',
    },
    highlights: [
      {
        title: 'Private fenced pool with a lounging shelf',
        body: 'A shallow Baja shelf with in-water loungers, lit after dark.',
      },
      {
        title: 'Hot tub and fire pit',
        body: 'A soak after a park day, plus Adirondack chairs around a fire pit for evenings under the stars.',
      },
      {
        title: 'A kitchen built for big meals',
        body: 'Everything you need to cook for the whole group, down to the kid-friendly dinnerware.',
      },
      {
        title: 'Play and work, both covered',
        body: 'Motion games for the family, and a dedicated workspace when someone needs to log in.',
      },
    ],
    sleeping: [
      { room: 'Bedroom 1, 2nd floor', beds: '1 king bed' },
      { room: 'Bedroom 2, 1st floor', beds: '1 queen bed' },
      { room: 'Bedroom 3, 2nd floor', beds: '1 queen bed' },
      { room: 'Bedroom 4, 2nd floor', beds: '1 queen bed' },
      { room: 'Bedroom 5, 2nd floor', beds: '2 twin beds' },
    ],
    extraSleeping: 'Sleeps 14: 1 king, 3 queens and 2 twin beds in five bedrooms sleep 10; 1 queen air mattress and 2 twin air mattresses sleep 4 more.',
    rules: {
      checkIn: '4:00 PM',
      checkOut: '10:00 AM',
      checkInTime: '16:00',
      checkOutTime: '10:00',
      pets: 'Up to 3 pets allowed. Assistance animals are always allowed. Check Airbnb for any pet fee.',
      items: ['No parties or events', 'No smoking, including vaping and e-cigarettes', 'Quiet hours from 9:00 PM to 8:00 AM', 'No commercial photography or filming'],
    },
    amenities: [
      { group: 'Outdoors', items: ['Private pool (not heated)', 'Hot tub', 'BBQ grill', 'Fire pit with seating', 'Covered patio', 'Outdoor dining area', 'Turf area with cornhole'] },
      { group: 'Living', items: ['98-inch TV', 'Smart TV in every bedroom', 'Nex Playground', 'Dining table and kitchen island', 'Wifi'] },
      { group: 'Kitchen', items: ['HexClad cookware', 'Instant Pot', 'Blender', 'Electric kettle', 'Brita pitcher', 'K-Cup and drip coffee maker', 'Kid-friendly dinnerware'] },
      { group: 'Practical', items: ['Washer and dryer in a second-floor laundry room', 'Detergent and dryer sheets', 'Iron and drying rack', 'Toto bidet in every bathroom', 'Air conditioning and heating', 'Self check-in with smart lock', 'Free driveway parking for 2 cars', 'Free street parking', 'EV charger (fee)'] },
    ],
    goodToKnow: [
      'Families: the pool has its own fence with two self-closing, self-latching gates, and the latches are out of young children’s reach. The hot tub is outside the pool fence, with a heavy cover that does not lock. The backyard opens from a sliding glass door and is not fully fenced, so children must be supervised at all times.',
      'Exterior security cameras cover the area above the garage, the yard (fire pit, pool and lawn) and the front door. There are no cameras inside the home.',
      'The home has stairs.',
      'First-night hot tub availability is not guaranteed. After a full water change, reheating can take about 20 to 30 hours in winter, so message the host before booking if it matters to you.',
      'The home is in a developing neighborhood, and nearby construction may cause daytime noise.',
      'Routine yard maintenance happens during the day, and staff may access outdoor areas.',
      'BBQ propane costs extra. Early check-in and late checkout may be available for a fee.',
      'Please bring your own K-Cup pods.',
      'The neighborhood celebrates Halloween, so trick-or-treaters may knock on October 31.',
    ],
    faqs: [
      { question: 'How many people does the Desert Retreat sleep?', answer: 'Up to 14 guests: 10 in the five bedrooms and 4 on the air mattresses.' },
      { question: 'How big is the Desert Retreat pool, and is it heated?', answer: 'The private pool is about 15 by 33 feet and is not heated. The separate hot tub can be heated.' },
      { question: 'Does the Desert Retreat have EV charging?', answer: 'Yes, a Level 2 Tesla charger is available for an additional fee. Contact the host in advance for pricing and arrangements.' },
      { question: 'Can I work remotely from the Desert Retreat?', answer: 'Yes. Bedroom 2 has a desk, chair, monitor and lamp, and the home has Wifi.' },
    ],
    photos: [
      desert('pool-1', 'Private pool glowing at sunset behind the two-story Desert Retreat home in Visalia', 'Pool'),
      desert('living-room-1', 'Living room with a green velvet sofa, gallery wall and 98-inch TV', 'Living room'),
      desert('pool-4', 'In-water loungers on the shallow Baja shelf of the private pool', 'Pool'),
      desert('backyard-3', 'Fire pit circled by Adirondack chairs in the desert-landscaped backyard', 'Backyard & patio'),
      desert('kitchen-1', 'Fully equipped kitchen at the Desert Retreat', 'Kitchen'),
      desert('pool-baja-shelf', 'Daylight view of the private pool, in-water loungers and two-story Desert Retreat home in Visalia', 'Pool'),
      desert('pool-3', 'Private pool and backyard at the Desert Retreat', 'Pool'),
      desert('pool-5', 'Private pool and patio at the Desert Retreat', 'Pool'),
      desert('hot-tub-1', 'Private hot tub in the backyard', 'Hot tub'),
      desert('hot-tub-2', 'Hot tub and seating in the backyard', 'Hot tub'),
      desert('backyard-1', 'Fire pit lit at dusk with chairs and landscape lighting', 'Backyard & patio'),
      desert('backyard-2', 'Round fire pit with Adirondack chairs at dusk', 'Backyard & patio'),
      desert('backyard-4', 'Patio dining table under an umbrella at dusk', 'Backyard & patio'),
      desert('turf-cornhole', 'Artificial turf area with cornhole boards', 'Backyard & patio'),
      desert('patio-dining', 'Patio dining table under an umbrella, with the hot tub and BBQ grill', 'Backyard & patio'),
      desert('covered-patio', 'Covered patio chairs beside the lawn and cornhole boards', 'Backyard & patio'),
      desert('backyard-night', 'Landscape lighting along the backyard at night', 'Backyard & patio'),
      desert('living-room-2', 'Living room seating at the Desert Retreat', 'Living room'),
      desert('nex-playground', 'Nex Playground with interactive, motion-controlled games', 'Living room'),
      desert('living-room-3', 'Green velvet sofa and coffee table beneath a framed gallery wall', 'Living room'),
      desert('kitchen-fire-pit-view', 'Kitchen window overlooking the backyard fire pit', 'Kitchen'),
      desert('kitchen-2', 'Kitchen with wood cabinets, stainless appliances and a bar-height island', 'Kitchen'),
      desert('kitchen-3', 'Kitchen with glass-front cabinets, dishes and open drawers', 'Kitchen'),
      desert('pantry', 'Pantry with an Instant Pot, blender, electric kettle, fire safety supplies, first aid kit and air mattresses', 'Kitchen'),
      desert('dining', 'Dining area at the Desert Retreat', 'Dining area'),
      desert('bedroom-1', 'Bedroom 1 with a king bed', 'Bedroom 1'),
      desert('bedroom-1-2', 'Bedroom 1 king bed with layered pillows and abstract art', 'Bedroom 1'),
      desert('bedroom-2', 'Bedroom 2 with a queen bed', 'Bedroom 2'),
      desert('bedroom-2-2', 'Bedroom 2 queen bed with an iron frame and green throw', 'Bedroom 2'),
      desert('bedroom-2-3', 'Bedroom 2 queen bed with framed art and matching lamps', 'Bedroom 2'),
      desert('bedroom-3', 'Bedroom 3 with a queen bed', 'Bedroom 3'),
      desert('bedroom-3-2', 'Bedroom 3 queen bed with a wood headboard and matching nightstands', 'Bedroom 3'),
      desert('bedroom-3-3', 'Close view of the Bedroom 3 queen bed and pillows', 'Bedroom 3'),
      desert('bedroom-4', 'Bedroom 4 with a queen bed', 'Bedroom 4'),
      desert('bedroom-4-2', 'Bedroom 4 queen bed with patterned pillows and framed portraits', 'Bedroom 4'),
      desert('bedroom-5', 'Bedroom 5 with two twin beds', 'Bedroom 5'),
      desert('bedroom-5-2', 'Bedroom 5 twin beds with a shared nightstand', 'Bedroom 5'),
      desert('bedroom-5-rocking-sheep', 'Rocking sheep for little ones in Bedroom 5', 'Bedroom 5'),
      desert('bathroom-1', 'Full bathroom at the Desert Retreat', 'Bathroom 1'),
      desert('bathroom-1-2', 'Full bathroom 1 with a double vanity', 'Bathroom 1'),
      desert('bathroom-1-3', 'Full bathroom 1 double sinks with towels and a large mirror', 'Bathroom 1'),
      desert('bathroom-2', 'Full bathroom 2 with a shower and tub, sink and toiletries', 'Bathroom 2'),
      desert('bathroom-3', 'Full bathroom 3 with a sink, towels and toilet', 'Bathroom 3'),
      desert('bathroom-3-2', 'Full bathroom 3 shower and tub with toiletries', 'Bathroom 3'),
      desert('laundry', 'Upstairs laundry room with washer, dryer, iron and ironing board', 'Laundry room'),
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
    lead: 'A four-bedroom Visalia home with separate spaces to play, unwind and spend time together. A good fit for families who want an evening at home after exploring the parks.',
    guests: 14,
    bedrooms: 4,
    beds: 5,
    bedSummary: '5 bedroom beds + 1 sofa bed + 1 couch + 3 air mattresses',
    summaryZh: '四房、五張臥室床、三間衛浴，附撞球桌、閣樓與熱水池；沒有泳池。臥室有一張 King、兩張 Queen 及兩張 Twin，可睡 8 人；另有沙發床、沙發及三張氣墊床，最多可住 14 人。車道可停兩台車，部分車庫已改為遊戲室。',
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
        body: "A kids' room, plus children's plates and utensils in the kitchen.",
      },
      {
        title: 'Easy everyday shopping',
        body: 'Target is less than a five-minute drive away, according to the owners’ local driving estimate. Actual travel time varies with traffic.',
      },
    ],
    sleeping: [
      { room: 'Bedroom 1, primary suite', beds: '1 king bed, 1 air mattress' },
      { room: 'Bedroom 2', beds: '1 queen bed' },
      { room: 'Bedroom 3, 1st floor', beds: '1 queen bed' },
      { room: 'Bedroom 4', beds: '2 single beds' },
      { room: 'Living room', beds: '1 couch, 1 air mattress' },
      { room: 'Loft, 2nd floor', beds: '1 sofa bed, 1 air mattress' },
    ],
    extraSleeping: 'Air mattress sizes are not listed, so confirm them with the host on Airbnb if needed.',
    rules: {
      checkIn: '4:00 PM',
      checkOut: '10:00 AM',
      checkInTime: '16:00',
      checkOutTime: '10:00',
      pets: 'Up to 3 pets allowed, with a $75 fee per pet, per stay. Unapproved pets may incur a fee of at least $150. Assistance animals are always allowed.',
      items: ['No parties or events', 'No smoking, including vaping and e-cigarettes', 'Quiet hours from 9:00 PM to 8:00 AM'],
    },
    amenities: [
      { group: 'Outdoors', items: ['Private 6-person hot tub', 'BBQ grill', 'Fully fenced backyard', 'Outdoor seating', 'Cactus and succulent garden', 'Ring toss'] },
      { group: 'Living', items: ['75-inch TV', 'Pool table', 'Loft with Smart TV', 'Board games and puzzles', 'Nintendo Switch games', 'Wifi'] },
      { group: 'Kitchen', items: ['Stove, microwave and refrigerator', 'Dishwasher', 'Island with breakfast bar', 'Drip and Keurig coffee makers', 'Rice cooker and blender', 'Spices and chopsticks', "Children's dinnerware"] },
      { group: 'Practical', items: ['Washer and dryer in a second-floor laundry room', 'Iron and drying rack', 'Toto bidet in every bathroom', 'Central air and heating', 'Self check-in with smart lock', 'Free driveway parking for 2 cars', 'Free street parking', 'EV charger (fee)'] },
    ],
    goodToKnow: [
      'Exterior security cameras cover the area above the garage, the yard (including the hot tub) and the front door.',
      'Keep the hot tub lid covered when it is not in use. The home has stairs.',
      'First-night hot tub availability is not guaranteed. After full servicing, reheating can take about 20 to 30 hours in winter, so message the host if it matters to you.',
      'BBQ propane costs extra. Early check-in and late checkout may be available for a fee.',
      'Neighborhood dogs may bark from time to time.',
      'Yard maintenance happens regularly during the day.',
      'The neighborhood celebrates Halloween, so trick-or-treaters may knock on October 31.',
    ],
    faqs: [
      { question: 'What are the Luxury Family Home sleeping arrangements?', answer: 'Up to 14 overnight guests, using the bedroom beds, sofa bed, couch and air mattresses.' },
      { question: 'Are restaurants and grocery stores close to the Luxury Family Home?', answer: "Guests report grocery stores and quick-bite options nearby, plus gas stations and late-night restaurants such as Raising Cane's and In-N-Out about a 5-minute drive away." },
      { question: 'Does the Luxury Family Home have EV charging?', answer: 'Yes, a Level 2 Tesla-only charger in the garage, for an additional fee. Let the host know in advance so it can be activated.' },
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
      family('ring-toss', 'Ring toss game on the backyard turf', 'Backyard & patio'),
      family('backyard-grill', 'Backyard with a BBQ grill, turf and covered hot tub', 'Backyard & patio'),
      family('backyard-string-lights', 'Backyard at dusk with string lights and an umbrella table', 'Backyard & patio'),
      family('living-room-2', 'Modern living room at the Luxury Family Home', 'Living room'),
      family('living-room-3', 'Tan leather sectional beneath a large framed print', 'Living room'),
      family('living-room-4', 'Leather sectional and coffee table facing the wall-mounted TV', 'Living room'),
      family('living-room-5', 'Styled coffee table in front of the leather sectional', 'Living room'),
      family('game-room-1', 'Game room at the Luxury Family Home', 'Game room'),
      family('pool-table-2', 'Pool table with bar-height seating and a neon sign in the game room', 'Game room'),
      family('neon-sign', 'Neon sign reading Come in, we are open, in the game room', 'Game room'),
      family('loft-1', 'Second-floor loft with soft, neutral tones', 'Loft'),
      family('loft-games', 'Loft with board games, puzzles, Nintendo Switch games and a Smart TV', 'Loft'),
      family('loft-2', 'Loft with a sleeper sofa, nearby windows and paper lantern light', 'Loft'),
      family('loft-sleeper-sofa', 'Loft sleeper sofa', 'Loft'),
      family('loft-3', 'Loft sofa and round side table with flowers', 'Loft'),
      family('loft-lantern', 'Paper lantern light in the loft', 'Loft'),
      family('cookware', 'Premium cookware sets', 'Kitchen'),
      family('kitchen-2', 'Kitchen with stainless appliances, open cabinets and a white countertop', 'Kitchen'),
      family('coffee-maker', 'Drip coffee maker on the kitchen counter', 'Kitchen'),
      family('coffee-station', 'Coffee station with a coffee maker, cream and sugar', 'Kitchen'),
      family('toaster-kettle', 'Toaster and water kettle', 'Kitchen'),
      family('blender-rice-cooker', 'Blender and rice cooker', 'Kitchen'),
      family('childrens-dinnerware', 'Plates, child-friendly dinnerware and food storage containers', 'Kitchen'),
      family('dinnerware', 'Plates and bowls in a kitchen cabinet', 'Kitchen'),
      family('cups', 'Cups and mugs in a kitchen cabinet', 'Kitchen'),
      family('cutlery', 'Cutlery drawers with spices, children’s cutlery and chopsticks', 'Kitchen'),
      family('utensils', 'Gas range with a complete set of cooking utensils and knives', 'Kitchen'),
      family('oven-gloves', 'Kitchen drawers with heat pads and oven gloves', 'Kitchen'),
      family('mixing-bowls', 'Mixing bowls and measuring cup set', 'Kitchen'),
      family('colander', 'Chopping board set and a colander', 'Kitchen'),
      family('first-aid-kit', 'First aid kit', 'Kitchen'),
      family('cleaning-supplies', 'Additional trash bags and cleaning products', 'Kitchen'),
      family('dining', 'Dining area', 'Dining area'),
      family('dining-2', 'Wood dining table and chairs with the kitchen beyond', 'Dining area'),
      family('primary-bedroom-2', 'Primary bedroom at the Luxury Family Home', 'Bedroom 1'),
      family('primary-bedroom-3', 'Primary bedroom king bed beneath a black chandelier', 'Bedroom 1'),
      family('primary-bedroom-tv', 'Primary bedroom TV console and chandelier', 'Bedroom 1'),
      family('primary-bedroom-4', 'Primary bedroom nightstand, lamp and framed photos', 'Bedroom 1'),
      family('bedroom-2', 'Bedroom 2 with a queen bed', 'Bedroom 2'),
      family('bedroom-2-2', 'Bedroom 2 queen bed with an iron frame and lamps', 'Bedroom 2'),
      family('bedroom-2-3', 'Bedroom 2 with a queen bed and window', 'Bedroom 2'),
      family('bedroom-3', 'First-floor bedroom with warm, earthy tones', 'Bedroom 3'),
      family('bedroom-3-2', 'First-floor bedroom with a queen bed and earthy bedding', 'Bedroom 3'),
      family('bedroom-4', 'Bedroom 4 with two single beds', 'Bedroom 4'),
      family('bedroom-4-2', 'Bedroom 4 single beds beneath a window', 'Bedroom 4'),
      family('bedroom-4-woodland-wall', 'Woodland wall decals and framed art in Bedroom 4', 'Bedroom 4'),
      family('primary-bath', 'Primary bathroom with double sinks and a Toto bidet', 'Bathroom 1'),
      family('primary-bath-2', 'Primary bathroom with a glass shower, built-in bench and Toto bidet', 'Bathroom 1'),
      family('bathroom-2', 'Second-floor bathroom with a bathtub', 'Bathroom 2'),
      family('bathroom-2-tub', 'Second-floor bathroom with a bathtub, shower and towels', 'Bathroom 2'),
      family('bathroom-3', 'First-floor bathroom with a shower, sink and Toto bidet', 'Bathroom 3'),
      family('laundry', 'Washer and dryer with an iron and ironing board', 'Laundry room'),
      family('laundry-2', 'Laundry room with a washer, dryer and drying rack', 'Laundry room'),
      family('entry', 'Entryway at the Luxury Family Home', 'Entrance'),
      family('entry-art', 'Framed art in the entry hallway', 'Entrance'),
      family('stairs', 'Entry stairs with a lantern', 'Entrance'),
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
    answer: 'Both homes sleep up to 14 and have three bathrooms. Desert Retreat has five bedrooms with 1 king, 3 queens and 2 twin beds sleeping 10, plus 1 queen and 2 twin air mattresses sleeping 4. Luxury Family Home has four bedrooms with 1 king, 2 queens and 2 twin beds sleeping 8, plus a sofa bed, a couch and 3 air mattresses. Review every sleeping space before booking; the maximum includes additional sleeping arrangements.',
  },
  {
    question: 'Are EV charging and BBQ propane included?',
    answer: 'EV charging and BBQ propane cost extra at both homes. Both have a Level 2 Tesla charger, and the Luxury Family Home charger is Tesla only. Ask the host on Airbnb for current fees and arrangements. Live nightly prices, availability and cancellation terms are on Airbnb.',
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
    question: 'How do I book an SSHOME stay?',
    answer: 'All bookings are made on Airbnb, where you can see live availability, pricing, house rules and cancellation terms. Each home page links to its Airbnb listing.',
  },
  {
    question: 'What are the check-in and checkout times at SSHOME homes?',
    answer: 'Check-in is at 4:00 PM and checkout is at 10:00 AM at both homes. Early check-in or late checkout may be available for a fee, subject to availability.',
  },
];

export const getHeroPhoto = (stay: Stay): Photo => stay.photos.find((photo) => photo.src === stay.heroPhoto) ?? stay.photos[0];
