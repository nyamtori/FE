import type { ProductLookupResult } from '../types'
import { mockBarcodeTable } from '../data/mockBarcodes'
import { delay } from './storage'

/**
 * Stands in for a backend endpoint such as `GET /api/products/barcode/{code}`.
 * Replace the body with a real fetch once that endpoint exists — callers
 * only depend on this function's signature (barcode in, product or null out).
 */
export async function lookupProductByBarcode(
  code: string
): Promise<ProductLookupResult | null> {
  await delay(400)
  return mockBarcodeTable[code] ?? null
}
