import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { loginUser } from '../services/api'
import styles from './AuthPages.module.css'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const result = await loginUser(formData)
      login(result.token, result.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to log in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <p className={styles.kicker}>Welcome back</p>
        <h1 className={styles.title}>Log in to your expense dashboard</h1>
        <p className={styles.subtitle}>Continue where you left off and review your spending by category.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Your password" />
          </label>

          {error ? <p className={styles.error}>{error}</p> : null}

          <button className={styles.button} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className={styles.footerText}>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  )
}
