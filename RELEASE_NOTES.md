# Release Notes (draft)

Version: v0.1.0
Date: 2026-05-26

Highlights
- Backend: Node.js API with Prisma migrations, JWT auth, expense CRUD.
- Frontend: React (Vite) SPA with register/login and dashboard; production build in `frontend/dist`.
- Infra: Terraform scaffold for VPC, ECS Fargate, RDS Postgres, S3 + CloudFront for frontend, remote state (S3 + DynamoDB).
- CI/CD: GitHub Actions for tests, backend image build → ECR → ECS deploy, frontend build → S3 → CloudFront.

How to deploy
- See DEPLOYMENT.md for step-by-step instructions and required GitHub secrets.

Notes
- Sensitive files are ignored (`infra/backend.hcl`, `infra/terraform.tfvars`, `.env`).
- User must create the S3 bucket and DynamoDB lock table referenced by the Terraform backend before init.
