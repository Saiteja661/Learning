import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ExpenseForm from '../components/ExpenseForm'
import ExpenseList from '../components/ExpenseList'
import ExpenseChart from '../components/ExpenseChart'
import { AuthContext } from '../context/AuthContext'
import {
  createExpense,
  deleteExpense,
  fetchExpenses,
  fetchSummary,
  updateExpense,
} from '../services/api'
import styles from './Dashboard.module.css'

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7)
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { token, user, logout } = useContext(AuthContext)
  const [month, setMonth] = useState(getCurrentMonth())
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState([])
  const [editingExpense, setEditingExpense] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [navigate, token])

  useEffect(() => {
    async function loadData() {
      if (!token) {
        return
      }

      setLoading(true)
      setError('')

      try {
        const [expenseData, summaryData] = await Promise.all([
          fetchExpenses(month),
          fetchSummary(),
        ])
        setExpenses(expenseData)
        setSummary(summaryData)
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [month, token])

  async function refreshData() {
    const [expenseData, summaryData] = await Promise.all([fetchExpenses(month), fetchSummary()])
    setExpenses(expenseData)
    setSummary(summaryData)
  }

  async function handleSubmitExpense(payload) {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, payload)
      } else {
        await createExpense(payload)
      }

      setEditingExpense(null)
      await refreshData()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save expense.')
    }
  }

  async function handleDeleteExpense(id) {
    try {
      await deleteExpense(id)
      await refreshData()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete expense.')
    }
  }

  function handleEditExpense(expense) {
    setEditingExpense(expense)
  }

  function handleCancelEdit() {
    setEditingExpense(null)
  }

  function handleMonthChange(event) {
    setMonth(event.target.value)
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <main className={styles.page}>
      <div className={styles.bgBlobOne} />
      <div className={styles.bgBlobTwo} />

      <div className={styles.container}>
        <Navbar />

        <section className={styles.summaryBar}>
          <div>
            <p className={styles.kicker}>Signed in as</p>
            <h2 className={styles.summaryTitle}>{user?.name || 'User'}</h2>
          </div>

          <div className={styles.summaryControls}>
            <label className={styles.monthPicker}>
              <span>Month</span>
              <input type="month" value={month} onChange={handleMonthChange} />
            </label>
            <button type="button" className={styles.logoutButton} onClick={handleLogout}>Log out</button>
          </div>
        </section>

        {error ? <div className={styles.alert}>{error}</div> : null}

        {loading ? (
          <div className={styles.loading}>Loading your dashboard...</div>
        ) : (
          <div className={styles.grid}>
            <div className={styles.leftColumn}>
              <ExpenseForm
                onSubmit={handleSubmitExpense}
                editingExpense={editingExpense}
                onCancel={handleCancelEdit}
              />
              <ExpenseList
                expenses={expenses}
                onEdit={handleEditExpense}
                onDelete={handleDeleteExpense}
              />
            </div>

            <div className={styles.rightColumn}>
              <ExpenseChart data={summary} />
              <section className={styles.insightCard}>
                <p className={styles.kicker}>Insight</p>
                <h3 className={styles.insightTitle}>Use the month filter to review a specific period.</h3>
                <p className={styles.insightText}>
                  The summary chart updates from your stored expenses and helps you spot categories that need attention.
                </p>
              </section>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
