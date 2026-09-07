import { Modal } from './Modal'
import { useApp } from '../context/AppContext'
import type { Recipe } from '../types'

interface RecipeDetailModalProps {
  recipe: Recipe
  onClose: () => void
}

export function RecipeDetailModal({ recipe, onClose }: RecipeDetailModalProps) {
  const { toggleFavorite } = useApp()

  return (
    <Modal
      onClose={onClose}
      headerAccessory={
        <div className="flex flex-col items-center bg-olive-light px-5 pb-6 pt-2">
          <button
            onClick={() => toggleFavorite(recipe.id)}
            className={`self-start text-2xl ${recipe.isFavorite ? 'text-badge-red' : 'text-brand-brown/30'}`}
            aria-label="찜하기"
          >
            ♥
          </button>
          <span className="text-6xl">{recipe.emoji}</span>
          <h2 className="mt-3 text-xl font-extrabold text-brand-brown">{recipe.name}</h2>
          <div className="mt-2 flex gap-2 text-sm">
            <span className="rounded-full bg-white px-3 py-1 font-bold text-brand-brown">
              ⏱ {recipe.cookTimeMinutes}분
            </span>
            <span className="rounded-full bg-brand-orange px-3 py-1 font-bold text-white">
              {recipe.difficulty}
            </span>
          </div>
        </div>
      }
    >
      <div className="mt-4">
        <h3 className="mb-2 font-bold text-brand-brown">🧺 필요한 재료</h3>
        <ul className="rounded-2xl bg-white p-4">
          {recipe.requiredIngredients.map((item) => (
            <li key={item.name} className="flex items-center gap-2 py-1 text-sm text-brand-brown">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-brown/50" />
              {item.name} {item.amount}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="mb-2 font-bold text-brand-brown">📝 조리 과정</h3>
        <ol className="flex flex-col gap-3">
          {recipe.steps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 rounded-2xl bg-white p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange text-xs font-bold text-white">
                {idx + 1}
              </span>
              <span className="text-sm text-brand-brown">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </Modal>
  )
}
