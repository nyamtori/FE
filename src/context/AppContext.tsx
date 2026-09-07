import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Ingredient, Recipe } from '../types'
import { createIngredient, deleteIngredient, getIngredients } from '../api/ingredients'
import { getRecipes, toggleFavoriteRecipe } from '../api/recipes'

interface AppContextValue {
  ingredients: Ingredient[]
  recipes: Recipe[]
  loading: boolean
  selectedIngredientIds: string[]
  toggleSelectIngredient: (id: string) => void
  clearSelection: () => void
  addIngredient: (input: Omit<Ingredient, 'id'>) => Promise<void>
  removeIngredient: (id: string) => Promise<void>
  toggleFavorite: (id: string) => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([])

  useEffect(() => {
    Promise.all([getIngredients(), getRecipes()]).then(([ings, recs]) => {
      setIngredients(ings)
      setRecipes(recs)
      setLoading(false)
    })
  }, [])

  const toggleSelectIngredient = useCallback((id: string) => {
    setSelectedIngredientIds((prev) =>
      prev.includes(id) ? prev.filter((existing) => existing !== id) : [...prev, id]
    )
  }, [])

  const clearSelection = useCallback(() => setSelectedIngredientIds([]), [])

  const addIngredient = useCallback(async (input: Omit<Ingredient, 'id'>) => {
    const created = await createIngredient(input)
    setIngredients((prev) => [created, ...prev])
  }, [])

  const removeIngredient = useCallback(async (id: string) => {
    await deleteIngredient(id)
    setIngredients((prev) => prev.filter((item) => item.id !== id))
    setSelectedIngredientIds((prev) => prev.filter((existing) => existing !== id))
  }, [])

  const toggleFavorite = useCallback(async (id: string) => {
    const updated = await toggleFavoriteRecipe(id)
    setRecipes(updated)
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      ingredients,
      recipes,
      loading,
      selectedIngredientIds,
      toggleSelectIngredient,
      clearSelection,
      addIngredient,
      removeIngredient,
      toggleFavorite,
    }),
    [
      ingredients,
      recipes,
      loading,
      selectedIngredientIds,
      toggleSelectIngredient,
      clearSelection,
      addIngredient,
      removeIngredient,
      toggleFavorite,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
