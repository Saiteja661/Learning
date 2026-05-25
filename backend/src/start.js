require('dotenv').config()

const { execSync } = require('child_process')
const createApp = require('./app')

function applyMigrations() {
  execSync('npx prisma migrate deploy --schema=src/prisma/schema.prisma', {
    stdio: 'inherit',
  })
}

async function main() {
  applyMigrations()

  const app = createApp()
  const port = process.env.PORT || 3000

  app.listen(port, () => console.log(`Server listening on ${port}`))
}

main().catch((error) => {
  console.error('Failed to start backend:', error)
  process.exit(1)
})