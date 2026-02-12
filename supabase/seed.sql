-- ============================================================
-- SSHome Staging - Seed Data (8 Sample Projects)
-- ============================================================
-- Run this after migrations to populate with sample data.
-- All projects are set to is_published = true for demo purposes.

INSERT INTO projects (slug, title, city, state, property_type, bedrooms, bathrooms, style_tags, budget_range, goal, summary, what_we_did, design_notes, timeline_weeks, is_published, published_at) VALUES
(
  'japandi-condo-mountain-view',
  'Japandi Condo in Mountain View',
  'Mountain View', 'CA', 'Condo', 2, 2,
  '{Japandi}',
  '$15k - $30k',
  'New listing',
  'A serene 2-bedroom condo designed for tech professionals and couples visiting Silicon Valley. Clean lines, natural materials, and purposeful simplicity.',
  'Full turnkey staging including furniture, art, textiles, kitchen essentials, and guest supplies. We designed a calming workspace nook and optimized the small balcony for golden-hour photos.',
  'Japandi was the clear choice for this market — Bay Area guests appreciate minimalism with warmth. We used light oak, linen, and muted earth tones. Every surface was kept intentionally uncluttered to photograph well in small spaces.',
  3, true, now()
),
(
  'desert-retreat-joshua-tree',
  'Desert Retreat in Joshua Tree',
  'Joshua Tree', 'CA', 'SFH', 3, 2,
  '{Desert Modern}',
  '$30k+',
  'Reposition',
  'A sun-drenched 3-bedroom desert home repositioned from a dated vacation rental into a premium desert-modern escape. Targeted at couples and creatives seeking desert solitude.',
  'Complete restage: removed outdated furnishings, introduced desert-modern palette, custom-sourced statement lighting, added outdoor lounge area with fire pit, styled for golden-hour photography.',
  'Joshua Tree guests expect an immersive desert experience. We leaned into warm terracotta, raw wood, woven textures, and dramatic lighting. The outdoor space became the hero — designed for sunset photos that drive bookings.',
  4, true, now()
),
(
  'pool-home-palm-springs',
  'Mid-Century Pool Home in Palm Springs',
  'Palm Springs', 'CA', 'Pool Home', 4, 3,
  '{Desert Modern,Soft Modern}',
  '$30k+',
  'New listing',
  'A stunning 4-bedroom pool home styled for group getaways and luxury travelers. Bold yet sophisticated design that makes the pool area the star of the listing.',
  'Turnkey launch: full interior staging, pool area design, outdoor dining setup, bedroom themes for diverse guest groups, photo styling session with professional photographer.',
  'Palm Springs demands personality. We mixed desert modern with soft modern — warm neutrals grounded by bold textiles and statement furniture. Each bedroom has a distinct but cohesive vibe to appeal to different group dynamics.',
  4, true, now()
),
(
  'coastal-vacation-san-diego',
  'Coastal Vacation Home in San Diego',
  'San Diego', 'CA', 'SFH', 3, 2,
  '{Coastal}',
  '$15k - $30k',
  'New listing',
  'A breezy 3-bedroom family-friendly coastal home near the beach. Designed for traveling families who want comfort, durability, and that California-coast feeling.',
  'Full staging with family-friendly focus: durable performance fabrics, kid-safe decor, bunk room design, beach gear station, outdoor shower area styling, and a fully equipped kitchen.',
  'Coastal style without the clichés — no seashells on every surface. We used sandy neutrals, soft blues, and natural woven textures. The bunk room was designed as a selling point for families, and the outdoor shower became a key listing photo.',
  3, true, now()
),
(
  'soft-modern-getaway-napa',
  'Soft Modern Getaway in Napa',
  'Napa', 'CA', 'SFH', 4, 3,
  '{Soft Modern}',
  '$30k+',
  'New listing',
  'A sophisticated 4-bedroom wine country retreat designed for premium stays. Couples and small groups seeking a luxurious, photo-worthy escape in Napa Valley.',
  'Premium turnkey staging: high-end furnishings, curated art collection, wine-themed dining area, spa-inspired bathrooms, outdoor entertaining space with vineyard views.',
  'Napa guests expect luxury without pretension. Soft modern gave us the warmth and sophistication this market demands. We invested heavily in textiles — high-thread-count linens, plush towels, cashmere throws. The dining area was designed to feel like a private wine-tasting experience.',
  5, true, now()
),
(
  'family-airbnb-visalia',
  'Soft Modern Family Airbnb in Visalia',
  'Visalia', 'CA', 'SFH', 5, 3,
  '{Soft Modern}',
  '$15k - $30k',
  'New listing',
  'A spacious 5-bedroom family home near Sequoia National Park. Designed for large families and groups visiting the national parks. Fast turnkey launch under budget.',
  'Budget-conscious turnkey staging: strategic mix of quality anchor pieces and value items. Kids room with bunk beds, game area, fully equipped kitchen for large groups, outdoor BBQ area.',
  'This project was about maximizing impact per dollar. We invested in living room and primary bedroom staging, used smart budget strategies for secondary bedrooms, and made the game room a standout feature. The listing went live in under 3 weeks and was fully booked within the first month.',
  3, true, now()
),
(
  'coastal-condo-santa-barbara',
  'Coastal Condo Refresh in Santa Barbara',
  'Santa Barbara', 'CA', 'Condo', 2, 2,
  '{Coastal,Soft Modern}',
  'Under $15k',
  'Refresh',
  'A dated 2-bedroom condo refreshed to compete with newer listings. Strategic updates that boosted nightly rate by 30% without a full restage.',
  'Selective refresh: replaced tired textiles, updated throw pillows and art, restyled bookshelves, added new bathroom accessories, updated kitchen styling, new outdoor furniture for the balcony.',
  'This wasn''t about starting over — it was about strategic impact. We identified the 20% of changes that would drive 80% of the visual improvement. New bedding and towels, fresh art, and a restyled living area made the biggest difference.',
  1, true, now()
),
(
  'japandi-cabin-lake-arrowhead',
  'Japandi x Rustic Cabin in Lake Arrowhead',
  'Lake Arrowhead', 'CA', 'Cabin', 3, 2,
  '{Japandi}',
  '$15k - $30k',
  'Reposition',
  'A mountain cabin repositioned from a generic ski lodge vibe into a Japandi-inspired retreat. Targeting couples and small groups seeking a calm, design-forward mountain escape year-round.',
  'Full restage with seasonal versatility: warm-weather and cold-weather styling, fireplace area redesign, reading nooks, outdoor deck furniture, hot tub area styling.',
  'Cabin doesn''t have to mean rustic cliché. We merged Japandi restraint with natural wood elements that honor the mountain setting. The result feels intentional and calm — a contrast to the typical cluttered cabin aesthetic. We designed for all seasons to maintain year-round bookings.',
  3, true, now()
);
