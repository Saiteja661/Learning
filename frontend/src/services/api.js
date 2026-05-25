import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  delete api.defaults.headers.common.Authorization
}

export async function loginUser(payload) {
  const { data } = await api.post('/auth/login', payload)
  return data
}

export async function registerUser(payload) {
  const { data } = await api.post('/auth/register', payload)
  return data
}

export async function fetchExpenses(month) {
  const params = month ? { month } : undefined
  const { data } = await api.get('/expenses', { params })
  return data
}

export async function createExpense(payload) {
  const { data } = await api.post('/expenses', payload)
  return data
}

export async function updateExpense(id, payload) {
  const { data } = await api.put(`/expenses/${id}`, payload)
  return data
}

export async function deleteExpense(id) {
  const { data } = await api.delete(`/expenses/${id}`)
  return data
}

export async function fetchSummary() {
  const { data } = await api.get('/expenses/summary')
  return data
}

export default api
