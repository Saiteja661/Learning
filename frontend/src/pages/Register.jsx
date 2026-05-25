import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { registerUser } from '../services/api'
import styles from './AuthPages.module.css'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
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
      const result = await registerUser(formData)
      login(result.token, result.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className={styles.shell}>
      <section className={styles.card}>
        <p className={styles.kicker}>Start here</p>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>Set up your tracker and begin logging expenses in a few seconds.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Name
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Alice" />
          </label>
          <label>
            Email
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="At least 8 characters" />
          </label>

          {error ? <p className={styles.error}>{error}</p> : null}

          <button className={styles.button} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </main>
  )
}
