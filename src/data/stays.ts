import trackingConfig from './tracking-config.json';

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

export const factsCheckedOn = '2026-11-18';

export const airbnbUrl = (stay: Stay) => `https://www.airbnb.com/rooms/${stay.airbnbId}`;

const photo = (folder: string) => (file: string, alt: string, space: string): Photo => ({
  src: `/stays/${folder}/${file}.jpg`,
  alt,
  space,
});

const desert = photo('desert-retreat');
const family = photo('luxury-family-home');
const sand = photo('sand-house');

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
    name: 'The Sage House',
    airbnbId: trackingConfig.listings.desert.id,
    airbnbTitle: 'The Sage House | Pool, hot tub, firepit, BBQ, EV',
    tagline: 'Poolside afternoons. Fireside evenings. Five bedrooms to settle into.',
    metaTitle: 'The Sage House | 5-Bedroom Visalia Pool Home | SSHOME',
    metaDescription:
      'A five-bedroom Visalia home for up to 14 with a private pool, hot tub, and fire pit. Add The Sand House next door for up to 28. Check dates on Airbnb.',
    bestFor: 'Families and groups looking for a private pool and outdoor space',
    lead: 'Pick up groceries, unpack, and let the afternoon unfold. There is room for cornhole on the lawn, dinner on the patio, and a movie on the 98-inch TV. With five bedrooms, a private pool, and a hot tub, this Visalia home gives your group plenty of reasons to linger. Up to 14 guests can stay, including those using the provided air mattresses.',
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
      parking: '3 driveway spaces plus nearby street parking; EV charging for a fee',
    },
    highlights: [
      {
        title: 'Your own pool, your own pace',
        body: 'Stretch out on the in-water loungers or cool off after a day out. The pool has a shallow Baja shelf and its own fence. It is not heated.',
      },
      {
        title: 'Save a seat by the fire',
        body: 'Pull up an Adirondack chair and catch up around the fire pit. There is a separate hot tub, too; check with the host if you are counting on a soak on your first night.',
      },
      {
        title: 'Breakfast before the trail. Dinner when you get back.',
        body: 'HexClad cookware, an Instant Pot, and dinnerware for the kids make eating in an easy part of the trip. Bring groceries and your favorite K-Cup pods.',
      },
      {
        title: 'A little screen time, your way',
        body: 'Get everyone moving with Nex Playground, settle in for a movie, or catch up on work at the desk and monitor in Bedroom 2.',
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
      { group: 'Living', items: ['98-inch TV', 'Smart TV in every bedroom', 'Nex Playground', 'Dining table and kitchen island', 'Wi-Fi'] },
      { group: 'Kitchen', items: ['HexClad cookware', 'Instant Pot', 'Blender', 'Electric kettle', 'Brita pitcher', 'K-Cup and drip coffee maker', 'Kid-friendly dinnerware'] },
      { group: 'Practical', items: ['Washer and dryer in a second-floor laundry room', 'Detergent and dryer sheets', 'Iron and drying rack', 'Toto bidet in every bathroom', 'Air conditioning and heating', 'Self check-in with smart lock', 'Free driveway parking for 3 cars', 'Nearby street parking', 'EV charger (fee)'] },
    ],
    goodToKnow: [
      'Families: the pool has its own fence with two self-closing, self-latching gates, and the latches are out of young children’s reach. The hot tub is outside the pool fence, with a heavy cover that does not lock. The backyard opens from a sliding glass door and is not fully fenced, so children must be supervised at all times.',
      'Exterior security cameras cover the area above the garage, the yard (fire pit, pool and lawn) and the front door. There are no cameras inside the home.',
      'The Sand House next door is a separate listing. When you book both, a backyard gate connects the two homes. Message the host about availability for both.',
      'The home has stairs.',
      'First-night hot tub availability is not guaranteed. After a full water change, reheating can take about 20 to 30 hours in winter, so message the host before booking if it matters to you.',
      'The home is in a developing neighborhood, and nearby construction may cause daytime noise.',
      'Routine yard maintenance happens during the day, and staff may access outdoor areas.',
      'BBQ propane costs extra. Early check-in and late checkout may be available for a fee.',
      'Please bring your own K-Cup pods.',
      'The neighborhood celebrates Halloween, so trick-or-treaters may knock on October 31.',
    ],
    faqs: [
      { question: 'How many people does The Sage House sleep?', answer: 'Up to 14 guests: 10 in the five bedrooms and 4 on the air mattresses.' },
      { question: 'How big is The Sage House pool, and is it heated?', answer: 'The private pool is about 15 by 33 feet and is not heated. The separate hot tub can be heated.' },
      { question: 'Does The Sage House have EV charging?', answer: 'Yes, a Level 2 Tesla charger is available for an additional fee. Contact the host in advance for pricing and arrangements.' },
      { question: 'Can I work remotely from The Sage House?', answer: 'Yes. Bedroom 2 has a desk, chair, monitor and lamp, and the home has Wifi.' },
    ],
    photos: [
      desert('pool-1', 'Private pool glowing at sunset behind the two-story home at The Sage House in Visalia', 'Pool'),
      desert('living-room-1', 'Living room with a green velvet sofa, gallery wall and 98-inch TV', 'Living room'),
      desert('pool-4', 'In-water loungers on the shallow Baja shelf of the private pool', 'Pool'),
      desert('backyard-3', 'Fire pit circled by Adirondack chairs in the desert-landscaped backyard', 'Backyard & patio'),
      desert('kitchen-1', 'Fully equipped kitchen at The Sage House', 'Kitchen'),
      desert('pool-baja-shelf', 'Daylight view of the private pool, in-water loungers and the two-story home at The Sage House in Visalia', 'Pool'),
      desert('pool-3', 'Private pool and backyard at The Sage House', 'Pool'),
      desert('pool-5', 'Private pool and patio at The Sage House', 'Pool'),
      desert('hot-tub-1', 'Private hot tub in the backyard', 'Hot tub'),
      desert('hot-tub-2', 'Hot tub and seating in the backyard', 'Hot tub'),
      desert('backyard-1', 'Fire pit lit at dusk with chairs and landscape lighting', 'Backyard & patio'),
      desert('backyard-2', 'Round fire pit with Adirondack chairs at dusk', 'Backyard & patio'),
      desert('backyard-4', 'Patio dining table under an umbrella at dusk', 'Backyard & patio'),
      desert('turf-cornhole', 'Artificial turf area with cornhole boards', 'Backyard & patio'),
      desert('patio-dining', 'Patio dining table under an umbrella, with the hot tub and BBQ grill', 'Backyard & patio'),
      desert('covered-patio', 'Covered patio chairs beside the lawn and cornhole boards', 'Backyard & patio'),
      desert('backyard-night', 'Landscape lighting along the backyard at night', 'Backyard & patio'),
      desert('living-room-2', 'Living room seating at The Sage House', 'Living room'),
      desert('nex-playground', 'Nex Playground with interactive, motion-controlled games', 'Living room'),
      desert('living-room-3', 'Green velvet sofa and coffee table beneath a framed gallery wall', 'Living room'),
      desert('kitchen-fire-pit-view', 'Kitchen window overlooking the backyard fire pit', 'Kitchen'),
      desert('kitchen-2', 'Kitchen with wood cabinets, stainless appliances and a bar-height island', 'Kitchen'),
      desert('kitchen-3', 'Kitchen with glass-front cabinets, dishes and open drawers', 'Kitchen'),
      desert('pantry', 'Pantry with an Instant Pot, blender, electric kettle, fire safety supplies, first aid kit and air mattresses', 'Kitchen'),
      desert('dining', 'Dining area at The Sage House', 'Dining area'),
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
      desert('bathroom-1', 'Full bathroom at The Sage House', 'Bathroom 1'),
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
    slug: 'sand-house-pool-putting-green-visalia',
    heroPhoto: '/stays/sand-house/pool-sunset.jpg',
    name: 'The Sand House',
    airbnbId: trackingConfig.listings.sand.id,
    airbnbTitle: 'The Sand House | Pool, hot tub, mini golf',
    tagline: 'A putt before dinner. A swim before the stars come out.',
    metaTitle: 'The Sand House | Visalia Pool & Putting Green | SSHOME',
    metaDescription:
      'A five-bedroom Visalia home for up to 14 with a private pool, hot tub, putting green, and pergola. Add The Sage House next door for up to 28. Book on Airbnb.',
    bestFor: 'Groups who want a pool, a putting green, and room to play outside',
    lead: 'Line up a putt on the backyard green, pull a chair under the pergola, or float on the in-water loungers while dinner comes off the grill. With five bedrooms, a private pool, and a hot tub, this Visalia home sleeps up to 14, including those using the provided air mattresses. The Sage House is right next door for bigger groups.',
    guests: 14,
    bedrooms: 5,
    beds: 6,
    bedSummary: '6 bedroom beds + 1 queen and 2 twin air mattresses',
    summaryZh: '五房、六張臥室床、三間衛浴，附私人不加熱泳池、熱水池、推桿果嶺與 pergola 遮陽棚。臥室有一張 King、三張 Queen 及兩張 Twin，可睡 10 人；另有一張 Queen 氣墊床和兩張 Twin 氣墊床，可再睡 4 人，合計 14 人。隔壁就是 Sage House，後院有門相通。',
    baths: 3,
    rating: null,
    reviewNote: 'Rated 5.0 on Airbnb',
    reviews: [],
    compare: {
      outdoor: 'Private fenced pool, hot tub, putting green, pergola dining and lounge, fire pit, hammocks, BBQ',
      indoor: '98-inch TV, Nex Playground motion games',
      work: 'Desk, chair, monitor and lamp in Bedroom 2',
      parking: '3 driveway spaces plus nearby street parking; EV charging for a fee',
    },
    highlights: [
      {
        title: 'Your own putting green',
        body: 'Grab a putter and settle the score on the backyard green, then cross the little bridges to the hammocks and fire pit.',
      },
      {
        title: 'A pool to linger by',
        body: 'Stretch out on the in-water loungers or the sun loungers under the umbrellas. The pool is fenced and not heated, and there is a separate hot tub.',
      },
      {
        title: 'Dinner under the pergola',
        body: 'The pergola covers a long outdoor dining table and a sectional, with the BBQ grill close by.',
      },
      {
        title: 'Bring the whole crew next door',
        body: 'The Sage House is the neighboring home. Book both on Airbnb, and a backyard gate connects them: 10 bedrooms and 6 baths together.',
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
      { group: 'Outdoors', items: ['Private fenced pool (not heated)', 'Hot tub', 'Putting green', 'Pergola with dining table and sectional', 'Fire pit with seating', 'Hammocks', 'Giant Connect Four', 'BBQ grill'] },
      { group: 'Living', items: ['98-inch TV', 'Smart TV in every bedroom except the twin room', 'Nex Playground', 'Dining table and kitchen island', 'Wi-Fi'] },
      { group: 'Kitchen', items: ['HexClad cookware', 'Instant Pot', 'Blender', 'Electric kettle', 'Brita pitcher', 'K-Cup and drip coffee maker', 'Kid-friendly dinnerware'] },
      { group: 'Practical', items: ['Washer and dryer', 'Detergent and dryer sheets', 'Iron and drying rack', 'Toto bidet', 'Self check-in with smart lock', 'Free driveway parking for 3 cars', 'Nearby street parking', 'EV charger (fee)'] },
    ],
    goodToKnow: [
      'The Sage House next door is a separate listing. When you book both, a backyard gate connects the two homes. Message the host about availability for both.',
      'The pool is not heated. First-night hot tub availability is not guaranteed; after a full water change, reheating can take about 20 to 30 hours in winter, so message the host before booking if it matters to you.',
      'The home has stairs.',
      'The home is in a developing neighborhood, and nearby construction may cause daytime noise.',
      'Routine yard maintenance happens during the day, and staff may access outdoor areas.',
      'BBQ propane costs extra. Early check-in and late checkout may be available for a fee.',
      'Please bring your own K-Cup pods.',
    ],
    faqs: [
      { question: 'How many people does The Sand House sleep?', answer: 'Up to 14 guests: 10 in the five bedrooms and 4 on the air mattresses.' },
      { question: 'Can we book The Sand House and The Sage House together?', answer: 'Yes, if both are available. Book each home separately on Airbnb. A backyard gate connects them, for 10 bedrooms, 6 baths and up to 28 guests in total.' },
      { question: 'Is the pool at The Sand House heated?', answer: 'No. The pool is not heated. The separate hot tub can be heated.' },
      { question: 'Can I work remotely from The Sand House?', answer: 'Yes. Bedroom 2 has a desk, chair, monitor and lamp, and the home has Wi-Fi.' },
    ],
    photos: [
      sand('pool-sunset', 'Private pool with in-water loungers at sunset at The Sand House in Visalia', 'Pool'),
      sand('living-room-1', 'Living room with a cream sofa, round coffee table and view to the dining area', 'Living room'),
      sand('putting-green-wide', 'Backyard putting green with the pergola and two-story home beyond', 'Putting green'),
      sand('pool-loungers', 'In-water loungers on the shallow shelf of the fenced pool', 'Pool'),
      sand('pergola', 'Pergola covering an outdoor dining table and lounge seating', 'Pergola & patio'),
      sand('pool-sun-loungers', 'Sun loungers under umbrellas beside the pool at sunset', 'Pool'),
      sand('pool-dusk', 'Pool and sun loungers at dusk', 'Pool'),
      sand('hot-tub-1', 'Bubbling hot tub with the putting green beyond', 'Hot tub'),
      sand('hot-tub-night', 'Hot tub lit blue at night', 'Hot tub'),
      sand('putting-green-1', 'Putting green with a wooden footbridge and picnic table', 'Putting green'),
      sand('putting-green-2', 'Putting green and desert landscaping under a blue sky', 'Putting green'),
      sand('putting-green-dusk', 'Putting green with path lights at dusk', 'Putting green'),
      sand('pergola-dining', 'Table set for eight under the pergola, with the pool beyond', 'Pergola & patio'),
      sand('outdoor-dining', 'Outdoor dining table with glasses and plates', 'Pergola & patio'),
      sand('pergola-lounge', 'Outdoor sectional and coffee table under the pergola', 'Pergola & patio'),
      sand('bbq', 'BBQ grill on the patio with path lights at dusk', 'Pergola & patio'),
      sand('fire-pit-day', 'Fire pit with Adirondack chairs in the desert-landscaped backyard', 'Backyard'),
      sand('fire-pit-dusk', 'Fire pit and Adirondack chairs at dusk', 'Backyard'),
      sand('backyard-dusk', 'Lit desert landscaping, footbridge and hammocks at dusk', 'Backyard'),
      sand('backyard-path-lights', 'Dry creek bed and footbridge with path lights', 'Backyard'),
      sand('hammock', 'Hammock beside the fence under string lights', 'Backyard'),
      sand('giant-connect-four', 'Giant Connect Four game on the turf', 'Backyard'),
      sand('living-room-2', 'Living room with a wall-mounted TV, sofa and lounge chair', 'Living room'),
      sand('kitchen-1', 'Kitchen with wood cabinets, gas range and breakfast bar', 'Kitchen'),
      sand('kitchen-2', 'Kitchen counter, coffee maker and island seating', 'Kitchen'),
      sand('dining', 'Dining table for eight beside the kitchen island', 'Dining area'),
      sand('bedroom-cane-1', 'Bedroom with a cane headboard and matching lamps', 'Bedrooms'),
      sand('bedroom-cane-2', 'Bed with a cane headboard and brown pillows', 'Bedrooms'),
      sand('bedroom-2', 'Bedroom 2 with a queen bed and pleated lamps', 'Bedroom 2'),
      sand('bedroom-2-workspace', 'Bedroom 2 queen bed with the desk and monitor', 'Bedroom 2'),
      sand('bedroom-2-3', 'Bedroom 2 queen bed beside the window', 'Bedroom 2'),
      sand('workspace', 'Desk with a monitor, lamp and chair in Bedroom 2', 'Bedroom 2'),
      sand('bedroom-queen-1', 'Bedroom with an upholstered headboard and mushroom lamps', 'Bedrooms'),
      sand('bedroom-queen-1-2', 'Upholstered bed beside a sunny window', 'Bedrooms'),
      sand('bedroom-queen-1-3', 'Close view of the bed and pillows', 'Bedrooms'),
      sand('bedroom-woven-1', 'Bedroom with a woven headboard and black lamps', 'Bedrooms'),
      sand('bedroom-woven-2', 'Bed with a woven headboard and patterned pillows', 'Bedrooms'),
      sand('bedroom-woven-3', 'Bed with a woven headboard beside a window', 'Bedrooms'),
      sand('bedroom-5-1', 'Bedroom 5 with two twin beds', 'Bedroom 5'),
      sand('bedroom-5-2', 'Bedroom 5 twin beds beneath the window', 'Bedroom 5'),
      sand('bedroom-5-3', 'Twin bed with a mushroom lamp in Bedroom 5', 'Bedroom 5'),
      sand('bedroom-5-play-table', 'Bead maze activity table for little ones in Bedroom 5', 'Bedroom 5'),
      sand('primary-bath', 'Bathroom with a double vanity, glass shower and soaking tub', 'Bathrooms'),
      sand('primary-bath-tub', 'Soaking tub with a wooden bath caddy', 'Bathrooms'),
      sand('bathroom-double-vanity', 'Double vanity with globe lights', 'Bathrooms'),
      sand('bathroom-toto', 'Bathroom vanity and Toto bidet toilet', 'Bathrooms'),
      sand('bathroom-shower', 'Shower and tub with toiletries', 'Bathrooms'),
      sand('laundry', 'Laundry room with a washer, dryer, utility sink and drying rack', 'Laundry room'),
      sand('ev-charging', 'Tesla wall charger, available for an additional fee', 'EV charging'),
    ],
  },
  {
    slug: 'luxury-family-home-hot-tub-game-room-visalia',
    name: 'The Amber House',
    airbnbId: trackingConfig.listings.family.id,
    airbnbTitle: 'The Amber House | 4BR, hot tub, BBQ, EV',
    tagline: 'One more game of pool. One less reason to rush out.',
    metaTitle: 'The Amber House | Visalia Home with Game Room | SSHOME',
    metaDescription:
      'Make yourself at home in Visalia: four bedrooms, a pool table, a loft, and a private hot tub. Sleeps up to 14 with extra sleeping spaces. Book on Airbnb.',
    bestFor: 'Families and groups looking for a game room and separate living areas',
    lead: 'Call the next game of pool, spread out in the loft, or get dinner going while everyone swaps stories from the day. With four bedrooms, a full kitchen, and a private hot tub, this Visalia home makes time together easy. Sleeps up to 14 with the sofa bed, couch, and air mattresses included in the sleeping setup.',
    guests: 14,
    bedrooms: 4,
    beds: 5,
    bedSummary: '5 bedroom beds + 1 sofa bed + 1 couch + 3 air mattresses',
    summaryZh: '四房、五張臥室床、三間衛浴，附撞球桌、閣樓與熱水池；沒有泳池。臥室有一張 King、兩張 Queen 及兩張 Twin，可睡 8 人；另有沙發床、沙發及三張氣墊床，最多可住 14 人。車庫可停一台、車道兩台、路邊一台，部分車庫已改為遊戲室。',
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
      parking: '1 in the garage, 2 in the driveway, 1 on the street; EV charging for a fee',
    },
    highlights: [
      {
        title: 'Who has the next shot?',
        body: 'Part of the two-car garage is now a game room with a pool table. Bring a little friendly competition to your evening.',
      },
      {
        title: 'An upstairs spot to spread out',
        body: 'Head to the loft for board games, puzzles, or something on the Smart TV. The sleeper sofa adds another place to settle in.',
      },
      {
        title: 'Take the evening outside',
        body: 'String lights, a succulent and cactus garden, and a six-person hot tub set the scene. Planning to grill? Arrange BBQ propane with the host before your stay.',
      },
      {
        title: 'Little guests, thoughtfully included',
        body: "A room for the kids and their own plates and utensils help everyone feel at home.",
      },
      {
        title: 'Forgot something? No big trip needed.',
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
    extraSleeping: 'Airbnb does not specify the air mattress sizes. Ask the host to confirm if the sizes matter for your group.',
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
      { group: 'Living', items: ['75-inch TV', 'Pool table', 'Loft with Smart TV', 'Board games and puzzles', 'Nintendo Switch games', 'Wi-Fi'] },
      { group: 'Kitchen', items: ['Stove, microwave and refrigerator', 'Dishwasher', 'Island with breakfast bar', 'Drip and Keurig coffee makers', 'Rice cooker and blender', 'Spices and chopsticks', "Children's dinnerware"] },
      { group: 'Practical', items: ['Washer and dryer in a second-floor laundry room', 'Iron and drying rack', 'Toto bidet in every bathroom', 'Central air and heating', 'Self check-in with smart lock', 'Garage parking for 1 car', 'Free driveway parking for 2 cars', 'Free street parking for 1 car', 'EV charger (fee)'] },
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
      { question: 'What are The Amber House sleeping arrangements?', answer: 'Up to 14 overnight guests, using the bedroom beds, sofa bed, couch and air mattresses.' },
      { question: 'Are restaurants and grocery stores close to The Amber House?', answer: "Guests report grocery stores and quick-bite options nearby, plus gas stations and late-night restaurants such as Raising Cane's and In-N-Out about a 5-minute drive away." },
      { question: 'Does The Amber House have EV charging?', answer: 'Yes, a Level 2 Tesla-only charger in the garage, for an additional fee. Let the host know in advance so it can be activated.' },
    ],
    photos: [
      family('living-room-1', 'Sunlit living room with a tan leather sectional at The Amber House in Visalia', 'Living room'),
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
      family('living-room-2', 'Modern living room at The Amber House', 'Living room'),
      family('living-room-3', 'Tan leather sectional beneath a large framed print', 'Living room'),
      family('living-room-4', 'Leather sectional and coffee table facing the wall-mounted TV', 'Living room'),
      family('living-room-5', 'Styled coffee table in front of the leather sectional', 'Living room'),
      family('game-room-1', 'Game room at The Amber House', 'Game room'),
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
      family('primary-bedroom-2', 'Primary bedroom at The Amber House', 'Bedroom 1'),
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
      family('entry', 'Entryway at The Amber House', 'Entrance'),
      family('entry-art', 'Framed art in the entry hallway', 'Entrance'),
      family('stairs', 'Entry stairs with a lantern', 'Entrance'),
    ],
  },
];

export const getStay = (slug: string) => stays.find((stay) => stay.slug === slug);

export const maxGuests = Math.max(...stays.map((stay) => stay.guests));

export const siteFaqs: Faq[] = [
  {
    question: 'Do the homes have Wi-Fi and a workspace?',
    answer: 'All three have Wi-Fi. The Sage House and The Sand House each have a desk, chair, monitor, and lamp in Bedroom 2. The Amber House has no dedicated workspace.',
  },
  {
    question: 'Which homes have a swimming pool?',
    answer: 'The Sage House and The Sand House each have a private, unheated pool. The Amber House has no pool. All three have hot tubs, but availability on the first night is not guaranteed. If a soak is a must for your trip, check with the host before booking.',
  },
  {
    question: 'Can a large group stay in two homes next door to each other?',
    answer: 'Yes. The Sage House and The Sand House are next-door neighbors, and a backyard gate connects them when you book both. Together they have 10 bedrooms and 6 baths for up to 28 guests. Book each home separately on Airbnb, and message the host to confirm both are free for your dates.',
  },
  {
    question: 'How should two families or 10 to 14 guests choose a home?',
    answer: 'Each home sleeps up to 14 and has three bathrooms. The Sage House and The Sand House each have five bedrooms with 1 king, 3 queens and 2 twin beds sleeping 10, plus 1 queen and 2 twin air mattresses sleeping 4. The Amber House has four bedrooms with 1 king, 2 queens and 2 twin beds sleeping 8, plus a sofa bed, a couch and 3 air mattresses. Review every sleeping space before booking; the maximum includes additional sleeping arrangements.',
  },
  {
    question: 'Are EV charging and BBQ propane included?',
    answer: 'EV charging and BBQ propane cost extra at every home. Each home has a Tesla charger, and The Amber House charger works with Teslas only. Ask the host on Airbnb about current fees, arrangements, and compatibility. Check Airbnb for current nightly rates, availability, and cancellation terms.',
  },
  {
    question: 'Where are the homes located?',
    answer: 'All three homes are in Visalia, California, in Tulare County. The Sage House and The Sand House are next door to each other; The Amber House is in another part of Visalia. The exact address is shared by Airbnb after booking.',
  },
  {
    question: 'How far is Visalia from Sequoia and Kings Canyon National Parks?',
    answer: 'The National Park Service lists about 1 hour from Visalia Municipal Airport to the Sequoia entrance on Highway 198, and about 1.5 hours to the Kings Canyon entrance. Roads beyond the entrances are narrow and winding, so allow extra time.',
  },
  {
    question: 'How do I book a stay?',
    answer: 'Choose a home, then follow its Airbnb link to check dates, prices, house rules, and cancellation terms. All bookings and payments take place on Airbnb.',
  },
  {
    question: 'What are the check-in and checkout times?',
    answer: 'Check-in is at 4:00 PM and checkout is at 10:00 AM at every home. Early check-in or late checkout may be available for a fee, subject to availability.',
  },
];

export const getHeroPhoto = (stay: Stay): Photo => stay.photos.find((photo) => photo.src === stay.heroPhoto) ?? stay.photos[0];
