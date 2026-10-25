import { apiClient } from './client'

export interface Session {
  username: string
}

export async function login(username: string, password: string): Promise<Session> {
  const { data } = await apiClient.post<Session>('/admin/login', { username, password })
  return data
}

export async function logout(): Promise<void> {
  await apiClient.post('/admin/logout')
}

/** Resolves to the current session, or null when signed out. */
export async function fetchSession(): Promise<Session | null> {
  try {
    const { data } = await apiClient.get<Session>('/admin/me')
    return data
  } catch {
    return null
  }
}
