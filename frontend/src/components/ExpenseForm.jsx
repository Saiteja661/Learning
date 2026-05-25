import React, { useEffect, useState } from 'react'
import styles from './ExpenseForm.module.css'

const initialState = {
  amount: '',
  category: '',
  description: '',
  date: '',
}

export default function ExpenseForm({ onSubmit, editingExpense, onCancel }) {
  const [formData, setFormData] = useState(initialState)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        amount: editingExpense.amount,
        category: editingExpense.category,
        description: editingExpense.description || '',
        date: editingExpense.date ? String(editingExpense.date).slice(0, 10) : '',
      })
    } else {
      setFormData(initialState)
    }
  }, [editingExpense])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!formData.amount || !formData.category || !formData.date) {
      setError('Amount, category, and date are required.')
      return
    }

    onSubmit({
      amount: Number(formData.amount),
      category: formData.category.trim(),
      description: formData.description.trim(),
      date: formData.date,
    })

    setFormData(initialState)
  }

  return (
    <section className={styles.card}>
      <div className={styles.headingRow}>
        <div>
          <p className={styles.kicker}>{editingExpense ? 'Edit expense' : 'New expense'}</p>
          <h2 className={styles.title}>{editingExpense ? 'Update the selected item' : 'Add a fresh entry'}</h2>
        </div>
        {editingExpense ? (
          <button type="button" className={styles.ghostButton} onClick={onCancel}>Cancel edit</button>
        ) : null}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Amount
          <input name="amount" type="number" step="0.01" min="0" value={formData.amount} onChange={handleChange} placeholder="49.99" />
        </label>
        <label>
          Category
          <input name="category" value={formData.category} onChange={handleChange} placeholder="Food" />
        </label>
        <label className={styles.fullWidth}>
          Description
          <input name="description" value={formData.description} onChange={handleChange} placeholder="Lunch with friends" />
        </label>
        <label>
          Date
          <input name="date" type="date" value={formData.date} onChange={handleChange} />
        </label>

        {error ? <p className={styles.error}>{error}</p> : null}

        <button className={styles.submitButton} type="submit">
          {editingExpense ? 'Save changes' : 'Add expense'}
        </button>
      </form>
    </section>
  )
}