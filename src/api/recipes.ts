import type { Recipe } from '../types'
import { initialRecipes } from '../data/mockRecipes'
import { delay, readStorage, writeStorage } from './storage'

const STORAGE_KEY = 'nyamtori:recipes'

function load(): Recipe[] {
  return readStorage(STORAGE_KEY, initialRecipes)
}

function save(items: Recipe[]): void {
  writeStorage(STORAGE_KEY, items)
}

export async function getRecipes(): Promise<Recipe[]> {
  await delay()
  return load()
}

export async function toggleFavoriteRecipe(id: string): Promise<Recipe[]> {
  await delay(100)
  const items = load().map((recipe) =>
    recipe.id === id ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
  )
  save(items)
  return items
}
