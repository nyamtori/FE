import type { ProductLookupResult } from '../types'

/**
 * Placeholder for a backend barcode->product lookup endpoint.
 * Swap `lookupProductByBarcode` in src/api/barcode.ts to call the real
 * backend once it exists; this table only exists to demo the flow.
 */
export const mockBarcodeTable: Record<string, ProductLookupResult> = {
  '8801019318702': { name: '계란', emoji: '🥚' },
  '8801007433607': { name: '우유', emoji: '🥛' },
  '8801043215488': { name: '당근', emoji: '🥕' },
}
