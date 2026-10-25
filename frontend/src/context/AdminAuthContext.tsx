import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { apiClient } from '../api/client'
import { fetchSession, login as loginRequest, logout as logoutRequest, type Session } from '../api/auth'

interface AdminAuthContextValue {
  /** True until the first session check finishes, so protected routes don't flash a redirect. */
  loading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [checked, setChecked] = useState(false)
  const onAdminRoute = useLocation().pathname.startsWith('/admin')
  // Public visitors never hit the auth endpoint; the session is only checked once an admin route is opened.
  const loading = onAdminRoute && !checked

  useEffect(() => {
    if (!onAdminRoute || checked) return
    let cancelled = false
    fetchSession().then((s) => {
      if (cancelled) return
      setSession(s)
      setChecked(true)
    })
    return () => {
      cancelled = true
    }
  }, [onAdminRoute, checked])

  // An expired or revoked session on any admin call signs the UI out.
  useEffect(() => {
    const id = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401 && !String(error.config?.url).includes('/admin/login')) {
          setSession(null)
        }
        return Promise.reject(error)
      },
    )
    return () => apiClient.interceptors.response.eject(id)
  }, [])

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      loading,
      isAuthenticated: session !== null,
      async login(username: string, password: string) {
        setSession(await loginRequest(username, password))
        setChecked(true)
      },
      async logout() {
        try {
          await logoutRequest()
        } finally {
          setSession(null)
        }
      },
    }),
    [loading, session],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
