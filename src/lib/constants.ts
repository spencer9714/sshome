export const SITE_NAME = 'FurnishAI'
export const SITE_DESCRIPTION = 'AI-powered furniture planning for Airbnb hosts. Upload your floor plan, set your style and budget, and get a complete room layout instantly.'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://furnishai.com'

export const STYLE_OPTIONS = [
  'Modern',
  'Minimalist',
  'Japandi',
  'Coastal',
  'Bohemian',
  'Industrial',
  'Scandinavian',
  'Mid-Century Modern',
  'Cozy / Warm',
] as const

export const FURNITURE_CATEGORIES = [
  'sofa',
  'armchair',
  'coffee_table',
  'side_table',
  'tv_stand',
  'dining_table',
  'dining_chair',
  'bed',
  'nightstand',
  'dresser',
  'wardrobe',
  'desk',
  'office_chair',
  'bookshelf',
  'rug',
  'lamp',
  'other',
] as const

export const FURNITURE_CATEGORY_LABELS: Record<string, string> = {
  sofa: 'Sofa',
  armchair: 'Armchair',
  coffee_table: 'Coffee Table',
  side_table: 'Side Table',
  tv_stand: 'TV Stand',
  dining_table: 'Dining Table',
  dining_chair: 'Dining Chair',
  bed: 'Bed',
  nightstand: 'Nightstand',
  dresser: 'Dresser',
  wardrobe: 'Wardrobe',
  desk: 'Desk',
  office_chair: 'Office Chair',
  bookshelf: 'Bookshelf',
  rug: 'Rug',
  lamp: 'Lamp',
  other: 'Other',
}

export const ROOM_TYPES = [
  'Living Room',
  'Bedroom',
  'Master Bedroom',
  'Kitchen',
  'Dining Room',
  'Bathroom',
  'Office',
  'Balcony',
  'Hallway',
  'Other',
] as const

export const WALL_POSITIONS = ['top', 'right', 'bottom', 'left'] as const

export const CURRENCY_OPTIONS = ['USD', 'TWD', 'CAD', 'AUD', 'EUR', 'GBP'] as const

// Category colors for 2D canvas
export const CATEGORY_COLORS: Record<string, string> = {
  sofa: '#93c5fd',
  armchair: '#a5b4fc',
  coffee_table: '#6ee7b7',
  side_table: '#6ee7b7',
  tv_stand: '#fca5a5',
  dining_table: '#fcd34d',
  dining_chair: '#fde68a',
  bed: '#c4b5fd',
  nightstand: '#ddd6fe',
  dresser: '#e9d5ff',
  wardrobe: '#f5d0fe',
  desk: '#fed7aa',
  office_chair: '#fdba74',
  bookshelf: '#a7f3d0',
  rug: '#fecaca',
  lamp: '#fef08a',
  other: '#e5e7eb',
}
