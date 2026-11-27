import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getCurrentUser,
  loginUser,
  type LoginCredentials,
  type PublicUser,
} from '../services/auth.service'

type AuthContextValue = {
  token: string | null
  user: PublicUser | null
  signIn: (credentials: LoginCredentials) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<PublicUser | null>(null)

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    const loginResponse = await loginUser(credentials)

    try {
      const currentUser = await getCurrentUser(loginResponse.token)
      setToken(loginResponse.token)
      setUser(currentUser.user)
    } catch (error) {
      setToken(null)
      setUser(null)
      throw error
    }
  }, [])

  const signOut = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ token, user, signIn, signOut }),
    [token, user, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de AuthProvider.')
  }

  return context
}
