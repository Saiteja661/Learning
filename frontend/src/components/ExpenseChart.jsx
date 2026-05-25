import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import styles from './ExpenseChart.module.css'

const COLORS = ['#38bdf8', '#f59e0b', '#34d399', '#f472b6', '#a78bfa', '#fb7185']

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export default function ExpenseChart({ data }) {
  return (
    <section className={styles.card}>
      <div className={styles.headingRow}>
        <div>
          <p className={styles.kicker}>Breakdown</p>
          <h2 className={styles.title}>Spending by category</h2>
        </div>
      </div>

      {data.length === 0 ? (
        <div className={styles.emptyState}>Add expenses to see the breakdown chart.</div>
      ) : (
        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data} dataKey="total" nameKey="category" innerRadius={72} outerRadius={110} paddingAngle={3}>
                {data.map((entry, index) => (
                  <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>

          <div className={styles.legend}>
            {data.map((entry, index) => (
              <div key={entry.category} className={styles.legendItem}>
                <span className={styles.swatch} style={{ background: COLORS[index % COLORS.length] }} />
                <span>{entry.category}</span>
                <strong>{formatCurrency(entry.total)}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}