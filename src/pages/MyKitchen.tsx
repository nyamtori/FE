import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { RecipeCard } from '../components/RecipeCard'
import { RecipeDetailModal } from '../components/RecipeDetailModal'
import type { Recipe } from '../types'

export function MyKitchen() {
  const { ingredients, recipes, selectedIngredientIds, toggleFavorite } = useApp()
  const [openRecipe, setOpenRecipe] = useState<Recipe | null>(null)

  const selectedIngredients = ingredients.filter((i) => selectedIngredientIds.includes(i.id))

  const sortedRecipes = useMemo(() => {
    const selectedNames = new Set(selectedIngredients.map((i) => i.name))
    return [...recipes].sort((a, b) => {
      const scoreOf = (r: Recipe) => r.requiredIngredients.filter((req) => selectedNames.has(req.name)).length
      return scoreOf(b) - scoreOf(a)
    })
  }, [recipes, selectedIngredients])

  return (
    <div className="px-5 pb-28 pt-6">
      <h1 className="mb-4 text-2xl font-extrabold text-brand-brown">마이 키친</h1>

      <div className="mb-4 rounded-2xl bg-white p-4">
        <h2 className="mb-3 flex items-center gap-1 font-bold text-brand-brown">✨ 선택한 재료</h2>
        {selectedIngredients.length === 0 ? (
          <div className="flex flex-col items-center gap-1 py-4 text-center">
            <span className="text-2xl">🐿️</span>
            <p className="font-bold text-brand-brown/70">선택한 재료가 없어요</p>
            <p className="text-xs text-brand-brown/50">마이 냉장고에서 재료를 선택해주세요!</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.map((ingredient) => (
              <span
                key={ingredient.id}
                className="rounded-full bg-brand-orange px-3 py-1.5 text-sm font-bold text-white"
              >
                {ingredient.emoji} {ingredient.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {sortedRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            ownedIngredients={ingredients}
            onOpen={setOpenRecipe}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {openRecipe && <RecipeDetailModal recipe={openRecipe} onClose={() => setOpenRecipe(null)} />}
    </div>
  )
}
