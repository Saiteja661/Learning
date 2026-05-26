# Deployment Runbook

This document lists the steps to deploy the Expense Tracker app to AWS and run the Terraform infra.

Prerequisites
- AWS CLI configured with credentials that have permissions for ECR, ECS, RDS, S3, CloudFront, and Secrets Manager.
- GitHub repository with Actions enabled and required repository secrets set.

1) Terraform (infra)
- cd infra
- terraform init -backend-config=backend.hcl
- terraform plan -var-file=terraform.tfvars
- terraform apply -var-file=terraform.tfvars

Notes:
- Ensure the S3 bucket and DynamoDB table referenced in `infra/backend.hcl` exist before `terraform init`.

2) Build & push backend image (CI will do this)
- Ensure GitHub Secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `ECR_REGISTRY`, `ECR_REPOSITORY`, `ECS_CLUSTER_NAME`, `ECS_SERVICE_NAME`, `API_URL`, `S3_BUCKET`, `CLOUDFRONT_DIST_ID`.
- Push to `main` to trigger `.github/workflows/deploy-backend.yml`.

3) Frontend
- The frontend production bundle is generated to `frontend/dist` by `npm run build`.
- CI workflow `.github/workflows/deploy-frontend.yml` uploads `dist` to S3 and invalidates CloudFront.

4) Local verification
- Backend: `curl http://<backend-host>:3000/health`
- Frontend: visit CloudFront or S3 URL after upload.

Rollback
- For code rollback, push a previous commit tag/branch to `main` to trigger new deployment.
- For infra rollback, use `terraform state` and carefully apply previous configurations. Test in a staging account first.
