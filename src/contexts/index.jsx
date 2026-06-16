import { createContext, useContext, useReducer } from 'react'

// ── CART ─────────────────────────────────────────────────────────────────────
const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const key = `${action.item.id}-${action.item.size}-${action.item.color}`
      const existing = state.items.find(i => i.key === key)
      if (existing) {
        return { ...state, items: state.items.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i) }
      }
      return { ...state, items: [...state.items, { ...action.item, key, qty: 1 }] }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.key !== action.key) }
    case 'UPDATE_QTY':
      return { ...state, items: state.items.map(i => i.key === action.key ? { ...i, qty: Math.max(1, action.qty) } : i) }
    case 'CLEAR':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })
  const total = state.items.reduce((s, i) => s + i.price * i.qty, 0)
  const count = state.items.reduce((s, i) => s + i.qty, 0)
  return (
    <CartContext.Provider value={{ items: state.items, total, count, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

// ── AUTH ──────────────────────────────────────────────────────────────────────
const AuthContext = createContext(null)

function loadUser() {
  try { return JSON.parse(localStorage.getItem('Kèskonfè_user')) } catch { return null }
}

function userReducer(_, u) {
  if (u) localStorage.setItem('Kèskonfè_user', JSON.stringify(u))
  else localStorage.removeItem('Kèskonfè_user')
  return u
}

export function AuthProvider({ children }) {
  const [user, setUser] = useReducer(userReducer, null, loadUser)

  const login = (email, password) => {
    if (email && password.length >= 6) {
      const raw = email.split('@')[0]
      const firstName = raw.charAt(0).toUpperCase() + raw.slice(1)
      setUser({ id: 1, email, firstName, lastName: 'Martin', role: 'ADMIN' })
      return true
    }
    return false
  }

  const register = (data) => {
    setUser({ id: 1, email: data.email, firstName: data.firstName, lastName: data.lastName, role: 'ADMIN' })
    return true
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
