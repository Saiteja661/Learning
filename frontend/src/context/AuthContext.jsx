import React, { createContext, useEffect, useState } from 'react'
import { setAuthToken } from '../services/api'

export const AuthContext = createContext()

function readStoredAuth() {
  const token = localStorage.getItem('expense-token')
  const userJson = localStorage.getItem('expense-user')

  return {
    token,
    user: userJson ? JSON.parse(userJson) : null,
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => readStoredAuth())

  useEffect(() => {
    setAuthToken(auth.token)
  }, [auth.token])

  function login(token, user) {
    const nextAuth = { token, user }
    setAuth(nextAuth)
    localStorage.setItem('expense-token', token)
    localStorage.setItem('expense-user', JSON.stringify(user))
  }

  function logout() {
    setAuth({ token: null, user: null })
    localStorage.removeItem('expense-token')
    localStorage.removeItem('expense-user')
    setAuthToken(null)
  }

  return (
    <AuthContext.Provider value={{ token: auth.token, user: auth.user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
