import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  fetchCurrentUser,
  loginRequest,
  logoutRequest,
  registerRequest,
} from '../lib/api/auth.api'
import { useApi } from '../lib/api/client'

interface User {
  id?: string
  name: string
  email: string
}

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'memoroute_auth'
const TOKEN_KEY = 'memoroute_token'
const REFRESH_KEY = 'memoroute_refresh_token'

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function persistSession(user: User, token: string, refreshToken: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(REFRESH_KEY, refreshToken)
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => (useApi ? null : loadUser()))
  const [isLoading, setIsLoading] = useState(useApi)

  useEffect(() => {
    if (!useApi) return

    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setIsLoading(false)
      return
    }

    fetchCurrentUser()
      .then((current) => {
        setUser({ id: current.id, name: current.name, email: current.email })
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ id: current.id, name: current.name, email: current.email }),
        )
      })
      .catch(() => {
        clearSession()
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) return { ok: false as const, error: 'Email and password are required.' }

    if (!useApi) {
      const nextUser = {
        name: email.split('@')[0] || 'Learner',
        email: email.trim(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
      setUser(nextUser)
      return { ok: true as const }
    }

    try {
      const response = await loginRequest(email.trim(), password)
      persistSession(
        { id: response.user.id, name: response.user.name, email: response.user.email },
        response.token,
        response.refreshToken,
      )
      setUser({ id: response.user.id, name: response.user.name, email: response.user.email })
      return { ok: true as const }
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : 'Invalid email or password.'
      return { ok: false as const, error: message }
    }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return { ok: false as const, error: 'Name, email, and password are required.' }
    }

    if (!useApi) {
      const result = await login(email, password)
      return result.ok ? { ok: true as const } : result
    }

    try {
      const response = await registerRequest(name.trim(), email.trim(), password)
      persistSession(
        { id: response.user.id, name: response.user.name, email: response.user.email },
        response.token,
        response.refreshToken,
      )
      setUser({ id: response.user.id, name: response.user.name, email: response.user.email })
      return { ok: true as const }
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Could not create account. Email may already be registered.'
      return { ok: false as const, error: message }
    }
  }, [login])

  const logout = useCallback(async () => {
    if (useApi) {
      const refreshToken = localStorage.getItem(REFRESH_KEY)
      if (refreshToken) {
        await logoutRequest(refreshToken).catch(() => {})
      }
    }
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
