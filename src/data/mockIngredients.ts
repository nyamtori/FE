import type { Ingredient } from '../types'

function daysFromNow(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export const initialIngredients: Ingredient[] = [
  { id: 'ing-1', name: '계란', emoji: '🥚', category: '냉장', quantity: 6, expiryDate: daysFromNow(2) },
  { id: 'ing-2', name: '당근', emoji: '🥕', category: '냉장', quantity: 2, expiryDate: daysFromNow(10) },
  { id: 'ing-3', name: '양파', emoji: '🧅', category: '실온', quantity: 3, expiryDate: daysFromNow(20) },
  { id: 'ing-4', name: '소고기', emoji: '🥩', category: '냉동', quantity: 1, expiryDate: daysFromNow(30) },
  { id: 'ing-5', name: '감자', emoji: '🥔', category: '실온', quantity: 4, expiryDate: daysFromNow(15) },
  { id: 'ing-6', name: '마늘', emoji: '🧄', category: '냉장', quantity: 1, expiryDate: daysFromNow(25) },
]
