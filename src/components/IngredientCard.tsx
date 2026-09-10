import type { Ingredient } from '../types'

interface IngredientCardProps {
  ingredient: Ingredient
  selected: boolean
  onToggleSelect: (id: string) => void
  onRequestEdit: (ingredient: Ingredient) => void
  onRequestDelete: (id: string) => void
}

function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export function IngredientCard({
  ingredient,
  selected,
  onToggleSelect,
  onRequestEdit,
  onRequestDelete,
}: IngredientCardProps) {
  const remaining = daysUntil(ingredient.expiryDate)
  const isUrgent = remaining <= 3

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onToggleSelect(ingredient.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onToggleSelect(ingredient.id)
      }}
      className={`relative flex cursor-pointer flex-col items-center rounded-2xl border-2 bg-white p-4 text-center transition-colors ${
        selected ? 'border-brand-orangeDark' : 'border-transparent'
      }`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onRequestEdit(ingredient)
        }}
        aria-label={`${ingredient.name} 수정`}
        className="absolute right-9 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-brown/10 text-brand-brown"
      >
        ✏️
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onRequestDelete(ingredient.id)
        }}
        aria-label={`${ingredient.name} 삭제`}
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-badge-red/15 text-badge-red"
      >
        🗑
      </button>

      {isUrgent && (
        <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-badge-red px-2 py-0.5 text-[10px] font-bold text-white">
          <span>📅</span>
          {formatDate(ingredient.expiryDate)}
        </span>
      )}

      <span className="mt-6 text-4xl">{ingredient.emoji}</span>
      <span className="mt-2 font-bold text-brand-brown">{ingredient.name}</span>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-1">
        <span className="rounded-full bg-badge-green px-2 py-0.5 text-[11px] font-semibold text-brand-brown">
          {ingredient.category}
        </span>
      </div>
      <span className="mt-1 text-sm font-bold text-brand-brown/70">{ingredient.quantity}개</span>
    </div>
  )
}
