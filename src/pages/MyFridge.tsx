import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { IngredientCard } from '../components/IngredientCard'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { RegisterIngredientModal } from '../components/RegisterIngredientModal'
import type { Ingredient } from '../types'

export function MyFridge() {
  const { ingredients, selectedIngredientIds, toggleSelectIngredient, clearSelection, removeIngredient } =
    useApp()
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [showRegister, setShowRegister] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null)
  const navigate = useNavigate()

  const pendingDeleteName = ingredients.find((i) => i.id === pendingDeleteId)?.name

  return (
    <div className="px-5 pb-28 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-brand-brown">마이 냉장고</h1>
        <button
          onClick={() => setShowRegister(true)}
          className="rounded-full bg-brand-brown px-4 py-2 text-sm font-bold text-white"
        >
          재료 등록하기
        </button>
      </div>

      {selectedIngredientIds.length > 0 && (
        <div className="mb-4 flex items-center justify-between rounded-2xl bg-white px-4 py-3">
          <span className="font-bold text-brand-brown">✨ {selectedIngredientIds.length}개 선택됨</span>
          <button
            onClick={() => navigate('/kitchen')}
            className="rounded-full bg-badge-green px-4 py-2 text-sm font-bold text-brand-brown"
          >
            레시피 만들기
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {ingredients.map((ingredient) => (
          <IngredientCard
            key={ingredient.id}
            ingredient={ingredient}
            selected={selectedIngredientIds.includes(ingredient.id)}
            onToggleSelect={toggleSelectIngredient}
            onRequestEdit={setEditingIngredient}
            onRequestDelete={setPendingDeleteId}
          />
        ))}
      </div>

      {ingredients.length === 0 && (
        <p className="mt-10 text-center text-sm text-brand-brown/50">
          등록된 재료가 없어요. 재료를 등록해보세요!
        </p>
      )}

      {pendingDeleteId && pendingDeleteName && (
        <ConfirmDialog
          message={`'${pendingDeleteName}'을(를) 재료에서 삭제할까요?`}
          onConfirm={async () => {
            await removeIngredient(pendingDeleteId)
            setPendingDeleteId(null)
          }}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}

      {showRegister && <RegisterIngredientModal onClose={() => setShowRegister(false)} />}

      {editingIngredient && (
        <RegisterIngredientModal
          ingredient={editingIngredient}
          onClose={() => setEditingIngredient(null)}
        />
      )}

      {selectedIngredientIds.length > 0 && (
        <button
          onClick={clearSelection}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-brand-brown/80 px-4 py-1.5 text-xs font-bold text-white"
        >
          선택 해제
        </button>
      )}
    </div>
  )
}
