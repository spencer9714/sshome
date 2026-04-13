import Anthropic from '@anthropic-ai/sdk'

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

export interface FurnitureOption {
  id: string
  name: string
  category: string
  width_cm: number
  depth_cm: number
  price: number
  currency: string
  style_tags: string[]
}

export interface PlacedFurniture {
  furniture_item_id: string
  position_x: number
  position_y: number
  rotation: number
  quantity: number
}

export interface GeneratedPlan {
  name: string
  total_price: number
  reasoning: string
  rooms: {
    room_id: string
    furniture: PlacedFurniture[]
  }[]
}

export async function generateLayoutPlans(
  rooms: RoomData[],
  availableFurniture: FurnitureOption[],
  stylePreferences: string[],
  budgetLimit: number | null,
  currency: string
): Promise<GeneratedPlan[]> {
  const roomsText = rooms.map(room => `
Room: "${room.name}" (ID: ${room.id})
  Size: ${room.width_cm}cm wide × ${room.depth_cm}cm deep
  Doors (do NOT block): ${room.doors.map(d => `${d.wall} wall at x=${d.x}cm, width=${d.width}cm`).join('; ') || 'none'}
  Windows (avoid blocking with tall furniture): ${room.windows.map(w => `${w.wall} wall at x=${w.x}cm, width=${w.width}cm`).join('; ') || 'none'}
`).join('\n')

  const furnitureText = availableFurniture.map(f =>
    `ID:${f.id} | "${f.name}" | ${f.category} | ${f.width_cm}×${f.depth_cm}cm | ${f.currency}$${f.price} | styles:[${f.style_tags.join(',')}]`
  ).join('\n')

  const budgetText = budgetLimit ? `Budget limit: ${currency} $${budgetLimit}` : 'No strict budget limit'
  const styleText = stylePreferences.length > 0 ? stylePreferences.join(', ') : 'modern'

  const prompt = `You are an expert interior designer specializing in Airbnb properties.

Generate exactly 2 complete furniture layout plans for the following property.

ROOMS:
${roomsText}

AVAILABLE FURNITURE:
${furnitureText}

DESIGN REQUIREMENTS:
- Style: ${styleText}
- ${budgetText}
- CRITICAL: Never place furniture blocking door openings (doors need ${90}cm clearance)
- CRITICAL: Don't block windows with tall furniture (wardrobes, bookshelves)
- Use appropriate quantities (1 bed per bedroom, 1 dining table per dining room, etc.)
- Position furniture logically (sofa facing TV, chairs around dining table, etc.)
- Coordinates are relative to room top-left corner (0,0)
- position_x and position_y indicate top-left corner of the furniture piece
- rotation: 0 = normal, 90 = rotated 90° clockwise, 180 = flipped, 270 = rotated 270°
- Only include furniture rooms that make sense (bed in bedroom, sofa in living room, etc.)
- Maximize remaining floor space for walking paths

Return ONLY valid JSON matching this exact structure:
{
  "plans": [
    {
      "name": "Plan A - [style description]",
      "total_price": 2500,
      "reasoning": "Brief explanation of design choices and layout logic",
      "rooms": [
        {
          "room_id": "uuid-here",
          "furniture": [
            {
              "furniture_item_id": "uuid-here",
              "position_x": 50,
              "position_y": 100,
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

  // Extract JSON from response (Claude might wrap in markdown code block)
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Claude did not return valid JSON')

  const parsed = JSON.parse(jsonMatch[0])
  return parsed.plans as GeneratedPlan[]
}
