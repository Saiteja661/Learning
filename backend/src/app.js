const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./routes/auth')
const expensesRoutes = require('./routes/expenses')
const authMiddleware = require('./middleware/auth')

function createApp() {
  const app = express()
  app.use(helmet())
  app.use(cors())
  app.use(express.json())
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))

  app.get('/health', (req, res) => res.json({ status: 'ok' }))
  app.use('/auth', authRoutes)
  app.use('/expenses', authMiddleware, expensesRoutes)

  return app
}

module.exports = createApp
