# Expense Tracker — Full Stack Build Spec
# Give this entire file to GitHub Copilot as context.
# Ask it to build one stage at a time using the instructions below.

## Current local workflow

Backend Phase 1 is implemented and testable locally. Run everything from the repo root unless a command says otherwise.

### 1) Install backend dependencies

```bash
cd "F:/Learning Folder/Learning/backend"
npm install
```

### 2) Generate the Prisma client

```bash
cd "F:/Learning Folder/Learning/backend"
npm run prisma:generate
```

### 3) Run the backend tests

```bash
cd "F:/Learning Folder/Learning/backend"
npm test
```

### 4) Start the backend API

```bash
cd "F:/Learning Folder/Learning/backend"
npm start
```

### 4a) Start the backend in debug mode

If you want auto-restart while editing code, use:

```bash
cd "F:/Learning Folder/Learning/backend"
npm run dev
```

This uses `nodemon` and is better while you are actively changing routes or middleware.

When the server is running, check:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{ "status": "ok" }
```

### 5) Run backend and Postgres together with Docker

If you want the backend and database in one go:

```bash
cd "F:/Learning Folder/Learning"
docker compose up --build
```

### 6) What each command does

- `npm install` installs backend dependencies and creates `package-lock.json`.
- `npm run prisma:generate` builds the Prisma client from `backend/src/prisma/schema.prisma`.
- `npm test` runs the backend API tests with Jest and Supertest.
- `npm start` launches the Express server on `PORT` from `.env` or `3000` by default.
- `npm run dev` launches the server with auto-restart through `nodemon`.
- `docker compose up --build` starts PostgreSQL and the backend container locally.

### 7) Common issues

- If `npm start` says it cannot find `package.json`, you are in the wrong folder. Run `cd "F:/Learning Folder/Learning/backend"` first.
- If Prisma complains about `DATABASE_URL`, create `backend/.env` from `backend/.env.example`.
- If port `3000` is busy, change `PORT` in `backend/.env` and restart.

### 8) Current implementation status

- Backend auth routes are implemented: register and login.
- Expense routes are implemented: list, create, update, delete, and category summary.
- Frontend Phase 2 has not started yet.
 
---
 
## Project overview
 
Build a personal expense tracker web application from scratch and deploy it on AWS.
The app lets a user register, log in, add/edit/delete expenses, view spending by category,
and see a monthly chart. This is a learning project — every layer of the stack is used
intentionally so the developer understands each piece.
 
---
 
## Tech stack (exact versions)
 
### Frontend
- React 18 (scaffolded with Vite)
- React Router v6 (client-side routing)
- Recharts (spending charts)
- Axios (HTTP client)
- CSS Modules (scoped styles, no Tailwind)
### Backend
- Node.js 20 LTS
- Express 4
- Prisma ORM (PostgreSQL adapter)
- JSON Web Tokens (jsonwebtoken) for auth
- bcryptjs for password hashing
- dotenv for environment variables
- cors, helmet, express-rate-limit (security middleware)
### Database
- PostgreSQL 15
### Infrastructure (AWS — free tier maximised)
- S3 — static frontend hosting
- CloudFront — CDN for frontend, proxy for /api/* to ALB
- API Gateway — HTTP API routing to ALB
- ECS Fargate — runs the backend Docker container
- ECR — stores the Docker image
- RDS PostgreSQL t3.micro — managed database
- Secrets Manager — stores DB credentials
- CloudWatch — logs and alarms
- VPC — private network with public + private subnets
- ALB — Application Load Balancer in front of ECS
### Infrastructure as Code
- Terraform (all AWS resources defined as code)
### CI/CD
- GitHub Actions (test → build → deploy on every push to main)
---
 
## Folder structure
 
```
expense-tracker/
├── frontend/                  # React app (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── components/
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── ExpenseList.jsx
│   │   │   ├── ExpenseChart.jsx
│   │   │   └── Navbar.jsx
│   │   ├── services/
│   │   │   └── api.js          # all axios calls in one place
│   │   ├── context/
│   │   │   └── AuthContext.jsx # JWT token stored in context + localStorage
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── backend/                   # Node.js Express API
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js         # POST /auth/register, POST /auth/login
│   │   │   └── expenses.js     # GET/POST/PUT/DELETE /expenses
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT verification middleware
│   │   ├── prisma/
│   │   │   └── schema.prisma   # DB schema
│   │   └── index.js            # Express app entry point
│   ├── .env.example
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
│
├── infra/                     # Terraform
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── vpc.tf
│   ├── ecs.tf
│   ├── rds.tf
│   ├── s3_cloudfront.tf
│   └── terraform.tfvars.example
│
└── .github/
    └── workflows/
        ├── ci.yml              # run tests on every push/PR
        ├── deploy-backend.yml  # build Docker → push ECR → update ECS
        └── deploy-frontend.yml # build React → sync S3 → invalidate CloudFront
