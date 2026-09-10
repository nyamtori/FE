import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Ingredient, Recipe } from '../types'
import { createIngredient, deleteIngredient, getIngredients, updateIngredient } from '../api/ingredients'
import { generateRecipe, getRecipeJobStatus, getRecipes, toggleFavoriteRecipe } from '../api/recipes'
import type { RecipeJobStatus } from '../api/recipes'
import { getKakaoLoginUrl } from '../api/auth'
import { clearTokens, hasSession } from '../api/tokens'
import { ApiError } from '../api/client'

interface AppContextValue {
  ingredients: Ingredient[]
  recipes: Recipe[]
  loading: boolean
  isAuthenticated: boolean
  login: () => void
  logout: () => void
  selectedIngredientIds: string[]
  toggleSelectIngredient: (id: string) => void
  clearSelection: () => void
  addIngredient: (input: Omit<Ingredient, 'id'>) => Promise<void>
  editIngredient: (id: string, input: Omit<Ingredient, 'id'>) => Promise<void>
  removeIngredient: (id: string) => Promise<void>
  toggleFavorite: (id: string) => Promise<void>
  recipeJob: RecipeJobStatus | null
  generateRecipes: (cookTime?: number) => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(() => hasSession())
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([])
  const [recipeJob, setRecipeJob] = useState<RecipeJobStatus | null>(null)
  const pollTimeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      const ingredientsPromise = getIngredients().catch(() => [])
      const recipesPromise = isAuthenticated
        ? getRecipes().catch((err) => {
            if (err instanceof ApiError && err.status === 401) {
              clearTokens()
              if (!cancelled) setIsAuthenticated(false)
            }
            return [] as Recipe[]
          })
        : Promise.resolve<Recipe[]>([])

      const [ings, recs] = await Promise.all([ingredientsPromise, recipesPromise])
      if (cancelled) return
      setIngredients(ings)
      setRecipes(recs)
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated])

  useEffect(() => {
    return () => {
      if (pollTimeoutRef.current) window.clearTimeout(pollTimeoutRef.current)
    }
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

  const editIngredient = useCallback(async (id: string, input: Omit<Ingredient, 'id'>) => {
    const updated = await updateIngredient(id, input)
    setIngredients((prev) => prev.map((item) => (item.id === id ? updated : item)))
  }, [])

  const removeIngredient = useCallback(async (id: string) => {
    await deleteIngredient(id)
    setIngredients((prev) => prev.filter((item) => item.id !== id))
    setSelectedIngredientIds((prev) => prev.filter((existing) => existing !== id))
  }, [])

  const toggleFavorite = useCallback(
    async (id: string) => {
      const target = recipes.find((recipe) => recipe.id === id)
      if (!target) return
      const nowFavorite = await toggleFavoriteRecipe(target)
      setRecipes((prev) =>
        prev.map((recipe) => (recipe.id === id ? { ...recipe, isFavorite: nowFavorite } : recipe))
      )
    },
    [recipes]
  )

  const generateRecipes = useCallback(
    async (cookTime?: number) => {
      if (selectedIngredientIds.length === 0) return
      const jobId = await generateRecipe(selectedIngredientIds, cookTime)
      setRecipeJob({ jobId, status: 'PENDING', progress: 0 })

      const poll = async () => {
        try {
          const status = await getRecipeJobStatus(jobId)
          setRecipeJob(status)
          if (status.status === 'COMPLETE') {
            const recs = await getRecipes()
            setRecipes(recs)
            setRecipeJob(null)
          } else if (status.status !== 'FAILED') {
            pollTimeoutRef.current = window.setTimeout(poll, 1500)
          }
        } catch {
          setRecipeJob({ jobId, status: 'FAILED', progress: 0, message: '상태를 확인하지 못했어요.' })
        }
      }
      poll()
    },
    [selectedIngredientIds]
  )

  const login = useCallback(() => {
    window.location.href = getKakaoLoginUrl()
  }, [])

  const logout = useCallback(() => {
    clearTokens()
    setIsAuthenticated(false)
    setRecipes([])
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      ingredients,
      recipes,
      loading,
      isAuthenticated,
      login,
      logout,
      selectedIngredientIds,
      toggleSelectIngredient,
      clearSelection,
      addIngredient,
      editIngredient,
      removeIngredient,
      toggleFavorite,
      recipeJob,
      generateRecipes,
    }),
    [
      ingredients,
      recipes,
      loading,
      isAuthenticated,
      login,
      logout,
      selectedIngredientIds,
      toggleSelectIngredient,
      clearSelection,
      addIngredient,
      editIngredient,
      removeIngredient,
      toggleFavorite,
      recipeJob,
      generateRecipes,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
