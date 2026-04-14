import Anthropic from '@anthropic-ai/sdk'
import { jsonrepair } from 'jsonrepair'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface RoomData {
  id: string
  name: string
  width_cm: number
  depth_cm: number
  doors: { x: number; y: number; width: number; wall: string }[]
  windows: { x: number; y: number; width: number; wall: string }[]
}

export interface AIFurnitureSuggestion {
  name: string
  category: string
  width_cm: number
  depth_cm: number
  height_cm: number
  price: number
  currency: string
  product_url?: string
  style_tags: string[]
}

/** Generate a real search URL from a furniture name */
export function buildSearchUrl(name: string): string {
  const query = encodeURIComponent(name)
  // If name starts with IKEA, link to IKEA search; otherwise Google Shopping
  if (/^ikea/i.test(name)) {
    const q = encodeURIComponent(name.replace(/^ikea\s*/i, ''))
    return `https://www.ikea.com/us/en/search/products/?q=${q}`
  }
  if (/^wayfair/i.test(name)) {
    const q = encodeURIComponent(name.replace(/^wayfair\s*/i, ''))
    return `https://www.wayfair.com/keyword.php?keyword=${q}`
  }
  return `https://www.google.com/search?tbm=shop&q=${query}`
}

export interface GeneratedPlan {
  name: string
  total_price: number
  reasoning: string
  rooms: {
    room_id: string
    furniture: {
      item: AIFurnitureSuggestion
      position_x: number
      position_y: number
      rotation: number
      quantity: number
    }[]
  }[]
}

export async function generateLayoutPlans(
  rooms: RoomData[],
  stylePreferences: string[],
  budgetLimit: number | null,
  currency: string
): Promise<GeneratedPlan[]> {
  const roomsText = rooms.map(room => `
Room: "${room.name}" (ID: ${room.id})
  Size: ${room.width_cm}cm wide × ${room.depth_cm}cm deep (${(room.width_cm/100).toFixed(1)}m × ${(room.depth_cm/100).toFixed(1)}m)
  Doors (must NOT block): ${room.doors.map(d => `${d.wall} wall at x=${d.x}cm, width=${d.width}cm`).join('; ') || 'none'}
  Windows: ${room.windows.map(w => `${w.wall} wall at x=${w.x}cm, width=${w.width}cm`).join('; ') || 'none'}
`).join('\n')

  const budgetText = budgetLimit
    ? `Total budget: ${currency} $${budgetLimit} — keep total cost under this`
    : 'No strict budget limit — suggest quality items'
  const styleText = stylePreferences.length > 0 ? stylePreferences.join(', ') : 'Modern'

  const prompt = `You are an expert Airbnb interior designer. Generate 1 complete furniture layout plan for a short-term rental property.

ROOMS:
${roomsText}

DESIGN REQUIREMENTS:
- Style: ${styleText}
- ${budgetText}
- Currency: ${currency}
- Suggest products from IKEA or Wayfair by name with realistic prices (do NOT include any URLs)
- CRITICAL: Never block door openings (doors need 90cm clearance arc)
- CRITICAL: Don't block windows with tall furniture (wardrobes, bookshelves, shelving)
- Each room only needs appropriate items (1 bed per bedroom, sofa in living room, etc.)
- Coordinates are top-left corner of furniture relative to room's top-left (0,0)
- position_x and position_y are in centimeters
- rotation: 0=normal, 90=clockwise 90°, 180=flipped, 270=counter-clockwise 90°
- Leave walking paths clear (at least 60cm between furniture pieces and walls)
- Furniture must fit inside the room boundaries

FURNITURE CATEGORIES to use:
bed, sofa, dining_table, dining_chair, coffee_table, tv_unit, wardrobe, desk, desk_chair, bookshelf, nightstand, dresser, side_table, armchair, rug, lamp

Keep furniture selection minimal — 3-5 key pieces per room only. Return ONLY valid JSON, no markdown, no explanation:
{
  "plans": [
    {
      "name": "Plan A - Modern Minimalist",
      "total_price": 2400,
      "reasoning": "Clean lines and neutral colors create a welcoming space. The sofa faces the TV unit while leaving clear walking paths...",
      "rooms": [
        {
          "room_id": "EXACT_ROOM_ID_FROM_ABOVE",
          "furniture": [
            {
              "item": {
                "name": "IKEA SÖDERHAMN 3-seat sofa",
                "category": "sofa",
                "width_cm": 198,
                "depth_cm": 99,
                "height_cm": 83,
                "price": 799,
                "currency": "${currency}",
                "style_tags": ["modern", "minimalist", "nordic"]
              },
              "position_x": 50,
              "position_y": 200,
              "rotation": 0,
              "quantity": 1
            }
          ]
        }
      ]
    }
  ]
}`

  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Claude did not return valid JSON')

  const repaired = jsonrepair(jsonMatch[0])
  const parsed = JSON.parse(repaired)
  return parsed.plans as GeneratedPlan[]
}
