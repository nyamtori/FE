export type Category = '냉장' | '냉동' | '실온'
export type Difficulty = '쉬워요' | '보통' | '어려워요'

export interface Ingredient {
  id: string
  name: string
  emoji: string
  category: Category
  quantity: number
  expiryDate: string // ISO date string YYYY-MM-DD
  memo?: string
}

export interface RecipeIngredient {
  name: string
  amount: string
}

export interface Recipe {
  id: string
  name: string
  emoji: string
  cookTimeMinutes: number
  difficulty: Difficulty
  requiredIngredients: RecipeIngredient[]
  steps: string[]
  isFavorite: boolean
}

export interface ProductLookupResult {
  name: string
  emoji: string
}
