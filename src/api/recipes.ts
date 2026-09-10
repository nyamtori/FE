import type { Difficulty, Recipe, RecipeIngredient } from '../types'
import { apiFetch } from './client'
import { createLike, deleteLike, getLikes } from './likes'
import { guessFoodEmoji } from './foodEmoji'

const DEFAULT_RECIPE_EMOJI = '🍳'

export interface RecipeJobStatus {
  jobId: string
  status: 'PENDING' | 'RUNNING' | 'COMPLETE' | 'FAILED'
  progress: number
  message?: string
}

interface RecipeInfoDto {
  recipeId: number
  title: string
  cookTime: number
  liked: boolean
}

interface RecipeIngredientDto {
  ingredientId: number
  name: string
  amount: string
}

interface RecipeDetailDto {
  recipeId: number
  title: string
  cookTime: number
  ingredients: RecipeIngredientDto[]
  steps: string[]
  liked: boolean
}

/** BE 응답엔 난이도가 없어 조리 시간으로 근사한다. */
function deriveDifficulty(cookTime: number): Difficulty {
  if (cookTime <= 15) return '쉬워요'
  if (cookTime <= 40) return '보통'
  return '어려워요'
}

function toRecipeIngredient(dto: RecipeIngredientDto): RecipeIngredient {
  return { name: dto.name, amount: dto.amount }
}

function toSummaryRecipe(dto: RecipeInfoDto): Recipe {
  return {
    id: String(dto.recipeId),
    name: dto.title,
    emoji: guessFoodEmoji(dto.title, DEFAULT_RECIPE_EMOJI),
    cookTimeMinutes: dto.cookTime,
    difficulty: deriveDifficulty(dto.cookTime),
    requiredIngredients: [],
    steps: [],
    isFavorite: dto.liked,
  }
}

function toDetailRecipe(dto: RecipeDetailDto): Recipe {
  return {
    id: String(dto.recipeId),
    name: dto.title,
    emoji: guessFoodEmoji(dto.title, DEFAULT_RECIPE_EMOJI),
    cookTimeMinutes: dto.cookTime,
    difficulty: deriveDifficulty(dto.cookTime),
    requiredIngredients: dto.ingredients.map(toRecipeIngredient),
    steps: dto.steps,
    isFavorite: dto.liked,
  }
}

export async function getRecipeDetail(id: string): Promise<Recipe> {
  const dto = await apiFetch<RecipeDetailDto>(`/api/v1/mykitchen/recipes/${id}`)
  return toDetailRecipe(dto)
}

/** 목록 API는 재료/조리과정을 안 주므로, 카드에 필요한 정보를 위해 각 레시피 상세를 함께 가져온다. */
export async function getRecipes(): Promise<Recipe[]> {
  const res = await apiFetch<{ data: RecipeInfoDto[] }>('/api/v1/mykitchen/recipes')
  return Promise.all(
    res.data.map((info) => getRecipeDetail(String(info.recipeId)).catch(() => toSummaryRecipe(info)))
  )
}

export async function generateRecipe(ingredientIds: string[], cookTime?: number): Promise<string> {
  const res = await apiFetch<{ jobId: string }>('/api/v1/mykitchen/recipes', {
    method: 'POST',
    body: JSON.stringify({ ingredientIds: ingredientIds.map(Number), cookTime: cookTime ?? null }),
  })
  return res.jobId
}

export async function getRecipeJobStatus(jobId: string): Promise<RecipeJobStatus> {
  const res = await apiFetch<{
    data: { jobId: number; status: RecipeJobStatus['status']; progress: number; message: string }
  }>(`/api/v1/mykitchen/recipe-jobs/${jobId}/status`)
  return {
    jobId: String(res.data.jobId),
    status: res.data.status,
    progress: res.data.progress,
    message: res.data.message,
  }
}

/** 레시피는 BE에서 Like(찜) 리소스로 관리되어, 해제 시엔 먼저 찜 목록에서 likeId를 찾아야 한다. */
export async function toggleFavoriteRecipe(recipe: Recipe): Promise<boolean> {
  if (recipe.isFavorite) {
    const likes = await getLikes()
    const match = likes.find((like) => String(like.recipeId) === recipe.id)
    if (match) await deleteLike(match.likeId)
    return false
  }
  await createLike(recipe.id)
  return true
}
