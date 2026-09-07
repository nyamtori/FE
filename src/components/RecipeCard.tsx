import type { Ingredient, Recipe } from '../types'

interface RecipeCardProps {
  recipe: Recipe
  ownedIngredients: Ingredient[]
  onOpen: (recipe: Recipe) => void
  onToggleFavorite: (id: string) => void
}

const VISIBLE_TAGS = 3

export function RecipeCard({ recipe, ownedIngredients, onOpen, onToggleFavorite }: RecipeCardProps) {
  const ownedNames = new Set(ownedIngredients.map((i) => i.name))
  const ownedForRecipe = recipe.requiredIngredients
    .filter((req) => ownedNames.has(req.name))
    .map((req) => req.name)

  const visibleTags = recipe.requiredIngredients.slice(0, VISIBLE_TAGS)
  const extraCount = recipe.requiredIngredients.length - VISIBLE_TAGS

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(recipe)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpen(recipe)
      }}
      className="w-full cursor-pointer rounded-2xl bg-white p-4 text-left shadow-sm"
    >
      <div className="flex gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-olive-light text-3xl">
          {recipe.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-brand-brown">{recipe.name}</h3>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite(recipe.id)
              }}
              aria-label="찜하기"
              className={recipe.isFavorite ? 'text-badge-red' : 'text-brand-brown/30'}
            >
              ♥
            </button>
          </div>
          <p className="mt-1 truncate text-xs text-brand-brown/60">
            보유한 재료: {ownedForRecipe.length > 0 ? ownedForRecipe.join(', ') : '없음'}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className="text-brand-brown/60">⏱ {recipe.cookTimeMinutes}분</span>
            <span className="rounded-full bg-brand-orange px-2 py-0.5 font-bold text-white">
              {recipe.difficulty}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {visibleTags.map((tag) => (
          <span
            key={tag.name}
            className="rounded-full bg-olive-light px-2 py-1 text-[11px] font-semibold text-brand-brown"
          >
            {tag.name} {tag.amount}
          </span>
        ))}
        {extraCount > 0 && (
          <span className="rounded-full bg-olive-light px-2 py-1 text-[11px] font-semibold text-brand-brown">
            +{extraCount}
          </span>
        )}
      </div>
    </div>
  )
}
