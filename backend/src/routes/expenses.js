const express = require('express')
const router = express.Router()
const prisma = require('../prismaClient')

// All routes expect auth middleware to have set req.user

router.get('/', async (req, res) => {
  try {
    const userId = req.user && req.user.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })
    const { month } = req.query
    let where = { userId }
    if (month) {
      // month format YYYY-MM
      const [y, m] = month.split('-').map(Number)
      const start = new Date(y, m - 1, 1)
      const end = new Date(y, m, 1)
      where.date = { gte: start, lt: end }
    }
    const expenses = await prisma.expense.findMany({ where, orderBy: { date: 'desc' } })
    return res.json(expenses)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

router.post('/', async (req, res) => {
  try {
    const userId = req.user && req.user.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })
    const { amount, category, description, date } = req.body
    if (amount == null || !category || !date) return res.status(400).json({ message: 'Missing fields' })
    const exp = await prisma.expense.create({ data: { amount: Number(amount), category, description, date: new Date(date), userId } })
    return res.status(201).json(exp)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

router.get('/summary', async (req, res) => {
  try {
    const userId = req.user && req.user.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })
    const grouped = await prisma.expense.groupBy({
      by: ['category'],
      where: { userId },
      _sum: { amount: true }
    })
    const result = grouped.map(g => ({ category: g.category, total: g._sum.amount || 0 }))
    return res.json(result)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const userId = req.user && req.user.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })
    const { id } = req.params
    const existing = await prisma.expense.findUnique({ where: { id } })
    if (!existing || existing.userId !== userId) return res.status(404).json({ message: 'Not found' })
    const data = {}
    const { amount, category, description, date } = req.body
    if (amount != null) data.amount = Number(amount)
    if (category) data.category = category
    if (description !== undefined) data.description = description
    if (date) data.date = new Date(date)
    const updated = await prisma.expense.update({ where: { id }, data })
    return res.json(updated)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user && req.user.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })
    const { id } = req.params
    const existing = await prisma.expense.findUnique({ where: { id } })
    if (!existing || existing.userId !== userId) return res.status(404).json({ message: 'Not found' })
    await prisma.expense.delete({ where: { id } })
    return res.json({ message: 'Deleted' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
