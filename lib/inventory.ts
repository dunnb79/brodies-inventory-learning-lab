export const MAX_QUANTITY = 1_000_000

export type ParseResult = { value: number; error: null } | { value: null; error: string }

export function parseQuantity(raw: string): ParseResult {
  const text = raw.trim()
  if (text === '') return { value: null, error: 'Enter a quantity (use 0 if none).' }
  if (/^-/.test(text)) return { value: null, error: 'Quantities can’t be negative.' }
  if (/^\d*[.,]\d+$|^\d+[.,]$/.test(text)) return { value: null, error: 'Use whole numbers only — no decimals.' }
  if (!/^\d+$/.test(text)) return { value: null, error: 'Enter numbers only, like 25.' }
  const value = Number(text)
  if (value > MAX_QUANTITY) return { value: null, error: 'Keep quantities at 1,000,000 or less.' }
  return { value, error: null }
}

export function parseSignedWhole(raw: string): ParseResult {
  const text = raw.trim().replace('−', '-')
  if (text === '') return { value: null, error: 'Enter a variance (use 0 if the count matches).' }
  if (/^[+-]?\d*[.,]\d+$/.test(text)) return { value: null, error: 'Use a whole number — no decimals.' }
  if (!/^[+-]?\d+$/.test(text)) return { value: null, error: 'Enter a whole number, like -2, 0, or +2.' }
  return { value: Number(text), error: null }
}

export function formatSigned(value: number) {
  if (value > 0) return `+${value.toLocaleString('en-US')}`
  if (value < 0) return `−${Math.abs(value).toLocaleString('en-US')}`
  return '0'
}

export function describeVariance(variance: number) {
  const units = (n: number) => `${n.toLocaleString('en-US')} ${n === 1 ? 'unit' : 'units'}`
  if (variance < 0) return { kind: 'shortage' as const, label: `Shortage of ${units(Math.abs(variance))}` }
  if (variance > 0) return { kind: 'surplus' as const, label: `Surplus of ${units(variance)}` }
  return { kind: 'match' as const, label: 'Physical count matches the record' }
}
