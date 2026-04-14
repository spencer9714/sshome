/**
 * Unit conversion utilities.
 * Internal storage is always in centimeters (cm).
 * Display and input use US feet + inches.
 */

// ─── Conversion ────────────────────────────────────────────────────────────

export function cmToFtInch(cm: number): { ft: number; inches: number } {
  const totalInches = cm / 2.54
  const ft = Math.floor(totalInches / 12)
  const inches = Math.round(totalInches % 12)
  // Handle rounding up (e.g., 11.9 inches → 12 inches = 1 ft)
  if (inches === 12) return { ft: ft + 1, inches: 0 }
  return { ft, inches }
}

export function ftInchToCm(ft: number, inches: number): number {
  return Math.round((ft * 12 + inches) * 2.54)
}

/** Format cm as  12'6"  */
export function formatFtInch(cm: number): string {
  const { ft, inches } = cmToFtInch(cm)
  return `${ft}'${inches}"`
}

/** Parse "12'6\"" or "12 6" or "12ft 6in" → cm. Returns NaN on failure. */
export function parseFtInch(input: string): number {
  // Try ft'in" format
  const match = input.match(/(\d+)['′\s]+(\d+)["″]?/)
  if (match) return ftInchToCm(parseInt(match[1]), parseInt(match[2]))
  // Try plain number (assume feet)
  const plain = parseFloat(input)
  if (!isNaN(plain)) return Math.round(plain * 30.48)
  return NaN
}

// ─── US Standard Sizes ─────────────────────────────────────────────────────

/** Standard US interior door widths in cm (28", 30", 32", 36") */
export const US_DOOR_SIZES_CM: number[] = [71, 76, 81, 91]

/** Standard US door height in cm (80") */
export const US_DOOR_HEIGHT_CM = 203

/** Standard US exterior door width in cm (36") */
export const US_DOOR_DEFAULT_CM = 91

/** Minimum window width cm (24") */
export const US_WINDOW_MIN_CM = 61

/** Maximum window width cm (72") */
export const US_WINDOW_MAX_CM = 183

/** Snap a door width to the nearest US standard size */
export function snapToDoorStandard(cm: number): number {
  let closest = US_DOOR_SIZES_CM[0]
  let minDiff = Math.abs(cm - closest)
  for (const std of US_DOOR_SIZES_CM) {
    const diff = Math.abs(cm - std)
    if (diff < minDiff) { minDiff = diff; closest = std }
  }
  return closest
}

/** Clamp a window width to valid US range */
export function clampWindowWidth(cm: number): number {
  return Math.max(US_WINDOW_MIN_CM, Math.min(US_WINDOW_MAX_CM, cm))
}
