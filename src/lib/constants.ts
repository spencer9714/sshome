export const SITE_NAME = 'SSHome Staging'
export const SITE_DESCRIPTION = 'Designing high-performing Airbnbs across California. Staging, design, and setup for short-term rentals.'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sshomestaging.com'

export const PROPERTY_TYPES = [
  'SFH',
  'Condo',
  'Townhouse',
  'Cabin',
  'Pool Home',
] as const

export const STYLE_OPTIONS = [
  'Japandi',
  'Desert Modern',
  'Soft Modern',
  'Coastal',
] as const

export const BUDGET_RANGES = [
  'Under $15k',
  '$15k - $30k',
  '$30k+',
] as const

export const GOAL_OPTIONS = [
  'New listing',
  'Refresh',
  'Reposition',
] as const

export const TARGET_GUEST_OPTIONS = [
  'Couples',
  'Families',
  'Business travelers',
  'Groups',
  'Luxury travelers',
  'Digital nomads',
] as const

export const CURRENT_STATUS_OPTIONS = [
  'New listing',
  'Refresh existing listing',
  'Reposition / rebrand',
  'Renovating soon',
] as const

export const SCOPE_OPTIONS = [
  'Turnkey Airbnb Launch',
  'Refresh / Re-Stage',
  'Design-only (remote)',
  'Outdoor areas',
  'Kids room',
  'Themed rooms',
  'Photo styling',
] as const

export const TIMELINE_OPTIONS = [
  'ASAP',
  'Within 1 month',
  '1-3 months',
  '3+ months',
  'Flexible',
] as const

export const FURNISHING_BUDGET_OPTIONS = [
  'Under $10k',
  '$10k - $20k',
  '$20k - $35k',
  '$35k - $50k',
  '$50k+',
] as const

export const SERVICE_BUDGET_OPTIONS = [
  'Under $3k',
  '$3k - $5k',
  '$5k - $10k',
  '$10k+',
] as const

export const SPACE_OPTIONS = [
  'Living Room',
  'Bedroom',
  'Bathroom',
  'Kitchen',
  'Dining',
  'Outdoor',
  'Entryway',
  'Office',
  'Other',
] as const

export const LEAD_STATUS_OPTIONS = [
  'new',
  'contacted',
  'quoted',
  'won',
  'lost',
] as const

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/quote', label: 'Get a Quote' },
] as const
