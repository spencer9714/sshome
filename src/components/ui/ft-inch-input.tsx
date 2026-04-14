'use client'

import { ftInchToCm, cmToFtInch } from '@/lib/units'

interface FtInchInputProps {
  valueCm: number
  onChangeCm: (cm: number) => void
  label?: string
  min?: number  // min in cm
  className?: string
  disabled?: boolean
}

/**
 * Two-field ft + inch input. Internally stores/converts cm.
 * Renders as:  [ 12 ] ft  [ 6 ] in
 */
export function FtInchInput({ valueCm, onChangeCm, label, min = 0, className = '', disabled }: FtInchInputProps) {
  const { ft, inches } = cmToFtInch(valueCm)

  const handleFt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFt = Math.max(0, parseInt(e.target.value) || 0)
    const cm = ftInchToCm(newFt, inches)
    onChangeCm(Math.max(min, cm))
  }

  const handleInches = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value) || 0
    const newIn = Math.max(0, Math.min(11, raw))
    const cm = ftInchToCm(ft, newIn)
    onChangeCm(Math.max(min, cm))
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={ft}
          onChange={handleFt}
          min={0}
          disabled={disabled}
          className="w-16 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-center focus:border-blue-500 focus:outline-none disabled:opacity-50"
        />
        <span className="text-sm text-gray-500 select-none">ft</span>
        <input
          type="number"
          value={inches}
          onChange={handleInches}
          min={0}
          max={11}
          disabled={disabled}
          className="w-14 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-center focus:border-blue-500 focus:outline-none disabled:opacity-50"
        />
        <span className="text-sm text-gray-500 select-none">in</span>
      </div>
    </div>
  )
}
