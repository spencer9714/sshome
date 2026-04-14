import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export interface ExtractedRoom {
  name: string
  width_cm: number
  depth_cm: number
  position_x: number
  position_y: number
  doors:   { x: number; y: number; width: number; wall: string }[]
  windows: { x: number; y: number; width: number; wall: string }[]
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file     = formData.get('image') as File | null
  const floorId  = formData.get('floorId') as string | null
  if (!file) return NextResponse.json({ error: 'No image provided' }, { status: 400 })

  const bytes     = await file.arrayBuffer()
  const base64    = Buffer.from(bytes).toString('base64')
  const mediaType = (file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp') || 'image/jpeg'

  const prompt = `You are analyzing a residential floor plan image. Your goal is to reconstruct the EXACT spatial layout so it can be redrawn accurately. Use US customary units (feet and inches) for all measurements, then convert to centimeters in the JSON.

STEP 1 — Understand the overall layout:
- Estimate total width and depth of the entire floor plan in feet.
- Typical US homes: single bedroom apartment 25–35 ft wide, 2-bedroom 35–50 ft wide.
- Convert total dimensions to centimeters (1 ft = 30.48 cm).

STEP 2 — Reason through the room layout (write this out before the JSON):
Describe the spatial arrangement of rooms in plain English first, e.g.:
"Living room is top-left. Kitchen is directly to its right. Master bedroom is below the living room. Bathroom is to the right of the master bedroom."
Then translate each relative position to exact coordinates:
- Start at origin: the topmost+leftmost room has position_x=0, position_y=0
- If Room B is directly to the right of Room A: Room B position_x = Room A position_x + Room A width_cm
- If Room B is directly below Room A: Room B position_y = Room A position_y + Room A depth_cm

CRITICAL COORDINATE RULES:
- Adjacent rooms MUST share edges exactly — no gaps, no overlaps
- Room sizes based on typical US dimensions:
  - Bedroom: 10×12 ft (305×366 cm) to 14×16 ft (427×488 cm)
  - Living room: 12×18 ft (366×549 cm) to 16×20 ft (488×610 cm)
  - Kitchen: 10×12 ft (305×366 cm) to 12×15 ft (366×457 cm)
  - Bathroom: 5×8 ft (152×244 cm) to 6×10 ft (183×305 cm)
  - Hallway: 3–4 ft (91–122 cm) wide

STEP 3 — Doors and windows:
- Use US STANDARD DOOR sizes (width in cm): 81 cm (32") for interior, 91 cm (36") for exterior/front
- Doors: wall = "top"|"bottom"|"left"|"right" of THIS room, x = cm from wall's near corner to door edge
- Windows: estimate width from image proportion, range 61–183 cm (24"–72")
- Assign windows to exterior walls whenever possible

After your reasoning, return ONLY valid JSON (no markdown fences):
{
  "total_width_cm": 1200,
  "total_depth_cm": 900,
  "rooms": [
    {
      "name": "Living Room",
      "width_cm": 488,
      "depth_cm": 549,
      "position_x": 0,
      "position_y": 0,
      "doors": [{"x": 200, "width": 91, "wall": "right"}],
      "windows": [{"x": 50, "width": 120, "wall": "top"}]
    }
  ]
}`

  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 8192,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
        { type: 'text', text: prompt },
      ],
    }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return NextResponse.json({ error: 'AI could not parse the floor plan' }, { status: 422 })

  const parsed = JSON.parse(jsonMatch[0])
  const totalWidthCm: number = parsed.total_width_cm ?? null
  const totalDepthCm: number = parsed.total_depth_cm ?? null

  // Save image to Storage + update floor record (if floorId provided)
  let scalePxPerCm: number | null = null

  if (floorId) {
    const ext  = mediaType.split('/')[1] ?? 'jpg'
    const path = `floors/${floorId}/plan.${ext}`

    await supabase.storage.from('floor-plans').upload(path, Buffer.from(bytes), {
      contentType: mediaType,
      upsert: true,
    })

    // Compute a rough px-per-cm scale from the image dimensions
    // (image natural width is not available server-side without a library,
    //  so we derive it from base64 size as a heuristic — overridden by manual calibration)
    if (totalWidthCm) {
      // base64 → approximate byte size → approximate pixel count heuristic
      // Real value will be refined by manual calibration; this gives a starting point
      const approxImageWidthPx = Math.round(base64.length * 0.75 / (totalDepthCm || totalWidthCm) * 0.1)
      if (approxImageWidthPx > 0) {
        scalePxPerCm = approxImageWidthPx / totalWidthCm
      }
    }

    await supabase.from('floors').update({
      floor_plan_image_path: path,
      ...(totalWidthCm  ? { total_width_cm:  totalWidthCm  } : {}),
      ...(totalDepthCm  ? { total_depth_cm:  totalDepthCm  } : {}),
      ...(scalePxPerCm  ? { scale_px_per_cm: scalePxPerCm  } : {}),
    }).eq('id', floorId)
  }

  return NextResponse.json({
    rooms:          parsed.rooms as ExtractedRoom[],
    total_width_cm: totalWidthCm,
    total_depth_cm: totalDepthCm,
    scale_px_per_cm: scalePxPerCm,
  })
}
