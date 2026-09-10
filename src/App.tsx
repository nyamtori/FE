import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { BottomNav } from './components/BottomNav'
import { MyKitchen } from './pages/MyKitchen'
import { MyFridge } from './pages/MyFridge'
import { MyRecipe } from './pages/MyRecipe'
import { OAuthCallback } from './pages/OAuthCallback'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Routes>
            <Route path="/" element={<Navigate to="/fridge" replace />} />
            <Route path="/kitchen" element={<MyKitchen />} />
            <Route path="/fridge" element={<MyFridge />} />
            <Route path="/recipes" element={<MyRecipe />} />
            <Route path="/oauth/callback" element={<OAuthCallback />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