```
 
---
 
## Database schema (Prisma)
 
```prisma
// backend/src/prisma/schema.prisma
 
generator client {
  provider = "prisma-client-js"
}
 
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
 
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String
  name      String
  createdAt DateTime  @default(now())
  expenses  Expense[]
}
 
model Expense {
  id          String   @id @default(uuid())
  amount      Float
  category    String
  description String?
  date        DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```
 
---
 
## Backend API contract
 
All routes except /auth/* require Authorization: Bearer <token> header.
 
### Auth routes
 
POST /auth/register
Body:    { "email": "user@example.com", "password": "secret123", "name": "Alice" }
Returns: { "token": "<jwt>", "user": { "id", "email", "name" } }
 
POST /auth/login
Body:    { "email": "user@example.com", "password": "secret123" }
Returns: { "token": "<jwt>", "user": { "id", "email", "name" } }
 
### Expense routes (all require JWT)
 
GET /expenses
Query params: ?month=2025-05 (optional filter by month)
Returns: [ { id, amount, category, description, date, createdAt } ]
 
POST /expenses
Body:    { "amount": 49.99, "category": "Food", "description": "Lunch", "date": "2025-05-24" }
Returns: { id, amount, category, description, date, createdAt }
 
PUT /expenses/:id
Body:    { "amount": 55.00, "category": "Food" }
Returns: updated expense object
 
DELETE /expenses/:id
Returns: { "message": "Deleted" }
 
GET /expenses/summary
Returns: [ { "category": "Food", "total": 320.50 }, ... ]  — used for the chart
 
---
 
## Environment variables
 
### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/expensedb
JWT_SECRET=your_super_secret_key_min_32_chars
PORT=3000
NODE_ENV=development
```
 
### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```
 
---
 
## Docker — backend Dockerfile
 
```dockerfile
# backend/Dockerfile
 
# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
 
# Stage 2: production
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src/prisma ./prisma
EXPOSE 3000
CMD ["node", "src/index.js"]
```
 
```
# backend/.dockerignore
node_modules
.env
.git
*.md
```
 
---
 
## docker-compose.yml (local development)
 
```yaml
version: "3.9"
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: expensedb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
 
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://user:password@db:5432/expensedb
      JWT_SECRET: local_dev_secret_change_in_production
      PORT: 3000
      NODE_ENV: development
    depends_on:
      - db
 
volumes:
  pgdata:
```
 
---
 
## Terraform — AWS infrastructure
 
### Variables (infra/variables.tf)
```hcl
variable "aws_region"       { default = "ap-south-1" }
variable "project_name"     { default = "expense-tracker" }
variable "db_username"      { default = "expenseuser" }
variable "db_password"      { sensitive = true }
variable "ecr_image_url"    { description = "Full ECR image URI including tag" }
```
 
### VPC (infra/vpc.tf)
```hcl
# Create VPC with CIDR 10.0.0.0/16
# Create 2 public subnets: 10.0.1.0/24 (AZ-a), 10.0.2.0/24 (AZ-b)
# Create 2 private subnets: 10.0.3.0/24 (AZ-a), 10.0.4.0/24 (AZ-b)
# Create Internet Gateway attached to VPC
# Create route table for public subnets pointing 0.0.0.0/0 to IGW
# Security groups:
#   alb_sg:  ingress 80,443 from 0.0.0.0/0 | egress all
#   ecs_sg:  ingress 3000 from alb_sg only  | egress all
#   rds_sg:  ingress 5432 from ecs_sg only  | no public access
```
 
### ECS + ALB (infra/ecs.tf)
```hcl
# ECS Cluster: aws_ecs_cluster named "${project_name}"
# Task definition:
#   - family: "${project_name}-backend"
#   - requires_compatibilities: ["FARGATE"]
#   - cpu: "256"   memory: "512"
#   - network_mode: "awsvpc"
#   - Container: name=backend, image=var.ecr_image_url, port=3000
#   - Environment vars: DATABASE_URL (from Secrets Manager), JWT_SECRET, NODE_ENV=production
#   - Log driver: awslogs → CloudWatch log group /ecs/${project_name}
# ECS Service:
#   - launch_type: FARGATE
#   - desired_count: 1
#   - subnets: private subnets
#   - security_groups: ecs_sg
#   - load_balancer: target_group_arn from ALB
# ALB:
#   - internal: false
#   - subnets: public subnets
#   - security_groups: alb_sg
#   - Listener on port 80 → forward to ECS target group
#   - Target group: port 3000, protocol HTTP, health_check path=/health
```
 
### RDS (infra/rds.tf)
```hcl
# aws_db_subnet_group: uses both private subnets
# aws_db_instance:
#   - engine: postgres  engine_version: "15"
#   - instance_class: db.t3.micro
#   - allocated_storage: 20
#   - db_name: expensedb
#   - username: var.db_username
#   - password: var.db_password  (stored in Secrets Manager)
#   - publicly_accessible: false
#   - skip_final_snapshot: true  (for learning — set false in real prod)
#   - vpc_security_group_ids: [rds_sg]
#   - db_subnet_group_name: the subnet group above
# aws_secretsmanager_secret: stores DATABASE_URL string
```
 
### S3 + CloudFront (infra/s3_cloudfront.tf)
```hcl
# S3 bucket:
#   - bucket name: "${project_name}-frontend-${random_id}"
#   - block all public access: true
#   - website configuration: index_document=index.html, error_document=index.html
# CloudFront distribution:
#   - Origin 1 (S3): use Origin Access Control (OAC), not OAI
#   - Origin 2 (ALB): domain = ALB DNS name, path_pattern = /api/*
#   - Default cache behavior: origin = S3, compress = true
#   - Ordered cache behavior: path_pattern=/api/*, origin=ALB, cache disabled
#   - Price class: PriceClass_100 (US + EU + Asia — cheapest)
#   - Default root object: index.html
# S3 bucket policy: allow CloudFront OAC to GetObject
```
 
---
 
## GitHub Actions workflows
 
### CI — test on every push (.github/workflows/ci.yml)
```yaml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: cd backend && npm ci
      - run: cd backend && npm test
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: cd frontend && npm ci
      - run: cd frontend && npm run build
```
 
### Deploy backend (.github/workflows/deploy-backend.yml)
```yaml
name: Deploy backend
on:
  push:
    branches: [main]
    paths: ['backend/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1
      - uses: aws-actions/amazon-ecr-login@v2
      - name: Build and push Docker image
        run: |
          IMAGE_URI=${{ secrets.ECR_REGISTRY }}/expense-tracker:${{ github.sha }}
          docker build -t $IMAGE_URI ./backend
          docker push $IMAGE_URI
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster expense-tracker \
            --service expense-tracker-backend \
            --force-new-deployment \
            --region ap-south-1
```
 
### Deploy frontend (.github/workflows/deploy-frontend.yml)
```yaml
name: Deploy frontend
on:
  push:
    branches: [main]
    paths: ['frontend/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1
      - name: Build React app
        run: |
          cd frontend
          npm ci
          VITE_API_URL=${{ secrets.API_URL }} npm run build
      - name: Upload to S3
        run: aws s3 sync frontend/dist/ s3://${{ secrets.S3_BUCKET }} --delete
      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DIST_ID }} \
            --paths "/*"
```
 
---
 
## GitHub Secrets to set up
 
In your GitHub repo → Settings → Secrets → Actions, add these:
 
| Secret name           | Value                                      |
|-----------------------|--------------------------------------------|
| AWS_ACCESS_KEY_ID     | IAM user access key (CI/CD permissions)    |
| AWS_SECRET_ACCESS_KEY | IAM user secret key                        |
| ECR_REGISTRY          | 123456789.dkr.ecr.ap-south-1.amazonaws.com |
| S3_BUCKET             | expense-tracker-frontend-xxxx              |
| CLOUDFRONT_DIST_ID    | EXXXXXXXXXX (from terraform output)        |
| API_URL               | https://your-cloudfront-url.net            |
 
---
 
## CloudWatch monitoring
 
Create these after deployment:
 
1. Log group: /ecs/expense-tracker (auto-created by ECS)
2. Alarm: ECS task count < 1 → SNS email alert
3. Alarm: CPU > 80% for 5 minutes → SNS email alert
4. Billing alarm: EstimatedCharges > $25 → SNS email alert
---
 
## Build order — tell Copilot to follow this sequence exactly
 
Stage 1:  Set up the repo folder structure as shown above
Stage 2:  Build the React frontend (all pages + components + API service layer)
Stage 3:  Build the Node.js Express backend (all routes + JWT middleware + Prisma schema)
Stage 4:  Write docker-compose.yml and test local full-stack connection
Stage 5:  Write the backend Dockerfile (multi-stage)
Stage 6:  Write all Terraform files (vpc.tf → rds.tf → ecs.tf → s3_cloudfront.tf)
Stage 7:  Write the three GitHub Actions workflow files
Stage 8:  Write a README.md with deployment instructions
 
Do NOT skip stages. Do NOT combine stages into one output.
After each stage, confirm the files are correct before moving to the next.
 
---
 
## Copilot instructions
 
When I say "build stage N", generate ONLY the files for that stage.
Use the exact file paths shown in the folder structure.
Follow the API contract exactly — do not invent new routes or change field names.
Use the exact Prisma schema defined above — do not modify it.
All backend routes must be protected by the JWT middleware except /auth/register and /auth/login.
Frontend must read VITE_API_URL from environment — never hardcode URLs.
Terraform must use variables — never hardcode account IDs, passwords, or region strings.
Every secret must come from environment variables or AWS Secrets Manager — never in source code.
 