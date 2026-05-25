const request = require('supertest')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

jest.mock('../src/prismaClient', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  expense: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    groupBy: jest.fn(),
  },
}))

const prisma = require('../src/prismaClient')
const app = require('../src/index')

const testUser = { id: 'user-1', email: 'alice@example.com', name: 'Alice' }
const authToken = jwt.sign(testUser, 'test_secret', { expiresIn: '7d' })

describe('expense tracker backend', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test_secret'
    jest.clearAllMocks()
  })

  it('returns health status', async () => {
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: 'ok' })
  })

  it('registers a user and returns token + user payload', async () => {
    prisma.user.findUnique.mockResolvedValue(null)
    prisma.user.create.mockImplementation(async ({ data }) => ({
      id: 'user-1',
      email: data.email,
      name: data.name,
      password: data.password,
    }))

    const response = await request(app)
      .post('/auth/register')
      .send({ email: 'alice@example.com', password: 'secret123', name: 'Alice' })

    expect(response.status).toBe(200)
    expect(response.body.user).toEqual(testUser)
    expect(response.body.token).toBeTruthy()
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'alice@example.com',
          name: 'Alice',
        }),
      })
    )
    expect(response.body.user.email).toBe('alice@example.com')
  })

  it('rejects duplicate user registration', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'existing' })

    const response = await request(app)
      .post('/auth/register')
      .send({ email: 'alice@example.com', password: 'secret123', name: 'Alice' })

    expect(response.status).toBe(409)
    expect(response.body.message).toBe('User already exists')
  })

  it('logs in an existing user with valid credentials', async () => {
    const password = 'secret123'
    const hashedPassword = await bcrypt.hash(password, 10)
    prisma.user.findUnique.mockResolvedValue({ ...testUser, password: hashedPassword })

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@example.com', password })

    expect(response.status).toBe(200)
    expect(response.body.user).toEqual(testUser)
    expect(response.body.token).toBeTruthy()
  })

  it('lists expenses for the authenticated user', async () => {
    prisma.expense.findMany.mockResolvedValue([
      {
        id: 'exp-1',
        amount: 49.99,
        category: 'Food',
        description: 'Lunch',
        date: new Date('2025-05-24'),
        createdAt: new Date('2025-05-24T10:00:00Z'),
      },
    ])

    const response = await request(app)
      .get('/expenses')
      .set('Authorization', `Bearer ${authToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(1)
    expect(prisma.expense.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: testUser.id },
      })
    )
  })

  it('creates an expense for the authenticated user', async () => {
    prisma.expense.create.mockResolvedValue({
      id: 'exp-2',
      amount: 12.5,
      category: 'Transport',
      description: 'Metro',
      date: new Date('2025-05-24'),
      createdAt: new Date('2025-05-24T10:00:00Z'),
      userId: testUser.id,
    })

    const response = await request(app)
      .post('/expenses')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ amount: 12.5, category: 'Transport', description: 'Metro', date: '2025-05-24' })

    expect(response.status).toBe(201)
    expect(response.body.category).toBe('Transport')
    expect(prisma.expense.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: testUser.id,
          amount: 12.5,
          category: 'Transport',
        }),
      })
    )
  })

  it('returns category summary for the authenticated user', async () => {
    prisma.expense.groupBy.mockResolvedValue([
      { category: 'Food', _sum: { amount: 150.5 } },
      { category: 'Travel', _sum: { amount: 75 } },
    ])

    const response = await request(app)
      .get('/expenses/summary')
      .set('Authorization', `Bearer ${authToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual([
      { category: 'Food', total: 150.5 },
      { category: 'Travel', total: 75 },
    ])
  })
})
