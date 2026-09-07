import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { RecipeCard } from '../components/RecipeCard'
import { RecipeDetailModal } from '../components/RecipeDetailModal'
import type { Recipe } from '../types'

export function MyRecipe() {
  const { ingredients, recipes, toggleFavorite } = useApp()
  const [query, setQuery] = useState('')
  const [openRecipe, setOpenRecipe] = useState<Recipe | null>(null)

  const favorites = useMemo(
    () =>
      recipes.filter(
        (recipe) => recipe.isFavorite && recipe.name.toLowerCase().includes(query.toLowerCase())
      ),
    [recipes, query]
  )

  return (
    <div className="px-5 pb-28 pt-6">
      <h1 className="text-2xl font-extrabold text-brand-brown">마이 레시피</h1>
      <p className="mb-4 text-sm text-brand-brown/60">찜한 레시피 {recipes.filter((r) => r.isFavorite).length}개</p>

      <div className="mb-4 flex items-center gap-2 rounded-full bg-white px-4 py-3">
        <span>🔍</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="레시피 검색"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="flex flex-col gap-3">
        {favorites.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            ownedIngredients={ingredients}
            onOpen={setOpenRecipe}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {favorites.length === 0 && (
        <p className="mt-10 text-center text-sm text-brand-brown/50">찜한 레시피가 없어요.</p>
      )}

      {openRecipe && <RecipeDetailModal recipe={openRecipe} onClose={() => setOpenRecipe(null)} />}
    </div>
  )
}
