import type { ProductLookupResult } from '../types'
import { apiFetch, ApiError } from './client'
import { guessFoodEmoji } from './foodEmoji'

interface BarcodeLookupResponseDto {
  barcode: string
  productName: string | null
  manufacturerName: string | null
  foodType: string | null
  expirationDate: string | null
  ingredientName: string | null
  storageType: string | null
}

const EMOJI_KEYWORDS: [RegExp, string][] = [
  [/우유|유제품|치즈|요거트/, '🥛'],
  [/음료|주스|커피|차\b/, '🥤'],
  [/과자|스낵|초콜릿|캔디/, '🍪'],
  [/빵|베이커리/, '🍞'],
  [/육류|고기|소시지|햄/, '🥩'],
  [/수산|생선|해산물/, '🐟'],
  [/채소|야채/, '🥬'],
  [/과일/, '🍎'],
  [/면류|라면|파스타/, '🍜'],
]

function guessCategoryEmoji(hint: string | null): string {
  if (hint) {
    for (const [pattern, emoji] of EMOJI_KEYWORDS) {
      if (pattern.test(hint)) return emoji
    }
  }
  return '🛒'
}

/**
 * BE의 GET /api/v1/barcodes/{barcode}(식약처 바코드연계제품정보 API 프록시)를 호출한다.
 * 조회 실패(404 등)는 "인식 실패" 흐름으로 처리하기 위해 null을 반환한다.
 */
export async function lookupProductByBarcode(code: string): Promise<ProductLookupResult | null> {
  try {
    const res = await apiFetch<BarcodeLookupResponseDto>(`/api/v1/barcodes/${encodeURIComponent(code)}`)
    const name = res.productName || res.ingredientName
    if (!name) return null
    // 제품명 자체에서 먼저 구체적인 이모지를 찾고, 안 되면 식약처 분류(foodType/storageType)로 대체한다.
    const emoji = guessFoodEmoji(name, guessCategoryEmoji(res.foodType || res.storageType))
    return { name, emoji }
  } catch (err) {
    if (err instanceof ApiError) return null
    throw err
  }
}
