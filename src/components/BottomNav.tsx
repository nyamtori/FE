import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/kitchen', label: '마이 키친', icon: '🍳' },
  { to: '/fridge', label: '마이 냉장고', icon: '🧊' },
  { to: '/recipes', label: '마이 레시피', icon: '❤️' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 w-full max-w-[428px] -translate-x-1/2 border-t border-black/5 bg-white px-3 py-2">
      <ul className="flex items-center justify-between">
        {TABS.map((tab) => (
          <li key={tab.to} className="flex-1">
            <NavLink
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-2xl py-2 text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-brand-orange text-white'
                    : 'text-brand-brown/60'
                }`
              }
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
