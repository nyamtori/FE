import { apiFetch } from './client'

export interface LikeDto {
  likeId: number
  recipeId: number
  recipeFood: string
  cookTime: number
  likedAt: string
}

export function getLikes(): Promise<LikeDto[]> {
  return apiFetch<LikeDto[]>('/api/v1/myrecipe/likes')
}

export function createLike(recipeId: string): Promise<LikeDto> {
  return apiFetch<LikeDto>('/api/v1/myrecipe/likes', {
    method: 'POST',
    body: JSON.stringify({ recipe: Number(recipeId) }),
  })
}

export function deleteLike(likeId: number): Promise<void> {
  return apiFetch<void>(`/api/v1/myrecipe/likes/${likeId}`, { method: 'DELETE' })
}
