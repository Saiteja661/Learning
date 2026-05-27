# Expense Tracker

A full-stack expense tracker built with React, Node.js, Prisma, PostgreSQL, Docker, Terraform, and GitHub Actions. The app lets users register, log in, manage expenses, and view spending summaries by category.

## What This Project Does

- User authentication with JWT-based login and registration.
- Expense management with create, read, update, and delete operations.
- Category summary for quick spending insights.
- React dashboard for tracking expenses in the browser.
- PostgreSQL-backed persistence with Prisma ORM.
- Dockerized backend for repeatable local and production runs.
- AWS infrastructure defined with Terraform.
- CI/CD workflows for testing and deployment.

## Tech Stack

- Frontend: React 18, Vite, React Router, Axios, Recharts
- Backend: Node.js 20, Express, Prisma, bcryptjs, jsonwebtoken
- Database: PostgreSQL
- Infrastructure: Terraform, AWS ECS, RDS, ECR, S3, CloudFront, Secrets Manager
- Automation: GitHub Actions

## Project Structure

```text
Learning/
├── frontend/        # React app
├── backend/         # Express API + Prisma
├── infra/           # Terraform infrastructure
├── docker-compose.yml
└── .github/workflows/
```

## Features

- Register and log in securely
- Add, edit, and delete expenses
- View monthly and category-based summaries
- Persist data in PostgreSQL
- Deploy backend in Docker
- Serve frontend through S3 and CloudFront

## Local Development

### 1. Clone and install dependencies

```bash
cd "F:/Learning Folder/Learning/backend"
npm install

cd "F:/Learning Folder/Learning/frontend"
npm install
```

### 2. Configure environment variables

Create `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/expensedb
JWT_SECRET=your_super_secret_key_min_32_chars
PORT=3000
NODE_ENV=development
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

### 3. Run the backend

```bash
cd "F:/Learning Folder/Learning/backend"
npm run prisma:generate
npm test
npm start
```

### 4. Run the frontend

```bash
cd "F:/Learning Folder/Learning/frontend"
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## Docker Local Run

You can start PostgreSQL and the backend with Docker Compose:

```bash
cd "F:/Learning Folder/Learning"
docker compose up --build
```

Backend health check:

```bash
curl http://localhost:3000/health
```

## Tests

Backend tests:

```bash
cd "F:/Learning Folder/Learning/backend"
npm test
```

Frontend production build:

```bash
cd "F:/Learning Folder/Learning/frontend"
npm run build
```

## Deployment

Infrastructure is defined in `infra/` with Terraform.

Typical deploy flow:

```bash
cd "F:/Learning Folder/Learning/infra"
terraform init -backend-config=backend.hcl
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```

The deployment uses:

- ECS Fargate for the backend
- RDS PostgreSQL for the database
- ECR for the backend Docker image
- S3 + CloudFront for the frontend
- Secrets Manager for database connection secrets

## CI/CD

GitHub Actions workflows are included for:

- Backend tests
- Frontend build
- Backend image deploy
- Frontend static deploy

## Environment Variables

### Backend

- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`
- `NODE_ENV`

### Frontend

- `VITE_API_URL`

## Notes

- Do not commit `.env`, `infra/backend.hcl`, or `infra/terraform.tfvars`.
- Use the Terraform example files as templates when setting up a new environment.
- The project was built as a learning exercise, so the codebase is intentionally simple and easy to follow.

## License

No license has been added yet.
