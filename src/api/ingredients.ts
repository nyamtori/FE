import type { Ingredient } from '../types'
import { initialIngredients } from '../data/mockIngredients'
import { delay, readStorage, writeStorage } from './storage'

const STORAGE_KEY = 'nyamtori:ingredients'

/**
 * Mock implementation of the future `GET /api/ingredients` etc. endpoints.
 * Every function here keeps the same name/shape it would have once a real
 * backend exists, so only the function bodies need to change later.
 */

function load(): Ingredient[] {
  return readStorage(STORAGE_KEY, initialIngredients)
}

function save(items: Ingredient[]): void {
  writeStorage(STORAGE_KEY, items)
}

export async function getIngredients(): Promise<Ingredient[]> {
  await delay()
  return load()
}

export async function createIngredient(
  input: Omit<Ingredient, 'id'>
): Promise<Ingredient> {
  await delay()
  const items = load()
  const created: Ingredient = { ...input, id: `ing-${Date.now()}` }
  save([created, ...items])
  return created
}

export async function deleteIngredient(id: string): Promise<void> {
  await delay()
  const items = load().filter((item) => item.id !== id)
  save(items)
}
