import React from 'react'
import styles from './ExpenseList.module.css'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount)
}

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  return (
    <section className={styles.card}>
      <div className={styles.headingRow}>
        <div>
          <p className={styles.kicker}>Recent activity</p>
          <h2 className={styles.title}>Expenses</h2>
        </div>
        <span className={styles.count}>{expenses.length} items</span>
      </div>

      {expenses.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No expenses yet. Add your first one above.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {expenses.map((expense) => (
            <article key={expense.id} className={styles.row}>
              <div>
                <p className={styles.category}>{expense.category}</p>
                <h3 className={styles.amount}>{formatCurrency(expense.amount)}</h3>
                <p className={styles.meta}>
                  {expense.description || 'No description'} · {formatDate(expense.date)}
                </p>
              </div>

              <div className={styles.actions}>
                <button type="button" onClick={() => onEdit(expense)}>Edit</button>
                <button type="button" className={styles.deleteButton} onClick={() => onDelete(expense.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}