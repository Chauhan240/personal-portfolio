import axios from 'axios'

// The session lives in an HttpOnly cookie set by the API, so no token ever touches JavaScript.
// The custom header is required by the API on every state-changing request (CSRF defence).
export const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'X-Requested-With': 'portfolio-admin' },
  timeout: 15000,
})
