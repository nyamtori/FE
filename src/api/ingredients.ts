import type { Category, Ingredient } from '../types'
import { apiFetch } from './client'
import { guessFoodEmoji } from './foodEmoji'

const DEFAULT_EMOJI = '🍽️'

// imgUrl에는 이모지가 저장되지만, Swagger 등으로 만들어진 과거 테스트 데이터엔
// "string" 같은 임의 텍스트가 들어있을 수 있어 실제 이모지인지 검증 후 사용한다.
const ZWJ = String.fromCharCode(0x200d)
const EMOJI_PATTERN = new RegExp(`^\\p{Extended_Pictographic}(${ZWJ}\\p{Extended_Pictographic})*$`, 'u')

function isEmoji(value: string): boolean {
  return EMOJI_PATTERN.test(value)
}

interface IngredientListItemDto {
  ingredientId: number
  ingredientName: string
  imgUrl: string | null
  location: string
  ingredientDate: string | null
  amount: number
}

interface IngredientRecordDto extends IngredientListItemDto {
  ingredientEtc: string | null
}

function toIngredient(dto: IngredientListItemDto & Partial<Pick<IngredientRecordDto, 'ingredientEtc'>>): Ingredient {
  return {
    id: String(dto.ingredientId),
    name: dto.ingredientName,
    // BE는 emoji 컬럼이 없어 imgUrl 문자열 필드에 이모지를 그대로 저장/조회한다.
    // 과거 테스트 데이터처럼 이모지가 아닌 값이 들어있으면 재료 이름으로 그나마 어울리는 이모지를 추정한다.
    emoji: dto.imgUrl && isEmoji(dto.imgUrl) ? dto.imgUrl : guessFoodEmoji(dto.ingredientName, DEFAULT_EMOJI),
    category: dto.location as Category,
    quantity: dto.amount,
    expiryDate: dto.ingredientDate ?? '',
    memo: dto.ingredientEtc || undefined,
  }
}

export async function getIngredients(): Promise<Ingredient[]> {
  const list = await apiFetch<IngredientListItemDto[]>('/api/v1/ingredients')
  return list.map(toIngredient)
}

export async function createIngredient(input: Omit<Ingredient, 'id'>): Promise<Ingredient> {
  const created = await apiFetch<IngredientRecordDto>('/api/v1/ingredients/manual', {
    method: 'POST',
    body: JSON.stringify({
      ingredientName: input.name,
      ingredientDate: input.expiryDate,
      ingredientEtc: input.memo ?? null,
      imgUrl: input.emoji,
      amount: input.quantity,
      location: input.category,
    }),
  })
  return toIngredient(created)
}

export async function updateIngredient(id: string, input: Omit<Ingredient, 'id'>): Promise<Ingredient> {
  const updated = await apiFetch<IngredientRecordDto>(`/api/v1/ingredients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      ingredientName: input.name,
      ingredientDate: input.expiryDate,
      ingredientEtc: input.memo ?? null,
      imgUrl: input.emoji,
      amount: input.quantity,
      location: input.category,
    }),
  })
  return toIngredient(updated)
}

export async function deleteIngredient(id: string): Promise<void> {
  await apiFetch<void>(`/api/v1/ingredients/${id}`, { method: 'DELETE' })
}
