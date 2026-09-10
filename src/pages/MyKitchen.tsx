import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { RecipeCard } from '../components/RecipeCard'
import { RecipeDetailModal } from '../components/RecipeDetailModal'
import { LoginGate } from '../components/LoginGate'
import type { Recipe } from '../types'

export function MyKitchen() {
  const {
    ingredients,
    recipes,
    selectedIngredientIds,
    toggleFavorite,
    isAuthenticated,
    login,
    generateRecipes,
    recipeJob,
  } = useApp()
  const [openRecipe, setOpenRecipe] = useState<Recipe | null>(null)

  const selectedIngredients = ingredients.filter((i) => selectedIngredientIds.includes(i.id))
  const isGenerating = recipeJob !== null && recipeJob.status !== 'FAILED'

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
          <>
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
            {isAuthenticated && (
              <button
                onClick={() => generateRecipes()}
                disabled={isGenerating}
                className="mt-3 w-full rounded-xl bg-brand-orange py-2.5 text-sm font-extrabold text-white disabled:opacity-60"
              >
                {isGenerating
                  ? `✨ AI 레시피 생성 중... ${recipeJob?.progress ?? 0}%`
                  : '✨ AI 레시피 생성하기'}
              </button>
            )}
            {recipeJob?.status === 'FAILED' && (
              <p className="mt-2 text-center text-xs font-semibold text-badge-red">
                레시피 생성에 실패했어요. 다시 시도해주세요.
              </p>
            )}
          </>
        )}
      </div>

      {!isAuthenticated ? (
        <LoginGate onLogin={login} message="레시피를 보려면 카카오 로그인이 필요해요" />
      ) : (
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
      )}

      {openRecipe && <RecipeDetailModal recipe={openRecipe} onClose={() => setOpenRecipe(null)} />}
    </div>
  )
}
